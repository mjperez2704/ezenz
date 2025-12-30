import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * Crea una sesión de pago de Stripe (para integración futura real)
 * POST /api/mobile/v1/payments/stripe-session
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { orderId, amount, items } = await request.json()

    if (!orderId || !amount) {
      return NextResponse.json({ success: false, error: "orderId y amount requeridos" }, { status: 400 })
    }

    // TODO: Implementar integración real con Stripe
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    // const session = await stripe.checkout.sessions.create({
    //   mode: 'payment',
    //   line_items: items,
    //   success_url: `${process.env.NEXT_PUBLIC_URL}/confirmacion/${orderId}`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout`,
    // })

    // Por ahora, retornamos una sesión simulada
    return NextResponse.json({
      success: true,
      data: {
        sessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
        url: `https://checkout.stripe.com/pay/cs_test_mock`,
      },
      message: "Sesión de Stripe creada (simulada)",
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Error al crear sesión de Stripe" },
      { status: 500 },
    )
  }
}
