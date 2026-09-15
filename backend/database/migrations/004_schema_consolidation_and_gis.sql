-- =====================================================================
-- Migration 004: Schema Consolidation & GIS Enablement
-- =====================================================================
-- This migration applies the necessary delta to an existing `schema.sql` database
-- to add Supabase Auth linkage and PostGIS GIS geometry columns.

-- 1. Ensure PostGIS is enabled
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. Add auth_user_id to citizens (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'citizens' AND column_name = 'auth_user_id'
    ) THEN
        ALTER TABLE citizens ADD COLUMN auth_user_id UUID UNIQUE;
    END IF;
END $$;

-- 3. Add auth_user_id to government_users (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'government_users' AND column_name = 'auth_user_id'
    ) THEN
        ALTER TABLE government_users ADD COLUMN auth_user_id UUID UNIQUE;
    END IF;
END $$;

-- 4. Add GIS geometry columns to parcels
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'parcels' AND column_name = 'boundary'
    ) THEN
        ALTER TABLE parcels ADD COLUMN boundary GEOMETRY(Polygon, 4326);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'parcels' AND column_name = 'centroid'
    ) THEN
        ALTER TABLE parcels ADD COLUMN centroid GEOMETRY(Point, 4326);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_parcels_boundary_gist ON parcels USING GIST(boundary);
CREATE INDEX IF NOT EXISTS idx_parcels_centroid_gist ON parcels USING GIST(centroid);

-- 5. Add GIS geometry columns to administrative areas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'states' AND column_name = 'boundary'
    ) THEN
        ALTER TABLE states ADD COLUMN boundary GEOMETRY(MultiPolygon, 4326);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'districts' AND column_name = 'boundary'
    ) THEN
        ALTER TABLE districts ADD COLUMN boundary GEOMETRY(MultiPolygon, 4326);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tehsils' AND column_name = 'boundary'
    ) THEN
        ALTER TABLE tehsils ADD COLUMN boundary GEOMETRY(MultiPolygon, 4326);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'villages' AND column_name = 'boundary'
    ) THEN
        ALTER TABLE villages ADD COLUMN boundary GEOMETRY(MultiPolygon, 4326);
    END IF;
END $$;
