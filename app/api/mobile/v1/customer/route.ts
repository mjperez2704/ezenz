import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 })
    }

    // Obtener información completa del cliente
    const customer = await db.getCustomerByEmail(user.email!)
    const orders = await db.getOrdersByEmail(user.email!)

    // Obtener direcciones únicas
    const addressesMap = new Map()
    orders.forEach((order) => {
      const addr = order.shippingAddress
      const key = `${addr.address}-${addr.city}`
      if (!addressesMap.has(key)) {
        addressesMap.set(key, addr)
      }
    })

    // Obtener métodos de pago únicos
    const paymentMethodsMap = new Map()
    orders.forEach((order) => {
      const pm = order.paymentMethod
      const key = `${pm.brand}-${pm.last4}`
      if (!paymentMethodsMap.has(key) && pm.last4 !== "0000") {
        paymentMethodsMap.set(key, pm)
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: customer?.id || user.id,
        email: user.email!,
        firstName: customer?.first_name || "",
        lastName: customer?.last_name || "",
        phone: customer?.phone || "",
        address: customer?.address || "",
        city: customer?.city || "",
        state: customer?.state || "",
        zipCode: customer?.zip_code || "",
        totalOrders: customer?.total_orders || orders.length,
        totalSpent: customer?.total_spent || orders.reduce((sum, o) => sum + o.total, 0),
        createdAt: customer?.created_at || user.created_at,
        savedAddresses: Array.from(addressesMap.values()),
        paymentMethods: Array.from(paymentMethodsMap.values()),
        recentOrders: orders.slice(0, 5),
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Error al obtener información del cliente" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 })
    }

    const updates = await request.json()

    // Actualizar información del cliente
    const { error } = await supabase
      .from("customers")
      .upsert({
        email: user.email!,
        first_name: updates.firstName,
        last_name: updates.lastName,
        phone: updates.phone,
        address: updates.address,
        city: updates.city,
        state: updates.state,
        zip_code: updates.zipCode,
      }, {
        onConflict: 'email'
      })

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: "Información actualizada exitosamente",
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Error al actualizar información" }, { status: 500 })
  }
}
