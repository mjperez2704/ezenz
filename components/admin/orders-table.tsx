"use client"

import type React from "react"

import { useState } from "react"
import type { Order } from "@/lib/database"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Truck, Eye } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ShippingService } from "@/lib/shipping-service"
import Link from "next/link"

interface OrdersTableProps {
  orders: Order[]
}

const statusColors = {
  pending: "bg-gray-500",
  processing: "bg-blue-500",
  confirmed: "bg-cyan-500",
  paid: "bg-indigo-500",
  completed: "bg-green-500",
  shipped: "bg-purple-500",
  delivered: "bg-emerald-500",
  cancelled: "bg-red-500",
  refunded: "bg-orange-500",
  failed: "bg-red-500",
}

const statusLabels = {
  pending: "Pendiente",
  processing: "Procesando",
  confirmed: "Confirmado",
  paid: "Pagado",
  completed: "Completado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
  failed: "Fallido",
}

export function OrdersTable({ orders: initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState(initialOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [trackingData, setTrackingData] = useState({
    tracking_number: "",
    shipping_carrier: "",
    estimated_delivery_date: "",
  })

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })

    if (response.ok) {
      setOrders(orders.map((order) => (order.orderId === orderId ? { ...order, status: newStatus } : order)))
      toast.success("Estado actualizado")
    } else {
      toast.error("Error al actualizar el estado")
    }
  }

  const handleAddTracking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrder) return

    const result = await ShippingService.updateTracking(
      selectedOrder.orderId,
      trackingData.tracking_number,
      trackingData.shipping_carrier,
      trackingData.estimated_delivery_date || undefined,
    )

    if (result.success) {
      toast.success("Información de tracking agregada")
      setIsTrackingDialogOpen(false)
      setTrackingData({ tracking_number: "", shipping_carrier: "", estimated_delivery_date: "" })
      window.location.reload()
    } else {
      toast.error(result.error || "Error al agregar tracking")
    }
  }

  const openTrackingDialog = (order: Order) => {
    setSelectedOrder(order)
    setIsTrackingDialogOpen(true)
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerInfo.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${order.customerInfo.firstName} ${order.customerInfo.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por ID, email o nombre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell className="font-mono text-sm">{order.orderId.slice(0, 8)}</TableCell>
                <TableCell>
                  {order.customerInfo.firstName} {order.customerInfo.lastName}
                </TableCell>
                <TableCell>{order.customerInfo.email}</TableCell>
                <TableCell className="font-medium">${order.total.toLocaleString()} MXN</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(value) => handleStatusChange(order.orderId, value as Order["status"])}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openTrackingDialog(order)}
                      className="h-8 w-8 p-0"
                      title="Agregar tracking"
                    >
                      <Truck className="h-4 w-4" />
                    </Button>
                    <Link href={`/rastreo/${order.orderId}`} target="_blank">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Ver tracking">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Información de Envío</DialogTitle>
            <DialogDescription>
              Agrega el número de rastreo y la paquetería para el pedido {selectedOrder?.orderId}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddTracking} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tracking_number">Número de Rastreo</Label>
              <Input
                id="tracking_number"
                value={trackingData.tracking_number}
                onChange={(e) => setTrackingData({ ...trackingData, tracking_number: e.target.value })}
                placeholder="123456789"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipping_carrier">Paquetería</Label>
              <Select
                value={trackingData.shipping_carrier}
                onValueChange={(value) => setTrackingData({ ...trackingData, shipping_carrier: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una paquetería" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FedEx">FedEx</SelectItem>
                  <SelectItem value="UPS">UPS</SelectItem>
                  <SelectItem value="DHL">DHL</SelectItem>
                  <SelectItem value="USPS">USPS</SelectItem>
                  <SelectItem value="Estafeta">Estafeta</SelectItem>
                  <SelectItem value="Redpack">Redpack</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimated_delivery">Fecha Estimada de Entrega (Opcional)</Label>
              <Input
                id="estimated_delivery"
                type="date"
                value={trackingData.estimated_delivery_date}
                onChange={(e) => setTrackingData({ ...trackingData, estimated_delivery_date: e.target.value })}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsTrackingDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Guardar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
