-- ============================================
-- CREAR PRIMER USUARIO ADMINISTRADOR
-- ============================================
-- 
-- OPCIÓN 1 (RECOMENDADA): Crear desde el Dashboard de Supabase
-- 1. Ve a Authentication > Users
-- 2. Crea un nuevo usuario con email y contraseña
-- 3. Copia el UUID del usuario
-- 4. Ejecuta el siguiente INSERT reemplazando el UUID:

-- Ejemplo:
-- INSERT INTO public.admin_users (id, email, full_name, role, is_active)
-- VALUES (
--   'UUID-DEL-USUARIO-AQUI',  -- Reemplaza con el UUID del usuario de Supabase Auth
--   'admin@stardust.com',
--   'Super Administrador',
--   'super_admin',
--   true
-- );

-- ============================================
-- OPCIÓN 2: Método Manual Rápido (Sin Dashboard)
-- ============================================
-- Si no puedes acceder al dashboard, ejecuta este script:

-- PASO 1: Cambia estos valores
DO $$
DECLARE
  v_email TEXT := 'admin@stardust.com';  -- 👈 CAMBIA ESTE EMAIL
  v_password TEXT := 'Admin123!';         -- 👈 CAMBIA ESTA CONTRASEÑA
  v_full_name TEXT := 'Super Administrador'; -- 👈 CAMBIA ESTE NOMBRE
  v_user_id UUID;
BEGIN
  -- Insertar usuario en auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    email_change_sent_at,
    confirmation_token,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    v_email,
    crypt(v_password, gen_salt('bf')),
    NOW(),
    NOW(),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
    jsonb_build_object('full_name', v_full_name),
    NOW(),
    NOW(),
    NOW(),
    encode(gen_random_bytes(32), 'hex'),
    encode(gen_random_bytes(32), 'hex')
  )
  RETURNING id INTO v_user_id;

  -- Insertar en admin_users
  INSERT INTO public.admin_users (
    id,
    email,
    full_name,
    role,
    is_active
  ) VALUES (
    v_user_id,
    v_email,
    v_full_name,
    'super_admin',
    true
  );

  RAISE NOTICE 'Usuario administrador creado exitosamente!';
  RAISE NOTICE 'Email: %', v_email;
  RAISE NOTICE 'ID: %', v_user_id;
  
END $$;

-- Verificar que se creó correctamente
SELECT 
  au.id,
  au.email,
  au.full_name,
  au.role,
  au.is_active,
  au.created_at,
  u.email_confirmed_at
FROM public.admin_users au
LEFT JOIN auth.users u ON au.id = u.id
ORDER BY au.created_at DESC
LIMIT 1;
