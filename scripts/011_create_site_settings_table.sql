-- Create site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for public read
CREATE POLICY "site_settings_public_read" ON site_settings
  FOR SELECT USING (true);

-- Create policy for authenticated users to update
CREATE POLICY "site_settings_authenticated_update" ON site_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES
  ('general', '{"siteName": "STARDUST", "siteDescription": "Adaptógenos que conectan cuerpo, mente y universo", "contactEmail": "hola@stardust.com", "contactPhone": "+52 55 1234 5678", "logo": "/logo.png"}'),
  ('payment', '{"stripeEnabled": true, "stripePublishableKey": "", "paypalEnabled": false, "paypalClientId": "", "cashOnDeliveryEnabled": true}'),
  ('email', '{"smtpHost": "smtp.gmail.com", "smtpPort": "587", "smtpUser": "", "smtpPassword": "", "fromEmail": "noreply@stardust.com", "fromName": "STARDUST"}'),
  ('social', '{"facebook": "https://facebook.com/stardust", "instagram": "https://instagram.com/stardust", "whatsapp": "+5215512345678", "whatsappEnabled": true}'),
  ('notifications', '{"pushEnabled": false, "emailOrderConfirmation": true, "emailShipping": true, "smsEnabled": false}'),
  ('push_notifications', '{"firebase_server_key": "", "firebase_sender_id": "", "vapid_public_key": "", "enable_order_notifications": true, "enable_promo_notifications": true, "enable_stock_alerts": true}'),
  ('sms_notifications', '{"provider": "twilio", "twilio_account_sid": "", "twilio_auth_token": "", "twilio_phone_number": "", "enable_order_sms": true, "enable_shipping_sms": true, "enable_delivery_sms": true}'),
  ('mobile_app', '{"app_name": "STARDUST", "app_version": "1.0.0", "force_update_version": "1.0.0", "maintenance_mode": false, "maintenance_message": "", "enable_biometric_auth": true, "enable_dark_mode": true, "api_timeout": 30}')
ON CONFLICT (key) DO NOTHING;

-- Create index
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
