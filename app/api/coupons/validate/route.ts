import { type NextRequest, NextResponse } from "next/server"
import { CouponService } from "@/lib/coupon-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, cartTotal, userId, productIds } = body

    if (!code || cartTotal === undefined) {
      return NextResponse.json({ error: "Code and cartTotal required" }, { status: 400 })
    }

    const result = await CouponService.validateCoupon(code, cartTotal, userId, productIds || [])

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in validate coupon API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
