-- =====================================================================
-- LAND-STACK / BharatBhumi — Temporary Test Seed (PostgreSQL / Supabase)
-- Version: 2.0 (Strict Database-Backed Test Fixtures)
-- 
-- Test Marker: All temporary records use 'TEST_' prefix or test_run_id
-- Personas:
--   Citizens:
--     1. Abhishek Gujar (CIT-TEST-001)
--     2. Ankush Vishwakarma (CIT-TEST-002)
--     3. Priyanshu Manke (CIT-TEST-003)
--   Officers:
--     1. Vedika Kolhapure (GOV-TEST-001) - TEHSILDAR, Tehsil Haveli, Pune
--     2. Sayali Wadhai (GOV-TEST-002) - TALATHI, Wagholi Circle
--     3. Rekha Joshi (GOV-TEST-003) - SRO, Haveli No 5
--     4. Dr. Suhas Diwase (GOV-TEST-004) - COLLECTOR, Pune District
--     5. Anil Verma (GOV-TEST-011) - STATE_PMU, Maharashtra
--     6. Meera Sengupta (GOV-TEST-013) - NATIONAL_MONITOR
--     7. Manoj Tiwari (GOV-TEST-014) - ADMIN
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. SCHEMA INITIALIZATION (Idempotent: runs safely on clean or existing DB)
-- ---------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Jurisdictions
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

-- 2. Departments & Roles
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
    level VARCHAR(50) NOT NULL,
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Citizens & Officers
CREATE TABLE IF NOT EXISTS citizens (
    id VARCHAR(50) PRIMARY KEY,
    auth_user_id UUID UNIQUE,
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

ALTER TABLE citizens ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;

CREATE TABLE IF NOT EXISTS government_users (
    id VARCHAR(50) PRIMARY KEY,
    auth_user_id UUID UNIQUE,
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
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE government_users ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;

-- 4. Parcels & Sub-resources
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
    geometry GEOMETRY(Polygon, 4326),
    valid_from TIMESTAMPTZ,
    valid_to TIMESTAMPTZ,
    system_from TIMESTAMPTZ DEFAULT NOW(),
    system_to TIMESTAMPTZ,
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

-- 5. Mutations & Workflows
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

-- 6. Applications
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

-- 7. Documents, Grievances, Notifications, Watchlist
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

-- 8. Public Tables
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

-- 9. Audit Events
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

-- 10. Test Run Metadata Tracker
CREATE TABLE IF NOT EXISTS test_run_metadata (
    test_run_id VARCHAR(50) PRIMARY KEY,
    seeded_at TIMESTAMPTZ DEFAULT NOW(),
    description TEXT
);

INSERT INTO test_run_metadata (test_run_id, description)
VALUES ('TEST_RUN_2026', 'BharatBhumi automated database testing fixtures')
ON CONFLICT (test_run_id) DO NOTHING;

-- ---------------------------------------------------------------------
-- 11. BASE REFERENCE DATA (Jurisdictions & Roles)
-- ---------------------------------------------------------------------
INSERT INTO states (code, name, local_name) VALUES
('MH', 'Maharashtra', 'महाराष्ट्र'),
('RJ', 'Rajasthan', 'राजस्थान')
ON CONFLICT (code) DO NOTHING;

INSERT INTO districts (code, state_code, name, local_name) VALUES
('DIST-PUN', 'MH', 'Pune', 'पुणे'),
('DIST-NSK', 'MH', 'Nashik', 'नाशिक'),
('DIST-JPR', 'RJ', 'Jaipur', 'जयपुर')
ON CONFLICT (code) DO NOTHING;

INSERT INTO tehsils (code, district_code, name, local_name) VALUES
('TEH-HAV', 'DIST-PUN', 'Haveli', 'हवेली'),
('TEH-MUL', 'DIST-PUN', 'Mulshi', 'मुळशी'),
('TEH-AMB', 'DIST-JPR', 'Amber', 'आमेर')
ON CONFLICT (code) DO NOTHING;

INSERT INTO villages (code, tehsil_code, name, local_name, pin_code) VALUES
('VIL-WAG', 'TEH-HAV', 'Wagholi', 'वाघोली', '412207'),
('VIL-LOH', 'TEH-HAV', 'Lohegaon', 'लोहगाव', '411047'),
('VIL-MAN', 'TEH-HAV', 'Manjri Khurd', 'मांजरी खुर्द', '412307')
ON CONFLICT (code) DO NOTHING;

INSERT INTO departments (code, name, local_name, description) VALUES
('DEPT-REV', 'Revenue & Forest Department', 'महसूल व वन विभाग', 'Land records administration, mutation & survey'),
('DEPT-REG', 'Registration & Stamps (IGR)', 'नोंदणी व मुद्रांक विभाग', 'Property deeds registration and stamp duty'),
('DEPT-DIST', 'District Administration', 'जिल्हा प्रशासन', 'Collectorate executive magistrate functions'),
('DEPT-STATE', 'State Land Records PMU', 'राज्य भूमी अभिलेख प्रकल्प कक्ष', 'DILRMP implementation and state policy'),
('DEPT-NAT', 'Department of Land Resources (DoLR)', 'भूमी संसाधन विभाग', 'National cadastral standards and monitoring'),
('DEPT-ADMIN', 'NIC Land Records Division', 'एनआयसी भूमी अभिलेख कक्ष', 'IT infrastructure and cybersecurity')
ON CONFLICT (code) DO NOTHING;

INSERT INTO government_roles (role, name, department_code, level, permissions) VALUES
('TALATHI', 'Talathi / Patwari', 'DEPT-REV', 'Village', '["parcels.read", "mutations.read", "mutations.notice", "mutations.field_verify", "cases.read"]'::jsonb),
('TEHSILDAR', 'Tehsildar & Executive Magistrate', 'DEPT-REV', 'Tehsil', '["parcels.read", "mutations.read", "mutations.hearing", "mutations.approve", "mutations.reject", "cases.read", "cases.manage"]'::jsonb),
('SRO', 'Sub-Registrar of Assurances', 'DEPT-REG', 'Tehsil', '["parcels.read", "sro.read", "sro.audit", "cases.read"]'::jsonb),
('COLLECTOR', 'District Collector & Magistrate', 'DEPT-DIST', 'District', '["parcels.read", "analytics.district", "mutations.read", "audit.read"]'::jsonb),
('STATE_PMU', 'State PMU Project Director', 'DEPT-STATE', 'State', '["analytics.state", "analytics.benchmarks", "audit.read"]'::jsonb),
('NATIONAL_MONITOR', 'National Cadastral Monitor', 'DEPT-NAT', 'National', '["analytics.national", "analytics.benchmarks"]'::jsonb),
('ADMIN', 'System Administrator', 'DEPT-ADMIN', 'National', '["admin.all", "audit.read", "system.health"]'::jsonb)
ON CONFLICT (role) DO UPDATE SET name = EXCLUDED.name, department_code = EXCLUDED.department_code, level = EXCLUDED.level;

-- ---------------------------------------------------------------------
-- 12. TEST CITIZENS (Abhishek Gujar, Ankush Vishwakarma, Priyanshu Manke)
-- ---------------------------------------------------------------------
INSERT INTO citizens (id, name, local_name, state_code, mobile, email, aadhaar_hash, pan, address, kyc_verified, registered_at) VALUES
('TEST_CIT_001', 'Abhishek Gujar', 'अभिषेक गुजर', 'MH', '+91 98230 45891', 'abhishek.gujar@example.com', 'XXXX-XXXX-8912', 'ABCPG1234D', 'Gat No 42, Wagholi, Pune, Maharashtra 412207', TRUE, '2024-01-15T10:00:00Z'),
('TEST_CIT_002', 'Ankush Vishwakarma', 'अंकुश विश्वकर्मा', 'MH', '+91 98231 12345', 'ankush.vishwakarma@example.com', 'XXXX-XXXX-4519', 'BCDPV5678E', 'Flat 402, Wagholi Hills, Haveli, Pune 412207', TRUE, '2024-02-10T11:30:00Z'),
('TEST_CIT_003', 'Priyanshu Manke', 'प्रियांशू मानके', 'MH', '+91 98232 23456', 'priyanshu.manke@example.com', 'XXXX-XXXX-7821', 'CDERM9012F', 'Plot 18, Ubale Nagar, Wagholi, Pune 412207', TRUE, '2024-03-01T09:15:00Z')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, mobile = EXCLUDED.mobile, email = EXCLUDED.email;

-- ---------------------------------------------------------------------
-- 13. TEST OFFICERS (Vedika Kolhapure, Sayali Wadhai, Rekha Joshi, etc.)
-- ---------------------------------------------------------------------
INSERT INTO government_users (id, name, local_name, role, department_code, designation, state_code, district_code, tehsil_code, village_code, email, mobile, office, active) VALUES
('TEST_GOV_001', 'Vedika Kolhapure', 'वेदिका कोल्हापुरे', 'TEHSILDAR', 'DEPT-REV', 'Tehsildar & Executive Magistrate', 'MH', 'DIST-PUN', 'TEH-HAV', NULL, 'vedika.kolhapure@maharashtra.gov.in', '+91 94220 11001', 'Tehsildar Office, Haveli, Pune', TRUE),
('TEST_GOV_002', 'Sayali Wadhai', 'सायली वाढई', 'TALATHI', 'DEPT-REV', 'Talathi (Circle Wagholi)', 'MH', 'DIST-PUN', 'TEH-HAV', 'VIL-WAG', 'sayali.wadhai@maharashtra.gov.in', '+91 94220 11002', 'Talathi Office, Wagholi Circle', TRUE),
('TEST_GOV_003', 'Rekha Joshi', 'रेखा जोशी', 'SRO', 'DEPT-REG', 'Sub-Registrar of Assurances', 'MH', 'DIST-PUN', 'TEH-HAV', NULL, 'rekha.joshi@igrmaharashtra.gov.in', '+91 94220 11003', 'Sub-Registrar Office Haveli No 5', TRUE),
('TEST_GOV_004', 'Dr. Suhas Diwase', 'डॉ. सुहास दिवसे', 'COLLECTOR', 'DEPT-DIST', 'District Collector & District Magistrate', 'MH', 'DIST-PUN', NULL, NULL, 'collector.pune@maharashtra.gov.in', '+91 94220 11004', 'Collectorate Office, Pune', TRUE),
('TEST_GOV_011', 'Anil Verma', 'अनिल वर्मा', 'STATE_PMU', 'DEPT-STATE', 'State PMU Head — Maharashtra', 'MH', NULL, NULL, NULL, 'anil.verma@pmu.landrecords.gov.in', '+91 94220 11007', 'Settlement Commissionerate & Land Records, Pune', TRUE),
('TEST_GOV_013', 'Meera Sengupta', 'मीरा सेनगुप्ता', 'NATIONAL_MONITOR', 'DEPT-NAT', 'National Cadastral Monitoring Officer', NULL, NULL, NULL, NULL, 'meera.sengupta@dolr.gov.in', '+91 94220 11008', 'Department of Land Resources (DoLR), New Delhi', TRUE),
('TEST_GOV_014', 'Manoj Tiwari', 'मनोज तिवारी', 'ADMIN', 'DEPT-ADMIN', 'Land Stack System Administrator', NULL, NULL, NULL, NULL, 'admin.landstack@nic.in', '+91 94220 11009', 'NIC Land Records Division, New Delhi', TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, role = EXCLUDED.role;

-- ---------------------------------------------------------------------
-- 14. TEST PARCELS (Realistic Maharashtra/Pune/Wagholi Land Records)
-- ---------------------------------------------------------------------
-- Parcel 1: Sole ownership by Abhishek Gujar (Clear, Agricultural)
-- Parcel 2: Joint ownership (Abhishek Gujar 50% + Ankush Vishwakarma 50%) (Clear, Residential NA)
-- Parcel 3: Encumbered by Bank Mortgage (Ankush Vishwakarma) (Encumbered, Commercial NA)
-- Parcel 4: Under Government Irrigation Restriction (Priyanshu Manke) (Restricted)
-- Parcel 5: Associated with active Mutation & Court Dispute (Disputed)
INSERT INTO parcels (ulpin, survey_number, gat_number, khasra_number, cts_number, state_code, district_code, tehsil_code, village_code, village_name, area, area_unit, land_use, classification, geometry, status, source, source_system, last_updated) VALUES
('TEST_ULPIN_MH_PUN_001', '104', '42', '104/1', 'CTS-WAG-101', 'MH', 'DIST-PUN', 'TEH-HAV', 'VIL-WAG', 'Wagholi', 1.4500, 'Hectare', 'Agricultural', 'Jirayat', ST_SetSRID(ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[73.9810,18.5790],[73.9825,18.5790],[73.9825,18.5805],[73.9810,18.5805],[73.9810,18.5790]]]}'), 4326), 'CLEAR', 'e-Mahabhumi Digital Land Records', 'MAHA_REVENUE_DB', NOW()),
('TEST_ULPIN_MH_PUN_002', '108', '45', '108/2', 'CTS-WAG-102', 'MH', 'DIST-PUN', 'TEH-HAV', 'VIL-WAG', 'Wagholi', 0.8500, 'Hectare', 'Residential (NA)', 'Non-Agricultural', ST_SetSRID(ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[73.9830,18.5810],[73.9845,18.5810],[73.9845,18.5822],[73.9830,18.5822],[73.9830,18.5810]]]}'), 4326), 'CLEAR', 'e-Mahabhumi Digital Land Records', 'MAHA_REVENUE_DB', NOW()),
('TEST_ULPIN_MH_PUN_003', '112', '49', '112/A', 'CTS-WAG-103', 'MH', 'DIST-PUN', 'TEH-HAV', 'VIL-WAG', 'Wagholi', 2.1000, 'Hectare', 'Commercial (NA)', 'Non-Agricultural', ST_SetSRID(ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[73.9850,18.5825],[73.9870,18.5825],[73.9870,18.5840],[73.9850,18.5840],[73.9850,18.5825]]]}'), 4326), 'ENCUMBERED', 'e-Mahabhumi & CERSAI Registry', 'CERSAI_INTEGRATION', NOW()),
('TEST_ULPIN_MH_PUN_004', '120', '55', '120/1', 'CTS-WAG-104', 'MH', 'DIST-PUN', 'TEH-HAV', 'VIL-WAG', 'Wagholi', 3.4000, 'Hectare', 'Canal Buffer Zone', 'Irrigation Restricted Zone', ST_SetSRID(ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[73.9870,18.5840],[73.9890,18.5840],[73.9890,18.5860],[73.9870,18.5860],[73.9870,18.5840]]]}'), 4326), 'RESTRICTED', 'Water Resources Dept Maharashtra', 'IRRIGATION_DEPT_REGISTRY', NOW()),
('TEST_ULPIN_MH_PUN_005', '201', '78', '201/1', 'CTS-WAG-201', 'MH', 'DIST-PUN', 'TEH-HAV', 'VIL-WAG', 'Wagholi', 1.2000, 'Hectare', 'Residential (NA)', 'Non-Agricultural', ST_SetSRID(ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[73.9210,18.5910],[73.9230,18.5910],[73.9230,18.5925],[73.9210,18.5925],[73.9210,18.5910]]]}'), 4326), 'DISPUTED', 'e-Courts & Haveli Revenue Court', 'ECOURTS_INTEGRATION', NOW())
ON CONFLICT (ulpin) DO UPDATE SET status = EXCLUDED.status, area = EXCLUDED.area;

-- ---------------------------------------------------------------------
-- 15. TEST PARCEL 360° DOSSIER SUB-RESOURCES
-- ---------------------------------------------------------------------
-- Ownership
INSERT INTO ownership_records (id, parcel_ulpin, owner_id, owner_name, khata_number, relation, share, aadhaar_status) VALUES
('TEST_OWN_001', 'TEST_ULPIN_MH_PUN_001', 'TEST_CIT_001', 'Abhishek Gujar', 'KHATA-4201', 'Self / Primary Landholder', 100.00, 'Verified'),
('TEST_OWN_002', 'TEST_ULPIN_MH_PUN_002', 'TEST_CIT_001', 'Abhishek Gujar', 'KHATA-4501', 'Co-Owner (Joint Tenant)', 50.00, 'Verified'),
('TEST_OWN_003', 'TEST_ULPIN_MH_PUN_002', 'TEST_CIT_002', 'Ankush Vishwakarma', 'KHATA-4502', 'Co-Owner (Joint Tenant)', 50.00, 'Verified'),
('TEST_OWN_004', 'TEST_ULPIN_MH_PUN_003', 'TEST_CIT_002', 'Ankush Vishwakarma', 'KHATA-4901', 'Sole Proprietor', 100.00, 'Verified'),
('TEST_OWN_005', 'TEST_ULPIN_MH_PUN_004', 'TEST_CIT_003', 'Priyanshu Manke', 'KHATA-5501', 'Sole Titleholder', 100.00, 'Verified'),
('TEST_OWN_006', 'TEST_ULPIN_MH_PUN_005', 'TEST_CIT_001', 'Abhishek Gujar', 'KHATA-7801', 'Disputed Claimant', 100.00, 'Verified')
ON CONFLICT (id) DO NOTHING;

-- Encumbrances
INSERT INTO encumbrances (id, parcel_ulpin, type, bank_name, amount, registered_date, status, remarks) VALUES
('TEST_ENC_001', 'TEST_ULPIN_MH_PUN_003', 'Commercial Mortgage', 'State Bank of India — SME Branch Pune', 2500000.00, '2024-03-15', 'ACTIVE', 'Hypothecated against business credit facility #SBI-CRED-2024-9182')
ON CONFLICT (id) DO NOTHING;

-- Restrictions
INSERT INTO restrictions (id, parcel_ulpin, type, title, authority, notification_number, notification_date, description, status) VALUES
('TEST_RES_001', 'TEST_ULPIN_MH_PUN_004', 'Irrigation Buffer', 'Mutha Right Bank Canal Safety Buffer Zone', 'Maharashtra Water Resources Department', 'WRD-NOTIF-2023-881', '2023-11-20', 'No permanent RCC structure permissible within 50m of canal center line without NOC.', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- Zoning
INSERT INTO zoning (id, parcel_ulpin, master_plan, current_zone, permissible_uses, max_fsi, road_width_meters, authority) VALUES
('TEST_ZON_001', 'TEST_ULPIN_MH_PUN_001', 'PMRDA Comprehensive Development Plan 2041', 'Agricultural (Green Zone)', '["Agricultural", "Agro-processing", "Farm House (0.2 FSI)"]'::jsonb, 0.20, 9.00, 'Pune Metropolitan Region Development Authority (PMRDA)'),
('TEST_ZON_002', 'TEST_ULPIN_MH_PUN_002', 'PMRDA Comprehensive Development Plan 2041', 'Residential Zone (R-1)', '["Single Family Residential", "Group Housing", "Convenience Commercial"]'::jsonb, 1.10, 12.00, 'PMRDA'),
('TEST_ZON_003', 'TEST_ULPIN_MH_PUN_003', 'PMRDA Comprehensive Development Plan 2041', 'Commercial Zone (C-1)', '["Retail Showrooms", "IT / ITES Offices", "Warehouse"]'::jsonb, 2.00, 18.00, 'PMRDA'),
('TEST_ZON_004', 'TEST_ULPIN_MH_PUN_004', 'PMRDA Comprehensive Development Plan 2041', 'Protected Buffer / No-Development', '["Afforestation", "Landscaping", "Solar Parks (with NOC)"]'::jsonb, 0.05, 6.00, 'PMRDA & Irrigation Dept'),
('TEST_ZON_005', 'TEST_ULPIN_MH_PUN_005', 'PMRDA Comprehensive Development Plan 2041', 'Residential Zone (R-2)', '["High-density Housing", "Apartments"]'::jsonb, 1.40, 15.00, 'PMRDA')
ON CONFLICT (id) DO NOTHING;

-- Tax records
INSERT INTO tax_records (id, parcel_ulpin, assessment_year, annual_tax, pending_dues, last_paid_date, receipt_number, payment_status) VALUES
('TEST_TAX_001', 'TEST_ULPIN_MH_PUN_001', '2024-2025', 1200.00, 0.00, '2024-11-10', 'TAX-REC-2024-001', 'PAID'),
('TEST_TAX_002', 'TEST_ULPIN_MH_PUN_002', '2024-2025', 4500.00, 0.00, '2024-12-05', 'TAX-REC-2024-002', 'PAID'),
('TEST_TAX_003', 'TEST_ULPIN_MH_PUN_003', '2024-2025', 18000.00, 2500.00, '2024-06-18', 'TAX-REC-2024-003', 'PARTIAL_PENDING'),
('TEST_TAX_004', 'TEST_ULPIN_MH_PUN_004', '2024-2025', 800.00, 0.00, '2024-10-22', 'TAX-REC-2024-004', 'PAID'),
('TEST_TAX_005', 'TEST_ULPIN_MH_PUN_005', '2024-2025', 5200.00, 0.00, '2024-12-15', 'TAX-REC-2024-005', 'PAID')
ON CONFLICT (id) DO NOTHING;

-- Court Cases
INSERT INTO court_cases (id, parcel_ulpin, case_number, court_name, case_type, petitioner, respondent, filing_date, next_hearing_date, status, stay_granted, order_summary) VALUES
('TEST_CASE_001', 'TEST_ULPIN_MH_PUN_005', 'RCS-412/2024', 'Civil Court Junior Division Haveli, Pune', 'Civil Suit for Partition & Boundary Injunction', 'Priyanshu Manke', 'Abhishek Gujar', '2024-08-10', '2025-04-20', 'PENDING', TRUE, 'Interim status-quo order granted restraining alienation or mutation until spot panchnama verification.')
ON CONFLICT (id) DO NOTHING;

-- Parcel Documents
INSERT INTO parcel_documents (id, parcel_ulpin, title, type, file_name, file_size, issue_date, authority, verification_hash) VALUES
('TEST_PDOC_001', 'TEST_ULPIN_MH_PUN_001', 'Digital 7/12 RoR Extract', '7/12 Extract', '7_12_WAGHOLI_104_1.pdf', '245 KB', '2025-01-10', 'Revenue Dept Maharashtra (MahaBhulekh)', 'sha256-a1b2c3d4e5f6001'),
('TEST_PDOC_002', 'TEST_ULPIN_MH_PUN_001', 'Khata 8A Holding Certificate', '8A Extract', '8A_WAGHOLI_KHATA_4201.pdf', '180 KB', '2025-01-10', 'Revenue Dept Maharashtra (MahaBhulekh)', 'sha256-b2c3d4e5f6a1002'),
('TEST_PDOC_003', 'TEST_ULPIN_MH_PUN_002', 'Non-Agricultural Conversion Order (NA Sanction)', 'NA Order', 'NA_ORDER_HAVELI_108_2.pdf', '520 KB', '2024-06-15', 'Sub-Divisional Officer (SDO) Haveli', 'sha256-c3d4e5f6a1b2003'),
('TEST_PDOC_004', 'TEST_ULPIN_MH_PUN_003', 'CERSAI Charge Registration Certificate', 'CERSAI Certificate', 'CERSAI_CHARGE_SBI_49.pdf', '310 KB', '2024-03-20', 'CERSAI New Delhi', 'sha256-d4e5f6a1b2c3004')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------
-- 16. APPLICATION TYPES & APPLICATIONS
-- ---------------------------------------------------------------------
INSERT INTO application_types (code, title, category, description, fee, processing_time, required_documents) VALUES
('APPT_ROR_EXTRACT', 'Issuance of Digitally Signed 7/12 RoR & 8A Extract', 'Statutory Records', 'Official certified copy of Record of Rights pushed to citizen DigiLocker.', 20.00, 'Immediate (Instant Download)', '["Aadhaar OTP Authentication"]'::jsonb),
('APPT_ZONE_CERT', 'Zoning & Master Plan Clearance Certificate', 'Planning & Development', 'Official certificate detailing DP zoning, permissible FSI, and buffer restrictions.', 150.00, '3 Working Days', '["7/12 Extract", "Cadastral Map Extract"]'::jsonb),
('APPT_MUTATION_SALE', 'Online Sale Deed Land Rights Mutation (e-Ferfar)', 'Mutations', 'Statutory recording of land title transfer following registered sale deed at SRO.', 200.00, '15 Working Days (Statutory Notice Period)', '["Registered Sale Deed", "Index-II Extract", "Both Parties KYC"]'::jsonb),
('APPT_DEMARCATION', 'Cadastral Boundary Demarcation & Measurement', 'Survey & Demarcation', 'Field measurement and boundary demarcation by government survey team.', 1200.00, '21 Working Days', '["7/12 Extract", "Boundary Consent from Adjacent Owners"]'::jsonb),
('APPT_NON_AGRI', 'Permission for Non-Agricultural (NA) Land Conversion', 'Land Conversion', 'Section 44 MLRC statutory conversion from agricultural to residential/commercial use.', 5000.00, '45 Working Days', '["7/12 Extract", "Town Planning NOC", "Environmental Clearance"]'::jsonb)
ON CONFLICT (code) DO UPDATE SET title = EXCLUDED.title, fee = EXCLUDED.fee;

INSERT INTO applications (id, application_number, type_code, citizen_id, parcel_ulpin, status, submission_date, fee_amount, payment_status, tracking_history, form_data) VALUES
('TEST_APP_001', 'APP-2026-TEST-001', 'APPT_ROR_EXTRACT', 'TEST_CIT_001', 'TEST_ULPIN_MH_PUN_001', 'SUBMITTED', NOW() - INTERVAL '2 days', 20.00, 'PAID', '[{"status":"SUBMITTED","timestamp":"2025-01-14T10:00:00Z","remarks":"Application received online"}]'::jsonb, '{"purpose":"Bank loan application verification"}'::jsonb),
('TEST_APP_002', 'APP-2026-TEST-002', 'APPT_ZONE_CERT', 'TEST_CIT_002', 'TEST_ULPIN_MH_PUN_002', 'IN_REVIEW', NOW() - INTERVAL '5 days', 150.00, 'PAID', '[{"status":"SUBMITTED","timestamp":"2025-01-11T12:30:00Z"},{"status":"IN_REVIEW","timestamp":"2025-01-12T09:00:00Z","remarks":"Under verification by Town Planning Haveli"}]'::jsonb, '{"projectType":"Residential Construction"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------
-- 17. MUTATIONS (e-Ferfar Workflows & Statutory State Machine)
-- ---------------------------------------------------------------------
INSERT INTO mutations (id, mutation_number, parcel_ulpin, type, applicant_id, applicant_name, buyer_name, seller_name, status, applied_date, sla_days, sla_deadline, current_step, total_steps, remarks, tehsil_code, village_code) VALUES
('TEST_MUT_001', 'MUT-2026-TEST-001', 'TEST_ULPIN_MH_PUN_001', 'Sale Deed Mutation', 'TEST_CIT_001', 'Abhishek Gujar', 'Ankush Vishwakarma', 'Abhishek Gujar', 'PENDING', NOW() - INTERVAL '3 days', 15, (CURRENT_DATE + INTERVAL '12 days')::date, 1, 6, 'Initiated following SRO registered sale deed verification', 'TEH-HAV', 'VIL-WAG'),
('TEST_MUT_002', 'MUT-2026-TEST-002', 'TEST_ULPIN_MH_PUN_005', 'Partition / Heirship Mutation', 'TEST_CIT_001', 'Abhishek Gujar', 'Priyanshu Manke', 'Abhishek Gujar', 'FIELD_VERIFICATION', NOW() - INTERVAL '8 days', 30, (CURRENT_DATE + INTERVAL '22 days')::date, 3, 6, 'Field spot measurement ordered by Talathi', 'TEH-HAV', 'VIL-WAG')
ON CONFLICT (id) DO NOTHING;

INSERT INTO mutation_timeline (id, mutation_id, step_number, title, description, completed, active, completed_at, officer_name, officer_role) VALUES
('TEST_MUTSTEP_001_1', 'TEST_MUT_001', 1, 'Application Filed & Digital Token Created', 'Citizen submitted online mutation application with registered sale deed.', TRUE, FALSE, NOW() - INTERVAL '3 days', 'Abhishek Gujar', 'CITIZEN'),
('TEST_MUTSTEP_001_2', 'TEST_MUT_001', 2, 'Talathi Verification & Pencil Entry (कच्ची नोंद)', 'Talathi creates preliminary pencil entry in village Ferfar register.', FALSE, TRUE, NULL, 'Sayali Wadhai', 'TALATHI'),
('TEST_MUTSTEP_001_3', 'TEST_MUT_001', 3, 'Statutory 15-Day Public Notice Issue', 'Public notice dispatched to interested parties and posted on village notice board.', FALSE, FALSE, NULL, NULL, 'TALATHI'),
('TEST_MUTSTEP_001_4', 'TEST_MUT_001', 4, 'Objection Review Window', 'Statutory window for filing legal objections under Section 150 MLRC.', FALSE, FALSE, NULL, NULL, 'TALATHI'),
('TEST_MUTSTEP_001_5', 'TEST_MUT_001', 5, 'Circle Officer / Tehsildar Hearing & Sanction', 'Statutory executive magistrate sanction with digital signature.', FALSE, FALSE, NULL, 'Vedika Kolhapure', 'TEHSILDAR'),
('TEST_MUTSTEP_001_6', 'TEST_MUT_001', 6, 'Final RoR Update & DigiLocker Delivery (पक्की नोंद)', 'Pencil entry finalized into permanent MahaBhulekh 7/12 record.', FALSE, FALSE, NULL, NULL, 'SYSTEM'),

('TEST_MUTSTEP_002_1', 'TEST_MUT_002', 1, 'Application Filed', 'Partition application filed online', TRUE, FALSE, NOW() - INTERVAL '8 days', 'Abhishek Gujar', 'CITIZEN'),
('TEST_MUTSTEP_002_2', 'TEST_MUT_002', 2, 'Pencil Entry Created', 'Pencil entry recorded in Ferfar register', TRUE, FALSE, NOW() - INTERVAL '6 days', 'Sayali Wadhai', 'TALATHI'),
('TEST_MUTSTEP_002_3', 'TEST_MUT_002', 3, 'Field Spot Panchnama Verification', 'Physical verification of parcel boundaries in progress', FALSE, TRUE, NULL, 'Sayali Wadhai', 'TALATHI')
ON CONFLICT (id) DO NOTHING;

-- SRO Audits
INSERT INTO sro_audits (id, deed_number, parcel_ulpin, sro_code, registration_date, buyer_name, seller_name, valuation_amount, stamp_duty_paid, status, flags) VALUES
('TEST_AUDIT_001', 'TEST-DEED-HAV-2026-001', 'TEST_ULPIN_MH_PUN_001', 'TEH-HAV', NOW() - INTERVAL '4 days', 'Ankush Vishwakarma', 'Abhishek Gujar', 4500000.00, 315000.00, 'AUDIT_PENDING', '[]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------
-- 18. GRIEVANCES, WATCHLIST, NOTIFICATIONS, DOCUMENTS
-- ---------------------------------------------------------------------
INSERT INTO grievances (id, grievance_number, citizen_id, parcel_ulpin, category, subject, description, status, filed_date, department_code) VALUES
('TEST_GRV_001', 'GRV-2026-TEST-001', 'TEST_CIT_001', 'TEST_ULPIN_MH_PUN_001', 'Mutation Delay', 'Delay in statutory notice issuance for Mutation #MUT-2026-TEST-001', 'The application was submitted 3 days ago. Requesting expedite notice generation for Circle Wagholi.', 'OPEN', NOW() - INTERVAL '1 day', 'DEPT-REV')
ON CONFLICT (id) DO NOTHING;

INSERT INTO watchlist (id, citizen_id, parcel_ulpin, label, notify_mutations, notify_encumbrances, notify_court_cases) VALUES
('TEST_WCH_001', 'TEST_CIT_001', 'TEST_ULPIN_MH_PUN_001', 'Ancestral Agricultural Land (Gat 42)', TRUE, TRUE, TRUE),
('TEST_WCH_002', 'TEST_CIT_002', 'TEST_ULPIN_MH_PUN_002', 'Commercial Investment Plot (Gat 45)', TRUE, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO notifications (id, user_id, title, message, type, is_read, action_link) VALUES
('TEST_NOTIF_001', 'TEST_CIT_001', 'e-Ferfar Pencil Entry Created', 'Preliminary pencil entry recorded for Gat No 42, Wagholi under Mutation MUT-2026-TEST-001.', 'MUTATION', FALSE, '/citizen/mutations/TEST_MUT_001'),
('TEST_NOTIF_002', 'TEST_GOV_002', 'New Mutation in Wagholi Circle', 'New mutation application filed for ULPIN TEST_ULPIN_MH_PUN_001 pending your verification.', 'ALERT', FALSE, '/officer/cases/TEST_MUT_001')
ON CONFLICT (id) DO NOTHING;

INSERT INTO documents (id, user_id, parcel_ulpin, title, type, certificate_number, issued_by, issue_date, file_url, verification_hash, valid_until) VALUES
('TEST_DOC_001', 'TEST_CIT_001', 'TEST_ULPIN_MH_PUN_001', 'Certified 7/12 RoR Extract Certificate', 'RoR Extract', 'CERT-712-2025-9981', 'Tahsildar Haveli, Pune', CURRENT_DATE, 'https://storage.landstack.nic.in/docs/712_TEST_001.pdf', 'hash-cert-712-001', (CURRENT_DATE + INTERVAL '1 year')::date),
('TEST_DOC_002', 'TEST_CIT_002', 'TEST_ULPIN_MH_PUN_002', 'Zoning Clearance Certificate', 'Zoning Certificate', 'CERT-ZON-2025-4421', 'PMRDA Planning Division', CURRENT_DATE, 'https://storage.landstack.nic.in/docs/zon_TEST_002.pdf', 'hash-cert-zon-002', (CURRENT_DATE + INTERVAL '2 years')::date)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------
-- 19. PUBLIC DATA (News, Notices, Services)
-- ---------------------------------------------------------------------
INSERT INTO news (id, title, category, summary, content, published_date, source, tag) VALUES
('TEST_NEWS_001', 'BharatBhumi Platform Integrates Real-Time PostGIS Cadastral Bounding Box Queries', 'Digital Governance', 'Citizens and officers can now visually inspect parcel boundaries and spatial encumbrances directly on interactive satellite maps.', 'Full rollout of PostGIS cadastral layers across Haveli Tehsil...', CURRENT_DATE, 'Department of Land Resources', 'Feature')
ON CONFLICT (id) DO NOTHING;

INSERT INTO notices (id, notice_number, title, parcel_ulpin, village_code, issue_date, expiry_date, description, authority) VALUES
('TEST_NOT_001', 'NOT-2026-TEST-001', 'Statutory 15-Day Public Notice: Mutation #MUT-2026-TEST-001', 'TEST_ULPIN_MH_PUN_001', 'VIL-WAG', CURRENT_DATE, (CURRENT_DATE + INTERVAL '15 days')::date, 'Notice is hereby given that an application for transfer of rights by sale deed has been received for Survey 104, Gat 42 Wagholi.', 'Talathi Office Wagholi & Tehsildar Haveli')
ON CONFLICT (id) DO NOTHING;

INSERT INTO government_services (id, title, category, description, icon, route, eligibility, fee, processing_time) VALUES
('TEST_SRV_001', '7/12 & 8A RoR Download', 'Extracts & RoR', 'Download digitally signed land records verified with QR code.', '📜', '/citizen/applications', 'Any registered citizen with mobile number', '₹20', 'Instant'),
('TEST_SRV_002', 'Online e-Ferfar Mutation', 'Mutations', 'File statutory mutation application following registered property deed.', '🔄', '/citizen/mutations', 'Landholders and title claimants', '₹200', '15 Days')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------
-- 20. TEST AUDIT LOGS (Initial Seed Event)
-- ---------------------------------------------------------------------
INSERT INTO audit_events (actor_id, actor_role, action, resource_type, resource_id, payload, ip_address, user_agent) VALUES
('TEST_GOV_014', 'ADMIN', 'SEED_INITIALIZATION', 'TEST_DATASET', 'TEST_RUN_2026', '{"message":"Database seeded with verified test personas"}'::jsonb, '127.0.0.1', 'Node.js Test Runner')
ON CONFLICT DO NOTHING;

-- Verification query
SELECT 'TEST_SEED_SUCCESS' as status, COUNT(*) as total_test_parcels FROM parcels WHERE ulpin LIKE 'TEST_%';
