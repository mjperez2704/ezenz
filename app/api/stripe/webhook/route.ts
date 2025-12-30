import { type NextRequest, NextResponse } from "next/server"
import { constructWebhookEvent, getCheckoutSession } from "@/lib/stripe-dynamic"
import { saveOrder } from "@/lib/payment-service"
import type { OrderData } from "@/lib/payment-service"
import { StockService } from "@/lib/stock-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "No signature found" }, { status: 400 })
    }

    // Verificar y construir el evento del webhook
    const event = constructWebhookEvent(body, signature)

    console.log("[v0] Stripe webhook received:", event.type)

    // Manejar diferentes tipos de eventos
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object

        console.log("[v0] Checkout session completed:", session.id)

        // Obtener detalles completos de la sesión
        const fullSession = await getCheckoutSession(session.id)

        // Extraer metadata
        const metadata = fullSession.metadata || {}
        const orderId = metadata.orderId
        const customerInfo = {
          firstName: metadata.customerName?.split(" ")[0] || "",
          lastName: metadata.customerName?.split(" ").slice(1).join(" ") || "",
          email: fullSession.customer_details?.email || "",
          phone: metadata.customerPhone || fullSession.customer_details?.phone || "",
        }

        const shippingAddress = JSON.parse(metadata.shippingAddress || "{}")

        // Obtener items de la sesión
        const lineItems = await getCheckoutSession(session.id)

        // Completar reserva de stock
        const sessionId = metadata.sessionId
        if (sessionId) {
          await StockService.completeReservation(sessionId)
        }

        // Guardar la orden en la base de datos
        const orderData: OrderData = {
          orderId,
          customerInfo,
          shippingAddress,
          items: [], // Los items se obtienen de metadata o se pasan por separado
          subtotal: Number.parseFloat(metadata.subtotal || "0"),
          shipping: Number.parseFloat(metadata.shipping || "0"),
          tax: Number.parseFloat(metadata.tax || "0"),
          total: fullSession.amount_total ? fullSession.amount_total / 100 : 0,
          paymentMethod: {
            last4: "****",
            brand: "Stripe",
          },
          status: "completed",
          createdAt: new Date().toISOString(),
        }

        await saveOrder(orderData)

        // Enviar email de confirmación
        try {
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-order-confirmation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: customerInfo.email,
              customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
              orderId: orderData.orderId,
              orderTotal: orderData.total,
              orderItems: orderData.items,
            }),
          })
        } catch (error) {
          console.error("[v0] Error sending confirmation email:", error)
        }

        console.log("[v0] Order saved successfully:", orderId)
        break
      }

      case "checkout.session.expired": {
        const session = event.data.object
        const metadata = session.metadata || {}
        const sessionId = metadata.sessionId

        // Liberar reserva de stock
        if (sessionId) {
          await StockService.cancelReservation(sessionId)
        }

        console.log("[v0] Checkout session expired, stock reservation released")
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object
        console.log("[v0] Payment failed:", paymentIntent.id)
        break
      }

      default:
        console.log("[v0] Unhandled event type:", event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: error.message || "Webhook error" }, { status: 400 })
  }
}
