export const dynamic = "force-dynamic";

import { getAllOrders } from "@/lib/database-server"
import { OrdersTable } from "@/components/admin/orders-table"

export default async function OrdersAdminPage() {
  const orders = await getAllOrders()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
        <p className="text-muted-foreground">Administra todos los pedidos realizados</p>
      </div>

      <OrdersTable orders={orders} />
    </div>
  )
}
