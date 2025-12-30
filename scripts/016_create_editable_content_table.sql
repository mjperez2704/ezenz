-- Crear tabla para contenido editable del sitio
CREATE TABLE IF NOT EXISTS editable_content (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'html',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar contenidos iniciales
INSERT INTO editable_content (key, title, content, content_type) VALUES
('terms_of_service', 'Términos y Condiciones del Servicio', '', 'html'),
('privacy_policy', 'Aviso de Privacidad', '', 'html'),
('shipping_policy', 'Políticas de Envío', '', 'html'),
('return_policy', 'Políticas de Devolución', '', 'html'),
('email_welcome_template', 'Email de Bienvenida', '', 'html'),
('email_order_confirmation_template', 'Email de Confirmación de Pedido', '', 'html'),
('email_shipping_notification_template', 'Email de Notificación de Envío', '', 'html')
ON CONFLICT (key) DO NOTHING;

-- Índice para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_editable_content_key ON editable_content(key);
