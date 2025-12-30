# Credenciales de Usuario Demo - STARDUST

## Información de Acceso

### Credenciales de Login
\`\`\`
Email: demo@stardust.com
Password: Demo123!
User ID: a0000000-0000-0000-0000-000000000001
\`\`\`

## Datos del Perfil

### Información Personal
- **Nombre Completo:** Usuario Demo STARDUST
- **Email:** demo@stardust.com
- **Teléfono:** +52 123 456 7890

## Direcciones de Envío

### Dirección 1: Casa (Por Defecto)
\`\`\`json
{
  "id": "b0000000-0000-0000-0000-000000000001",
  "address_name": "Casa",
  "full_name": "Usuario Demo STARDUST",
  "phone": "+52 123 456 7890",
  "street_address": "Calle Estrella 123, Col. Cosmos",
  "city": "Ciudad de México",
  "state": "CDMX",
  "zip_code": "01234",
  "is_default": true
}
\`\`\`

### Dirección 2: Oficina
\`\`\`json
{
  "id": "b0000000-0000-0000-0000-000000000002",
  "address_name": "Oficina",
  "full_name": "Usuario Demo STARDUST",
  "phone": "+52 123 456 7891",
  "street_address": "Av. Galaxia 456, Piso 3",
  "city": "Monterrey",
  "state": "Nuevo León",
  "zip_code": "64000",
  "is_default": false
}
\`\`\`

## Historial de Pedidos

### Pedido 1: DEMO-ORDER-001 (Entregado)
- **Status:** delivered
- **Total:** $1,539.68 MXN
- **Items:** 2x Crema Facial Regeneradora
- **Tracking:** TRACK123456789
- **Paquetería:** FedEx
- **Fecha de entrega:** Hace 10 días

### Pedido 2: DEMO-ORDER-002 (En Tránsito)
- **Status:** shipped
- **Total:** $1,713.68 MXN
- **Items:** 
  - 1x Sérum Anti-edad
  - 1x Mascarilla Purificante
- **Tracking:** TRACK987654321
- **Paquetería:** DHL
- **Entrega estimada:** En 2 días

### Pedido 3: DEMO-ORDER-003 (Pendiente)
- **Status:** pending
- **Total:** $612.84 MXN
- **Items:** 1x Limpiador Facial
- **Entrega estimada:** En 5 días

## Uso en la API Móvil

### 1. Login
\`\`\`dart
POST /api/mobile/v1/auth/login
Content-Type: application/json

{
  "email": "demo@stardust.com",
  "password": "Demo123!"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "user": {
    "id": "a0000000-0000-0000-0000-000000000001",
    "email": "demo@stardust.com",
    "full_name": "Usuario Demo STARDUST"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "...",
    "expires_in": 3600
  }
}
\`\`\`

### 2. Obtener Perfil
\`\`\`dart
GET /api/mobile/v1/profile
Authorization: Bearer {access_token}
\`\`\`

### 3. Obtener Direcciones
\`\`\`dart
GET /api/mobile/v1/addresses
Authorization: Bearer {access_token}
\`\`\`

### 4. Obtener Historial de Pedidos
\`\`\`dart
GET /api/mobile/v1/orders/history
Authorization: Bearer {access_token}
\`\`\`

### 5. Rastrear Pedido
\`\`\`dart
GET /api/mobile/v1/orders/DEMO-ORDER-002
Authorization: Bearer {access_token}
\`\`\`

## Notas Importantes

1. **Password Encriptado:** El password está hasheado con bcrypt. Si necesitas cambiarlo, debes rehashear la nueva contraseña.

2. **UUIDs Fijos:** Los IDs utilizan un formato específico para facilitar las pruebas, pero son UUIDs válidos.

3. **Datos Realistas:** Los pedidos tienen datos realistas con fechas relativas para simular un historial real.

4. **Testing:** Este usuario es ideal para:
   - Pruebas de integración de la app móvil
   - Demos de funcionalidad
   - QA y testing
   - Desarrollo local

5. **Producción:** NO uses este usuario en producción. Es solo para desarrollo y testing.

## Recrear Usuario Demo

Si necesitas recrear el usuario demo desde cero:

\`\`\`bash
# Desde el backoffice de STARDUST, ir a:
# Scripts SQL > Ejecutar Script 022_insert_demo_user.sql
\`\`\`

O vía terminal con psql:

\`\`\`bash
psql $DATABASE_URL -f scripts/022_insert_demo_user.sql
\`\`\`

## Troubleshooting

### El usuario no puede hacer login
- Verifica que el script se ejecutó correctamente
- Confirma que Supabase Auth está configurado
- Revisa que RLS está habilitado y las políticas son correctas

### No aparecen los pedidos
- Verifica que `authenticated_user_id` está correctamente configurado
- Revisa las políticas RLS de la tabla `orders`

### Las direcciones no se muestran
- Confirma que las políticas RLS de `user_addresses` permiten SELECT
- Verifica que el `user_id` coincide con el ID del usuario

## Contacto

Para soporte adicional con la API móvil, consulta:
- `docs/FLUTTER_API_INTEGRATION_GUIDE.md`
- `docs/DEPLOYMENT_GUIDE.md`
