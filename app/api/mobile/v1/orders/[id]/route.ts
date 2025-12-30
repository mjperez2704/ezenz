import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await db.getOrder(params.id)

    if (!order) {
      return NextResponse.json({ success: false, error: "Pedido no encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: order,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Error al obtener pedido" }, { status: 500 })
  }
}
