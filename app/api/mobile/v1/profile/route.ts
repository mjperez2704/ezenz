import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 })
    }

    const customer = await db.getCustomerByEmail(user.email!)

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.user_metadata.first_name,
        lastName: user.user_metadata.last_name,
        phone: user.user_metadata.phone,
        totalOrders: customer?.total_orders || 0,
        totalSpent: customer?.total_spent || 0,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Error al obtener perfil" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 })
    }

    const { firstName, lastName, phone, address, city, state, zip_code } = await request.json()

    // Actualizar metadata del usuario
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        first_name: firstName,
        last_name: lastName,
        phone,
      },
    })

    if (updateError) {
      return NextResponse.json({ success: false, error: updateError.message }, { status: 400 })
    }

    // Actualizar datos del cliente
    await db.createOrUpdateCustomer({
      email: user.email!,
      first_name: firstName,
      last_name: lastName,
      phone,
      address,
      city,
      state,
      zip_code,
      total_orders: 0,
      total_spent: 0,
    })

    return NextResponse.json({
      success: true,
      message: "Perfil actualizado exitosamente",
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Error al actualizar perfil" }, { status: 500 })
  }
}
