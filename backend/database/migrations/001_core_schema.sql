-- =====================================================================
-- Migration 001: Core Production Schema for Land Stack (Consolidated)
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ---------------------------------------------------------------------
-- 1. JURISDICTIONS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS states (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    local_name VARCHAR(150),
    boundary GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS districts (
    code VARCHAR(20) PRIMARY KEY,
    state_code VARCHAR(10) NOT NULL REFERENCES states(code) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    local_name VARCHAR(150),
    boundary GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tehsils (
    code VARCHAR(20) PRIMARY KEY,
    district_code VARCHAR(20) NOT NULL REFERENCES districts(code) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    local_name VARCHAR(150),
    boundary GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS villages (
    code VARCHAR(20) PRIMARY KEY,
    tehsil_code VARCHAR(20) NOT NULL REFERENCES tehsils(code) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    local_name VARCHAR(150),
    pin_code VARCHAR(10),
    boundary GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 2. DEPARTMENTS & ROLES
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS departments (
    code VARCHAR(20) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    local_name VARCHAR(200),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS government_roles (
    role VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department_code VARCHAR(20) REFERENCES departments(code) ON DELETE SET NULL,
    level VARCHAR(50) NOT NULL, -- Village, Tehsil, Sub-Division, District, State, National
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 3. USERS (CITIZENS & GOVERNMENT OFFICERS)
-- ---------------------------------------------------------------------

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

CREATE TABLE IF NOT EXISTS government_users (
    id VARCHAR(50) PRIMARY KEY,
    auth_user_id UUID UNIQUE, -- Supabase auth.users reference
    name VARCHAR(150) NOT NULL,
    local_name VARCHAR(200),
    role VARCHAR(50) NOT NULL REFERENCES government_roles(role) ON DELETE RESTRICT,
    department_code VARCHAR(20) REFERENCES departments(code) ON DELETE SET NULL,
    designation VARCHAR(150) NOT NULL,
    state_code VARCHAR(10) REFERENCES states(code) ON DELETE SET NULL,
    district_code VARCHAR(20) REFERENCES districts(code) ON DELETE SET NULL,
    tehsil_code VARCHAR(20) REFERENCES tehsils(code) ON DELETE SET NULL,
    village_code VARCHAR(20) REFERENCES villages(code) ON DELETE SET NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mobile VARCHAR(25),
    office TEXT,
    active_context VARCHAR(100),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 4. PARCELS & 360° DOSSIER ENTITIES
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
    boundary GEOMETRY(Polygon, 4326),
    centroid GEOMETRY(Point, 4326),
    status VARCHAR(50) DEFAULT 'CLEAR',
    source VARCHAR(200),
    source_system VARCHAR(100),
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ownership_records (
    id VARCHAR(50) PRIMARY KEY,
    parcel_ulpin VARCHAR(50) NOT NULL REFERENCES parcels(ulpin) ON DELETE CASCADE,
    owner_id VARCHAR(50) REFERENCES citizens(id) ON DELETE SET NULL,
    owner_name VARCHAR(150) NOT NULL,
    khata_number VARCHAR(50),
    relation VARCHAR(100),
    share NUMERIC(6, 2) DEFAULT 100.00,
    aadhaar_status VARCHAR(50) DEFAULT 'Verified',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS encumbrances (
    id VARCHAR(50) PRIMARY KEY,
    parcel_ulpin VARCHAR(50) NOT NULL REFERENCES parcels(ulpin) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    bank_name VARCHAR(150),
    amount NUMERIC(15, 2),
    registered_date DATE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    discharge_date DATE,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS restrictions (
    id VARCHAR(50) PRIMARY KEY,
    parcel_ulpin VARCHAR(50) NOT NULL REFERENCES parcels(ulpin) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    authority VARCHAR(150),
    notification_number VARCHAR(100),
    notification_date DATE,
    description TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS zoning (
    id VARCHAR(50) PRIMARY KEY,
    parcel_ulpin VARCHAR(50) UNIQUE NOT NULL REFERENCES parcels(ulpin) ON DELETE CASCADE,
    master_plan VARCHAR(150),
    current_zone VARCHAR(100),
    permissible_uses JSONB DEFAULT '[]'::jsonb,
    max_fsi NUMERIC(5, 2),
    road_width_meters NUMERIC(6, 2),
    authority VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tax_records (
    id VARCHAR(50) PRIMARY KEY,
    parcel_ulpin VARCHAR(50) UNIQUE NOT NULL REFERENCES parcels(ulpin) ON DELETE CASCADE,
    assessment_year VARCHAR(20),
    annual_tax NUMERIC(12, 2),
    pending_dues NUMERIC(12, 2) DEFAULT 0,
    last_paid_date DATE,
    receipt_number VARCHAR(100),
    payment_status VARCHAR(50) DEFAULT 'PAID',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS court_cases (
    id VARCHAR(50) PRIMARY KEY,
    parcel_ulpin VARCHAR(50) NOT NULL REFERENCES parcels(ulpin) ON DELETE CASCADE,
    case_number VARCHAR(100) NOT NULL,
    court_name VARCHAR(150) NOT NULL,
    case_type VARCHAR(100),
    petitioner VARCHAR(150),
    respondent VARCHAR(150),
    filing_date DATE,
    next_hearing_date DATE,
    status VARCHAR(50) DEFAULT 'PENDING',
    stay_granted BOOLEAN DEFAULT FALSE,
    order_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS parcel_documents (
    id VARCHAR(50) PRIMARY KEY,
    parcel_ulpin VARCHAR(50) NOT NULL REFERENCES parcels(ulpin) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255),
    file_size VARCHAR(50),
    issue_date DATE,
    authority VARCHAR(150),
    verification_hash VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 5. MUTATIONS & WORKFLOWS
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
    status VARCHAR(50) DEFAULT 'PENDING',
    applied_date TIMESTAMPTZ DEFAULT NOW(),
    sla_days INTEGER DEFAULT 30,
    sla_deadline DATE,
    current_step INTEGER DEFAULT 1,
    total_steps INTEGER DEFAULT 6,
    remarks TEXT,
    tehsil_code VARCHAR(20) REFERENCES tehsils(code) ON DELETE SET NULL,
    village_code VARCHAR(20) REFERENCES villages(code) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mutation_timeline (
    id VARCHAR(50) PRIMARY KEY,
    mutation_id VARCHAR(50) NOT NULL REFERENCES mutations(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    officer_name VARCHAR(150),
    officer_role VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sro_audits (
    id VARCHAR(50) PRIMARY KEY,
    deed_number VARCHAR(100) UNIQUE NOT NULL,
    parcel_ulpin VARCHAR(50) NOT NULL REFERENCES parcels(ulpin) ON DELETE RESTRICT,
    sro_code VARCHAR(50) NOT NULL,
    registration_date TIMESTAMPTZ DEFAULT NOW(),
    buyer_name VARCHAR(150),
    seller_name VARCHAR(150),
    valuation_amount NUMERIC(15, 2),
    stamp_duty_paid NUMERIC(15, 2),
    status VARCHAR(50) DEFAULT 'AUDIT_PENDING',
    flags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 6. CITIZEN APPLICATIONS
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS application_types (
    code VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    fee NUMERIC(10, 2) DEFAULT 0,
    processing_time VARCHAR(50),
    required_documents JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(50) PRIMARY KEY,
    application_number VARCHAR(100) UNIQUE NOT NULL,
    type_code VARCHAR(50) NOT NULL REFERENCES application_types(code) ON DELETE RESTRICT,
    citizen_id VARCHAR(50) NOT NULL REFERENCES citizens(id) ON DELETE CASCADE,
    parcel_ulpin VARCHAR(50) REFERENCES parcels(ulpin) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'SUBMITTED',
    submission_date TIMESTAMPTZ DEFAULT NOW(),
    fee_amount NUMERIC(10, 2) DEFAULT 0,
    payment_status VARCHAR(50) DEFAULT 'PAID',
    tracking_history JSONB DEFAULT '[]'::jsonb,
    form_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 7. DOCUMENTS
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    parcel_ulpin VARCHAR(50) REFERENCES parcels(ulpin) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    type VARCHAR(100) NOT NULL,
    certificate_number VARCHAR(100),
    issued_by VARCHAR(150),
    issue_date DATE,
    file_url TEXT,
    verification_hash VARCHAR(100),
    valid_until DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 8. GRIEVANCES
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS grievances (
    id VARCHAR(50) PRIMARY KEY,
    grievance_number VARCHAR(100) UNIQUE NOT NULL,
    citizen_id VARCHAR(50) NOT NULL REFERENCES citizens(id) ON DELETE CASCADE,
    parcel_ulpin VARCHAR(50) REFERENCES parcels(ulpin) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'OPEN',
    filed_date TIMESTAMPTZ DEFAULT NOW(),
    department_code VARCHAR(20) REFERENCES departments(code) ON DELETE SET NULL,
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 9. NOTIFICATIONS & WATCHLIST
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    action_link VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS watchlist (
    id VARCHAR(50) PRIMARY KEY,
    citizen_id VARCHAR(50) NOT NULL REFERENCES citizens(id) ON DELETE CASCADE,
    parcel_ulpin VARCHAR(50) NOT NULL REFERENCES parcels(ulpin) ON DELETE CASCADE,
    label VARCHAR(150),
    notify_mutations BOOLEAN DEFAULT TRUE,
    notify_encumbrances BOOLEAN DEFAULT TRUE,
    notify_court_cases BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(citizen_id, parcel_ulpin)
);

-- ---------------------------------------------------------------------
-- 10. PUBLIC DATA
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS news (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    summary TEXT,
    content TEXT,
    published_date DATE DEFAULT CURRENT_DATE,
    source VARCHAR(150),
    tag VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notices (
    id VARCHAR(50) PRIMARY KEY,
    notice_number VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    parcel_ulpin VARCHAR(50) REFERENCES parcels(ulpin) ON DELETE SET NULL,
    village_code VARCHAR(20) REFERENCES villages(code) ON DELETE SET NULL,
    issue_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    description TEXT,
    authority VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS government_services (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    route VARCHAR(150),
    eligibility TEXT,
    fee VARCHAR(50),
    processing_time VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 11. AUDIT TRAIL (APPEND-ONLY)
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS audit_events (
    id BIGSERIAL PRIMARY KEY,
    event_hash VARCHAR(100),
    previous_hash VARCHAR(100),
    actor_id VARCHAR(50) NOT NULL,
    actor_role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100) NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 12. INDEXES
-- ---------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_parcels_survey ON parcels(survey_number);
CREATE INDEX IF NOT EXISTS idx_parcels_gat ON parcels(gat_number);
CREATE INDEX IF NOT EXISTS idx_parcels_village ON parcels(village_code);
CREATE INDEX IF NOT EXISTS idx_parcels_tehsil ON parcels(tehsil_code);
CREATE INDEX IF NOT EXISTS idx_parcels_district ON parcels(district_code);
CREATE INDEX IF NOT EXISTS idx_parcels_state ON parcels(state_code);
CREATE INDEX IF NOT EXISTS idx_ownership_parcel ON ownership_records(parcel_ulpin);
CREATE INDEX IF NOT EXISTS idx_ownership_owner ON ownership_records(owner_id);
CREATE INDEX IF NOT EXISTS idx_mutations_parcel ON mutations(parcel_ulpin);
CREATE INDEX IF NOT EXISTS idx_mutations_status ON mutations(status);
CREATE INDEX IF NOT EXISTS idx_mutations_tehsil ON mutations(tehsil_code);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_citizen ON watchlist(citizen_id);
CREATE INDEX IF NOT EXISTS idx_applications_citizen ON applications(citizen_id);
CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_grievances_citizen ON grievances(citizen_id);
CREATE INDEX IF NOT EXISTS idx_parcels_boundary_gist ON parcels USING GIST(boundary);
CREATE INDEX IF NOT EXISTS idx_parcels_centroid_gist ON parcels USING GIST(centroid);
