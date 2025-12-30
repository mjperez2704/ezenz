-- Create categories table for product classification
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Add some default categories
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Relajación', 'relajacion', 'Productos para reducir el estrés y mejorar el sueño', 1),
  ('Enfoque', 'enfoque', 'Suplementos para mejorar concentración y claridad mental', 2),
  ('Energía', 'energia', 'Fórmulas para aumentar vitalidad y rendimiento', 3),
  ('Defensa', 'defensa', 'Apoyo al sistema inmunológico', 4),
  ('Longevidad', 'longevidad', 'Productos antioxidantes y para salud celular', 5),
  ('Balance Hormonal', 'balance-hormonal', 'Equilibrio y vitalidad hormonal', 6)
ON CONFLICT (name) DO NOTHING;

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT
  USING (is_active = true);

-- Allow authenticated users full access
CREATE POLICY "categories_authenticated_all" ON categories
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

-- Update products table to reference categories
-- Note: products.category is already TEXT, so we keep it as is for now
-- In the future, you could migrate to use category_id if needed

COMMENT ON TABLE categories IS 'Product categories for filtering and organization';
