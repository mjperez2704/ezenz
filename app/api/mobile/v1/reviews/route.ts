import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { createClient } from "@/lib/supabase/server"
import type { Review } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: "Debes iniciar sesión para dejar una reseña" }, { status: 401 })
    }

    const { productId, rating, title, comment } = await request.json()

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: "Campos requeridos: productId, rating, comment" },
        { status: 400 },
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: "La calificación debe estar entre 1 y 5" }, { status: 400 })
    }

    const review: Review = {
      id: `REV-${Date.now()}`,
      productId,
      userId: user.email!,
      author: `${user.user_metadata.first_name} ${user.user_metadata.last_name}`,
      rating,
      title: title || "",
      comment,
      date: new Date().toISOString(),
      helpful: 0,
      verified: true,
    }

    await db.saveReview(review)

    return NextResponse.json({
      success: true,
      data: review,
      message: "Reseña publicada exitosamente",
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Error al crear reseña" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ success: false, error: "productId requerido" }, { status: 400 })
    }

    const reviews = await db.getReviewsByProduct(productId)

    return NextResponse.json({
      success: true,
      data: reviews,
      count: reviews.length,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Error al obtener reseñas" }, { status: 500 })
  }
}
