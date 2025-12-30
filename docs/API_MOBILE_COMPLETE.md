# API Móvil Completa - STARDUST E-commerce

## 📱 Endpoints Disponibles

### 🔐 Autenticación
- `POST /api/mobile/v1/auth/register` - Registro de usuario
- `POST /api/mobile/v1/auth/login` - Inicio de sesión
- `POST /api/mobile/v1/auth/logout` - Cerrar sesión

### 👤 Perfil y Cliente
- `GET /api/mobile/v1/profile` - Obtener perfil del usuario
- `PUT /api/mobile/v1/profile` - Actualizar perfil
- `GET /api/mobile/v1/customer` - Información completa del cliente (incluye direcciones, métodos de pago, pedidos)
- `PUT /api/mobile/v1/customer` - Actualizar información del cliente

### 📍 Direcciones de Entrega
- `GET /api/mobile/v1/addresses` - Listar direcciones guardadas
- `POST /api/mobile/v1/addresses` - Agregar nueva dirección

### 💳 Métodos de Pago
- `GET /api/mobile/v1/payment-methods` - Listar métodos de pago guardados
- `POST /api/mobile/v1/payment-methods` - Agregar método de pago

### 💰 Pagos
- `POST /api/mobile/v1/payments` - Procesar pago con tarjeta
- `POST /api/mobile/v1/payments/stripe-session` - Crear sesión de Stripe

### 🛒 Mercado Pago
- `POST /api/mobile/v1/mercadopago/preference` - Crear preferencia de pago
- `POST /api/mobile/v1/mercadopago/webhook` - Webhook para notificaciones de pago

### 💬 WhatsApp Business
- `GET /api/mobile/v1/whatsapp/status` - Estado de configuración de WhatsApp
- `POST /api/mobile/v1/whatsapp/send` - Enviar mensaje de WhatsApp

### 🛍️ Productos
- `GET /api/mobile/v1/products` - Listar productos (con filtros)
- `GET /api/mobile/v1/products/[id]` - Obtener producto por ID
- `GET /api/mobile/v1/categories` - Listar categorías

### 📦 Pedidos
- `POST /api/mobile/v1/orders` - Crear pedido
- `GET /api/mobile/v1/orders` - Listar pedidos del usuario
- `GET /api/mobile/v1/orders/[id]` - Obtener pedido específico
- `GET /api/mobile/v1/orders/history` - Historial completo con paginación

### ⭐ Reseñas
- `GET /api/mobile/v1/reviews` - Listar reseñas de un producto
- `POST /api/mobile/v1/reviews` - Crear reseña

### 🔔 Notificaciones
- `GET /api/mobile/v1/notifications` - Listar notificaciones
- `POST /api/mobile/v1/notifications` - Crear notificación
- `PUT /api/mobile/v1/notifications/[id]` - Marcar como leída
- `DELETE /api/mobile/v1/notifications/[id]` - Eliminar notificación

### 🚚 Zonas de Entrega
- `GET /api/mobile/v1/delivery-zones` - Listar zonas de entrega activas

---

## 🔄 Flujo Completo de la App Móvil

### 1. Autenticación
\`\`\`dart
// Login
POST /api/mobile/v1/auth/login
{
  "email": "usuario@example.com",
  "password": "password123"
}

// Respuesta
{
  "message": "Login exitoso",
  "user": { ... },
  "session": {
    "access_token": "...",
    "refresh_token": "...",
    "expires_at": 1234567890
  }
}
\`\`\`

### 2. Obtener Información Completa del Cliente
\`\`\`dart
GET /api/mobile/v1/customer
Authorization: Bearer {access_token}

// Respuesta incluye:
{
  "success": true,
  "data": {
    "id": "...",
    "email": "...",
    "firstName": "...",
    "lastName": "...",
    "phone": "...",
    "totalOrders": 5,
    "totalSpent": 2500,
    "savedAddresses": [...],
    "paymentMethods": [...],
    "recentOrders": [...]
  }
}
\`\`\`

### 3. Obtener Catálogo de Productos
\`\`\`dart
GET /api/mobile/v1/products?category=Energía&minPrice=100&maxPrice=500

{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "LUNAR Balance",
      "price": 399,
      "stock": 50,
      "image": "...",
      ...
    }
  ],
  "count": 10
}
\`\`\`

### 4. Crear Pedido con Mercado Pago
\`\`\`dart
// Paso 1: Crear preferencia
POST /api/mobile/v1/mercadopago/preference
{
  "items": [...],
  "orderId": "ORD-123",
  "customerInfo": {...}
}

// Respuesta
{
  "success": true,
  "data": {
    "preferenceId": "MP-...",
    "initPoint": "https://www.mercadopago.com.mx/checkout/..."
  }
}

// Paso 2: Abrir WebView con initPoint
// Paso 3: Webhook recibe notificación de pago
// Paso 4: Orden se actualiza automáticamente
\`\`\`

### 5. Enviar Notificación por WhatsApp
\`\`\`dart
POST /api/mobile/v1/whatsapp/send
{
  "phone": "+525512345678",
  "message": "Tu pedido ORD-123 ha sido confirmado",
  "orderId": "ORD-123"
}

{
  "success": true,
  "message": "Mensaje enviado exitosamente",
  "data": {
    "messageId": "WA-...",
    "status": "sent"
  }
}
\`\`\`

### 6. Historial de Pedidos con Filtros
\`\`\`dart
GET /api/mobile/v1/orders/history?status=completed&limit=10&offset=0

{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 25,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
\`\`\`

### 7. Gestionar Direcciones
\`\`\`dart
// Listar direcciones guardadas
GET /api/mobile/v1/addresses

// Agregar nueva dirección
POST /api/mobile/v1/addresses
{
  "address": "Calle Principal 123",
  "city": "Guadalajara",
  "state": "Jalisco",
  "zip": "44100"
}
\`\`\`

### 8. Notificaciones Push
\`\`\`dart
// Obtener notificaciones
GET /api/mobile/v1/notifications

// Marcar como leída
PUT /api/mobile/v1/notifications/{id}
{
  "read": true
}
\`\`\`

---

## 🚀 Integración en Flutter

### Cliente HTTP Completo
\`\`\`dart
class StardustApiClient {
  static const String baseUrl = 'https://tudominio.com/api/mobile/v1';
  String? _accessToken;

  void setToken(String token) => _accessToken = token;

  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    if (_accessToken != null) 'Authorization': 'Bearer $_accessToken',
  };

  Future<T> get<T>(String endpoint, {T Function(Map)? fromJson}) async {
    final response = await http.get(
      Uri.parse('$baseUrl$endpoint'),
      headers: _headers,
    );
    final data = json.decode(response.body);
    return fromJson != null ? fromJson(data) : data;
  }

  Future<T> post<T>(String endpoint, dynamic body, {T Function(Map)? fromJson}) async {
    final response = await http.post(
      Uri.parse('$baseUrl$endpoint'),
      headers: _headers,
      body: json.encode(body),
    );
    final data = json.decode(response.body);
    return fromJson != null ? fromJson(data) : data;
  }
}
\`\`\`

### Ejemplo: Flujo Completo de Compra
\`\`\`dart
// 1. Usuario ve catálogo
final products = await api.get('/products');

// 2. Agrega al carrito y procede al checkout
final customer = await api.get('/customer');

// 3. Selecciona dirección guardada o agrega nueva
final addresses = customer.data.savedAddresses;

// 4. Crea preferencia de MercadoPago
final preference = await api.post('/mercadopago/preference', {
  'items': cartItems,
  'orderId': orderId,
  'customerInfo': customerInfo,
});

// 5. Abre WebView de MercadoPago
await launchUrl(preference.data.initPoint);

// 6. Webhook notifica pago exitoso
// 7. App muestra confirmación y envía WhatsApp
await api.post('/whatsapp/send', {
  'phone': customer.phone,
  'message': '¡Gracias por tu compra! Tu pedido está en camino.',
  'orderId': orderId,
});
\`\`\`

---

## ✅ Checklist de Funcionalidades

### Autenticación ✅
- [x] Registro de usuario
- [x] Login con email/password
- [x] Logout
- [x] Tokens JWT de Supabase

### Perfil de Usuario ✅
- [x] Obtener información completa
- [x] Actualizar datos personales
- [x] Ver estadísticas (total gastado, pedidos)

### Productos ✅
- [x] Catálogo completo
- [x] Búsqueda y filtros
- [x] Detalles de producto
- [x] Categorías

### Pedidos ✅
- [x] Crear pedido
- [x] Historial completo
- [x] Detalles de pedido
- [x] Filtros por estado
- [x] Paginación

### Direcciones ✅
- [x] Listar direcciones guardadas
- [x] Agregar nueva dirección
- [x] Dirección predeterminada

### Métodos de Pago ✅
- [x] Listar tarjetas guardadas
- [x] Agregar nueva tarjeta
- [x] Validación Luhn

### Pagos ✅
- [x] Procesamiento de pagos
- [x] Integración Stripe (preparada)
- [x] Integración Mercado Pago ✅
- [x] Webhook de notificaciones ✅

### WhatsApp Business ✅
- [x] Enviar mensajes
- [x] Notificaciones de pedidos
- [x] Estado de configuración

### Notificaciones ✅
- [x] Listar notificaciones
- [x] Marcar como leídas
- [x] Eliminar notificaciones

### Zonas de Entrega ✅
- [x] Listar zonas activas
- [x] Calcular costos de envío

---

## 🔧 Variables de Entorno Necesarias

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_PUBLIC_KEY=

# WhatsApp Business
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
\`\`\`

---

## 📊 Estados de Pedidos

- `pending` - Pendiente de pago
- `processing` - Pago confirmado, preparando envío
- `shipped` - Enviado
- `delivered` - Entregado
- `cancelled` - Cancelado
- `refunded` - Reembolsado

---

## 🔒 Seguridad

- Todos los endpoints usan autenticación JWT de Supabase
- Row Level Security (RLS) habilitado en todas las tablas
- Validación de datos en servidor
- Tokens nunca expuestos en cliente
- HTTPS obligatorio en producción
