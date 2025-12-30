import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error("[v0] Error de autenticación:", authError)
      return NextResponse.json(
        {
          error:
            authError.message === "Invalid login credentials" ? "Email o contraseña incorrectos" : authError.message,
        },
        { status: 401 },
      )
    }

    if (!authData.user) {
      return NextResponse.json({ error: "No se pudo autenticar" }, { status: 401 })
    }

    const { data: adminData, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", authData.user.id)
      .eq("is_active", true)
      .single()

    if (adminError || !adminData) {
      // Si no es admin, cerrar sesión
      await supabase.auth.signOut()
      return NextResponse.json(
        { error: "No tienes permisos de administrador o tu cuenta está inactiva" },
        { status: 403 },
      )
    }

    await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", authData.user.id)

    return NextResponse.json({
      success: true,
      user: {
        id: adminData.id,
        email: adminData.email,
        fullName: adminData.full_name,
        role: adminData.role,
      },
    })
  } catch (error) {
    console.error("[v0] Error en login:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
