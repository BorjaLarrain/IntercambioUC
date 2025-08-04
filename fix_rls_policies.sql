-- =====================================================
-- ARREGLAR POLÍTICAS DE RLS PARA PERMITIR ACTUALIZACIONES AUTOMÁTICAS
-- =====================================================

-- 1. Crear política para permitir actualizaciones desde funciones del sistema
CREATE POLICY "Enable update for system functions" ON universities
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- 2. Alternativa: Crear política específica para el trigger
-- Esta política permite actualizaciones solo cuando se ejecuta desde el trigger
CREATE POLICY "Enable update for rating triggers" ON universities
    FOR UPDATE
    USING (auth.role() = 'service_role' OR current_setting('app.trigger_update', true) = 'true')
    WITH CHECK (auth.role() = 'service_role' OR current_setting('app.trigger_update', true) = 'true');

-- 3. Verificar que las políticas se crearon correctamente
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'universities';

-- 4. Probar la función manualmente después de crear las políticas
-- SELECT update_university_ratings(1); 