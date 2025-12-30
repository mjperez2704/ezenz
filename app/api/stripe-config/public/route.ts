import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    console.log("[v0 STRIPE CONFIG] Obteniendo configuración pública...")

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("stripe_config")
      .select("active_environment, test_publishable_key, production_publishable_key")
      .single()

    console.log("[v0 STRIPE CONFIG] Config desde BD:", {
      found: !!data,
      environment: data?.active_environment,
      hasTestKey: !!data?.test_publishable_key,
      hasProdKey: !!data?.production_publishable_key,
      error: error?.message,
    })

    // Si hay config en BD con claves, usarla
    if (data && !error) {
      const publishableKey =
        data.active_environment === "test" ? data.test_publishable_key : data.production_publishable_key

      if (publishableKey && publishableKey.length > 0) {
        console.log("[v0 STRIPE CONFIG] Retornando clave desde BD")
        return NextResponse.json({
          publishableKey,
          environment: data.active_environment,
        })
      }
    }

    // Fallback: Usar variables de entorno
    console.log("[v0 STRIPE CONFIG] Fallback: usando variables de entorno...")
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLISHABLE_KEY

    if (!publishableKey) {
      console.error("[v0 STRIPE CONFIG] ERROR: No hay publishable key")
      return NextResponse.json(
        {
          error:
            "No se encontró configuración de Stripe. Configure las claves en el backoffice o agregue STRIPE_PUBLISHABLE_KEY a las variables de entorno.",
        },
        { status: 500 },
      )
    }

    // Determinar ambiente según el prefijo de la clave
    const environment = publishableKey.startsWith("pk_live_") ? "production" : "test"

    console.log("[v0 STRIPE CONFIG] Retornando clave desde env:", environment)
    return NextResponse.json({
      publishableKey,
      environment,
    })
  } catch (error: any) {
    console.error("[v0 STRIPE CONFIG] Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
