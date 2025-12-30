import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("categories")
      .select("name, slug")
      .eq("is_active", true)
      .order("display_order")

    if (error) {
      console.error("[v0] Error fetching categories:", error)
      return NextResponse.json(
        {
          categories: [
            { name: "Relajación", slug: "relajacion" },
            { name: "Enfoque", slug: "enfoque" },
            { name: "Energía", slug: "energia" },
            { name: "Defensa", slug: "defensa" },
            { name: "Longevidad", slug: "longevidad" },
            { name: "Balance Hormonal", slug: "balance-hormonal" },
          ],
        },
        { status: 200 },
      )
    }

    return NextResponse.json({ categories: data || [] })
  } catch (error) {
    console.error("[v0] Error in categories API:", error)
    return NextResponse.json(
      {
        categories: [
          { name: "Relajación", slug: "relajacion" },
          { name: "Enfoque", slug: "enfoque" },
          { name: "Energía", slug: "energia" },
          { name: "Defensa", slug: "defensa" },
          { name: "Longevidad", slug: "longevidad" },
          { name: "Balance Hormonal", slug: "balance-hormonal" },
        ],
      },
      { status: 200 },
    )
  }
}
