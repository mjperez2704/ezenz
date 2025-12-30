# Guía de Autenticación del Backoffice STARDUST

## Resumen

El backoffice de STARDUST ahora cuenta con un sistema completo de autenticación usando Supabase Auth con protección de rutas mediante middleware.

## Características Implementadas

### 1. Sistema de Autenticación
- Login con email y contraseña
- Verificación de permisos de administrador
- Protección de rutas `/admin` mediante middleware
- Sesiones seguras con tokens JWT
- Cierre de sesión funcional

### 2. Gestión de Usuarios Admin
- Tabla `admin_users` en Supabase con Row Level Security (RLS)
- Dos tipos de roles: `admin` y `super_admin`
- Solo super_admin puede crear/editar/eliminar otros administradores
- Activar/desactivar usuarios
- Registro de último acceso

### 3. Protección de Rutas
- Middleware que intercepta todas las peticiones a `/admin`
- Verifica autenticación y rol de administrador
- Redirecciona a `/admin/login` si no está autenticado
- Redirecciona a `/` si no tiene permisos de admin

## Acceso al Backoffice

### URL de Login
\`\`\`
/admin/login
\`\`\`

### Primer Acceso - Crear Super Admin

Para crear el primer usuario administrador, necesitas:

1. Ir a Supabase Dashboard > Authentication > Users
2. Crear un nuevo usuario manualmente con email y contraseña
3. Copiar el UUID del usuario creado
4. Ejecutar el siguiente SQL en Supabase SQL Editor:

\`\`\`sql
INSERT INTO public.admin_users (id, email, full_name, role, is_active)
VALUES (
  'UUID-DEL-USUARIO-AQUI',
  'admin@stardust.com',
  'Super Administrador',
  'super_admin',
  true
);
\`\`\`

5. Ahora puedes iniciar sesión en `/admin/login` con ese email y contraseña

### Crear Administradores Adicionales

Una vez que tengas acceso con un super_admin:

1. Ve a `/admin/usuarios-admin`
2. Haz clic en "Nuevo Admin"
3. Completa el formulario:
   - Email
   - Contraseña
   - Nombre completo
   - Rol (admin o super_admin)
4. El usuario será creado automáticamente en Supabase Auth y en la tabla admin_users

## Estructura de Permisos

### Super Admin
- Acceso total al backoffice
- Puede crear, editar y eliminar otros administradores
- Puede ver y gestionar todos los recursos

### Admin
- Acceso al backoffice
- Puede gestionar productos, pedidos, clientes, etc.
- NO puede crear/editar otros administradores

## Seguridad

### Row Level Security (RLS)
Todas las operaciones en `admin_users` están protegidas con RLS:
- Solo administradores autenticados pueden leer la tabla
- Solo super_admin puede insertar, actualizar o eliminar

### Middleware
El middleware valida en cada petición:
1. Usuario autenticado con Supabase
2. Usuario existe en tabla `admin_users`
3. Usuario está activo (`is_active = true`)
4. Actualiza `last_login` en cada acceso

### Tokens
- Supabase maneja automáticamente refresh tokens
- Sesiones expiran según configuración de Supabase
- Tokens se almacenan en cookies HTTP-only

## Flujo de Autenticación

\`\`\`
1. Usuario visita /admin
   ↓
2. Middleware intercepta
   ↓
3. Verifica token en cookies
   ↓
4. Si NO hay token → Redirige a /admin/login
   ↓
5. Si hay token → Verifica en Supabase
   ↓
6. Verifica que user.id existe en admin_users
   ↓
7. Verifica que is_active = true
   ↓
8. Si todo OK → Permite acceso
   Si NO → Redirige según caso
\`\`\`

## Archivos Clave

- `middleware.ts` - Middleware raíz
- `lib/supabase/middleware.ts` - Lógica de autenticación
- `lib/supabase/client.ts` - Cliente browser
- `lib/supabase/server.ts` - Cliente server
- `app/admin/login/page.tsx` - Página de login
- `app/admin/usuarios-admin/page.tsx` - Gestión de usuarios
- `components/admin/admin-header.tsx` - Header con perfil y logout
- `scripts/012_create_admin_users_table.sql` - Schema de base de datos

## Troubleshooting

### No puedo acceder al backoffice
1. Verifica que ejecutaste el script SQL 012
2. Verifica que creaste un usuario en Supabase Auth
3. Verifica que insertaste el registro en admin_users
4. Verifica que `is_active = true`

### Error "No tienes permisos de administrador"
- El usuario existe en Supabase Auth pero no en admin_users
- Necesitas insertar manualmente o que un super_admin te cree

### Sesión expirada constantemente
- Verifica que el middleware está correctamente configurado
- Verifica variables de entorno NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY

## Próximos Pasos Recomendados

1. Implementar recuperación de contraseña
2. Agregar autenticación de dos factores (2FA)
3. Registro de auditoría de acciones de admin
4. Notificaciones de acceso sospechoso
5. Limitar intentos de login fallidos
