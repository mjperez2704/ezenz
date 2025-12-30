import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")

    let products

    if (search) {
      products = await db.searchProducts(search)
    } else if (category) {
      products = await db.getProductsByCategory(category)
    } else if (minPrice || maxPrice) {
      products = await db.filterProducts({
        priceRange: {
          min: minPrice ? Number.parseFloat(minPrice) : 0,
          max: maxPrice ? Number.parseFloat(maxPrice) : 999999,
        },
      })
    } else {
      products = await db.getAllProductsAsync()
    }

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Error al obtener productos" }, { status: 500 })
  }
}
