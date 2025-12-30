import { type NextRequest, NextResponse } from "next/server"
import { processPayment, validateCard } from "@/lib/payment-service"
import { createClient } from "@/lib/supabase/server"

/**
 * Valida una tarjeta de crédito usando el algoritmo de Luhn
 * POST /api/mobile/v1/payments/validate
 */
export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()

    // Validar tarjeta
    if (action === "validate") {
      const { cardNumber } = data

      if (!cardNumber) {
        return NextResponse.json({ success: false, error: "Número de tarjeta requerido" }, { status: 400 })
      }

      const validation = validateCard(cardNumber)

      return NextResponse.json({
        success: true,
        data: {
          valid: validation.valid,
          brand: validation.brand,
        },
      })
    }

    // Procesar pago
    if (action === "process") {
      const { cardNumber, expiry, cvv, cardholderName, amount } = data

      if (!cardNumber || !expiry || !cvv || !cardholderName || !amount) {
        return NextResponse.json({ success: false, error: "Datos de pago incompletos" }, { status: 400 })
      }

      const paymentResult = await processPayment(
        {
          cardNumber,
          expiry,
          cvv,
          cardholderName,
        },
        amount,
      )

      if (!paymentResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: paymentResult.error || "Error al procesar el pago",
          },
          { status: 400 },
        )
      }

      return NextResponse.json({
        success: true,
        message: "Pago procesado exitosamente",
        data: {
          transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          amount,
          timestamp: new Date().toISOString(),
        },
      })
    }

    return NextResponse.json({ success: false, error: "Acción no válida" }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Error en el procesamiento" }, { status: 500 })
  }
}

/**
 * Obtiene los métodos de pago disponibles
 * GET /api/mobile/v1/payments
 */
export async function GET(request: NextRequest) {
  try {
    // Aquí podrías leer de la configuración de la base de datos
    // Por ahora retornamos los métodos disponibles
    return NextResponse.json({
      success: true,
      data: {
        methods: [
          {
            id: "credit_card",
            name: "Tarjeta de Crédito/Débito",
            brands: ["Visa", "Mastercard", "Amex", "Discover"],
            enabled: true,
          },
          {
            id: "cash_on_delivery",
            name: "Pago Contra Entrega",
            enabled: true,
          },
        ],
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Error al obtener métodos de pago" },
      { status: 500 },
    )
  }
}
