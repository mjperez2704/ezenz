import { NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const product = await db.createProduct(body)

    if (!product) {
      return NextResponse.json({ error: "Error creating product" }, { status: 500 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
