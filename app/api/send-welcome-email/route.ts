import { NextResponse } from "next/server"
import { sendEmail, getWelcomeEmailHTML } from "@/lib/email-service"

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 })
    }

    const html = getWelcomeEmailHTML(name)
    const result = await sendEmail({
      to: email,
      subject: "¡Bienvenido a EZENZ!",
      html,
    })

    if (!result.success) {
      throw new Error(result.error || "Failed to send email")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send email" },
      { status: 500 },
    )
  }
}
