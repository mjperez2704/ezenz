import { db } from "@/lib/database"

interface EmailData {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailData) {
  console.log("[v0] Email que se enviaría:", { to, subject })
  console.log("[v0] HTML:", html.substring(0, 200) + "...")
  return { success: true, message: "Email logged (Resend integration removed)" }
}

export async function getWelcomeEmailHTML(userName: string): Promise<string> {
  // Intentar obtener template de la base de datos
  const template = await db.getEditableContent("email_welcome_template")

  if (template?.content) {
    // Reemplazar variables en el template
    return template.content
      .replace(/\{\{customerName\}\}/g, userName)
      .replace(/\{\{siteUrl\}\}/g, process.env.NEXT_PUBLIC_SITE_URL || "https://stardustharmony.com")
  }

  // Template por defecto si no hay uno en la base de datos
  return getDefaultWelcomeEmail(userName)
}

export async function getOrderConfirmationEmailHTML(
  customerName: string,
  orderId: string,
  orderTotal: number,
  orderItems: Array<{ name: string; quantity: number; price: number }>,
): Promise<string> {
  // Intentar obtener template de la base de datos
  const template = await db.getEditableContent("email_order_confirmation_template")

  if (template?.content) {
    // Crear HTML de items
    const itemsHTML = orderItems
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid rgba(170,151,196,0.1);">
            <p style="color: #ffffff; margin: 0; font-size: 15px;">${item.name}</p>
            <p style="color: rgba(255,255,255,0.6); margin: 4px 0 0 0; font-size: 13px;">Cantidad: ${item.quantity}</p>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid rgba(170,151,196,0.1); text-align: right;">
            <p style="color: #ffffff; margin: 0; font-size: 15px; font-weight: 600;">$${(item.price * item.quantity).toFixed(2)} MXN</p>
          </td>
        </tr>
      `,
      )
      .join("")

    // Reemplazar variables en el template
    return template.content
      .replace(/\{\{customerName\}\}/g, customerName)
      .replace(/\{\{orderId\}\}/g, orderId)
      .replace(/\{\{orderTotal\}\}/g, orderTotal.toFixed(2))
      .replace(/\{\{orderItems\}\}/g, itemsHTML)
      .replace(/\{\{siteUrl\}\}/g, process.env.NEXT_PUBLIC_SITE_URL || "https://stardustharmony.com")
  }

  // Template por defecto si no hay uno en la base de datos
  return getDefaultOrderConfirmationEmail(customerName, orderId, orderTotal, orderItems)
}

// Templates por defecto (fallback)
function getDefaultWelcomeEmail(userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido a STARDUST</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Montserrat', Arial, sans-serif; background: linear-gradient(135deg, #0f0f23 0%, #231f37 100%);">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0f0f23 0%, #231f37 100%); padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(170,151,196,0.3); border-radius: 16px; overflow: hidden; backdrop-filter: blur(10px);">
                <tr>
                  <td style="padding: 40px; text-align: center; background: linear-gradient(135deg, rgba(170,151,196,0.1) 0%, rgba(201,18,64,0.1) 100%);">
                    <h1 style="color: #ffffff; font-size: 32px; margin: 0 0 10px 0; font-weight: 700;">✨ STARDUST</h1>
                    <p style="color: rgba(255,255,255,0.7); font-size: 16px; margin: 0;">Pursuit of Harmony</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 20px 0;">¡Bienvenido, ${userName}!</h2>
                    <p style="color: rgba(255,255,255,0.8); font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Gracias por unirte a nuestra comunidad cósmica. En STARDUST, creemos en el poder de la naturaleza para restaurar el equilibrio entre cuerpo, mente y espíritu.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px; text-align: center; border-top: 1px solid rgba(170,151,196,0.2);">
                    <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin: 0;">
                      © ${new Date().getFullYear()} STARDUST. Todos los derechos reservados.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

function getDefaultOrderConfirmationEmail(
  customerName: string,
  orderId: string,
  orderTotal: number,
  orderItems: Array<{ name: string; quantity: number; price: number }>,
): string {
  const itemsHTML = orderItems
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid rgba(170,151,196,0.1);">
          <p style="color: #ffffff; margin: 0; font-size: 15px;">${item.name}</p>
          <p style="color: rgba(255,255,255,0.6); margin: 4px 0 0 0; font-size: 13px;">Cantidad: ${item.quantity}</p>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid rgba(170,151,196,0.1); text-align: right;">
          <p style="color: #ffffff; margin: 0; font-size: 15px; font-weight: 600;">$${(item.price * item.quantity).toFixed(2)} MXN</p>
        </td>
      </tr>
    `,
    )
    .join("")

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Pedido</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Montserrat', Arial, sans-serif; background: linear-gradient(135deg, #0f0f23 0%, #231f37 100%);">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0f0f23 0%, #231f37 100%); padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(170,151,196,0.3); border-radius: 16px; overflow: hidden;">
                <tr>
                  <td style="padding: 40px; text-align: center; background: linear-gradient(135deg, rgba(170,151,196,0.1) 0%, rgba(201,18,64,0.1) 100%);">
                    <h1 style="color: #ffffff; font-size: 28px; margin: 0;">¡Pedido Confirmado!</h1>
                    <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 10px 0 0 0;">Pedido #${orderId}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 0 0 30px 0;">
                      Hola ${customerName}, gracias por tu compra.
                    </p>
                    <h3 style="color: #ffffff; font-size: 18px; margin: 0 0 16px 0;">Resumen del pedido</h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${itemsHTML}
                      <tr>
                        <td style="padding: 16px 12px 0 12px;">
                          <p style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 700;">Total</p>
                        </td>
                        <td style="padding: 16px 12px 0 12px; text-align: right;">
                          <p style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">$${orderTotal.toFixed(2)} MXN</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px; text-align: center; border-top: 1px solid rgba(170,151,196,0.2);">
                    <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin: 0;">
                      © ${new Date().getFullYear()} STARDUST. Todos los derechos reservados.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}
