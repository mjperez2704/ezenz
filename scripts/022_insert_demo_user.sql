-- =====================================================
-- SCRIPT: Inserción de Usuario Demo para App Móvil
-- =====================================================
-- Este script crea un usuario de prueba completo con:
-- - Cuenta de autenticación en Supabase Auth
-- - Perfil de usuario
-- - Direcciones de envío
-- - Historial de pedidos de ejemplo
-- =====================================================

-- IMPORTANTE: Este script debe ejecutarse con privilegios de servicio
-- ya que inserta directamente en auth.users

-- =====================================================
-- PASO 1: Crear usuario en Supabase Auth
-- =====================================================

-- Primero, verificamos si el usuario ya existe y lo eliminamos si es necesario
DO $$
DECLARE
  demo_user_id UUID := 'a0000000-0000-0000-0000-000000000001';
BEGIN
  -- Eliminar usuario existente si existe
  DELETE FROM auth.users WHERE id = demo_user_id;
  
  -- Insertar nuevo usuario demo en auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at
  ) VALUES (
    demo_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'demo@stardust.com',
    -- Password: Demo123! (encriptado con bcrypt)
    '$2a$10$vWqQqYWvfj7xZsYJQ8KQrOXMJmXVXVhYHQJH0Cc4nB5p5j5j5j5j5',
    NOW(),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Usuario Demo STARDUST"}',
    false,
    NOW(),
    NOW(),
    '+52 123 456 7890',
    NOW(),
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
  ) ON CONFLICT (id) DO NOTHING;

END $$;

-- =====================================================
-- PASO 2: Crear perfil de usuario en tabla public.users
-- =====================================================

INSERT INTO public.users (
  id,
  email,
  full_name,
  phone,
  created_at,
  updated_at
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'demo@stardust.com',
  'Usuario Demo STARDUST',
  '+52 123 456 7890',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- =====================================================
-- PASO 3: Crear direcciones de envío
-- =====================================================

-- Dirección 1: Casa (por defecto)
INSERT INTO public.user_addresses (
  id,
  user_id,
  address_name,
  full_name,
  phone,
  street_address,
  city,
  state,
  zip_code,
  is_default,
  created_at
) VALUES (
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'Casa',
  'Usuario Demo STARDUST',
  '+52 123 456 7890',
  'Calle Estrella 123, Col. Cosmos',
  'Ciudad de México',
  'CDMX',
  '01234',
  true,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  address_name = EXCLUDED.address_name,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  street_address = EXCLUDED.street_address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  is_default = EXCLUDED.is_default;

-- Dirección 2: Oficina
INSERT INTO public.user_addresses (
  id,
  user_id,
  address_name,
  full_name,
  phone,
  street_address,
  city,
  state,
  zip_code,
  is_default,
  created_at
) VALUES (
  'b0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  'Oficina',
  'Usuario Demo STARDUST',
  '+52 123 456 7891',
  'Av. Galaxia 456, Piso 3',
  'Monterrey',
  'Nuevo León',
  '64000',
  false,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  address_name = EXCLUDED.address_name,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  street_address = EXCLUDED.street_address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  is_default = EXCLUDED.is_default;

-- =====================================================
-- PASO 4: Crear pedidos de ejemplo
-- =====================================================

-- Pedido 1: Completado (Entregado)
INSERT INTO public.orders (
  id,
  user_id,
  authenticated_user_id,
  customer_email,
  customer_name,
  customer_phone,
  shipping_address,
  items,
  subtotal,
  tax,
  shipping,
  total,
  payment_method,
  status,
  tracking_number,
  shipping_carrier,
  created_at,
  shipped_at,
  delivered_at,
  estimated_delivery_date
) VALUES (
  'DEMO-ORDER-001',
  NULL,
  'a0000000-0000-0000-0000-000000000001',
  'demo@stardust.com',
  'Usuario Demo STARDUST',
  '+52 123 456 7890',
  '{"address_name":"Casa","full_name":"Usuario Demo STARDUST","phone":"+52 123 456 7890","street_address":"Calle Estrella 123, Col. Cosmos","city":"Ciudad de México","state":"CDMX","zip_code":"01234"}',
  '[{"id":"prod-001","name":"Crema Facial Regeneradora","quantity":2,"price":599.00,"image":"/placeholder.svg?height=100&width=100"}]',
  1198.00,
  191.68,
  150.00,
  1539.68,
  'MercadoPago',
  'delivered',
  'TRACK123456789',
  'FedEx',
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '13 days',
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '10 days'
) ON CONFLICT (id) DO NOTHING;

-- Pedido 2: En tránsito
INSERT INTO public.orders (
  id,
  user_id,
  authenticated_user_id,
  customer_email,
  customer_name,
  customer_phone,
  shipping_address,
  items,
  subtotal,
  tax,
  shipping,
  total,
  payment_method,
  status,
  tracking_number,
  shipping_carrier,
  created_at,
  shipped_at,
  estimated_delivery_date
) VALUES (
  'DEMO-ORDER-002',
  NULL,
  'a0000000-0000-0000-0000-000000000001',
  'demo@stardust.com',
  'Usuario Demo STARDUST',
  '+52 123 456 7890',
  '{"address_name":"Oficina","full_name":"Usuario Demo STARDUST","phone":"+52 123 456 7891","street_address":"Av. Galaxia 456, Piso 3","city":"Monterrey","state":"Nuevo León","zip_code":"64000"}',
  '[{"id":"prod-002","name":"Sérum Anti-edad","quantity":1,"price":899.00,"image":"/placeholder.svg?height=100&width=100"},{"id":"prod-003","name":"Mascarilla Purificante","quantity":1,"price":449.00,"image":"/placeholder.svg?height=100&width=100"}]',
  1348.00,
  215.68,
  150.00,
  1713.68,
  'Stripe',
  'shipped',
  'TRACK987654321',
  'DHL',
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '1 day',
  NOW() + INTERVAL '2 days'
) ON CONFLICT (id) DO NOTHING;

-- Pedido 3: Pendiente
INSERT INTO public.orders (
  id,
  user_id,
  authenticated_user_id,
  customer_email,
  customer_name,
  customer_phone,
  shipping_address,
  items,
  subtotal,
  tax,
  shipping,
  total,
  payment_method,
  status,
  created_at,
  estimated_delivery_date
) VALUES (
  'DEMO-ORDER-003',
  NULL,
  'a0000000-0000-0000-0000-000000000001',
  'demo@stardust.com',
  'Usuario Demo STARDUST',
  '+52 123 456 7890',
  '{"address_name":"Casa","full_name":"Usuario Demo STARDUST","phone":"+52 123 456 7890","street_address":"Calle Estrella 123, Col. Cosmos","city":"Ciudad de México","state":"CDMX","zip_code":"01234"}',
  '[{"id":"prod-004","name":"Limpiador Facial","quantity":1,"price":399.00,"image":"/placeholder.svg?height=100&width=100"}]',
  399.00,
  63.84,
  150.00,
  612.84,
  'MercadoPago',
  'pending',
  NOW() - INTERVAL '1 hour',
  NOW() + INTERVAL '5 days'
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- PASO 5: Crear eventos de tracking para pedidos
-- =====================================================

-- Eventos para Pedido 1 (Entregado)
INSERT INTO public.shipping_events (
  id,
  order_id,
  event_type,
  event_date,
  event_location,
  event_description,
  created_at
) VALUES 
  (gen_random_uuid(), 'DEMO-ORDER-001', 'order_placed', NOW() - INTERVAL '15 days', 'STARDUST Warehouse', 'Pedido recibido y procesándose', NOW() - INTERVAL '15 days'),
  (gen_random_uuid(), 'DEMO-ORDER-001', 'picked', NOW() - INTERVAL '14 days', 'STARDUST Warehouse', 'Pedido preparado para envío', NOW() - INTERVAL '14 days'),
  (gen_random_uuid(), 'DEMO-ORDER-001', 'shipped', NOW() - INTERVAL '13 days', 'Centro de Distribución CDMX', 'Paquete enviado', NOW() - INTERVAL '13 days'),
  (gen_random_uuid(), 'DEMO-ORDER-001', 'in_transit', NOW() - INTERVAL '12 days', 'Centro FedEx CDMX Norte', 'En tránsito', NOW() - INTERVAL '12 days'),
  (gen_random_uuid(), 'DEMO-ORDER-001', 'out_for_delivery', NOW() - INTERVAL '10 days', 'Centro Local CDMX', 'En reparto', NOW() - INTERVAL '10 days'),
  (gen_random_uuid(), 'DEMO-ORDER-001', 'delivered', NOW() - INTERVAL '10 days', 'Calle Estrella 123, CDMX', 'Entregado exitosamente', NOW() - INTERVAL '10 days')
ON CONFLICT DO NOTHING;

-- Eventos para Pedido 2 (En tránsito)
INSERT INTO public.shipping_events (
  id,
  order_id,
  event_type,
  event_date,
  event_location,
  event_description,
  created_at
) VALUES 
  (gen_random_uuid(), 'DEMO-ORDER-002', 'order_placed', NOW() - INTERVAL '3 days', 'STARDUST Warehouse', 'Pedido recibido y procesándose', NOW() - INTERVAL '3 days'),
  (gen_random_uuid(), 'DEMO-ORDER-002', 'picked', NOW() - INTERVAL '2 days', 'STARDUST Warehouse', 'Pedido preparado para envío', NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), 'DEMO-ORDER-002', 'shipped', NOW() - INTERVAL '1 day', 'Centro de Distribución Monterrey', 'Paquete enviado', NOW() - INTERVAL '1 day'),
  (gen_random_uuid(), 'DEMO-ORDER-002', 'in_transit', NOW() - INTERVAL '12 hours', 'Centro DHL Monterrey Norte', 'En tránsito', NOW() - INTERVAL '12 hours')
ON CONFLICT DO NOTHING;

-- =====================================================
-- RESUMEN Y VERIFICACIÓN
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'USUARIO DEMO CREADO EXITOSAMENTE';
  RAISE NOTICE '==========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Credenciales de acceso:';
  RAISE NOTICE '  Email: demo@stardust.com';
  RAISE NOTICE '  Password: Demo123!';
  RAISE NOTICE '';
  RAISE NOTICE 'Datos del perfil:';
  RAISE NOTICE '  ID: a0000000-0000-0000-0000-000000000001';
  RAISE NOTICE '  Nombre: Usuario Demo STARDUST';
  RAISE NOTICE '  Teléfono: +52 123 456 7890';
  RAISE NOTICE '';
  RAISE NOTICE 'Direcciones creadas: 2';
  RAISE NOTICE '  - Casa (por defecto)';
  RAISE NOTICE '  - Oficina';
  RAISE NOTICE '';
  RAISE NOTICE 'Pedidos de ejemplo: 3';
  RAISE NOTICE '  - DEMO-ORDER-001: Entregado';
  RAISE NOTICE '  - DEMO-ORDER-002: En tránsito';
  RAISE NOTICE '  - DEMO-ORDER-003: Pendiente';
  RAISE NOTICE '';
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'El usuario está listo para usar en la API móvil';
  RAISE NOTICE '==========================================';
END $$;

-- Verificar que todo se creó correctamente
SELECT 
  'Usuario' as tipo,
  COUNT(*) as cantidad
FROM public.users 
WHERE id = 'a0000000-0000-0000-0000-000000000001'

UNION ALL

SELECT 
  'Direcciones' as tipo,
  COUNT(*) as cantidad
FROM public.user_addresses 
WHERE user_id = 'a0000000-0000-0000-0000-000000000001'

UNION ALL

SELECT 
  'Pedidos' as tipo,
  COUNT(*) as cantidad
FROM public.orders 
WHERE authenticated_user_id = 'a0000000-0000-0000-0000-000000000001';
