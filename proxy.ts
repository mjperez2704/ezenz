import { updateSession } from "@/lib/supabase/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const userAgent = request.headers.get("user-agent") || ""
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)

  // Rutas que no deben ser redirigidas
  const isAdminRoute = pathname.startsWith("/admin")
  const isApiRoute = pathname.startsWith("/api")
  const isMobileRoute = pathname.startsWith("/mobile")
  const isStaticFile = pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|css|js)$/)

  let mobileRedirectEnabled = false

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {},
        },
      })

      const { data, error } = await supabase.from("site_settings").select("value").eq("key", "general").single()

      if (error) {
        console.log("[v0] Error fetching mobile redirect setting:", error.message)
      } else if (data?.value) {
        mobileRedirectEnabled = data.value.mobileRedirectEnabled === true
        console.log("[v0] Mobile redirect enabled:", mobileRedirectEnabled)
      } else {
        console.log("[v0] No general settings found, using default (false)")
      }
    } catch (error) {
      console.error("[v0] Exception fetching mobile redirect setting:", error)
    }
  } else {
    console.log("[v0] Supabase credentials not configured, mobile redirect disabled")
  }

  console.log("[v0] Request:", {
    pathname,
    isMobile,
    mobileRedirectEnabled,
    isAdminRoute,
    isApiRoute,
    isMobileRoute,
  })

  if (mobileRedirectEnabled === true && isMobile && !isMobileRoute && !isAdminRoute && !isApiRoute && !isStaticFile) {
    console.log("[v0] Redirecting to mobile version")
    const url = request.nextUrl.clone()
    url.pathname = `/mobile${pathname === "/" ? "" : pathname}`
    return NextResponse.redirect(url)
  }

  // Si NO es móvil y está en ruta móvil, redirigir a versión escritorio
  if (!isMobile && isMobileRoute && !isApiRoute) {
    console.log("[v0] Redirecting desktop to main version")
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace("/mobile", "") || "/"
    return NextResponse.redirect(url)
  }

  // Actualizar sesión de Supabase
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
