-- Crear tabla de direcciones de usuarios
CREATE TABLE IF NOT EXISTS public.user_addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  address_name TEXT NOT NULL, -- ej: "Casa", "Oficina"
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view own addresses"
  ON public.user_addresses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses"
  ON public.user_addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
  ON public.user_addresses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
  ON public.user_addresses FOR DELETE
  USING (auth.uid() = user_id);

-- Índice para búsquedas rápidas
CREATE INDEX idx_user_addresses_user_id ON public.user_addresses(user_id);
