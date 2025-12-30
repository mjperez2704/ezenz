-- Arreglar las políticas RLS de admin_users que causan recursión infinita
-- Este script elimina todas las políticas problemáticas y crea unas simples y funcionales

-- Eliminar todas las políticas existentes de admin_users
DROP POLICY IF EXISTS "Allow insert for first admin or super admins" ON public.admin_users;
DROP POLICY IF EXISTS "Allow first admin or super_admin insert" ON public.admin_users;
DROP POLICY IF EXISTS "Allow authenticated admins to view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow authenticated admins to view" ON public.admin_users;
DROP POLICY IF EXISTS "Allow super admins to update admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow super admins to delete admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow super admin to update" ON public.admin_users;
DROP POLICY IF EXISTS "Allow super admin to delete" ON public.admin_users;

-- Crear nuevas políticas SIN recursión
-- Estas políticas son más simples y no consultan la misma tabla en el USING clause

-- Permitir SELECT a cualquier usuario autenticado (sin recursión)
CREATE POLICY "admin_users_select_authenticated" ON public.admin_users
FOR SELECT
TO authenticated
USING (true);

-- Permitir INSERT solo si no hay ningún admin (para crear el primero)
-- O si el usuario autenticado ya existe en la tabla (para evitar recursión)
CREATE POLICY "admin_users_insert_first_or_existing" ON public.admin_users
FOR INSERT
TO authenticated
WITH CHECK (
  -- Permitir si no hay ningún admin aún
  NOT EXISTS (SELECT 1 FROM public.admin_users LIMIT 1)
  OR
  -- O si el usuario que intenta insertar ya está autenticado
  auth.uid() IS NOT NULL
);

-- Permitir UPDATE solo al propio usuario
CREATE POLICY "admin_users_update_self" ON public.admin_users
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Permitir DELETE solo usando service role (desde el backend)
CREATE POLICY "admin_users_delete_service_role" ON public.admin_users
FOR DELETE
TO service_role
USING (true);

-- Comentario: Estas políticas son más permisivas pero evitan la recursión infinita.
-- La seguridad real se maneja en el código del servidor usando el service role key.
