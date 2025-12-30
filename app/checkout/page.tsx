"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, CreditCard, Truck, Lock, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { validateCard } from "@/lib/card-validation" // Import the validateCard function
import { StockService } from "@/lib/stock-service"
import { loadStripe } from "@stripe/stripe-js"

let stripePromise: Promise<any> | null = null

async function getStripePromise() {
  if (!stripePromise) {
    // Obtener la clave pública del ambiente activo
    const response = await fetch("/api/stripe-config/public")
    const { publishableKey, environment } = await response.json()

    console.log("[v0] Loading Stripe in", environment, "mode")
    stripePromise = loadStripe(publishableKey)
  }
  return stripePromise
}

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [cardValidation, setCardValidation] = useState<{ valid: boolean; brand: string } | null>(null)
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
  const [stockReserved, setStockReserved] = useState(false)
  const [stripeEnvironment, setStripeEnvironment] = useState<"test" | "production">("test")
  const [productTaxes, setProductTaxes] = useState<Record<string, number>>({})

  useEffect(() => {
    fetch("/api/stripe-config/public")
      .then((res) => res.json())
      .then((data) => setStripeEnvironment(data.environment))
      .catch(console.error)
  }, [])

  useEffect(() => {
    const reserveStockForCart = async () => {
      if (cart.length === 0 || stockReserved) return

      try {
        const items = cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        }))

        const checkResponse = await fetch("/api/stock/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        })

        const checkResult = await checkResponse.json()

        if (!checkResult.available) {
          toast({
            title: "Stock insuficiente",
            description: "Algunos productos ya no están disponibles",
            variant: "destructive",
          })
          return
        }

        for (const item of cart) {
          await fetch("/api/stock/reserve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: item.id,
              quantity: item.quantity,
              sessionId,
            }),
          })
        }

        setStockReserved(true)
      } catch (error) {
        console.error("Error reserving stock:", error)
      }
    }

    reserveStockForCart()

    return () => {
      if (stockReserved) {
        StockService.cancelReservation(sessionId)
      }
    }
  }, [cart, sessionId, stockReserved, toast])

  useEffect(() => {
    async function loadProductTaxes() {
      const taxes: Record<string, number> = {}

      for (const item of cart) {
        try {
          const response = await fetch(`/api/products/${item.id}`)
          if (response.ok) {
            const product = await response.json()
            if (product.tax_id) {
              const taxResponse = await fetch(`/api/taxes/${product.tax_id}`)
              if (taxResponse.ok) {
                const taxData = await taxResponse.json()
                taxes[item.id] = taxData.rate
                console.log(`[v0] Tax loaded for ${item.id}:`, taxData.rate)
              } else {
                console.warn(`[v0] Failed to load tax for ${item.id}, using default`)
                taxes[item.id] = 0.16 // IVA por defecto si no se encuentra
              }
            } else {
              taxes[item.id] = 0.16 // IVA por defecto si no tiene tax_id
            }
          } else {
            taxes[item.id] = 0.16 // IVA por defecto si falla la consulta
          }
        } catch (error) {
          console.error(`[v0] Error loading tax for product ${item.id}:`, error)
          taxes[item.id] = 0.16 // IVA por defecto en caso de error
        }
      }

      setProductTaxes(taxes)
    }

    if (cart.length > 0) {
      loadProductTaxes()
    }
  }, [cart])

  const shippingCost = cartTotal > 50 ? 0 : 9.99
  const tax = cart.reduce((total, item) => {
    const taxRate = productTaxes[item.id] || 0.16 // Default IVA 16%
    return total + item.price * item.quantity * taxRate
  }, 0)
  const total = cartTotal + shippingCost + tax

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "")
    if (value.length >= 13) {
      const validation = validateCard(value)
      setCardValidation(validation)
    } else {
      setCardValidation(null)
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "") // Solo números

    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4)
    }

    e.target.value = value
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsProcessing(true)
    setPaymentError(null)

    console.log("[v0 CHECKOUT] Iniciando proceso de pago...")

    const formData = new FormData(e.currentTarget)

    const customerInfo = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    }

    const shippingAddress = {
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zip: formData.get("zip") as string,
      notes: formData.get("notes") as string,
    }

    const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    console.log("[v0 CHECKOUT] Datos preparados:", {
      orderId,
      email: customerInfo.email,
      itemsCount: cart.length,
      total,
    })

    try {
      console.log("[v0 CHECKOUT] Llamando a /api/stripe/create-checkout-session...")

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          customerEmail: customerInfo.email,
          orderId,
          customerInfo,
          shippingAddress,
          subtotal: cartTotal,
          shipping: shippingCost,
          tax,
          total,
          sessionId,
        }),
      })

      console.log("[v0 CHECKOUT] Response status:", response.status)

      const responseData = await response.json()
      console.log("[v0 CHECKOUT] Response data:", {
        hasSessionId: !!responseData.sessionId,
        hasUrl: !!responseData.url,
        hasError: !!responseData.error,
        testMode: responseData.testMode,
        error: responseData.error,
      })

      const { sessionId: stripeSessionId, url, error, testMode } = responseData

      if (error) {
        console.error("[v0 CHECKOUT] Error desde API:", error)
        throw new Error(error)
      }

      if (!stripeSessionId && !url) {
        console.error("[v0 CHECKOUT] No se recibió sessionId ni URL")
        throw new Error("No se recibió sesión de pago de Stripe")
      }

      if (testMode && url) {
        console.log("[v0 CHECKOUT] 🎭 Modo de prueba detectado - Redirigiendo directamente a confirmación...")
        clearCart()
        window.location.href = url
        return
      }

      console.log("[v0 CHECKOUT] Redirigiendo a Stripe...")

      if (url) {
        window.location.href = url
      } else {
        const stripe = await getStripePromise()
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId: stripeSessionId })
          if (error) {
            console.error("[v0 CHECKOUT] Error en redirectToCheckout:", error)
            throw error
          }
        }
      }

      return
    } catch (error: unknown) {
      console.error("[v0 CHECKOUT] Error en proceso de pago:", error)

      let errorMessage = "Error al procesar el pago"

      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === "string") {
        errorMessage = error
      } else if (error && typeof error === "object") {
        errorMessage = JSON.stringify(error)
      }

      console.error("[v0 CHECKOUT] Mensaje de error final:", errorMessage)

      setPaymentError(errorMessage)
      setIsProcessing(false)

      toast({
        title: "Error en el pago",
        description: errorMessage,
        variant: "destructive",
      })
      return
    }
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[rgb(15,15,35)]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
          <div className="text-center space-y-6 max-w-2xl">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto">
              <ShoppingBag className="h-12 w-12 text-white/40" />
            </div>
            <h1 className="text-4xl font-bold text-white">Tu carrito está vacío</h1>
            <p className="text-white/60 text-lg">Agrega productos a tu carrito antes de proceder al checkout.</p>
            <Link href="/productos">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] hover:opacity-90 text-white"
              >
                Explorar Productos
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[rgb(15,15,35)]">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/productos"
            className="inline-flex items-center text-white/70 hover:text-[rgb(170,151,196)] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuar comprando
          </Link>

          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Checkout</h1>
            <p className="text-white/60 text-lg">Completa tu compra de forma segura</p>
          </div>

          {paymentError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <span className="block sm:inline">{paymentError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="bg-white/5 border-[rgb(74,34,86)]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      Información de Contacto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-white/80">
                          Nombre
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          required
                          className="bg-white/5 border-[rgb(74,34,86)] text-white placeholder:text-white/40"
                          placeholder="Juan"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-white/80">
                          Apellido
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          required
                          className="bg-white/5 border-[rgb(74,34,86)] text-white placeholder:text-white/40"
                          placeholder="Pérez"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white/80">
                        Correo Electrónico
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="bg-white/5 border-[rgb(74,34,86)] text-white placeholder:text-white/40"
                        placeholder="juan@ejemplo.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white/80">
                        Teléfono
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        className="bg-white/5 border-[rgb(74,34,86)] text-white placeholder:text-white/40"
                        placeholder="+52 442-145-7866"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-[rgb(74,34,86)]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      Información de Envío
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-white/80">
                        Dirección
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        required
                        className="bg-white/5 border-[rgb(74,34,86)] text-white placeholder:text-white/40"
                        placeholder="Calle Principal 123"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-white/80">
                          Ciudad
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          required
                          className="bg-white/5 border-[rgb(74,34,86)] text-white placeholder:text-white/40"
                          placeholder="Ciudad"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-white/80">
                          Estado/Provincia
                        </Label>
                        <Input
                          id="state"
                          name="state"
                          required
                          className="bg-white/5 border-[rgb(74,34,86)] text-white placeholder:text-white/40"
                          placeholder="Estado"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip" className="text-white/80">
                          Código Postal
                        </Label>
                        <Input
                          id="zip"
                          name="zip"
                          required
                          className="bg-white/5 border-[rgb(74,34,86)] text-white placeholder:text-white/40"
                          placeholder="12345"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-white/80">
                        Notas de Entrega (Opcional)
                      </Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        className="bg-white/5 border-[rgb(74,34,86)] text-white placeholder:text-white/40 min-h-[80px]"
                        placeholder="Instrucciones especiales para la entrega..."
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-[rgb(74,34,86)]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      Información de Pago
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber" className="text-white/80">
                        Número de Tarjeta
                      </Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          required
                          onChange={handleCardNumberChange}
                          className="bg-white/5 border-[rgb(74,34,86)] text-white placeholder:text-white/40"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                        {cardValidation && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <span
                              className={`text-xs font-semibold ${cardValidation.valid ? "text-green-400" : "text-red-400"}`}
                            >
                              {cardValidation.brand}
                            </span>
                          </div>
                        )}
                      </div>
                      {cardValidation && !cardValidation.valid && (
                        <p className="text-red-400 text-xs">Número de tarjeta inválido</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry" className="text-white/80">
                          Fecha de Expiración
                        </Label>
                        <Input
                          id="expiry"
                          name="expiry"
                          required
                          onChange={handleExpiryChange}
                          className="bg-white/5 border-[rgb(74,34,86)] text-white placeholder:text-white/40"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv" className="text-white/80">
                          CVV
                        </Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          required
                          type="password"
                          className="bg-white/5 border-[rgb(74,34,86)] text-white placeholder:text-white/40"
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-white/60 text-sm mt-4">
                      <Lock className="h-4 w-4 text-[rgb(170,151,196)]" />
                      <span>Tu información está protegida con encriptación SSL</span>
                    </div>

                    <div className="bg-[rgb(170,151,196)]/10 border border-[rgb(170,151,196)]/30 rounded-lg p-3 mt-4">
                      <p className="text-white/70 text-xs">
                        <strong className="text-[rgb(170,151,196)]">Modo de prueba:</strong> Usa cualquier tarjeta
                        válida según el algoritmo de Luhn. Ejemplo: 4532 1488 0343 6467
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isProcessing || (cardValidation !== null && !cardValidation.valid)}
                  className="w-full bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] hover:opacity-90 text-white text-lg h-14 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Procesando pago...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Completar Pedido (${total.toFixed(2)} MXN)
                    </>
                  )}
                </Button>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="bg-white/5 border-[rgb(74,34,86)]">
                  <CardHeader>
                    <CardTitle className="text-white">Resumen del Pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <div className="relative w-16 h-16 rounded-lg bg-gradient-to-br from-[rgb(74,34,86)] to-[rgb(104,43,78)] flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{item.name}</p>
                            <p className="text-white/50 text-xs">Cantidad: {item.quantity}</p>
                            <p className="text-[rgb(170,151,196)] text-sm font-semibold">
                              ${(item.price * item.quantity).toFixed(2)} MXN
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator className="bg-[rgb(74,34,86)]" />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-white/70">
                        <span>Subtotal:</span>
                        <span>${cartTotal.toFixed(2)} MXN</span>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Envío:</span>
                        <span>{shippingCost === 0 ? "Gratis" : `$${shippingCost.toFixed(2)} MXN`}</span>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Impuestos:</span>
                        <span>${tax.toFixed(2)} MXN</span>
                      </div>
                      <Separator className="bg-[rgb(74,34,86)]" />
                      <div className="flex justify-between text-white text-lg font-bold">
                        <span>Total:</span>
                        <span className="bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] bg-clip-text text-transparent">
                          ${total.toFixed(2)} MXN
                        </span>
                      </div>
                    </div>

                    {cartTotal < 50 && (
                      <div className="bg-[rgb(170,151,196)]/10 border border-[rgb(170,151,196)]/30 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-[rgb(170,151,196)] text-sm">
                          <Truck className="h-4 w-4" />
                          <span>Agrega ${(50 - cartTotal).toFixed(2)} MXN más para envío gratis</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div
          className={`border rounded-lg p-3 ${
            stripeEnvironment === "test"
              ? "bg-yellow-500/10 border-yellow-500/30"
              : "bg-green-500/10 border-green-500/30"
          }`}
        >
          <p className={`text-sm ${stripeEnvironment === "test" ? "text-yellow-200" : "text-green-200"}`}>
            {stripeEnvironment === "test" ? (
              <>🧪 Modo TEST: Este es un pago de prueba. No se procesarán cargos reales.</>
            ) : (
              <>✅ Modo PRODUCCIÓN: Los pagos son reales.</>
            )}
          </p>
        </div>
      </div>
    </main>
  )
}
