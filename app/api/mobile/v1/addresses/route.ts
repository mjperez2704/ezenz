import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 })
    }

    // Obtener direcciones guardadas del usuario desde sus pedidos
    const { data: orders, error } = await supabase
      .from("orders")
      .select("shipping_address")
      .eq("customer_email", user.email!)
      .order("created_at", { ascending: false })

    if (error) throw error

    // Extraer direcciones únicas
    const uniqueAddresses = new Map()
    orders?.forEach((order: any) => {
      const addr = order.shipping_address
      const key = `${addr.address}-${addr.city}-${addr.state}-${addr.zip}`
      if (!uniqueAddresses.has(key)) {
        uniqueAddresses.set(key, {
          id: key,
          ...addr,
        })
      }
    })

    return NextResponse.json({
      success: true,
      data: Array.from(uniqueAddresses.values()),
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Error al obtener direcciones" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 })
    }

    const address = await request.json()

    // Validar datos requeridos
    if (!address.address || !address.city || !address.state || !address.zip) {
      return NextResponse.json({ success: false, error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Actualizar el perfil del cliente con la nueva dirección
    const { error } = await supabase
      .from("customers")
      .upsert({
        email: user.email!,
        address: address.address,
        city: address.city,
        state: address.state,
        zip_code: address.zip,
      }, {
        onConflict: 'email'
      })

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: "Dirección guardada exitosamente",
      data: address,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Error al guardar dirección" }, { status: 500 })
  }
}
