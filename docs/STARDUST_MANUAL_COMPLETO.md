# STARDUST - Manual Completo del Sistema

**Versión**: 1.0.0  
**Fecha**: Diciembre 2024  
**Plataforma**: Stardust E-commerce - Pursuit of Harmony

---

## Tabla de Contenidos

1. [Manual Técnico](#1-manual-técnico)
2. [Manual de Usuario - Cliente](#2-manual-de-usuario-cliente)
3. [Manual de Usuario - Administrador](#3-manual-de-usuario-administrador)
4. [Manual de Integración API Móvil](#4-manual-de-integración-api-móvil)
5. [Configuración de Stripe (Test/Producción)](#5-configuración-de-stripe-testproducción)
6. [Sistema de Impuestos](#6-sistema-de-impuestos)
7. [Sistema de Categorías](#7-sistema-de-categorías)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Manual Técnico

### 1.1 Arquitectura del Sistema

**STARDUST** es una plataforma de e-commerce desarrollada con tecnologías modernas:

#### Stack Tecnológico

- **Frontend**: Next.js 16 con App Router
- **UI**: React 19.2, TailwindCSS v4, shadcn/ui
- **Backend**: Next.js API Routes
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Pagos**: Stripe Checkout (Test y Producción)
- **Storage**: Vercel Blob
- **Deployment**: Vercel

#### Fuentes Personalizadas

- **Primaria**: Condor (Títulos y encabezados)
- **Secundaria**: Geist Sans (Texto body)
- **Monospace**: Geist Mono (Códigos)

### 1.2 Estructura del Proyecto

\`\`\`
stardust-online/
├── app/                          # Next.js App Router
│   ├── admin/                    # Panel administrativo
│   │   ├── banners/              # Gestión de banners
│   │   ├── categorias/           # Gestión de categorías
│   │   ├── clientes/             # Gestión de clientes
│   │   ├── configuracion/        # Configuración general
│   │   │   ├── email/            # Configuración de email
│   │   │   ├── faqs/             # Gestión de FAQs
│   │   │   ├── general/          # Configuración general
│   │   │   ├── pagos/            # Configuración de pagos (Stripe)
│   │   │   └── redes/            # Redes sociales
│   │   ├── impuestos/            # Gestión de impuestos
│   │   ├── newsletter/           # Gestión de newsletter
│   │   ├── pedidos/              # Gestión de pedidos
│   │   ├── productos/            # Gestión de productos
│   │   ├── resenas/              # Gestión de reseñas
│   │   └── usuarios-admin/       # Gestión de usuarios admin
│   ├── api/                      # API Routes
│   │   ├── admin/                # Endpoints admin
│   │   │   ├── categories/       # API categorías
│   │   │   ├── taxes/            # API impuestos
│   │   │   └── stripe-config/    # API configuración Stripe
│   │   ├── stripe/               # Stripe endpoints
│   │   │   ├── create-checkout-session/
│   │   │   └── webhook/          # Webhook de Stripe
│   │   ├── stock/                # Gestión de stock
│   │   └── products/             # API productos públicos
│   ├── auth/                     # Autenticación clientes
│   │   ├── login/                # Login clientes
│   │   ├── recuperar/            # Recuperar contraseña
│   │   └── actualizar-password/  # Actualizar contraseña
│   ├── blog/                     # Blog público
│   ├── checkout/                 # Proceso de compra
│   ├── confirmacion/             # Confirmación de pedido
│   ├── contacto/                 # Página de contacto
│   ├── cuenta/                   # Mi cuenta (cliente)
│   ├── productos/                # Catálogo de productos
│   └── page.tsx                  # Página de inicio
├── components/                   # Componentes React
│   ├── admin/                    # Componentes admin
│   ├── ui/                       # Componentes UI (shadcn)
│   ├── navbar.tsx                # Barra de navegación
│   ├── footer.tsx                # Footer
│   ├── product-card.tsx          # Tarjeta de producto
│   └── cart-drawer.tsx           # Panel del carrito
├── lib/                          # Utilidades y servicios
│   ├── cart-context.tsx          # Context del carrito
│   ├── database.ts               # Cliente de BD (client)
│   ├── database-server.ts        # Funciones de BD (server)
│   ├── stripe-dynamic.ts         # Cliente dinámico de Stripe
│   ├── stock-service.ts          # Servicio de stock
│   └── supabase/                 # Cliente Supabase
├── scripts/                      # Scripts SQL
│   ├── 001_*.sql                 # Migraciones de BD
│   └── ...
├── docs/                         # Documentación
└── public/                       # Assets estáticos
\`\`\`

### 1.3 Base de Datos (Supabase PostgreSQL)

#### Tablas Principales

##### products
\`\`\`sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(500),
  images TEXT[],
  category VARCHAR(100),
  stock INTEGER DEFAULT 0,
  category_id UUID REFERENCES categories(id),
  tax_id UUID REFERENCES taxes(id),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

##### categories
\`\`\`sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

##### taxes
\`\`\`sql
CREATE TABLE taxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  rate DECIMAL(5, 4) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

##### orders
\`\`\`sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(50) UNIQUE NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  customer_phone VARCHAR(50),
  shipping_address JSONB,
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  payment_method JSONB,
  payment_status VARCHAR(50) DEFAULT 'pending',
  order_status VARCHAR(50) DEFAULT 'pending',
  stripe_session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

##### stripe_config
\`\`\`sql
CREATE TABLE stripe_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  active_environment VARCHAR(20) NOT NULL DEFAULT 'test',
  test_publishable_key TEXT,
  test_secret_key TEXT,
  test_webhook_secret TEXT,
  production_publishable_key TEXT,
  production_secret_key TEXT,
  production_webhook_secret TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

##### customers
\`\`\`sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(50),
  auth_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

##### reviews
\`\`\`sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  comment TEXT,
  helpful_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

##### stock_reservations
\`\`\`sql
CREATE TABLE stock_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  session_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'reserved',
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

##### faqs
\`\`\`sql
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

##### newsletter_subscribers
\`\`\`sql
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### 1.4 Flujo de Compra Completo

#### 1.4.1 Navegación y Selección de Productos

\`\`\`mermaid
graph TD
    A[Cliente visita /productos] --> B[Filtrar por categoría/precio]
    B --> C[Ver detalles del producto]
    C --> D[Agregar al carrito]
    D --> E[Carrito actualizado]
    E --> F{¿Seguir comprando?}
    F -->|Sí| B
    F -->|No| G[Ir a Checkout]
\`\`\`

**Componentes Involucrados:**
- `app/productos/page.tsx`: Página del catálogo
- `components/products-client.tsx`: Cliente con filtros y ordenamiento
- `components/product-card.tsx`: Tarjeta de producto individual
- `components/product-filters.tsx`: Filtros de categorías y precio
- `lib/cart-context.tsx`: Context del carrito de compras

**APIs Utilizadas:**
- `GET /api/products`: Obtener todos los productos
- `GET /api/categories`: Obtener categorías disponibles
- `GET /api/products/[id]`: Obtener detalles de un producto

#### 1.4.2 Proceso de Checkout

\`\`\`mermaid
sequenceDiagram
    participant C as Cliente
    participant CH as Checkout Page
    participant API as API Server
    participant ST as Stock Service
    participant STR as Stripe
    participant DB as Database
    
    C->>CH: Ir a /checkout
    CH->>API: POST /api/stock/check
    API->>DB: Verificar stock disponible
    DB-->>API: Stock disponible
    API-->>CH: Stock confirmado
    
    CH->>API: POST /api/stock/reserve
    API->>ST: Reservar stock (15 min)
    ST->>DB: Crear reserva en stock_reservations
    DB-->>ST: Reserva creada
    ST-->>API: Stock reservado
    API-->>CH: Reserva confirmada
    
    C->>CH: Completar formulario
    C->>CH: Enviar pago
    CH->>API: POST /api/stripe/create-checkout-session
    API->>DB: Obtener config Stripe (test/prod)
    DB-->>API: Configuración Stripe
    API->>STR: Crear sesión de checkout
    STR-->>API: Session ID + URL
    API-->>CH: Redirigir a Stripe
    
    C->>STR: Completar pago en Stripe
    STR->>API: POST /api/stripe/webhook (checkout.session.completed)
    API->>ST: Completar reserva de stock
    ST->>DB: Actualizar stock_reservations status='completed'
    ST->>DB: Decrementar stock en products
    DB-->>ST: Stock actualizado
    API->>DB: Guardar orden en orders
    DB-->>API: Orden guardada
    API->>C: Enviar email de confirmación
    STR->>C: Redirigir a /confirmacion/[orderId]
\`\`\`

**Archivos Clave:**

1. **app/checkout/page.tsx**
   - Formulario de información del cliente
   - Formulario de dirección de envío
   - Cálculo de impuestos dinámico por producto
   - Reserva automática de stock
   - Integración con Stripe

2. **app/api/stripe/create-checkout-session/route.ts**
   - Crea sesión de Stripe Checkout
   - Usa configuración dinámica (test/producción)
   - Pasa metadata del pedido

3. **app/api/stripe/webhook/route.ts**
   - Recibe eventos de Stripe
   - Procesa `checkout.session.completed`
   - Completa reserva de stock
   - Guarda orden en base de datos
   - Envía email de confirmación

4. **lib/stripe-dynamic.ts**
   - Obtiene configuración de Stripe desde BD
   - Carga claves según ambiente activo (test/production)
   - Funciones helper para Stripe API

5. **lib/stock-service.ts**
   - `checkAvailability()`: Verifica disponibilidad
   - `reserve()`: Reserva stock temporalmente (15 min)
   - `complete()`: Confirma reserva y decrementa stock
   - `cancel()`: Libera reserva expirada o cancelada

#### 1.4.3 Confirmación y Post-Venta

**app/confirmacion/[orderId]/page.tsx**
- Muestra detalles completos del pedido
- Estado del pedido (Confirmado → Preparando → En camino)
- Información de envío
- Resumen de compra
- Opciones: Descargar factura, Ver mis pedidos, Seguir comprando

### 1.5 Sistema de Impuestos Dinámico

#### Flujo de Cálculo de Impuestos

\`\`\`javascript
// En checkout page
useEffect(() => {
  async function loadProductTaxes() {
    const taxes = {}
    
    for (const item of cart) {
      // 1. Obtener producto
      const response = await fetch(`/api/products/${item.id}`)
      const product = await response.json()
      
      // 2. Obtener impuesto asignado
      if (product.tax_id) {
        const taxResponse = await fetch(`/api/admin/taxes/${product.tax_id}`)
        const taxData = await taxResponse.json()
        taxes[item.id] = taxData.rate // Ej: 0.16 para IVA 16%
      } else {
        taxes[item.id] = 0.16 // IVA por defecto
      }
    }
    
    setProductTaxes(taxes)
  }
  
  loadProductTaxes()
}, [cart])

// Calcular impuesto total
const tax = cart.reduce((total, item) => {
  const taxRate = productTaxes[item.id] || 0.16
  return total + (item.price * item.quantity * taxRate)
}, 0)
\`\`\`

#### Gestión de Impuestos en Admin

**app/admin/impuestos/page.tsx**
- CRUD completo de impuestos
- Activar/desactivar impuestos
- Configurar nombre, descripción y tasa (rate)

**Ejemplo de Impuesto IVA 16%:**
\`\`\`json
{
  "name": "IVA",
  "description": "Impuesto al Valor Agregado 16%",
  "rate": 0.16,
  "is_active": true
}
\`\`\`

**Asignación a Productos:**
En `app/admin/productos/page.tsx` al crear/editar producto:
\`\`\`tsx
<Select value={tax_id} onChange={handleTaxChange}>
  <SelectTrigger>
    <SelectValue placeholder="Seleccionar impuesto" />
  </SelectTrigger>
  <SelectContent>
    {taxes.map(tax => (
      <SelectItem key={tax.id} value={tax.id}>
        {tax.name} - {(tax.rate * 100).toFixed(2)}%
      </SelectItem>
    ))}
  </SelectContent>
</Select>
\`\`\`

### 1.6 Configuración de Stripe (Test vs Producción)

#### Tabla: stripe_config

La tabla `stripe_config` almacena dos conjuntos de credenciales:

| Campo | Descripción |
|-------|-------------|
| `active_environment` | 'test' o 'production' |
| `test_publishable_key` | pk_test_... |
| `test_secret_key` | sk_test_... |
| `test_webhook_secret` | whsec_... (test) |
| `production_publishable_key` | pk_live_... |
| `production_secret_key` | sk_live_... |
| `production_webhook_secret` | whsec_... (live) |

#### Panel de Configuración Admin

**app/admin/configuracion/pagos/page.tsx**

\`\`\`tsx
// Toggle entre Test y Producción
<div className="flex items-center gap-4">
  <Label>Ambiente Activo:</Label>
  <Tabs value={config.active_environment}>
    <TabsList>
      <TabsTrigger value="test">🧪 Test</TabsTrigger>
      <TabsTrigger value="production">🚀 Producción</TabsTrigger>
    </TabsList>
  </Tabs>
</div>

// Claves Test
<Card>
  <CardHeader><CardTitle>Claves de Prueba (Test)</CardTitle></CardHeader>
  <CardContent>
    <Input 
      label="Publishable Key (Test)" 
      value={test_publishable_key}
      placeholder="pk_test_..." 
    />
    <Input 
      label="Secret Key (Test)" 
      value={test_secret_key}
      placeholder="sk_test_..."
      type="password" 
    />
    <Input 
      label="Webhook Secret (Test)" 
      value={test_webhook_secret}
      placeholder="whsec_..."
      type="password" 
    />
  </CardContent>
</Card>

// Claves Producción
<Card>
  <CardHeader><CardTitle>Claves de Producción (Live)</CardTitle></CardHeader>
  <CardContent>
    <Input 
      label="Publishable Key (Production)" 
      value={production_publishable_key}
      placeholder="pk_live_..." 
    />
    <Input 
      label="Secret Key (Production)" 
      value={production_secret_key}
      placeholder="sk_live_..."
      type="password" 
    />
    <Input 
      label="Webhook Secret (Production)" 
      value={production_webhook_secret}
      placeholder="whsec_..."
      type="password" 
    />
  </CardContent>
</Card>
\`\`\`

#### Cómo Funciona el Cliente Dinámico

**lib/stripe-dynamic.ts:**

\`\`\`typescript
export async function getStripeInstance(): Promise<Stripe> {
  const supabase = createClient()

  // 1. Obtener configuración de BD
  const { data: config } = await supabase
    .from("stripe_config")
    .select("active_environment, test_secret_key, production_secret_key")
    .single()

  if (!config) {
    throw new Error("No se encontró configuración de Stripe")
  }

  // 2. Seleccionar clave según ambiente activo
  const secretKey = 
    config.active_environment === "test" 
      ? config.test_secret_key 
      : config.production_secret_key

  if (!secretKey) {
    throw new Error(`No hay secret key para: ${config.active_environment}`)
  }

  // 3. Crear instancia de Stripe con la clave correcta
  return new Stripe(secretKey, {
    apiVersion: "2024-11-20.acacia",
    typescript: true,
  })
}
\`\`\`

**Uso en Frontend:**

\`\`\`typescript
// app/checkout/page.tsx
useEffect(() => {
  fetch("/api/stripe-config/public")
    .then(res => res.json())
    .then(data => {
      setStripeEnvironment(data.environment) // 'test' o 'production'
      stripePromise = loadStripe(data.publishableKey) // Clave correcta
    })
}, [])
\`\`\`

#### Indicador Visual en Checkout

\`\`\`tsx
{stripeEnvironment === 'test' && (
  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
    <p className="text-yellow-400 text-sm flex items-center gap-2">
      <AlertCircle className="h-4 w-4" />
      <span>
        Modo Demo: Puedes usar tarjetas de prueba. 
        <a 
          href="https://stripe.com/docs/testing" 
          target="_blank"
          className="underline ml-1"
        >
          Ver tarjetas de prueba
        </a>
      </span>
    </p>
  </div>
)}
\`\`\`

#### Tarjetas de Prueba (Test Mode)

| Tarjeta | Número | Resultado |
|---------|--------|-----------|
| Visa | 4242 4242 4242 4242 | Pago exitoso |
| Visa (declinada) | 4000 0000 0000 0002 | Pago rechazado |
| Mastercard | 5555 5555 5555 4444 | Pago exitoso |
| Amex | 3782 822463 10005 | Pago exitoso |
| 3D Secure | 4000 0027 6000 3184 | Requiere auth 3DS |

**Datos Adicionales (Cualquier valor funciona):**
- CVV: Cualquier 3 dígitos (ej: 123)
- Fecha: Cualquier fecha futura (ej: 12/25)
- ZIP: Cualquier código postal (ej: 12345)

### 1.7 Autenticación

#### Autenticación de Clientes

**Login:** `app/auth/login/page.tsx`
\`\`\`tsx
const handleLogin = async (email, password) => {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    toast({ title: "Error", description: error.message })
    return
  }
  
  router.push("/cuenta")
}
\`\`\`

**Registro:** Link desde login
\`\`\`tsx
const handleSignUp = async (email, password) => {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL 
        || window.location.origin
    },
  })
  
  if (error) {
    toast({ title: "Error", description: error.message })
    return
  }
  
  toast({ 
    title: "Registro exitoso", 
    description: "Revisa tu email para confirmar tu cuenta" 
  })
}
\`\`\`

**Recuperar Contraseña:** `app/auth/recuperar/page.tsx`
\`\`\`tsx
const handlePasswordReset = async (email) => {
  const supabase = createBrowserClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/actualizar-password`
  })
  
  if (error) {
    toast({ title: "Error", description: error.message })
    return
  }
  
  toast({ 
    title: "Email enviado", 
    description: "Revisa tu correo para restablecer tu contraseña" 
  })
}
\`\`\`

**Actualizar Contraseña:** `app/auth/actualizar-password/page.tsx`
\`\`\`tsx
const handleUpdatePassword = async (newPassword) => {
  const supabase = createBrowserClient()
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })
  
  if (error) {
    toast({ title: "Error", description: error.message })
    return
  }
  
  toast({ title: "Contraseña actualizada" })
  router.push("/auth/login")
}
\`\`\`

#### Protección de Rutas

**app/cuenta/page.tsx** (Mi Cuenta - Clientes)
\`\`\`tsx
'use client'

export default function CuentaPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    const supabase = createBrowserClient()
    
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/auth/login")
        return
      }
      setUser(data.user)
    })
  }, [])
  
  if (!user) return <LoadingSpinner />
  
  return <div>Contenido de Mi Cuenta...</div>
}
\`\`\`

#### Autenticación de Admin

**app/admin/login/page.tsx**
\`\`\`tsx
const handleAdminLogin = async (email, password) => {
  const response = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  
  const { success, user } = await response.json()
  
  if (!success) {
    toast({ title: "Error", description: "Credenciales inválidas" })
    return
  }
  
  if (user.role !== 'admin') {
    toast({ title: "Error", description: "No tienes permisos de admin" })
    return
  }
  
  router.push("/admin")
}
\`\`\`

**Middleware de Admin:**
\`\`\`tsx
// app/admin/layout.tsx
export default function AdminLayout({ children }) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createBrowserClient()
      const { data } = await supabase.auth.getUser()
      
      if (!data.user) {
        router.push("/admin/login")
        return
      }
      
      // Verificar role de admin en BD
      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", data.user.id)
        .single()
      
      if (!adminUser || adminUser.role !== 'admin') {
        router.push("/admin/login")
        return
      }
      
      setIsAuthorized(true)
    }
    
    checkAuth()
  }, [])
  
  if (!isAuthorized) return <LoadingSpinner />
  
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
\`\`\`

### 1.8 Variables de Entorno

**Archivo .env.local:**

\`\`\`bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000

# Database (Postgres from Supabase)
POSTGRES_URL=postgresql://...
POSTGRES_PRISMA_URL=postgresql://...
POSTGRES_URL_NON_POOLING=postgresql://...

# Stripe (Configuradas en Admin, no en .env)
# Las claves de Stripe se configuran desde el panel admin
# y se almacenan en la tabla stripe_config

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your-blob-token

# Site URLs
NEXT_PUBLIC_SITE_URL=https://stardustmex.com
NEXT_PUBLIC_URL=https://stardustmex.com

# Email
EMAIL_FROM=contacto@stardustmex.com
\`\`\`

**IMPORTANTE:** Las claves de Stripe (test y producción) NO se configuran en variables de entorno. Se configuran desde el panel de administración en `/admin/configuracion/pagos` y se guardan en la tabla `stripe_config` de la base de datos.

### 1.9 Deployment

#### Vercel Deployment

1. **Conectar Repositorio:**
   - Ir a Vercel Dashboard
   - New Project → Import Git Repository
   - Seleccionar `v0-stardust-harmony`

2. **Configurar Variables de Entorno:**
   - Copiar todas las variables de `.env.local`
   - Agregar en Vercel → Settings → Environment Variables

3. **Configurar Integración Supabase:**
   - Vercel → Integrations → Supabase
   - Conectar proyecto Supabase

4. **Configurar Integración Stripe:**
   - Vercel → Integrations → Stripe (opcional)
   - O configurar manualmente desde admin panel

5. **Deploy:**
   \`\`\`bash
   git push origin main
   \`\`\`
   Vercel desplegará automáticamente

6. **Verificar Deployment:**
   - Revisar logs en Vercel Dashboard
   - Probar sitio en producción
   - Verificar que las APIs funcionen

#### Post-Deployment

1. **Configurar Stripe Webhooks:**
   - Ir a Stripe Dashboard
   - Developers → Webhooks → Add endpoint
   - URL: `https://stardustmex.com/api/stripe/webhook`
   - Eventos a escuchar:
     - `checkout.session.completed`
     - `checkout.session.expired`
     - `payment_intent.payment_failed`
   - Copiar Webhook Secret y agregarlo en admin panel

2. **Configurar Dominio Personalizado:**
   - Vercel → Settings → Domains
   - Agregar `stardustmex.com`
   - Configurar DNS records:
     \`\`\`
     A record: @ → 76.76.21.21
     CNAME record: www → cname.vercel-dns.com
     \`\`\`

3. **Configurar SSL:**
   - Vercel configura SSL automáticamente
   - Verificar certificado SSL activo

4. **Primer Admin Setup:**
   - Ir a `/admin/setup`
   - Crear primer usuario admin
   - Configurar información del sitio
   - Configurar Stripe (test o producción)
   - Agregar productos iniciales

---

## 2. Manual de Usuario - Cliente

### 2.1 Registro e Inicio de Sesión

#### 2.1.1 Crear una Cuenta

1. Ir a `https://stardustmex.com`
2. Click en "Mi Cuenta" en la navegación superior
3. Si no tienes cuenta, serás redirigido a Login
4. Click en "¿No tienes cuenta? Regístrate"
5. Completar el formulario:
   - Email
   - Contraseña (mínimo 8 caracteres)
   - Confirmar contraseña
6. Click en "Registrarse"
7. Verificar tu email (revisa bandeja de entrada y spam)
8. Click en el link de confirmación del email
9. Inicia sesión con tus credenciales

#### 2.1.2 Iniciar Sesión

1. Ir a "Mi Cuenta"
2. Ingresar email y contraseña
3. Click en "Iniciar Sesión"

#### 2.1.3 Recuperar Contraseña

1. En la página de Login, click en "¿Olvidaste tu contraseña?"
2. Ingresar tu email registrado
3. Click en "Enviar enlace de recuperación"
4. Revisar tu email
5. Click en el enlace recibido
6. Ingresar nueva contraseña
7. Click en "Actualizar Contraseña"

### 2.2 Explorar Productos

#### 2.2.1 Catálogo de Productos

1. Click en "Productos" en la navegación
2. Ver todos los productos disponibles
3. Productos se muestran con:
   - Imagen
   - Nombre
   - Precio
   - Botón "Ver Más"
   - Botón "Agregar al Carrito"

#### 2.2.2 Filtrar Productos

**Por Categoría:**
1. Usar el dropdown "Categoría"
2. Seleccionar categoría deseada:
   - Relajación
   - Energía
   - Enfoque
   - Sueño
   - Etc.

**Por Precio:**
1. Usar el dropdown "Precio"
2. Seleccionar rango:
   - Todos
   - Menos de $500
   - $500 - $1000
   - $1000 - $2000
   - Más de $2000

**Ordenar:**
1. Usar el dropdown "Ordenar"
2. Seleccionar criterio:
   - Precio: Menor a Mayor
   - Precio: Mayor a Menor
   - Nombre: A-Z
   - Nombre: Z-A

#### 2.2.3 Ver Detalles de Producto

1. Click en "Ver Más" en cualquier producto
2. Ver información detallada:
   - Imágenes del producto
   - Descripción completa
   - Precio con impuesto incluido
   - Stock disponible
   - Reseñas de otros clientes
3. Seleccionar cantidad
4. Click en "Agregar al Carrito"

#### 2.2.4 Leer Reseñas

1. En la página de detalle del producto
2. Scroll hacia abajo a la sección "Reseñas"
3. Ver calificaciones y comentarios
4. Filtrar por calificación (1-5 estrellas)
5. Marcar reseñas útiles (👍)

### 2.3 Carrito de Compras

#### 2.3.1 Agregar Productos

1. Click en "Agregar al Carrito" desde:
   - Catálogo de productos
   - Página de detalle del producto
2. Ver confirmación en esquina superior derecha
3. Contador del carrito se actualiza

#### 2.3.2 Ver Carrito

1. Click en el icono del carrito (esquina superior derecha)
2. Se abre panel lateral con productos agregados
3. Ver por cada producto:
   - Imagen
   - Nombre
   - Precio unitario
   - Cantidad
   - Subtotal

#### 2.3.3 Modificar Carrito

**Cambiar Cantidad:**
1. Usar botones + / - junto a cada producto
2. El subtotal se actualiza automáticamente

**Eliminar Producto:**
1. Click en el icono de basura (🗑️)
2. Producto se elimina del carrito

**Vaciar Carrito:**
1. Click en "Vaciar Carrito"
2. Confirmar acción
3. Todos los productos se eliminan

#### 2.3.4 Ver Resumen

En el panel del carrito, ver:
- **Subtotal:** Suma de todos los productos
- **Número de Items:** Cantidad total de productos
- **Botón "Ir al Checkout":** Proceder a compra

### 2.4 Proceso de Compra (Checkout)

#### 2.4.1 Iniciar Checkout

1. Con productos en el carrito, click en "Ir al Checkout"
2. Serás redirigido a `/checkout`

#### 2.4.2 Información de Contacto

Completar Paso 1:
- Nombre
- Apellido
- Correo Electrónico
- Teléfono

#### 2.4.3 Información de Envío

Completar Paso 2:
- Dirección completa
- Ciudad
- Estado/Provincia
- Código Postal
- Notas de Entrega (opcional)

#### 2.4.4 Información de Pago

Completar Paso 3:
- Número de Tarjeta (16 dígitos)
- Fecha de Expiración (MM/YY)
- CVV (3-4 dígitos)

**Nota:** Si el sitio está en **Modo Demo (Test)**, verás un aviso amarillo indicando que puedes usar tarjetas de prueba:
- **Tarjeta de prueba:** 4242 4242 4242 4242
- **Fecha:** Cualquier fecha futura (ej: 12/25)
- **CVV:** Cualquier 3 dígitos (ej: 123)

#### 2.4.5 Revisar Resumen de Compra

Antes de finalizar, revisar:
- **Productos:** Lista de items con cantidades y precios
- **Subtotal:** Suma de productos
- **Envío:** Costo de envío (gratis si subtotal > $50)
- **Impuestos:** Impuesto calculado por producto según tasa asignada
- **Total:** Monto final a pagar

#### 2.4.6 Confirmar Pedido

1. Click en "Realizar Pedido"
2. Validación de formulario
3. Reserva automática de stock (15 minutos)
4. Redireccionamiento a Stripe Checkout
5. Completar pago en Stripe
6. Redireccionamiento a página de confirmación

### 2.5 Confirmación de Pedido

#### 2.5.1 Página de Confirmación

Después del pago exitoso, verás:
- ✅ Mensaje de "¡Pedido Confirmado!"
- Número de pedido (ej: ORD-ABC123)
- Estado del pedido (Confirmado → Preparando → En camino)
- Email de confirmación enviado

#### 2.5.2 Detalles del Pedido

**Detalles de Compra:**
- Lista de productos comprados
- Cantidades y precios
- Subtotal, envío, impuestos, total
- Método de pago (últimos 4 dígitos)

**Información de Envío:**
- Nombre del destinatario
- Dirección completa
- Teléfono de contacto
- Notas de entrega
- Tiempo estimado: 3-5 días hábiles

#### 2.5.3 Acciones Post-Compra

Opciones disponibles:
- **Descargar Factura:** PDF con detalles fiscales
- **Seguir Comprando:** Volver al catálogo
- **Ver Mis Pedidos:** Ir a Mi Cuenta

#### 2.5.4 Email de Confirmación

Recibirás un email con:
- Número de pedido
- Resumen de compra
- Información de envío
- Link para rastrear pedido
- Contacto de soporte

### 2.6 Mi Cuenta

#### 2.6.1 Acceder a Mi Cuenta

1. Click en "Mi Cuenta" en la navegación
2. Si no has iniciado sesión, serás redirigido a Login
3. Inicia sesión
4. Acceso a tu panel personal

#### 2.6.2 Información Personal

Ver y editar:
- Nombre completo
- Email
- Teléfono
- Dirección principal

#### 2.6.3 Mis Pedidos

**Ver Historial:**
1. Ir a sección "Mis Pedidos"
2. Ver lista de todos tus pedidos:
   - Número de pedido
   - Fecha
   - Total
   - Estado actual

**Ver Detalles de Pedido:**
1. Click en cualquier pedido
2. Ver información completa:
   - Productos comprados
   - Dirección de envío
   - Método de pago
   - Estado de envío

**Descargar Factura:**
1. En detalles del pedido
2. Click en "Descargar Factura"
3. Se descarga PDF

#### 2.6.4 Direcciones Guardadas

**Agregar Dirección:**
1. Ir a "Mis Direcciones"
2. Click en "Agregar Dirección"
3. Completar formulario
4. Marcar como predeterminada (opcional)
5. Guardar

**Editar Dirección:**
1. Click en dirección existente
2. Modificar campos
3. Guardar cambios

**Eliminar Dirección:**
1. Click en icono de basura
2. Confirmar eliminación

#### 2.6.5 Seguridad

**Cambiar Contraseña:**
1. Ir a "Seguridad"
2. Ingresar contraseña actual
3. Ingresar nueva contraseña
4. Confirmar nueva contraseña
5. Click en "Actualizar Contraseña"

**Cerrar Sesión:**
1. Click en "Cerrar Sesión"
2. Sesión terminada
3. Redirigido a página principal

### 2.7 Contacto y Soporte

#### 2.7.1 Página de Contacto

1. Ir a "Contacto" en la navegación
2. Ver información de contacto:
   - **Email:** contacto@stardustmex.com
   - **Teléfono:** +52 442-145-7866
   - **Dirección:** Querétaro, QRO, México

#### 2.7.2 Formulario de Contacto

1. Completar formulario:
   - Nombre
   - Email
   - Asunto
   - Mensaje
2. Click en "Enviar Mensaje"
3. Recibir confirmación
4. Respuesta en 24-48 horas

#### 2.7.3 Preguntas Frecuentes (FAQs)

1. En página de Contacto, scroll a sección "Preguntas Frecuentes"
2. Ver preguntas organizadas por categoría
3. Click en pregunta para ver respuesta
4. Si no encuentras respuesta, usar formulario de contacto

#### 2.7.4 Redes Sociales

Seguir STARDUST en:
- Instagram
- Facebook
- Twitter
- TikTok

Links en el footer de todas las páginas.

### 2.8 Newsletter

#### 2.8.1 Suscribirse

1. Scroll al footer de cualquier página
2. Buscar sección "Newsletter"
3. Ingresar tu email
4. Click en "Suscribirse"
5. Recibir confirmación

#### 2.8.2 Beneficios

Al suscribirte recibirás:
- Ofertas exclusivas
- Nuevos productos
- Tips de bienestar
- Descuentos especiales

#### 2.8.3 Desuscribirse

1. Abrir cualquier email del newsletter
2. Scroll al final
3. Click en "Desuscribirse"
4. Confirmar desuscripción

---

## 3. Manual de Usuario - Administrador

### 3.1 Acceso al Panel de Administración

#### 3.1.1 Login Admin

1. Ir a `https://stardustmex.com/admin/login`
2. Ingresar credenciales de administrador:
   - Email
   - Contraseña
3. Click en "Iniciar Sesión"
4. Acceso al Dashboard Admin

#### 3.1.2 Primer Setup

**Si es la primera vez:**
1. Ir a `/admin/setup`
2. Crear primer usuario administrador:
   - Nombre
   - Email
   - Contraseña
3. Click en "Crear Administrador"
4. Iniciar sesión con credenciales creadas

### 3.2 Dashboard Principal

#### 3.2.1 Vista General

Al ingresar, ver:
- **Estadísticas:**
  - Total de ventas del mes
  - Número de pedidos
  - Productos más vendidos
  - Nuevos clientes
- **Gráficas:**
  - Ventas por día/semana/mes
  - Productos más populares
  - Categorías más vendidas
- **Pedidos Recientes:**
  - Últimos 10 pedidos
  - Estados
  - Acciones rápidas

#### 3.2.2 Navegación

**Sidebar Izquierdo:**
- Dashboard
- Pedidos
- Productos
- Categorías
- Impuestos
- Clientes
- Reseñas
- Banners
- Newsletter
- Configuración
  - General
  - Email
  - Redes Sociales
  - FAQs
  - Pagos (Stripe)
- Usuarios Admin

### 3.3 Gestión de Productos

#### 3.3.1 Ver Productos

1. Click en "Productos" en sidebar
2. Ver tabla con todos los productos:
   - Imagen
   - Nombre
   - Precio
   - Categoría
   - Stock
   - Estado (Activo/Inactivo)
   - Acciones

#### 3.3.2 Crear Producto

1. Click en "Nuevo Producto"
2. Completar formulario:
   - **Información Básica:**
     - Nombre
     - Slug (se genera automáticamente)
     - Descripción corta
     - Descripción larga (para modal "Ver Más")
   - **Precio e Impuestos:**
     - Precio base
     - Impuesto (seleccionar de lista)
   - **Categorización:**
     - Categoría (seleccionar de lista)
   - **Inventario:**
     - Stock disponible
   - **Imágenes:**
     - Imagen principal (arrastra o selecciona)
     - Imágenes adicionales (opcional)
   - **Opciones:**
     - ☑️ Producto destacado
     - ☑️ Producto activo
3. Click en "Guardar Producto"
4. Producto creado exitosamente

#### 3.3.3 Editar Producto

1. En tabla de productos, click en icono de lápiz (✏️)
2. Modificar campos necesarios
3. Click en "Actualizar Producto"
4. Cambios guardados

#### 3.3.4 Eliminar Producto

1. En tabla de productos, click en icono de basura (🗑️)
2. Confirmar eliminación
3. Producto eliminado (soft delete)

#### 3.3.5 Gestión de Stock

**Actualizar Stock:**
1. En edición de producto
2. Modificar campo "Stock disponible"
3. Guardar cambios

**Ver Reservas:**
1. Ir a "Productos"
2. Ver columna "Stock"
3. Ver indicador de stock reservado (si aplica)

**Nota:** El stock se reserva automáticamente durante 15 minutos cuando un cliente inicia checkout. Si el pago no se completa, el stock se libera automáticamente.

### 3.4 Gestión de Categorías

#### 3.4.1 Ver Categorías

1. Click en "Categorías" en sidebar
2. Ver lista de categorías:
   - Nombre
   - Slug
   - Descripción
   - Orden de visualización
   - Estado
   - Número de productos
   - Acciones

#### 3.4.2 Crear Categoría

1. Click en "Nueva Categoría"
2. Completar formulario:
   - Nombre (ej: "Relajación")
   - Slug (se genera automáticamente: "relajacion")
   - Descripción
   - Imagen (opcional)
   - Orden de visualización (número)
   - ☑️ Categoría activa
3. Click en "Guardar Categoría"
4. Categoría creada

#### 3.4.3 Editar Categoría

1. Click en icono de lápiz (✏️)
2. Modificar campos
3. Click en "Actualizar Categoría"
4. Cambios guardados

#### 3.4.4 Eliminar Categoría

1. Click en icono de basura (🗑️)
2. Confirmar eliminación
3. **Nota:** No se puede eliminar una categoría con productos asignados. Primero reasignar o eliminar productos.

#### 3.4.5 Ordenar Categorías

1. Modificar campo "Orden de visualización"
2. Número menor = aparece primero en filtros
3. Ejemplo:
   - Orden 1: Relajación
   - Orden 2: Energía
   - Orden 3: Enfoque

### 3.5 Gestión de Impuestos

#### 3.5.1 Ver Impuestos

1. Click en "Impuestos" en sidebar
2. Ver tabla de impuestos:
   - Nombre
   - Descripción
   - Tasa (%)
   - Estado (Activo/Inactivo)
   - Productos asignados
   - Acciones

#### 3.5.2 Crear Impuesto

1. Click en "Nuevo Impuesto"
2. Completar formulario:
   - Nombre (ej: "IVA")
   - Descripción (ej: "Impuesto al Valor Agregado 16%")
   - Tasa (número decimal, ej: 0.16 para 16%)
   - ☑️ Impuesto activo
3. Click en "Guardar Impuesto"
4. Impuesto creado

**Ejemplo de Impuesto IVA 16%:**
\`\`\`
Nombre: IVA
Descripción: Impuesto al Valor Agregado 16%
Tasa: 0.16
Activo: ✓
\`\`\`

#### 3.5.3 Editar Impuesto

1. Click en icono de lápiz (✏️)
2. Modificar tasa o descripción
3. Click en "Actualizar Impuesto"
4. **Importante:** Los cambios afectan nuevos pedidos, no pedidos anteriores

#### 3.5.4 Desactivar Impuesto

1. Desmarcar "Impuesto activo"
2. Guardar
3. Impuesto ya no aparecerá en opciones al crear/editar productos

#### 3.5.5 Asignar Impuesto a Productos

1. Ir a "Productos"
2. Editar producto
3. En sección "Precio e Impuestos"
4. Seleccionar impuesto del dropdown
5. Guardar producto

**Flujo de Cálculo:**
\`\`\`
Precio base: $100
Impuesto IVA (16%): $16
Precio final: $116
\`\`\`

### 3.6 Gestión de Pedidos

#### 3.6.1 Ver Pedidos

1. Click en "Pedidos" en sidebar
2. Ver tabla de pedidos:
   - ID de Pedido
   - Cliente
   - Fecha
   - Total
   - Estado de Pago
   - Estado de Pedido
   - Acciones

#### 3.6.2 Filtrar Pedidos

**Por Estado de Pedido:**
- Todos
- Pendiente
- Confirmado
- Preparando
- Enviado
- Entregado
- Cancelado

**Por Estado de Pago:**
- Todos
- Pendiente
- Completado
- Fallido
- Reembolsado

**Por Fecha:**
- Hoy
- Esta semana
- Este mes
- Rango personalizado

#### 3.6.3 Ver Detalles de Pedido

1. Click en pedido
2. Ver información completa:
   - **Información del Cliente:**
     - Nombre
     - Email
     - Teléfono
   - **Productos:**
     - Lista de items
     - Cantidades
     - Precios
   - **Dirección de Envío:**
     - Dirección completa
     - Notas de entrega
   - **Resumen Financiero:**
     - Subtotal
     - Envío
     - Impuestos
     - Total
   - **Pago:**
     - Método (Stripe)
     - Últimos 4 dígitos
     - Session ID de Stripe
     - Estado del pago

#### 3.6.4 Actualizar Estado de Pedido

1. En detalles del pedido
2. Seleccionar nuevo estado:
   - Pendiente
   - Confirmado
   - Preparando
   - Enviado
   - Entregado
   - Cancelado
3. Click en "Actualizar Estado"
4. Cliente recibe notificación automática por email

#### 3.6.5 Gestión de Envíos

**Marcar como Enviado:**
1. Cambiar estado a "Enviado"
2. (Opcional) Agregar número de rastreo
3. Guardar
4. Cliente recibe email con info de rastreo

**Marcar como Entregado:**
1. Cambiar estado a "Entregado"
2. Guardar
3. Cliente recibe confirmación de entrega

#### 3.6.6 Cancelar Pedido

1. Click en "Cancelar Pedido"
2. Ingresar motivo de cancelación
3. Confirmar
4. **Acciones automáticas:**
   - Stock se devuelve a inventario
   - Estado de pago cambia a "Reembolsado"
   - Cliente recibe email de notificación

#### 3.6.7 Reembolsos

**Proceso de Reembolso:**
1. Ir a detalles del pedido
2. Click en "Procesar Reembolso"
3. Seleccionar monto:
   - Reembolso total
   - Reembolso parcial (especificar monto)
4. Ingresar motivo
5. Confirmar
6. **Nota:** El reembolso se procesa en Stripe automáticamente
7. Cliente recibe email de confirmación
8. Dinero regresa a tarjeta en 5-10 días hábiles

### 3.7 Gestión de Clientes

#### 3.7.1 Ver Clientes

1. Click en "Clientes" en sidebar
2. Ver lista de clientes:
   - Nombre
   - Email
   - Teléfono
   - Fecha de registro
   - Total de pedidos
   - Total gastado
   - Estado (Activo/Inactivo)
   - Acciones

#### 3.7.2 Ver Perfil de Cliente

1. Click en cliente
2. Ver información completa:
   - **Datos Personales:**
     - Nombre completo
     - Email
     - Teléfono
   - **Historial de Pedidos:**
     - Lista de pedidos realizados
     - Total gastado
   - **Direcciones Guardadas:**
     - Lista de direcciones
   - **Reseñas:**
     - Productos reseñados
     - Calificaciones dadas

#### 3.7.3 Editar Cliente

1. En perfil de cliente, click en "Editar"
2. Modificar:
   - Nombre
   - Teléfono
   - Estado (Activo/Inactivo)
3. **Nota:** No se puede modificar el email (es único)
4. Guardar cambios

#### 3.7.4 Desactivar Cliente

1. En edición de cliente
2. Cambiar estado a "Inactivo"
3. Guardar
4. **Efecto:** Cliente no puede iniciar sesión
5. **Uso:** Para clientes problemáticos o cuentas sospechosas

#### 3.7.5 Eliminar Cliente

1. Click en icono de basura (🗑️)
2. Confirmar eliminación
3. **Advertencia:** 
   - Se elimina la cuenta permanentemente
   - No se eliminan los pedidos históricos
   - Acción irreversible

### 3.8 Gestión de Reseñas

#### 3.8.1 Ver Reseñas

1. Click en "Reseñas" en sidebar
2. Ver lista de reseñas:
   - Producto
   - Cliente
   - Calificación (1-5 estrellas)
   - Título
   - Comentario
   - Fecha
   - Estado (Aprobada/Pendiente)
   - Acciones

#### 3.8.2 Moderar Reseñas

**Aprobar Reseña:**
1. Seleccionar reseña pendiente
2. Click en "Aprobar"
3. Reseña se muestra en página de producto

**Rechazar Reseña:**
1. Seleccionar reseña
2. Click en "Rechazar"
3. Reseña no se muestra públicamente
4. (Opcional) Enviar motivo al cliente

#### 3.8.3 Responder Reseñas

1. En detalles de reseña
2. Click en "Responder"
3. Escribir respuesta como representante de STARDUST
4. Click en "Publicar Respuesta"
5. Respuesta aparece debajo de la reseña

#### 3.8.4 Eliminar Reseñas

1. Click en icono de basura (🗑️)
2. Confirmar eliminación
3. **Uso:** Para reseñas inapropiadas o spam

#### 3.8.5 Reportes de Reseñas

**Ver Estadísticas:**
- Calificación promedio por producto
- Número total de reseñas
- Distribución de calificaciones (1-5 estrellas)
- Productos mejor/peor calificados

### 3.9 Gestión de Banners

#### 3.9.1 Ver Banners

1. Click en "Banners" en sidebar
2. Ver lista de banners:
   - Imagen de preview
   - Título
   - Ubicación (Home, Productos, etc.)
   - Orden
   - Estado (Activo/Inactivo)
   - Acciones

#### 3.9.2 Crear Banner

1. Click en "Nuevo Banner"
2. Completar formulario:
   - Título
   - Descripción/CTA (Call to Action)
   - Imagen (1920x600px recomendado)
   - Link (URL de destino)
   - Ubicación:
     - Home Hero
     - Home Secondary
     - Productos Top
     - Categoría específica
   - Orden de visualización
   - ☑️ Banner activo
3. Click en "Guardar Banner"
4. Banner se muestra en ubicación seleccionada

#### 3.9.3 Editar Banner

1. Click en icono de lápiz (✏️)
2. Modificar campos
3. Cambiar imagen (opcional)
4. Guardar cambios

#### 3.9.4 Eliminar Banner

1. Click en icono de basura (🗑️)
2. Confirmar eliminación
3. Banner eliminado

#### 3.9.5 Ordenar Banners

1. Si hay múltiples banners en misma ubicación
2. Modificar campo "Orden"
3. Menor número = aparece primero
4. Guardar

### 3.10 Newsletter

#### 3.10.1 Ver Suscriptores

1. Click en "Newsletter" en sidebar
2. Ver lista de suscriptores:
   - Email
   - Fecha de suscripción
   - Estado (Activo/Inactivo)
   - Acciones

#### 3.10.2 Exportar Suscriptores

1. Click en "Exportar"
2. Seleccionar formato:
   - CSV
   - Excel
3. Descargar archivo
4. **Uso:** Para integrar con plataformas de email marketing (Mailchimp, SendGrid, etc.)

#### 3.10.3 Eliminar Suscriptor

1. Click en icono de basura (🗑️)
2. Confirmar eliminación
3. Suscriptor eliminado de lista

#### 3.10.4 Enviar Campaña (Futuro)

**Nota:** Actualmente no hay sistema de envío integrado. Se recomienda exportar lista e importar en plataforma externa.

### 3.11 Configuración del Sistema

#### 3.11.1 Configuración General

**Ruta:** `Configuración → General`

**Información del Sitio:**
- Nombre del sitio: STARDUST
- Dominio: stardustmex.com
- Descripción (para SEO)
- Logo del sitio
- Favicon

**Información de Contacto:**
- Email: contacto@stardustmex.com
- Teléfono: +52 442-145-7866
- Dirección: Querétaro, QRO, México

**Configuración de Envíos:**
- Costo de envío estándar: $9.99
- Envío gratis en compras mayores a: $50
- Tiempo estimado de entrega: 3-5 días hábiles

#### 3.11.2 Configuración de Email

**Ruta:** `Configuración → Email`

**SMTP (Para emails transaccionales):**
- Host SMTP
- Puerto
- Usuario
- Contraseña
- Email remitente: contacto@stardustmex.com
- Nombre remitente: STARDUST

**Plantillas de Email:**
- Confirmación de pedido
- Pedido enviado
- Pedido entregado
- Recuperación de contraseña
- Bienvenida

**Nota:** Los emails se envían automáticamente cuando:
- Cliente completa una compra
- Pedido cambia de estado
- Cliente solicita recuperación de contraseña
- Cliente se registra

#### 3.11.3 Configuración de Redes Sociales

**Ruta:** `Configuración → Redes Sociales`

**Agregar Enlaces:**
- Instagram: URL del perfil
- Facebook: URL de la página
- Twitter: URL del perfil
- TikTok: URL del perfil
- YouTube: URL del canal (opcional)

**Uso:** Los enlaces aparecen en el footer del sitio.

#### 3.11.4 Gestión de FAQs

**Ruta:** `Configuración → FAQs`

**Ver FAQs:**
1. Lista de preguntas frecuentes
2. Organizadas por categoría
3. Orden de visualización
4. Estado (Activo/Inactivo)

**Crear FAQ:**
1. Click en "Nueva Pregunta"
2. Completar:
   - Pregunta
   - Respuesta (soporte para Markdown)
   - Categoría (Pedidos, Envíos, Pagos, Productos, General)
   - Orden
   - ☑️ Activa
3. Guardar
4. FAQ aparece en página de Contacto

**Editar FAQ:**
1. Click en pregunta
2. Modificar
3. Guardar cambios

**Eliminar FAQ:**
1. Click en icono de basura (🗑️)
2. Confirmar

#### 3.11.5 Configuración de Pagos (Stripe)

**Ruta:** `Configuración → Pagos`

**IMPORTANTE:** Esta es la sección más crítica para el funcionamiento del sistema de pagos.

##### Ambiente Activo

**Toggle de Ambiente:**
- 🧪 **Test (Demo):** Para pruebas, no cobra dinero real
- 🚀 **Producción (Live):** Para ventas reales, cobra dinero real

**Cambiar Ambiente:**
1. Click en el toggle Test/Producción
2. Confirmar cambio
3. Sistema cambia automáticamente las claves usadas

##### Configuración de Claves Test (Demo)

**¿Qué son las claves Test?**
- Permiten probar el sistema sin cobrar dinero real
- Los pagos no se procesan realmente
- Se usan tarjetas de prueba

**Obtener Claves Test:**
1. Ir a [Stripe Dashboard](https://dashboard.stripe.com)
2. Activar "Modo de prueba" (toggle en esquina superior derecha)
3. Ir a Developers → API keys
4. Copiar:
   - **Publishable key** (comienza con `pk_test_...`)
   - **Secret key** (comienza con `sk_test_...`)

**Configurar Webhook Test:**
1. En Stripe Dashboard (modo test)
2. Ir a Developers → Webhooks
3. Click en "Add endpoint"
4. URL: `https://stardustmex.com/api/stripe/webhook`
5. Seleccionar eventos:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`
6. Click en "Add endpoint"
7. Copiar **Webhook signing secret** (comienza con `whsec_...`)

**Ingresar Claves Test en Admin:**
1. En panel de Configuración de Pagos
2. Sección "Claves de Prueba (Test)"
3. Pegar:
   - Publishable Key (Test)
   - Secret Key (Test)
   - Webhook Secret (Test)
4. Click en "Guardar Configuración"

**Probar Modo Test:**
1. Activar ambiente "Test"
2. Ir al sitio público
3. Agregar producto al carrito
4. Proceder a checkout
5. Ver aviso amarillo: "Modo Demo activo"
6. Usar tarjeta de prueba: **4242 4242 4242 4242**
7. Fecha: Cualquier futura (ej: 12/25)
8. CVV: 123
9. Completar pago
10. Verificar que el pedido se crea correctamente

##### Configuración de Claves Producción (Live)

**¿Qué son las claves de Producción?**
- Permiten procesar pagos reales
- Los clientes son cobrados realmente
- Se requiere cuenta Stripe verificada

**Requisitos Previos:**
1. Cuenta Stripe completamente verificada
2. Información bancaria agregada (para recibir pagos)
3. Documentos de identidad aprobados

**Obtener Claves de Producción:**
1. Ir a [Stripe Dashboard](https://dashboard.stripe.com)
2. **DESACTIVAR** "Modo de prueba" (toggle en esquina superior derecha)
3. Ir a Developers → API keys
4. Copiar:
   - **Publishable key** (comienza con `pk_live_...`)
   - **Secret key** (comienza con `sk_live_...`)

**Configurar Webhook Producción:**
1. En Stripe Dashboard (modo producción)
2. Ir a Developers → Webhooks
3. Click en "Add endpoint"
4. URL: `https://stardustmex.com/api/stripe/webhook`
5. Seleccionar eventos:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`
6. Click en "Add endpoint"
7. Copiar **Webhook signing secret** (comienza con `whsec_...`)

**Ingresar Claves de Producción en Admin:**
1. En panel de Configuración de Pagos
2. Sección "Claves de Producción (Live)"
3. Pegar:
   - Publishable Key (Production)
   - Secret Key (Production)
   - Webhook Secret (Production)
4. Click en "Guardar Configuración"

**Activar Modo Producción:**
1. **VERIFICAR** que todas las claves de producción estén correctas
2. **ADVERTENCIA:** Los pagos serán reales
3. Cambiar toggle a "Producción"
4. Confirmar cambio
5. Sistema ahora procesa pagos reales

**Probar Modo Producción:**
1. Activar ambiente "Producción"
2. Ir al sitio público
3. Agregar producto al carrito
4. Proceder a checkout
5. **NO** verás aviso de "Modo Demo"
6. Usar tarjeta real
7. El pago se procesará realmente
8. Cliente será cobrado
9. Dinero llegará a tu cuenta Stripe

##### Indicadores Visuales

**En el Checkout (Cliente):**
- **Modo Test:** Aviso amarillo "Modo Demo activo - Puedes usar tarjetas de prueba"
- **Modo Producción:** Sin aviso, checkout normal

**En el Admin:**
- **Modo Test:** Badge verde "🧪 Test"
- **Modo Producción:** Badge rojo "🚀 Producción"

##### Seguridad

**Buenas Prácticas:**
1. **Nunca** compartir las Secret Keys
2. **Siempre** usar HTTPS (Vercel lo hace automáticamente)
3. Verificar webhook signature (el sistema lo hace automáticamente)
4. Rotar las API keys periódicamente (cada 6 meses)
5. Monitorear transacciones en Stripe Dashboard

**Si las Claves se Comprometen:**
1. Ir a Stripe Dashboard
2. Developers → API keys
3. Click en "Roll key" (generar nueva)
4. Actualizar en admin de STARDUST inmediatamente
5. La clave anterior se invalida automáticamente

##### Troubleshooting Stripe

**Error: "No se encontró configuración de Stripe"**
- Solución: Configurar claves en `/admin/configuracion/pagos`

**Error: "No hay secret key configurada"**
- Solución: Verificar que las claves del ambiente activo estén ingresadas

**Error: "Webhook signature verification failed"**
- Solución: Verificar que el webhook secret sea correcto
- Asegurarse de usar el secreto del ambiente correcto (test o producción)

**Pagos no se completan:**
1. Verificar logs en Stripe Dashboard
2. Verificar que el webhook esté activo
3. Verificar que la URL del webhook sea correcta
4. Verificar que los eventos estén seleccionados

**Pedidos no se guardan después del pago:**
1. Verificar webhook en Stripe Dashboard
2. Ver logs de Vercel para errores
3. Verificar que la base de datos esté accesible

### 3.12 Gestión de Usuarios Admin

#### 3.12.1 Ver Usuarios Admin

1. Click en "Usuarios Admin" en sidebar
2. Ver lista de administradores:
   - Nombre
   - Email
   - Rol (Admin, Super Admin)
   - Fecha de creación
   - Último acceso
   - Estado (Activo/Inactivo)
   - Acciones

#### 3.12.2 Crear Nuevo Admin

1. Click en "Nuevo Administrador"
2. Completar formulario:
   - Nombre completo
   - Email
   - Contraseña temporal
   - Rol:
     - **Admin:** Acceso completo excepto gestión de usuarios admin
     - **Super Admin:** Acceso completo incluyendo gestión de usuarios
3. Click en "Crear Administrador"
4. Nuevo admin recibe email con credenciales

#### 3.12.3 Editar Admin

1. Click en icono de lápiz (✏️)
2. Modificar:
   - Nombre
   - Rol
   - Estado
3. **Nota:** No se puede modificar email
4. Guardar cambios

#### 3.12.4 Desactivar Admin

1. En edición de admin
2. Cambiar estado a "Inactivo"
3. Guardar
4. **Efecto:** Admin no puede iniciar sesión
5. **Uso:** Para suspender temporalmente acceso

#### 3.12.5 Eliminar Admin

1. Click en icono de basura (🗑️)
2. Confirmar eliminación
3. **Advertencia:** Acción irreversible
4. **Nota:** No se puede eliminar a sí mismo

#### 3.12.6 Cambiar Contraseña (Propio)

1. Click en tu avatar (esquina superior derecha)
2. Click en "Mi Perfil"
3. Sección "Seguridad"
4. Ingresar contraseña actual
5. Ingresar nueva contraseña
6. Confirmar nueva contraseña
7. Click en "Actualizar Contraseña"

#### 3.12.7 Restablecer Contraseña (Otro Admin)

1. En lista de usuarios admin
2. Click en "Restablecer Contraseña"
3. Admin recibe email con link para crear nueva contraseña

### 3.13 Reportes y Analíticas

#### 3.13.1 Dashboard de Métricas

**Métricas en Tiempo Real:**
- Ventas del día
- Pedidos del día
- Nuevos clientes del día
- Productos más vendidos hoy

**Métricas del Mes:**
- Ingresos totales
- Número de transacciones
- Ticket promedio
- Tasa de conversión

**Gráficas:**
- Ventas por día (últimos 30 días)
- Ventas por producto
- Ventas por categoría
- Nuevos clientes por día

#### 3.13.2 Reporte de Ventas

**Generar Reporte:**
1. Ir a "Reportes" → "Ventas"
2. Seleccionar periodo:
   - Hoy
   - Esta semana
   - Este mes
   - Mes pasado
   - Rango personalizado
3. Seleccionar métricas:
   - Ventas por producto
   - Ventas por categoría
   - Ventas por día
   - Top 10 productos
4. Click en "Generar Reporte"
5. Ver reporte en pantalla
6. Exportar:
   - PDF
   - Excel
   - CSV

#### 3.13.3 Reporte de Inventario

**Ver Stock Actual:**
1. Ir a "Reportes" → "Inventario"
2. Ver:
   - Productos con stock bajo (< 10 unidades)
   - Productos agotados
   - Productos más vendidos
   - Productos sin ventas (últimos 30 días)
3. Acciones rápidas:
   - Actualizar stock
   - Crear orden de compra (futuro)

#### 3.13.4 Reporte de Clientes

**Métricas de Clientes:**
- Total de clientes registrados
- Nuevos clientes (mes actual)
- Clientes activos (con pedidos recientes)
- Clientes inactivos (sin pedidos en 6 meses)
- Top 10 clientes (por valor total de compras)

**Segmentación:**
- Por total gastado
- Por frecuencia de compra
- Por última compra

---

## 4. Manual de Integración API Móvil

### 4.1 Introducción

La API móvil de STARDUST proporciona endpoints RESTful para integrar aplicaciones móviles (iOS, Android, Flutter, React Native) con el sistema de e-commerce.

**Base URL:** `https://stardustmex.com/api/mobile/v1`

**Formato:** JSON

**Autenticación:** JWT (JSON Web Tokens) via Supabase Auth

### 4.2 Autenticación

#### 4.2.1 Registro de Usuario

\`\`\`http
POST /api/mobile/v1/auth/register
Content-Type: application/json

{
  "email": "cliente@ejemplo.com",
  "password": "MiContraseña123!",
  "first_name": "Juan",
  "last_name": "Pérez",
  "phone": "+52 442-145-7866"
}
\`\`\`

**Respuesta Exitosa:**
\`\`\`json
{
  "success": true,
  "message": "Usuario creado exitosamente. Verifica tu email.",
  "user": {
    "id": "uuid-del-usuario",
    "email": "cliente@ejemplo.com",
    "created_at": "2024-12-01T10:30:00Z"
  }
}
\`\`\`

**Errores:**
\`\`\`json
{
  "success": false,
  "error": "Email ya está registrado"
}
\`\`\`

#### 4.2.2 Login

\`\`\`http
POST /api/mobile/v1/auth/login
Content-Type: application/json

{
  "email": "cliente@ejemplo.com",
  "password": "MiContraseña123!"
}
\`\`\`

**Respuesta Exitosa:**
\`\`\`json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "user": {
    "id": "uuid-del-usuario",
    "email": "cliente@ejemplo.com",
    "first_name": "Juan",
    "last_name": "Pérez"
  }
}
\`\`\`

**Uso del Token:**
\`\`\`http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

#### 4.2.3 Logout

\`\`\`http
POST /api/mobile/v1/auth/logout
Authorization: Bearer {access_token}
\`\`\`

**Respuesta:**
\`\`\`json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
\`\`\`

#### 4.2.4 Refresh Token

\`\`\`http
POST /api/mobile/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

**Respuesta:**
\`\`\`json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
\`\`\`

### 4.3 Productos

#### 4.3.1 Listar Productos

\`\`\`http
GET /api/mobile/v1/products?category=relajacion&limit=20&offset=0
\`\`\`

**Parámetros de Query:**
- `category` (opcional): Filtrar por slug de categoría
- `search` (opcional): Buscar por nombre o descripción
- `min_price` (opcional): Precio mínimo
- `max_price` (opcional): Precio máximo
- `limit` (opcional): Número de resultados (default: 20, max: 100)
- `offset` (opcional): Paginación (default: 0)
- `sort` (opcional): `price_asc`, `price_desc`, `name_asc`, `name_desc`, `newest`

**Respuesta:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "uuid-producto-1",
      "name": "Calm Core",
      "slug": "calm-core",
      "description": "Equilibrio emocional y reducción del estrés",
      "price": 899.00,
      "image": "https://stardustmex.com/images/calm-core.jpg",
      "category": {
        "id": "uuid-categoria",
        "name": "Relajación",
        "slug": "relajacion"
      },
      "stock": 50,
      "is_featured": true,
      "rating": 4.8,
      "reviews_count": 127
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 20,
    "offset": 0,
    "has_more": true
  }
}
\`\`\`

#### 4.3.2 Detalle de Producto

\`\`\`http
GET /api/mobile/v1/products/{product_id}
\`\`\`

**Respuesta:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "uuid-producto-1",
    "name": "Calm Core",
    "slug": "calm-core",
    "description": "Equilibrio emocional y reducción del estrés",
    "long_description": "Descripción detallada del producto...",
    "price": 899.00,
    "image": "https://stardustmex.com/images/calm-core.jpg",
    "images": [
      "https://stardustmex.com/images/calm-core-1.jpg",
      "https://stardustmex.com/images/calm-core-2.jpg"
    ],
    "category": {
      "id": "uuid-categoria",
      "name": "Relajación",
      "slug": "relajacion"
    },
    "tax": {
      "id": "uuid-impuesto",
      "name": "IVA",
      "rate": 0.16
    },
    "stock": 50,
    "is_featured": true,
    "rating": 4.8,
    "reviews_count": 127,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-12-01T15:30:00Z"
  }
}
\`\`\`

#### 4.3.3 Productos Destacados

\`\`\`http
GET /api/mobile/v1/products/featured?limit=10
\`\`\`

**Respuesta:** Igual a listar productos, pero solo productos destacados.

### 4.4 Categorías

#### 4.4.1 Listar Categorías

\`\`\`http
GET /api/mobile/v1/categories
\`\`\`

**Respuesta:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "uuid-categoria-1",
      "name": "Relajación",
      "slug": "relajacion",
      "description": "Productos para relajación y manejo del estrés",
      "image": "https://stardustmex.com/images/cat-relajacion.jpg",
      "products_count": 15
    },
    {
      "id": "uuid-categoria-2",
      "name": "Energía",
      "slug": "energia",
      "description": "Productos para aumentar energía y vitalidad",
      "image": "https://stardustmex.com/images/cat-energia.jpg",
      "products_count": 12
    }
  ]
}
\`\`\`

### 4.5 Carrito

**Nota:** El carrito se gestiona localmente en la app móvil. No hay endpoints de carrito en la API.

### 4.6 Checkout y Pedidos

#### 4.6.1 Crear Pedido

\`\`\`http
POST /api/mobile/v1/orders
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "items": [
    {
      "product_id": "uuid-producto-1",
      "quantity": 2
    },
    {
      "product_id": "uuid-producto-2",
      "quantity": 1
    }
  ],
  "shipping_address": {
    "first_name": "Juan",
    "last_name": "Pérez",
    "address": "Calle Principal 123",
    "city": "Querétaro",
    "state": "QRO",
    "zip": "76000",
    "phone": "+52 442-145-7866"
  },
  "payment_method": "stripe",
  "notes": "Dejar en recepción"
}
\`\`\`

**Respuesta:**
\`\`\`json
{
  "success": true,
  "order": {
    "id": "uuid-pedido",
    "order_id": "ORD-ABC123",
    "status": "pending_payment",
    "total": 1898.00,
    "payment_url": "https://checkout.stripe.com/pay/cs_test_...",
    "created_at": "2024-12-01T16:00:00Z"
  }
}
\`\`\`

**Flujo:**
1. App envía pedido
2. API reserva stock
3. API crea sesión de Stripe
4. API retorna `payment_url`
5. App abre `payment_url` en WebView o navegador
6. Cliente completa pago en Stripe
7. Stripe webhook notifica a API
8. API completa pedido y actualiza stock
9. Cliente es redirigido a la app con deep link

#### 4.6.2 Listar Pedidos

\`\`\`http
GET /api/mobile/v1/orders?status=all&limit=20&offset=0
Authorization: Bearer {access_token}
\`\`\`

**Parámetros:**
- `status` (opcional): `all`, `pending`, `completed`, `cancelled`
- `limit` (opcional): Número de resultados (default: 20)
- `offset` (opcional): Paginación (default: 0)

**Respuesta:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "uuid-pedido-1",
      "order_id": "ORD-ABC123",
      "order_date": "2024-12-01T16:00:00Z",
      "status": "completed",
      "payment_status": "paid",
      "total": 1898.00,
      "items_count": 3,
      "shipping_address": {
        "address": "Calle Principal 123",
        "city": "Querétaro",
        "state": "QRO",
        "zip": "76000"
      }
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 20,
    "offset": 0,
    "has_more": false
  }
}
\`\`\`

#### 4.6.3 Detalle de Pedido

\`\`\`http
GET /api/mobile/v1/orders/{order_id}
Authorization: Bearer {access_token}
\`\`\`

**Respuesta:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "uuid-pedido-1",
    "order_id": "ORD-ABC123",
    "order_date": "2024-12-01T16:00:00Z",
    "status": "shipped",
    "payment_status": "paid",
    "items": [
      {
        "product_id": "uuid-producto-1",
        "name": "Calm Core",
        "image": "https://stardustmex.com/images/calm-core.jpg",
        "quantity": 2,
        "price": 899.00,
        "subtotal": 1798.00
      }
    ],
    "subtotal": 1798.00,
    "shipping": 0.00,
    "tax": 287.68,
    "total": 2085.68,
    "shipping_address": {
      "first_name": "Juan",
      "last_name": "Pérez",
      "address": "Calle Principal 123",
      "city": "Querétaro",
      "state": "QRO",
      "zip": "76000",
      "phone": "+52 442-145-7866"
    },
    "tracking_number": "1Z999AA10123456784",
    "tracking_url": "https://www.ups.com/track?tracknum=1Z999AA10123456784",
    "estimated_delivery": "2024-12-05T00:00:00Z"
  }
}
\`\`\`

### 4.7 Perfil de Usuario

#### 4.7.1 Obtener Perfil

\`\`\`http
GET /api/mobile/v1/profile
Authorization: Bearer {access_token}
\`\`\`

**Respuesta:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "uuid-usuario",
    "email": "cliente@ejemplo.com",
    "first_name": "Juan",
    "last_name": "Pérez",
    "phone": "+52 442-145-7866",
    "created_at": "2024-01-15T10:00:00Z",
    "orders_count": 15,
    "total_spent": 15000.00
  }
}
\`\`\`

#### 4.7.2 Actualizar Perfil

\`\`\`http
PUT /api/mobile/v1/profile
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "first_name": "Juan Carlos",
  "last_name": "Pérez García",
  "phone": "+52 442-145-9999"
}
\`\`\`

**Respuesta:**
\`\`\`json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": {
    "id": "uuid-usuario",
    "email": "cliente@ejemplo.com",
    "first_name": "Juan Carlos",
    "last_name": "Pérez García",
    "phone": "+52 442-145-9999"
  }
}
\`\`\`

### 4.8 Direcciones

#### 4.8.1 Listar Direcciones

\`\`\`http
GET /api/mobile/v1/addresses
Authorization: Bearer {access_token}
\`\`\`

**Respuesta:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "uuid-direccion-1",
      "first_name": "Juan",
      "last_name": "Pérez",
      "address": "Calle Principal 123",
      "city": "Querétaro",
      "state": "QRO",
      "zip": "76000",
      "phone": "+52 442-145-7866",
      "is_default": true
    }
  ]
}
\`\`\`

#### 4.8.2 Crear Dirección

\`\`\`http
POST /api/mobile/v1/addresses
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "first_name": "Juan",
  "last_name": "Pérez",
  "address": "Calle Secundaria 456",
  "city": "Querétaro",
  "state": "QRO",
  "zip": "76000",
  "phone": "+52 442-145-7866",
  "is_default": false
}
\`\`\`

**Respuesta:**
\`\`\`json
{
  "success": true,
  "message": "Dirección creada exitosamente",
  "data": {
    "id": "uuid-direccion-2",
    "first_name": "Juan",
    "last_name": "Pérez",
    "address": "Calle Secundaria 456",
    "city": "Querétaro",
    "state": "QRO",
    "zip": "76000",
    "phone": "+52 442-145-7866",
    "is_default": false
  }
}
\`\`\`

#### 4.8.3 Actualizar Dirección

\`\`\`http
PUT /api/mobile/v1/addresses/{address_id}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "address": "Calle Modificada 789",
  "is_default": true
}
\`\`\`

#### 4.8.4 Eliminar Dirección

\`\`\`http
DELETE /api/mobile/v1/addresses/{address_id}
Authorization: Bearer {access_token}
\`\`\`

**Respuesta:**
\`\`\`json
{
  "success": true,
  "message": "Dirección eliminada exitosamente"
}
\`\`\`

### 4.9 Reseñas

#### 4.9.1 Obtener Reseñas de Producto

\`\`\`http
GET /api/mobile/v1/products/{product_id}/reviews?limit=20&offset=0
\`\`\`

**Parámetros:**
- `rating` (opcional): Filtrar por calificación (1-5)
- `limit` (opcional): Número de resultados (default: 20)
- `offset` (opcional): Paginación (default: 0)

**Respuesta:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "uuid-review-1",
      "customer_name": "María López",
      "rating": 5,
      "title": "Excelente producto",
      "comment": "Me ayudó mucho con el estrés...",
      "helpful_count": 15,
      "created_at": "2024-11-15T10:00:00Z"
    }
  ],
  "summary": {
    "average_rating": 4.8,
    "total_reviews": 127,
    "ratings_distribution": {
      "5": 95,
      "4": 25,
      "3": 5,
      "2": 1,
      "1": 1
    }
  },
  "pagination": {
    "total": 127,
    "limit": 20,
    "offset": 0,
    "has_more": true
  }
}
\`\`\`

#### 4.9.2 Crear Reseña

\`\`\`http
POST /api/mobile/v1/reviews
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "product_id": "uuid-producto-1",
  "rating": 5,
  "title": "Excelente producto",
  "comment": "Me ayudó mucho con el estrés y la ansiedad..."
}
\`\`\`

**Respuesta:**
\`\`\`json
{
  "success": true,
  "message": "Reseña enviada. Será visible después de aprobación.",
  "data": {
    "id": "uuid-review-nuevo",
    "product_id": "uuid-producto-1",
    "rating": 5,
    "title": "Excelente producto",
    "comment": "Me ayudó mucho con el estrés...",
    "is_approved": false,
    "created_at": "2024-12-01T16:30:00Z"
  }
}
\`\`\`

#### 4.9.3 Marcar Reseña como Útil

\`\`\`http
POST /api/mobile/v1/reviews/{review_id}/helpful
Authorization: Bearer {access_token}
\`\`\`

**Respuesta:**
\`\`\`json
{
  "success": true,
  "message": "Gracias por tu feedback",
  "helpful_count": 16
}
\`\`\`

### 4.10 Notificaciones

#### 4.10.1 Obtener Notificaciones

\`\`\`http
GET /api/mobile/v1/notifications?unread_only=false&limit=20
Authorization: Bearer {access_token}
\`\`\`

**Parámetros:**
- `unread_only` (opcional): Solo no leídas (default: false)
- `limit` (opcional): Número de resultados (default: 20)

**Respuesta:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "uuid-notif-1",
      "type": "order_shipped",
      "title": "Tu pedido ha sido enviado",
      "message": "El pedido ORD-ABC123 está en camino",
      "is_read": false,
      "created_at": "2024-12-01T14:00:00Z",
      "data": {
        "order_id": "ORD-ABC123",
        "tracking_number": "1Z999AA10123456784"
      }
    }
  ],
  "unread_count": 3
}
\`\`\`

#### 4.10.2 Marcar Notificación como Leída

\`\`\`http
PUT /api/mobile/v1/notifications/{notification_id}/read
Authorization: Bearer {access_token}
\`\`\`

**Respuesta:**
\`\`\`json
{
  "success": true,
  "message": "Notificación marcada como leída"
}
\`\`\`

### 4.11 Códigos de Error

| Código | Descripción |
|--------|-------------|
| 200 | Éxito |
| 201 | Creado exitosamente |
| 400 | Solicitud inválida (datos incorrectos) |
| 401 | No autorizado (token inválido o expirado) |
| 403 | Prohibido (sin permisos) |
| 404 | No encontrado |
| 409 | Conflicto (ej: email ya existe) |
| 422 | Entidad no procesable (validación fallida) |
| 500 | Error interno del servidor |

### 4.12 Ejemplo de Integración (Flutter)

\`\`\`dart
// lib/services/api_service.dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  static const String baseUrl = 'https://stardustmex.com/api/mobile/v1';
  String? _accessToken;

  // Login
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'email': email,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      _accessToken = data['access_token'];
      return data;
    } else {
      throw Exception('Login failed');
    }
  }

  // Obtener productos
  Future<List<dynamic>> getProducts({String? category}) async {
    String url = '$baseUrl/products';
    if (category != null) {
      url += '?category=$category';
    }

    final response = await http.get(Uri.parse(url));

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['data'];
    } else {
      throw Exception('Failed to load products');
    }
  }

  // Crear pedido
  Future<Map<String, dynamic>> createOrder({
    required List<Map<String, dynamic>> items,
    required Map<String, String> shippingAddress,
  }) async {
    if (_accessToken == null) {
      throw Exception('Not authenticated');
    }

    final response = await http.post(
      Uri.parse('$baseUrl/orders'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $_accessToken',
      },
      body: json.encode({
        'items': items,
        'shipping_address': shippingAddress,
        'payment_method': 'stripe',
      }),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to create order');
    }
  }
}
\`\`\`

---

## 5. Configuración de Stripe (Test/Producción)

*Ver sección 3.11.5 para detalles completos*

### Resumen Rápido

**Modo Test (Demo):**
- Para pruebas sin cobrar dinero real
- Usar tarjeta: 4242 4242 4242 4242
- Claves comienzan con `pk_test_` y `sk_test_`

**Modo Producción (Live):**
- Para ventas reales
- Claves comienzan con `pk_live_` y `sk_live_`
- Requiere cuenta Stripe verificada

**Cambio de Modo:**
1. Ir a `/admin/configuracion/pagos`
2. Toggle entre Test/Producción
3. Verificar claves correctas
4. Guardar configuración

---

## 6. Sistema de Impuestos

*Ver sección 1.5 para detalles completos*

### Resumen Rápido

**Gestión de Impuestos:**
1. Ir a `/admin/impuestos`
2. Crear impuestos con tasa (ej: IVA 16% = 0.16)
3. Asignar impuesto a cada producto
4. Checkout calcula automáticamente

**Ventajas:**
- Diferentes impuestos por producto
- Cálculo automático en checkout
- Flexibilidad para cambios fiscales

---

## 7. Sistema de Categorías

*Ver sección 3.4 para detalles completos*

### Resumen Rápido

**Gestión de Categorías:**
1. Ir a `/admin/categorias`
2. Crear categorías con slug único
3. Asignar productos a categorías
4. Clientes pueden filtrar por categoría

**Slugs Importantes:**
- "relajacion" → Relajación
- "energia" → Energía
- "enfoque" → Enfoque
- "sueno" → Sueño

---

## 8. Troubleshooting

### 8.1 Problemas Comunes

#### Error: "No se encontró configuración de Stripe"

**Solución:**
1. Ir a `/admin/configuracion/pagos`
2. Ingresar claves de Stripe (test o producción)
3. Guardar configuración

#### Error: "Stock no disponible"

**Causas:**
- Stock reservado por otro cliente (15 min)
- Stock insuficiente

**Solución:**
1. Esperar 15 minutos para liberación automática
2. O aumentar stock en `/admin/productos`

#### Pedido no se guarda después del pago

**Solución:**
1. Verificar webhook de Stripe en Dashboard
2. URL debe ser: `https://stardustmex.com/api/stripe/webhook`
3. Eventos seleccionados:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`
4. Verificar webhook secret en `/admin/configuracion/pagos`

#### Emails no se envían

**Solución:**
1. Verificar configuración SMTP en `/admin/configuracion/email`
2. Verificar que EMAIL_FROM esté configurado
3. Ver logs de Vercel para errores

#### Imágenes no se cargan

**Solución:**
1. Verificar que BLOB_READ_WRITE_TOKEN esté configurado
2. Re-subir imagen del producto
3. Verificar URL de la imagen

### 8.2 Logs y Debugging

**Ver Logs en Vercel:**
1. Ir a Vercel Dashboard
2. Seleccionar proyecto
3. Click en "Logs"
4. Filtrar por:
   - Function
   - Time range
   - Search term

**Ver Logs de Stripe:**
1. Ir a Stripe Dashboard
2. Developers → Logs
3. Ver eventos recientes
4. Filtrar por tipo de evento

### 8.3 Contacto de Soporte

**Soporte Técnico:**
- Email: contacto@stardustmex.com
- Teléfono: +52 442-145-7866

**Horarios:**
- Lunes a Viernes: 9:00 AM - 6:00 PM (CST)
- Tiempo de respuesta: 24-48 horas

---

## Apéndices

### A. Glosario

- **SKU**: Stock Keeping Unit (Unidad de Mantenimiento de Stock)
- **Slug**: URL-friendly version of a name (ej: "calm-core")
- **JWT**: JSON Web Token (para autenticación)
- **Webhook**: Notificación automática de eventos
- **RLS**: Row Level Security (seguridad a nivel de fila en Supabase)
- **SMTP**: Simple Mail Transfer Protocol (para envío de emails)
- **SSL**: Secure Sockets Layer (encriptación HTTPS)
- **API**: Application Programming Interface

### B. Links Útiles

- **Sitio Web:** https://stardustmex.com
- **Admin Panel:** https://stardustmex.com/admin
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Supabase Dashboard:** https://app.supabase.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Documentación Stripe:** https://stripe.com/docs
- **Documentación Supabase:** https://supabase.com/docs

### C. Comandos Git

\`\`\`bash
# Clonar repositorio
git clone https://github.com/mjperez2704/v0-stardust-harmony.git

# Crear branch para cambios
git checkout -b feature/mi-cambio

# Hacer commit
git add .
git commit -m "Descripción del cambio"

# Push a GitHub
git push origin feature/mi-cambio

# Merge a main (después de PR aprobado)
git checkout main
git pull origin main
git merge feature/mi-cambio
git push origin main
\`\`\`

### D. Scripts SQL Ejecutados

Lista de migraciones aplicadas:
- `001_initial_schema.sql`
- `002_create_products.sql`
- `003_create_orders.sql`
- `004_create_customers.sql`
- `005_create_reviews.sql`
- ... (continuar con todos los scripts)
- `023_create_categories_table.sql`
- `024_create_taxes_table.sql`
- `025_create_stripe_config_table.sql`

---

**Fin del Manual Completo STARDUST v1.0.0**

---

*Última actualización: Diciembre 2024*
*Mantenido por: Equipo STARDUST*
*Contacto: contacto@stardustmex.com*
