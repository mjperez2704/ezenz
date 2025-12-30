import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Si no hay credenciales de Supabase, continuar sin autenticación
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase credentials not found in middleware, skipping auth checks")
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (error) {
    console.error("[v0] Error getting user from Supabase:", error)
    return supabaseResponse
  }

  if (request.nextUrl.pathname === "/admin/setup") {
    return supabaseResponse
  }

  if (request.nextUrl.pathname === "/admin/login") {
    if (user) {
      // Already logged in - redirect to admin dashboard
      const url = request.nextUrl.clone()
      url.pathname = "/admin"
      return NextResponse.redirect(url)
    }
    // Not logged in - allow access to login page
    return supabaseResponse
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      // Not authenticated - redirect to admin login
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }

    // Check if user is an admin
    try {
      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("*")
        .eq("id", user.id)
        .eq("is_active", true)
        .single()

      if (!adminUser) {
        // User is not an admin - redirect to homepage
        const url = request.nextUrl.clone()
        url.pathname = "/"
        return NextResponse.redirect(url)
      }

      // Update last login
      await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", user.id)
    } catch (error) {
      console.error("[v0] Error checking admin status:", error)
    }
  }

  return supabaseResponse
}
