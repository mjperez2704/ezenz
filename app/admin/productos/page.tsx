export const dynamic = "force-dynamic"

import { getAllProducts } from "@/lib/database-server"
import { ProductsTable } from "@/components/admin/products-table"

export default async function ProductsAdminPage() {
  const products = await getAllProducts()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gestión de Productos</h1>
        <p className="text-muted-foreground">Administra el catálogo de productos de EZENZ</p>
      </div>

      <ProductsTable products={products} />
    </div>
  )
}
