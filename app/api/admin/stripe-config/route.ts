import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Función helper para enmascarar claves (mostrar solo primeros y últimos caracteres)
function maskKey(key: string): string {
  if (!key || key.length < 20) return key
  const start = key.substring(0, 15)
  const end = key.substring(key.length - 4)
  return `${start}${"*".repeat(key.length - 19)}${end}`
}

// GET - Obtener configuración de Stripe
export async function GET() {
  try {
    console.log("[v0] GET /api/admin/stripe-config - Iniciando...")
    const supabase = await createClient()

    const { data, error } = await supabase.from("stripe_config").select("*").single()

    if (error && error.code === "PGRST116") {
      console.log("[v0] No existe configuración de Stripe, creando registro inicial...")

      const defaultConfig = {
        active_environment: "test" as const,
        test_publishable_key: "",
        test_secret_key: "",
        test_webhook_secret: "",
        production_publishable_key: "",
        production_secret_key: "",
        production_webhook_secret: "",
        currency: "mxn",
        force_test_purchase: false,
      }

      const { data: newData, error: insertError } = await supabase
        .from("stripe_config")
        .insert(defaultConfig)
        .select()
        .single()

      if (insertError) {
        console.error("[v0] Error creando configuración inicial:", insertError)
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }

      console.log("[v0] Configuración inicial creada exitosamente")
      return NextResponse.json(newData)
    }

    if (error) {
      console.error("[v0] Error fetching stripe config:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const maskedData = {
      ...data,
      test_secret_key: data.test_secret_key ? maskKey(data.test_secret_key) : "",
      test_webhook_secret: data.test_webhook_secret ? maskKey(data.test_webhook_secret) : "",
      production_secret_key: data.production_secret_key ? maskKey(data.production_secret_key) : "",
      production_webhook_secret: data.production_webhook_secret ? maskKey(data.production_webhook_secret) : "",
    }

    console.log("[v0] Configuración de Stripe cargada exitosamente")
    return NextResponse.json(maskedData)
  } catch (error: any) {
    console.error("[v0] Error in GET /api/admin/stripe-config:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Actualizar configuración de Stripe
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const updateData: any = {
      active_environment: body.active_environment,
      currency: body.currency || "mxn",
      force_test_purchase: body.force_test_purchase || false,
    }

    // Solo actualizar claves que no contengan asteriscos (claves reales nuevas)
    if (body.test_publishable_key) {
      updateData.test_publishable_key = body.test_publishable_key
    }
    if (body.test_secret_key && !body.test_secret_key.includes("*")) {
      updateData.test_secret_key = body.test_secret_key
    }
    if (body.test_webhook_secret && !body.test_webhook_secret.includes("*")) {
      updateData.test_webhook_secret = body.test_webhook_secret
    }
    if (body.production_publishable_key) {
      updateData.production_publishable_key = body.production_publishable_key
    }
    if (body.production_secret_key && !body.production_secret_key.includes("*")) {
      updateData.production_secret_key = body.production_secret_key
    }
    if (body.production_webhook_secret && !body.production_webhook_secret.includes("*")) {
      updateData.production_webhook_secret = body.production_webhook_secret
    }

    const { data, error } = await supabase.from("stripe_config").update(updateData).eq("id", body.id).select().single()

    if (error) {
      console.error("[v0] Error updating stripe config:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Enmascarar claves en la respuesta
    const maskedResponse = {
      ...data,
      test_secret_key: data.test_secret_key ? maskKey(data.test_secret_key) : "",
      test_webhook_secret: data.test_webhook_secret ? maskKey(data.test_webhook_secret) : "",
      production_secret_key: data.production_secret_key ? maskKey(data.production_secret_key) : "",
      production_webhook_secret: data.production_webhook_secret ? maskKey(data.production_webhook_secret) : "",
    }

    return NextResponse.json(maskedResponse)
  } catch (error: any) {
    console.error("[v0] Error in PUT /api/admin/stripe-config:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
