import { NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const success = await db.deleteReview(params.id)

    if (!success) {
      return NextResponse.json({ error: "Error deleting review" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
