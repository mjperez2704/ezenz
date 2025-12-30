import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// API pública para obtener impuesto por ID (para checkout)
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    console.log("[v0] GET /api/taxes/[id] - Fetching tax:", params.id)

    const { data: tax, error } = await supabase
      .from("taxes")
      .select("id, name, rate, is_active")
      .eq("id", params.id)
      .eq("is_active", true) // Solo impuestos activos
      .single()

    if (error) {
      console.error("[v0] Error fetching tax:", error)
      // Si no se encuentra, devolver IVA por defecto
      return NextResponse.json({
        id: params.id,
        name: "IVA",
        rate: 0.16,
        is_active: true,
      })
    }

    if (!tax) {
      console.log("[v0] Tax not found, returning default IVA")
      return NextResponse.json({
        id: params.id,
        name: "IVA",
        rate: 0.16,
        is_active: true,
      })
    }

    console.log("[v0] Tax found:", tax)
    return NextResponse.json(tax)
  } catch (error) {
    console.error("[v0] Error in GET /api/taxes/[id]:", error)
    // En caso de error, devolver IVA por defecto
    return NextResponse.json({
      id: params.id,
      name: "IVA",
      rate: 0.16,
      is_active: true,
    })
  }
}
