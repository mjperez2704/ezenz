# STARDUST - Guía Completa de Integración API para Flutter

## Tabla de Contenidos

1. [Información General](#información-general)
2. [Configuración Inicial](#configuración-inicial)
3. [Autenticación](#autenticación)
4. [Endpoints de Productos](#endpoints-de-productos)
5. [Endpoints de Órdenes](#endpoints-de-órdenes)
6. [Endpoints de Perfil](#endpoints-de-perfil)
7. [Endpoints de Direcciones](#endpoints-de-direcciones)
8. [Endpoints de Reseñas](#endpoints-de-reseñas)
9. [Endpoints de Categorías](#endpoints-de-categorías)
10. [Endpoints de Notificaciones](#endpoints-de-notificaciones)
11. [Webhooks](#webhooks)
12. [Manejo de Errores](#manejo-de-errores)
13. [Ejemplos de Código Flutter](#ejemplos-de-código-flutter)
14. [Testing](#testing)

---

## Información General

### URL Base de la API

\`\`\`
Producción: https://tu-dominio.vercel.app/api/mobile/v1
Desarrollo: http://localhost:3000/api/mobile/v1
\`\`\`

### Formato de Respuestas

Todas las respuestas de la API siguen este formato estándar:

\`\`\`json
{
  "success": true,
  "data": { ... },
  "message": "Mensaje descriptivo",
  "count": 10
}
\`\`\`

Para errores:

\`\`\`json
{
  "success": false,
  "error": "Mensaje de error"
}
\`\`\`

### Códigos de Estado HTTP

- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Datos inválidos
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - Sin permisos
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

---

## Configuración Inicial

### 1. Dependencias de Flutter

Agrega estas dependencias a tu `pubspec.yaml`:

\`\`\`yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0
  shared_preferences: ^2.2.0
  provider: ^6.0.5
  flutter_secure_storage: ^9.0.0
\`\`\`

### 2. Configuración de Constantes

\`\`\`dart
// lib/config/api_config.dart

class ApiConfig {
  static const String baseUrl = 'https://tu-dominio.vercel.app/api/mobile/v1';
  
  // Endpoints de Autenticación
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String logout = '/auth/logout';
  
  // Endpoints de Productos
  static const String products = '/products';
  static const String productDetail = '/products'; // + /{id}
  static const String categories = '/categories';
  
  // Endpoints de Órdenes
  static const String orders = '/orders';
  static const String orderDetail = '/orders'; // + /{id}
  static const String orderHistory = '/orders/history';
  
  // Endpoints de Perfil
  static const String profile = '/profile';
  static const String addresses = '/addresses';
  
  // Endpoints de Reseñas
  static const String reviews = '/reviews';
  
  // Endpoints de Notificaciones
  static const String notifications = '/notifications';
  
  // Webhooks
  static const String mercadopagoWebhook = '/mercadopago/webhook';
}
\`\`\`

### 3. Servicio HTTP Base

\`\`\`dart
// lib/services/http_service.dart

import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/api_config.dart';

class HttpService {
  static final HttpService _instance = HttpService._internal();
  factory HttpService() => _instance;
  HttpService._internal();

  final _storage = const FlutterSecureStorage();
  String? _accessToken;

  // Guardar token
  Future<void> setToken(String token) async {
    _accessToken = token;
    await _storage.write(key: 'access_token', value: token);
  }

  // Obtener token
  Future<String?> getToken() async {
    if (_accessToken == null) {
      _accessToken = await _storage.read(key: 'access_token');
    }
    return _accessToken;
  }

  // Limpiar token
  Future<void> clearToken() async {
    _accessToken = null;
    await _storage.delete(key: 'access_token');
  }

  // Headers por defecto
  Future<Map<String, String>> _getHeaders({bool includeAuth = true}) async {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth) {
      final token = await getToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  // GET Request
  Future<http.Response> get(String endpoint, {Map<String, String>? queryParams}) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}$endpoint')
        .replace(queryParameters: queryParams);
    
    final headers = await _getHeaders();
    
    return await http.get(uri, headers: headers);
  }

  // POST Request
  Future<http.Response> post(String endpoint, {required Map<String, dynamic> body}) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}$endpoint');
    final headers = await _getHeaders();
    
    return await http.post(
      uri,
      headers: headers,
      body: jsonEncode(body),
    );
  }

  // PUT Request
  Future<http.Response> put(String endpoint, {required Map<String, dynamic> body}) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}$endpoint');
    final headers = await _getHeaders();
    
    return await http.put(
      uri,
      headers: headers,
      body: jsonEncode(body),
    );
  }

  // DELETE Request
  Future<http.Response> delete(String endpoint) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}$endpoint');
    final headers = await _getHeaders();
    
    return await http.delete(uri, headers: headers);
  }

  // Manejo de respuestas
  dynamic handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return jsonDecode(response.body);
    } else {
      final error = jsonDecode(response.body);
      throw HttpException(
        error['error'] ?? 'Error desconocido',
        response.statusCode,
      );
    }
  }
}

class HttpException implements Exception {
  final String message;
  final int statusCode;

  HttpException(this.message, this.statusCode);

  @override
  String toString() => message;
}
\`\`\`

---

## Autenticación

### 1. Login

**Endpoint:** `POST /auth/login`

**Request Body:**
\`\`\`json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
\`\`\`

**Response Exitoso:**
\`\`\`json
{
  "message": "Login exitoso",
  "user": {
    "id": "uuid-del-usuario",
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "+52 1234567890"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": 1703980800
  }
}
\`\`\`

**Código Flutter:**

\`\`\`dart
// lib/services/auth_service.dart

class AuthService {
  final HttpService _http = HttpService();

  Future<User> login(String email, String password) async {
    try {
      final response = await _http.post(
        ApiConfig.login,
        body: {
          'email': email,
          'password': password,
        },
      );

      final data = _http.handleResponse(response);
      
      // Guardar token
      await _http.setToken(data['session']['access_token']);
      
      return User.fromJson(data['user']);
    } catch (e) {
      throw Exception('Error en login: $e');
    }
  }
}
\`\`\`

### 2. Registro

**Endpoint:** `POST /auth/register`

**Request Body:**
\`\`\`json
{
  "email": "nuevo@ejemplo.com",
  "password": "contraseña123",
  "firstName": "María",
  "lastName": "García",
  "phone": "+52 9876543210"
}
\`\`\`

**Response Exitoso:**
\`\`\`json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "uuid-nuevo-usuario",
    "email": "nuevo@ejemplo.com",
    "firstName": "María",
    "lastName": "García",
    "phone": "+52 9876543210"
  }
}
\`\`\`

**Código Flutter:**

\`\`\`dart
Future<User> register({
  required String email,
  required String password,
  required String firstName,
  required String lastName,
  String? phone,
}) async {
  try {
    final response = await _http.post(
      ApiConfig.register,
      body: {
        'email': email,
        'password': password,
        'firstName': firstName,
        'lastName': lastName,
        if (phone != null) 'phone': phone,
      },
    );

    final data = _http.handleResponse(response);
    return User.fromJson(data['user']);
  } catch (e) {
    throw Exception('Error en registro: $e');
  }
}
\`\`\`

### 3. Logout

**Endpoint:** `POST /auth/logout`

**Código Flutter:**

\`\`\`dart
Future<void> logout() async {
  try {
    await _http.post(ApiConfig.logout, body: {});
    await _http.clearToken();
  } catch (e) {
    throw Exception('Error en logout: $e');
  }
}
\`\`\`

---

## Endpoints de Productos

### 1. Obtener Todos los Productos

**Endpoint:** `GET /products`

**Query Parameters:**
- `category` (opcional): Filtrar por categoría
- `search` (opcional): Búsqueda por texto
- `minPrice` (opcional): Precio mínimo
- `maxPrice` (opcional): Precio máximo

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "PROD-001",
      "name": "Balance Energético",
      "description": "Adaptógenos para equilibrio energético",
      "price": 450.00,
      "originalPrice": 500.00,
      "category": "Balance",
      "image": "/images/balance-energetico.jpg",
      "stock": 25,
      "rating": 4.8,
      "reviewCount": 156,
      "isNew": true,
      "discount": 10
    }
  ],
  "count": 12
}
\`\`\`

**Código Flutter:**

\`\`\`dart
// lib/services/product_service.dart

class ProductService {
  final HttpService _http = HttpService();

  Future<List<Product>> getAllProducts({
    String? category,
    String? search,
    double? minPrice,
    double? maxPrice,
  }) async {
    try {
      final queryParams = <String, String>{};
      
      if (category != null) queryParams['category'] = category;
      if (search != null) queryParams['search'] = search;
      if (minPrice != null) queryParams['minPrice'] = minPrice.toString();
      if (maxPrice != null) queryParams['maxPrice'] = maxPrice.toString();

      final response = await _http.get(
        ApiConfig.products,
        queryParams: queryParams.isNotEmpty ? queryParams : null,
      );

      final data = _http.handleResponse(response);
      
      return (data['data'] as List)
          .map((json) => Product.fromJson(json))
          .toList();
    } catch (e) {
      throw Exception('Error al obtener productos: $e');
    }
  }
}
\`\`\`

### 2. Obtener Detalle de Producto

**Endpoint:** `GET /products/{id}`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "PROD-001",
    "name": "Balance Energético",
    "description": "Descripción detallada del producto...",
    "price": 450.00,
    "originalPrice": 500.00,
    "category": "Balance",
    "images": [
      "/images/balance-energetico-1.jpg",
      "/images/balance-energetico-2.jpg"
    ],
    "stock": 25,
    "rating": 4.8,
    "reviewCount": 156,
    "ingredients": ["Ashwagandha", "Rhodiola", "Ginseng"],
    "benefits": ["Energía sostenida", "Reduce estrés", "Mejora enfoque"],
    "usage": "Tomar 2 cápsulas al día con alimentos"
  }
}
\`\`\`

**Código Flutter:**

\`\`\`dart
Future<Product> getProductById(String id) async {
  try {
    final response = await _http.get('${ApiConfig.productDetail}/$id');
    final data = _http.handleResponse(response);
    return Product.fromJson(data['data']);
  } catch (e) {
    throw Exception('Error al obtener producto: $e');
  }
}
\`\`\`

---

## Endpoints de Órdenes

### 1. Crear Orden

**Endpoint:** `POST /orders`

**Request Body:**
\`\`\`json
{
  "userId": "uuid-usuario",
  "customerInfo": {
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@ejemplo.com",
    "phone": "+52 1234567890"
  },
  "shippingAddress": {
    "address": "Av. Principal 123",
    "city": "Ciudad de México",
    "state": "CDMX",
    "zip": "01234",
    "country": "México"
  },
  "items": [
    {
      "productId": "PROD-001",
      "name": "Balance Energético",
      "quantity": 2,
      "price": 450.00,
      "image": "/images/balance-energetico.jpg"
    }
  ],
  "subtotal": 900.00,
  "shipping": 100.00,
  "tax": 144.00,
  "total": 1144.00,
  "paymentMethod": {
    "brand": "Visa",
    "last4": "4242"
  }
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "orderId": "ORD-1703980800-abc123",
    "status": "pending",
    "total": 1144.00,
    "createdAt": "2024-12-30T19:00:00.000Z"
  },
  "message": "Pedido creado exitosamente"
}
\`\`\`

**Código Flutter:**

\`\`\`dart
// lib/services/order_service.dart

class OrderService {
  final HttpService _http = HttpService();

  Future<Order> createOrder({
    required String userId,
    required CustomerInfo customerInfo,
    required ShippingAddress shippingAddress,
    required List<OrderItem> items,
    required double subtotal,
    required double shipping,
    required double tax,
    required double total,
    required PaymentMethod paymentMethod,
  }) async {
    try {
      final response = await _http.post(
        ApiConfig.orders,
        body: {
          'userId': userId,
          'customerInfo': customerInfo.toJson(),
          'shippingAddress': shippingAddress.toJson(),
          'items': items.map((item) => item.toJson()).toList(),
          'subtotal': subtotal,
          'shipping': shipping,
          'tax': tax,
          'total': total,
          'paymentMethod': paymentMethod.toJson(),
        },
      );

      final data = _http.handleResponse(response);
      return Order.fromJson(data['data']);
    } catch (e) {
      throw Exception('Error al crear orden: $e');
    }
  }
}
\`\`\`

### 2. Obtener Historial de Órdenes

**Endpoint:** `GET /orders`

**Headers:**
\`\`\`
Authorization: Bearer {access_token}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "orderId": "ORD-1703980800-abc123",
      "total": 1144.00,
      "status": "processing",
      "createdAt": "2024-12-30T19:00:00.000Z",
      "items": [
        {
          "name": "Balance Energético",
          "quantity": 2,
          "price": 450.00
        }
      ]
    }
  ],
  "count": 5
}
\`\`\`

**Código Flutter:**

\`\`\`dart
Future<List<Order>> getOrderHistory() async {
  try {
    final response = await _http.get(ApiConfig.orders);
    final data = _http.handleResponse(response);
    
    return (data['data'] as List)
        .map((json) => Order.fromJson(json))
        .toList();
  } catch (e) {
    throw Exception('Error al obtener historial: $e');
  }
}
\`\`\`

### 3. Obtener Detalle de Orden

**Endpoint:** `GET /orders/{id}`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "orderId": "ORD-1703980800-abc123",
    "status": "processing",
    "customerInfo": {
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan@ejemplo.com"
    },
    "shippingAddress": {
      "address": "Av. Principal 123",
      "city": "Ciudad de México",
      "state": "CDMX",
      "zip": "01234"
    },
    "items": [...],
    "subtotal": 900.00,
    "shipping": 100.00,
    "tax": 144.00,
    "total": 1144.00,
    "createdAt": "2024-12-30T19:00:00.000Z",
    "trackingNumber": "TRACK123456",
    "estimatedDelivery": "2025-01-05T00:00:00.000Z"
  }
}
\`\`\`

**Código Flutter:**

\`\`\`dart
Future<Order> getOrderById(String orderId) async {
  try {
    final response = await _http.get('${ApiConfig.orderDetail}/$orderId');
    final data = _http.handleResponse(response);
    return Order.fromJson(data['data']);
  } catch (e) {
    throw Exception('Error al obtener orden: $e');
  }
}
\`\`\`

---

## Endpoints de Perfil

### 1. Obtener Perfil

**Endpoint:** `GET /profile`

**Headers:**
\`\`\`
Authorization: Bearer {access_token}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "uuid-usuario",
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "+52 1234567890",
    "totalOrders": 15,
    "totalSpent": 12500.00
  }
}
\`\`\`

**Código Flutter:**

\`\`\`dart
// lib/services/profile_service.dart

class ProfileService {
  final HttpService _http = HttpService();

  Future<UserProfile> getProfile() async {
    try {
      final response = await _http.get(ApiConfig.profile);
      final data = _http.handleResponse(response);
      return UserProfile.fromJson(data['data']);
    } catch (e) {
      throw Exception('Error al obtener perfil: $e');
    }
  }
}
\`\`\`

### 2. Actualizar Perfil

**Endpoint:** `PUT /profile`

**Request Body:**
\`\`\`json
{
  "firstName": "Juan Carlos",
  "lastName": "Pérez García",
  "phone": "+52 9876543210",
  "address": "Nueva Dirección 456",
  "city": "Guadalajara",
  "state": "Jalisco",
  "zip_code": "44100"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Perfil actualizado exitosamente"
}
\`\`\`

**Código Flutter:**

\`\`\`dart
Future<void> updateProfile({
  required String firstName,
  required String lastName,
  String? phone,
  String? address,
  String? city,
  String? state,
  String? zipCode,
}) async {
  try {
    await _http.put(
      ApiConfig.profile,
      body: {
        'firstName': firstName,
        'lastName': lastName,
        if (phone != null) 'phone': phone,
        if (address != null) 'address': address,
        if (city != null) 'city': city,
        if (state != null) 'state': state,
        if (zipCode != null) 'zip_code': zipCode,
      },
    );
  } catch (e) {
    throw Exception('Error al actualizar perfil: $e');
  }
}
\`\`\`

---

## Endpoints de Direcciones

### 1. Obtener Direcciones

**Endpoint:** `GET /addresses`

**Headers:**
\`\`\`
Authorization: Bearer {access_token}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "addr-123",
      "address": "Av. Principal 123",
      "city": "Ciudad de México",
      "state": "CDMX",
      "zip": "01234",
      "country": "México"
    }
  ]
}
\`\`\`

**Código Flutter:**

\`\`\`dart
// lib/services/address_service.dart

class AddressService {
  final HttpService _http = HttpService();

  Future<List<Address>> getAddresses() async {
    try {
      final response = await _http.get(ApiConfig.addresses);
      final data = _http.handleResponse(response);
      
      return (data['data'] as List)
          .map((json) => Address.fromJson(json))
          .toList();
    } catch (e) {
      throw Exception('Error al obtener direcciones: $e');
    }
  }
}
\`\`\`

### 2. Guardar Dirección

**Endpoint:** `POST /addresses`

**Request Body:**
\`\`\`json
{
  "address": "Av. Reforma 789",
  "city": "Monterrey",
  "state": "Nuevo León",
  "zip": "64000",
  "country": "México"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Dirección guardada exitosamente",
  "data": {
    "id": "addr-456",
    "address": "Av. Reforma 789",
    "city": "Monterrey",
    "state": "Nuevo León",
    "zip": "64000"
  }
}
\`\`\`

**Código Flutter:**

\`\`\`dart
Future<Address> saveAddress({
  required String address,
  required String city,
  required String state,
  required String zip,
  String country = 'México',
}) async {
  try {
    final response = await _http.post(
      ApiConfig.addresses,
      body: {
        'address': address,
        'city': city,
        'state': state,
        'zip': zip,
        'country': country,
      },
    );

    final data = _http.handleResponse(response);
    return Address.fromJson(data['data']);
  } catch (e) {
    throw Exception('Error al guardar dirección: $e');
  }
}
\`\`\`

---

## Endpoints de Reseñas

### 1. Obtener Reseñas de Producto

**Endpoint:** `GET /reviews?productId={id}`

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "REV-001",
      "productId": "PROD-001",
      "author": "María García",
      "rating": 5,
      "title": "Excelente producto",
      "comment": "Me ha ayudado mucho con mi energía",
      "date": "2024-12-25T10:00:00.000Z",
      "helpful": 12,
      "verified": true
    }
  ],
  "count": 156
}
\`\`\`

**Código Flutter:**

\`\`\`dart
// lib/services/review_service.dart

class ReviewService {
  final HttpService _http = HttpService();

  Future<List<Review>> getProductReviews(String productId) async {
    try {
      final response = await _http.get(
        ApiConfig.reviews,
        queryParams: {'productId': productId},
      );

      final data = _http.handleResponse(response);
      
      return (data['data'] as List)
          .map((json) => Review.fromJson(json))
          .toList();
    } catch (e) {
      throw Exception('Error al obtener reseñas: $e');
    }
  }
}
\`\`\`

### 2. Crear Reseña

**Endpoint:** `POST /reviews`

**Headers:**
\`\`\`
Authorization: Bearer {access_token}
\`\`\`

**Request Body:**
\`\`\`json
{
  "productId": "PROD-001",
  "rating": 5,
  "title": "Muy bueno",
  "comment": "Producto de excelente calidad"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "REV-002",
    "productId": "PROD-001",
    "rating": 5,
    "title": "Muy bueno",
    "comment": "Producto de excelente calidad"
  },
  "message": "Reseña publicada exitosamente"
}
\`\`\`

**Código Flutter:**

\`\`\`dart
Future<Review> createReview({
  required String productId,
  required int rating,
  String? title,
  required String comment,
}) async {
  try {
    final response = await _http.post(
      ApiConfig.reviews,
      body: {
        'productId': productId,
        'rating': rating,
        if (title != null) 'title': title,
        'comment': comment,
      },
    );

    final data = _http.handleResponse(response);
    return Review.fromJson(data['data']);
  } catch (e) {
    throw Exception('Error al crear reseña: $e');
  }
}
\`\`\`

---

## Endpoints de Categorías

### 1. Obtener Categorías

**Endpoint:** `GET /categories`

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "name": "Balance",
      "count": 8
    },
    {
      "name": "Energía",
      "count": 12
    },
    {
      "name": "Recuperación",
      "count": 6
    }
  ]
}
\`\`\`

**Código Flutter:**

\`\`\`dart
// lib/services/category_service.dart

class CategoryService {
  final HttpService _http = HttpService();

  Future<List<Category>> getCategories() async {
    try {
      final response = await _http.get(ApiConfig.categories);
      final data = _http.handleResponse(response);
      
      return (data['data'] as List)
          .map((json) => Category.fromJson(json))
          .toList();
    } catch (e) {
      throw Exception('Error al obtener categorías: $e');
    }
  }
}
\`\`\`

---

## Endpoints de Notificaciones

### 1. Obtener Notificaciones

**Endpoint:** `GET /notifications`

**Query Parameters:**
- `unreadOnly` (opcional): `true` para obtener solo no leídas

**Headers:**
\`\`\`
Authorization: Bearer {access_token}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "NOTIF-001",
      "userId": "uuid-usuario",
      "title": "Pedido confirmado",
      "message": "Tu pedido ORD-12345 ha sido confirmado",
      "type": "order",
      "read": false,
      "data": {
        "orderId": "ORD-12345"
      },
      "createdAt": "2024-12-30T15:00:00.000Z"
    }
  ],
  "count": 5,
  "unreadCount": 2
}
\`\`\`

**Código Flutter:**

\`\`\`dart
// lib/services/notification_service.dart

class NotificationService {
  final HttpService _http = HttpService();

  Future<NotificationResponse> getNotifications({bool unreadOnly = false}) async {
    try {
      final response = await _http.get(
        ApiConfig.notifications,
        queryParams: unreadOnly ? {'unreadOnly': 'true'} : null,
      );

      final data = _http.handleResponse(response);
      
      return NotificationResponse(
        notifications: (data['data'] as List)
            .map((json) => AppNotification.fromJson(json))
            .toList(),
        count: data['count'],
        unreadCount: data['unreadCount'],
      );
    } catch (e) {
      throw Exception('Error al obtener notificaciones: $e');
    }
  }
}
\`\`\`

### 2. Marcar Notificación como Leída

**Endpoint:** `PUT /notifications`

**Request Body:**
\`\`\`json
{
  "notificationId": "NOTIF-001",
  "read": true
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Notificación actualizada"
}
\`\`\`

**Código Flutter:**

\`\`\`dart
Future<void> markAsRead(String notificationId) async {
  try {
    await _http.put(
      ApiConfig.notifications,
      body: {
        'notificationId': notificationId,
        'read': true,
      },
    );
  } catch (e) {
    throw Exception('Error al marcar notificación: $e');
  }
}
\`\`\`

### 3. Marcar Todas como Leídas

**Endpoint:** `POST /notifications`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Todas las notificaciones marcadas como leídas"
}
\`\`\`

**Código Flutter:**

\`\`\`dart
Future<void> markAllAsRead() async {
  try {
    await _http.post(ApiConfig.notifications, body: {});
  } catch (e) {
    throw Exception('Error al marcar notificaciones: $e');
  }
}
\`\`\`

---

## Webhooks

### 1. Webhook de MercadoPago

**Endpoint:** `POST /mercadopago/webhook`

**Descripción:** Este endpoint recibe notificaciones de MercadoPago cuando se procesa un pago.

**Request Body (ejemplo):**
\`\`\`json
{
  "type": "payment",
  "action": "payment.created",
  "data": {
    "id": "12345678"
  },
  "external_reference": "ORD-1703980800-abc123"
}
\`\`\`

**Tipos de eventos:**
- `payment.created` - Pago creado
- `payment.updated` - Pago actualizado
- `payment.approved` - Pago aprobado
- `payment.rejected` - Pago rechazado

**Configuración en MercadoPago:**

1. Ir al Dashboard de MercadoPago
2. Configurar Webhooks
3. Agregar URL: `https://tu-dominio.vercel.app/api/mobile/v1/mercadopago/webhook`
4. Seleccionar eventos: `payment`

---

## Manejo de Errores

### Estructura de Errores

\`\`\`dart
// lib/models/api_error.dart

class ApiError {
  final String message;
  final int statusCode;
  final String? field;

  ApiError({
    required this.message,
    required this.statusCode,
    this.field,
  });

  factory ApiError.fromJson(Map<String, dynamic> json) {
    return ApiError(
      message: json['error'] ?? 'Error desconocido',
      statusCode: json['statusCode'] ?? 500,
      field: json['field'],
    );
  }

  @override
  String toString() => message;
}
\`\`\`

### Manejo de Errores Común

\`\`\`dart
// lib/utils/error_handler.dart

class ErrorHandler {
  static String getErrorMessage(dynamic error) {
    if (error is HttpException) {
      switch (error.statusCode) {
        case 400:
          return 'Datos inválidos. Por favor verifica la información.';
        case 401:
          return 'Sesión expirada. Por favor inicia sesión nuevamente.';
        case 403:
          return 'No tienes permisos para realizar esta acción.';
        case 404:
          return 'Recurso no encontrado.';
        case 500:
          return 'Error del servidor. Intenta nuevamente más tarde.';
        default:
          return error.message;
      }
    }
    
    return 'Error de conexión. Verifica tu internet.';
  }

  static void handleError(BuildContext context, dynamic error) {
    final message = getErrorMessage(error);
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        duration: const Duration(seconds: 3),
      ),
    );
  }
}
\`\`\`

---

## Ejemplos de Código Flutter

### Modelos de Datos

\`\`\`dart
// lib/models/product.dart

class Product {
  final String id;
  final String name;
  final String description;
  final double price;
  final double? originalPrice;
  final String category;
  final String image;
  final int stock;
  final double rating;
  final int reviewCount;
  final bool isNew;
  final int? discount;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    this.originalPrice,
    required this.category,
    required this.image,
    required this.stock,
    required this.rating,
    required this.reviewCount,
    this.isNew = false,
    this.discount,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      price: json['price'].toDouble(),
      originalPrice: json['originalPrice']?.toDouble(),
      category: json['category'],
      image: json['image'],
      stock: json['stock'],
      rating: json['rating'].toDouble(),
      reviewCount: json['reviewCount'],
      isNew: json['isNew'] ?? false,
      discount: json['discount'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'price': price,
      'originalPrice': originalPrice,
      'category': category,
      'image': image,
      'stock': stock,
      'rating': rating,
      'reviewCount': reviewCount,
      'isNew': isNew,
      'discount': discount,
    };
  }
}
\`\`\`

\`\`\`dart
// lib/models/order.dart

class Order {
  final String orderId;
  final String? userId;
  final CustomerInfo customerInfo;
  final ShippingAddress shippingAddress;
  final List<OrderItem> items;
  final double subtotal;
  final double shipping;
  final double tax;
  final double total;
  final String status;
  final DateTime createdAt;
  final String? trackingNumber;

  Order({
    required this.orderId,
    this.userId,
    required this.customerInfo,
    required this.shippingAddress,
    required this.items,
    required this.subtotal,
    required this.shipping,
    required this.tax,
    required this.total,
    required this.status,
    required this.createdAt,
    this.trackingNumber,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      orderId: json['orderId'],
      userId: json['userId'],
      customerInfo: CustomerInfo.fromJson(json['customerInfo']),
      shippingAddress: ShippingAddress.fromJson(json['shippingAddress']),
      items: (json['items'] as List)
          .map((item) => OrderItem.fromJson(item))
          .toList(),
      subtotal: json['subtotal'].toDouble(),
      shipping: json['shipping'].toDouble(),
      tax: json['tax'].toDouble(),
      total: json['total'].toDouble(),
      status: json['status'],
      createdAt: DateTime.parse(json['createdAt']),
      trackingNumber: json['trackingNumber'],
    );
  }
}
\`\`\`

### Provider de Estado (con provider package)

\`\`\`dart
// lib/providers/auth_provider.dart

import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();
  User? _user;
  bool _isLoading = false;

  User? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _user != null;

  Future<void> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      _user = await _authService.login(email, password);
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    String? phone,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      _user = await _authService.register(
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
      );
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    _user = null;
    notifyListeners();
  }
}
\`\`\`

### Ejemplo de Pantalla de Login

\`\`\`dart
// lib/screens/login_screen.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../utils/error_handler.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    final authProvider = context.read<AuthProvider>();

    try {
      await authProvider.login(
        _emailController.text.trim(),
        _passwordController.text,
      );

      if (mounted) {
        Navigator.of(context).pushReplacementNamed('/home');
      }
    } catch (e) {
      if (mounted) {
        ErrorHandler.handleError(context, e);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Logo
                Image.asset(
                  'assets/images/logo.png',
                  height: 100,
                ),
                const SizedBox(height: 48),

                // Email field
                TextFormField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(
                    labelText: 'Email',
                    prefixIcon: Icon(Icons.email),
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Por favor ingresa tu email';
                    }
                    if (!value.contains('@')) {
                      return 'Email inválido';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                // Password field
                TextFormField(
                  controller: _passwordController,
                  obscureText: _obscurePassword,
                  decoration: InputDecoration(
                    labelText: 'Contraseña',
                    prefixIcon: const Icon(Icons.lock),
                    border: const OutlineInputBorder(),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword 
                            ? Icons.visibility 
                            : Icons.visibility_off,
                      ),
                      onPressed: () {
                        setState(() {
                          _obscurePassword = !_obscurePassword;
                        });
                      },
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Por favor ingresa tu contraseña';
                    }
                    if (value.length < 6) {
                      return 'La contraseña debe tener al menos 6 caracteres';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 24),

                // Login button
                Consumer<AuthProvider>(
                  builder: (context, authProvider, child) {
                    return ElevatedButton(
                      onPressed: authProvider.isLoading 
                          ? null 
                          : _handleLogin,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        backgroundColor: const Color(0xFF6B46C1),
                      ),
                      child: authProvider.isLoading
                          ? const CircularProgressIndicator(
                              valueColor: AlwaysStoppedAnimation<Color>(
                                Colors.white,
                              ),
                            )
                          : const Text(
                              'Iniciar Sesión',
                              style: TextStyle(fontSize: 16),
                            ),
                    );
                  },
                ),

                const SizedBox(height: 16),

                // Register link
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pushNamed('/register');
                  },
                  child: const Text('¿No tienes cuenta? Regístrate'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
\`\`\`

### Ejemplo de Pantalla de Productos

\`\`\`dart
// lib/screens/products_screen.dart

import 'package:flutter/material.dart';
import '../models/product.dart';
import '../services/product_service.dart';
import '../utils/error_handler.dart';

class ProductsScreen extends StatefulWidget {
  const ProductsScreen({Key? key}) : super(key: key);

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  final ProductService _productService = ProductService();
  List<Product> _products = [];
  bool _isLoading = true;
  String? _selectedCategory;

  @override
  void initState() {
    super.initState();
    _loadProducts();
  }

  Future<void> _loadProducts() async {
    setState(() => _isLoading = true);

    try {
      final products = await _productService.getAllProducts(
        category: _selectedCategory,
      );

      setState(() {
        _products = products;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ErrorHandler.handleError(context, e);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Productos'),
        backgroundColor: const Color(0xFF6B46C1),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadProducts,
              child: GridView.builder(
                padding: const EdgeInsets.all(16),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.7,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                ),
                itemCount: _products.length,
                itemBuilder: (context, index) {
                  final product = _products[index];
                  
                  return GestureDetector(
                    onTap: () {
                      Navigator.of(context).pushNamed(
                        '/product-detail',
                        arguments: product.id,
                      );
                    },
                    child: Card(
                      elevation: 4,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Product image
                          ClipRRect(
                            borderRadius: const BorderRadius.vertical(
                              top: Radius.circular(12),
                            ),
                            child: Image.network(
                              product.image,
                              height: 150,
                              width: double.infinity,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) {
                                return Container(
                                  height: 150,
                                  color: Colors.grey[300],
                                  child: const Icon(Icons.image),
                                );
                              },
                            ),
                          ),

                          // Product info
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  product.name,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                  ),
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 4),
                                
                                // Rating
                                Row(
                                  children: [
                                    const Icon(
                                      Icons.star,
                                      size: 16,
                                      color: Colors.amber,
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      '${product.rating} (${product.reviewCount})',
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: Colors.grey[600],
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),

                                // Price
                                Row(
                                  children: [
                                    Text(
                                      '\$${product.price.toStringAsFixed(2)}',
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16,
                                        color: Color(0xFF6B46C1),
                                      ),
                                    ),
                                    if (product.originalPrice != null)
                                      Padding(
                                        padding: const EdgeInsets.only(left: 8),
                                        child: Text(
                                          '\$${product.originalPrice!.toStringAsFixed(2)}',
                                          style: TextStyle(
                                            fontSize: 12,
                                            color: Colors.grey[600],
                                            decoration: TextDecoration.lineThrough,
                                          ),
                                        ),
                                      ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
    );
  }
}
\`\`\`

---

## Testing

### Setup de Testing

\`\`\`yaml
# pubspec.yaml (dev dependencies)

dev_dependencies:
  flutter_test:
    sdk: flutter
  mockito: ^5.4.0
  build_runner: ^2.4.0
\`\`\`

### Test de Autenticación

\`\`\`dart
// test/services/auth_service_test.dart

import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:your_app/services/auth_service.dart';
import 'package:your_app/services/http_service.dart';

class MockHttpService extends Mock implements HttpService {}

void main() {
  group('AuthService', () {
    late AuthService authService;
    late MockHttpService mockHttp;

    setUp(() {
      mockHttp = MockHttpService();
      authService = AuthService();
    });

    test('login successful returns user', () async {
      // Arrange
      final email = 'test@example.com';
      final password = 'password123';

      // Act & Assert
      expect(
        () => authService.login(email, password),
        returnsNormally,
      );
    });

    test('login with wrong credentials throws exception', () async {
      // Arrange
      final email = 'wrong@example.com';
      final password = 'wrongpass';

      // Act & Assert
      expect(
        () => authService.login(email, password),
        throwsException,
      );
    });
  });
}
\`\`\`

---

## Checklist de Integración

### Antes de Comenzar

- [ ] Configurar cuenta de Supabase
- [ ] Obtener URL y keys de Supabase
- [ ] Configurar variables de entorno
- [ ] Instalar dependencias de Flutter
- [ ] Configurar permisos de internet en Android/iOS

### Durante el Desarrollo

- [ ] Implementar servicio HTTP base
- [ ] Implementar autenticación
- [ ] Implementar gestión de tokens
- [ ] Implementar endpoints de productos
- [ ] Implementar endpoints de órdenes
- [ ] Implementar endpoints de perfil
- [ ] Implementar manejo de errores
- [ ] Implementar caché local (opcional)
- [ ] Agregar loading states
- [ ] Agregar pull-to-refresh

### Testing

- [ ] Probar login/logout
- [ ] Probar registro de usuario
- [ ] Probar listado de productos
- [ ] Probar creación de órdenes
- [ ] Probar actualización de perfil
- [ ] Probar manejo de errores
- [ ] Probar sin conexión a internet
- [ ] Probar refresh token

### Antes del Launch

- [ ] Configurar URLs de producción
- [ ] Probar en dispositivos reales
- [ ] Optimizar imágenes
- [ ] Configurar analytics
- [ ] Configurar crashlytics
- [ ] Revisar permisos de la app
- [ ] Preparar assets para stores

---

## Soporte y Contacto

Para dudas o problemas con la integración:

- **Email:** soporte@stardust.com
- **Documentación:** https://docs.stardust.com
- **GitHub:** https://github.com/stardust/mobile-api

---

## Notas Finales

- Todos los endpoints requieren HTTPS en producción
- Los tokens de acceso expiran después de 1 hora
- Implementar refresh token para mantener sesión activa
- Cachear respuestas cuando sea posible para mejorar performance
- Implementar retry logic para requests fallidos
- Usar debouncing en búsquedas
- Implementar paginación para listas largas

---

**Última actualización:** 30 de Diciembre, 2024  
**Versión de API:** 1.0.0  
**Versión de Documento:** 1.0.0
