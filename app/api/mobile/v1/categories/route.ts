import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const products = await db.getAllProductsAsync()

    // Extraer categorías únicas
    const categories = Array.from(new Set(products.map((p) => p.category)))

    // Contar productos por categoría
    const categoriesWithCount = categories.map((category) => ({
      name: category,
      count: products.filter((p) => p.category === category).length,
    }))

    return NextResponse.json({
      success: true,
      data: categoriesWithCount,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Error al obtener categorías" }, { status: 500 })
  }
}
