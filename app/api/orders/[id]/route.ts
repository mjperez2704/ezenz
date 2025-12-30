import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    console.log("[v0] Obteniendo orden:", params.id)

    // Buscar orden por orderId (no por id UUID)
    const { data: order, error } = await supabase.from("orders").select("*").eq("order_id", params.id).single()

    if (error) {
      console.error("[v0] Error obteniendo orden:", error)
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 })
    }

    console.log("[v0] Orden encontrada:", order)

    return NextResponse.json({
      success: true,
      order: {
        orderId: order.order_id,
        customerInfo: order.customer_info,
        shippingAddress: order.shipping_address,
        items: order.items,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        status: order.status,
        paymentMethod: order.payment_method,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
      },
    })
  } catch (error) {
    console.error("[v0] Error en GET orden:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
