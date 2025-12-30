import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Tabla virtual de métodos de pago guardados
// En producción esto debería estar en Supabase o usar Stripe Customer
const savedPaymentMethods = new Map<string, any[]>()

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 })
    }

    // Obtener métodos de pago del usuario desde sus pedidos anteriores
    const { data: orders, error } = await supabase
      .from("orders")
      .select("payment_method")
      .eq("customer_email", user.email!)
      .order("created_at", { ascending: false })
      .limit(5)

    if (error) throw error

    // Extraer métodos únicos
    const uniqueMethods = new Map()
    orders?.forEach((order: any) => {
      const [brand, last4] = order.payment_method.split(" ****")
      const key = `${brand}-${last4}`
      if (!uniqueMethods.has(key) && last4 !== "0000") {
        uniqueMethods.set(key, {
          id: key,
          brand,
          last4,
          type: "card",
        })
      }
    })

    return NextResponse.json({
      success: true,
      data: Array.from(uniqueMethods.values()),
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Error al obtener métodos de pago" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 })
    }

    const paymentMethod = await request.json()

    // Validar datos
    if (!paymentMethod.cardNumber || !paymentMethod.expiry || !paymentMethod.cvv) {
      return NextResponse.json({ success: false, error: "Datos de tarjeta incompletos" }, { status: 400 })
    }

    // En producción, aquí se tokenizaría con Stripe
    const last4 = paymentMethod.cardNumber.slice(-4)
    const brand = detectCardBrand(paymentMethod.cardNumber)

    return NextResponse.json({
      success: true,
      message: "Método de pago guardado exitosamente",
      data: {
        id: `${brand}-${last4}`,
        brand,
        last4,
        type: "card",
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Error al guardar método de pago" },
      { status: 500 },
    )
  }
}

function detectCardBrand(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, "")
  if (digits.startsWith("4")) return "Visa"
  if (digits.startsWith("5")) return "Mastercard"
  if (digits.startsWith("3")) return "Amex"
  return "Card"
}
