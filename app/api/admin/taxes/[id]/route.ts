import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const { data: tax, error } = await supabase.from("taxes").select("*").eq("id", params.id).single()

    if (error) throw error

    if (!tax) {
      return NextResponse.json({ error: "Impuesto no encontrado" }, { status: 404 })
    }

    return NextResponse.json(tax)
  } catch (error) {
    console.error("Error fetching tax:", error)
    return NextResponse.json({ error: "Error al obtener impuesto" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data: tax, error } = await supabase
      .from("taxes")
      .update({
        name: body.name,
        description: body.description,
        rate: body.rate,
        is_active: body.is_active,
        country: body.country,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(tax)
  } catch (error) {
    console.error("Error updating tax:", error)
    return NextResponse.json({ error: "Error al actualizar impuesto" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const { data: products, error: checkError } = await supabase
      .from("products")
      .select("id")
      .eq("tax_id", params.id)
      .limit(1)

    if (checkError) throw checkError

    if (products && products.length > 0) {
      return NextResponse.json(
        { error: "No se puede eliminar un impuesto que está siendo usado por productos" },
        { status: 400 },
      )
    }

    const { error } = await supabase.from("taxes").delete().eq("id", params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting tax:", error)
    return NextResponse.json({ error: "Error al eliminar impuesto" }, { status: 500 })
  }
}
