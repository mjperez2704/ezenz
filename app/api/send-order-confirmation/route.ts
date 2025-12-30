import { NextResponse } from "next/server"
import { sendEmail, getOrderConfirmationEmailHTML } from "@/lib/email-service"

export async function POST(request: Request) {
  try {
    const { email, customerName, orderId, orderTotal, orderItems } = await request.json()

    if (!email || !customerName || !orderId || !orderTotal || !orderItems) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const html = getOrderConfirmationEmailHTML(customerName, orderId, orderTotal, orderItems)
    const result = await sendEmail({
      to: email,
      subject: `Confirmación de Pedido #${orderId} - STARDUST`,
      html,
    })

    if (!result.success) {
      throw new Error(result.error || "Failed to send email")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending order confirmation email:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send email" },
      { status: 500 },
    )
  }
}
