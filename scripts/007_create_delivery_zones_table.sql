-- Create delivery zones table
CREATE TABLE IF NOT EXISTS delivery_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  cities TEXT[] NOT NULL DEFAULT '{}',
  shipping_cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
  delivery_time TEXT NOT NULL DEFAULT '3-5 días',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;

-- Create policy for public read
CREATE POLICY "delivery_zones_public_read" ON delivery_zones
  FOR SELECT USING (active = true);

-- Create policy for authenticated users to do everything
CREATE POLICY "delivery_zones_authenticated_all" ON delivery_zones
  FOR ALL USING (auth.role() = 'authenticated');

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_delivery_zones_active ON delivery_zones(active);
CREATE INDEX IF NOT EXISTS idx_delivery_zones_state ON delivery_zones(state);
