"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, Package, Mail, Phone, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderData, setOrderData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const orderId = searchParams.get("order_id")
  const testMode = searchParams.get("test_mode") === "true"

  useEffect(() => {
    const loadOrderData = async () => {
      if (!orderId) {
        setLoading(false)
        return
      }

      try {
        console.log("[v0] Cargando datos de orden:", orderId)

        // Obtener datos de la orden desde la API
        const response = await fetch(`/api/orders/${orderId}`)

        if (response.ok) {
          const data = await response.json()
          setOrderData(data.order)
          console.log("[v0] Orden cargada:", data.order)
        } else {
          console.error("[v0] Error cargando orden:", response.statusText)
        }
      } catch (error) {
        console.error("[v0] Error al cargar datos de la orden:", error)
      } finally {
        setLoading(false)
      }
    }

    loadOrderData()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando información de tu pedido...</p>
        </div>
      </div>
    )
  }

  if (!orderId || !orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Pedido no encontrado</CardTitle>
            <CardDescription>No se pudo cargar la información del pedido</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push("/")}>Volver al inicio</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header de confirmación */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">¡Gracias por tu compra!</h1>
            <p className="text-muted-foreground text-lg">Tu pedido ha sido procesado exitosamente</p>
            {testMode && (
              <Badge variant="outline" className="mt-2">
                Modo de Prueba
              </Badge>
            )}
          </div>
        </div>

        {/* Información del pedido */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Detalles del Pedido
              </CardTitle>
              <Badge variant="secondary">{orderData.orderId}</Badge>
            </div>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(orderData.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Productos */}
            <div className="space-y-4">
              <h3 className="font-semibold">Productos</h3>
              <div className="space-y-3">
                {orderData.items.map((item: any, index: number) => (
                  <div key={index} className="flex gap-4 p-3 rounded-lg bg-muted/50">
                    {item.image && (
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        Cantidad: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="font-semibold">{formatCurrency(item.quantity * item.price)}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Totales */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(orderData.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span>{orderData.shipping === 0 ? "Gratis" : formatCurrency(orderData.shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Impuestos</span>
                <span>{formatCurrency(orderData.tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(orderData.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de envío */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Información de Envío
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold mb-1">Destinatario</p>
              <p className="text-muted-foreground">
                {orderData.customerInfo.firstName} {orderData.customerInfo.lastName}
              </p>
            </div>

            <div>
              <p className="font-semibold mb-1">Dirección de entrega</p>
              <p className="text-muted-foreground">
                {orderData.shippingAddress.street}
                <br />
                {orderData.shippingAddress.city}, {orderData.shippingAddress.state}
                <br />
                C.P. {orderData.shippingAddress.zipCode}
                <br />
                {orderData.shippingAddress.country}
              </p>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{orderData.customerInfo.email}</span>
              </div>
              {orderData.customerInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{orderData.customerInfo.phone}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Siguiente paso */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Hemos enviado un correo de confirmación con los detalles de tu pedido a{" "}
                <strong>{orderData.customerInfo.email}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Tu pedido será procesado y enviado pronto. Recibirás actualizaciones sobre el estado de tu envío.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button onClick={() => router.push("/productos")}>Seguir Comprando</Button>
                <Button variant="outline" onClick={() => router.push("/")}>
                  Volver al Inicio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
