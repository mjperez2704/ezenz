-- Función pública para verificar si existen administradores
-- Esta función puede ser llamada sin autenticación
CREATE OR REPLACE FUNCTION public.check_admin_exists()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.admin_users LIMIT 1);
END;
$$;

-- Permitir que cualquiera pueda ejecutar esta función
GRANT EXECUTE ON FUNCTION public.check_admin_exists() TO anon;
GRANT EXECUTE ON FUNCTION public.check_admin_exists() TO authenticated;
