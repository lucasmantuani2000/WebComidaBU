-- ============================================================================
-- ESQUEMA RELACIONAL POSTGRESQL PARA COMIDA BU (SUPABASE)
-- Guía Gastronómica de Bella Unión, Artigas, Uruguay
-- ============================================================================

-- 1. Habilitar extensión para generación de UUIDs seguros
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TABLA: businesses (Comercios gastronómicos de Bella Unión)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.businesses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    cover_image TEXT,
    gallery TEXT[] DEFAULT '{}',
    categories TEXT[] DEFAULT '{}',
    offering TEXT[] DEFAULT '{}',
    location JSONB DEFAULT '{
        "address": "Bella Unión",
        "neighborhood": null,
        "city": "Bella Unión",
        "department": "Artigas",
        "latitude": -30.27,
        "longitude": -57.60
    }'::jsonb,
    contact JSONB DEFAULT '{
        "phone": null,
        "whatsapp": null,
        "instagram": null,
        "facebook": null,
        "website": null
    }'::jsonb,
    services JSONB DEFAULT '{
        "delivery": false,
        "takeout": true,
        "dineIn": false
    }'::jsonb,
    schedule JSONB DEFAULT NULL,
    price_range TEXT CHECK (price_range IN ('$', '$$', '$$$')),
    rating NUMERIC(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
    verified BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'pending_verification' CHECK (status IN ('active', 'pending_verification', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLA: reviews (Opiniones y calificaciones comunitarias)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY DEFAULT ('rev-' || replace(gen_random_uuid()::text, '-', '')),
    business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    user_id TEXT,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    product_consumed TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    date TEXT,
    verified_visit BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ÍNDICES DE ALTO RENDIMIENTO
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON public.businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON public.businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_verified ON public.businesses(verified);
CREATE INDEX IF NOT EXISTS idx_businesses_categories ON public.businesses USING GIN (categories);
CREATE INDEX IF NOT EXISTS idx_businesses_offering ON public.businesses USING GIN (offering);

CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON public.reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);

-- ============================================================================
-- FUNCIÓN Y TRIGGER: Actualización automática de rating y conteo de reseñas
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_business_rating_stats()
RETURNS TRIGGER AS $$
DECLARE
    target_business_id TEXT;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        target_business_id := OLD.business_id;
    ELSE
        target_business_id := NEW.business_id;
    END IF;

    UPDATE public.businesses
    SET
        review_count = (
            SELECT COUNT(*) FROM public.reviews WHERE business_id = target_business_id
        ),
        rating = COALESCE((
            SELECT ROUND(AVG(rating)::numeric, 1)
            FROM public.reviews
            WHERE business_id = target_business_id
        ), 0),
        updated_at = NOW()
    WHERE id = target_business_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_business_rating_stats ON public.reviews;
CREATE TRIGGER trg_update_business_rating_stats
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_business_rating_stats();

-- ============================================================================
-- POLÍTICAS DE SEGURIDAD (Row Level Security - RLS)
-- ============================================================================

-- 1. Comercios
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de comercios"
ON public.businesses FOR SELECT
USING (true);

CREATE POLICY "Inserción de comercios para administradores o autenticados"
ON public.businesses FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Modificación de comercios para administradores o autenticados"
ON public.businesses FOR UPDATE
USING (auth.role() = 'authenticated');

-- 2. Reseñas
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de opiniones"
ON public.reviews FOR SELECT
USING (true);

CREATE POLICY "Inserción de opiniones comunitarias"
ON public.reviews FOR INSERT
WITH CHECK (true);

CREATE POLICY "Edición de opinión propia"
ON public.reviews FOR UPDATE
USING (auth.uid()::text = user_id);

CREATE POLICY "Eliminación de opinión propia"
ON public.reviews FOR DELETE
USING (auth.uid()::text = user_id);

-- ============================================================================
-- DATOS INICIALES SEMILLA (SEED DATA - 27 Comercios de Bella Unión)
-- ============================================================================
INSERT INTO public.businesses (
    id, name, slug, description, cover_image, gallery, categories, offering, location, contact, services, schedule, price_range, rating, review_count, verified, status
) VALUES
(
    'burgers-br',
    'Burgers BR',
    'burgers-br',
    'Hamburguesería y comida rápida con variedad de burgers smash, papas fritas y combos.',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    '{}',
    ARRAY['hamburguesas', 'comida-rapida'],
    ARRAY['Hamburguesas', 'Papas fritas', 'Bebidas'],
    '{"address": "Bella Unión", "neighborhood": "Tres Fronteras", "city": "Bella Unión", "department": "Artigas", "latitude": -30.2715, "longitude": -57.604}'::jsonb,
    '{"phone": null, "whatsapp": null, "instagram": "burgers_br", "facebook": null, "website": null}'::jsonb,
    '{"delivery": true, "takeout": true, "dineIn": false}'::jsonb,
    NULL,
    '$$',
    0,
    0,
    FALSE,
    'pending_verification'
),
(
    'la-toscana-pizzeria',
    'La Toscana Pizzería',
    'la-toscana-pizzeria',
    'Pizzería artesanal con masa casera, variedad de pizzas al horno y calzones tradicionales.',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    '{}',
    ARRAY['pizzas'],
    ARRAY['Pizzas', 'Calzones'],
    '{"address": "Bella Unión", "neighborhood": null, "city": "Bella Unión", "department": "Artigas", "latitude": -30.277, "longitude": -57.5965}'::jsonb,
    '{"phone": null, "whatsapp": null, "instagram": "latoscanapizzeria__", "facebook": null, "website": null}'::jsonb,
    '{"delivery": true, "takeout": true, "dineIn": false}'::jsonb,
    NULL,
    '$$',
    0,
    0,
    FALSE,
    'pending_verification'
),
(
    'avenida-resto',
    'Avenida Restó',
    'avenida-resto',
    'Restaurante céntrico con menú ejecutivo diario, pastas caseras, minutas y carnes a la plancha.',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    '{}',
    ARRAY['restaurantes', 'minutas', 'pastas'],
    ARRAY['Milanesas en dos panes', 'Pastas caseras', 'Carnes a la plancha', 'Menú del día'],
    '{"address": "Av. Artigas e/ M. Ferrería y Gral. Rivera", "neighborhood": "Centro", "city": "Bella Unión", "department": "Artigas", "latitude": -30.2745, "longitude": -57.599}'::jsonb,
    '{"phone": "47792020", "whatsapp": "099123456", "instagram": "avenidaresto_bu", "facebook": null, "website": null}'::jsonb,
    '{"delivery": true, "takeout": true, "dineIn": true}'::jsonb,
    '{"days": ["Lunes a Sábado"], "openTime": "11:30", "closeTime": "23:30", "notes": "Almuerzo y cena"}'::jsonb,
    '$$',
    5.0,
    1,
    TRUE,
    'active'
),
(
    'pizzeria-cactus',
    'Pizzería Cactus',
    'pizzeria-cactus',
    'Pizzería y rotisería emblemática con pizzas al molde, fainá clásico y empanadas criollas.',
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80',
    '{}',
    ARRAY['pizzas', 'rotiseria', 'empanadas'],
    ARRAY['Pizzas al corte', 'Fainá relleno', 'Empanadas', 'Tartas'],
    '{"address": "Gral. Rivera 1234", "neighborhood": "Centro", "city": "Bella Unión", "department": "Artigas", "latitude": -30.273, "longitude": -57.598}'::jsonb,
    '{"phone": "47793344", "whatsapp": "098765432", "instagram": "pizzeriacactus_bu", "facebook": null, "website": null}'::jsonb,
    '{"delivery": true, "takeout": true, "dineIn": true}'::jsonb,
    '{"days": ["Martes a Domingo"], "openTime": "19:30", "closeTime": "00:30", "notes": "Cena y delivery nocturno"}'::jsonb,
    '$$',
    5.0,
    1,
    TRUE,
    'active'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    categories = EXCLUDED.categories,
    offering = EXCLUDED.offering,
    location = EXCLUDED.location,
    contact = EXCLUDED.contact,
    services = EXCLUDED.services,
    updated_at = NOW();
