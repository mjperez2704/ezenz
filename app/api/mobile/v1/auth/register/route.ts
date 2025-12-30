import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone } = await request.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 })
    }

    const supabase = await createClient()

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone || "",
        },
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Crear perfil de cliente
    if (authData.user) {
      await db.createOrUpdateCustomer({
        email,
        first_name: firstName,
        last_name: lastName,
        phone: phone || "",
        total_orders: 0,
        total_spent: 0,
      })
    }

    return NextResponse.json({
      message: "Usuario registrado exitosamente",
      user: {
        id: authData.user?.id,
        email: authData.user?.email,
        firstName,
        lastName,
        phone,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al registrar usuario" }, { status: 500 })
  }
}
