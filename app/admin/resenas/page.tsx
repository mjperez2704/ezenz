export const dynamic = "force-dynamic";

import { getAllReviews } from "@/lib/database-server"
import { ReviewsTable } from "@/components/admin/reviews-table"

export default async function ReviewsAdminPage() {
  const reviews = await getAllReviews()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gestión de Reseñas</h1>
        <p className="text-muted-foreground">Administra las reseñas de productos</p>
      </div>

      <ReviewsTable reviews={reviews} />
    </div>
  )
}
