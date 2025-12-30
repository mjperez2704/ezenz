import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { data: adminUser, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", userId)
      .eq("is_active", true)
      .single()

    if (error || !adminUser) {
      return NextResponse.json({ exists: false, error: error?.message }, { status: 404 })
    }

    // Actualizar last_login
    await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", userId)

    return NextResponse.json({ exists: true, adminUser })
  } catch (error) {
    console.error("Error in verify-login:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
