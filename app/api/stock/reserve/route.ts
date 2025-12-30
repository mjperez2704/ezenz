import { type NextRequest, NextResponse } from "next/server"
import { StockService } from "@/lib/stock-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, quantity, sessionId } = body

    if (!productId || !quantity || !sessionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await StockService.reserveStock(productId, quantity, sessionId)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      reservationId: result.reservationId,
    })
  } catch (error) {
    console.error("Error in reserve stock API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
