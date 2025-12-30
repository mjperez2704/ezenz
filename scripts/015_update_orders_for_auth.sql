-- Agregar user_id a orders para vincular con usuarios autenticados
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS authenticated_user_id UUID REFERENCES public.users(id);

-- Índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_orders_authenticated_user_id ON public.orders(authenticated_user_id);

-- Actualizar políticas RLS de orders
DROP POLICY IF EXISTS "orders_select_own" ON public.orders;
CREATE POLICY "orders_select_own"
  ON public.orders FOR SELECT
  USING (
    auth.uid() = authenticated_user_id OR 
    auth.uid() IS NULL
  );

DROP POLICY IF EXISTS "orders_insert_own" ON public.orders;
CREATE POLICY "orders_insert_own"
  ON public.orders FOR INSERT
  WITH CHECK (
    auth.uid() = authenticated_user_id OR 
    authenticated_user_id IS NULL
  );
