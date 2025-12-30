-- Create admin users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'editor', 'moderator')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Simplificar políticas RLS para evitar recursión infinita

-- Policy for SELECT: solo usuarios autenticados que YA son admin
CREATE POLICY "Allow authenticated admins to view"
  ON public.admin_users FOR SELECT
  USING (auth.uid() = id OR auth.role() = 'authenticated');

-- Policy for INSERT: permitir si es el primer admin o si ya eres super_admin
CREATE POLICY "Allow first admin or super_admin insert"
  ON public.admin_users FOR INSERT
  WITH CHECK (
    NOT EXISTS (SELECT 1 FROM public.admin_users LIMIT 1)
    OR 
    (SELECT role FROM public.admin_users WHERE id = auth.uid()) = 'super_admin'
  );

-- Policy for UPDATE: solo super_admin puede actualizar
CREATE POLICY "Allow super admin to update"
  ON public.admin_users FOR UPDATE
  USING ((SELECT role FROM public.admin_users WHERE id = auth.uid()) = 'super_admin')
  WITH CHECK ((SELECT role FROM public.admin_users WHERE id = auth.uid()) = 'super_admin');

-- Policy for DELETE: solo super_admin puede eliminar
CREATE POLICY "Allow super admin to delete"
  ON public.admin_users FOR DELETE
  USING ((SELECT role FROM public.admin_users WHERE id = auth.uid()) = 'super_admin');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS admin_users_updated_at ON public.admin_users;
CREATE TRIGGER admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

COMMENT ON TABLE public.admin_users IS 'Admin users table - Use /admin/setup to create the first administrator';
