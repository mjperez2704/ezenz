export const dynamic = "force-dynamic"

import { getAllTaxes } from "@/lib/database-server"
import { TaxesTable } from "@/components/admin/taxes-table"

export default async function TaxesPage() {
  const taxes = await getAllTaxes()

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Impuestos</h1>
        <p className="text-muted-foreground mt-2">Administra los impuestos aplicables a los productos</p>
      </div>

      <TaxesTable initialTaxes={taxes} />
    </div>
  )
}
