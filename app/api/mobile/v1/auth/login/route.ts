import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({
      message: "Login exitoso",
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.user_metadata.first_name,
        lastName: data.user.user_metadata.last_name,
        phone: data.user.user_metadata.phone,
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error en el login" }, { status: 500 })
  }
}
