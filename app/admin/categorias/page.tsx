export const dynamic = "force-dynamic"
import { getAllCategories } from "@/lib/database-server"
import { CategoriesTable } from "@/components/admin/categories-table"

export default async function CategoriesAdminPage() {
  const categories = await getAllCategories()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gestión de Categorías</h1>
        <p className="text-muted-foreground">Administra las categorías de productos de EZENZ</p>
      </div>

      <CategoriesTable categories={categories} />
    </div>
  )
}
