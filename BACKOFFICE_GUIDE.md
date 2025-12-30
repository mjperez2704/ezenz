# Guía del Backoffice STARDUST

## Acceso al Backoffice

Para acceder al backoffice, navega a: **`/admin`**

Por ejemplo: `http://localhost:3000/admin` o `tudominio.com/admin`

⚠️ **IMPORTANTE**: Actualmente el backoffice NO tiene protección de autenticación. Cualquier persona puede acceder. Se recomienda implementar autenticación antes de producción.

---

## Estructura del Backoffice

### 1. Dashboard (`/admin`)
Panel principal con estadísticas generales:
- Total de productos
- Total de pedidos
- Ingresos totales
- Total de reseñas
- Suscriptores del newsletter

### 2. Productos (`/admin/productos`)
**Funcionalidades:**
- Crear, editar y eliminar productos
- Gestionar stock e inventario
- Subir imágenes de productos
- Configurar precios, categorías y beneficios
- Búsqueda y filtrado de productos

### 3. Pedidos (`/admin/pedidos`)
**Funcionalidades:**
- Ver todos los pedidos del sistema
- Actualizar estado de pedidos (pendiente, procesando, enviado, entregado, cancelado)
- Ver detalles completos de cada pedido
- Filtrar por estado y buscar pedidos
- Ver información del cliente y dirección de envío

### 4. Clientes (`/admin/clientes`)
**Funcionalidades:**
- Lista completa de clientes registrados
- Ver historial de compras de cada cliente
- Total gastado por cliente
- Búsqueda por nombre o email

### 5. Reseñas (`/admin/resenas`)
**Funcionalidades:**
- Ver todas las reseñas de productos
- Moderar y eliminar reseñas
- Filtrar por producto y calificación
- Ver estadísticas de calificaciones

### 6. Newsletter (`/admin/newsletter`)
**Funcionalidades:**
- Lista de suscriptores del newsletter
- Búsqueda de suscriptores
- Exportar lista a CSV
- Ver fecha de suscripción

---

## Configuración del Sistema

### 6.1 General (`/admin/configuracion/general`)
**Configurar:**
- Nombre del sitio
- Descripción del sitio
- Email y teléfono de contacto
- Logo del sitio

### 6.2 Pagos (`/admin/configuracion/pagos`)
**Configurar pasarelas de pago:**
- **Stripe**: Habilitar y configurar claves API
- **PayPal**: Habilitar y configurar Client ID
- **Contra Entrega**: Activar/desactivar

### 6.3 Email (`/admin/configuracion/email`)
**Configurar SMTP:**
- Host SMTP (ej: smtp.gmail.com)
- Puerto SMTP (587, 465)
- Usuario y contraseña SMTP
- Email y nombre del remitente
- Plantillas de email (pedidos, envío, etc.)

### 6.4 Redes Sociales (`/admin/configuracion/redes-sociales`)
**Configurar enlaces:**
- Facebook
- Instagram
- WhatsApp (con botón flotante)
- Twitter/X

### 6.5 Notificaciones (`/admin/configuracion/notificaciones`)
**Configurar alertas:**
- Notificaciones push (Firebase)
- Confirmación de pedido por email
- Notificación de envío
- SMS (Twilio)

### 6.6 App Móvil (`/admin/configuracion/app-movil`)
**Tres pestañas principales:**

#### Notificaciones Push
- Firebase Server Key
- Firebase Sender ID
- VAPID Public Key (Web Push)
- Habilitar notificaciones de pedidos
- Habilitar notificaciones promocionales
- Habilitar alertas de stock

#### SMS (Twilio)
- Account SID de Twilio
- Auth Token de Twilio
- Número de teléfono de Twilio
- SMS de confirmación de pedido
- SMS de envío
- SMS de entrega

#### App General
- Nombre de la app
- Versión actual
- Versión mínima requerida (force update)
- Modo mantenimiento
- Mensaje de mantenimiento
- Autenticación biométrica
- Modo oscuro
- Timeout API

---

## Gestión Operativa

### 7. Zonas de Entrega (`/admin/zonas-entrega`)
**Funcionalidades:**
- Crear y gestionar zonas de entrega
- Configurar códigos postales por zona
- Establecer costos de envío por zona
- Configurar envío gratis a partir de cierto monto
- Definir tiempos de entrega estimados
- Activar/desactivar zonas

**Ejemplo de zona:**
\`\`\`
Nombre: Zona Centro CDMX
Ciudad: Ciudad de México
Estado: CDMX
Códigos Postales: 01000, 01010, 01020
Costo de envío: $99 MXN
Envío gratis desde: $500 MXN
Días de entrega: 1-2 días
\`\`\`

### 8. Proveedores (`/admin/proveedores`)
**Funcionalidades:**
- Registrar proveedores y contactos
- Almacenar información de contacto
- Registrar productos suministrados
- Términos de pago
- Notas adicionales
- Activar/desactivar proveedores

**Información almacenada:**
- Nombre de la empresa
- Nombre de contacto
- Email y teléfono
- Dirección
- Productos que suministra
- Términos de pago
- Notas

### 9. Banners (`/admin/banners`)
**Funcionalidades:**
- Crear banners promocionales
- Subir imágenes de banners
- Configurar enlaces y botones
- Definir posición del banner (Hero, Secundario, Top Productos, Checkout)
- Establecer orden de visualización
- Programar fechas de inicio y fin
- Activar/desactivar banners

**Posiciones disponibles:**
- **Hero Principal**: Banner grande en la página de inicio
- **Secundario Home**: Banner secundario en home
- **Top Productos**: Banner en la página de productos
- **Checkout**: Banner durante el proceso de compra

---

## Base de Datos

### Tablas Supabase Creadas

1. **products** - Productos del catálogo
2. **orders** - Pedidos realizados
3. **reviews** - Reseñas de productos
4. **newsletter_subscribers** - Suscriptores del newsletter
5. **delivery_zones** - Zonas de entrega configuradas
6. **suppliers** - Proveedores
7. **banners** - Banners promocionales
8. **customers** - Clientes registrados
9. **site_settings** - Configuración del sitio (JSON)

### Scripts SQL Disponibles

Ubicados en la carpeta `/scripts`:
- `001_create_products_table.sql` - Tabla de productos
- `002_create_orders_table.sql` - Tabla de pedidos
- `003_create_reviews_table.sql` - Tabla de reseñas
- `004_create_newsletter_table.sql` - Tabla de newsletter
- `005_seed_products.sql` - Productos iniciales
- `006_create_settings_tables.sql` - Configuración general
- `007_create_delivery_zones_table.sql` - Zonas de entrega
- `008_create_suppliers_table.sql` - Proveedores
- `009_create_banners_table.sql` - Banners
- `010_create_customers_table.sql` - Clientes
- `011_create_site_settings_table.sql` - Configuración del sitio

---

## Funcionalidades Clave

### Sistema de Búsqueda
- Búsqueda en tiempo real de productos
- Accesible desde el navbar con icono de búsqueda
- Busca en nombre, descripción, categoría y beneficios

### Sistema de Filtros
- Filtrar productos por categoría
- Filtrar por rango de precios
- Ordenar por precio o nombre
- Contador dinámico de resultados

### Sistema de Reseñas
- Los clientes pueden dejar reseñas
- Calificación de 1 a 5 estrellas
- Sistema de utilidad (helpful)
- Moderación desde el backoffice

### Newsletter
- Formulario en el footer
- Validación de emails
- Prevención de duplicados
- Exportación a CSV

### Gestión de Pedidos
- Estados: Pendiente, Procesando, Enviado, Entregado, Cancelado
- Actualización en tiempo real
- Notificaciones automáticas (si están configuradas)
- Historial completo

---

## Próximos Pasos Recomendados

### 🔒 Seguridad (CRÍTICO)
1. Implementar autenticación con Supabase Auth
2. Crear middleware de protección para rutas `/admin/*`
3. Implementar roles (admin, empleado, cliente)
4. Agregar página de login para administradores

### 📱 Integración Real
1. Conectar pasarelas de pago reales (Stripe, PayPal)
2. Configurar servicio SMTP para envío de emails
3. Configurar Firebase para notificaciones push
4. Configurar Twilio para SMS

### 🚀 Funcionalidades Adicionales
1. Sistema de cupones y descuentos
2. Programa de puntos de lealtad
3. Sistema de afiliados
4. Analytics e informes avanzados
5. Comparador de productos
6. Wishlist / Lista de deseos
7. Chat de soporte en vivo

### 📊 Métricas y Reportes
1. Reportes de ventas por período
2. Productos más vendidos
3. Análisis de abandono de carrito
4. ROI de campañas
5. Reporte de inventario

---

## Notas Técnicas

- **Framework**: Next.js 16 con App Router
- **Base de Datos**: Supabase (PostgreSQL)
- **UI**: Shadcn/ui con Tailwind CSS
- **Autenticación**: Pendiente de implementar
- **Pagos**: Sistema simulado (requiere configuración real)

---

## Soporte

Para cualquier problema o pregunta sobre el backoffice, consulta la documentación de Supabase en: https://supabase.com/docs
