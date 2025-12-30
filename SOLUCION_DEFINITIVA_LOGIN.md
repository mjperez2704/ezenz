# Solución Definitiva para el Login del Backoffice

## Problema
El error "Database error querying schema" indica que el usuario en Supabase Auth tiene un problema interno que impide la autenticación.

## Solución: Recrear el Usuario Completamente

### Paso 1: Ejecutar el Script de Recreación

1. Ve a tu proyecto en Supabase
2. Abre el **SQL Editor**
3. Copia y pega el contenido del archivo `scripts/016_recreate_admin_user.sql`
4. **IMPORTANTE**: Antes de ejecutar, cambia la contraseña en la línea 27:
   \`\`\`sql
   v_encrypted_password := crypt('Admin123456!', gen_salt('bf'));
   \`\`\`
   Reemplaza `'Admin123456!'` por tu contraseña deseada

5. Ejecuta el script (RUN)

### Paso 2: Verificar la Creación

El script mostrará un mensaje como:
\`\`\`
Usuario admin creado exitosamente con ID: [uuid]
Email: admin@stardust.com
Password: Admin123456!
IMPORTANTE: Cambia la contraseña después del primer login
\`\`\`

### Paso 3: Hacer Login

1. Ve a `/admin/login`
2. Ingresa:
   - Email: `admin@stardust.com`
   - Password: La contraseña que configuraste en el script
3. Deberías poder entrar sin problemas

## Credenciales Predeterminadas

Si no modificaste el script, las credenciales son:
- **Email**: admin@stardust.com
- **Password**: Admin123456!

**IMPORTANTE**: Cambia esta contraseña después del primer login desde `/admin/usuarios-admin`

## Qué Hace Este Script

1. Elimina el usuario problemático de ambas tablas (`admin_users` y `auth.users`)
2. Crea un nuevo usuario en `auth.users` con:
   - Email confirmado (email_confirmed_at)
   - Contraseña encriptada correctamente
   - Todos los metadatos necesarios
   - Rol 'authenticated'
3. Crea el registro correspondiente en `admin_users` con rol 'super_admin'

## Si Aún Tienes Problemas

Si después de ejecutar este script sigues teniendo problemas:

1. Verifica que el script se ejecutó sin errores
2. Verifica en **Authentication → Users** que el usuario aparece confirmado
3. Verifica en **Table Editor → admin_users** que el registro existe
4. Intenta cambiar la contraseña desde el dashboard de Supabase

## Alternativa: Crear desde el Dashboard

Si prefieres no usar el script:

1. **Authentication → Users → Add User**
   - Email: admin@stardust.com
   - Password: [tu contraseña]
   - Auto Confirm User: **✓ SI**
   
2. Copia el UUID del usuario creado

3. **SQL Editor**, ejecuta:
   \`\`\`sql
   INSERT INTO public.admin_users (id, email, full_name, role, is_active)
   VALUES (
     '[UUID-COPIADO]',
     'admin@stardust.com',
     'Super Administrador',
     'super_admin',
     true
   );
   \`\`\`

Ahora podrás hacer login sin problemas.
