import { type NextRequest, NextResponse } from "next/server"
import { createCheckoutSession } from "@/lib/stripe-dynamic"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0 API CHECKOUT] Iniciando creación de sesión...")

    const body = await request.json()
    const { items, customerEmail, orderId, customerInfo, shippingAddress, subtotal, shipping, tax, total } = body

    console.log("[v0 API CHECKOUT] Datos recibidos:", {
      itemsCount: items?.length,
      email: customerEmail,
      orderId,
      total,
    })

    // Validar datos requeridos
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Items son requeridos" }, { status: 400 })
    }

    if (!customerEmail) {
      return NextResponse.json({ error: "Email del cliente es requerido" }, { status: 400 })
    }

    if (!orderId) {
      return NextResponse.json({ error: "Order ID es requerido" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: stripeConfig } = await supabase
      .from("stripe_config")
      .select("force_test_purchase, active_environment")
      .single()

    const forceTestMode = stripeConfig?.force_test_purchase && stripeConfig?.active_environment === "test"

    console.log("[v0 API CHECKOUT] Configuración:", {
      forceTestMode,
      active_environment: stripeConfig?.active_environment,
    })

    if (forceTestMode) {
      console.log("[v0 API CHECKOUT] 🎭 MODO PRUEBA FORZADA ACTIVO - Simulando compra exitosa")

      const testOrderId = orderId || `TEST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      const orderData = {
        id: testOrderId,
        user_id: null,
        customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customer_email: customerEmail,
        customer_phone: customerInfo.phone,
        shipping_address: shippingAddress,
        items: items.map((item: any) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        subtotal,
        shipping,
        tax,
        total,
        payment_method: "test_card",
        status: "paid",
      }

      // Guardar orden en la base de datos
      const { data: savedOrder, error: orderError } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single()

      if (orderError) {
        console.error("[v0 API CHECKOUT] Error al guardar orden de prueba:", orderError)
        throw new Error("Error al crear orden de prueba: " + orderError.message)
      }

      console.log("[v0 API CHECKOUT] ✅ Orden de prueba guardada en BD:", savedOrder.id)

      // TODO: Crear función decrease_product_stock en Supabase
      /*
      for (const item of items) {
        const { error: stockError } = await supabase.rpc("decrease_product_stock", {
          p_id: item.id,
          p_quantity: item.quantity,
        })

        if (stockError) {
          console.error("[v0 API CHECKOUT] Error actualizando stock:", stockError)
        }
      }
      */

      // TODO: Configurar endpoint de email correctamente
      /*
      try {
        const baseUrlEmail = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin
        await fetch(`${baseUrlEmail}/api/send-order-confirmation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: customerEmail,
            customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
            orderId: testOrderId,
            orderTotal: total,
            orderItems: items,
          }),
        })
        console.log("[v0 API CHECKOUT] ✉️ Email de confirmación enviado")
      } catch (emailError) {
        console.error("[v0 API CHECKOUT] Error enviando email:", emailError)
      }
      */

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin
      const successUrl = `${baseUrl}/confirmacion/${testOrderId}?test_mode=true`

      console.log("[v0 API CHECKOUT] ✓ Compra simulada completada exitosamente")

      return NextResponse.json({
        sessionId: `test_session_${testOrderId}`,
        url: successUrl,
        testMode: true,
        orderId: testOrderId,
      })
    }

    // URLs de éxito y cancelación
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin
    const successUrl = `${baseUrl}/confirmacion/${orderId}?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}/checkout?canceled=true`

    console.log("[v0 API CHECKOUT] Llamando a createCheckoutSession...")

    const session = await createCheckoutSession({
      items,
      customerEmail,
      orderId,
      successUrl,
      cancelUrl,
      metadata: {
        orderId,
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customerPhone: customerInfo.phone,
        shippingAddress: JSON.stringify(shippingAddress),
        subtotal: subtotal.toString(),
        shipping: shipping.toString(),
        tax: tax.toString(),
        total: total.toString(),
      },
    })

    console.log("[v0 API CHECKOUT] Sesión creada exitosamente:", {
      sessionId: session.id,
      hasUrl: !!session.url,
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error: any) {
    console.error("[v0 API CHECKOUT] Error completo:", error)
    console.error("[v0 API CHECKOUT] Stack:", error.stack)

    return NextResponse.json(
      {
        error: error.message || "Error al crear sesión de pago",
      },
      { status: 500 },
    )
  }
}
