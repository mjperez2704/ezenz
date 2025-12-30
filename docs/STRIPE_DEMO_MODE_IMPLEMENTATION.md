# Implementación de Modo Demo/Test para Stripe

## Descripción General

Se ha implementado un sistema completo de gestión de Stripe que permite alternar entre modo TEST (demo) y modo PRODUCCIÓN desde el backoffice, sin necesidad de modificar código o variables de entorno.

## Características Implementadas

### 1. Base de Datos

**Tabla: `stripe_config`**
- Almacena claves de TEST y PRODUCCIÓN por separado
- Campo `active_environment` controla qué modo está activo
- RLS habilitado para seguridad
- Políticas de acceso público para lectura (necesario para checkout)

### 2. Admin - Configuración de Pagos

**Ruta:** `/admin/configuracion/pagos`

**Funcionalidades:**
- Toggle visual para cambiar entre TEST y PRODUCCIÓN
- Tabs separados para configurar cada ambiente
- Campos para:
  - Publishable Key (pública)
  - Secret Key (privada, oculta con botón show/hide)
  - Webhook Secret (privada, oculta con botón show/hide)
- Alertas visuales según el modo activo
- Validaciones de campos requeridos según ambiente

### 3. Backend Dinámico

**Archivo: `lib/stripe-dynamic.ts`**

Funciones principales:
- `getStripeInstance()`: Obtiene instancia de Stripe con claves del ambiente activo
- `createCheckoutSession()`: Crea sesión usando configuración dinámica
- `constructWebhookEvent()`: Verifica webhooks con secret del ambiente activo
- `getCheckoutSession()`: Obtiene sesión de checkout
- `getPaymentIntent()`: Obtiene payment intent

### 4. APIs

**GET `/api/stripe-config/public`**
- Endpoint público para obtener publishable key
- Solo devuelve la clave del ambiente activo
- No expone claves secretas

**GET/PUT `/api/admin/stripe-config`**
- Admin endpoints para gestionar configuración
- GET: Obtiene toda la configuración
- PUT: Actualiza configuración completa

### 5. Checkout Actualizado

**Cambios en `/app/checkout/page.tsx`:**
- Carga dinámica de Stripe según ambiente configurado
- Elimina toggle manual de desarrollo
- Muestra badge visual del modo activo (TEST o PRODUCCIÓN)
- Usa siempre las claves del ambiente configurado en admin

## Flujo de Uso

### Configuración Inicial (Modo TEST)

1. Ir a `/admin/configuracion/pagos`
2. Asegurar que está en "Modo TEST"
3. Ir al tab "Claves TEST"
4. Ingresar:
   - Publishable Key de test: `pk_test_...`
   - Secret Key de test: `sk_test_...`
   - Webhook Secret de test: `whsec_...` (opcional)
5. Guardar configuración

### Cambiar a Producción

1. Ir al tab "Claves PRODUCCIÓN"
2. Ingresar:
   - Publishable Key de producción: `pk_live_...`
   - Secret Key de producción: `sk_live_...`
   - Webhook Secret de producción: `whsec_...`
3. Click en botón "Modo PRODUCCIÓN"
4. Guardar configuración
5. **¡Los pagos ahora son REALES!**

## Tarjetas de Prueba (Modo TEST)

Cuando estás en modo TEST, puedes usar estas tarjetas:

- **Éxito:** 4242 4242 4242 4242
- **Requiere autenticación:** 4000 0025 0000 3155
- **Rechazada:** 4000 0000 0000 9995

Cualquier CVV futuro y cualquier código postal válido.

## Seguridad

1. **Claves secretas nunca se exponen al frontend**
2. **Publishable keys son públicas pero seguras**
3. **RLS habilitado en tabla de configuración**
4. **Campos de contraseña con show/hide en admin**
5. **Alertas visuales para evitar errores**

## Validaciones

- No se puede activar producción sin claves de producción
- No se puede activar test sin claves de test
- Los webhooks validan con el secret del ambiente correcto
- El checkout siempre usa el ambiente configurado en BD

## Scripts SQL Ejecutados

\`\`\`sql
-- Ver script completo en: scripts/025_create_stripe_config_table.sql
\`\`\`

## Endpoints Creados

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/stripe-config/public` | GET | Obtiene publishable key del ambiente activo |
| `/api/admin/stripe-config` | GET | Obtiene configuración completa (admin) |
| `/api/admin/stripe-config` | PUT | Actualiza configuración (admin) |

## Beneficios

1. **Sin cambios en código para cambiar ambiente**
2. **Interfaz visual intuitiva**
3. **Validaciones automáticas**
4. **Historial de configuración en BD**
5. **Separación clara entre test y producción**
6. **Fácil cambio entre ambientes**

## Próximos Pasos (Opcional)

1. Agregar logs de cambios de ambiente
2. Implementar notificaciones por email al cambiar a producción
3. Agregar dashboard de transacciones por ambiente
4. Implementar rollback automático en caso de error
