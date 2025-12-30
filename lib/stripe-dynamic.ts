import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"

export async function getStripeInstance(): Promise<Stripe> {
  console.log("[v0 STRIPE] Iniciando getStripeInstance...")

  // Primero intentar obtener desde base de datos
  try {
    const supabase = await createClient()
    const { data: config, error } = await supabase
      .from("stripe_config")
      .select("active_environment, test_secret_key, production_secret_key")
      .single()

    console.log("[v0 STRIPE] Config desde BD:", {
      found: !!config,
      environment: config?.active_environment,
      hasTestKey: !!config?.test_secret_key,
      hasProdKey: !!config?.production_secret_key,
      error: error?.message,
    })

    if (config) {
      const secretKey = config.active_environment === "test" ? config.test_secret_key : config.production_secret_key

      if (secretKey && secretKey.length > 0) {
        console.log("[v0 STRIPE] Usando clave desde BD:", config.active_environment)
        return new Stripe(secretKey, {
          apiVersion: "2024-11-20.acacia",
          typescript: true,
        })
      }
    }
  } catch (error) {
    console.error("[v0 STRIPE] Error consultando BD:", error)
  }

  // Fallback: Usar variables de entorno de Vercel
  console.log("[v0 STRIPE] Fallback: usando variables de entorno...")
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    console.error("[v0 STRIPE] ERROR CRÍTICO: No hay STRIPE_SECRET_KEY en env ni en BD")
    throw new Error(
      "No se encontró configuración de Stripe. Configure las claves en el backoffice o en las variables de entorno.",
    )
  }

  console.log("[v0 STRIPE] Usando STRIPE_SECRET_KEY desde variables de entorno")
  return new Stripe(secretKey, {
    apiVersion: "2024-11-20.acacia",
    typescript: true,
  })
}

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
  const stripe = await getStripeInstance()
  const { items, customerEmail, orderId, successUrl, cancelUrl, metadata } = params

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
    price_data: {
      currency: "mxn",
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }))

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

export async function constructWebhookEvent(payload: string | Buffer, signature: string) {
  const stripe = await getStripeInstance()
  const supabase = await createClient()

  const { data: config } = await supabase
    .from("stripe_config")
    .select("active_environment, test_webhook_secret, production_webhook_secret")
    .single()

  if (!config) {
    throw new Error("No se encontró configuración de Stripe")
  }

  const webhookSecret =
    config.active_environment === "test" ? config.test_webhook_secret : config.production_webhook_secret

  if (!webhookSecret) {
    throw new Error(`No hay webhook secret configurado para el ambiente: ${config.active_environment}`)
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}

export async function getCheckoutSession(sessionId: string) {
  const stripe = await getStripeInstance()
  return await stripe.checkout.sessions.retrieve(sessionId)
}

export async function getPaymentIntent(paymentIntentId: string) {
  const stripe = await getStripeInstance()
  return await stripe.paymentIntents.retrieve(paymentIntentId)
}
