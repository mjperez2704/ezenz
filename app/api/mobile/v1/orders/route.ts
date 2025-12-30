import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { createClient } from "@/lib/supabase/server"
import type { Order } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    // Validar datos requeridos
    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json({ success: false, error: "El pedido debe tener al menos un producto" }, { status: 400 })
    }

    if (!orderData.customerInfo || !orderData.shippingAddress) {
      return NextResponse.json(
        { success: false, error: "Información del cliente y dirección requeridas" },
        { status: 400 },
      )
    }

    // Crear el pedido
    const order: Order = {
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: orderData.userId || null,
      customerInfo: orderData.customerInfo,
      shippingAddress: orderData.shippingAddress,
      items: orderData.items,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping || 0,
      tax: orderData.tax || 0,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod || { brand: "Efectivo", last4: "0000" },
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await db.saveOrder(order)

    // Actualizar estadísticas del cliente
    await db.updateCustomerStats(orderData.customerInfo.email, orderData.total)

    return NextResponse.json({
      success: true,
      data: order,
      message: "Pedido creado exitosamente",
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Error al crear pedido" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 })
    }

    const orders = await db.getOrdersByEmail(user.email!)

    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Error al obtener pedidos" }, { status: 500 })
  }
}
