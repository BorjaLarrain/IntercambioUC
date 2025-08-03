-- =====================================================
-- TRIGGER PARA ACTUALIZAR RATINGS DE UNIVERSIDADES
-- =====================================================
-- Este trigger actualiza automáticamente los ratings de una universidad
-- cada vez que se agrega, actualiza o elimina una review

-- 1. Crear función para actualizar ratings
CREATE OR REPLACE FUNCTION update_university_ratings(university_id_param BIGINT)
RETURNS VOID AS $$
BEGIN
    -- Actualizar ratings de la universidad basado en las reviews existentes
    UPDATE universities 
    SET 
        connectivity_rating = (
            SELECT AVG(connectivity_rating) 
            FROM reviews 
            WHERE university_id = university_id_param 
            AND connectivity_rating IS NOT NULL
        ),
        housing_rating = (
            SELECT AVG(housing_rating) 
            FROM reviews 
            WHERE university_id = university_id_param 
            AND housing_rating IS NOT NULL
        ),
        cost_of_living_rating = (
            SELECT AVG(cost_of_living_rating) 
            FROM reviews 
            WHERE university_id = university_id_param 
            AND cost_of_living_rating IS NOT NULL
        ),
        social_life_rating = (
            SELECT AVG(social_life_rating) 
            FROM reviews 
            WHERE university_id = university_id_param 
            AND social_life_rating IS NOT NULL
        ),
        academic_experience_rating = (
            SELECT AVG(academic_experience_rating) 
            FROM reviews 
            WHERE university_id = university_id_param 
            AND academic_experience_rating IS NOT NULL
        ),
        global_rating = (
            SELECT AVG(total_rating) 
            FROM reviews 
            WHERE university_id = university_id_param 
            AND total_rating IS NOT NULL
        )
    WHERE id = university_id_param;
END;
$$ LANGUAGE plpgsql;

-- 2. Crear función que maneja los eventos del trigger
CREATE OR REPLACE FUNCTION handle_review_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Si es una inserción o actualización
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Actualizar ratings de la universidad de la review
        PERFORM update_university_ratings(NEW.university_id);
        RETURN NEW;
    END IF;
    
    -- Si es una eliminación
    IF TG_OP = 'DELETE' THEN
        -- Actualizar ratings de la universidad de la review eliminada
        PERFORM update_university_ratings(OLD.university_id);
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 3. Crear el trigger
DROP TRIGGER IF EXISTS trigger_update_university_ratings ON reviews;

CREATE TRIGGER trigger_update_university_ratings
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION handle_review_changes();

-- 4. Actualizar ratings existentes (opcional - ejecutar una vez)
-- Esto actualiza todas las universidades con sus ratings actuales
DO $$
DECLARE
    university_record RECORD;
BEGIN
    FOR university_record IN SELECT id FROM universities LOOP
        PERFORM update_university_ratings(university_record.id);
    END LOOP;
END $$; 