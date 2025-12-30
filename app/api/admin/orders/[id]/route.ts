import { NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const success = await db.updateOrderStatus(params.id, body.status)

    if (!success) {
      return NextResponse.json({ error: "Error updating order" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
