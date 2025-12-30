-- Create banners table
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  position TEXT NOT NULL CHECK (position IN ('hero', 'middle', 'footer')),
  active BOOLEAN NOT NULL DEFAULT true,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Create policy for public read of active banners
CREATE POLICY "banners_public_read" ON banners
  FOR SELECT USING (active = true);

-- Create policy for authenticated users to do everything
CREATE POLICY "banners_authenticated_all" ON banners
  FOR ALL USING (auth.role() = 'authenticated');

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(active);
CREATE INDEX IF NOT EXISTS idx_banners_position ON banners(position);
CREATE INDEX IF NOT EXISTS idx_banners_dates ON banners(start_date, end_date);
