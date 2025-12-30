# Guía de Configuración del Webhook de Stripe para STARDUST

## 📋 Resumen

Este documento proporciona instrucciones paso a paso para configurar el webhook de Stripe que permitirá a STARDUST recibir notificaciones automáticas de eventos de pago.

---

## 🔗 URL del Webhook

**Producción:**
\`\`\`
https://tu-dominio.com/api/stripe/webhook
\`\`\`

**Desarrollo (Stripe CLI):**
\`\`\`
http://localhost:3000/api/stripe/webhook
\`\`\`

---

## 📝 Pasos para Configurar el Webhook

### Paso 1: Acceder al Dashboard de Stripe

1. Ve a [https://dashboard.stripe.com/](https://dashboard.stripe.com/)
2. Inicia sesión con tus credenciales
3. Asegúrate de estar en modo **Test** (modo de prueba)

### Paso 2: Navegar a Webhooks

1. En el menú lateral izquierdo, busca **"Developers"** (Desarrolladores)
2. Haz clic en **"Webhooks"**
3. Haz clic en el botón **"+ Add endpoint"** (Agregar endpoint)

### Paso 3: Configurar el Endpoint

#### A. URL del Endpoint
- **Para pruebas locales con Stripe CLI:**
  \`\`\`
  Usa Stripe CLI (ver sección abajo)
  \`\`\`

- **Para producción:**
  \`\`\`
  https://tu-dominio-stardust.com/api/stripe/webhook
  \`\`\`

#### B. Descripción (opcional)
\`\`\`
STARDUST Payment Webhook - Handles payment confirmations and order updates
\`\`\`

#### C. Versión de la API
- Selecciona: **Latest API version** o la versión específica que estés usando

#### D. Eventos a Escuchar

Selecciona los siguientes eventos (IMPORTANTE):

✅ **checkout.session.completed**
- Se dispara cuando una sesión de Checkout se completa exitosamente
- STARDUST lo usa para: Confirmar el pago y actualizar el estado de la orden

✅ **checkout.session.async_payment_succeeded**
- Se dispara cuando un pago asíncrono (como transferencia bancaria) se completa
- STARDUST lo usa para: Confirmar pagos que tardan más tiempo

❌ **checkout.session.async_payment_failed**
- Se dispara cuando un pago asíncrono falla
- STARDUST lo usa para: Notificar al usuario y cancelar la orden

❌ **payment_intent.payment_failed**
- Se dispara cuando un pago falla
- STARDUST lo usa para: Registrar intentos fallidos

### Paso 4: Guardar el Endpoint

1. Haz clic en **"Add endpoint"** o **"Save"**
2. Stripe generará automáticamente un **Signing Secret** (whsec_...)

### Paso 5: Copiar el Signing Secret

1. En la página del webhook recién creado, encontrarás una sección que dice **"Signing secret"**
2. Haz clic en **"Reveal"** (Revelar)
3. Copia el secret (comienza con `whsec_`)
4. Este es tu `STRIPE_WEBHOOK_SECRET`

**Ejemplo:**
\`\`\`
whsec_1234567890abcdefghijklmnopqrstuvwxyz
\`\`\`

---

## ⚙️ Configurar Variables de Entorno

### En Vercel (Producción)

1. Ve a tu proyecto en Vercel
2. Navega a **Settings** > **Environment Variables**
3. Agrega la siguiente variable:

\`\`\`
STRIPE_WEBHOOK_SECRET=whsec_tu_secret_aqui
\`\`\`

4. Selecciona los entornos: **Production**, **Preview**, **Development**
5. Haz clic en **Save**

### En Local (.env.local)

Crea o actualiza tu archivo `.env.local`:

\`\`\`bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51SGIZfJokTolILlV4kcA3QgZFjSuj5G18vIj63ujgVqzS8VC9Qk8DP3YLEOL8LTEiKvHRouRRkOBlHpazIdItoRuo0k6CdFG7z
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SGIZfJokTolILlVli3GTC5ilQj1XKs1E1kKFWPBXuLnpToxe1WsFEq431ENAY7mRqnh9Y8w4W3v4mwlu3BI3Y5GyoOX47EXoRu
STRIPE_WEBHOOK_SECRET=whsec_tu_secret_aqui
\`\`\`

---

## 🧪 Probar el Webhook Localmente con Stripe CLI

### Instalación de Stripe CLI

#### MacOS
\`\`\`bash
brew install stripe/stripe-cli/stripe
\`\`\`

#### Windows
\`\`\`bash
scoop install stripe
\`\`\`

#### Linux
\`\`\`bash
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_linux_amd64.tar.gz
tar -xvf stripe_linux_amd64.tar.gz
sudo mv stripe /usr/local/bin/
\`\`\`

### Autenticación

\`\`\`bash
stripe login
\`\`\`

Esto abrirá tu navegador para autorizar Stripe CLI.

### Reenviar Webhooks Localmente

1. Inicia tu servidor Next.js local:
\`\`\`bash
npm run dev
\`\`\`

2. En otra terminal, ejecuta:
\`\`\`bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
\`\`\`

3. Stripe CLI te dará un **webhook signing secret** temporal:
\`\`\`
Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
\`\`\`

4. Usa este secret en tu `.env.local` mientras pruebas localmente

### Disparar Eventos de Prueba

\`\`\`bash
# Simular un checkout completado
stripe trigger checkout.session.completed

# Simular un pago fallido
stripe trigger payment_intent.payment_failed
\`\`\`

---

## ✅ Verificar que el Webhook Funciona

### Método 1: Dashboard de Stripe

1. Ve a **Developers** > **Webhooks** en el Dashboard de Stripe
2. Haz clic en tu webhook endpoint
3. Ve a la pestaña **"Events"** o **"Attempts"**
4. Realiza una compra de prueba en tu sitio
5. Deberías ver los eventos aparecer aquí con:
   - ✅ Status 200 (exitoso)
   - ❌ Status 4xx o 5xx (error)

### Método 2: Logs de Next.js

Revisa los logs de tu aplicación Next.js. Deberías ver:

\`\`\`
[Stripe Webhook] Received event: checkout.session.completed
[Stripe Webhook] Processing session: cs_test_xxxxx
[Stripe Webhook] Order updated successfully: ORD-xxxxx
\`\`\`

### Método 3: Base de Datos

Verifica que las órdenes se actualizan correctamente:

\`\`\`sql
SELECT id, status, payment_status, updated_at 
FROM orders 
ORDER BY updated_at DESC 
LIMIT 10;
\`\`\`

El status debería cambiar a `paid` cuando el webhook se procese.

---

## 🔒 Seguridad del Webhook

### Verificación de Firmas

El endpoint `/api/stripe/webhook` ya implementa verificación de firmas. Esto asegura que:

1. ✅ Solo Stripe puede enviar eventos al webhook
2. ✅ Los eventos no han sido manipulados
3. ✅ Los eventos son genuinos

**Código de verificación (ya implementado):**
\`\`\`typescript
const signature = headers().get('stripe-signature')
const event = stripe.webhooks.constructEvent(
  body,
  signature!,
  process.env.STRIPE_WEBHOOK_SECRET!
)
\`\`\`

### Mejores Prácticas

1. **Nunca** compartas tu `STRIPE_WEBHOOK_SECRET`
2. **Siempre** usa HTTPS en producción
3. **Revisa** regularmente los logs de webhooks
4. **Implementa** reintentos para eventos fallidos
5. **Monitorea** eventos no procesados

---

## 🐛 Troubleshooting

### Error: "No signatures found matching the expected signature"

**Causa:** El webhook secret es incorrecto o el evento no viene de Stripe

**Solución:**
1. Verifica que `STRIPE_WEBHOOK_SECRET` esté correctamente configurado
2. Revisa que copiaste el secret completo (empieza con `whsec_`)
3. Asegúrate de no tener espacios extra

### Error: "Webhook signature verification failed"

**Causa:** La firma no coincide con el secret

**Solución:**
1. Regenera el secret en el Dashboard de Stripe
2. Actualiza la variable de entorno
3. Redeploya tu aplicación

### Los eventos no llegan al webhook

**Causa:** URL incorrecta o firewall bloqueando

**Solución:**
1. Verifica la URL del webhook en Stripe Dashboard
2. Asegúrate de que la URL sea accesible públicamente
3. Revisa que no haya firewall o WAF bloqueando Stripe IPs
4. Prueba con Stripe CLI localmente primero

### Eventos duplicados

**Causa:** Stripe reintenta automáticamente eventos no confirmados

**Solución:**
- Implementa **idempotencia** (ya implementado en el código)
- Usa el `event.id` para evitar procesar el mismo evento dos veces

---

## 📊 Monitoreo en Producción

### Dashboard de Stripe

Revisa regularmente:
- **Developers** > **Webhooks** > Tu endpoint
- Tasa de éxito (debería ser >99%)
- Eventos fallidos
- Tiempo de respuesta (debería ser <1s)

### Alertas Recomendadas

Configura alertas para:
- ❌ Webhooks fallidos >5 en 1 hora
- ⚠️ Tiempo de respuesta >3 segundos
- ⚠️ Tasa de éxito <95%

---

## 🚀 Checklist de Producción

Antes de lanzar a producción:

- [ ] Webhook configurado en Stripe Dashboard (modo Live)
- [ ] `STRIPE_WEBHOOK_SECRET` configurado en Vercel
- [ ] Webhook URL usa HTTPS
- [ ] Eventos de prueba funcionan correctamente
- [ ] Verificación de firmas activa
- [ ] Logs de webhook funcionando
- [ ] Base de datos se actualiza correctamente
- [ ] Emails de confirmación se envían
- [ ] Monitoreo configurado
- [ ] Documentación actualizada

---

## 📞 Soporte

Si necesitas ayuda:

1. **Documentación Stripe:** https://stripe.com/docs/webhooks
2. **Stripe Support:** https://support.stripe.com/
3. **Logs de Stripe:** Dashboard > Developers > Webhooks > Events

---

## 🔄 Actualización del Webhook

Si necesitas modificar los eventos o la URL:

1. Ve a **Developers** > **Webhooks** en Stripe Dashboard
2. Haz clic en tu webhook endpoint
3. Haz clic en **"Edit endpoint"**
4. Realiza los cambios necesarios
5. Guarda los cambios

**IMPORTANTE:** Si cambias la URL o los eventos, NO cambia el signing secret. Solo se regenera si haces clic en "Regenerate secret".

---

## ✅ Resumen de Configuración

\`\`\`bash
# 1. URL del Webhook
https://tu-dominio.com/api/stripe/webhook

# 2. Eventos a escuchar
- checkout.session.completed
- checkout.session.async_payment_succeeded  
- checkout.session.async_payment_failed
- payment_intent.payment_failed

# 3. Variables de Entorno
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# 4. Verificar en Dashboard de Stripe
Developers > Webhooks > [Tu Endpoint] > Events
\`\`\`

---

**Última actualización:** Diciembre 2024
**Versión de la API de Stripe:** Latest
