# STARDUST - Manual Completo del Sistema

**Versión:** 2.0  
**Fecha:** Diciembre 2024  
**Sitio Web:** https://stardustmex.com  
**Dominio:** stardustmex.com

---

## TABLA DE CONTENIDOS

1. [Manual Técnico](#manual-técnico)
2. [Manual de Usuario Cliente](#manual-de-usuario-cliente)
3. [Manual de Usuario Administrador](#manual-de-usuario-administrador)
4. [Documentación API Móvil](#documentación-api-móvil)
5. [Configuración y Deployment](#configuración-y-deployment)

---

# MANUAL TÉCNICO

## 1. ARQUITECTURA DEL SISTEMA

### 1.1 Stack Tecnológico

**Frontend:**
- Next.js 16 (App Router)
- React 19.2
- TypeScript 5.x
- Tailwind CSS v4
- shadcn/ui Components

**Backend:**
- Next.js API Routes
- Supabase (PostgreSQL)
- Stripe (Pagos)
- Vercel Blob (Almacenamiento)

**Infraestructura:**
- Vercel (Hosting y CI/CD)
- GitHub (Control de versiones)
- Supabase (Base de datos)

### 1.2 Estructura del Proyecto

\`\`\`
/
├── app/                        # App Router de Next.js
│   ├── (auth)/                 # Rutas de autenticación
│   │   ├── login/
│   │   ├── registro/
│   │   ├── recuperar/
│   │   └── actualizar-password/
│   ├── admin/                  # Backoffice (protegido)
│   │   ├── banners/
│   │   ├── categorias/
│   │   ├── clientes/
│   │   ├── configuracion/
│   │   ├── cupones/
│   │   ├── impuestos/
│   │   ├── pedidos/
│   │   ├── productos/
│   │   └── resenas/
│   ├── api/                    # API Routes
│   │   ├── admin/
│   │   ├── categories/
│   │   ├── mobile/
│   │   ├── stripe/
│   │   └── taxes/
│   ├── checkout/               # Proceso de pago
│   ├── confirmacion/           # Confirmación de pedido
│   ├── contacto/               # Página de contacto
│   ├── cuenta/                 # Mi cuenta (cliente)
│   └── productos/              # Catálogo público
├── components/                 # Componentes React
│   ├── admin/                  # Componentes del backoffice
│   ├── ui/                     # shadcn/ui components
│   └── ...                     # Componentes públicos
├── lib/                        # Librerías y utilidades
│   ├── cart-context.tsx        # Context del carrito
│   ├── database-server.ts      # Funciones de BD (servidor)
│   ├── database.ts             # Funciones de BD (cliente)
│   ├── stripe-dynamic.ts       # Cliente de Stripe dinámico
│   └── supabase/               # Clientes de Supabase
├── public/                     # Archivos estáticos
│   ├── fonts/                  # Fuentes personalizadas
│   └── images/                 # Imágenes
├── scripts/                    # Scripts SQL
└── docs/                       # Documentación

\`\`\`

### 1.3 Base de Datos (Supabase)

#### Tablas Principales

**products**
\`\`\`sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image TEXT,
  category TEXT,
  benefits TEXT,
  ingredients TEXT,
  stock INTEGER DEFAULT 0,
  rating NUMERIC(2,1) DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  tax_id TEXT REFERENCES taxes(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**categories**
\`\`\`sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**taxes**
\`\`\`sql
CREATE TABLE taxes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  rate NUMERIC(5,2) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**orders**
\`\`\`sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES auth.users(id),
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  tax NUMERIC(10,2) NOT NULL,
  shipping NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method JSONB,
  stripe_session_id TEXT,
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**customers**
\`\`\`sql
CREATE TABLE customers (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**addresses**
\`\`\`sql
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**stripe_config**
\`\`\`sql
CREATE TABLE stripe_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  test_publishable_key TEXT,
  test_secret_key TEXT,
  test_webhook_secret TEXT,
  production_publishable_key TEXT,
  production_secret_key TEXT,
  production_webhook_secret TEXT,
  active_environment TEXT DEFAULT 'test',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**stock_reservations**
\`\`\`sql
CREATE TABLE stock_reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT REFERENCES products(id),
  quantity INTEGER NOT NULL,
  session_id TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**coupons**
\`\`\`sql
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  value NUMERIC(10,2) NOT NULL,
  min_purchase NUMERIC(10,2),
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**banners**
\`\`\`sql
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**faqs**
\`\`\`sql
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**content_pages**
\`\`\`sql
CREATE TABLE content_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**newsletter_subscribers**
\`\`\`sql
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

### 1.4 Políticas de Seguridad (RLS)

Todas las tablas tienen Row Level Security (RLS) habilitado:

\`\`\`sql
-- Ejemplo: Products (lectura pública, escritura admin)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Products are editable by admins only"
  ON products FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
\`\`\`

### 1.5 Autenticación

**Clientes:**
- Supabase Auth con email/password
- Confirmación por email
- Recuperación de contraseña
- Sesiones persistentes

**Administradores:**
- Sistema custom con tabla `admin_users`
- Hash de contraseñas con bcrypt
- Sesiones con cookies HTTP-only
- Middleware de protección de rutas

## 2. FLUJO DE COMPRA COMPLETO

### 2.1 Arquitectura del Flujo

\`\`\`
[Productos] → [Carrito] → [Checkout] → [Stripe] → [Confirmación] → [Email]
     ↓           ↓           ↓            ↓            ↓              ↓
  Browse    Add to Cart   Shipping   Payment   Save Order   Send Receipt
\`\`\`

### 2.2 Proceso Detallado

#### Paso 1: Navegación y Selección de Productos

**Página:** `/productos`

\`\`\`typescript
// components/product-card.tsx
const handleAddToCart = () => {
  addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category
  }, quantity)
  
  toast.success(`${product.name} agregado al carrito`)
}
\`\`\`

**Características:**
- Grid responsivo (2 columnas en móvil, 3 en desktop)
- Filtros dinámicos por categoría, precio y ordenamiento
- Tarjetas expandibles con descripción completa
- Botón "Agregar al Carrito" con validación de stock

#### Paso 2: Carrito de Compras

**Context:** `lib/cart-context.tsx`

\`\`\`typescript
// Persistencia en localStorage
useEffect(() => {
  localStorage.setItem("stardust-cart", JSON.stringify(cart))
}, [cart])

// Cálculo de totales
const cartTotal = cart.reduce((total, item) => 
  total + item.price * item.quantity, 0)
const cartCount = cart.reduce((count, item) => 
  count + item.quantity, 0)
\`\`\`

**Funcionalidades:**
- Agregar/eliminar/actualizar cantidad
- Persistencia en localStorage
- Drawer lateral con resumen
- Cálculo de totales en tiempo real

#### Paso 3: Checkout

**Página:** `/app/checkout/page.tsx`

**3.1 Reserva de Stock**
\`\`\`typescript
useEffect(() => {
  const reserveStockForCart = async () => {
    const items = cart.map(item => ({
      productId: item.id,
      quantity: item.quantity
    }))
    
    await fetch("/api/stock/reserve", {
      method: "POST",
      body: JSON.stringify({ items, sessionId })
    })
    
    setStockReserved(true)
  }
  
  reserveStockForCart()
}, [cart])
\`\`\`

**3.2 Formulario de Envío**
- Información del cliente (nombre, email, teléfono)
- Dirección de envío completa
- Notas de entrega opcionales

**3.3 Cálculo de Impuestos Dinámico**
\`\`\`typescript
// Obtener impuestos de cada producto
useEffect(() => {
  const fetchProductTaxes = async () => {
    const taxes: Record<string, number> = {}
    
    for (const item of cart) {
      const response = await fetch(`/api/products/${item.id}`)
      const product = await response.json()
      
      if (product.tax_id) {
        const taxResponse = await fetch(`/api/taxes/${product.tax_id}`)
        const tax = await taxResponse.json()
        taxes[item.id] = tax.rate
      } else {
        taxes[item.id] = 0
      }
    }
    
    setProductTaxes(taxes)
  }
  
  fetchProductTaxes()
}, [cart])

// Calcular impuesto total
const tax = cart.reduce((total, item) => {
  const taxRate = productTaxes[item.id] || 0
  const itemTax = (item.price * item.quantity) * (taxRate / 100)
  return total + itemTax
}, 0)
\`\`\`

**3.4 Cálculo de Envío**
\`\`\`typescript
const shippingCost = cartTotal >= 999 ? 0 : 99
\`\`\`

**3.5 Totales**
\`\`\`typescript
const subtotal = cartTotal
const shipping = shippingCost
const tax = calculatedTax
const total = subtotal + shipping + tax
\`\`\`

#### Paso 4: Procesamiento de Pago (Stripe)

**API Route:** `/app/api/stripe/create-checkout-session/route.ts`

\`\`\`typescript
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { items, customerEmail, orderId, customerInfo, 
          shippingAddress, subtotal, shipping, tax, total } = body
  
  // URLs de redirección
  const successUrl = `${baseUrl}/confirmacion/${orderId}?session_id={CHECKOUT_SESSION_ID}`
  const cancelUrl = `${baseUrl}/checkout?canceled=true`
  
  // Crear sesión de Stripe (usa claves dinámicas de BD)
  const session = await createCheckoutSession({
    items,
    customerEmail,
    orderId,
    successUrl,
    cancelUrl,
    metadata: {
      orderId,
      customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
      customerPhone: customerInfo.phone,
      shippingAddress: JSON.stringify(shippingAddress),
      subtotal: subtotal.toString(),
      shipping: shipping.toString(),
      tax: tax.toString(),
      total: total.toString(),
    }
  })
  
  return NextResponse.json({ sessionId: session.id, url: session.url })
}
\`\`\`

**Stripe Dynamic:** `lib/stripe-dynamic.ts`

\`\`\`typescript
// Obtener configuración de Stripe desde BD
export async function getStripeConfig() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  const { data } = await supabase
    .from("stripe_config")
    .select("*")
    .eq("id", "default")
    .single()
  
  const isTest = data.active_environment === "test"
  
  return {
    secretKey: isTest ? data.test_secret_key : data.production_secret_key,
    publishableKey: isTest ? data.test_publishable_key : data.production_publishable_key,
    webhookSecret: isTest ? data.test_webhook_secret : data.production_webhook_secret,
    environment: data.active_environment
  }
}

// Crear instancia de Stripe con claves dinámicas
export async function getStripeInstance() {
  const config = await getStripeConfig()
  return new Stripe(config.secretKey, {
    apiVersion: "2023-10-16",
    typescript: true,
  })
}
\`\`\`

**Flujo en el cliente:**
\`\`\`typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsProcessing(true)
  
  // Crear sesión de checkout
  const response = await fetch("/api/stripe/create-checkout-session", {
    method: "POST",
    body: JSON.stringify({
      items: cart,
      customerEmail,
      orderId,
      customerInfo,
      shippingAddress,
      subtotal,
      shipping,
      tax,
      total,
      sessionId
    })
  })
  
  const { url } = await response.json()
  
  // Redirigir a Stripe Checkout
  window.location.href = url
}
\`\`\`

#### Paso 5: Webhook de Stripe

**API Route:** `/app/api/stripe/webhook/route.ts`

\`\`\`typescript
export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")
  
  // Verificar firma del webhook
  const event = constructWebhookEvent(body, signature)
  
  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const metadata = session.metadata
    
    // 1. Completar reserva de stock
    await StockService.completeReservation(metadata.sessionId)
    
    // 2. Guardar orden en BD
    const orderData: OrderData = {
      orderId: metadata.orderId,
      customerInfo: extractCustomerInfo(metadata),
      shippingAddress: JSON.parse(metadata.shippingAddress),
      items: [], // Extraídos de la sesión
      subtotal: Number.parseFloat(metadata.subtotal),
      shipping: Number.parseFloat(metadata.shipping),
      tax: Number.parseFloat(metadata.tax),
      total: session.amount_total / 100,
      paymentMethod: {
        last4: "****",
        brand: "Stripe"
      },
      status: "completed",
      createdAt: new Date().toISOString()
    }
    
    await saveOrder(orderData)
    
    // 3. Enviar email de confirmación
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-order-confirmation`, {
      method: "POST",
      body: JSON.stringify({
        email: orderData.customerInfo.email,
        customerName: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
        orderId: orderData.orderId,
        orderTotal: orderData.total,
        orderItems: orderData.items
      })
    })
  }
  
  if (event.type === "checkout.session.expired") {
    // Liberar reserva de stock
    await StockService.cancelReservation(metadata.sessionId)
  }
  
  return NextResponse.json({ received: true })
}
\`\`\`

#### Paso 6: Página de Confirmación

**Página:** `/app/confirmacion/[orderId]/page.tsx`

\`\`\`typescript
export default function ConfirmacionPage({ params }: { params: { orderId: string } }) {
  const orderData = getOrder(params.orderId)
  
  if (!orderData) {
    return <OrderNotFound orderId={params.orderId} />
  }
  
  return (
    <div>
      {/* Header de éxito con check verde */}
      <SuccessHeader orderId={orderData.orderId} />
      
      {/* Pasos del pedido (Confirmado → Preparando → En camino) */}
      <OrderStatusSteps currentStep="confirmed" />
      
      {/* Aviso de email enviado */}
      <EmailConfirmationNotice email={orderData.customerInfo.email} />
      
      {/* Detalles del pedido */}
      <OrderDetails items={orderData.items} totals={{...}} />
      
      {/* Información de envío */}
      <ShippingInfo customer={orderData.customerInfo} address={orderData.shippingAddress} />
      
      {/* Botones de acción */}
      <ActionButtons orderId={orderData.orderId} />
      
      {/* Sección de ayuda */}
      <HelpSection />
    </div>
  )
}
\`\`\`

### 2.3 Gestión de Stock

**Service:** `lib/stock-service.ts`

\`\`\`typescript
export class StockService {
  // Reservar stock temporalmente
  static async reserveStock(items: Array<{productId: string, quantity: number}>, sessionId: string) {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutos
    
    for (const item of items) {
      // Verificar disponibilidad
      const { data: product } = await supabase
        .from("products")
        .select("stock")
        .eq("id", item.productId)
        .single()
      
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para ${item.productId}`)
      }
      
      // Crear reserva
      await supabase
        .from("stock_reservations")
        .insert({
          product_id: item.productId,
          quantity: item.quantity,
          session_id: sessionId,
          expires_at: expiresAt,
          status: "pending"
        })
      
      // Reducir stock disponible
      await supabase
        .from("products")
        .update({ stock: product.stock - item.quantity })
        .eq("id", item.productId)
    }
  }
  
  // Confirmar reserva (compra exitosa)
  static async completeReservation(sessionId: string) {
    await supabase
      .from("stock_reservations")
      .update({ status: "completed" })
      .eq("session_id", sessionId)
  }
  
  // Cancelar reserva (pago fallido/expirado)
  static async cancelReservation(sessionId: string) {
    const { data: reservations } = await supabase
      .from("stock_reservations")
      .select("*")
      .eq("session_id", sessionId)
      .eq("status", "pending")
    
    for (const reservation of reservations) {
      // Restaurar stock
      const { data: product } = await supabase
        .from("products")
        .select("stock")
        .eq("id", reservation.product_id)
        .single()
      
      await supabase
        .from("products")
        .update({ stock: product.stock + reservation.quantity })
        .eq("id", reservation.product_id)
      
      // Marcar reserva como cancelada
      await supabase
        .from("stock_reservations")
        .update({ status: "cancelled" })
        .eq("id", reservation.id)
    }
  }
  
  // Limpiar reservas expiradas (cron job)
  static async cleanExpiredReservations() {
    const { data: expired } = await supabase
      .from("stock_reservations")
      .select("*")
      .eq("status", "pending")
      .lt("expires_at", new Date().toISOString())
    
    for (const reservation of expired) {
      await this.cancelReservation(reservation.session_id)
    }
  }
}
\`\`\`

### 2.4 Sistema de Impuestos

**Configuración de Impuestos por Producto:**

\`\`\`typescript
// Admin puede asignar impuesto a cada producto
// Ejemplo: IVA 16% para productos regulares

// En el checkout, se calcula el impuesto por producto:
const calculateTax = (cart: CartItem[], productTaxes: Record<string, number>) => {
  return cart.reduce((total, item) => {
    const taxRate = productTaxes[item.id] || 0
    const itemSubtotal = item.price * item.quantity
    const itemTax = itemSubtotal * (taxRate / 100)
    return total + itemTax
  }, 0)
}
\`\`\`

### 2.5 Modo Test vs Producción

**Configuración en Admin:**

1. **Modo Test (Demo):**
   - Usa claves de prueba de Stripe
   - Tarjetas de prueba: 4242 4242 4242 4242
   - No se realizan cargos reales
   - Ideal para probar el flujo completo

2. **Modo Producción:**
   - Usa claves reales de Stripe
   - Cargos reales a tarjetas de clientes
   - Webhook configurado en producción

**Cambio de Modo:**
\`\`\`typescript
// En admin/configuracion/pagos/page.tsx
const handleEnvironmentToggle = async () => {
  const newEnv = environment === "test" ? "production" : "test"
  
  await fetch("/api/admin/stripe-config", {
    method: "PATCH",
    body: JSON.stringify({ active_environment: newEnv })
  })
  
  setEnvironment(newEnv)
  toast.success(`Modo cambiado a: ${newEnv}`)
}
\`\`\`

## 3. SISTEMA DE AUTENTICACIÓN

### 3.1 Autenticación de Clientes

**Registro:**
\`\`\`typescript
// app/auth/registro/page.tsx
const handleRegister = async (formData: FormData) => {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase.auth.signUp({
    email: formData.get("email"),
    password: formData.get("password"),
    options: {
      emailRedirectTo: `${window.location.origin}/cuenta`,
      data: {
        first_name: formData.get("firstName"),
        last_name: formData.get("lastName"),
        phone: formData.get("phone")
      }
    }
  })
  
  if (error) throw error
  
  // Crear perfil de cliente
  await supabase.from("customers").insert({
    id: data.user.id,
    first_name: formData.get("firstName"),
    last_name: formData.get("lastName"),
    phone: formData.get("phone")
  })
}
\`\`\`

**Login:**
\`\`\`typescript
// app/auth/login/page.tsx
const handleLogin = async (formData: FormData) => {
  const supabase = createBrowserClient()
  
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email"),
    password: formData.get("password")
  })
  
  if (error) throw error
  
  router.push("/cuenta")
}
\`\`\`

**Recuperación de Contraseña:**
\`\`\`typescript
// app/auth/recuperar/page.tsx
const handleResetPassword = async (email: string) => {
  const supabase = createBrowserClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/actualizar-password`
  })
  
  if (error) throw error
}
\`\`\`

**Actualizar Contraseña:**
\`\`\`typescript
// app/auth/actualizar-password/page.tsx
const handleUpdatePassword = async (newPassword: string) => {
  const supabase = createBrowserClient()
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })
  
  if (error) throw error
  
  router.push("/cuenta")
}
\`\`\`

### 3.2 Autenticación de Administradores

**Tabla admin_users:**
\`\`\`sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**Login de Admin:**
\`\`\`typescript
// app/api/admin/login/route.ts
export async function POST(request: NextRequest) {
  const { username, password } = await request.json()
  
  // Buscar admin
  const { data: admin } = await supabase
    .from("admin_users")
    .select("*")
    .eq("username", username)
    .eq("active", true)
    .single()
  
  if (!admin) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
  }
  
  // Verificar contraseña
  const isValid = await bcrypt.compare(password, admin.password_hash)
  
  if (!isValid) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
  }
  
  // Crear sesión
  const session = { userId: admin.id, role: admin.role }
  const token = jwt.sign(session, process.env.JWT_SECRET!, { expiresIn: "8h" })
  
  // Establecer cookie
  const response = NextResponse.json({ success: true })
  response.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8 // 8 horas
  })
  
  return response
}
\`\`\`

**Middleware de Protección:**
\`\`\`typescript
// app/admin/middleware.ts
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("admin_session")?.value
  
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }
}
\`\`\`

## 4. API DOCUMENTATION

### 4.1 Public APIs

#### Products API

**GET /api/products**
\`\`\`typescript
// Obtener todos los productos
// Query params: category, minPrice, maxPrice, sort
Response: {
  products: Product[]
}
\`\`\`

**GET /api/products/[id]**
\`\`\`typescript
// Obtener producto por ID
Response: {
  id: string
  name: string
  price: number
  description: string
  long_description: string
  image: string
  category: string
  stock: number
  rating: number
  benefits: string
  ingredients: string
  tax_id: string
}
\`\`\`

#### Categories API

**GET /api/categories**
\`\`\`typescript
// Obtener todas las categorías
Response: {
  categories: Array<{
    id: string
    name: string
    slug: string
    description: string
    icon: string
  }>
}
\`\`\`

#### Checkout APIs

**POST /api/stock/reserve**
\`\`\`typescript
Request: {
  items: Array<{ productId: string, quantity: number }>
  sessionId: string
}

Response: {
  success: boolean
  expiresAt: string
}
\`\`\`

**POST /api/stripe/create-checkout-session**
\`\`\`typescript
Request: {
  items: CartItem[]
  customerEmail: string
  orderId: string
  customerInfo: CustomerInfo
  shippingAddress: Address
  subtotal: number
  shipping: number
  tax: number
  total: number
  sessionId: string
}

Response: {
  sessionId: string
  url: string
}
\`\`\`

**POST /api/stripe/webhook**
\`\`\`typescript
// Webhook de Stripe (requiere firma)
// Maneja: checkout.session.completed, checkout.session.expired, payment_intent.payment_failed
\`\`\`

### 4.2 Admin APIs

#### Auth

**POST /api/admin/login**
**POST /api/admin/logout**
**GET /api/admin/check-setup**

#### Products

**GET /api/admin/products**
**POST /api/admin/products**
**PUT /api/admin/products/[id]**
**DELETE /api/admin/products/[id]**

#### Categories

**GET /api/admin/categories**
**POST /api/admin/categories**
**PUT /api/admin/categories/[id]**
**DELETE /api/admin/categories/[id]**

#### Taxes

**GET /api/admin/taxes**
**POST /api/admin/taxes**
**PUT /api/admin/taxes/[id]**
**DELETE /api/admin/taxes/[id]**

#### Orders

**GET /api/admin/orders**
**PUT /api/admin/orders/[id]**
**PUT /api/admin/orders/[id]/tracking**

#### Coupons

**GET /api/admin/coupons**
**POST /api/admin/coupons**
**PUT /api/admin/coupons/[id]**
**DELETE /api/admin/coupons/[id]**

#### Stripe Config

**GET /api/admin/stripe-config**
**PATCH /api/admin/stripe-config**

## 5. DEPLOYMENT

### 5.1 Variables de Entorno Requeridas

\`\`\`env
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe (Configurables desde admin)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Vercel Blob
BLOB_READ_WRITE_TOKEN=

# Email (opcional)
RESEND_API_KEY=

# App
NEXT_PUBLIC_BASE_URL=https://stardustmex.com
NEXT_PUBLIC_SITE_URL=https://stardustmex.com
\`\`\`

### 5.2 Pasos de Deployment

1. **Conectar GitHub a Vercel:**
   - Ir a vercel.com
   - Importar repositorio
   - Configurar proyecto

2. **Configurar Variables de Entorno:**
   - En Vercel Dashboard → Settings → Environment Variables
   - Agregar todas las variables listadas arriba
   - Aplicar a: Production, Preview, Development

3. **Configurar Dominio:**
   - En Vercel Dashboard → Settings → Domains
   - Agregar dominio: stardustmex.com
   - Configurar DNS según instrucciones de Vercel

4. **Ejecutar Scripts de Base de Datos:**
   \`\`\`bash
   # Conectar a Supabase
   # Ejecutar scripts en orden:
   001_create_products_table.sql
   002_create_categories_table.sql
   003_create_taxes_table.sql
   004_create_orders_table.sql
   005_create_customers_table.sql
   ...
   025_create_stripe_config_table.sql
   \`\`\`

5. **Configurar Webhook de Stripe:**
   - En Stripe Dashboard → Developers → Webhooks
   - Agregar endpoint: https://stardustmex.com/api/stripe/webhook
   - Seleccionar eventos: checkout.session.completed, checkout.session.expired
   - Copiar webhook secret a variables de entorno

6. **Crear Primer Admin:**
   \`\`\`sql
   -- En Supabase SQL Editor
   INSERT INTO admin_users (username, email, password_hash, role, active)
   VALUES (
     'admin',
     'admin@stardustmex.com',
     crypt('password123', gen_salt('bf')),
     'admin',
     true
   );
   \`\`\`

7. **Deploy:**
   - Push a rama main en GitHub
   - Vercel detecta cambios y hace deploy automático
   - Verificar en: https://stardustmex.com

### 5.3 Troubleshooting

**Error: Cookies not available**
- Asegurar que las páginas que usan cookies son Server Components
- Usar `createClient()` de `@/lib/supabase/server` en Server Components

**Error: Stripe webhook signature verification failed**
- Verificar que STRIPE_WEBHOOK_SECRET esté configurado
- En Stripe Dashboard, regenerar webhook secret si es necesario

**Error: Products not loading**
- Verificar conexión a Supabase
- Verificar que los scripts de BD se ejecutaron correctamente
- Verificar RLS policies

---

# MANUAL DE USUARIO CLIENTE

## 1. NAVEGACIÓN DEL SITIO

### 1.1 Página de Inicio
- **URL:** https://stardustmex.com
- Presenta banners promocionales
- Sección de productos destacados
- Misión y visión de STARDUST
- Newsletter subscription

### 1.2 Catálogo de Productos
- **URL:** https://stardustmex.com/productos

**Características:**
- Grid de productos (2 por fila en móvil, 3 en desktop)
- Filtros por:
  - Categoría (Relajación, Energía, Sueño, etc.)
  - Precio (Menor a Mayor, Mayor a Menor)
  - Ordenar por (Más reciente, Más popular)

**Tarjeta de Producto:**
- Imagen del producto
- Nombre y categoría
- Precio en MXN
- Botón "Ver Más" (expande descripción)
- Botón "Agregar al Carrito"
- Indicador de stock disponible

### 1.3 Carrito de Compras

**Acceso:** Click en el ícono del carrito (esquina superior derecha)

**Funciones:**
- Ver todos los productos agregados
- Modificar cantidades
- Eliminar productos
- Ver subtotal
- Botón "Ir a Checkout"
- Botón "Explorar Productos" (volver al catálogo)

## 2. PROCESO DE COMPRA

### Paso 1: Agregar Productos al Carrito

1. Navegar a la página de Productos
2. Usar filtros para encontrar productos deseados
3. Click en "Ver Más" para ver descripción completa (opcional)
4. Ajustar cantidad si es necesario
5. Click en "Agregar al Carrito"
6. Notificación de confirmación aparece

### Paso 2: Revisar Carrito

1. Click en ícono del carrito
2. Revisar productos agregados
3. Ajustar cantidades si es necesario
4. Ver subtotal actualizado
5. Click en "Ir a Checkout"

### Paso 3: Checkout (Formulario de Envío)

**Información Personal:**
- Nombre
- Apellido
- Email (recibirás confirmación aquí)
- Teléfono

**Dirección de Envío:**
- Dirección completa
- Ciudad
- Estado
- Código Postal
- Notas de entrega (opcional)

**Resumen del Pedido:**
- Productos y cantidades
- Subtotal
- Envío (GRATIS en compras mayores a $999 MXN)
- Impuestos (calculado automáticamente)
- Total a pagar

### Paso 4: Pago con Stripe

1. Click en "Proceder al Pago"
2. Serás redirigido a la página segura de Stripe
3. Ingresar información de tarjeta:
   - Número de tarjeta
   - Fecha de vencimiento (MM/AA)
   - CVC (3 dígitos)
   - Nombre del titular
4. Click en "Pagar"

**Tarjetas de Prueba (Modo Demo):**
- Número: 4242 4242 4242 4242
- Fecha: Cualquier fecha futura
- CVC: Cualquier 3 dígitos

### Paso 5: Confirmación del Pedido

**Página de Confirmación:**
- Mensaje de éxito con ícono verde
- Número de pedido único
- Pasos del pedido (Confirmado → Preparando → En camino)
- Aviso de email de confirmación enviado
- Detalles completos del pedido
- Información de envío
- Tiempo estimado de entrega: 3-5 días hábiles

**Acciones Disponibles:**
- Descargar factura (PDF)
- Seguir comprando
- Ver mis pedidos
- Contactar soporte

**Email de Confirmación:**
Recibirás un email con:
- Resumen del pedido
- Número de tracking (cuando esté disponible)
- Link para ver estado del pedido
- Información de contacto

## 3. MI CUENTA

### 3.1 Crear Cuenta

**URL:** https://stardustmex.com/auth/registro

1. Click en "Mi Cuenta" en el menú
2. Click en "Registrarse"
3. Llenar formulario:
   - Nombre
   - Apellido
   - Email
   - Teléfono
   - Contraseña (mínimo 6 caracteres)
   - Confirmar contraseña
4. Click en "Registrarse"
5. Verificar email (revisar bandeja de entrada/spam)
6. Click en link de confirmación

### 3.2 Iniciar Sesión

**URL:** https://stardustmex.com/auth/login

1. Ingresar email
2. Ingresar contraseña
3. Click en "Iniciar Sesión"

**¿Olvidaste tu contraseña?**
1. Click en "¿Olvidaste tu contraseña?"
2. Ingresar email registrado
3. Click en "Enviar link de recuperación"
4. Revisar email
5. Click en link recibido
6. Ingresar nueva contraseña
7. Confirmar nueva contraseña
8. Click en "Actualizar Contraseña"

### 3.3 Panel de Mi Cuenta

**Secciones:**

**Perfil:**
- Editar información personal
- Cambiar contraseña
- Actualizar foto de perfil (opcional)

**Mis Pedidos:**
- Ver historial completo de pedidos
- Filtrar por estado (Pendiente, Completado, Enviado)
- Ver detalles de cada pedido
- Descargar facturas
- Rastrear envíos

**Direcciones:**
- Agregar nuevas direcciones
- Editar direcciones existentes
- Eliminar direcciones
- Marcar dirección predeterminada

**Métodos de Pago:**
- Ver tarjetas guardadas (últimos 4 dígitos)
- Agregar nuevas tarjetas
- Eliminar tarjetas

## 4. CONTACTO Y SOPORTE

### 4.1 Página de Contacto

**URL:** https://stardustmex.com/contacto

**Información de Contacto:**
- **Email:** contacto@stardustmex.com
- **Teléfono:** (555) 123-4567
- **Dirección:** Av. Principal 123, Ciudad de México, CDMX 12345

**Formulario de Contacto:**
1. Nombre completo
2. Email
3. Asunto
4. Mensaje
5. Click en "Enviar Mensaje"
6. Recibirás respuesta en 24-48 horas

**FAQ's (Preguntas Frecuentes):**
- Acordeones expandibles con preguntas comunes
- Categorías: Productos, Envíos, Pagos, Devoluciones

### 4.2 Preguntas Frecuentes

**Sobre Productos:**
- ¿Qué son los suplementos adaptógenos?
- ¿Cómo debo tomar los productos?
- ¿Los productos tienen efectos secundarios?
- ¿Son aptos para veganos?

**Sobre Envíos:**
- ¿Cuánto tiempo tarda el envío?
- ¿El envío es gratis?
- ¿Hacen envíos internacionales?
- ¿Cómo rastreo mi pedido?

**Sobre Pagos:**
- ¿Qué métodos de pago aceptan?
- ¿Es seguro pagar en línea?
- ¿Puedo pagar en efectivo?
- ¿Aceptan pagos a meses sin intereses?

**Sobre Devoluciones:**
- ¿Cuál es su política de devoluciones?
- ¿Cómo solicito una devolución?
- ¿Cuánto tarda el reembolso?
- ¿Puedo cambiar un producto?

## 5. POLÍTICAS

### 5.1 Política de Privacidad
**URL:** https://stardustmex.com/aviso-privacidad
- Uso de datos personales
- Cookies y tracking
- Derechos del usuario

### 5.2 Política de Envío
**URL:** https://stardustmex.com/politicas-envio
- Tiempos de entrega
- Costos de envío
- Zonas de cobertura

### 5.3 Política de Devoluciones
**URL:** https://stardustmex.com/politicas-devolucion
- Condiciones para devoluciones
- Proceso de devolución
- Tiempos de reembolso

---

# MANUAL DE USUARIO ADMINISTRADOR

## 1. ACCESO AL BACKOFFICE

### 1.1 Inicio de Sesión

**URL:** https://stardustmex.com/admin/login

1. Ingresar usuario de administrador
2. Ingresar contraseña
3. Click en "Iniciar Sesión"

**Credenciales por Defecto:**
- Usuario: `admin`
- Contraseña: `[Definida durante setup]`

### 1.2 Panel Principal (Dashboard)

**URL:** https://stardustmex.com/admin

**Métricas Principales:**
- Total de ventas del mes
- Número de pedidos
- Productos en stock bajo
- Nuevos clientes registrados

**Gráficas:**
- Ventas por día (últimos 30 días)
- Productos más vendidos
- Categorías más populares

## 2. GESTIÓN DE PRODUCTOS

### 2.1 Lista de Productos

**URL:** https://stardustmex.com/admin/productos

**Funciones:**
- Ver tabla de todos los productos
- Buscar por nombre
- Filtrar por categoría
- Ordenar por diferentes columnas
- Paginación

**Columnas de la Tabla:**
- Imagen
- Nombre
- Categoría
- Precio
- Stock
- Estado (Activo/Inactivo)
- Acciones (Editar/Eliminar)

### 2.2 Agregar Producto

1. Click en "Nuevo Producto"
2. Llenar formulario:
   - **Información Básica:**
     - ID (slug): Identificador único (ej: calm-core)
     - Nombre del producto
     - Categoría (seleccionar de lista)
     - Precio (MXN)
     - Impuesto (seleccionar IVA u otro)
   
   - **Descripciones:**
     - Descripción corta (mostrada en card)
     - Descripción larga (mostrada al expandir)
     - Beneficios (lista separada por comas)
     - Ingredientes (lista separada por comas)
   
   - **Inventario:**
     - Stock disponible
     - Permitir venta sin stock (checkbox)
   
   - **Imagen:**
     - Subir imagen del producto (arrastra o click)
     - Formatos: JPG, PNG, WebP
     - Tamaño máximo: 5MB
     - Dimensiones recomendadas: 800x800px
   
   - **SEO y Visibilidad:**
     - Producto destacado (checkbox)
     - Estado: Activo/Inactivo

3. Click en "Guardar Producto"

### 2.3 Editar Producto

1. En lista de productos, click en ícono de lápiz
2. Modificar campos deseados
3. Click en "Actualizar Producto"

### 2.4 Eliminar Producto

1. En lista de productos, click en ícono de basura
2. Confirmar eliminación
3. El producto se elimina permanentemente

**Nota:** No se puede eliminar un producto que está en pedidos existentes.

## 3. GESTIÓN DE CATEGORÍAS

### 3.1 Lista de Categorías

**URL:** https://stardustmex.com/admin/categorias

**Funciones:**
- Ver todas las categorías
- Buscar por nombre
- Editar/Eliminar

### 3.2 Agregar Categoría

1. Click en "Nueva Categoría"
2. Llenar formulario:
   - Nombre (ej: Relajación)
   - Slug (ej: relajacion) - generado automáticamente
   - Descripción
   - Ícono (opcional)
3. Click en "Guardar Categoría"

### 3.3 Editar/Eliminar Categoría

- Similar al proceso de productos
- No se puede eliminar una categoría con productos asignados

## 4. GESTIÓN DE IMPUESTOS

### 4.1 Lista de Impuestos

**URL:** https://stardustmex.com/admin/impuestos

**Impuesto por Defecto:**
- **IVA:** 16%
- Estado: Activo

### 4.2 Agregar Impuesto

1. Click en "Nuevo Impuesto"
2. Llenar formulario:
   - Nombre (ej: IVA, IEPS)
   - Tasa (%) (ej: 16.00)
   - Descripción
   - Estado: Activo/Inactivo
3. Click en "Guardar Impuesto"

### 4.3 Asignar Impuesto a Producto

- Al crear/editar producto, seleccionar impuesto en dropdown
- Cada producto puede tener un impuesto diferente
- Si no se asigna impuesto, el producto no tendrá cargos adicionales

## 5. GESTIÓN DE PEDIDOS

### 5.1 Lista de Pedidos

**URL:** https://stardustmex.com/admin/pedidos

**Columnas:**
- Número de orden
- Cliente
- Email
- Total
- Estado
- Fecha
- Acciones

**Estados Disponibles:**
- Pendiente (recién creado)
- Confirmado (pago recibido)
- Preparando (empacando productos)
- Enviado (en camino al cliente)
- Entregado (recibido por cliente)
- Cancelado (pedido cancelado)

### 5.2 Ver Detalles de Pedido

1. Click en número de orden o ícono de ojo
2. Ver información completa:
   - Datos del cliente
   - Dirección de envío
   - Productos ordenados
   - Totales (subtotal, envío, impuestos, total)
   - Método de pago
   - Tracking number (si está disponible)
   - Timeline del pedido

### 5.3 Actualizar Estado de Pedido

1. En detalles del pedido, seleccionar nuevo estado
2. Click en "Actualizar Estado"
3. Cliente recibe notificación por email (automático)

### 5.4 Agregar Tracking Number

1. En detalles del pedido, ir a sección "Tracking"
2. Ingresar número de rastreo de paquetería
3. Click en "Guardar"
4. Cliente recibe email con link de rastreo

### 5.5 Exportar Pedidos

1. Click en "Exportar"
2. Seleccionar formato: CSV o Excel
3. Seleccionar filtros (opcional):
   - Rango de fechas
   - Estado
   - Cliente
4. Click en "Descargar"

## 6. GESTIÓN DE CLIENTES

### 6.1 Lista de Clientes

**URL:** https://stardustmex.com/admin/clientes

**Columnas:**
- Nombre
- Email
- Teléfono
- Total de pedidos
- Total gastado
- Fecha de registro
- Acciones

### 6.2 Ver Perfil de Cliente

1. Click en nombre del cliente
2. Ver información:
   - Datos personales
   - Direcciones guardadas
   - Historial de pedidos
   - Total de compras

### 6.3 Editar Cliente

1. En perfil de cliente, click en "Editar"
2. Modificar información permitida
3. Click en "Guardar"

**Nota:** No se puede modificar el email del cliente una vez registrado.

## 7. CUPONES Y DESCUENTOS

### 7.1 Lista de Cupones

**URL:** https://stardustmex.com/admin/cupones

**Columnas:**
- Código
- Tipo (Porcentaje/Monto Fijo)
- Valor
- Usos
- Vencimiento
- Estado
- Acciones

### 7.2 Crear Cupón

1. Click en "Nuevo Cupón"
2. Llenar formulario:
   - **Código:** Texto único (ej: BIENVENIDA10)
   - **Tipo de descuento:**
     - Porcentaje (ej: 10%)
     - Monto fijo (ej: $100 MXN)
   - **Valor del descuento**
   - **Compra mínima:** (opcional)
   - **Usos máximos:** Número de veces que puede usarse
   - **Fecha de vencimiento:** (opcional)
   - **Estado:** Activo/Inactivo
3. Click en "Crear Cupón"

### 7.3 Tipos de Cupones

**Cupón de Porcentaje:**
- Ejemplo: DESCUENTO20
- Valor: 20%
- Aplica 20% de descuento sobre el subtotal

**Cupón de Monto Fijo:**
- Ejemplo: ENVIOGRATIS
- Valor: $99 MXN
- Resta $99 MXN del subtotal

**Cupón con Compra Mínima:**
- Ejemplo: PRIMERACOMPRA
- Valor: 15%
- Compra mínima: $500 MXN
- Solo aplica si el subtotal es mayor a $500

### 7.4 Desactivar/Eliminar Cupón

- **Desactivar:** Cambia estado a Inactivo (se puede reactivar después)
- **Eliminar:** Borra el cupón permanentemente (no se puede deshacer)

## 8. BANNERS PROMOCIONALES

### 8.1 Gestión de Banners

**URL:** https://stardustmex.com/admin/banners

**Funciones:**
- Ver lista de banners activos
- Cambiar orden de aparición (drag & drop)
- Activar/Desactivar banners

### 8.2 Crear Banner

1. Click en "Nuevo Banner"
2. Llenar formulario:
   - **Título:** Texto principal del banner
   - **Subtítulo:** Texto secundario (opcional)
   - **Imagen:** Subir imagen
     - Dimensiones recomendadas: 1920x600px
     - Formato: JPG, PNG, WebP
     - Tamaño máximo: 5MB
   - **Link URL:** Destino al hacer click (opcional)
   - **Orden:** Posición en el carrusel
   - **Estado:** Activo/Inactivo
3. Click en "Guardar Banner"

### 8.3 Reordenar Banners

1. Arrastrar y soltar banners para cambiar orden
2. Los cambios se guardan automáticamente
3. El orden se refleja en el sitio público inmediatamente

## 9. CONFIGURACIÓN DE PAGOS (STRIPE)

### 9.1 Acceso a Configuración

**URL:** https://stardustmex.com/admin/configuracion/pagos

### 9.2 Modo Test (Demo)

**Propósito:**
- Probar el flujo de compra completo sin cargos reales
- Usar tarjetas de prueba de Stripe
- Validar integraciones antes de ir a producción

**Configuración:**
1. Seleccionar tab "Modo Test"
2. Ingresar claves de prueba:
   - **Publishable Key (Prueba):** pk_test_...
   - **Secret Key (Prueba):** sk_test_...
   - **Webhook Secret (Prueba):** whsec_...
3. Click en "Guardar Configuración Test"
4. Activar toggle "Modo Test Activo"

**Obtener Claves de Prueba:**
1. Ir a https://dashboard.stripe.com
2. Click en "Developers" → "API keys"
3. En "Viewing test data" (arriba), asegurar que está en modo test
4. Copiar:
   - Publishable key
   - Secret key
5. Ir a "Webhooks" → Agregar endpoint: https://stardustmex.com/api/stripe/webhook
6. Seleccionar eventos: checkout.session.completed, checkout.session.expired
7. Copiar Webhook signing secret

**Tarjetas de Prueba:**
- **Exitosa:** 4242 4242 4242 4242
- **Requiere autenticación:** 4000 0025 0000 3155
- **Rechazada:** 4000 0000 0000 9995
- Fecha: Cualquier fecha futura
- CVC: Cualquier 3 dígitos

### 9.3 Modo Producción

**Propósito:**
- Procesar pagos reales de clientes
- Cargos reales a tarjetas
- Debe estar configurado correctamente antes de lanzamiento

**Configuración:**
1. Seleccionar tab "Modo Producción"
2. Ingresar claves de producción:
   - **Publishable Key (Producción):** pk_live_...
   - **Secret Key (Producción):** sk_live_...
   - **Webhook Secret (Producción):** whsec_...
3. Click en "Guardar Configuración Producción"
4. Activar toggle "Modo Producción Activo"

**Obtener Claves de Producción:**
1. Ir a https://dashboard.stripe.com
2. Cambiar a "Viewing live data" (arriba)
3. Click en "Developers" → "API keys"
4. Copiar claves de producción
5. Configurar webhook de producción igual que en test

**Importante:**
- Verificar cuenta de Stripe antes de activar modo producción
- Configurar cuenta bancaria para recibir pagos
- Probar exhaustivamente en modo test primero

### 9.4 Cambiar Entre Modos

**Indicador Visual:**
- Badge en la página muestra el modo activo actual
- **Verde:** Modo Test
- **Azul:** Modo Producción

**Toggle de Cambio:**
1. Click en el toggle junto al modo deseado
2. Confirmar cambio en diálogo
3. El sistema cambia inmediatamente
4. Todos los pagos nuevos usarán el modo seleccionado

**Recomendación:**
- Mantener en modo test hasta estar listo para producción
- Probar flujo completo en test antes de cambiar
- Solo cambiar a producción cuando:
  - Todas las claves están configuradas
  - Webhook está funcionando correctamente
  - Se ha probado exhaustivamente en test

## 10. CONFIGURACIÓN DE EMAIL

### 10.1 Email Transaccional

**URL:** https://stardustmex.com/admin/configuracion/email

**Emails Automáticos:**
- Confirmación de pedido
- Actualización de estado de pedido
- Tracking number disponible
- Recuperación de contraseña
- Bienvenida a nuevos clientes

**Configuración:**
1. Seleccionar proveedor: Resend (recomendado)
2. Ingresar API Key de Resend
3. Configurar email "From":
   - Nombre: STARDUST
   - Email: contacto@stardustmex.com
4. Click en "Guardar Configuración"

**Obtener API Key de Resend:**
1. Ir a https://resend.com
2. Crear cuenta/iniciar sesión
3. Ir a "API Keys"
4. Crear nueva key
5. Copiar y pegar en configuración

**Personalizar Emails:**
1. Ir a "Plantillas de Email"
2. Seleccionar plantilla a editar
3. Modificar contenido (HTML permitido)
4. Variables disponibles:
   - `{{customer_name}}`
   - `{{order_number}}`
   - `{{order_total}}`
   - `{{tracking_number}}`
5. Click en "Guardar Plantilla"

## 11. GESTIÓN DE CONTENIDO

### 11.1 Páginas Dinámicas

**URL:** https://stardustmex.com/admin/configuracion/contenido

**Páginas Editables:**
- Términos y Condiciones
- Aviso de Privacidad
- Política de Envío
- Política de Devoluciones

### 11.2 Editar Página

1. Seleccionar página de la lista
2. Click en "Editar"
3. Modificar contenido (editor rich text):
   - Texto con formato
   - Listas (ordenadas/desordenadas)
   - Links
   - Imágenes
   - Tablas
4. Vista previa en tiempo real
5. Click en "Guardar Cambios"
6. Los cambios se reflejan inmediatamente en el sitio público

### 11.3 FAQ's (Preguntas Frecuentes)

**URL:** https://stardustmex.com/admin/configuracion/faqs

**Gestionar FAQ's:**
1. Ver lista de preguntas existentes
2. Click en "Nueva Pregunta"
3. Llenar formulario:
   - Pregunta
   - Respuesta (puede incluir HTML)
   - Categoría (Productos, Envíos, Pagos, etc.)
   - Orden de aparición
   - Estado: Activo/Inactivo
4. Click en "Guardar"

**Reordenar FAQ's:**
- Drag & drop para cambiar orden
- Se guardan automáticamente

## 12. NEWSLETTER

### 12.1 Suscriptores

**URL:** https://stardustmex.com/admin/newsletter

**Ver Suscriptores:**
- Lista de emails suscritos
- Fecha de suscripción
- Exportar lista (CSV/Excel)

### 12.2 Enviar Newsletter

1. Click en "Nuevo Newsletter"
2. Diseñar email:
   - Asunto
   - Preheader (texto de vista previa)
   - Contenido (editor rich text)
   - Imágenes
   - Botones de acción
3. Vista previa
4. Seleccionar destinatarios:
   - Todos los suscriptores
   - Solo nuevos suscriptores (último mes)
   - Lista personalizada
5. Programar envío:
   - Enviar ahora
   - Programar fecha/hora
6. Click en "Enviar Newsletter"

### 12.3 Reportes

- Tasa de apertura
- Clicks en links
- Desuscripciones
- Bounces (emails inválidos)

## 13. RESEÑAS DE PRODUCTOS

### 13.1 Gestión de Reseñas

**URL:** https://stardustmex.com/admin/resenas

**Funciones:**
- Ver todas las reseñas
- Filtrar por:
  - Producto
  - Calificación (estrellas)
  - Estado (Pendiente/Aprobada/Rechazada)
- Buscar por cliente

### 13.2 Moderar Reseñas

**Estados de Reseña:**
- **Pendiente:** Recién enviada por cliente, esperando aprobación
- **Aprobada:** Visible en el sitio público
- **Rechazada:** No se muestra en el sitio

**Proceso:**
1. Click en reseña pendiente
2. Leer contenido completo
3. Verificar que cumple con políticas:
   - No contiene lenguaje ofensivo
   - Es relevante al producto
   - No es spam
4. Click en "Aprobar" o "Rechazar"

### 13.3 Responder Reseñas

1. En detalles de reseña aprobada
2. Click en "Responder"
3. Escribir respuesta (se muestra como "Respuesta del vendedor")
4. Click en "Publicar Respuesta"
5. La respuesta aparece debajo de la reseña en el sitio público

## 14. USUARIOS ADMINISTRADORES

### 14.1 Gestión de Admins

**URL:** https://stardustmex.com/admin/usuarios-admin

**Ver Lista:**
- Nombre de usuario
- Email
- Rol
- Estado (Activo/Inactivo)
- Último acceso

### 14.2 Crear Nuevo Admin

1. Click en "Nuevo Administrador"
2. Llenar formulario:
   - Nombre de usuario
   - Email
   - Contraseña
   - Confirmar contraseña
   - Rol:
     - **Super Admin:** Acceso total
     - **Admin:** Gestión de productos, pedidos, clientes
     - **Editor:** Solo edición de contenido y productos
3. Click en "Crear Administrador"

### 14.3 Roles y Permisos

**Super Admin:**
- Acceso total a todas las funciones
- Gestión de usuarios administradores
- Configuración de pagos
- Configuración de email

**Admin:**
- Gestión de productos
- Gestión de pedidos
- Gestión de clientes
- Cupones y descuentos
- Reseñas

**Editor:**
- Edición de productos
- Edición de contenido
- Gestión de banners
- FAQ's

### 14.4 Desactivar/Eliminar Admin

**Desactivar:**
- El usuario no puede iniciar sesión
- Se conservan los registros de actividad
- Se puede reactivar después

**Eliminar:**
- Elimina permanentemente el usuario
- No se puede deshacer
- Los registros de actividad se mantienen anónimos

## 15. REPORTES Y ESTADÍSTICAS

### 15.1 Dashboard de Ventas

**Métricas Principales:**
- Ventas del día
- Ventas del mes
- Ventas del año
- Comparación con período anterior

**Gráficas:**
- Ventas por día (últimos 30 días)
- Ventas por mes (último año)
- Productos más vendidos (top 10)
- Categorías más populares

### 15.2 Reportes Personalizados

**Crear Reporte:**
1. Click en "Reportes" → "Nuevo Reporte"
2. Seleccionar tipo:
   - Ventas por período
   - Productos más vendidos
   - Clientes más frecuentes
   - Inventario
3. Configurar parámetros:
   - Rango de fechas
   - Filtros adicionales
4. Click en "Generar Reporte"
5. Ver reporte o exportar (PDF/Excel)

### 15.3 Exportar Datos

**Datos Exportables:**
- Productos
- Pedidos
- Clientes
- Ventas
- Inventario

**Formatos:**
- CSV
- Excel
- PDF

**Proceso:**
1. Ir a sección correspondiente
2. Click en "Exportar"
3. Seleccionar formato
4. Configurar filtros (opcional)
5. Click en "Descargar"

## 16. CONFIGURACIÓN GENERAL

### 16.1 Información de la Tienda

**URL:** https://stardustmex.com/admin/configuracion/general

**Configuración:**
- Nombre de la tienda
- Logo (subir imagen)
- Favicon (ícono del navegador)
- Email de contacto
- Teléfono
- Dirección física
- Horarios de atención

### 16.2 Configuración de Envío

**Zonas de Envío:**
1. Click en "Agregar Zona"
2. Definir:
   - Nombre de zona (ej: Ciudad de México)
   - Estados incluidos
   - Costo de envío
   - Tiempo estimado de entrega
   - Envío gratis a partir de (opcional)
3. Click en "Guardar Zona"

**Métodos de Envío:**
- Estándar (3-5 días)
- Express (1-2 días)
- Pickup en tienda

### 16.3 Notificaciones del Admin

**Configurar Alertas:**
- Nuevo pedido recibido
- Stock bajo (definir umbral)
- Nueva reseña pendiente
- Cupón próximo a vencer
- Problema con pago

**Medios de Notificación:**
- Email
- Push (navegador)
- SMS (requiere configuración adicional)

## 17. SOLUCIÓN DE PROBLEMAS (ADMIN)

### 17.1 Problemas Comunes

**"No puedo subir imágenes"**
- Verificar tamaño de archivo (máximo 5MB)
- Verificar formato (JPG, PNG, WebP)
- Limpiar caché del navegador
- Intentar desde otro navegador

**"Los cambios no se reflejan en el sitio"**
- Esperar 1-2 minutos (caché)
- Limpiar caché del navegador (Ctrl + Shift + R)
- Verificar que guardaste los cambios
- Verificar que el elemento está activo

**"Error al procesar pedido"**
- Verificar configuración de Stripe
- Verificar que el webhook está activo
- Revisar logs en Stripe Dashboard
- Contactar soporte técnico

**"No puedo acceder al backoffice"**
- Verificar credenciales
- Verificar que tu cuenta está activa
- Limpiar cookies del navegador
- Solicitar restablecimiento de contraseña

### 17.2 Logs y Debug

**Ver Logs:**
1. Ir a "Configuración" → "Logs"
2. Filtrar por:
   - Tipo (Error, Warning, Info)
   - Fecha
   - Usuario
   - Módulo
3. Ver detalles de cada log

**Información Útil:**
- Timestamp
- Tipo de error
- Mensaje
- Stack trace
- Usuario que generó el error

### 17.3 Mantenimiento

**Modo Mantenimiento:**
1. Ir a "Configuración" → "Mantenimiento"
2. Activar toggle "Modo Mantenimiento"
3. Personalizar mensaje para visitantes
4. El sitio muestra página de mantenimiento
5. El backoffice sigue funcionando

**Backup de Base de Datos:**
1. Ir a "Configuración" → "Backup"
2. Click en "Crear Backup"
3. Esperar confirmación
4. Descargar archivo .sql

**Restaurar Backup:**
1. Ir a "Configuración" → "Backup"
2. Click en "Restaurar"
3. Seleccionar archivo .sql
4. Confirmar restauración
5. Esperar proceso (puede tomar varios minutos)

---

# DOCUMENTACIÓN API MÓVIL

## 1. INTRODUCCIÓN

La API móvil de STARDUST permite integrar la tienda en aplicaciones móviles nativas (iOS/Android) o híbridas (Flutter, React Native).

**Base URL:** `https://stardustmex.com/api/mobile/v1`

**Autenticación:** JWT (JSON Web Tokens)

**Formato de Respuesta:** JSON

## 2. AUTENTICACIÓN

### 2.1 Registro de Usuario

**Endpoint:** `POST /api/mobile/v1/auth/register`

**Request:**
\`\`\`json
{
  "email": "cliente@example.com",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "5551234567"
}
\`\`\`

**Response (Success - 201):**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "cliente@example.com",
      "firstName": "Juan",
      "lastName": "Pérez"
    },
    "token": "jwt_token_here",
    "expiresIn": 86400
  }
}
\`\`\`

**Response (Error - 400):**
\`\`\`json
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "El email ya está registrado"
  }
}
\`\`\`

### 2.2 Login

**Endpoint:** `POST /api/mobile/v1/auth/login`

**Request:**
\`\`\`json
{
  "email": "cliente@example.com",
  "password": "password123"
}
\`\`\`

**Response (Success - 200):**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "cliente@example.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "phone": "5551234567"
    },
    "token": "jwt_token_here",
    "expiresIn": 86400
  }
}
\`\`\`

**Response (Error - 401):**
\`\`\`json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email o contraseña incorrectos"
  }
}
\`\`\`

### 2.3 Logout

**Endpoint:** `POST /api/mobile/v1/auth/logout`

**Headers:**
\`\`\`
Authorization: Bearer {token}
\`\`\`

**Response (Success - 200):**
\`\`\`json
{
  "success": true,
  "message": "Sesión cerrada correctamente"
}
\`\`\`

### 2.4 Refresh Token

**Endpoint:** `POST /api/mobile/v1/auth/refresh`

**Headers:**
\`\`\`
Authorization: Bearer {token}
\`\`\`

**Response (Success - 200):**
\`\`\`json
{
  "success": true,
  "data": {
    "token": "new_jwt_token_here",
    "expiresIn": 86400
  }
}
\`\`\`

## 3. PRODUCTOS

### 3.1 Listar Productos

**Endpoint:** `GET /api/mobile/v1/products`

**Query Parameters:**
- `category` (optional): ID de categoría
- `minPrice` (optional): Precio mínimo
- `maxPrice` (optional): Precio máximo
- `sort` (optional): `price_asc`, `price_desc`, `name_asc`, `name_desc`, `newest`
- `page` (optional): Número de página (default: 1)
- `limit` (optional): Productos por página (default: 20, max: 50)
- `search` (optional): Búsqueda por nombre

**Example:**
\`\`\`
GET /api/mobile/v1/products?category=relajacion&sort=price_asc&page=1&limit=20
\`\`\`

**Response (Success - 200):**
\`\`\`json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "calm-core",
        "name": "Calm Core",
        "slug": "calm-core",
        "description": "Equilibrio emocional y reducción del estrés",
        "longDescription": "Suplemento natural...",
        "price": 899.00,
        "image": "https://stardustmex.com/images/calm-core.jpg",
        "category": {
          "id": "relajacion",
          "name": "Relajación",
          "slug": "relajacion"
        },
        "stock": 50,
        "rating": 4.8,
        "featured": true,
        "benefits": ["Reduce el estrés", "Mejora el sueño"],
        "ingredients": ["Ashwagandha", "Rhodiola"],
        "tax": {
          "id": "iva",
          "name": "IVA",
          "rate": 16.00
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
\`\`\`

### 3.2 Obtener Producto por ID

**Endpoint:** `GET /api/mobile/v1/products/{id}`

**Example:**
\`\`\`
GET /api/mobile/v1/products/calm-core
\`\`\`

**Response (Success - 200):**
\`\`\`json
{
  "success": true,
  "data": {
    "product": {
      "id": "calm-core",
      "name": "Calm Core",
      "slug": "calm-core",
      "description": "Equilibrio emocional y reducción del estrés",
      "longDescription": "Suplemento natural en cápsulas...",
      "price": 899.00,
      "image": "https://stardustmex.com/images/calm-core.jpg",
      "category": {
        "id": "relajacion",
        "name": "Relajación",
        "slug": "relajacion"
      },
      "stock": 50,
      "rating": 4.8,
      "featured": true,
      "benefits": ["Reduce el estrés", "Mejora el sueño"],
      "ingredients": ["Ashwagandha", "Rhodiola"],
      "tax": {
        "id": "iva",
        "name": "IVA",
        "rate": 16.00
      },
      "reviews": [
        {
          "id": "review-1",
          "customer": {
            "name": "María García",
            "avatar": "https://..."
          },
          "rating": 5,
          "comment": "Excelente producto",
          "date": "2024-12-15T10:30:00Z",
          "helpful": 12
        }
      ],
      "relatedProducts": ["deepz", "shield-up"]
    }
  }
}
\`\`\`

**Response (Error - 404):**
\`\`\`json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Producto no encontrado"
  }
}
\`\`\`

## 4. CATEGORÍAS

### 4.1 Listar Categorías

**Endpoint:** `GET /api/mobile/v1/categories`

**Response (Success - 200):**
\`\`\`json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "relajacion",
        "name": "Relajación",
        "slug": "relajacion",
        "description": "Productos para reducir el estrés",
        "icon": "https://stardustmex.com/icons/relajacion.svg",
        "productCount": 15
      },
      {
        "id": "energia",
        "name": "Energía",
        "slug": "energia",
        "description": "Aumenta tu energía naturalmente",
        "icon": "https://stardustmex.com/icons/energia.svg",
        "productCount": 12
      }
    ]
  }
}
\`\`\`

## 5. CARRITO

**Nota:** El carrito se maneja en el cliente (localmente). Para crear un pedido, se envían los items directamente.

## 6. CHECKOUT Y PAGOS

### 6.1 Crear Sesión de Pago (Stripe)

**Endpoint:** `POST /api/mobile/v1/payments/stripe-session`

**Headers:**
\`\`\`
Authorization: Bearer {token}
Content-Type: application/json
\`\`\`

**Request:**
\`\`\`json
{
  "items": [
    {
      "productId": "calm-core",
      "quantity": 2
    },
    {
      "productId": "deepz",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "address": "Av. Principal 123",
    "city": "Ciudad de México",
    "state": "CDMX",
    "zip": "12345",
    "notes": "Dejar con el portero"
  },
  "customerInfo": {
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "phone": "5551234567"
  }
}
\`\`\`

**Response (Success - 200):**
\`\`\`json
{
  "success": true,
  "data": {
    "sessionId": "stripe_session_id",
    "orderId": "ORD-ABC123",
    "publishableKey": "pk_test_...",
    "environment": "test",
    "amount": 2697,
    "currency": "mxn"
  }
}
\`\`\`

**Uso en Flutter:**
\`\`\`dart
// Usar Stripe Flutter SDK para procesar pago
final result = await Stripe.instance.initPaymentSheet(
  paymentSheetParameters: SetupPaymentSheetParameters(
    merchantDisplayName: 'STARDUST',
    paymentIntentClientSecret: data['sessionId'],
    customerId: data['customerId'],
    style: ThemeMode.dark,
  ),
);

await Stripe.instance.presentPaymentSheet();
\`\`\`

### 6.2 Confirmar Pago

**Endpoint:** `POST /api/mobile/v1/payments/confirm`

**Headers:**
\`\`\`
Authorization: Bearer {token}
\`\`\`

**Request:**
\`\`\`json
{
  "sessionId": "stripe_session_id",
  "orderId": "ORD-ABC123"
}
\`\`\`

**Response (Success - 200):**
\`\`\`json
{
  "success": true,
  "data": {
    "order": {
      "id": "ORD-ABC123",
      "status": "completed",
      "total": 2697,
      "createdAt": "2024-12-20T15:30:00Z"
    }
  }
}
\`\`\`

## 7. PEDIDOS

### 7.1 Historial de Pedidos

**Endpoint:** `GET /api/mobile/v1/orders/history`

**Headers:**
\`\`\`
Authorization: Bearer {token}
\`\`\`

**Query Parameters:**
- `status` (optional): `pending`, `completed`, `shipped`, `delivered`, `cancelled`
- `page` (optional): Número de página
- `limit` (optional): Pedidos por página

**Response (Success - 200):**
\`\`\`json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "ORD-ABC123",
        "orderNumber": "ORD-ABC123",
        "status": "shipped",
        "items": [
          {
            "product": {
              "id": "calm-core",
              "name": "Calm Core",
              "image": "https://..."
            },
            "quantity": 2,
            "price": 899.00
          }
        ],
        "subtotal": 1798.00,
        "tax": 287.68,
        "shipping": 0,
        "total": 2085.68,
        "trackingNumber": "1Z999AA10123456784",
        "trackingUrl": "https://...",
        "createdAt": "2024-12-20T15:30:00Z",
        "estimatedDelivery": "2024-12-25T23:59:59Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "pages": 2
    }
  }
}
\`\`\`

### 7.2 Detalles de Pedido

**Endpoint:** `GET /api/mobile/v1/orders/{orderId}`

**Headers:**
\`\`\`
Authorization: Bearer {token}
\`\`\`

**Response (Success - 200):**
\`\`\`json
{
  "success": true,
  "data": {
    "order": {
      "id": "ORD-ABC123",
      "orderNumber": "ORD-ABC123",
      "status": "shipped",
      "items": [...],
      "shippingAddress": {
        "address": "Av. Principal 123",
        "city": "Ciudad de México",
        "state": "CDMX",
        "zip": "12345"
      },
      "subtotal": 1798.00,
      "tax": 287.68,
      "shipping": 0,
      "total": 2085.68,
      "paymentMethod": {
        "brand": "Visa",
        "last4": "4242"
      },
      "trackingNumber": "1Z999AA10123456784",
      "trackingUrl": "https://...",
      "timeline": [
        {
          "status": "completed",
          "date": "2024-12-20T15:30:00Z",
          "description": "Pedido confirmado"
        },
        {
          "status": "shipped",
          "date": "2024-12-22T10:00:00Z",
          "description": "Pedido enviado"
        }
      ],
      "createdAt": "2024-12-20T15:30:00Z",
      "estimatedDelivery": "2024-12-25T23:59:59Z"
    }
  }
}
\`\`\`

## 8. PERFIL DE USUARIO

### 8.1 Obtener Perfil

**Endpoint:** `GET /api/mobile/v1/profile`

**Headers:**
\`\`\`
Authorization: Bearer {token}
\`\`\`

**Response (Success - 200):**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "cliente@example.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "phone": "5551234567",
      "avatar": "https://...",
      "createdAt": "2024-01-15T10:00:00Z"
    },
    "stats": {
      "totalOrders": 15,
      "totalSpent": 12450.00,
      "averageOrderValue": 830.00
    }
  }
}
\`\`\`

### 8.2 Actualizar Perfil

**Endpoint:** `PUT /api/mobile/v1/profile`

**Headers:**
\`\`\`
Authorization: Bearer {token}
\`\`\`

**Request:**
\`\`\`json
{
  "firstName": "Juan Carlos",
  "lastName": "Pérez García",
  "phone": "5559876543"
}
\`\`\`

**Response (Success - 200):**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "cliente@example.com",
      "firstName": "Juan Carlos",
      "lastName": "Pérez García",
      "phone": "5559876543"
    }
  }
}
\`\`\`

## 9. DIRECCIONES

### 9.1 Listar Direcciones

**Endpoint:** `GET /api/mobile/v1/addresses`

**Headers:**
\`\`\`
Authorization: Bearer {token}
\`\`\`

**Response (Success - 200):**
\`\`\`json
{
  "success": true,
  "data": {
    "addresses": [
      {
        "id": "addr-1",
        "address": "Av. Principal 123",
        "city": "Ciudad de México",
        "state": "CDMX",
        "zip": "12345",
        "isDefault": true
      },
      {
        "id": "addr-2",
        "address": "Calle Secundaria 456",
        "city": "Monterrey",
        "state": "Nuevo León",
        "zip": "67890",
        "isDefault": false
      }
    ]
  }
}
\`\`\`

### 9.2 Agregar Dirección

**Endpoint:** `POST /api/mobile/v1/addresses`

**Headers:**
\`\`\`
Authorization: Bearer {token}
\`\`\`

**Request:**
\`\`\`json
{
  "address": "Calle Nueva 789",
  "city": "Guadalajara",
  "state": "Jalisco",
  "zip": "44100",
  "isDefault": false
}
\`\`\`

**Response (Success - 201):**
\`\`\`json
{
  "success": true,
  "data": {
    "address": {
      "id": "addr-3",
      "address": "Calle Nueva 789",
      "city": "Guadalajara",
      "state": "Jalisco",
      "zip": "44100",
      "isDefault": false
    }
  }
}
\`\`\`

### 9.3 Actualizar Dirección

**Endpoint:** `PUT /api/mobile/v1/addresses/{id}`

### 9.4 Eliminar Dirección

**Endpoint:** `DELETE /api/mobile/v1/addresses/{id}`

## 10. RESEÑAS

### 10.1 Agregar Reseña

**Endpoint:** `POST /api/mobile/v1/reviews`

**Headers:**
\`\`\`
Authorization: Bearer {token}
\`\`\`

**Request:**
\`\`\`json
{
  "productId": "calm-core",
  "rating": 5,
  "comment": "Excelente producto, me ayudó mucho con el estrés"
}
\`\`\`

**Response (Success - 201):**
\`\`\`json
{
  "success": true,
  "data": {
    "review": {
      "id": "review-123",
      "productId": "calm-core",
      "rating": 5,
      "comment": "Excelente producto...",
      "status": "pending",
      "createdAt": "2024-12-20T16:00:00Z"
    }
  }
}
\`\`\`

### 10.2 Marcar Reseña como Útil

**Endpoint:** `POST /api/mobile/v1/reviews/{id}/helpful`

**Headers:**
\`\`\`
Authorization: Bearer {token}
\`\`\`

**Response (Success - 200):**
\`\`\`json
{
  "success": true,
  "data": {
    "helpful": 13
  }
}
\`\`\`

## 11. NOTIFICACIONES

### 11.1 Obtener Notificaciones

**Endpoint:** `GET /api/mobile/v1/notifications`

**Headers:**
\`\`\`
Authorization: Bearer {token}
\`\`\`

**Query Parameters:**
- `unreadOnly` (optional): `true` para solo no leídas
- `page` (optional)
- `limit` (optional)

**Response (Success - 200):**
\`\`\`json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif-1",
        "type": "order_status",
        "title": "Tu pedido ha sido enviado",
        "message": "El pedido ORD-ABC123 está en camino",
        "data": {
          "orderId": "ORD-ABC123"
        },
        "read": false,
        "createdAt": "2024-12-22T10:00:00Z"
      }
    ],
    "unreadCount": 3
  }
}
\`\`\`

### 11.2 Marcar como Leída

**Endpoint:** `PUT /api/mobile/v1/notifications/{id}/read`

### 11.3 Registrar Token de Push

**Endpoint:** `POST /api/mobile/v1/notifications/register-token`

**Headers:**
\`\`\`
Authorization: Bearer {token}
\`\`\`

**Request:**
\`\`\`json
{
  "token": "fcm_token_here",
  "platform": "ios"
}
\`\`\`

## 12. CÓDIGOS DE ERROR

**Códigos Comunes:**

- `400` - Bad Request (datos inválidos)
- `401` - Unauthorized (token inválido/expirado)
- `403` - Forbidden (sin permisos)
- `404` - Not Found (recurso no encontrado)
- `422` - Unprocessable Entity (validación fallida)
- `429` - Too Many Requests (rate limit excedido)
- `500` - Internal Server Error

**Códigos Personalizados:**

\`\`\`json
{
  "EMAIL_EXISTS": "El email ya está registrado",
  "INVALID_CREDENTIALS": "Email o contraseña incorrectos",
  "PRODUCT_NOT_FOUND": "Producto no encontrado",
  "INSUFFICIENT_STOCK": "Stock insuficiente",
  "INVALID_TOKEN": "Token inválido o expirado",
  "ORDER_NOT_FOUND": "Pedido no encontrado",
  "PAYMENT_FAILED": "El pago falló",
  "ADDRESS_NOT_FOUND": "Dirección no encontrada"
}
\`\`\`

## 13. RATE LIMITING

**Límites:**
- Endpoints públicos: 100 requests/minuto
- Endpoints autenticados: 300 requests/minuto
- Endpoints de pago: 10 requests/minuto

**Headers de Respuesta:**
\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
\`\`\`

## 14. WEBHOOKS (PARA APPS)

Si tu app necesita recibir notificaciones en tiempo real, puedes configurar webhooks:

**Eventos Disponibles:**
- `order.created`
- `order.updated`
- `order.shipped`
- `order.delivered`
- `payment.completed`
- `payment.failed`

**Configuración:**
Contactar a soporte técnico para configurar webhook URL de tu backend.

---

# CONFIGURACIÓN Y DEPLOYMENT

## 1. REQUISITOS PREVIOS

### 1.1 Cuentas Necesarias

1. **GitHub Account:**
   - Para control de versiones
   - URL: https://github.com

2. **Vercel Account:**
   - Para hosting y deployment
   - URL: https://vercel.com
   - Conectar con cuenta de GitHub

3. **Supabase Account:**
   - Para base de datos PostgreSQL
   - URL: https://supabase.com

4. **Stripe Account:**
   - Para procesamiento de pagos
   - URL: https://stripe.com

5. **Resend Account (Opcional):**
   - Para envío de emails
   - URL: https://resend.com

### 1.2 Herramientas de Desarrollo

**Instalación Local (Opcional):**
\`\`\`bash
# Node.js 18+ y npm
node --version  # v18.0.0 o superior

# Git
git --version

# Editor de código
# VSCode recomendado
\`\`\`

## 2. CONFIGURACIÓN INICIAL

### 2.1 Crear Proyecto en Supabase

1. Ir a https://supabase.com
2. Click en "New Project"
3. Configurar:
   - Nombre: stardust-production
   - Contraseña de base de datos (guardar en lugar seguro)
   - Región: us-east-1 (o más cercana)
4. Esperar a que el proyecto se cree (2-3 minutos)

### 2.2 Ejecutar Scripts de Base de Datos

1. En Supabase Dashboard → SQL Editor
2. Ejecutar scripts en orden:

\`\`\`sql
-- 001_create_products_table.sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  ...
);

-- 002_create_categories_table.sql
CREATE TABLE categories (...);

-- ... ejecutar todos los scripts hasta 025
\`\`\`

3. Verificar que todas las tablas se crearon correctamente

### 2.3 Obtener Credenciales de Supabase

1. En Supabase Dashboard → Settings → API
2. Copiar:
   - **Project URL:** `https://xxx.supabase.co`
   - **anon public:** `eyJhbG...` (API Key pública)
   - **service_role:** `eyJhbG...` (API Key privada - NUNCA compartir)

### 2.4 Configurar Stripe

**Modo Test:**
1. Ir a https://dashboard.stripe.com
2. Asegurar que estás en "Test mode" (toggle arriba a la derecha)
3. Ir a Developers → API keys
4. Copiar:
   - **Publishable key:** `pk_test_...`
   - **Secret key:** `sk_test_...`

**Webhook Test:**
1. Developers → Webhooks → Add endpoint
2. Endpoint URL: `https://stardustmex.com/api/stripe/webhook`
3. Eventos: `checkout.session.completed`, `checkout.session.expired`
4. Copiar **Signing secret:** `whsec_...`

**Modo Producción (Después de testing):**
1. Cambiar a "Live mode"
2. Repetir pasos anteriores para obtener claves de producción
3. Configurar webhook de producción

## 3. DEPLOYMENT EN VERCEL

### 3.1 Conectar GitHub con Vercel

1. Ir a https://vercel.com
2. Click en "Import Project"
3. Conectar con GitHub
4. Seleccionar repositorio: `v0-stardust-harmony`

### 3.2 Configurar Variables de Entorno

En Vercel Dashboard → Settings → Environment Variables:

\`\`\`env
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# Stripe (Configurables desde admin después)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Vercel Blob (Auto-configurado)
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# App
NEXT_PUBLIC_BASE_URL=https://stardustmex.com
NEXT_PUBLIC_SITE_URL=https://stardustmex.com

# Email (Opcional)
EMAIL_FROM=contacto@stardustmex.com
RESEND_API_KEY=re_...
\`\`\`

**Aplicar a:**
- ✅ Production
- ✅ Preview
- ✅ Development

### 3.3 Configurar Dominio

1. En Vercel Dashboard → Settings → Domains
2. Click en "Add"
3. Ingresar dominio: `stardustmex.com`
4. Vercel proporciona registros DNS:

**En tu proveedor de dominios (ej: GoDaddy, Namecheap):**

Agregar registros:
\`\`\`
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
\`\`\`

5. Esperar propagación de DNS (10 minutos a 48 horas)
6. Verificar en Vercel que el dominio está activo

### 3.4 Deploy

1. En Vercel, click en "Deploy"
2. Esperar proceso de build (3-5 minutos)
3. Verificar que no hay errores
4. Abrir URL de producción: https://stardustmex.com

## 4. POST-DEPLOYMENT

### 4.1 Crear Primer Administrador

**Opción 1: Desde Supabase SQL Editor**
\`\`\`sql
INSERT INTO admin_users (username, email, password_hash, role, active)
VALUES (
  'admin',
  'admin@stardustmex.com',
  crypt('MiPassword123!', gen_salt('bf')),
  'admin',
  true
);
\`\`\`

**Opción 2: Desde página de setup**
1. Ir a https://stardustmex.com/admin/setup
2. Llenar formulario de primer admin
3. Click en "Crear Administrador"

### 4.2 Configurar Stripe desde Admin

1. Login al backoffice: https://stardustmex.com/admin
2. Ir a Configuración → Pagos
3. Configurar modo test con claves de prueba
4. Probar flujo de compra completo
5. Cuando esté listo, configurar modo producción

### 4.3 Cargar Productos Iniciales

**Opción 1: Importar SQL**
\`\`\`sql
-- En Supabase SQL Editor
INSERT INTO products (id, name, slug, price, stock, category, ...) VALUES
  ('calm-core', 'Calm Core', 'calm-core', 899, 100, 'relajacion', ...),
  ('deepz', 'DeepZ', 'deepz', 899, 100, 'sueno', ...),
  ...;
\`\`\`

**Opción 2: Desde Admin UI**
1. Ir a Productos → Nuevo Producto
2. Agregar productos uno por uno

### 4.4 Configurar Email (Opcional)

1. Crear cuenta en https://resend.com
2. Verificar dominio (stardustmex.com)
3. Crear API key
4. Agregar `RESEND_API_KEY` a variables de entorno en Vercel
5. Redeploy

### 4.5 Verificar Funcionalidades

**Checklist de Verificación:**

- [ ] Página de inicio carga correctamente
- [ ] Productos se muestran en catálogo
- [ ] Filtros de productos funcionan
- [ ] Agregar al carrito funciona
- [ ] Checkout carga correctamente
- [ ] Pago con Stripe test funciona
- [ ] Página de confirmación muestra datos correctos
- [ ] Webhook de Stripe recibe eventos
- [ ] Orden se guarda en base de datos
- [ ] Login de cliente funciona
- [ ] Registro de cliente funciona
- [ ] Recuperación de contraseña funciona
- [ ] Login de admin funciona
- [ ] Todas las páginas del admin son accesibles
- [ ] Crear/editar productos funciona
- [ ] Subir imágenes funciona
- [ ] Actualizar estado de pedidos funciona

## 5. MANTENIMIENTO

### 5.1 Actualizar Código

\`\`\`bash
# En tu máquina local o v0
git add .
git commit -m "Descripción de cambios"
git push origin main
\`\`\`

Vercel detecta el push y hace deploy automáticamente.

### 5.2 Backup de Base de Datos

**Automático (Supabase):**
- Backups diarios automáticos (7 días de retención en plan gratuito)

**Manual:**
1. Supabase Dashboard → Database → Backups
2. Click en "Create Backup"
3. Descargar archivo .sql

### 5.3 Monitoreo

**Vercel Analytics:**
- Dashboard → Analytics
- Ver tráfico, errores, performance

**Stripe Dashboard:**
- Ver pagos, reembolsos, disputas
- Monitorear webhooks

**Supabase Logs:**
- Ver queries, errores de BD
- Monitorear uso de recursos

### 5.4 Actualizaciones de Seguridad

**Dependencias:**
\`\`\`bash
# Actualizar dependencias
npm update

# Verificar vulnerabilidades
npm audit

# Aplicar fixes automáticos
npm audit fix
\`\`\`

**Base de Datos:**
- Supabase se actualiza automáticamente
- Revisar changelog regularmente

## 6. TROUBLESHOOTING DE DEPLOYMENT

### 6.1 Error: "Build Failed"

**Posibles causas:**
- Error de sintaxis en código
- Dependencia faltante
- Variable de entorno no configurada

**Solución:**
1. Ver logs de build en Vercel
2. Identificar línea del error
3. Corregir código
4. Hacer nuevo deploy

### 6.2 Error: "Database Connection Failed"

**Posibles causas:**
- Credenciales incorrectas de Supabase
- IP bloqueada en Supabase

**Solución:**
1. Verificar variables de entorno
2. En Supabase → Settings → Database → Connection pooling
3. Asegurar que "Allow all IPs" está habilitado

### 6.3 Error: "Stripe Webhook Not Working"

**Posibles causas:**
- URL de webhook incorrecta
- Webhook secret incorrecto
- Endpoint no está recibiendo requests

**Solución:**
1. Verificar URL en Stripe Dashboard
2. Verificar `STRIPE_WEBHOOK_SECRET`
3. Ver logs del webhook en Stripe Dashboard
4. Ver logs en Vercel

### 6.4 Error: "Images Not Loading"

**Posibles causas:**
- Blob storage no configurado
- URL de imagen incorrecta

**Solución:**
1. Verificar `BLOB_READ_WRITE_TOKEN`
2. Verificar que las imágenes se subieron correctamente
3. Ver logs de Vercel Blob

## 7. OPTIMIZACIÓN DE PERFORMANCE

### 7.1 CDN y Caching

**Vercel Edge Network:**
- CDN global automático
- Caching inteligente

**Configuración de Cache:**
\`\`\`typescript
// next.config.mjs
export default {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, must-revalidate',
        },
      ],
    },
  ],
}
\`\`\`

### 7.2 Database Performance

**Índices en Supabase:**
\`\`\`sql
-- Agregar índices para queries frecuentes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
\`\`\`

**Connection Pooling:**
- Habilitado por defecto en Supabase
- Máximo 15 conexiones en plan gratuito

### 7.3 Monitoring y Alerts

**Configurar Alerts en Vercel:**
1. Settings → Alerts
2. Configurar:
   - Error rate threshold (ej: >5%)
   - Response time threshold (ej: >2s)
3. Agregar email para notificaciones

---

# CONCLUSIÓN

Este manual completo cubre todos los aspectos del sistema STARDUST, desde la arquitectura técnica hasta el uso diario por clientes y administradores. Para soporte adicional o preguntas específicas, contactar a:

**Soporte Técnico:**
- Email: soporte@stardustmex.com
- Teléfono: (555) 123-4567

**Documentación Adicional:**
- GitHub: https://github.com/mjperez2704/v0-stardust-harmony
- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs
- Next.js Docs: https://nextjs.org/docs

---

**Versión del Documento:** 2.0  
**Última Actualización:** Diciembre 2024  
**Autor:** Equipo de Desarrollo STARDUST
