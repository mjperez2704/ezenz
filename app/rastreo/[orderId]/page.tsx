"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShippingService, type ShippingInfo } from "@/lib/shipping-service"
import { Package, Truck, MapPin, Calendar, ExternalLink, CheckCircle2, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RastreoPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = use(params)
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadShippingInfo()
  }, [])

  const loadShippingInfo = async () => {
    setLoading(true)
    const info = await ShippingService.getShippingInfo(resolvedParams.orderId)
    setShippingInfo(info)
    setLoading(false)
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "created":
      case "picked":
        return <Package className="h-5 w-5" />
      case "packed":
      case "shipped":
        return <Truck className="h-5 w-5" />
      case "in_transit":
      case "out_for_delivery":
        return <MapPin className="h-5 w-5" />
      case "delivered":
        return <CheckCircle2 className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
      case "in_transit":
        return "bg-blue-100 text-blue-800"
      case "processing":
      case "confirmed":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Pendiente",
      processing: "Procesando",
      confirmed: "Confirmado",
      paid: "Pagado",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado",
      refunded: "Reembolsado",
    }
    return statusMap[status] || status
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[rgb(15,15,35)]">
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center text-white py-12">Cargando información de envío...</div>
          </div>
        </div>
      </main>
    )
  }

  if (!shippingInfo) {
    return (
      <main className="min-h-screen bg-[rgb(15,15,35)]">
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/5 border-[rgb(74,34,86)]">
              <CardContent className="pt-6 text-center">
                <Package className="h-12 w-12 text-white/40 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Pedido no encontrado</h2>
                <p className="text-white/60 mb-6">No se encontró información para este pedido.</p>
                <Link href="/">
                  <Button variant="outline">Volver al inicio</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    )
  }

  const trackingUrl =
    shippingInfo.tracking_number && shippingInfo.shipping_carrier
      ? ShippingService.getTrackingUrl(shippingInfo.shipping_carrier, shippingInfo.tracking_number)
      : null

  return (
    <main className="min-h-screen bg-[rgb(15,15,35)]">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-white/70 hover:text-[rgb(170,151,196)] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Rastreo de Pedido</h1>
            <p className="text-white/60 text-lg">Pedido #{resolvedParams.orderId}</p>
          </div>

          <div className="space-y-6">
            <Card className="bg-white/5 border-[rgb(74,34,86)]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Estado del Envío</CardTitle>
                  <Badge className={getStatusColor(shippingInfo.current_status)}>
                    {getStatusText(shippingInfo.current_status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {shippingInfo.tracking_number && (
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white/60 text-sm mb-1">Número de rastreo</p>
                      <p className="text-white font-mono text-lg">{shippingInfo.tracking_number}</p>
                      {shippingInfo.shipping_carrier && (
                        <p className="text-white/40 text-sm mt-1">Paquetería: {shippingInfo.shipping_carrier}</p>
                      )}
                    </div>
                    {trackingUrl && (
                      <a href={trackingUrl} target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="outline"
                          className="border-[rgb(170,151,196)] text-[rgb(170,151,196)] hover:bg-[rgb(170,151,196)]/10 bg-transparent"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Rastrear en sitio oficial
                        </Button>
                      </a>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {shippingInfo.shipped_at && (
                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2 text-[rgb(170,151,196)] mb-2">
                        <Truck className="h-4 w-4" />
                        <span className="text-sm font-medium">Fecha de Envío</span>
                      </div>
                      <p className="text-white">
                        {new Date(shippingInfo.shipped_at).toLocaleDateString("es-MX", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}

                  {shippingInfo.estimated_delivery_date && (
                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2 text-[rgb(170,151,196)] mb-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm font-medium">Entrega Estimada</span>
                      </div>
                      <p className="text-white">
                        {new Date(shippingInfo.estimated_delivery_date).toLocaleDateString("es-MX", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}

                  {shippingInfo.delivered_at && (
                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2 text-green-400 mb-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Entregado</span>
                      </div>
                      <p className="text-white">
                        {new Date(shippingInfo.delivered_at).toLocaleDateString("es-MX", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-[rgb(74,34,86)]">
              <CardHeader>
                <CardTitle className="text-white">Historial de Envío</CardTitle>
              </CardHeader>
              <CardContent>
                {shippingInfo.events.length === 0 ? (
                  <p className="text-white/60 text-center py-8">No hay eventos de envío registrados aún.</p>
                ) : (
                  <div className="relative">
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[rgb(74,34,86)]" />
                    <div className="space-y-6">
                      {shippingInfo.events.map((event, index) => (
                        <div key={event.id} className="relative flex gap-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] flex items-center justify-center text-white z-10">
                            {getEventIcon(event.event_type)}
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="flex items-start justify-between mb-1">
                              <h3 className="text-white font-semibold">{event.event_description}</h3>
                              <span className="text-white/40 text-sm whitespace-nowrap ml-4">
                                {new Date(event.event_date).toLocaleString("es-MX", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            {event.event_location && (
                              <p className="text-white/60 text-sm flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.event_location}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
