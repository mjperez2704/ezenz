import Stripe from "stripe"

// Inicializar Stripe con la clave secreta
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
})

// Función para crear una sesión de Stripe Checkout
export async function createCheckoutSession(params: {
  items: Array<{
    name: string
    price: number
    quantity: number
    image?: string
  }>
  customerEmail: string
  orderId: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  const { items, customerEmail, orderId, successUrl, cancelUrl, metadata } = params

  // Crear line items para Stripe
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
    price_data: {
      currency: "mxn",
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [],
      },
      unit_amount: Math.round(item.price * 100), // Convertir a centavos
    },
    quantity: item.quantity,
  }))

  // Crear sesión de checkout
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    customer_email: customerEmail,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      orderId,
      ...metadata,
    },
    shipping_address_collection: {
      allowed_countries: ["MX", "US", "CA"],
    },
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
  })

  return session
}

// Función para verificar el webhook signature
export function constructWebhookEvent(payload: string | Buffer, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET no está configurado")
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}

// Función para obtener una sesión de checkout
export async function getCheckoutSession(sessionId: string) {
  return await stripe.checkout.sessions.retrieve(sessionId)
}

// Función para obtener un Payment Intent
export async function getPaymentIntent(paymentIntentId: string) {
  return await stripe.paymentIntents.retrieve(paymentIntentId)
}
