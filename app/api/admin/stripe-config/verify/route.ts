import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(request: Request) {
  try {
    console.log("[v0] POST /api/admin/stripe-config/verify - Verificando claves Stripe")

    const body = await request.json()
    const { environment, publishable_key, secret_key } = body

    console.log("[v0] Datos recibidos:", {
      environment,
      publishable_key_length: publishable_key?.length,
      secret_key_length: secret_key?.length,
      secret_key_prefix: secret_key?.substring(0, 15),
      secret_key_suffix: secret_key?.substring(secret_key?.length - 10),
      has_asterisks: secret_key?.includes("*"),
    })

    if (!secret_key || !publishable_key) {
      return NextResponse.json(
        {
          valid: false,
          error: "Faltan claves de Stripe para verificar",
        },
        { status: 400 },
      )
    }

    if (secret_key.includes("*")) {
      console.error("[v0] ERROR: La clave secreta contiene asteriscos!")
      return NextResponse.json(
        {
          valid: false,
          error: "La clave secreta no puede contener asteriscos. Debe ser la clave real de Stripe.",
        },
        { status: 400 },
      )
    }

    const expectedPrefix = environment === "test" ? "sk_test_" : "sk_live_"
    if (!secret_key.startsWith(expectedPrefix)) {
      return NextResponse.json(
        {
          valid: false,
          error: `La clave secreta debe empezar con ${expectedPrefix}`,
        },
        { status: 400 },
      )
    }

    try {
      const stripe = new Stripe(secret_key, {
        apiVersion: "2024-11-20.acacia",
      })

      const balance = await stripe.balance.retrieve()

      console.log("[v0] Claves Stripe verificadas correctamente:", {
        environment,
        currency: balance.available[0]?.currency || "N/A",
      })

      return NextResponse.json({
        valid: true,
        message: "Las claves de Stripe son válidas",
        currency: balance.available[0]?.currency,
      })
    } catch (stripeError: any) {
      console.error("[v0] Error al verificar claves Stripe:", stripeError.message)

      let errorMessage = stripeError.message || "Error al conectar con Stripe"

      // Detectar errores comunes y proporcionar soluciones
      if (stripeError.message?.includes("Invalid API Key")) {
        errorMessage = `La clave de API es inválida. Posibles causas:
        
1. La clave fue revocada o eliminada en el dashboard de Stripe
2. Copiaste una clave incorrecta (asegúrate de copiar la clave completa)
3. La cuenta de Stripe está suspendida o inactiva
4. Estás usando una clave de TEST cuando deberías usar PRODUCCIÓN (o viceversa)

Solución: Ve a https://dashboard.stripe.com/apikeys y genera nuevas claves de API. Asegúrate de copiar la clave completa cuando hagas clic en "Revelar clave"`
      } else if (stripeError.message?.includes("expired")) {
        errorMessage = "La clave de API ha expirado. Genera una nueva en el dashboard de Stripe."
      } else if (stripeError.message?.includes("restricted")) {
        errorMessage = "La clave de API tiene restricciones. Usa una clave con permisos completos."
      }

      return NextResponse.json(
        {
          valid: false,
          error: errorMessage,
          raw_error: stripeError.message,
        },
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error("[v0] Error en verificación:", error)
    return NextResponse.json(
      {
        valid: false,
        error: "Error interno al verificar las claves",
      },
      { status: 500 },
    )
  }
}
