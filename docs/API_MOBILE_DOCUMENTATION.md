# API REST - STARDUST E-commerce Mobile

## 📋 Información General

**Base URL:** `https://tudominio.com/api/mobile/v1`

**Formato de Respuesta:** JSON

**Autenticación:** JWT (JSON Web Tokens) de Supabase

---

## 🔐 Autenticación

### Registro de Usuario

**Endpoint:** `POST /auth/register`

**Descripción:** Crea una nueva cuenta de cliente.

**Request Body:**
\`\`\`json
{
  "email": "cliente@example.com",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "+52 1234567890"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "uuid",
    "email": "cliente@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "+52 1234567890"
  }
}
\`\`\`

**Errores:**
- `400` - Campos requeridos faltantes
- `500` - Error del servidor

---

### Inicio de Sesión

**Endpoint:** `POST /auth/login`

**Descripción:** Inicia sesión y obtiene tokens de autenticación.

**Request Body:**
\`\`\`json
{
  "email": "cliente@example.com",
  "password": "password123"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Login exitoso",
  "user": {
    "id": "uuid",
    "email": "cliente@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "+52 1234567890"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "refresh_token_here",
    "expires_at": 1234567890
  }
}
\`\`\`

**Headers para Requests Autenticados:**
\`\`\`
Authorization: Bearer {access_token}
\`\`\`

**Errores:**
- `400` - Email y contraseña requeridos
- `401` - Credenciales incorrectas
- `500` - Error del servidor

---

### Cerrar Sesión

**Endpoint:** `POST /auth/logout`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
\`\`\`json
{
  "message": "Logout exitoso"
}
\`\`\`

---

## 🛍️ Productos

### Listar Todos los Productos

**Endpoint:** `GET /products`

**Query Parameters:**
- `category` (opcional): Filtrar por categoría
- `search` (opcional): Buscar por nombre/descripción
- `minPrice` (opcional): Precio mínimo
- `maxPrice` (opcional): Precio máximo

**Ejemplos:**
\`\`\`
GET /products
GET /products?category=Energía
GET /products?search=ashwagandha
GET /products?minPrice=200&maxPrice=500
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "LUNAR Balance",
      "slug": "lunar-balance",
      "category": "Balance",
      "description": "Adaptógeno nocturno para descanso profundo",
      "long_description": "Descripción extendida...",
      "image": "/products/lunar.jpg",
      "benefits": ["Mejora el sueño", "Reduce el estrés"],
      "gradient": "from-purple-500 to-pink-500",
      "price": 399,
      "stock": 50,
      "ingredients": ["Ashwagandha", "Rhodiola"],
      "usage": "1 cápsula antes de dormir",
      "rating": 4.5,
      "reviews_count": 23
    }
  ],
  "count": 1
}
\`\`\`

---

### Obtener Producto por ID

**Endpoint:** `GET /products/{id}`

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "LUNAR Balance",
    "slug": "lunar-balance",
    "category": "Balance",
    "description": "Adaptógeno nocturno...",
    "image": "/products/lunar.jpg",
    "price": 399,
    "stock": 50,
    "rating": 4.5,
    "reviews_count": 23,
    "reviews": [
      {
        "id": "REV-1",
        "author": "María García",
        "rating": 5,
        "title": "Excelente producto",
        "comment": "Me ayudó mucho con el sueño",
        "date": "2024-01-15T10:00:00Z",
        "helpful": 5,
        "verified": true
      }
    ]
  }
}
\`\`\`

**Errores:**
- `404` - Producto no encontrado

---

### Obtener Categorías

**Endpoint:** `GET /categories`

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "name": "Energía",
      "count": 3
    },
    {
      "name": "Balance",
      "count": 2
    },
    {
      "name": "Enfoque",
      "count": 2
    }
  ]
}
\`\`\`

---

## 🛒 Pedidos

### Crear Pedido

**Endpoint:** `POST /orders`

**Headers:** `Authorization: Bearer {token}` (opcional para clientes invitados)

**Request Body:**
\`\`\`json
{
  "userId": "uuid",
  "customerInfo": {
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "cliente@example.com",
    "phone": "+52 1234567890"
  },
  "shippingAddress": {
    "street": "Av. Principal 123",
    "city": "Guadalajara",
    "state": "Jalisco",
    "zipCode": "44100",
    "country": "México"
  },
  "items": [
    {
      "id": "1",
      "name": "LUNAR Balance",
      "price": 399,
      "quantity": 2,
      "image": "/products/lunar.jpg"
    }
  ],
  "subtotal": 798,
  "shipping": 100,
  "tax": 128,
  "total": 1026,
  "paymentMethod": {
    "brand": "Visa",
    "last4": "4242"
  }
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "orderId": "ORD-1234567890-abc123",
    "status": "pending",
    "total": 1026,
    "createdAt": "2024-01-15T10:00:00Z"
  },
  "message": "Pedido creado exitosamente"
}
\`\`\`

---

### Listar Mis Pedidos

**Endpoint:** `GET /orders`

**Headers:** `Authorization: Bearer {token}` (requerido)

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "orderId": "ORD-1234567890-abc123",
      "total": 1026,
      "status": "pending",
      "items": [...],
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "count": 1
}
\`\`\`

---

### Obtener Pedido por ID

**Endpoint:** `GET /orders/{orderId}`

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "orderId": "ORD-1234567890-abc123",
    "customerInfo": {...},
    "shippingAddress": {...},
    "items": [...],
    "subtotal": 798,
    "shipping": 100,
    "tax": 128,
    "total": 1026,
    "status": "pending",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
\`\`\`

---

## ⭐ Reseñas

### Crear Reseña

**Endpoint:** `POST /reviews`

**Headers:** `Authorization: Bearer {token}` (requerido)

**Request Body:**
\`\`\`json
{
  "productId": "1",
  "rating": 5,
  "title": "Excelente producto",
  "comment": "Me ayudó mucho con el sueño. Lo recomiendo 100%"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "REV-1234567890",
    "productId": "1",
    "rating": 5,
    "title": "Excelente producto",
    "comment": "Me ayudó mucho...",
    "date": "2024-01-15T10:00:00Z"
  },
  "message": "Reseña publicada exitosamente"
}
\`\`\`

**Errores:**
- `401` - No autenticado
- `400` - Campos requeridos faltantes o rating inválido

---

### Listar Reseñas de un Producto

**Endpoint:** `GET /reviews?productId={id}`

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "REV-1",
      "author": "María García",
      "rating": 5,
      "title": "Excelente",
      "comment": "Me encantó",
      "date": "2024-01-15T10:00:00Z",
      "helpful": 5,
      "verified": true
    }
  ],
  "count": 1
}
\`\`\`

---

## 👤 Perfil de Usuario

### Obtener Perfil

**Endpoint:** `GET /profile`

**Headers:** `Authorization: Bearer {token}` (requerido)

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "cliente@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "+52 1234567890",
    "totalOrders": 5,
    "totalSpent": 5130
  }
}
\`\`\`

---

### Actualizar Perfil

**Endpoint:** `PUT /profile`

**Headers:** `Authorization: Bearer {token}` (requerido)

**Request Body:**
\`\`\`json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "+52 1234567890",
  "address": "Av. Principal 123",
  "city": "Guadalajara",
  "state": "Jalisco",
  "zip_code": "44100"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Perfil actualizado exitosamente"
}
\`\`\`

---

## 🚚 Zonas de Entrega

### Listar Zonas de Entrega Activas

**Endpoint:** `GET /delivery-zones`

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Zona Metropolitana Guadalajara",
      "state": "Jalisco",
      "cities": ["Guadalajara", "Zapopan", "Tlaquepaque"],
      "shipping_cost": 100,
      "delivery_time": "1-2 días hábiles",
      "active": true
    }
  ]
}
\`\`\`

---

## 📊 Códigos de Estado HTTP

- `200` - OK: Solicitud exitosa
- `201` - Created: Recurso creado exitosamente
- `400` - Bad Request: Datos de entrada inválidos
- `401` - Unauthorized: No autenticado o token inválido
- `404` - Not Found: Recurso no encontrado
- `500` - Internal Server Error: Error del servidor

---

## 🔄 Refresh Token

Cuando el `access_token` expire, usa el `refresh_token` para obtener uno nuevo:

**Endpoint:** `POST /auth/refresh`

**Request Body:**
\`\`\`json
{
  "refresh_token": "refresh_token_here"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "access_token": "nuevo_access_token",
  "refresh_token": "nuevo_refresh_token",
  "expires_at": 1234567890
}
\`\`\`

---

## 💡 Ejemplos de Integración en Flutter

### Configuración del Cliente HTTP

\`\`\`dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiClient {
  static const String baseUrl = 'https://tudominio.com/api/mobile/v1';
  String? _accessToken;

  void setToken(String token) {
    _accessToken = token;
  }

  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    if (_accessToken != null) 'Authorization': 'Bearer $_accessToken',
  };

  Future<dynamic> get(String endpoint) async {
    final response = await http.get(
      Uri.parse('$baseUrl$endpoint'),
      headers: _headers,
    );
    return json.decode(response.body);
  }

  Future<dynamic> post(String endpoint, Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl$endpoint'),
      headers: _headers,
      body: json.encode(data),
    );
    return json.decode(response.body);
  }
}
\`\`\`

### Ejemplo: Login

\`\`\`dart
Future<void> login(String email, String password) async {
  final response = await apiClient.post('/auth/login', {
    'email': email,
    'password': password,
  });

  if (response['session'] != null) {
    apiClient.setToken(response['session']['access_token']);
    // Guardar token en almacenamiento local
  }
}
\`\`\`

### Ejemplo: Obtener Productos

\`\`\`dart
Future<List<Product>> getProducts() async {
  final response = await apiClient.get('/products');
  
  if (response['success']) {
    return (response['data'] as List)
        .map((json) => Product.fromJson(json))
        .toList();
  }
  return [];
}
\`\`\`

### Ejemplo: Crear Pedido

\`\`\`dart
Future<String?> createOrder(Order order) async {
  final response = await apiClient.post('/orders', order.toJson());
  
  if (response['success']) {
    return response['data']['orderId'];
  }
  return null;
}
\`\`\`

---

## 🔒 Seguridad

1. **HTTPS:** Todas las comunicaciones deben ser por HTTPS
2. **Tokens:** Almacena los tokens de forma segura (Flutter Secure Storage)
3. **Refresh Tokens:** Implementa lógica para refrescar tokens automáticamente
4. **Timeouts:** Implementa timeouts en todas las peticiones
5. **Validación:** Valida todos los datos antes de enviarlos

---

## 🐛 Manejo de Errores

Todas las respuestas de error siguen este formato:

\`\`\`json
{
  "success": false,
  "error": "Mensaje de error descriptivo"
}
\`\`\`

Implementa un manejador global de errores en Flutter para capturar y mostrar errores apropiadamente al usuario.

---

## 📞 Soporte

Para reportar bugs o solicitar nuevas funcionalidades de la API, contacta a:
- Email: soporte@stardust.com
- Documentación: https://docs.stardust.com/api
