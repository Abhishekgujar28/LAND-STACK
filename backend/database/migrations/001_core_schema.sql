-- =====================================================================
-- Migration 001: Core Production Schema for Land Stack
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Try enabling PostGIS if supported in environment
DO $$
BEGIN
    CREATE EXTENSION IF NOT EXISTS "postgis";
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'PostGIS extension could not be enabled; continuing with numeric lat/lng.';
END $$;

-- ---------------------------------------------------------------------
-- 1. JURISDICTIONS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS states (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    local_name VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS districts (
    code VARCHAR(20) PRIMARY KEY,
    state_code VARCHAR(10) NOT NULL REFERENCES states(code) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    local_name VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tehsils (
    code VARCHAR(20) PRIMARY KEY,
    district_code VARCHAR(20) NOT NULL REFERENCES districts(code) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    local_name VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS villages (
    code VARCHAR(20) PRIMARY KEY,
    tehsil_code VARCHAR(20) NOT NULL REFERENCES tehsils(code) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    local_name VARCHAR(150),
    pin_code VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 2. AUTHENTICATION & PROFILES
-- ---------------------------------------------------------------------

-- Citizens (Phone / OTP + Aadhaar KYC)
CREATE TABLE IF NOT EXISTS citizens (
    id VARCHAR(50) PRIMARY KEY,
    auth_user_id UUID UNIQUE, -- Supabase auth.users reference
    name VARCHAR(150) NOT NULL,
    local_name VARCHAR(200),
    state_code VARCHAR(10) REFERENCES states(code) ON DELETE SET NULL,
    mobile VARCHAR(25) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE,
    aadhaar_hash VARCHAR(100),
    pan VARCHAR(20),
    address TEXT,
    kyc_verified BOOLEAN DEFAULT FALSE,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Officers (Government Email + Password + Class-3 DSC)
CREATE TABLE IF NOT EXISTS officers (
    id VARCHAR(50) PRIMARY KEY,
    auth_user_id UUID UNIQUE, -- Supabase auth.users reference
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL, -- TALATHI, TAHSILDAR, SDO, COLLECTOR, SUB_REGISTRAR, ADMIN
    department_code VARCHAR(20) DEFAULT 'REV',
    designation VARCHAR(150) NOT NULL,
    state_code VARCHAR(10) REFERENCES states(code) ON DELETE SET NULL,
    district_code VARCHAR(20) REFERENCES districts(code) ON DELETE SET NULL,
    tehsil_code VARCHAR(20) REFERENCES tehsils(code) ON DELETE SET NULL,
    village_code VARCHAR(20) REFERENCES villages(code) ON DELETE SET NULL,
    active_context VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Officer Multi-Role & Multi-Jurisdiction Assignments
CREATE TABLE IF NOT EXISTS officer_assignments (
    id VARCHAR(50) PRIMARY KEY,
    officer_id VARCHAR(50) NOT NULL REFERENCES officers(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    jurisdiction_type VARCHAR(20) NOT NULL, -- VILLAGE, TEHSIL, DISTRICT, STATE
    jurisdiction_code VARCHAR(20) NOT NULL,
    state_code VARCHAR(10) REFERENCES states(code) ON DELETE SET NULL,
    district_code VARCHAR(20) REFERENCES districts(code) ON DELETE SET NULL,
    tehsil_code VARCHAR(20) REFERENCES tehsils(code) ON DELETE SET NULL,
    village_code VARCHAR(20) REFERENCES villages(code) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- ---------------------------------------------------------------------
-- 3. PARCELS & 360° REGISTER
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS parcels (
    ulpin VARCHAR(50) PRIMARY KEY,
    survey_number VARCHAR(50),
    gat_number VARCHAR(50),
    khasra_number VARCHAR(50),
    cts_number VARCHAR(50),
    state_code VARCHAR(10) REFERENCES states(code) ON DELETE SET NULL,
    district_code VARCHAR(20) REFERENCES districts(code) ON DELETE SET NULL,
    tehsil_code VARCHAR(20) REFERENCES tehsils(code) ON DELETE SET NULL,
    village_code VARCHAR(20) REFERENCES villages(code) ON DELETE SET NULL,
    village_name VARCHAR(100),
    area NUMERIC(12, 4) NOT NULL,
    area_unit VARCHAR(30) DEFAULT 'Hectare',
    land_use VARCHAR(100),
    classification VARCHAR(100),
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    boundary_coordinates JSONB,
    current_owner VARCHAR(200),
    status VARCHAR(50) DEFAULT 'CLEAR', -- CLEAR, DISPUTED, RESTRICTED, ENCUMBERED
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ownership_records (
    id VARCHAR(50) PRIMARY KEY,
    parcel_ulpin VARCHAR(50) NOT NULL REFERENCES parcels(ulpin) ON DELETE CASCADE,
    owner_id VARCHAR(50) REFERENCES citizens(id) ON DELETE SET NULL,
    owner_name VARCHAR(150) NOT NULL,
    khata_number VARCHAR(50),
    share NUMERIC(6, 2) DEFAULT 100.00,
    aadhaar_status VARCHAR(50) DEFAULT 'Verified',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS encumbrances (
    id VARCHAR(50) PRIMARY KEY,
    parcel_ulpin VARCHAR(50) NOT NULL REFERENCES parcels(ulpin) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    bank_name VARCHAR(150),
    amount NUMERIC(15, 2),
    registered_date DATE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS restrictions (
    id VARCHAR(50) PRIMARY KEY,
    parcel_ulpin VARCHAR(50) NOT NULL REFERENCES parcels(ulpin) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    authority VARCHAR(150),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS court_cases (
    id VARCHAR(50) PRIMARY KEY,
    parcel_ulpin VARCHAR(50) NOT NULL REFERENCES parcels(ulpin) ON DELETE CASCADE,
    case_number VARCHAR(100) NOT NULL,
    court_name VARCHAR(150) NOT NULL,
    case_type VARCHAR(100),
    petitioner VARCHAR(150),
    respondent VARCHAR(150),
    status VARCHAR(50) DEFAULT 'PENDING',
    stay_granted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 4. 12-STATE MUTATION WORKFLOW
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mutations (
    id VARCHAR(50) PRIMARY KEY,
    mutation_number VARCHAR(100) UNIQUE NOT NULL,
    parcel_ulpin VARCHAR(50) NOT NULL REFERENCES parcels(ulpin) ON DELETE RESTRICT,
    type VARCHAR(100) NOT NULL,
    applicant_id VARCHAR(50),
    applicant_name VARCHAR(150) NOT NULL,
    buyer_name VARCHAR(150),
    seller_name VARCHAR(150),
    status VARCHAR(50) DEFAULT 'INITIATED',
    filing_date DATE DEFAULT CURRENT_DATE,
    sanction_date DATE,
    sanctioned_by VARCHAR(150),
    sla_days INTEGER DEFAULT 30,
    sla_deadline DATE,
    remarks TEXT,
    village_code VARCHAR(20) REFERENCES villages(code) ON DELETE SET NULL,
    tehsil_code VARCHAR(20) REFERENCES tehsils(code) ON DELETE SET NULL,
    district_code VARCHAR(20) REFERENCES districts(code) ON DELETE SET NULL,
    state_code VARCHAR(10) REFERENCES states(code) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mutation_objections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mutation_id VARCHAR(50) NOT NULL REFERENCES mutations(id) ON DELETE CASCADE,
    objector_name VARCHAR(150) NOT NULL,
    objection_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    evidence_docs JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'PENDING',
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mutation_hearings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mutation_id VARCHAR(50) NOT NULL REFERENCES mutations(id) ON DELETE CASCADE,
    scheduled_date TIMESTAMPTZ NOT NULL,
    venue VARCHAR(200) NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 5. CITIZEN APPLICATIONS & DOCUMENTS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS application_types (
    code VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    sla_days INTEGER DEFAULT 15,
    fee NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(50) PRIMARY KEY,
    application_number VARCHAR(100) UNIQUE NOT NULL,
    type_code VARCHAR(50) NOT NULL REFERENCES application_types(code) ON DELETE RESTRICT,
    citizen_id VARCHAR(50) NOT NULL,
    parcel_ulpin VARCHAR(50) REFERENCES parcels(ulpin) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'SUBMITTED',
    submission_date TIMESTAMPTZ DEFAULT NOW(),
    fee_amount NUMERIC(10, 2) DEFAULT 0,
    payment_status VARCHAR(50) DEFAULT 'PAID',
    form_data JSONB DEFAULT '{}'::jsonb,
    sla_days INTEGER DEFAULT 15,
    sla_deadline DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    parcel_ulpin VARCHAR(50) REFERENCES parcels(ulpin) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    type VARCHAR(100) NOT NULL,
    file_url TEXT NOT NULL,
    storage_path TEXT,
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    verified BOOLEAN DEFAULT FALSE,
    verified_by VARCHAR(50),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 6. NOTIFICATIONS & AUDIT LOGS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id VARCHAR(50) NOT NULL,
    recipient_type VARCHAR(20) DEFAULT 'CITIZEN',
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'SYSTEM',
    entity_type VARCHAR(50),
    entity_id VARCHAR(100),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    actor_id VARCHAR(50) NOT NULL,
    actor_type VARCHAR(20) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    actor_context VARCHAR(100),
    ip_address VARCHAR(50),
    user_agent TEXT,
    state_before JSONB,
    state_after JSONB,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
