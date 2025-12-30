import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await db.getProductById(params.id)

    if (!product) {
      return NextResponse.json({ success: false, error: "Producto no encontrado" }, { status: 404 })
    }

    // Obtener reseñas del producto
    const reviews = await db.getReviewsByProduct(params.id)

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        reviews,
        reviews_count: reviews.length,
        rating: reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Error al obtener producto" }, { status: 500 })
  }
}
