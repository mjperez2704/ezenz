-- Create table for stock reservations (temporary holds during checkout)
CREATE TABLE IF NOT EXISTS stock_reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  session_id TEXT NOT NULL,
  reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_stock_reservations_product_id ON stock_reservations(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_reservations_session_id ON stock_reservations(session_id);
CREATE INDEX IF NOT EXISTS idx_stock_reservations_expires_at ON stock_reservations(expires_at);
CREATE INDEX IF NOT EXISTS idx_stock_reservations_status ON stock_reservations(status);

-- Add low stock threshold column to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5;
ALTER TABLE products ADD COLUMN IF NOT EXISTS notify_on_low_stock BOOLEAN DEFAULT true;

-- Create function to clean expired reservations
CREATE OR REPLACE FUNCTION clean_expired_reservations()
RETURNS INTEGER AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  UPDATE stock_reservations
  SET status = 'expired'
  WHERE status = 'active' AND expires_at < NOW();
  
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  RETURN affected_rows;
END;
$$ LANGUAGE plpgsql;

-- Create function to get available stock (actual - reserved)
CREATE OR REPLACE FUNCTION get_available_stock(p_product_id TEXT)
RETURNS INTEGER AS $$
DECLARE
  actual_stock INTEGER;
  reserved_stock INTEGER;
BEGIN
  -- Get actual stock
  SELECT stock INTO actual_stock FROM products WHERE id = p_product_id;
  
  -- Get reserved stock
  SELECT COALESCE(SUM(quantity), 0) INTO reserved_stock
  FROM stock_reservations
  WHERE product_id = p_product_id AND status = 'active' AND expires_at > NOW();
  
  RETURN GREATEST(actual_stock - reserved_stock, 0);
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE stock_reservations IS 'Temporary stock reservations during checkout process';
COMMENT ON FUNCTION get_available_stock IS 'Returns available stock after subtracting active reservations';
