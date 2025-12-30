# Sistema de Impuestos STARDUST

## Descripción General

Sistema completo de gestión de impuestos para productos en el ecommerce STARDUST. Permite asignar diferentes tasas impositivas a cada producto y calcular automáticamente los impuestos en el checkout.

## Estructura de Base de Datos

### Tabla `taxes`

\`\`\`sql
- id (UUID): Identificador único del impuesto
- name (TEXT): Nombre del impuesto (ej: "IVA 16%")
- description (TEXT): Descripción opcional
- rate (NUMERIC): Tasa decimal del impuesto (ej: 0.16 para 16%)
- is_active (BOOLEAN): Si el impuesto está activo
- country (TEXT): País de aplicación (default: MX)
- created_at (TIMESTAMP): Fecha de creación
- updated_at (TIMESTAMP): Fecha de actualización
\`\`\`

### Modificación en tabla `products`

\`\`\`sql
- tax_id (UUID): Referencia al impuesto aplicable (FK a taxes.id)
\`\`\`

## Impuestos Predeterminados

Al ejecutar el script de migración, se insertan automáticamente:

1. **IVA 16%** (México)
   - ID: `00000000-0000-0000-0000-000000000001`
   - Tasa: 0.16 (16%)
   - Activo por defecto

2. **Sin Impuesto**
   - ID: `00000000-0000-0000-0000-000000000002`
   - Tasa: 0.00 (0%)
   - Para productos exentos

## Funcionalidades del Admin

### Panel de Impuestos (`/admin/impuestos`)

- ✅ Listar todos los impuestos
- ✅ Crear nuevos impuestos
- ✅ Editar impuestos existentes
- ✅ Eliminar impuestos (con validación de uso)
- ✅ Activar/desactivar impuestos

### Gestión de Productos

Al crear o editar un producto, el admin puede:
- Seleccionar el impuesto aplicable desde un dropdown
- Ver la tasa del impuesto seleccionado
- Dejar sin impuesto si es necesario

## Cálculo de Impuestos en Checkout

### Antes (Sistema Fijo)
\`\`\`javascript
const tax = cartTotal * 0.1  // 10% fijo
\`\`\`

### Después (Sistema Dinámico)
\`\`\`javascript
const tax = cart.reduce((total, item) => {
  const taxRate = productTaxes[item.id] || 0.16
  return total + (item.price * item.quantity * taxRate)
}, 0)
\`\`\`

Cada producto puede tener su propia tasa impositiva, permitiendo:
- Productos con IVA 16%
- Productos con IVA 8% (frontera)
- Productos exentos (0%)
- Tasas personalizadas según regulaciones

## API Endpoints

### GET `/api/admin/taxes`
Obtiene todos los impuestos registrados.

**Response:**
\`\`\`json
[
  {
    "id": "uuid",
    "name": "IVA 16%",
    "description": "Impuesto al Valor Agregado",
    "rate": 0.16,
    "is_active": true,
    "country": "MX"
  }
]
\`\`\`

### POST `/api/admin/taxes`
Crea un nuevo impuesto.

**Body:**
\`\`\`json
{
  "name": "IVA Frontera 8%",
  "description": "IVA reducido para zona fronteriza",
  "rate": 0.08,
  "is_active": true,
  "country": "MX"
}
\`\`\`

### PUT `/api/admin/taxes/:id`
Actualiza un impuesto existente.

### DELETE `/api/admin/taxes/:id`
Elimina un impuesto (verifica que no esté en uso por productos).

## Validaciones

1. **Tasa impositiva**: Debe estar entre 0% y 100%
2. **Eliminación**: No se puede eliminar un impuesto asignado a productos
3. **Productos sin impuesto**: Si un producto no tiene `tax_id`, se aplica IVA 16% por defecto
4. **Productos existentes**: Al ejecutar la migración, se asigna automáticamente IVA 16% a todos los productos existentes

## Beneficios del Sistema

- ✅ **Flexibilidad**: Diferentes tasas por producto
- ✅ **Cumplimiento**: Facilita el cumplimiento fiscal
- ✅ **Escalabilidad**: Permite agregar nuevos impuestos fácilmente
- ✅ **Transparencia**: Cálculo claro y detallado en el checkout
- ✅ **Multi-región**: Soporte para diferentes países y zonas
- ✅ **Histórico**: Mantiene registro de cambios en impuestos

## Migración

Para aplicar el sistema de impuestos, ejecutar:

\`\`\`bash
# Ejecutar script desde el admin de v0
scripts/024_create_taxes_table.sql
\`\`\`

Este script:
1. Crea la tabla `taxes`
2. Agrega columna `tax_id` a `products`
3. Inserta IVA 16% y "Sin Impuesto"
4. Asigna IVA 16% a productos existentes
5. Configura RLS y políticas de seguridad
6. Crea índices para optimización

## Uso en Código

### Obtener todos los impuestos (Server)
\`\`\`typescript
import { getAllTaxes } from "@/lib/database-server"

const taxes = await getAllTaxes()
\`\`\`

### Obtener un impuesto por ID (Server)
\`\`\`typescript
import { getTaxById } from "@/lib/database-server"

const tax = await getTaxById("tax-uuid")
\`\`\`

### En componentes cliente
\`\`\`typescript
const response = await fetch("/api/admin/taxes")
const taxes = await response.json()
\`\`\`

## Notas Importantes

- Los impuestos se calculan **después** del subtotal y **antes** del envío
- El total final es: `Subtotal + Envío + Impuestos`
- Los impuestos se aplican sobre el precio base del producto (sin envío)
- Los productos pueden tener diferentes impuestos en el mismo pedido
- El sistema mantiene compatibilidad con pedidos antiguos (10% fijo)
