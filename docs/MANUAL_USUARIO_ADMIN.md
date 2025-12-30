# Manual de Usuario - Administrador STARDUST Backoffice

## Introducción

Bienvenido al **Backoffice de STARDUST**, el panel de administración completo para gestionar tu ecommerce. Esta guía te enseñará a usar todas las funcionalidades del sistema.

---

## Índice

1. [Acceso al Backoffice](#acceso-al-backoffice)
2. [Dashboard Principal](#dashboard-principal)
3. [Gestión de Productos](#gestión-de-productos)
4. [Gestión de Pedidos](#gestión-de-pedidos)
5. [Gestión de Clientes](#gestión-de-clientes)
6. [Gestión de Reseñas](#gestión-de-reseñas)
7. [Newsletter](#newsletter)
8. [Zonas de Entrega](#zonas-de-entrega)
9. [Proveedores](#proveedores)
10. [Banners Promocionales](#banners-promocionales)
11. [Usuarios Administradores](#usuarios-administradores)
12. [Configuraciones](#configuraciones)
13. [Roles y Permisos](#roles-y-permisos)

---

## Acceso al Backoffice

### Primera vez (Setup inicial)

**Paso 1: Configuración inicial**
1. Ve a: `tudominio.com/admin/setup`
2. Completa el formulario de registro:
   - **Nombre completo**: Tu nombre
   - **Email**: tu@email.com
   - **Contraseña**: Mínimo 6 caracteres
3. Clic en **"Crear Administrador"**
4. Serás redirigido al login

### Login diario

**URL de acceso**: `tudominio.com/admin/login`

**Pasos:**
1. Ingresa tu **email**
2. Ingresa tu **contraseña**
3. Clic en **"Iniciar sesión"**
4. Serás redirigido al Dashboard

### Cerrar sesión

1. Clic en tu **nombre/avatar** en el header superior derecho
2. Selecciona **"Cerrar sesión"**
3. Serás redirigido al login

### Problemas de acceso

**Olvidé mi contraseña:**
- Contacta a un Super Admin
- Ellos pueden resetear tu contraseña desde "Usuarios Admin"

**No puedo iniciar sesión:**
- Verifica que tu cuenta esté activa
- Confirma que tienes rol de administrador
- Contacta soporte técnico

---

## Dashboard Principal

### Acceso
- URL: `/admin`
- Primera pantalla después del login

### Estadísticas principales

**Métricas en tarjetas:**

| Métrica | Descripción |
|---------|-------------|
| 💰 **Ingresos Totales** | Suma de todos los pedidos completados |
| 📦 **Pedidos Totales** | Número de pedidos recibidos |
| 📦 **Pedidos Pendientes** | Pedidos que requieren atención |
| 📦 **Pedidos Procesando** | Pedidos en preparación |
| 📦 **Pedidos Enviados** | Pedidos en tránsito |
| 📦 **Pedidos Entregados** | Pedidos completados |
| 🛍️ **Total Productos** | Productos en catálogo |
| ⭐ **Total Reseñas** | Reseñas de clientes |
| 📧 **Suscriptores** | Suscriptores al newsletter |

**Gráficas:**
- Ventas por mes (últimos 6 meses)
- Productos más vendidos
- Categorías populares

### Navegación rápida

**Sidebar izquierdo:**
- Dashboard 📊
- Productos 🛍️
- Pedidos 📦
- Clientes 👥
- Reseñas ⭐
- Newsletter 📧
- Zonas de Entrega 📍
- Proveedores 🏢
- Banners 🎨
- Configuración ⚙️
- Usuarios Admin 👤

---

## Gestión de Productos

### Acceso
- Sidebar → **Productos**
- URL: `/admin/productos`

### Ver productos

**Lista de productos:**
- Tabla con todos los productos
- Columnas:
  - Imagen miniatura
  - Nombre
  - Categoría
  - Precio (MXN)
  - Stock
  - Estado (Activo/Inactivo)
  - Acciones

**Buscador:**
- Campo de búsqueda en la parte superior
- Busca por nombre o categoría
- Resultados en tiempo real

### Crear nuevo producto

**Paso 1: Abrir formulario**
- Clic en botón **"Nuevo Producto"**

**Paso 2: Completar información**

\`\`\`
Nombre del producto: [Ej: Ashwagandha Premium]

Descripción corta: 
[Breve descripción para el catálogo]

Descripción completa:
[Descripción detallada del producto]

Precio: [299.99] MXN

Categoría: [Seleccionar]
- Adaptógenos
- Hongos Medicinales
- Superalimentos
- Tónicos Herbales

Stock inicial: [100]

Imagen URL: [https://...]
(o subir imagen si está configurado Storage)

Beneficios: (separados por coma)
[Reduce estrés, Mejora energía, Aumenta resistencia]

Ingredientes: (separados por coma)
[Ashwagandha orgánica, Extracto 5:1, Sin aditivos]

Modo de uso:
[Tomar 1 cápsula al día con alimentos]

Estado: 
☑️ Activo (visible en tienda)
☐ Inactivo (oculto)
\`\`\`

**Paso 3: Guardar**
- Clic en **"Crear Producto"**
- Aparece confirmación
- Producto visible en lista

### Editar producto

1. En la lista, clic en **"Editar"** (ícono lápiz)
2. Modifica los campos necesarios
3. Clic en **"Guardar Cambios"**
4. Confirmación de actualización

### Eliminar producto

⚠️ **Precaución**: Esta acción no se puede deshacer

1. Clic en **"Eliminar"** (ícono basura)
2. Confirma la acción en el diálogo
3. Producto eliminado permanentemente

**Alternativa:** En lugar de eliminar, marca como **Inactivo**

### Gestión de stock

**Stock bajo:**
- Productos con stock < 10 aparecen marcados
- Reabastece antes de agotar

**Actualizar stock:**
1. Editar producto
2. Cambiar campo "Stock"
3. Guardar

**Stock agotado:**
- Producto se marca como "Sin stock"
- No se puede agregar al carrito
- Reabastecer lo antes posible

---

## Gestión de Pedidos

### Acceso
- Sidebar → **Pedidos**
- URL: `/admin/pedidos`

### Ver pedidos

**Lista de pedidos:**
- Tabla con todos los pedidos
- Columnas:
  - Número de pedido
  - Cliente
  - Email
  - Fecha
  - Total (MXN)
  - Estado
  - Acciones

### Estados de pedidos

| Estado | Color | Significado |
|--------|-------|-------------|
| **Pendiente** | 🟡 Amarillo | Pago recibido, por procesar |
| **Procesando** | 🔵 Azul | Preparando el envío |
| **Enviado** | 🟣 Morado | En camino al cliente |
| **Entregado** | 🟢 Verde | Recibido por el cliente |
| **Cancelado** | 🔴 Rojo | Pedido cancelado |

### Ver detalles de pedido

1. Clic en **"Ver"** en la fila del pedido
2. Se abre modal con información completa:

**Información del cliente:**
- Nombre
- Email
- Teléfono

**Dirección de envío:**
- Calle y número
- Colonia
- Código Postal
- Ciudad, Estado
- Referencias

**Productos:**
- Lista de artículos
- Cantidad de cada uno
- Precio unitario
- Subtotal

**Totales:**
- Subtotal
- Envío
- Impuestos
- **Total**

**Método de pago:**
- Tarjeta / PayPal / Contra entrega

**Notas adicionales:**
- Comentarios del cliente

### Cambiar estado de pedido

1. En la lista, usar el **selector de estado**
2. Seleccionar nuevo estado
3. Cambio automático (sin confirmación)
4. Cliente recibe notificación (si configurado)

**Flujo típico:**
\`\`\`
Pendiente → Procesando → Enviado → Entregado
\`\`\`

### Cancelar pedido

1. Cambiar estado a **"Cancelado"**
2. Agregar nota explicando motivo
3. Procesar reembolso (si aplica)

### Buscar pedidos

**Por número de pedido:**
- Escribe en el buscador: ORD-12345

**Por cliente:**
- Escribe nombre o email del cliente

**Por fecha:**
- Usar filtros de fecha (si disponible)

---

## Gestión de Clientes

### Acceso
- Sidebar → **Clientes**
- URL: `/admin/clientes`

### Ver clientes

**Lista de clientes:**
- Tabla con todos los clientes
- Columnas:
  - Nombre
  - Email
  - Teléfono
  - Total pedidos
  - Total gastado (MXN)
  - Último pedido
  - Estado
  - Acciones

### Ver perfil de cliente

1. Clic en **"Ver"** en la fila del cliente
2. Se abre modal con:

**Información personal:**
- Nombre completo
- Email
- Teléfono

**Dirección registrada:**
- Dirección completa de envío

**Estadísticas:**
- Número de pedidos realizados
- Monto total gastado
- Fecha del último pedido

**Historial de pedidos:**
- Lista de todos sus pedidos
- Clic para ver detalles

### Editar cliente

1. Clic en **"Editar"**
2. Modificar información:
   - Nombre
   - Teléfono
   - Dirección
3. Guardar cambios

### Activar/Desactivar cliente

**Desactivar:**
- Cliente no podrá realizar nuevos pedidos
- Útil para bloqueos temporales

**Activar:**
- Restaurar acceso normal

### Buscar clientes

- Campo de búsqueda en la parte superior
- Busca por nombre o email
- Resultados instantáneos

---

## Gestión de Reseñas

### Acceso
- Sidebar → **Reseñas**
- URL: `/admin/resenas`

### Ver reseñas

**Lista de reseñas:**
- Tabla con todas las reseñas
- Columnas:
  - Producto
  - Cliente (nombre)
  - Calificación (⭐⭐⭐⭐⭐)
  - Comentario
  - Fecha
  - Útil (votos)
  - Acciones

### Leer reseña completa

1. Clic en la fila de la reseña
2. Ver:
   - Título de la reseña
   - Calificación
   - Comentario completo
   - Nombre del cliente
   - Email (no público)
   - Fecha
   - Número de personas que la marcaron útil

### Moderar reseñas

**Eliminar reseña inapropiada:**
1. Clic en **"Eliminar"** (ícono basura)
2. Confirmar acción
3. Reseña eliminada permanentemente

**Motivos para eliminar:**
- Contenido ofensivo
- Spam
- Información falsa
- Fuera de tema

### Responder reseñas (próximamente)
- Función en desarrollo
- Podrás responder directamente a reseñas

---

## Newsletter

### Acceso
- Sidebar → **Newsletter**
- URL: `/admin/newsletter`

### Ver suscriptores

**Lista de suscriptores:**
- Tabla con todos los emails suscritos
- Columnas:
  - Email
  - Fecha de suscripción
  - Estado (Activo/Inactivo)
  - Acciones

### Buscar suscriptores

- Campo de búsqueda
- Busca por email
- Filtrar por estado

### Desactivar suscriptor

1. Clic en el switch de estado
2. Cambio a "Inactivo"
3. No recibirá más emails

### Eliminar suscriptor

1. Clic en **"Eliminar"**
2. Confirmar
3. Email eliminado de la lista

### Exportar lista

1. Clic en botón **"Exportar CSV"**
2. Descarga archivo con todos los emails
3. Usar para campañas de email marketing

**Formato CSV:**
\`\`\`
email,subscribed_at,is_active
cliente1@email.com,2025-01-15,true
cliente2@email.com,2025-01-16,true
\`\`\`

### Enviar campaña (integración externa)

El backoffice no envía emails directamente. Exporta la lista y usa:
- **Mailchimp**
- **SendGrid**
- **Brevo (Sendinblue)**
- **ConvertKit**

---

## Zonas de Entrega

### Acceso
- Sidebar → **Zonas de Entrega**
- URL: `/admin/zonas-entrega`

### Ver zonas

**Lista de zonas:**
- Tabla con configuraciones de envío
- Columnas:
  - Zona (nombre)
  - Estado/Región
  - Código postal (rango)
  - Costo de envío (MXN)
  - Tiempo estimado (días)
  - Estado (Activo/Inactivo)

### Crear nueva zona

1. Clic en **"Nueva Zona"**
2. Completar formulario:

\`\`\`
Nombre de la zona: [CDMX Centro]

Estado/Región: [Ciudad de México]

Códigos postales: [06000-06999]
(o lista: 06000, 06100, 06200)

Costo de envío: [100.00] MXN

Envío gratis a partir de: [999.00] MXN
(opcional)

Tiempo de entrega: [1-3] días hábiles

Estado: 
☑️ Activa
☐ Inactiva
\`\`\`

3. Guardar

### Editar zona

1. Clic en **"Editar"**
2. Modificar campos
3. Guardar cambios

### Desactivar zona

- Cambiar estado a "Inactiva"
- Clientes de esa zona no podrán comprar temporalmente

### Ejemplos de configuración

**Zona 1: CDMX**
- Costo: $100
- Tiempo: 1-3 días
- Gratis en compras > $999

**Zona 2: Área Metropolitana**
- Costo: $150
- Tiempo: 2-4 días
- Gratis en compras > $1,500

**Zona 3: Interior República**
- Costo: $200
- Tiempo: 3-7 días
- Gratis en compras > $2,000

---

## Proveedores

### Acceso
- Sidebar → **Proveedores**
- URL: `/admin/proveedores`

### Ver proveedores

**Lista de proveedores:**
- Tabla con todos los proveedores
- Columnas:
  - Nombre comercial
  - Contacto (persona)
  - Email
  - Teléfono
  - Productos suministrados
  - Estado

### Agregar proveedor

1. Clic en **"Nuevo Proveedor"**
2. Completar:

\`\`\`
Nombre comercial: [BioSupplements Co.]

Persona de contacto: [Juan Pérez]

Email: [contacto@biosupplements.com]

Teléfono: [555-123-4567]

Dirección:
[Calle Industrial 456
Col. Zona Industrial
CP 12345, CDMX]

Productos que suministra:
[Ashwagandha, Rhodiola, Cordyceps]

Términos de pago: [30 días]

Notas adicionales:
[Descuento 10% en pedidos > $50,000]

Estado:
☑️ Activo
\`\`\`

3. Guardar

### Editar proveedor

1. Clic en **"Editar"**
2. Actualizar información
3. Guardar

### Ver historial de compras (próximamente)

- Órdenes de compra realizadas
- Productos recibidos
- Pagos efectuados

---

## Banners Promocionales

### Acceso
- Sidebar → **Banners**
- URL: `/admin/banners`

### Ver banners

**Lista de banners:**
- Tabla con todos los banners
- Columnas:
  - Título
  - Ubicación (Hero, Home, Productos)
  - Imagen (miniatura)
  - Fecha inicio
  - Fecha fin
  - Estado (Activo/Inactivo)
  - Orden

### Crear banner

1. Clic en **"Nuevo Banner"**
2. Completar:

\`\`\`
Título: [Promoción 2x1 en Adaptógenos]

Descripción:
[Lleva 2 y paga 1 en productos seleccionados]

Ubicación:
○ Hero (banner principal)
○ Homepage (sección media)
○ Productos (catálogo)
○ Sidebar

URL de imagen:
[https://tu-imagen.com/banner.jpg]

Enlace del banner:
[/productos?categoria=adaptogenos]
(al hacer clic, redirige aquí)

Fecha de inicio: [2025-01-20]
Fecha de fin: [2025-01-31]

Orden de visualización: [1]
(menor número = aparece primero)

Estado:
☑️ Activo
☐ Inactivo
\`\`\`

3. Guardar

### Programar banner

- Configura fechas de inicio y fin
- Se activa/desactiva automáticamente
- Útil para campañas temporales

### Ordenar banners

- Ajusta el número de "Orden"
- Menor número = mayor prioridad
- Útil cuando hay múltiples banners

### Desactivar banner

- Cambiar estado a "Inactivo"
- Deja de mostrarse en el sitio
- No se elimina, puedes reactivarlo

---

## Usuarios Administradores

### Acceso
- Sidebar → **Usuarios Admin**
- URL: `/admin/usuarios-admin`

⚠️ **Requiere rol de Super Admin**

### Ver administradores

**Lista de admins:**
- Tabla con todos los usuarios admin
- Columnas:
  - Nombre
  - Email
  - Rol
  - Último acceso
  - Estado (Activo/Inactivo)
  - Acciones

### Crear nuevo administrador

1. Clic en **"Nuevo Administrador"**
2. Completar:

\`\`\`
Nombre completo: [María González]

Email: [maria@stardust.com]

Contraseña: [••••••••]
(mínimo 6 caracteres)

Rol: [Seleccionar]
- Super Admin (acceso total)
- Admin (gestión general)
- Editor (solo productos/contenido)
- Moderador (solo reseñas/clientes)

Estado:
☑️ Activo
☐ Inactivo
\`\`\`

3. Clic en **"Crear Administrador"**
4. Usuario puede iniciar sesión inmediatamente

### Editar administrador

1. Clic en **"Editar"**
2. Modificar:
   - Nombre
   - Rol
   - Estado
3. **No se puede cambiar email** (identificador único)
4. Guardar

### Cambiar contraseña

**Opción 1: Desde la edición**
1. Editar usuario
2. Campo "Nueva contraseña"
3. Ingresar nueva contraseña
4. Guardar

**Opción 2: Resetear contraseña**
1. Clic en **"Resetear Contraseña"**
2. Se envía email al administrador
3. Sigue el enlace para crear nueva contraseña

### Desactivar administrador

1. Editar usuario
2. Cambiar estado a **"Inactivo"**
3. Guardar

**Efectos:**
- No puede iniciar sesión
- Sesiones activas se cierran
- Útil para suspensiones temporales

### Eliminar administrador

⚠️ **Precaución**: Acción permanente

1. Clic en **"Eliminar"**
2. Confirmar en el diálogo
3. Usuario eliminado de la base de datos

**No se puede eliminar:**
- A ti mismo (usuario actual)
- Último Super Admin del sistema

---

## Configuraciones

### Acceso
- Sidebar → **Configuración** (se despliega menú)

### Configuración General

**Ruta:** `/admin/configuracion/general`

**Opciones:**

\`\`\`
Nombre del sitio: [STARDUST]

Tagline: [Balance from the stars]

Descripción del negocio:
[Adaptógenos y productos de bienestar natural...]

Información de contacto:
Email: [hola@stardust.com]
Teléfono: [+52 (55) 1234-5678]
WhatsApp: [+52 (55) 1234-5678]

Dirección física:
[Av. Reforma 123
Col. Centro
Ciudad de México, CDMX 06000]

Horario de atención:
[Lunes a Viernes: 9:00 AM - 6:00 PM]

Moneda: [MXN (Pesos Mexicanos)]

Zona horaria: [America/Mexico_City]

Idioma: [Español]
\`\`\`

Guardar cambios

### Configuración de Pagos

**Ruta:** `/admin/configuracion/pagos`

**Pasarelas disponibles:**

**1. Stripe**
\`\`\`
☑️ Activar Stripe

API Key (Pública):
[pk_test_xxxxxxxxxxxxx]

API Key (Secreta):
[sk_test_xxxxxxxxxxxxx]

Webhook Secret:
[whsec_xxxxxxxxxxxxx]

Modo:
○ Pruebas (Test)
○ Producción (Live)
\`\`\`

**2. PayPal**
\`\`\`
☑️ Activar PayPal

Client ID:
[xxxxxxxxxxxxx]

Client Secret:
[xxxxxxxxxxxxx]

Modo:
○ Sandbox
○ Producción
\`\`\`

**3. Pago Contra Entrega**
\`\`\`
☑️ Activar Contra Entrega

Cargo adicional: [50.00] MXN

Límite máximo de compra: [5000.00] MXN
\`\`\`

**Configuraciones adicionales:**
- Montos mínimos/máximos
- Impuestos (IVA %)
- Mensajes de confirmación

### Configuración de Email

**Ruta:** `/admin/configuracion/email`

**SMTP Configuration:**

\`\`\`
☑️ Activar envío de emails

Servidor SMTP:
Host: [smtp.gmail.com]
Puerto: [587]
Seguridad: 
○ TLS
○ SSL
○ Ninguna

Autenticación:
Usuario: [tu-email@gmail.com]
Contraseña: [tu-password-app]

Email remitente:
Nombre: [STARDUST]
Email: [noreply@stardust.com]

Email de respuesta:
[hola@stardust.com]
\`\`\`

**Plantillas de email:**
- Confirmación de pedido
- Envío de pedido
- Pedido entregado
- Newsletter

**Probar configuración:**
- Botón "Enviar Email de Prueba"
- Ingresa tu email
- Verifica recepción

### Configuración de Redes Sociales

**Ruta:** `/admin/configuracion/redes-sociales`

**Enlaces de redes:**

\`\`\`
Facebook:
URL: [https://facebook.com/StardustMX]
☑️ Mostrar en footer

Instagram:
URL: [https://instagram.com/stardust_mx]
☑️ Mostrar en footer

Twitter/X:
URL: [https://twitter.com/StardustMX]
☐ Mostrar en footer

WhatsApp:
Número: [+52 55 1234 5678]
☑️ Botón flotante en sitio
Mensaje predeterminado: [¡Hola! Me interesa conocer más sobre sus productos]

TikTok:
URL: [https://tiktok.com/@stardust]
☐ Mostrar en footer
\`\`\`

**Integración de Facebook Pixel:**
\`\`\`
☑️ Activar Facebook Pixel

Pixel ID: [123456789012345]
\`\`\`

**Integración de Google Analytics:**
\`\`\`
☑️ Activar Google Analytics

Tracking ID: [G-XXXXXXXXXX]
\`\`\`

### Configuración de Notificaciones

**Ruta:** `/admin/configuracion/notificaciones`

**Notificaciones Push:**

\`\`\`
☑️ Activar Push Notifications

Servicio:
○ Firebase Cloud Messaging (FCM)
○ OneSignal
○ Pusher

Firebase Configuration:
Server Key: [AAAAxxxxxxxxxxxxx]
Project ID: [stardust-xxxxx]
\`\`\`

**Notificaciones SMS:**

\`\`\`
☑️ Activar SMS

Proveedor:
○ Twilio
○ Nexmo
○ Plivo

Twilio Configuration:
Account SID: [ACxxxxxxxxxxxxx]
Auth Token: [xxxxxxxxxxxxx]
From Number: [+52 55 1234 5678]
\`\`\`

**Eventos de notificación:**

\`\`\`
☑️ Pedido recibido (al admin)
☑️ Pedido confirmado (al cliente)
☑️ Pedido enviado (al cliente)
☑️ Stock bajo (al admin)
☐ Nueva reseña (al admin)
\`\`\`

### Configuración de App Móvil

**Ruta:** `/admin/configuracion/app-movil`

**Configuración general:**

\`\`\`
Nombre de la app: [STARDUST]

Bundle ID (iOS): [com.stardust.app]
Package Name (Android): [com.stardust.app]

Versión actual: [1.0.0]
\`\`\`

**API Keys:**

\`\`\`
API Key para la app:
[xxxxx-xxxxx-xxxxx-xxxxx]

Endpoint de API:
[https://api.stardust.com/v1]
\`\`\`

**Configuración de notificaciones push:**
- Certificado APNs (iOS)
- Server Key FCM (Android)

**Deep Links:**
\`\`\`
Esquema: [stardust://]

Ejemplos:
- stardust://producto/123
- stardust://pedido/456
\`\`\`

**Recursos:**
- Logo de app (1024x1024)
- Splash screen
- Íconos de notificación

---

## Roles y Permisos

### Tipos de roles

| Rol | Permisos |
|-----|----------|
| **Super Admin** | Acceso total a todo el sistema |
| **Admin** | Gestión de productos, pedidos, clientes |
| **Editor** | Solo productos, banners, contenido |
| **Moderador** | Solo reseñas y clientes |

### Permisos por sección

**Dashboard:**
- ✅ Todos los roles

**Productos:**
- ✅ Super Admin (CRUD completo)
- ✅ Admin (CRUD completo)
- ✅ Editor (CRUD completo)
- ❌ Moderador (solo lectura)

**Pedidos:**
- ✅ Super Admin (gestión completa)
- ✅ Admin (gestión completa)
- ❌ Editor (solo lectura)
- ❌ Moderador (solo lectura)

**Clientes:**
- ✅ Super Admin (gestión completa)
- ✅ Admin (gestión completa)
- ✅ Moderador (puede editar/desactivar)
- ❌ Editor (solo lectura)

**Reseñas:**
- ✅ Todos (gestión completa)

**Newsletter:**
- ✅ Super Admin (gestión completa)
- ✅ Admin (gestión completa)
- ✅ Editor (exportar lista)
- ❌ Moderador (solo lectura)

**Configuraciones:**
- ✅ Solo Super Admin
- ❌ Otros roles (sin acceso)

**Usuarios Admin:**
- ✅ Solo Super Admin
- ❌ Otros roles (sin acceso)

---

## Mejores Prácticas

### Seguridad

✅ **Contraseñas seguras**
- Mínimo 8 caracteres
- Combinar mayúsculas, minúsculas, números
- Cambiar periódicamente

✅ **Roles apropiados**
- Asignar el rol mínimo necesario
- No dar Super Admin a todos

✅ **Sesiones**
- Cerrar sesión al terminar
- No compartir credenciales

✅ **Backups**
- Exportar datos regularmente
- Guardar configuraciones importantes

### Gestión de productos

✅ **Imágenes de calidad**
- Resolución alta (min 800x800)
- Fondo blanco o transparente
- Múltiples ángulos

✅ **Descripciones completas**
- Beneficios claros
- Ingredientes detallados
- Modo de uso específico

✅ **Categorización correcta**
- Usar categorías consistentes
- Facilita búsqueda de clientes

✅ **Control de stock**
- Actualizar regularmente
- Alertas de stock bajo
- Reabastecer a tiempo

### Gestión de pedidos

✅ **Respuesta rápida**
- Procesar pedidos en < 24 horas
- Actualizar estados prontamente

✅ **Comunicación**
- Notificar cambios de estado
- Responder dudas de clientes

✅ **Empaquetado**
- Verificar productos antes de enviar
- Incluir nota de agradecimiento

### Atención al cliente

✅ **Responder reseñas**
- Agradecer feedback positivo
- Resolver problemas en negativas

✅ **Seguimiento post-venta**
- Confirmar recepción
- Solicitar feedback

---

## Atajos de Teclado

**Navegación:**
- `Ctrl/Cmd + K` → Búsqueda rápida (próximamente)
- `Ctrl/Cmd + B` → Toggle sidebar

**Formularios:**
- `Ctrl/Cmd + S` → Guardar
- `Esc` → Cerrar modal

---

## Soporte Técnico

### Contacto

**Email técnico:**
- soporte@stardust.com

**Documentación:**
- `/docs/MANUAL_TECNICO.md`

**Reportar bugs:**
- Incluir pasos para reproducir
- Screenshots si es posible
- Información del navegador

---

## Actualizaciones y Changelog

**Versión actual:** 1.0.0

**Próximas funcionalidades:**
- [ ] Responder reseñas desde admin
- [ ] Envío masivo de emails
- [ ] Reportes de ventas avanzados
- [ ] Integración con inventario
- [ ] Chat en vivo con clientes
- [ ] Sistema de cupones y descuentos

---

## Glosario

- **SKU**: Stock Keeping Unit (código único de producto)
- **Stock**: Inventario disponible
- **RLS**: Row Level Security (seguridad de base de datos)
- **SMTP**: Simple Mail Transfer Protocol (protocolo de email)
- **API**: Application Programming Interface
- **Dashboard**: Panel de control
- **CRUD**: Create, Read, Update, Delete

---

¡Gracias por usar el Backoffice de STARDUST! 

Para cualquier duda o sugerencia, contacta al equipo de soporte.

**¡Que tengas una excelente gestión!** ✨

---

**Versión:** 1.0.0  
**Última actualización:** Enero 2025  
**Equipo:** STARDUST Tech Team
