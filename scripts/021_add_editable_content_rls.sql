-- Habilitar RLS para editable_content
ALTER TABLE editable_content ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública (todos pueden leer)
CREATE POLICY "editable_content_public_read" ON editable_content
  FOR SELECT
  USING (true);

-- Política para que usuarios autenticados puedan modificar
CREATE POLICY "editable_content_authenticated_all" ON editable_content
  FOR ALL
  USING (auth.role() = 'authenticated');
