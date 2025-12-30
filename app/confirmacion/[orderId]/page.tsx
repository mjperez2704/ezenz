import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CheckCircle, Package, Truck, Mail, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function ConfirmacionPage({ params }: { params: { orderId: string } }) {
  const supabase = await createClient()

  const { data: orderData, error } = await supabase.from("orders").select("*").eq("id", params.orderId).single()

  if (error || !orderData) {
    console.error("[v0 CONFIRMACION] Error cargando orden:", error)
    return (
      <main className="min-h-screen bg-[rgb(15,15,35)]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
          <div className="text-center space-y-6 max-w-2xl">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto">
              <Package className="h-12 w-12 text-white/40" />
            </div>
            <h1 className="text-4xl font-bold text-white">Pedido no encontrado</h1>
            <p className="text-white/60 text-lg">
              No pudimos encontrar el pedido con ID: <span className="text-[rgb(170,151,196)]">{params.orderId}</span>
            </p>
            <Link href="/cuenta">
              <Button className="bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] hover:opacity-90 text-white">
                Ver Mis Pedidos
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const formattedOrderData = {
    orderId: orderData.id,
    customerInfo: {
      firstName: orderData.customer_name?.split(" ")[0] || "",
      lastName: orderData.customer_name?.split(" ").slice(1).join(" ") || "",
      email: orderData.customer_email,
      phone: orderData.customer_phone,
    },
    shippingAddress: orderData.shipping_address,
    items: orderData.items,
    subtotal: orderData.subtotal,
    shipping: orderData.shipping,
    tax: orderData.tax,
    total: orderData.total,
    paymentMethod: {
      brand: orderData.payment_method === "test_card" ? "Tarjeta de Prueba" : "Tarjeta",
      last4: orderData.payment_method === "test_card" ? "0000" : "****",
    },
  }

  return (
    <main className="min-h-screen bg-[rgb(15,15,35)]">
      <Navbar />

      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-500/20 to-green-400/20 border-2 border-green-500 mb-6">
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">¡Pedido Confirmado!</h1>
            <p className="text-white/60 text-lg mb-2">Gracias por tu compra en STARDUST</p>
            <p className="text-white/80 font-mono">
              Número de pedido: <span className="text-[rgb(170,151,196)] font-bold">{formattedOrderData.orderId}</span>
            </p>
          </div>

          {/* Order Status Steps */}
          <Card className="bg-white/5 border-[rgb(74,34,86)] mb-8">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] flex items-center justify-center mb-2">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-white text-sm font-medium">Confirmado</p>
                </div>
                <div className="flex-1 h-0.5 bg-[rgb(74,34,86)]" />
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 rounded-full bg-[rgb(74,34,86)] flex items-center justify-center mb-2">
                    <Package className="h-6 w-6 text-white/40" />
                  </div>
                  <p className="text-white/40 text-sm font-medium">Preparando</p>
                </div>
                <div className="flex-1 h-0.5 bg-[rgb(74,34,86)]" />
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 rounded-full bg-[rgb(74,34,86)] flex items-center justify-center mb-2">
                    <Truck className="h-6 w-6 text-white/40" />
                  </div>
                  <p className="text-white/40 text-sm font-medium">En camino</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confirmation Notice */}
          <Card className="bg-[rgb(170,151,196)]/10 border-[rgb(170,151,196)] mb-8">
            <CardContent className="flex items-start gap-3 pt-6">
              <Mail className="h-5 w-5 text-[rgb(170,151,196)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium mb-1">Confirmación enviada por correo</p>
                <p className="text-white/70 text-sm">
                  Hemos enviado los detalles de tu pedido a{" "}
                  <span className="text-[rgb(170,151,196)] font-medium">{formattedOrderData.customerInfo.email}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Details */}
            <div className="space-y-6">
              <Card className="bg-white/5 border-[rgb(74,34,86)]">
                <CardHeader>
                  <CardTitle className="text-white">Detalles del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formattedOrderData.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[rgb(74,34,86)] to-[rgb(104,43,78)] flex-shrink-0 relative">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="object-contain p-2 w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-white/50 text-sm">Cantidad: {item.quantity}</p>
                        <p className="text-[rgb(170,151,196)] font-semibold">
                          ${(item.price * item.quantity).toFixed(2)} MXN
                        </p>
                      </div>
                    </div>
                  ))}

                  <Separator className="bg-[rgb(74,34,86)]" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-white/70">
                      <span>Subtotal:</span>
                      <span>${formattedOrderData.subtotal.toFixed(2)} MXN</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Envío:</span>
                      <span>
                        {formattedOrderData.shipping === 0
                          ? "Gratis"
                          : `$${formattedOrderData.shipping.toFixed(2)} MXN`}
                      </span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Impuestos:</span>
                      <span>${formattedOrderData.tax.toFixed(2)} MXN</span>
                    </div>
                    <Separator className="bg-[rgb(74,34,86)]" />
                    <div className="flex justify-between text-white text-lg font-bold">
                      <span>Total:</span>
                      <span className="bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] bg-clip-text text-transparent">
                        ${formattedOrderData.total.toFixed(2)} MXN
                      </span>
                    </div>
                  </div>

                  <Separator className="bg-[rgb(74,34,86)]" />
                  <div className="text-sm">
                    <p className="text-white/60 mb-1">Método de pago:</p>
                    <p className="text-white">
                      {formattedOrderData.paymentMethod.brand} •••• {formattedOrderData.paymentMethod.last4}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Shipping Info */}
            <div className="space-y-6">
              <Card className="bg-white/5 border-[rgb(74,34,86)]">
                <CardHeader>
                  <CardTitle className="text-white">Información de Envío</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-white/60 mb-1">Enviar a:</p>
                    <p className="text-white font-medium">
                      {formattedOrderData.customerInfo.firstName} {formattedOrderData.customerInfo.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 mb-1">Dirección:</p>
                    <p className="text-white">{formattedOrderData.shippingAddress.address}</p>
                    <p className="text-white">
                      {formattedOrderData.shippingAddress.city}, {formattedOrderData.shippingAddress.state}{" "}
                      {formattedOrderData.shippingAddress.zip}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 mb-1">Teléfono:</p>
                    <p className="text-white">{formattedOrderData.customerInfo.phone}</p>
                  </div>
                  {formattedOrderData.shippingAddress.notes && (
                    <div>
                      <p className="text-white/60 mb-1">Notas de entrega:</p>
                      <p className="text-white">{formattedOrderData.shippingAddress.notes}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-white/60 mb-1">Tiempo estimado de entrega:</p>
                    <p className="text-white font-medium">3-5 días hábiles</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-[rgb(74,34,86)]">
                <CardHeader>
                  <CardTitle className="text-white">Acciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full bg-white/5 hover:bg-white/10 text-white border border-[rgb(74,34,86)]"
                    variant="outline"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Descargar Factura
                  </Button>
                  <Link href="/productos" className="block">
                    <Button className="w-full bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] hover:opacity-90 text-white">
                      Seguir Comprando
                    </Button>
                  </Link>
                  <Link href="/cuenta" className="block">
                    <Button
                      className="w-full bg-white/5 hover:bg-white/10 text-white border border-[rgb(74,34,86)]"
                      variant="outline"
                    >
                      Ver Mis Pedidos
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Help Section */}
          <Card className="bg-gradient-to-r from-[rgb(170,151,196)]/10 to-[rgb(201,18,64)]/10 border-[rgb(170,151,196)] mt-8">
            <CardContent className="text-center py-8">
              <h3 className="text-white text-xl font-bold mb-2">¿Necesitas ayuda con tu pedido?</h3>
              <p className="text-white/70 mb-4">
                Nuestro equipo de soporte está disponible para ayudarte con cualquier pregunta o inquietud.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/contacto">
                  <Button
                    variant="outline"
                    className="border-[rgb(170,151,196)] text-[rgb(170,151,196)] hover:bg-[rgb(170,151,196)]/10 bg-transparent"
                  >
                    Contactar Soporte
                  </Button>
                </Link>
                <a href="mailto:stardustcorp@gmail.com">
                  <Button
                    variant="outline"
                    className="border-[rgb(170,151,196)] text-[rgb(170,151,196)] hover:bg-[rgb(170,151,196)]/10 bg-transparent"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    stardustcorp@gmail.com
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}
