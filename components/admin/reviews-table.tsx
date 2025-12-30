"use client"

import { useState } from "react"
import type { Review } from "@/lib/database"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Star, Trash2, Search } from "lucide-react"
import { toast } from "sonner"

interface ReviewsTableProps {
  reviews: Review[]
}

export function ReviewsTable({ reviews: initialReviews }: ReviewsTableProps) {
  const [reviews, setReviews] = useState(initialReviews)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredReviews = reviews.filter(
    (review) =>
      review.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta reseña?")) return

    const response = await fetch(`/api/admin/reviews/${id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      setReviews(reviews.filter((r) => r.id !== id))
      toast.success("Reseña eliminada")
    } else {
      toast.error("Error al eliminar la reseña")
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar reseñas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Autor</TableHead>
              <TableHead>Calificación</TableHead>
              <TableHead>Comentario</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Útil</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">{review.author}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="max-w-md truncate">{review.comment}</TableCell>
                <TableCell>{new Date(review.date).toLocaleDateString()}</TableCell>
                <TableCell>{review.helpful}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(review.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
