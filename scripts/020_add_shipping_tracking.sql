-- Add shipping tracking fields to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_carrier TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery_date TIMESTAMP;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP;

-- Create table for tracking history/events
CREATE TABLE IF NOT EXISTS shipping_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('created', 'picked', 'packed', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned')),
  event_description TEXT NOT NULL,
  event_location TEXT,
  event_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_shipping_events_order_id ON shipping_events(order_id);
CREATE INDEX IF NOT EXISTS idx_shipping_events_event_date ON shipping_events(event_date);

-- Fixed foreign key to reference orders(id) instead of orders(order_id)
-- Add foreign key constraint (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_shipping_events_order_id'
  ) THEN
    ALTER TABLE shipping_events ADD CONSTRAINT fk_shipping_events_order_id 
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Update order status enum to include shipping statuses
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('pending', 'processing', 'confirmed', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'));

-- Create function to add shipping event
CREATE OR REPLACE FUNCTION add_shipping_event(
  p_order_id TEXT,
  p_event_type TEXT,
  p_event_description TEXT,
  p_event_location TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO shipping_events (order_id, event_type, event_description, event_location)
  VALUES (p_order_id, p_event_type, p_event_description, p_event_location)
  RETURNING id INTO v_event_id;

  -- Fixed WHERE clause to use id instead of order_id
  -- Update order status based on event type
  IF p_event_type = 'shipped' THEN
    UPDATE orders SET status = 'shipped', shipped_at = NOW() WHERE id = p_order_id;
  ELSIF p_event_type = 'delivered' THEN
    UPDATE orders SET status = 'delivered', delivered_at = NOW() WHERE id = p_order_id;
  END IF;

  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE shipping_events IS 'Tracking history and events for order shipments';
COMMENT ON FUNCTION add_shipping_event IS 'Add a new shipping event and update order status';
