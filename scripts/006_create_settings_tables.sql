-- Tabla de configuración general
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de zonas de entrega
CREATE TABLE IF NOT EXISTS delivery_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  cities TEXT[] NOT NULL,
  shipping_cost DECIMAL(10,2) NOT NULL,
  delivery_time TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de proveedores
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de banners
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  position TEXT NOT NULL, -- 'hero', 'middle', 'footer'
  active BOOLEAN DEFAULT true,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de usuarios/clientes
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar configuraciones por defecto
INSERT INTO site_settings (key, value) VALUES
  ('general', '{"siteName":"STARDUST","siteDescription":"Adaptógenos que conectan cuerpo, mente y universo","contactEmail":"info@stardust.com","contactPhone":"+52 55 1234 5678","logo":"/logo.png"}'::jsonb),
  ('payment', '{"stripeEnabled":true,"stripePublishableKey":"","paypalEnabled":false,"paypalClientId":"","cashOnDeliveryEnabled":true}'::jsonb),
  ('email', '{"smtpHost":"smtp.gmail.com","smtpPort":"587","smtpUser":"","smtpPassword":"","fromEmail":"noreply@stardust.com","fromName":"STARDUST"}'::jsonb),
  ('social', '{"facebook":"https://facebook.com/stardust","instagram":"https://instagram.com/stardust","whatsapp":"+525512345678","whatsappEnabled":true}'::jsonb),
  ('notifications', '{"pushEnabled":false,"emailOrderConfirmation":true,"emailShipping":true,"smsEnabled":false}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Políticas RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública para ciertas tablas
CREATE POLICY "Allow public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read delivery_zones" ON delivery_zones FOR SELECT USING (active = true);
CREATE POLICY "Allow public read banners" ON banners FOR SELECT USING (active = true);

-- Admin tiene acceso completo (por ahora sin auth, después agregar verificación de rol)
CREATE POLICY "Allow all for site_settings" ON site_settings FOR ALL USING (true);
CREATE POLICY "Allow all for delivery_zones" ON delivery_zones FOR ALL USING (true);
CREATE POLICY "Allow all for suppliers" ON suppliers FOR ALL USING (true);
CREATE POLICY "Allow all for banners" ON banners FOR ALL USING (true);
CREATE POLICY "Allow all for customers" ON customers FOR ALL USING (true);
