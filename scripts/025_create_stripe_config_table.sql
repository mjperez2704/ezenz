-- Script para crear tabla de configuración de Stripe con modo test/producción
-- Ejecutar en: Supabase SQL Editor

-- Crear tabla de configuración de Stripe
CREATE TABLE IF NOT EXISTS stripe_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  environment TEXT NOT NULL DEFAULT 'test' CHECK (environment IN ('test', 'production')),
  
  -- Claves de TEST
  test_publishable_key TEXT,
  test_secret_key TEXT,
  test_webhook_secret TEXT,
  
  -- Claves de PRODUCTION
  production_publishable_key TEXT,
  production_secret_key TEXT,
  production_webhook_secret TEXT,
  
  -- Control de modo activo
  active_environment TEXT NOT NULL DEFAULT 'test' CHECK (active_environment IN ('test', 'production')),
  
  -- Configuración adicional
  currency TEXT NOT NULL DEFAULT 'mxn',
  payment_methods JSONB DEFAULT '["card"]'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE stripe_config ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública (necesario para checkout)
CREATE POLICY "stripe_config_public_read" ON stripe_config
  FOR SELECT USING (true);

-- Política para admin update
CREATE POLICY "stripe_config_admin_update" ON stripe_config
  FOR UPDATE USING (true);

-- Política para admin insert
CREATE POLICY "stripe_config_admin_insert" ON stripe_config
  FOR INSERT WITH CHECK (true);

-- Insertar configuración inicial con claves de test existentes
INSERT INTO stripe_config (
  id,
  environment,
  active_environment,
  test_publishable_key,
  test_secret_key,
  test_webhook_secret,
  currency,
  payment_methods
) VALUES (
  gen_random_uuid(),
  'test',
  'test',
  '', -- Se configurará desde el admin
  '', -- Se configurará desde el admin
  '', -- Se configurará desde el admin
  'mxn',
  '["card"]'::jsonb
)
ON CONFLICT DO NOTHING;

-- Crear trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_stripe_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stripe_config_updated_at
  BEFORE UPDATE ON stripe_config
  FOR EACH ROW
  EXECUTE FUNCTION update_stripe_config_updated_at();

COMMENT ON TABLE stripe_config IS 'Configuración de Stripe con soporte para modo test y producción';
COMMENT ON COLUMN stripe_config.active_environment IS 'Ambiente activo: test o production';
COMMENT ON COLUMN stripe_config.test_publishable_key IS 'Clave pública de Stripe para modo test (pk_test_...)';
COMMENT ON COLUMN stripe_config.production_publishable_key IS 'Clave pública de Stripe para modo producción (pk_live_...)';
