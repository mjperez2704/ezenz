import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log("[v0] PUT /api/admin/products/[id] - Iniciando actualización")
    console.log("[v0] Product ID:", params.id)

    const body = await request.json()
    console.log("[v0] Request body:", JSON.stringify(body, null, 2))

    const { data, error } = await supabase.from("products").update(body).eq("id", params.id).select().single()

    if (error) {
      console.error("[v0] Error updating product:", error)
      console.error("[v0] Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Error updating product", details: error }, { status: 500 })
    }

    console.log("[v0] Product updated successfully:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Internal server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabase.from("products").delete().eq("id", params.id)

    if (error) {
      console.error("[v0] Error deleting product:", error)
      return NextResponse.json({ error: "Error deleting product" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Internal server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
