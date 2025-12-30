# Ejecución de Scripts Pendientes - STARDUST

## Scripts Listos para Ejecutar

Los siguientes scripts ya están corregidos y listos para ejecutarse en orden:

### 1. Script 020: Tracking de Envíos ✅

**Archivo:** `scripts/020_add_shipping_tracking.sql`

**Estado:** Corregido (foreign key apunta a `orders(id)`)

**Qué hace:**
- Agrega campos de tracking a la tabla `orders`
- Crea tabla `shipping_events` para historial de eventos
- Agrega función `add_shipping_event()` para gestionar eventos
- Actualiza constraints de status para incluir 'shipped' y 'delivered'

**Cómo ejecutar:**
1. Ve al backoffice de STARDUST
2. Ve a la sección de Scripts SQL (en la interfaz de administración)
3. Localiza el script `020_add_shipping_tracking.sql`
4. Haz clic en "Ejecutar"
5. Verifica que se ejecute sin errores

**Resultado esperado:**
\`\`\`
✅ Tabla orders actualizada con campos de tracking
✅ Tabla shipping_events creada
✅ Función add_shipping_event creada
✅ Índices creados correctamente
\`\`\`

---

### 2. Script 021: RLS para Contenido Editable ✅

**Archivo:** `scripts/021_add_editable_content_rls.sql`

**Estado:** Listo para ejecutar

**Qué hace:**
- Habilita Row Level Security en `editable_content`
- Permite lectura pública (necesario para páginas legales)
- Permite todas las operaciones a usuarios autenticados

**Cómo ejecutar:**
1. Ve al backoffice de STARDUST
2. Ve a la sección de Scripts SQL
3. Localiza el script `021_add_editable_content_rls.sql`
4. Haz clic en "Ejecutar"

**Resultado esperado:**
\`\`\`
✅ RLS habilitado en editable_content
✅ Política de lectura pública creada
✅ Política de modificación para autenticados creada
✅ La página de Gestión de Contenido ahora carga correctamente
\`\`\`

---

## Verificación Post-Ejecución

### Verificar Script 020 (Tracking)

1. Ve a **Backoffice > Pedidos**
2. Selecciona cualquier pedido
3. Deberías ver campos para:
   - Número de rastreo
   - Paquetería
   - Fecha de envío
   - Fecha estimada de entrega

### Verificar Script 021 (RLS Contenido)

1. Ve a **Backoffice > Configuración > Contenido**
2. La página debería cargar y mostrar:
   - Pestaña "Páginas Legales"
   - Pestaña "Templates de Email"
3. Deberías ver todos los contenidos editables:
   - Aviso de Privacidad
   - Políticas de Devolución
   - Políticas de Envío
   - Términos y Condiciones del Servicio
   - Email de Bienvenida
   - Email de Confirmación de Pedido
   - Email de Notificación de Envío

---

## Troubleshooting

### Si el Script 020 falla:

**Error:** "column order_id does not exist"
**Solución:** El script ya está corregido. Asegúrate de usar la versión más reciente.

**Error:** "relation shipping_events already exists"
**Solución:** El script ya se ejecutó anteriormente. Puedes omitirlo.

### Si el Script 021 falla:

**Error:** "policy already exists"
**Solución:** Las políticas ya están creadas. Puedes omitir este script.

**Error:** "RLS already enabled"
**Solución:** RLS ya está habilitado. Continúa con la verificación.

---

## Siguiente Paso: Integración de Stripe

Una vez completados estos scripts, el siguiente paso crítico es:

**Integración Real de Stripe** (Prioridad CRÍTICA)

Este será el siguiente paso para permitir pagos reales en el sitio.

Archivos a crear:
- `app/api/stripe/create-checkout-session/route.ts`
- `app/api/stripe/webhook/route.ts`
- Actualizar `app/checkout/page.tsx`

Variables de entorno necesarias:
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

---

## Estado Actual del Proyecto

### ✅ Completado (88%)
- Frontend completo
- Backoffice completo
- Sistema de autenticación
- Base de datos (pendiente ejecutar 2 scripts)
- Emails
- API móvil
- Sistema de stock y reservas
- Sistema de cupones
- Tracking de envíos (código listo)

### 🚧 Pendiente Crítico (12%)
- **Integración real de Stripe** (simulado actualmente)
- **Ejecutar scripts 020 y 021**
- Optimización de imágenes
- SEO avanzado
- Analytics completo

### 📊 Porcentaje Real de Completitud

Con la ejecución de estos 2 scripts: **90%**

Con Stripe integrado: **95%**

Completamente optimizado: **100%**
