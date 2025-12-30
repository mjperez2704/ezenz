-- Crear tabla de impuestos (taxes)
CREATE TABLE IF NOT EXISTS public.taxes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  rate NUMERIC(5,4) NOT NULL CHECK (rate >= 0 AND rate <= 1),
  is_active BOOLEAN DEFAULT true,
  country TEXT DEFAULT 'MX',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agregar columna tax_id a la tabla products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS tax_id UUID REFERENCES public.taxes(id);

-- Insertar IVA México 16%
INSERT INTO public.taxes (id, name, description, rate, is_active, country)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'IVA 16%', 'Impuesto al Valor Agregado - México', 0.16, true, 'MX'),
  ('00000000-0000-0000-0000-000000000002', 'Sin Impuesto', 'Productos exentos de impuestos', 0.00, true, 'MX');

-- Asignar IVA 16% a todos los productos existentes
UPDATE public.products 
SET tax_id = '00000000-0000-0000-0000-000000000001'
WHERE tax_id IS NULL;

-- Habilitar RLS en la tabla taxes
ALTER TABLE public.taxes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para taxes
CREATE POLICY "taxes_public_read" ON public.taxes
  FOR SELECT USING (true);

CREATE POLICY "taxes_authenticated_all" ON public.taxes
  FOR ALL USING (true);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_products_tax_id ON public.products(tax_id);
CREATE INDEX IF NOT EXISTS idx_taxes_active ON public.taxes(is_active);

-- Comentarios
COMMENT ON TABLE public.taxes IS 'Tabla de impuestos para aplicar a productos';
COMMENT ON COLUMN public.taxes.rate IS 'Tasa de impuesto decimal (ej: 0.16 para 16%)';
COMMENT ON COLUMN public.products.tax_id IS 'Referencia al impuesto aplicable al producto';
