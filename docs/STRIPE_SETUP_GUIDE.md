# Guía de Configuración de Stripe - STARDUST

## 📋 Resumen

Esta guía te ayudará a configurar Stripe para aceptar pagos reales en STARDUST.

---

## 🔑 Credenciales Actuales (Modo Test)

Ya tienes las siguientes credenciales de prueba configuradas:

\`\`\`
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SGIZfJokTolILlVli3GTC5ilQj1XKs1E1kKFWPBXuLnpToxe1WsFEq431ENAY7mRqnh9Y8w4W3v4mwlu3BI3Y5GyoOX47EXoRu

STRIPE_SECRET_KEY=sk_test_51SGIZfJokTolILlV4kcA3QgZFjSuj5G18vIj63ujgVqzS8VC9Qk8DP3YLEOL8LTEiKvHRouRRkOBlHpazIdItoRuo0k6CdFG7z
\`\`\`

---

## ⚙️ Configuración Paso a Paso

### 1. Agregar Variables de Entorno

#### En Desarrollo (local):

Crea/edita el archivo `.env.local`:

\`\`\`bash
# Stripe Keys (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SGIZfJokTolILlVli3GTC5ilQj1XKs1E1kKFWPBXuLnpToxe1WsFEq431ENAY7mRqnh9Y8w4W3v4mwlu3BI3Y5GyoOX47EXoRu
STRIPE_SECRET_KEY=sk_test_51SGIZfJokTolILlV4kcA3QgZFjSuj5G18vIj63ujgVqzS8VC9Qk8DP3YLEOL8LTEiKvHRouRRkOBlHpazIdItoRuo0k6CdFG7z
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx

# Base URL para redirecciones
NEXT_PUBLIC_BASE_URL=http://localhost:3000
\`\`\`

#### En Producción (Vercel):

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega cada variable con su valor
4. Selecciona los ambientes (Production, Preview, Development)

---

### 2. Configurar Webhook de Stripe

Los webhooks son necesarios para recibir notificaciones de pagos completados.

#### A. En Modo Test (Desarrollo Local):

**Opción 1: Usar Stripe CLI (Recomendado)**

\`\`\`bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# Login a Stripe
stripe login

# Reenviar eventos a tu servidor local
stripe listen --forward-to localhost:3000/api/stripe/webhook
\`\`\`

Esto te dará un webhook secret como: `whsec_xxxxx`

**Opción 2: Usar Localhost Tunnel**

\`\`\`bash
# Instalar ngrok
npm install -g ngrok

# Crear tunnel
ngrok http 3000

# Usar la URL de ngrok para configurar webhook en Stripe Dashboard
\`\`\`

#### B. En Producción:

1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click en "Add endpoint"
3. URL del endpoint: `https://tudominio.com/api/stripe/webhook`
4. Selecciona eventos a escuchar:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`
5. Copia el "Signing secret" y agrégalo a `STRIPE_WEBHOOK_SECRET`

---

### 3. Instalar Dependencias

\`\`\`bash
npm install stripe @stripe/stripe-js
\`\`\`

---

### 4. Probar la Integración

#### Tarjetas de Prueba de Stripe:

En modo test, usa estas tarjetas:

**Pago Exitoso:**
\`\`\`
Número: 4242 4242 4242 4242
Fecha: Cualquier fecha futura (ej: 12/25)
CVV: Cualquier 3 dígitos (ej: 123)
\`\`\`

**Pago Rechazado:**
\`\`\`
Número: 4000 0000 0000 0002
\`\`\`

**Requiere Autenticación 3D Secure:**
\`\`\`
Número: 4000 0025 0000 3155
\`\`\`

#### Flujo de Prueba:

1. Agrega productos al carrito
2. Ve a checkout
3. Completa información de envío
4. Click en "Completar Pedido"
5. Serás redirigido a Stripe Checkout
6. Completa el pago con una tarjeta de prueba
7. Serás redirigido a la página de confirmación

---

### 5. Verificar Webhooks

#### Logs de Desarrollo:

\`\`\`bash
# Ver logs de webhook en consola del servidor
npm run dev

# Ver eventos en Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook
\`\`\`

#### Logs de Producción:

1. Ve a Stripe Dashboard → Developers → Webhooks
2. Click en tu endpoint
3. Ve a la pestaña "Logs" para ver eventos recibidos

---

## 🔄 Cambiar de Test a Producción

Cuando estés listo para pagos reales:

### 1. Obtener Claves de Producción

1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/)
2. Desactiva "View test data" (toggle arriba a la derecha)
3. Ve a Developers → API keys
4. Copia las claves que empiezan con `pk_live_` y `sk_live_`

### 2. Actualizar Variables de Entorno

Reemplaza las claves en Vercel:

\`\`\`bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx (nuevo webhook de producción)
\`\`\`

### 3. Configurar Webhook de Producción

Crea un nuevo endpoint webhook apuntando a tu dominio de producción.

---

## 🧪 Testing Completo

### Checklist de Pruebas:

- [ ] Pago exitoso con tarjeta de prueba
- [ ] Pago rechazado (manejo de errores)
- [ ] Webhook recibe evento `checkout.session.completed`
- [ ] Orden se guarda correctamente en la base de datos
- [ ] Email de confirmación se envía
- [ ] Stock se actualiza correctamente
- [ ] Reservas de stock se liberan si el pago falla
- [ ] Redirección correcta después del pago
- [ ] Página de confirmación muestra datos correctos

---

## 🐛 Troubleshooting

### Error: "No signature found"

**Causa:** El webhook secret no está configurado correctamente.

**Solución:** Verifica que `STRIPE_WEBHOOK_SECRET` esté en las variables de entorno.

---

### Error: "Invalid webhook signature"

**Causa:** El webhook secret no coincide.

**Solución:** 
1. Verifica que uses el secret correcto del endpoint configurado
2. En desarrollo, usa Stripe CLI para obtener el secret correcto

---

### Webhook no recibe eventos

**Causa:** El endpoint no es accesible públicamente o la URL es incorrecta.

**Solución:**
1. En desarrollo: Usa Stripe CLI o ngrok
2. En producción: Verifica que la URL sea accesible y correcta
3. Verifica que el webhook esté configurado en Stripe Dashboard

---

### Pagos no se guardan en la base de datos

**Causa:** El webhook no está procesando correctamente el evento.

**Solución:**
1. Verifica los logs del servidor
2. Revisa que la función `saveOrder` esté funcionando
3. Verifica la conexión a Supabase

---

## 📊 Monitoreo

### Dashboard de Stripe

Monitorea tus pagos en tiempo real:

1. **Pagos:** https://dashboard.stripe.com/payments
2. **Clientes:** https://dashboard.stripe.com/customers
3. **Webhooks:** https://dashboard.stripe.com/webhooks
4. **Logs:** https://dashboard.stripe.com/logs

### Métricas Clave:

- Tasa de conversión de checkout
- Pagos exitosos vs. fallidos
- Tiempo promedio de checkout
- Carritos abandonados

---

## 🔒 Seguridad

### Mejores Prácticas:

1. **Nunca** expongas `STRIPE_SECRET_KEY` en el frontend
2. **Siempre** valida webhooks con la firma
3. **Usa** HTTPS en producción
4. **Mantén** actualizadas las dependencias de Stripe
5. **Implementa** rate limiting en los endpoints
6. **Monitorea** eventos sospechosos en Stripe Dashboard

---

## 💰 Costos de Stripe

### Tarifas en México:

- **Tarjetas nacionales:** 3.6% + $3 MXN por transacción
- **Tarjetas internacionales:** 4.4% + $3 MXN
- **Sin** costos de setup
- **Sin** tarifas mensuales

---

## 📚 Recursos Adicionales

- [Documentación de Stripe](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Webhooks](https://stripe.com/docs/webhooks)
- [Testing](https://stripe.com/docs/testing)
- [API Reference](https://stripe.com/docs/api)

---

## ✅ Checklist Final

Antes de lanzar a producción:

- [ ] Claves de producción configuradas
- [ ] Webhook de producción configurado y probado
- [ ] Emails de confirmación funcionando
- [ ] Base de datos actualizada correctamente
- [ ] Stock management funcionando
- [ ] Página de confirmación mostrando datos correctos
- [ ] Manejo de errores implementado
- [ ] Logs de monitoreo configurados
- [ ] Pruebas con tarjetas reales realizadas
- [ ] Política de reembolsos definida

---

¡Tu integración de Stripe está lista! 🎉
