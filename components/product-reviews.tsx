"use client"

import { useState, useEffect } from "react"
import { Star, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { db, type Review } from "@/lib/database"

interface ProductReviewsProps {
  productId: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { toast } = useToast()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [reviewerName, setReviewerName] = useState("")
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReviews() {
      setLoading(true)
      const loadedReviews = await db.getReviewsByProduct(productId)

      if (loadedReviews.length === 0) {
        const sampleReviews: Review[] = [
          {
            id: `${productId}-1`,
            productId,
            author: "María González",
            rating: 5,
            date: "5 Nov 2025",
            comment:
              "Excelente producto. Llevo 2 semanas usándolo y he notado una gran diferencia en mi concentración. Lo recomiendo totalmente.",
            helpful: 12,
            verified: true,
          },
          {
            id: `${productId}-2`,
            productId,
            author: "Carlos Ramírez",
            rating: 4,
            date: "28 Oct 2025",
            comment:
              "Buen producto, aunque tardé un poco en notar los efectos. Después de un mes de uso constante, definitivamente funciona. La calidad es premium.",
            helpful: 8,
            verified: true,
          },
          {
            id: `${productId}-3`,
            productId,
            author: "Ana Martínez",
            rating: 5,
            date: "15 Oct 2025",
            comment:
              "Me encanta. Es natural, efectivo y de alta calidad. El empaque es hermoso y llegó rápido. Sin duda volveré a comprar.",
            helpful: 15,
            verified: false,
          },
        ]

        sampleReviews.forEach((review) => db.saveReview(review))
        setReviews(sampleReviews)
      } else {
        setReviews(loadedReviews)
      }
      setLoading(false)
    }

    loadReviews()
  }, [productId])

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: reviews.length > 0 ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }))

  const handleSubmitReview = async () => {
    if (!reviewerName.trim() || !reviewText.trim() || rating === 0) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos y selecciona una calificación.",
        variant: "destructive",
      })
      return
    }

    const newReview: Review = {
      id: `${productId}-${Date.now()}`,
      productId,
      author: reviewerName,
      rating,
      date: new Date().toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }),
      comment: reviewText,
      helpful: 0,
      verified: false,
    }

    await db.saveReview(newReview)
    setReviews([newReview, ...reviews])

    setReviewText("")
    setReviewerName("")
    setRating(0)

    toast({
      title: "Reseña publicada",
      description: "Gracias por tu opinión. Tu reseña ha sido publicada exitosamente.",
    })
  }

  const handleHelpful = async (reviewId: string) => {
    await db.updateReviewHelpful(reviewId)
    const updatedReviews = await db.getReviewsByProduct(productId)
    setReviews(updatedReviews)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white/60">Cargando reseñas...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Average Rating */}
        <Card className="bg-white/5 border-[rgb(74,34,86)]">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-6xl font-bold bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] bg-clip-text text-transparent mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating)
                        ? "fill-[rgb(170,151,196)] text-[rgb(170,151,196)]"
                        : "text-white/20"
                    }`}
                  />
                ))}
              </div>
              <p className="text-white/60 text-sm">Basado en {reviews.length} reseñas</p>
            </div>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card className="bg-white/5 border-[rgb(74,34,86)]">
          <CardContent className="pt-6 space-y-3">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-20">
                  <span className="text-white/80 text-sm">{star}</span>
                  <Star className="h-3 w-3 fill-[rgb(170,151,196)] text-[rgb(170,151,196)]" />
                </div>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)]"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-white/60 text-sm w-8 text-right">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Write Review */}
      <Card className="bg-white/5 border-[rgb(74,34,86)]">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-white text-xl font-bold mb-4">Escribe una reseña</h3>

          <div className="space-y-2">
            <Label className="text-white/80">Tu nombre</Label>
            <Input
              placeholder="Nombre"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="bg-white/5 border-[rgb(74,34,86)] text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/80">Calificación</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating || rating)
                        ? "fill-[rgb(170,151,196)] text-[rgb(170,151,196)]"
                        : "text-white/20"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white/80">Tu reseña</Label>
            <Textarea
              placeholder="Comparte tu experiencia con este producto..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="bg-white/5 border-[rgb(74,34,86)] text-white placeholder:text-white/40 min-h-[120px]"
            />
          </div>

          <Button
            onClick={handleSubmitReview}
            className="w-full sm:w-auto bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] hover:opacity-90 text-white"
          >
            Publicar Reseña
          </Button>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-white text-xl font-bold">Reseñas de clientes</h3>
        {reviews.map((review) => (
          <Card key={review.id} className="bg-white/5 border-[rgb(74,34,86)]">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12 bg-gradient-to-br from-[rgb(170,151,196)] to-[rgb(201,18,64)]">
                  <AvatarFallback className="text-white font-semibold">
                    {review.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-semibold">{review.author}</h4>
                        {review.verified && (
                          <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
                            Compra verificada
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "fill-[rgb(170,151,196)] text-[rgb(170,151,196)]"
                                  : "text-white/20"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-white/40 text-sm">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-white/80 leading-relaxed">{review.comment}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpful(review.id)}
                      className="text-white/60 hover:text-[rgb(170,151,196)] hover:bg-white/5"
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Útil ({review.helpful})
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
