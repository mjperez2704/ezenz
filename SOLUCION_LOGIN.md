# Solución al Error de Login "Database error querying schema"

## Problema

El error `Database error querying schema` ocurre porque el usuario en `auth.users` existe pero no está confirmado (verificado).

## Solución Rápida

### Opción 1: Ejecutar Script SQL (RECOMENDADO)

1. Ve a tu proyecto en Supabase → **SQL Editor**
2. Ejecuta el script: `scripts/015_confirm_admin_user.sql`
3. Esto confirmará automáticamente el usuario `admin@stardust.com`
4. Intenta hacer login nuevamente

### Opción 2: Desde el Dashboard de Supabase

1. Ve a **Authentication** → **Users**
2. Busca el usuario `admin@stardust.com`
3. Haz clic en los tres puntos (⋮) al lado del usuario
4. Selecciona **Send Magic Link** o **Confirm Email**
5. Esto confirmará el usuario
6. Intenta hacer login nuevamente

### Opción 3: Recrear el Usuario Correctamente

1. Ve a **Authentication** → **Users**
2. **Elimina** el usuario `admin@stardust.com` existente
3. Ve a **SQL Editor** y ejecuta este script:

\`\`\`sql
-- Crear usuario confirmado automáticamente
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Insertar en auth.users con confirmación automática
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@stardust.com',
    crypt('TuPasswordSeguro123!', gen_salt('bf')), -- CAMBIA ESTO por tu contraseña
    NOW(),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    false
  )
  RETURNING id INTO v_user_id;
  
  -- Insertar en admin_users
  INSERT INTO public.admin_users (id, email, full_name, role, is_active)
  VALUES (v_user_id, 'admin@stardust.com', 'Super Administrador', 'super_admin', true);
  
  RAISE NOTICE 'Usuario creado con ID: %', v_user_id;
END $$;
\`\`\`

**IMPORTANTE:** Cambia `TuPasswordSeguro123!` por tu contraseña real en el script.

4. Ejecuta el script
5. Ahora puedes hacer login con `admin@stardust.com` y la contraseña que pusiste

## Verificar que Funcionó

Después de aplicar cualquiera de estas soluciones, verifica ejecutando:

\`\`\`sql
SELECT 
  id,
  email,
  email_confirmed_at,
  confirmed_at
FROM auth.users
WHERE email = 'admin@stardust.com';
\`\`\`

Deberías ver que `email_confirmed_at` y `confirmed_at` tienen fechas (no NULL).

## Por qué Ocurre Esto

Cuando creas usuarios manualmente en Supabase sin confirmarlos, Supabase Auth no les permite hacer login hasta que confirmen su email. El script o el método del dashboard confirma el email automáticamente.
