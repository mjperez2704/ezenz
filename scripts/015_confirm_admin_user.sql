-- Script para confirmar manualmente el usuario admin en Supabase Auth
-- Esto soluciona el error "Database error querying schema"

-- Removiendo confirmed_at que es columna generada automáticamente
-- Confirmar el usuario con email admin@stardust.com
UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  last_sign_in_at = NOW()
WHERE email = 'admin@stardust.com';

-- Verificar que el usuario quedó confirmado
SELECT 
  id,
  email,
  email_confirmed_at,
  confirmed_at,
  created_at
FROM auth.users
WHERE email = 'admin@stardust.com';
