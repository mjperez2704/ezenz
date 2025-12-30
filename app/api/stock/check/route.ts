import { type NextRequest, NextResponse } from "next/server"
import { StockService } from "@/lib/stock-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items } = body

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Items array required" }, { status: 400 })
    }

    const result = await StockService.checkMultipleProductsAvailability(items)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in check stock API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
