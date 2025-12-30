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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Obtener todos los pedidos del usuario
    let orders = await db.getOrdersByEmail(user.email!)

    // Filtrar por estado si se especifica
    if (status) {
      orders = orders.filter((order) => order.status === status)
    }

    // Paginar
    const total = orders.length
    const paginatedOrders = orders.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedOrders,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Error al obtener historial" }, { status: 500 })
  }
}
