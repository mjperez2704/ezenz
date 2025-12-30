/**
 * Script de Prueba del Webhook de Stripe
 *
 * Este script permite probar el webhook de Stripe localmente sin necesidad
 * de hacer compras reales. Simula los eventos que Stripe enviaría.
 *
 * Uso:
 * 1. Asegúrate de que tu servidor Next.js esté corriendo: npm run dev
 * 2. Ejecuta este script: npx tsx scripts/test-stripe-webhook.ts
 */

import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20.acacia",
})

// Colores para consola
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
}

async function testWebhook() {
  console.log(`${colors.bright}${colors.cyan}`)
  console.log("╔════════════════════════════════════════════════════╗")
  console.log("║    STRIPE WEBHOOK TEST - STARDUST                 ║")
  console.log("╚════════════════════════════════════════════════════╝")
  console.log(colors.reset)

  try {
    // Paso 1: Crear un producto de prueba
    console.log(`${colors.blue}📦 Creando producto de prueba...${colors.reset}`)
    const product = await stripe.products.create({
      name: "Producto de Prueba Webhook",
      description: "Este es un producto de prueba para validar el webhook",
    })
    console.log(`${colors.green}✓ Producto creado: ${product.id}${colors.reset}\n`)

    // Paso 2: Crear un precio
    console.log(`${colors.blue}💰 Creando precio...${colors.reset}`)
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 2999, // $29.99
      currency: "mxn",
    })
    console.log(`${colors.green}✓ Precio creado: ${price.id} - $29.99 MXN${colors.reset}\n`)

    // Paso 3: Crear una sesión de Checkout
    console.log(`${colors.blue}🛒 Creando sesión de Checkout...${colors.reset}`)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/confirmacion/{CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/checkout",
      metadata: {
        orderId: "TEST-ORD-" + Date.now(),
        test: "true",
      },
    })
    console.log(`${colors.green}✓ Sesión creada: ${session.id}${colors.reset}`)
    console.log(`${colors.cyan}  URL de pago: ${session.url}${colors.reset}\n`)

    // Paso 4: Instrucciones para probar
    console.log(`${colors.bright}${colors.yellow}`)
    console.log("╔════════════════════════════════════════════════════╗")
    console.log("║               INSTRUCCIONES DE PRUEBA             ║")
    console.log("╚════════════════════════════════════════════════════╝")
    console.log(colors.reset)

    console.log(`\n${colors.cyan}1. Configuración del Webhook:${colors.reset}`)
    console.log("   - Ve a: https://dashboard.stripe.com/test/webhooks")
    console.log("   - Crea un endpoint: http://localhost:3000/api/stripe/webhook")
    console.log("   - Selecciona eventos: checkout.session.completed")
    console.log("   - Copia el Signing Secret (whsec_...)")
    console.log("   - Agrégalo a .env.local como STRIPE_WEBHOOK_SECRET\n")

    console.log(`${colors.cyan}2. Stripe CLI (Recomendado):${colors.reset}`)
    console.log("   En una terminal separada ejecuta:")
    console.log(`   ${colors.bright}stripe listen --forward-to localhost:3000/api/stripe/webhook${colors.reset}`)
    console.log("   Luego en otra terminal:")
    console.log(`   ${colors.bright}stripe trigger checkout.session.completed${colors.reset}\n`)

    console.log(`${colors.cyan}3. Prueba Manual:${colors.reset}`)
    console.log(`   Abre esta URL en tu navegador:`)
    console.log(`   ${colors.bright}${session.url}${colors.reset}`)
    console.log(`\n   Usa una tarjeta de prueba:`)
    console.log(`   ${colors.green}✓ Número: 4242 4242 4242 4242${colors.reset}`)
    console.log(`   ${colors.green}✓ Fecha: Cualquier fecha futura (ej: 12/34)${colors.reset}`)
    console.log(`   ${colors.green}✓ CVC: Cualquier 3 dígitos (ej: 123)${colors.reset}`)
    console.log(`   ${colors.green}✓ Código postal: Cualquiera${colors.reset}\n`)

    console.log(`${colors.cyan}4. Verificar el Webhook:${colors.reset}`)
    console.log("   - Revisa los logs de tu servidor Next.js")
    console.log("   - Busca: [Stripe Webhook] Received event")
    console.log("   - Ve al Dashboard de Stripe > Webhooks > Events")
    console.log("   - Verifica que el status sea 200 (exitoso)\n")

    console.log(`${colors.cyan}5. Verificar Base de Datos:${colors.reset}`)
    console.log("   Ejecuta en tu DB:")
    console.log(`   ${colors.bright}SELECT * FROM orders WHERE id = 'TEST-ORD-${Date.now()}';${colors.reset}`)
    console.log('   El payment_status debería ser "paid"\n')

    console.log(`${colors.bright}${colors.yellow}`)
    console.log("╔════════════════════════════════════════════════════╗")
    console.log("║              TARJETAS DE PRUEBA                   ║")
    console.log("╚════════════════════════════════════════════════════╝")
    console.log(colors.reset)

    console.log(`\n${colors.green}✓ Pago exitoso:${colors.reset}`)
    console.log("  4242 4242 4242 4242\n")

    console.log(`${colors.red}✗ Pago rechazado:${colors.reset}`)
    console.log("  4000 0000 0000 0002\n")

    console.log(`${colors.yellow}⚠ Requiere autenticación (3D Secure):${colors.reset}`)
    console.log("  4000 0025 0000 3155\n")

    console.log(`${colors.blue}ℹ Más tarjetas de prueba:${colors.reset}`)
    console.log("  https://stripe.com/docs/testing\n")

    console.log(`${colors.bright}${colors.green}`)
    console.log("╔════════════════════════════════════════════════════╗")
    console.log("║              TEST COMPLETADO                      ║")
    console.log("╚════════════════════════════════════════════════════╝")
    console.log(colors.reset)

    console.log(`\n${colors.cyan}Session ID:${colors.reset} ${session.id}`)
    console.log(`${colors.cyan}Order ID:${colors.reset} TEST-ORD-${Date.now()}`)
    console.log(`${colors.cyan}Amount:${colors.reset} $29.99 MXN\n`)
  } catch (error: any) {
    console.log(`\n${colors.red}✗ Error: ${error.message}${colors.reset}`)
    console.log(`\n${colors.yellow}Asegúrate de que:${colors.reset}`)
    console.log("1. Tu STRIPE_SECRET_KEY esté configurada en .env.local")
    console.log("2. Tu servidor Next.js esté corriendo (npm run dev)")
    console.log("3. Tengas conexión a internet\n")
    process.exit(1)
  }
}

// Ejecutar el test
testWebhook()
