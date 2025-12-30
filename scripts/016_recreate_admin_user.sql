-- Script para recrear el usuario administrador correctamente
-- Este script elimina el usuario existente y lo recrea con todos los campos necesarios

-- 1. Eliminar el usuario de admin_users primero (por la foreign key)
DELETE FROM public.admin_users WHERE email = 'admin@stardust.com';

-- 2. Eliminar el usuario de auth.users
DELETE FROM auth.users WHERE email = 'admin@stardust.com';

-- 3. Crear el nuevo usuario en auth.users con email confirmado
-- IMPORTANTE: Cambia 'TU_PASSWORD_AQUI' por la contraseña que quieres usar
DO $$
DECLARE
  v_user_id uuid;
  v_encrypted_password text;
BEGIN
  -- Generar un nuevo UUID para el usuario
  v_user_id := gen_random_uuid();
  
  -- Encriptar la contraseña usando la extensión pgsodium de Supabase
  -- CAMBIA 'Admin123456!' por tu contraseña deseada
  v_encrypted_password := crypt('Admin123456!', gen_salt('bf'));
  
  -- Insertar el usuario en auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token,
    aud,
    role
  ) VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@stardust.com',
    v_encrypted_password,
    NOW(), -- Email confirmado inmediatamente
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Super Administrador"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    'authenticated',
    'authenticated'
  );
  
  -- Insertar el usuario en admin_users
  INSERT INTO public.admin_users (
    id,
    email,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    'admin@stardust.com',
    'Super Administrador',
    'super_admin',
    true,
    NOW(),
    NOW()
  );
  
  RAISE NOTICE 'Usuario admin creado exitosamente con ID: %', v_user_id;
  RAISE NOTICE 'Email: admin@stardust.com';
  RAISE NOTICE 'Password: Admin123456!';
  RAISE NOTICE 'IMPORTANTE: Cambia la contraseña después del primer login';
END $$;
