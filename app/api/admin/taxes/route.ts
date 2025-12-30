import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: taxes, error } = await supabase.from("taxes").select("*").order("name", { ascending: true })

    if (error) throw error

    return NextResponse.json(taxes)
  } catch (error) {
    console.error("Error fetching taxes:", error)
    return NextResponse.json({ error: "Error al obtener impuestos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data: tax, error } = await supabase
      .from("taxes")
      .insert({
        name: body.name,
        description: body.description,
        rate: body.rate,
        is_active: body.is_active ?? true,
        country: body.country ?? "MX",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(tax)
  } catch (error) {
    console.error("Error creating tax:", error)
    return NextResponse.json({ error: "Error al crear impuesto" }, { status: 500 })
  }
}
