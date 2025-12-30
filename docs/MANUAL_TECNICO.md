# Manual Técnico - STARDUST Ecommerce

## Índice
1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Base de Datos](#base-de-datos)
5. [Autenticación y Seguridad](#autenticación-y-seguridad)
6. [APIs y Endpoints](#apis-y-endpoints)
7. [Configuración](#configuración)
8. [Deployment](#deployment)
9. [Mantenimiento](#mantenimiento)

---

## Arquitectura del Sistema

### Arquitectura General
STARDUST es una aplicación de ecommerce full-stack construida con Next.js 16 y Supabase como backend.

\`\`\`
┌─────────────────────────────────────────────────────┐
│                   FRONTEND                          │
│              Next.js 16 App Router                  │
│         React 19.2 + TypeScript + Tailwind         │
└─────────────────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────┐
│                  MIDDLEWARE                         │
│        Autenticación + Protección de Rutas         │
└─────────────────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────┐
│                   BACKEND                           │
│           Supabase (PostgreSQL + Auth)             │
│         Row Level Security (RLS) Policies          │
└─────────────────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────┐
│              INTEGRACIONES EXTERNAS                 │
│    Stripe/PayPal | SMTP | SMS | Push Notifications │
└─────────────────────────────────────────────────────┘
\`\`\`

### Flujo de Datos

**Frontend (Cliente)**
- Componentes React renderizados del lado del cliente y servidor
- Estado global: Context API para carrito de compras
- Comunicación con backend a través de Supabase Client SDK

**Backend (Supabase)**
- PostgreSQL como base de datos principal
- Supabase Auth para autenticación
- Row Level Security (RLS) para protección de datos
- API REST auto-generada por Supabase

---

## Tecnologías Utilizadas

### Frontend
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| Next.js | 16.x | Framework React full-stack |
| React | 19.2 | Librería UI |
| TypeScript | 5.x | Tipado estático |
| Tailwind CSS | 4.x | Estilos y diseño |
| shadcn/ui | Latest | Componentes UI |
| Recharts | Latest | Gráficos y estadísticas |

### Backend
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| Supabase | Latest | Backend as a Service |
| PostgreSQL | 15.x | Base de datos relacional |
| Supabase Auth | Latest | Autenticación de usuarios |

### Integraciones
- **Stripe**: Procesamiento de pagos
- **SMTP**: Envío de emails transaccionales
- **Twilio/similar**: SMS notifications
- **Firebase/OneSignal**: Push notifications

---

## Estructura del Proyecto

\`\`\`
stardust_ecommerce/
├── app/                          # App Router de Next.js
│   ├── (routes)/                # Rutas públicas
│   │   ├── page.tsx            # Homepage
│   │   ├── productos/          # Catálogo de productos
│   │   ├── checkout/           # Proceso de pago
│   │   ├── cuenta/             # Cuenta de usuario
│   │   ├── contacto/           # Contacto
│   │   ├── envios-devoluciones/
│   │   └── confirmacion/       # Confirmación de pedido
│   │
│   ├── admin/                   # Backoffice (protegido)
│   │   ├── layout.tsx          # Layout con sidebar
│   │   ├── login/              # Login de administradores
│   │   ├── setup/              # Setup inicial
│   │   ├── page.tsx            # Dashboard
│   │   ├── productos/          # Gestión de productos
│   │   ├── pedidos/            # Gestión de pedidos
│   │   ├── clientes/           # Gestión de clientes
│   │   ├── resenas/            # Gestión de reseñas
│   │   ├── newsletter/         # Suscriptores newsletter
│   │   ├── zonas-entrega/      # Zonas de entrega
│   │   ├── proveedores/        # Proveedores
│   │   ├── banners/            # Banners promocionales
│   │   ├── usuarios-admin/     # Usuarios administradores
│   │   └── configuracion/      # Configuraciones
│   │       ├── general/
│   │       ├── pagos/
│   │       ├── email/
│   │       ├── redes-sociales/
│   │       ├── notificaciones/
│   │       └── app-movil/
│   │
│   ├── api/                     # API Routes
│   │   └── admin/
│   │       └── products/
│   │
│   ├── layout.tsx              # Layout raíz
│   └── globals.css             # Estilos globales
│
├── components/                  # Componentes React
│   ├── ui/                     # Componentes shadcn/ui
│   ├── admin/                  # Componentes del backoffice
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── hero-section.tsx
│   ├── product-card.tsx
│   ├── product-details.tsx
│   ├── product-reviews.tsx
│   ├── cart-drawer.tsx
│   └── ...
│
├── lib/                         # Utilidades y lógica
│   ├── database.ts             # Clase Database (wrapper Supabase)
│   ├── payment-service.ts      # Servicio de pagos
│   ├── cart-context.tsx        # Context del carrito
│   ├── utils.ts                # Funciones helper
│   └── supabase/               # Clientes Supabase
│       ├── client.ts           # Cliente browser
│       ├── server.ts           # Cliente servidor
│       └── middleware.ts       # Middleware Supabase
│
├── scripts/                     # Scripts SQL para Supabase
│   ├── 001_create_products_table.sql
│   ├── 002_create_orders_table.sql
│   ├── 003_create_reviews_table.sql
│   ├── 004_create_newsletter_table.sql
│   ├── 005_seed_products.sql
│   ├── 006_create_settings_tables.sql
│   ├── 007_create_delivery_zones_table.sql
│   ├── 008_create_suppliers_table.sql
│   ├── 009_create_banners_table.sql
│   ├── 010_create_customers_table.sql
│   ├── 011_create_site_settings_table.sql
│   ├── 012_create_admin_users_table.sql
│   └── 013_create_first_admin.sql
│
├── docs/                        # Documentación
│   ├── MANUAL_TECNICO.md
│   ├── MANUAL_USUARIO_CLIENTE.md
│   └── MANUAL_USUARIO_ADMIN.md
│
├── middleware.ts                # Middleware de Next.js
├── next.config.mjs             # Configuración de Next.js
├── package.json                # Dependencias
└── tsconfig.json               # Configuración TypeScript
\`\`\`

---

## Base de Datos

### Esquema de Base de Datos

#### Tabla: `products`
Almacena el catálogo de productos del ecommerce.

\`\`\`sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  benefits TEXT[], -- Array de beneficios
  ingredients TEXT[],
  how_to_use TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

#### Tabla: `orders`
Registra todos los pedidos realizados.

\`\`\`sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL, -- Array de productos
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

#### Tabla: `reviews`
Reseñas y calificaciones de productos.

\`\`\`sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  helpful_count INTEGER DEFAULT 0,
  verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

#### Tabla: `newsletter_subscribers`
Suscriptores al newsletter.

\`\`\`sql
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);
\`\`\`

#### Tabla: `admin_users`
Usuarios administradores del backoffice.

\`\`\`sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);
\`\`\`

#### Tabla: `customers`
Clientes registrados del ecommerce.

\`\`\`sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address JSONB,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  last_order_date TIMESTAMP,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

#### Tablas de Configuración
- `site_settings`: Configuraciones generales del sitio
- `payment_settings`: Configuraciones de pasarelas de pago
- `email_settings`: Configuración SMTP
- `social_settings`: Redes sociales
- `notification_settings`: Notificaciones push/SMS
- `delivery_zones`: Zonas de entrega con costos
- `suppliers`: Proveedores
- `banners`: Banners promocionales

### Row Level Security (RLS)

Todas las tablas tienen políticas RLS habilitadas:

**Productos (lectura pública, escritura solo admin)**
\`\`\`sql
-- Permitir lectura a todos
CREATE POLICY "Enable read access for all users" 
ON products FOR SELECT USING (true);

-- Solo admins pueden insertar/actualizar/eliminar
CREATE POLICY "Enable insert for authenticated admin users only" 
ON products FOR INSERT WITH CHECK (auth.uid() IN (
  SELECT user_id FROM admin_users WHERE is_active = true
));
\`\`\`

**Pedidos (usuarios solo ven los suyos)**
\`\`\`sql
CREATE POLICY "Users can view their own orders" 
ON orders FOR SELECT USING (customer_email = auth.jwt()->>'email');
\`\`\`

**Admin Users (solo super admins)**
\`\`\`sql
CREATE POLICY "Only super admins can manage admin users" 
ON admin_users FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin' 
    AND is_active = true
  )
);
\`\`\`

---

## Autenticación y Seguridad

### Sistema de Autenticación

**Para Clientes (Frontend)**
- No requiere autenticación para navegar
- Pueden comprar como "guest users"
- Opcional: registro para historial de pedidos

**Para Administradores (Backoffice)**
- Autenticación obligatoria con Supabase Auth
- Email + password
- Roles: super_admin, admin, editor, moderador

### Middleware de Protección

Archivo: `middleware.ts`

\`\`\`typescript
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Permitir acceso libre a login y setup
  if (pathname === '/admin/login' || pathname === '/admin/setup') {
    return NextResponse.next();
  }
  
  // Proteger todas las rutas /admin/*
  if (pathname.startsWith('/admin')) {
    const supabase = createServerClient(/* ... */);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    // Verificar que sea admin activo
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();
    
    if (!adminUser) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}
\`\`\`

### Seguridad de APIs

**API Routes protegidas**
\`\`\`typescript
// app/api/admin/products/route.ts
export async function POST(request: Request) {
  const supabase = createServerClient(/* ... */);
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Verificar rol de admin
  const isAdmin = await checkAdminRole(user.id);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Continuar con la lógica...
}
\`\`\`

### Variables de Entorno

Archivo `.env.local`:

\`\`\`bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (opcional)
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Email SMTP (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-password

# Notificaciones (opcional)
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
FIREBASE_SERVER_KEY=xxx
\`\`\`

---

## APIs y Endpoints

### API Routes de Next.js

#### Productos

**GET /api/admin/products**
- Descripción: Obtener todos los productos
- Autenticación: Requerida (Admin)
- Respuesta: Array de productos

**POST /api/admin/products**
- Descripción: Crear nuevo producto
- Autenticación: Requerida (Admin)
- Body:
\`\`\`json
{
  "name": "Producto",
  "price": 299.99,
  "category": "Adaptógenos",
  "stock": 100,
  "description": "...",
  "image_url": "...",
  "benefits": ["beneficio1", "beneficio2"]
}
\`\`\`

**PUT /api/admin/products/[id]**
- Descripción: Actualizar producto
- Autenticación: Requerida (Admin)

**DELETE /api/admin/products/[id]**
- Descripción: Eliminar producto
- Autenticación: Requerida (Admin)

### API de Supabase (Auto-generada)

Supabase genera automáticamente una REST API para todas las tablas:

\`\`\`javascript
// Obtener productos
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('is_active', true);

// Crear pedido
const { data, error } = await supabase
  .from('orders')
  .insert({
    order_number: 'ORD-001',
    customer_email: 'cliente@email.com',
    total: 599.99,
    items: [{ product_id: 'xxx', quantity: 2 }]
  });

// Actualizar stock
const { data, error } = await supabase
  .from('products')
  .update({ stock: 50 })
  .eq('id', 'product-id');
\`\`\`

---

## Configuración

### Configuración Inicial

1. **Clonar repositorio**
\`\`\`bash
git clone https://github.com/tu-usuario/stardust-ecommerce.git
cd stardust-ecommerce
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
npm install
\`\`\`

3. **Configurar Supabase**
   - Crear proyecto en supabase.com
   - Copiar URL y Anon Key
   - Crear archivo `.env.local` con las credenciales

4. **Ejecutar scripts SQL**
   - Ir a SQL Editor en Supabase
   - Ejecutar scripts en orden (001 a 013)

5. **Crear primer usuario admin**
   - Ir a `/admin/setup`
   - Completar formulario de registro

6. **Iniciar servidor de desarrollo**
\`\`\`bash
npm run dev
\`\`\`

### Configuración de Integraciones

#### Stripe
1. Crear cuenta en stripe.com
2. Obtener API keys (test y live)
3. Agregar a `.env.local`
4. Configurar webhooks en Stripe Dashboard

#### SMTP (Email)
1. Configurar cuenta SMTP (Gmail, SendGrid, etc.)
2. Agregar credenciales en `/admin/configuracion/email`
3. Probar envío de emails

#### SMS (Twilio)
1. Crear cuenta en twilio.com
2. Obtener Account SID y Auth Token
3. Configurar en `/admin/configuracion/notificaciones`

---

## Deployment

### Deploy en Vercel (Recomendado)

1. **Conectar repositorio**
   - Crear cuenta en vercel.com
   - Importar repositorio de GitHub

2. **Configurar variables de entorno**
   - En Vercel Dashboard → Settings → Environment Variables
   - Agregar todas las variables de `.env.local`

3. **Deploy**
   - Vercel hace deploy automático en cada push a main
   - URL: `https://tu-proyecto.vercel.app`

4. **Conectar dominio personalizado**
   - En Vercel Dashboard → Domains
   - Agregar dominio y configurar DNS

### Deploy Manual

\`\`\`bash
# Build de producción
npm run build

# Iniciar servidor
npm run start
\`\`\`

### Checklist de Deployment

- [ ] Variables de entorno configuradas
- [ ] Scripts SQL ejecutados en Supabase
- [ ] Primer usuario admin creado
- [ ] Productos seedeados
- [ ] Stripe configurado (si aplica)
- [ ] Email SMTP configurado
- [ ] Dominio configurado
- [ ] SSL/HTTPS habilitado
- [ ] Políticas RLS verificadas
- [ ] Backups configurados

---

## Mantenimiento

### Backups de Base de Datos

**Supabase automático**
- Supabase hace backups diarios automáticos
- Retención: 7 días (plan free), 30 días (plan pro)

**Backup manual**
\`\`\`bash
# Exportar toda la base de datos
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql

# Restaurar backup
psql -h db.xxx.supabase.co -U postgres -d postgres < backup.sql
\`\`\`

### Monitoreo

**Métricas a monitorear:**
- Errores de autenticación
- Tiempos de respuesta de API
- Uso de base de datos
- Stock de productos
- Pedidos pendientes
- Tasa de conversión

**Herramientas:**
- Vercel Analytics (incluido)
- Supabase Dashboard (métricas DB)
- Sentry (tracking de errores - opcional)

### Actualizaciones

**Dependencias**
\`\`\`bash
# Verificar actualizaciones
npm outdated

# Actualizar dependencias
npm update

# Actualizar Next.js
npm install next@latest react@latest react-dom@latest
\`\`\`

**Supabase**
- Supabase se actualiza automáticamente
- Revisar changelog: supabase.com/changelog

### Logs y Debugging

**Ver logs en producción (Vercel)**
\`\`\`bash
vercel logs
\`\`\`

**Debugging en desarrollo**
- Usar console.log("[v0] ...")
- DevTools de React
- Network tab para APIs

### Tareas de Mantenimiento Rutinarias

**Diaria**
- Revisar nuevos pedidos
- Verificar stock bajo
- Revisar reseñas pendientes

**Semanal**
- Analizar ventas
- Revisar clientes nuevos
- Actualizar banners promocionales

**Mensual**
- Backup manual de DB
- Revisar métricas de rendimiento
- Actualizar dependencias
- Revisar y responder reseñas

---

## Solución de Problemas Comunes

### Error: "Database error querying schema"
**Causa**: Usuario no existe en auth.users
**Solución**: Crear usuario en `/admin/setup`

### Error: "Row Level Security policy violation"
**Causa**: Usuario sin permisos
**Solución**: Verificar políticas RLS y rol de usuario

### Error: "CORS error"
**Causa**: Configuración incorrecta de Supabase
**Solución**: Verificar URL permitidas en Supabase Dashboard

### Productos no aparecen
**Causa**: is_active = false o no ejecutó seed
**Solución**: Ejecutar script 005_seed_products.sql

### No se pueden subir imágenes
**Causa**: Bucket no configurado en Supabase Storage
**Solución**: Crear bucket "product-images" en Storage

---

## Contacto y Soporte

Para soporte técnico:
- Email: soporte@stardust.com
- Documentación: /docs
- GitHub Issues: github.com/usuario/stardust/issues

---

**Versión:** 1.0.0  
**Última actualización:** Enero 2025  
**Autor:** Equipo STARDUST
