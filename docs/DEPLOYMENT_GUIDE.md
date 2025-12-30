# 📦 GUÍA COMPLETA DE DESPLIEGUE - STARDUST E-COMMERCE

## Versión 1.0 | Última actualización: Diciembre 2024

---

## 📋 TABLA DE CONTENIDOS

1. [Requisitos del Sistema](#requisitos-del-sistema)
2. [Pre-requisitos y Servicios Externos](#pre-requisitos-y-servicios-externos)
3. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
4. [Configuración de Supabase](#configuración-de-supabase)
5. [Despliegue en Vercel](#despliegue-en-vercel)
6. [Configuración de Dominio Personalizado](#configuración-de-dominio-personalizado)
7. [Configuración de Servicios de Terceros](#configuración-de-servicios-de-terceros)
8. [Checklist Pre-Deployment](#checklist-pre-deployment)
9. [Verificación Post-Deployment](#verificación-post-deployment)
10. [Monitoreo y Mantenimiento](#monitoreo-y-mantenimiento)
11. [Troubleshooting](#troubleshooting)
12. [Rollback y Backups](#rollback-y-backups)

---

## 🖥️ REQUISITOS DEL SISTEMA

### Requisitos Mínimos del Host

#### Plataforma Recomendada: Vercel
STARDUST está optimizado para Vercel, pero puede desplegarse en cualquier plataforma que soporte Next.js 16+.

**Especificaciones mínimas:**
- Node.js: v20.x o superior
- RAM: 512 MB mínimo
- Storage: 1 GB mínimo
- Bandwidth: Ilimitado recomendado
- Regiones: Multi-región para mejor latencia

#### Alternativas de Hosting
Si no usas Vercel, estas plataformas son compatibles:
- Netlify
- AWS Amplify
- Railway
- Render
- Fly.io
- Self-hosted con Node.js + PM2

### Stack Tecnológico
\`\`\`
Frontend:
- Next.js 16.0.0 (App Router)
- React 19.2.0
- TypeScript 5.x
- Tailwind CSS 4.1.9

Backend:
- Next.js API Routes
- Supabase (PostgreSQL 15+)

Servicios Externos:
- Supabase (Database + Auth)
- Vercel Blob (File Storage)
- Resend (Email Service)
- Stripe (Payments) - Opcional
- MercadoPago (Payments Latam) - Opcional
\`\`\`

---

## 🔧 PRE-REQUISITOS Y SERVICIOS EXTERNOS

### 1. Cuenta de Vercel
**¿Por qué?** Hosting optimizado para Next.js con deploy automático

**Pasos:**
1. Crear cuenta en https://vercel.com
2. Conectar con GitHub/GitLab/Bitbucket
3. Plan gratuito es suficiente para empezar

**Límites del plan gratuito:**
- 100 GB bandwidth/mes
- 6,000 minutos de build/mes
- 1 proyecto comercial

---

### 2. Supabase (REQUERIDO)
**¿Por qué?** Base de datos PostgreSQL + Autenticación + Storage

**Setup:**

#### A. Crear Proyecto Supabase
1. Ir a https://supabase.com
2. Click en "New Project"
3. Configuración:
   \`\`\`
   Name: stardust-production
   Database Password: [CONTRASEÑA SEGURA - GUÁRDALA]
   Region: South America (sao) [o más cercana a tus usuarios]
   Pricing Plan: Free (puede escalarse después)
   \`\`\`

#### B. Configurar Base de Datos
1. Ir a SQL Editor en el dashboard de Supabase
2. Ejecutar los scripts en orden:
   \`\`\`
   001_create_products_table.sql
   002_create_orders_table.sql
   003_create_reviews_table.sql
   ... [todos los scripts hasta el 021]
   \`\`\`

**IMPORTANTE:** Ejecutar scripts en orden numérico

#### C. Configurar Autenticación
1. Ir a Authentication > Providers
2. Configurar Email Provider:
   \`\`\`
   Enable Email provider: ✓
   Confirm email: ✓
   Secure email change: ✓
   \`\`\`

3. Configurar Email Templates:
   - Ir a Authentication > Email Templates
   - Personalizar templates de confirmación y recuperación

4. Configurar URLs:
   \`\`\`
   Site URL: https://tu-dominio.com
   Redirect URLs: 
     - https://tu-dominio.com/auth/callback
     - https://tu-dominio.com/cuenta
     - http://localhost:3000/auth/callback (para desarrollo)
   \`\`\`

#### D. Configurar RLS (Row Level Security)
Todos los scripts de políticas RLS ya están incluidos en los archivos SQL.
Verificar que todas las políticas estén activas:

1. Ir a Authentication > Policies
2. Verificar que existan políticas para:
   - products (lectura pública)
   - orders (lectura/escritura autenticada)
   - reviews (lectura pública, escritura autenticada)
   - users (lectura/escritura propia)
   - editable_content (lectura pública, escritura autenticada)

#### E. Obtener Credenciales
1. Ir a Project Settings > API
2. Copiar y guardar:
   \`\`\`
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   JWT Secret: [guardar para configuración]
   \`\`\`

3. Ir a Project Settings > Database
4. Copiar Connection String:
   \`\`\`
   URI: postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
   \`\`\`

---

### 3. Resend (Email Service) - REQUERIDO
**¿Por qué?** Envío de emails transaccionales (confirmaciones, bienvenida)

**Setup:**

1. Crear cuenta en https://resend.com
2. Verificar dominio de email:
   \`\`\`
   Domain: tu-dominio.com
   \`\`\`

3. Agregar registros DNS:
   \`\`\`
   Type: TXT
   Name: _resend
   Value: [proporcionado por Resend]
   
   Type: CNAME
   Name: resend._domainkey
   Value: [proporcionado por Resend]
   \`\`\`

4. Obtener API Key:
   - Ir a API Keys
   - Click "Create API Key"
   - Nombre: "Production"
   - Permisos: "Sending access"
   - Copiar key: `re_xxxxxxxxxxxxx`

**Configuración de Remitente:**
\`\`\`
From Name: STARDUST
From Email: no-reply@tu-dominio.com
Reply-To: soporte@tu-dominio.com
\`\`\`

---

### 4. Vercel Blob (File Storage) - REQUERIDO
**¿Por qué?** Almacenamiento de imágenes de productos, avatares

**Setup:**

1. En tu proyecto de Vercel:
   - Ir a Storage
   - Click "Create Database"
   - Seleccionar "Blob"
   - Click "Create"

2. El token se genera automáticamente:
   \`\`\`
   BLOB_READ_WRITE_TOKEN: vercel_blob_rw_xxxxx
   \`\`\`

**Nota:** Si despliegas fuera de Vercel, puedes usar:
- Cloudinary
- AWS S3
- Supabase Storage (alternativa)

---

### 5. Stripe (Payments) - OPCIONAL
**¿Por qué?** Procesamiento de pagos con tarjeta (internacional)

**Setup:**

1. Crear cuenta en https://stripe.com
2. Activar cuenta (requiere verificación de negocio)
3. Obtener keys:

**Modo Test (desarrollo):**
\`\`\`
Publishable key: pk_test_xxxxx
Secret key: sk_test_xxxxx
\`\`\`

**Modo Live (producción):**
\`\`\`
Publishable key: pk_live_xxxxx
Secret key: sk_live_xxxxx
Webhook secret: whsec_xxxxx
\`\`\`

4. Configurar Webhook:
   - Ir a Developers > Webhooks
   - Click "Add endpoint"
   - URL: `https://tu-dominio.com/api/stripe/webhook`
   - Eventos a escuchar:
     \`\`\`
     payment_intent.succeeded
     payment_intent.payment_failed
     checkout.session.completed
     \`\`\`

---

### 6. MercadoPago (Payments Latam) - OPCIONAL
**¿Por qué?** Procesamiento de pagos para Latinoamérica

**Setup:**

1. Crear cuenta en https://mercadopago.com
2. Ir a Tus integraciones > Credenciales
3. Obtener:
   \`\`\`
   Public Key: APP_USR-xxxxx
   Access Token: APP_USR-xxxxx
   \`\`\`

4. Configurar Webhook:
   - URL: `https://tu-dominio.com/api/mobile/v1/mercadopago/webhook`
   - Tópicos:
     \`\`\`
     payment
     merchant_order
     \`\`\`

---

## 🔑 CONFIGURACIÓN DE VARIABLES DE ENTORNO

### Variables Requeridas

Crear archivo `.env.local` (desarrollo) o configurar en Vercel (producción):

\`\`\`bash
# ==============================================
# SUPABASE - REQUERIDO
# ==============================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your-jwt-secret

# Database Connection Strings (auto-generadas por Vercel si usas Postgres)
POSTGRES_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
POSTGRES_PRISMA_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true
POSTGRES_URL_NON_POOLING=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password
POSTGRES_HOST=db.xxxxx.supabase.co
POSTGRES_DATABASE=postgres

# ==============================================
# VERCEL BLOB - REQUERIDO
# ==============================================
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxx

# ==============================================
# RESEND (EMAIL) - REQUERIDO
# ==============================================
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=STARDUST <no-reply@tu-dominio.com>

# ==============================================
# SITE CONFIGURATION - REQUERIDO
# ==============================================
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
NEXT_PUBLIC_SITE_NAME=STARDUST

# Development only (para auth callback en local)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback

# ==============================================
# STRIPE - OPCIONAL (si usas Stripe)
# ==============================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# ==============================================
# MERCADOPAGO - OPCIONAL (si usas MercadoPago)
# ==============================================
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxx
# Nota: La public key de MercadoPago se obtiene del dashboard y se configura en el código

# ==============================================
# WHATSAPP - OPCIONAL (para notificaciones)
# ==============================================
WHATSAPP_ACCESS_TOKEN=your-whatsapp-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id

# ==============================================
# ANALYTICS - OPCIONAL
# ==============================================
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=xxxxxxxxxxxxx
\`\`\`

### Descripción Detallada de Variables

#### Variables Públicas (NEXT_PUBLIC_*)
Estas variables son accesibles en el cliente (navegador):

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Key pública de Supabase | `eyJhbGci...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Key pública de Stripe | `pk_live_xxx` |
| `NEXT_PUBLIC_SITE_URL` | URL completa del sitio | `https://stardustharmony.com` |
| `NEXT_PUBLIC_SITE_NAME` | Nombre del sitio | `STARDUST` |

#### Variables Privadas (Solo servidor)
Estas variables NUNCA se exponen al cliente:

| Variable | Descripción | Sensibilidad |
|----------|-------------|--------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Key con permisos admin | 🔴 CRÍTICA |
| `STRIPE_SECRET_KEY` | Key secreta de Stripe | 🔴 CRÍTICA |
| `RESEND_API_KEY` | API key de Resend | 🔴 CRÍTICA |
| `POSTGRES_PASSWORD` | Contraseña de DB | 🔴 CRÍTICA |

---

## 🚀 DESPLIEGUE EN VERCEL

### Método 1: Deploy desde GitHub (Recomendado)

#### Paso 1: Preparar Repositorio
\`\`\`bash
# Inicializar git si no lo has hecho
git init

# Agregar archivos
git add .
git commit -m "Initial commit - STARDUST E-commerce"

# Crear repositorio en GitHub
# Luego conectar:
git remote add origin https://github.com/tu-usuario/stardust-ecommerce.git
git branch -M main
git push -u origin main
\`\`\`

#### Paso 2: Conectar con Vercel
1. Ir a https://vercel.com/new
2. Click "Import Git Repository"
3. Seleccionar tu repositorio de GitHub
4. Configuración del proyecto:
   \`\`\`
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   \`\`\`

#### Paso 3: Configurar Variables de Entorno
1. En la sección "Environment Variables"
2. Agregar TODAS las variables del archivo `.env.local`
3. Seleccionar environments:
   - Production ✓
   - Preview ✓
   - Development ✓

#### Paso 4: Deploy
1. Click "Deploy"
2. Esperar 3-5 minutos
3. ¡Listo! Tu sitio está en `https://stardust-ecommerce.vercel.app`

---

### Método 2: Deploy con Vercel CLI

\`\`\`bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (primera vez)
vercel

# Seguir prompts:
# Set up and deploy? Yes
# Which scope? [tu cuenta]
# Link to existing project? No
# Project name: stardust-ecommerce
# Directory: ./
# Override settings? No

# Deploy a producción
vercel --prod
\`\`\`

---

### Método 3: Deploy Manual (ZIP)

1. Comprimir el proyecto (sin node_modules)
2. Ir a Vercel Dashboard
3. Click "Add New..." > "Project"
4. Arrastrar ZIP
5. Configurar variables de entorno
6. Deploy

---

## 🌐 CONFIGURACIÓN DE DOMINIO PERSONALIZADO

### Paso 1: Configurar en Vercel

1. Ir a tu proyecto en Vercel
2. Settings > Domains
3. Add domain: `tu-dominio.com`
4. También agregar: `www.tu-dominio.com`

### Paso 2: Configurar DNS

En tu proveedor de dominio (GoDaddy, Namecheap, etc.):

#### Opción A: Usar Nameservers de Vercel (Recomendado)
\`\`\`
Nameservers:
- ns1.vercel-dns.com
- ns2.vercel-dns.com
\`\`\`

#### Opción B: Configurar Records manualmente
\`\`\`
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
\`\`\`

### Paso 3: Configurar HTTPS

Vercel configura SSL automáticamente con Let's Encrypt.
Esperar 24-48 horas para propagación completa.

### Paso 4: Actualizar Variables de Entorno

\`\`\`bash
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
\`\`\`

Redeploy después de cambiar variables.

---

## ⚙️ CONFIGURACIÓN DE SERVICIOS DE TERCEROS

### Google Analytics 4 (Opcional)

1. Crear propiedad en https://analytics.google.com
2. Obtener Measurement ID: `G-XXXXXXXXXX`
3. Agregar a variables:
   \`\`\`
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   \`\`\`

4. El código ya está integrado en `app/layout.tsx`

---

### Facebook Pixel (Opcional)

1. Crear Pixel en Facebook Business Manager
2. Obtener Pixel ID
3. Agregar variable:
   \`\`\`
   NEXT_PUBLIC_FB_PIXEL_ID=xxxxxxxxxxxxx
   \`\`\`

---

### WhatsApp Business API (Opcional)

Para notificaciones por WhatsApp:

1. Configurar WhatsApp Business API
2. Obtener:
   \`\`\`
   WHATSAPP_ACCESS_TOKEN=xxx
   WHATSAPP_PHONE_NUMBER_ID=xxx
   \`\`\`

---

## ✅ CHECKLIST PRE-DEPLOYMENT

### Base de Datos
- [ ] Todos los scripts SQL ejecutados (001-021)
- [ ] Políticas RLS configuradas y verificadas
- [ ] Datos iniciales cargados (productos, configuración)
- [ ] Backup de base de datos creado
- [ ] Usuario administrador creado

### Autenticación
- [ ] Email provider configurado en Supabase
- [ ] URLs de redirect correctas
- [ ] Templates de email personalizados
- [ ] Confirmación de email habilitada

### Servicios Externos
- [ ] Resend: Dominio verificado y API key configurada
- [ ] Vercel Blob: Storage configurado
- [ ] Stripe: Cuenta activada y keys de producción (si aplica)
- [ ] MercadoPago: Credenciales de producción (si aplica)

### Variables de Entorno
- [ ] Todas las variables REQUERIDAS configuradas
- [ ] Variables públicas (NEXT_PUBLIC_*) correctas
- [ ] Variables privadas seguras y no expuestas
- [ ] NEXT_PUBLIC_SITE_URL apunta al dominio correcto

### Configuración de Proyecto
- [ ] next.config.mjs revisado
- [ ] Dominio personalizado configurado
- [ ] SSL/HTTPS funcionando
- [ ] DNS propagado (verificar con https://dnschecker.org)

### Contenido
- [ ] Script 017 ejecutado (contenido legal)
- [ ] Todos los documentos legales visibles
- [ ] Términos y condiciones completos
- [ ] Políticas de privacidad completas

### Testing Pre-Launch
- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] Catálogo de productos carga correctamente
- [ ] Carrito de compras funciona
- [ ] Checkout completo funciona (hasta antes del pago)
- [ ] Emails de confirmación se envían
- [ ] Panel de administración accesible
- [ ] Gestión de productos funciona
- [ ] Gestión de pedidos funciona

---

## 🔍 VERIFICACIÓN POST-DEPLOYMENT

### Tests Básicos (30 minutos)

#### 1. Test de Navegación
\`\`\`
✓ Página principal carga correctamente
✓ Todas las secciones visibles
✓ Imágenes cargan
✓ Links del footer funcionan
✓ Navbar responsive funciona
\`\`\`

#### 2. Test de Productos
\`\`\`
✓ Catálogo muestra productos
✓ Filtros funcionan
✓ Búsqueda funciona
✓ Detalle de producto carga
✓ Galería de imágenes funciona
✓ Reseñas se muestran
\`\`\`

#### 3. Test de Autenticación
\`\`\`
✓ Registro de usuario funciona
✓ Email de confirmación llega
✓ Login funciona
✓ Logout funciona
✓ Recuperación de contraseña funciona
✓ Páginas protegidas requieren auth
\`\`\`

#### 4. Test de Checkout
\`\`\`
✓ Agregar al carrito funciona
✓ Modificar cantidad funciona
✓ Eliminar del carrito funciona
✓ Proceso de checkout inicia
✓ Formulario de dirección funciona
✓ (Stripe/MercadoPago test si está configurado)
\`\`\`

#### 5. Test de Admin
\`\`\`
✓ Login de admin funciona
✓ Dashboard muestra estadísticas
✓ Crear producto funciona
✓ Editar producto funciona
✓ Gestión de pedidos funciona
✓ Gestión de contenido funciona
\`\`\`

### Tests de Performance

\`\`\`bash
# Lighthouse Score (objetivo)
Performance: > 90
Accessibility: > 95
Best Practices: > 90
SEO: > 90

# Test con:
# https://pagespeed.web.dev/
\`\`\`

### Tests de Seguridad

\`\`\`
✓ HTTPS habilitado
✓ Variables de entorno no expuestas
✓ RLS policies activas
✓ Headers de seguridad correctos
✓ CORS configurado correctamente
\`\`\`

---

## 📊 MONITOREO Y MANTENIMIENTO

### Monitoreo en Vercel

**Métricas disponibles:**
1. Real-time metrics
2. Error tracking
3. Build logs
4. Deployment history
5. Analytics (con plan Pro)

**Alerts recomendadas:**
- Build failures
- Error rate > 1%
- Response time > 3s

### Monitoreo en Supabase

**Panel de Database:**
- Query performance
- Active connections
- Table sizes
- Index usage

**Panel de Auth:**
- Sign-ups por día
- Active users
- Failed login attempts

### Logs y Debugging

\`\`\`bash
# Ver logs en tiempo real (Vercel CLI)
vercel logs

# Ver logs de producción
vercel logs --prod

# Ver logs de una función específica
vercel logs --prod --function=api/orders
\`\`\`

### Backups Automáticos

**Supabase:**
- Backups diarios automáticos (retenidos 7 días en plan gratuito)
- Backups manuales: Database > Backups > "Create new backup"

**Backups recomendados:**
- Diario: Base de datos completa
- Semanal: Dump de tablas críticas
- Pre-deployment: Siempre backup antes de cambios mayores

### Mantenimiento Regular

**Semanal:**
- [ ] Revisar logs de errores
- [ ] Verificar emails enviados
- [ ] Revisar pedidos pendientes

**Mensual:**
- [ ] Actualizar dependencias (`npm update`)
- [ ] Revisar uso de storage (Blob)
- [ ] Revisar uso de base de datos
- [ ] Verificar backups

**Trimestral:**
- [ ] Auditoría de seguridad
- [ ] Optimización de queries
- [ ] Limpieza de datos antiguos
- [ ] Actualización de Next.js/React

---

## 🚨 TROUBLESHOOTING

### Problema: "Site is not accessible"

**Causas posibles:**
1. DNS no propagado (esperar 24-48 horas)
2. SSL no configurado
3. Build falló

**Solución:**
\`\`\`bash
# Verificar DNS
nslookup tu-dominio.com

# Verificar build
vercel logs --prod

# Redeploy
vercel --prod --force
\`\`\`

---

### Problema: "Database connection failed"

**Causas posibles:**
1. Variables de Supabase incorrectas
2. RLS bloqueando queries
3. Connection pool lleno

**Solución:**
\`\`\`bash
# Verificar variables
vercel env ls

# Verificar RLS en Supabase
# Database > Policies > Verificar políticas activas

# Reiniciar connection pool (Supabase dashboard)
\`\`\`

---

### Problema: "Emails not sending"

**Causas posibles:**
1. RESEND_API_KEY incorrecta
2. Dominio no verificado
3. Límite de envíos alcanzado

**Solución:**
1. Verificar API key en Resend dashboard
2. Verificar registros DNS del dominio
3. Revisar logs en Resend dashboard

---

### Problema: "Images not loading"

**Causas posibles:**
1. BLOB_READ_WRITE_TOKEN incorrecta
2. URLs de imágenes mal formadas
3. Storage lleno

**Solución:**
\`\`\`bash
# Verificar token
vercel env ls | grep BLOB

# Verificar storage usage
# Vercel Dashboard > Storage > Blob
\`\`\`

---

### Problema: "Build fails"

**Causas comunes:**
\`\`\`bash
# Error de TypeScript
# Solución: Verificar tipos, corregir errores TS

# Error de dependencias
npm install
npm run build

# Error de variables de entorno
# Verificar que todas las vars estén configuradas
\`\`\`

---

### Problema: "Slow performance"

**Diagnóstico:**
\`\`\`bash
# Test de velocidad
npm run build
npm start

# Análisis con Lighthouse
# https://pagespeed.web.dev/
\`\`\`

**Optimizaciones:**
1. Implementar caché de API routes
2. Optimizar imágenes (usar Next/Image)
3. Lazy loading de componentes
4. Reducir bundle size

---

## 🔄 ROLLBACK Y BACKUPS

### Rollback Rápido en Vercel

**Si algo sale mal después de un deploy:**

\`\`\`bash
# Ver deployments
vercel ls

# Promover deployment anterior
vercel alias set <deployment-url> tu-dominio.com
\`\`\`

**O desde Dashboard:**
1. Ir a Deployments
2. Encontrar deployment anterior funcional
3. Click en "..." > "Promote to Production"

---

### Backup de Base de Datos

**Backup manual:**
\`\`\`bash
# Desde Supabase Dashboard
Database > Backups > Create backup

# O con pg_dump (requiere acceso directo)
pg_dump -h db.xxxxx.supabase.co \
  -U postgres \
  -d postgres \
  -F custom \
  -f backup_$(date +%Y%m%d).dump
\`\`\`

**Restaurar backup:**
\`\`\`bash
# Desde Supabase Dashboard
Database > Backups > [seleccionar backup] > Restore
\`\`\`

---

### Plan de Recuperación ante Desastres

**Escenario 1: Database corrupta**
1. Detener aplicación (hacer deployment de página de mantenimiento)
2. Restaurar último backup de Supabase
3. Verificar integridad de datos
4. Restaurar aplicación

**Escenario 2: Deployment falló crítico**
1. Rollback a deployment anterior (2 minutos)
2. Investigar causa del fallo
3. Corregir en local
4. Deploy con testing exhaustivo

**Escenario 3: Compromiso de seguridad**
1. Rotar todas las API keys inmediatamente
2. Forzar logout de todos los usuarios
3. Auditoría completa de logs
4. Actualizar configuraciones de seguridad

---

## 📞 SOPORTE Y RECURSOS

### Documentación Oficial
- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs
- Supabase: https://supabase.com/docs
- Stripe: https://stripe.com/docs
- Resend: https://resend.com/docs

### Comunidad
- Next.js Discord
- Supabase Discord
- Stack Overflow

### Contacto de Emergencia
Documentar aquí contactos del equipo técnico:
\`\`\`
Tech Lead: [nombre] - [email] - [teléfono]
DevOps: [nombre] - [email] - [teléfono]
Database Admin: [nombre] - [email] - [teléfono]
\`\`\`

---

## 📈 SIGUIENTES PASOS POST-LAUNCH

### Semana 1
- [ ] Monitoreo constante de errores
- [ ] Ajustes de performance
- [ ] Corrección de bugs críticos
- [ ] Configuración de alertas

### Mes 1
- [ ] Análisis de analytics
- [ ] Optimizaciones de SEO
- [ ] A/B testing de conversión
- [ ] Feedback de usuarios

### Mes 3
- [ ] Nuevas features según feedback
- [ ] Escalado de infraestructura si necesario
- [ ] Optimizaciones de costos
- [ ] Actualización de dependencias

---

## 🎯 CHECKLIST FINAL DE LAUNCH

### Pre-Launch (1 día antes)
- [ ] Backup completo de base de datos
- [ ] Todos los tests pasan
- [ ] Documentación actualizada
- [ ] Variables de producción verificadas
- [ ] Plan de rollback listo
- [ ] Equipo técnico en standby

### Launch Day
- [ ] Deploy a producción
- [ ] Monitoreo activo primeras 4 horas
- [ ] Tests de smoke en producción
- [ ] Comunicación a stakeholders
- [ ] Documentar issues encontrados

### Post-Launch (primeros 3 días)
- [ ] Monitoreo constante
- [ ] Hotfixes si es necesario
- [ ] Análisis de métricas iniciales
- [ ] Recolección de feedback
- [ ] Retrospectiva del equipo

---

## 📋 RESUMEN DE COSTOS MENSUALES

### Configuración Mínima (Free Tier)
\`\`\`
Vercel: $0 (Hobby plan)
Supabase: $0 (Free plan - hasta 500 MB database)
Resend: $0 (hasta 3,000 emails/mes)
Vercel Blob: $0 (primeros 1 GB gratis)

TOTAL: $0/mes
\`\`\`

### Configuración Recomendada (Producción)
\`\`\`
Vercel Pro: $20/mes
Supabase Pro: $25/mes
Resend Pro: $20/mes (50,000 emails)
Vercel Blob: ~$5/mes (según uso)
Stripe: 2.9% + $0.30 por transacción

TOTAL: ~$70/mes + comisiones de pago
\`\`\`

### Configuración Enterprise
\`\`\`
Vercel Enterprise: Custom pricing
Supabase Team: $599/mes
Resend Business: $85/mes (1M emails)
CDN adicional: Variable

TOTAL: Consultar con vendors
\`\`\`

---

## ✨ CONCLUSIÓN

Esta guía cubre el 100% del proceso de despliegue de STARDUST. Con estos pasos, tu e-commerce estará:

- ✅ Desplegado en infraestructura escalable
- ✅ Con base de datos PostgreSQL robusta
- ✅ Autenticación de usuarios funcionando
- ✅ Emails transaccionales configurados
- ✅ Sistema de pagos listo (con Stripe o MercadoPago)
- ✅ Monitoreo y backups automáticos
- ✅ Preparado para escalar

**Tiempo estimado de deployment completo: 4-6 horas**

**¡Éxito con tu lanzamiento! 🚀**

---

**Versión del documento:** 1.0  
**Última actualización:** Diciembre 2024  
**Mantenido por:** Equipo STARDUST  
**Próxima revisión:** Enero 2025
