# Cómo Crear el Primer Usuario Administrador

Sigue estos pasos para crear tu primer usuario administrador en STARDUST:

## ✨ Opción 1: Página de Setup Automática (MÁS FÁCIL)

La forma más rápida y fácil de crear el primer administrador:

### Pasos:

1. **Ejecutar todos los scripts SQL en Supabase**
   - Ve a tu proyecto de Supabase
   - Abre **SQL Editor**
   - Ejecuta todos los scripts desde `scripts/001_` hasta `scripts/012_` en orden

2. **Acceder a la página de setup**
   - Ve a: `/admin/setup`
   - Ejemplo: `http://localhost:3000/admin/setup`

3. **Completar el formulario**
   - Nombre completo: Tu nombre
   - Email: tu-email@ejemplo.com
   - Contraseña: mínimo 6 caracteres

4. **¡Listo!**
   - El sistema crea el usuario en Supabase Auth automáticamente
   - Lo registra como Super Admin en la tabla admin_users
   - Te redirige automáticamente al login
   - Esta página se auto-desactiva después del primer uso (seguridad)

### Ventajas:
- ✅ Crea el usuario correctamente en Supabase Auth
- ✅ Lo registra como Super Admin automáticamente
- ✅ Se desactiva después del primer uso
- ✅ Validación de formulario integrada
- ✅ No necesitas acceder al dashboard de Supabase

---

## Opción 2: Dashboard de Supabase (Manual)

### Paso 1: Crear usuario en Supabase Auth
1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. En el menú lateral, ve a **Authentication** → **Users**
3. Haz clic en **Add User** → **Create new user**
4. Completa los campos:
   - **Email**: `admin@stardust.com`
   - **Password**: `Admin123!` (o la que prefieras)
   - **Auto Confirm User**: ✅ (IMPORTANTE: debe estar activado)
5. Haz clic en **Create User**
6. **COPIA EL UUID DEL USUARIO** (aparece en la columna ID)

### Paso 2: Agregar a la tabla admin_users
1. En Supabase, ve a **SQL Editor**
2. Ejecuta este SQL (reemplaza el UUID):

\`\`\`sql
INSERT INTO public.admin_users (id, email, full_name, role, is_active)
VALUES (
  'PEGA-AQUI-EL-UUID',      -- UUID del usuario del Paso 1
  'admin@stardust.com',      -- Mismo email
  'Super Administrador',     -- Nombre del admin
  'super_admin',             -- Rol
  true                       -- Cuenta activa
);
\`\`\`

3. Haz clic en **Run**

### Paso 3: Verificar que se creó correctamente
Ejecuta esta consulta para verificar:

\`\`\`sql
SELECT 
  au.id,
  au.email,
  au.full_name,
  au.role,
  au.is_active,
  au.created_at
FROM public.admin_users au
WHERE au.email = 'admin@stardust.com';
\`\`\`

Deberías ver el usuario creado.

### Paso 4: Iniciar Sesión
1. Ve a `/admin/login` en tu navegador
2. Ingresa el email: `admin@stardust.com`
3. Ingresa la contraseña: `Admin123!` (o la que configuraste)
4. Haz clic en **Iniciar Sesión**
5. ¡Listo! Serás redirigido al dashboard del backoffice

---

## Opción 3: Script SQL Completo

Si tienes acceso completo a la base de datos y prefieres automatizar todo:

### Paso 1: Editar el Script
1. Abre el archivo `scripts/013_create_first_admin.sql`
2. **EDITA LAS LÍNEAS 30-32** con tus datos:
   \`\`\`sql
   v_email TEXT := 'admin@stardust.com';  -- Cambia el email
   v_password TEXT := 'Admin123!';         -- Cambia la contraseña
   v_full_name TEXT := 'Super Administrador'; -- Cambia el nombre
   \`\`\`

### Paso 2: Ejecutar Todo el Script
1. Ve a **SQL Editor** en Supabase
2. Copia y pega TODO el contenido del script
3. Haz clic en **Run** o presiona `Ctrl + Enter`
4. Deberías ver un mensaje: "Usuario administrador creado exitosamente!"

### Paso 3: Iniciar Sesión
Ve a `/admin/login` y usa las credenciales que configuraste.

---

## Depuración: Ver qué está pasando

Si tienes problemas al iniciar sesión, **abre la consola del navegador** (presiona F12) y verás logs detallados:

\`\`\`
[v0] Intentando iniciar sesión con: admin@stardust.com
[v0] Resultado de autenticación: {...}
[v0] Usuario autenticado, verificando permisos admin para: uuid-aqui
[v0] Resultado de verificación admin: {...}
[v0] Login exitoso, redirigiendo al dashboard
\`\`\`

Estos logs te dirán exactamente dónde está el problema.

---

## Solución de Problemas

### Error: "Invalid login credentials"

**Causa**: Email o contraseña incorrectos, o usuario no confirmado

**Solución**:
1. Ve a **Authentication** → **Users** en Supabase
2. Busca el usuario por email
3. Verifica que tenga una fecha en la columna `email_confirmed_at`
4. Si no tiene, edita el usuario y marca "Email Confirmed"
5. O resetea la contraseña desde ahí

### Error: "No tienes permisos de administrador"

**Causa**: El usuario existe en Supabase Auth pero NO en la tabla `admin_users`

**Solución**:
1. Ve a la consola del navegador (F12)
2. Busca el log `[v0] Usuario autenticado, verificando permisos admin para: [UUID]`
3. Copia ese UUID
4. Ejecuta el INSERT del Paso 2 de la Opción 1 con ese UUID

### Error: "tu cuenta está inactiva"

**Causa**: El campo `is_active` está en `false`

**Solución**:
\`\`\`sql
UPDATE public.admin_users 
SET is_active = true 
WHERE email = 'admin@stardust.com';
\`\`\`

### No redirige al dashboard después del login

**Causa**: Problemas con el middleware o las cookies

**Solución**:
1. Verifica los logs en la consola (F12)
2. Asegúrate de que el archivo `middleware.ts` existe en la raíz
3. Limpia las cookies del navegador
4. Intenta en modo incógnito

### La página /admin/login está en blanco

**Causa**: Error de JavaScript o componente roto

**Solución**:
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Busca errores en rojo
4. Copia el error y repórtalo

---

## Gestión de Usuarios Administradores

Una vez que hayas iniciado sesión con el primer administrador, puedes:

### Crear más administradores
1. Ve a `/admin/usuarios-admin` en el menú lateral
2. Haz clic en **Nuevo Admin**
3. Completa el formulario
4. Ya no necesitarás usar scripts SQL

### Gestionar usuarios existentes
Desde la tabla de usuarios admin puedes:
- **Editar**: Cambiar nombre, email, rol
- **Cambiar contraseña**: Establecer nueva contraseña directamente
- **Enviar email de recuperación**: El usuario recibirá un email para resetear
- **Activar/Desactivar**: Bloquear acceso temporalmente
- **Eliminar**: Borrar usuario permanentemente

---

## Roles Disponibles

- **super_admin**: Acceso total, puede gestionar otros administradores
- **admin**: Puede gestionar productos, pedidos y clientes
- **editor**: Puede editar contenido (productos, banners)
- **moderator**: Solo puede gestionar reseñas y clientes

---

## Credenciales de Ejemplo

\`\`\`
Email: admin@stardust.com
Contraseña: Admin123!
\`\`\`

⚠️ **IMPORTANTE**: Cambia estas credenciales inmediatamente después de crear el primer usuario desde `/admin/usuarios-admin`.

---

## Resumen Rápido

1. **Ejecutar scripts SQL** desde `scripts/001_` hasta `scripts/012_`
2. **Ir a /admin/setup** y completar el formulario
3. **Acceder a /admin/login** e iniciar sesión
4. **Crear más admins** desde la interfaz del backoffice

Si tienes dudas, revisa los logs en la consola del navegador (F12) para ver exactamente qué está fallando.
