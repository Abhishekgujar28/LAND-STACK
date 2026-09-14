# 04 — Database, Data, and GIS Architecture

**Version**: 1.0 | **Date**: September 2026

---

## 1. Database Platform

| Property | Value | Status |
|----------|-------|--------|
| **Database** | PostgreSQL (via Supabase) | [CONFIRMED-CODE] |
| **Extensions** | `uuid-ossp`, `pgcrypto`, `postgis` | [CONFIRMED-CODE] in schema.sql |
| **Access** | Supabase JS Client (3 tiers: anon, admin, auth-client) | [CONFIRMED-CODE] |
| **RLS** | Enabled for security-sensitive tables | [CONFIRMED-CODE] in 002_rls_policies.sql |
| **Schema Version** | Managed via numbered migration files | [CONFIRMED-CODE] 3 migrations exist |

---

## 2. Complete Entity Catalog

### 2.1 Administrative Hierarchy (4 tables)

```
states → districts → tehsils → villages
```

| Table | Primary Key | Important Fields | Relationships | Status |
|-------|-------------|-----------------|---------------|--------|
| `states` | `code` (VARCHAR 10) | name, local_name | Parent of districts | [CONFIRMED-CODE] |
| `districts` | `code` (VARCHAR 20) | state_code (FK), name, local_name | state → district | [CONFIRMED-CODE] |
| `tehsils` | `code` (VARCHAR 20) | district_code (FK), name, local_name | district → tehsil | [CONFIRMED-CODE] |
| `villages` | `code` (VARCHAR 20) | tehsil_code (FK), name, local_name, pin_code | tehsil → village | [CONFIRMED-CODE] |

**Purpose**: Defines the complete administrative hierarchy. Every parcel, officer, and mutation references this hierarchy. Used for jurisdiction enforcement — a Talathi in `VIL-WAG` can only see parcels in that village.

**Data lifecycle**: Seed data. Changes only when administrative reorganization occurs.

---

### 2.2 Departments & Roles (2 tables)

| Table | Primary Key | Important Fields | Status |
|-------|-------------|-----------------|--------|
| `departments` | `code` (VARCHAR 20) | name, local_name, description | [CONFIRMED-CODE] |
| `government_roles` | `role` (VARCHAR 50) | name, department_code (FK), level, permissions (JSONB) | [CONFIRMED-CODE] |

**Purpose**: Defines government organizational structure and role capabilities. The `permissions` JSONB field in `government_roles` stores role-level permissions, supplemented by the code-level `ROLE_PERMISSIONS` in `core/permissions.js`.

---

### 2.3 Users (2 tables)

#### `citizens`

| Field | Type | Constraint | Purpose |
|-------|------|-----------|---------|
| `id` | VARCHAR(50) | PK | Citizen ID (e.g., CIT-001) |
| `name` | VARCHAR(150) | NOT NULL | Display name |
| `local_name` | VARCHAR(200) | — | Name in regional script |
| `state_code` | VARCHAR(10) | FK → states | Home state |
| `mobile` | VARCHAR(25) | UNIQUE, NOT NULL | Primary auth identifier |
| `email` | VARCHAR(150) | UNIQUE | Optional email |
| `aadhaar_hash` | VARCHAR(100) | — | SHA-256 hash (never plaintext) |
| `pan` | VARCHAR(20) | — | PAN number |
| `kyc_verified` | BOOLEAN | DEFAULT FALSE | KYC status |

**Who can read**: The citizen themselves (RLS), officers for official duties.
**Who can modify**: The citizen themselves (profile updates), admin.
**Auth link**: Matched by email/phone to Supabase Auth user.

#### `government_users`

| Field | Type | Constraint | Purpose |
|-------|------|-----------|---------|
| `id` | VARCHAR(50) | PK | Officer ID (e.g., GOV-001) |
| `name` | VARCHAR(150) | NOT NULL | Officer name |
| `role` | VARCHAR(50) | FK → government_roles, NOT NULL | Role code |
| `department_code` | VARCHAR(20) | FK → departments | Department |
| `designation` | VARCHAR(150) | NOT NULL | Official designation |
| `state_code` | VARCHAR(10) | FK → states | Jurisdiction state |
| `district_code` | VARCHAR(20) | FK → districts | Jurisdiction district |
| `tehsil_code` | VARCHAR(20) | FK → tehsils | Jurisdiction tehsil |
| `village_code` | VARCHAR(20) | FK → villages | Jurisdiction village |
| `email` | VARCHAR(150) | UNIQUE, NOT NULL | Auth identifier |
| `active` | BOOLEAN | DEFAULT TRUE | Active status |

**Jurisdiction**: The combination of state_code + district_code + tehsil_code + village_code defines the officer's jurisdiction boundary. A Talathi has all four; a Collector has state + district; a State PMU has only state.

---

### 2.4 Parcel 360° Entities (8 tables)

#### `parcels` — Core Parcel Record

| Field | Type | Purpose |
|-------|------|---------|
| `ulpin` | VARCHAR(50) PK | Universal Land Parcel Identification Number |
| `survey_number` | VARCHAR(50) | Survey number |
| `gat_number` | VARCHAR(50) | Gat number (Maharashtra) |
| `khasra_number` | VARCHAR(50) | Khasra number (Hindi belt) |
| `cts_number` | VARCHAR(50) | City Survey/Town Survey number (urban) |
| `state_code` → `village_code` | FKs | Administrative hierarchy |
| `area` | NUMERIC(12,4) | Area value |
| `area_unit` | VARCHAR(30) | Default: Hectare |
| `land_use` | VARCHAR(100) | Agricultural, Residential, Commercial, etc. |
| `classification` | VARCHAR(100) | Jirayat, Bagayat, NA, etc. |
| `latitude` / `longitude` | NUMERIC(10,6) | Centroid coordinates |
| `status` | VARCHAR(50) | CLEAR, DISPUTED, RESTRICTED, ENCUMBERED |
| `source` / `source_system` | VARCHAR | Provenance |

**Indexes** [CONFIRMED-CODE]: survey_number, gat_number, village_code, tehsil_code, district_code, state_code

**[MISSING]** No PostGIS `geometry` column exists despite PostGIS being enabled. Current spatial data is stored as lat/lng point only. See GIS section below.

#### `ownership_records` — Current Owners

| Field | Type | Purpose |
|-------|------|---------|
| `id` | VARCHAR(50) PK | Record ID |
| `parcel_ulpin` | VARCHAR(50) FK | Links to parcel |
| `owner_id` | VARCHAR(50) FK → citizens | Links to citizen (if registered) |
| `owner_name` | VARCHAR(150) | Owner name (may differ from citizen name) |
| `khata_number` | VARCHAR(50) | Khata/Khewat number |
| `share` | NUMERIC(6,2) | Ownership share (default 100) |
| `aadhaar_status` | VARCHAR(50) | Aadhaar verification status |

**Note**: Supports co-ownership via multiple records per parcel with different shares.

#### Other 360° Tables

| Table | Key Fields | Cardinality | Purpose |
|-------|-----------|-------------|---------|
| `encumbrances` | type, bank_name, amount, status (ACTIVE/DISCHARGED) | Many per parcel | Mortgages, charges, liens |
| `restrictions` | type (Tribal/Forest/CRZ/Acquisition), authority, status | Many per parcel | Legal restrictions |
| `zoning` | current_zone, master_plan, max_fsi, permissible_uses (JSONB) | One per parcel (UNIQUE) | Planning/zoning data |
| `tax_records` | assessment_year, annual_tax, pending_dues, payment_status | One per parcel (UNIQUE) | Property tax |
| `court_cases` | case_number, court_name, status, stay_granted | Many per parcel | Revenue/civil court cases |
| `parcel_documents` | title, type, file_name, verification_hash | Many per parcel | Certified documents |

---

### 2.5 Mutation Workflow (3 tables)

#### `mutations` — Main Mutation Record

| Field | Type | Purpose |
|-------|------|---------|
| `id` | VARCHAR(50) PK | Mutation ID |
| `mutation_number` | VARCHAR(100) UNIQUE | Display number |
| `parcel_ulpin` | FK (RESTRICT) | Target parcel |
| `type` | VARCHAR(100) | Sale Deed, Succession, Partition, Gift |
| `applicant_id` | VARCHAR(50) | Citizen who applied |
| `status` | VARCHAR(50) | 12-state machine value |
| `current_step` / `total_steps` | INTEGER | Progress tracking |
| `sla_days` / `sla_deadline` | INTEGER / DATE | SLA tracking |
| `tehsil_code` / `village_code` | FKs | Jurisdiction for officer assignment |

#### `mutation_timeline` — Step History

Each mutation has 6+ timeline entries tracking each step's completion, officer, and timestamp.

#### `sro_audits` — Registration Audit Records

Tracks deed registration events for SRO verification workflow.

---

### 2.6 Citizen Services (2 tables)

| Table | Purpose | Status |
|-------|---------|--------|
| `application_types` | Configurable catalog of available services (RoR extract, NEC, data correction) | [CONFIRMED-CODE] |
| `applications` | Citizen-submitted applications with status tracking and form data (JSONB) | [CONFIRMED-CODE] |

---

### 2.7 Support Entities

| Table | Purpose | Status |
|-------|---------|--------|
| `documents` | User-level document storage (certificates, copies) | [CONFIRMED-CODE] |
| `grievances` | Citizen grievance records with category, status, resolution | [CONFIRMED-CODE] |
| `notifications` | In-app notifications for all users | [CONFIRMED-CODE] |
| `watchlist` | Citizen parcel monitoring with alert preferences | [CONFIRMED-CODE] |

---

### 2.8 Public Data (3 tables)

| Table | Purpose | Status |
|-------|---------|--------|
| `news` | Platform news and announcements | [CONFIRMED-CODE] |
| `notices` | Official government notices (linked to parcels/villages) | [CONFIRMED-CODE] |
| `government_services` | Public service directory | [CONFIRMED-CODE] |

---

### 2.9 Audit Trail (1 table)

#### `audit_events` — Append-Only

| Field | Type | Purpose |
|-------|------|---------|
| `id` | BIGSERIAL PK | Auto-incrementing |
| `event_hash` | VARCHAR(100) | SHA-256 hash of event |
| `previous_hash` | VARCHAR(100) | Hash chain link |
| `actor_id` | VARCHAR(50) | Who performed the action |
| `actor_role` | VARCHAR(50) | Role at time of action |
| `action` | VARCHAR(100) | Action performed |
| `resource_type` / `resource_id` | VARCHAR | What was affected |
| `payload` | JSONB | Change details |
| `ip_address` / `user_agent` | VARCHAR / TEXT | Request context |

**Integrity**: RLS prevents UPDATE and DELETE on audit_events. Only INSERT allowed. Hash chain provides tamper evidence.

---

## 3. Entity Relationship Summary

```
states
  └── districts
       └── tehsils
            └── villages

citizens ←→ ownership_records ←→ parcels
                                    ├── encumbrances
                                    ├── restrictions
                                    ├── zoning (1:1)
                                    ├── tax_records (1:1)
                                    ├── court_cases
                                    ├── parcel_documents
                                    └── mutations
                                         └── mutation_timeline

government_users → government_roles → departments

applications → application_types
             → citizens
             → parcels

grievances → citizens → parcels
watchlist → citizens → parcels
notifications → users (citizen or officer)
audit_events (standalone, append-only)
```

---

## 4. Runtime Data Policy

### 4.1 Rule: Supabase PostgreSQL is the Single Runtime Source of Truth

```
Seed files / GeoJSON / CSV imports
        ↓
Seed scripts (database/run-seed.js, seed-canonical.js)
        ↓
Supabase PostgreSQL
        ↓
Backend services (via Supabase client)
        ↓
REST API responses
        ↓
Frontend application
```

**NOT**:
```
Frontend → JSON files → mockStore → fake data
```

### 4.2 Seed/Import Data

| Source | Format | Purpose | Status |
|--------|--------|---------|--------|
| `database/schema.sql` | SQL DDL | Table creation | [CONFIRMED-CODE] |
| `database/seed.sql` | SQL DML (64KB) | Sample data population | [CONFIRMED-CODE] |
| `database/seed-canonical.js` | Node.js script | Programmatic seed | [CONFIRMED-CODE] |
| `database/run-seed.js` | Node.js script | Seed execution runner | [CONFIRMED-CODE] |
| `migrations/001_core_schema.sql` | SQL DDL | Normalized schema (migration format) | [CONFIRMED-CODE] |
| `migrations/002_rls_policies.sql` | SQL | RLS policies | [CONFIRMED-CODE] |
| `migrations/003_seed_data.sql` | SQL DML | Minimal seed data | [CONFIRMED-CODE] |

**Rule**: Seed files are **input sources only**. They populate the database during setup/development. They must never be used as runtime data files by the application.

### 4.3 What Belongs in the Database (Runtime)

- Citizens and their profiles
- Government users, roles, and jurisdictions
- Parcels with all attributes
- Ownership records (current and historical)
- Encumbrances, restrictions, zoning, tax, court cases
- Mutations and their timeline
- Applications and their tracking
- Grievances
- Notifications
- Watchlist entries
- Documents metadata
- Audit events
- News, notices, government services
- GIS geometry data (target — see below)

### 4.4 What Remains as Files (Non-Runtime)

- GeoJSON source files for bulk import of parcel boundaries
- CSV exports for reporting
- Administrative boundary GeoJSON for initial loading
- Reference data catalogs that rarely change

---

## 5. GIS and Spatial Architecture

### 5.1 Current State

**[CONFIRMED-CODE]** PostGIS extension is enabled in the schema:
```sql
CREATE EXTENSION IF NOT EXISTS "postgis";
```

**[CONTRADICTORY]** Despite PostGIS being available, the `parcels` table stores spatial data as:
- `latitude NUMERIC(10,6)` — centroid point latitude
- `longitude NUMERIC(10,6)` — centroid point longitude

There are **no PostGIS geometry columns** anywhere in the schema. The GIS service (`gis.service.js`) generates default polygons around the centroid when real coordinates are missing.

**Current GIS operations** [CONFIRMED-CODE]:
- `GisService._toGeoJsonFeature()` — converts parcel record to GeoJSON Feature
- `GisService.getParcelGeoJson()` — returns single parcel as GeoJSON
- `GisService.getVillageCadastralMap()` — returns all parcels in a village as FeatureCollection
- `GisService.searchByBoundingBox()` — finds parcels within lat/lng bounds (point-based, NOT polygon-based)
- `GisService.validatePolygon()` — validates GeoJSON polygon structure

**Current limitation**: Bounding box search uses simple numeric comparisons on lat/lng columns, NOT PostGIS spatial operators.

### 5.2 Target GIS Architecture

**[PROPOSED]** The correct architecture uses PostGIS geometry columns:

#### Step 1: Add Geometry Columns to Schema

```sql
-- Add geometry columns to parcels
ALTER TABLE parcels ADD COLUMN IF NOT EXISTS 
  boundary GEOMETRY(Polygon, 4326);

ALTER TABLE parcels ADD COLUMN IF NOT EXISTS 
  centroid GEOMETRY(Point, 4326);

-- Create spatial indexes
CREATE INDEX IF NOT EXISTS idx_parcels_boundary_gist 
  ON parcels USING GIST(boundary);

CREATE INDEX IF NOT EXISTS idx_parcels_centroid_gist 
  ON parcels USING GIST(centroid);
```

#### Step 2: Administrative Boundary Geometry

```sql
-- Add boundary geometry to administrative tables
ALTER TABLE states ADD COLUMN IF NOT EXISTS 
  boundary GEOMETRY(MultiPolygon, 4326);

ALTER TABLE districts ADD COLUMN IF NOT EXISTS 
  boundary GEOMETRY(MultiPolygon, 4326);

ALTER TABLE tehsils ADD COLUMN IF NOT EXISTS 
  boundary GEOMETRY(MultiPolygon, 4326);

ALTER TABLE villages ADD COLUMN IF NOT EXISTS 
  boundary GEOMETRY(MultiPolygon, 4326);
```

#### Step 3: GeoJSON Import Pipeline

```
GeoJSON / Shapefile source data
        ↓
Validated import script (check SRID, validate polygons, topology)
        ↓
PostGIS geometry columns (SRID 4326 = WGS84)
        ↓
Spatial indexes (GiST)
        ↓
Backend GIS service (ST_AsGeoJSON, ST_Contains, ST_Intersects)
        ↓
API returns GeoJSON FeatureCollections
        ↓
Frontend renders on Leaflet/MapLibre map
```

#### Step 4: Spatial Queries

Replace current simple lat/lng comparisons with proper PostGIS queries:

```sql
-- Point-in-polygon (map click search)
SELECT ulpin, ST_AsGeoJSON(boundary) as geometry
FROM parcels 
WHERE ST_Contains(boundary, ST_SetSRID(ST_MakePoint($lng, $lat), 4326));

-- Bounding box search
SELECT ulpin, ST_AsGeoJSON(boundary) as geometry
FROM parcels 
WHERE boundary && ST_MakeEnvelope($minLng, $minLat, $maxLng, $maxLat, 4326);

-- Adjacent parcels
SELECT ulpin, ST_AsGeoJSON(boundary) as geometry
FROM parcels 
WHERE ST_Touches(boundary, (SELECT boundary FROM parcels WHERE ulpin = $ulpin));

-- Area calculation from geometry
SELECT ulpin, ST_Area(boundary::geography) as area_sqm
FROM parcels WHERE ulpin = $ulpin;
```

### 5.3 GIS Technical Decisions

| Decision | Value | Rationale |
|----------|-------|-----------|
| **SRID** | 4326 (WGS84) | Standard for web mapping; GPS-compatible |
| **Geometry type** | Polygon for parcels, MultiPolygon for boundaries | Parcels are single polygons; admin boundaries may have islands |
| **Storage** | PostGIS native geometry columns | Enables spatial indexing, topology validation, spatial joins |
| **Output** | GeoJSON via `ST_AsGeoJSON()` | Standard format for web mapping libraries |
| **Indexing** | GiST spatial indexes | Required for performant spatial queries |
| **Validation** | `ST_IsValid()`, `ST_MakeValid()` | Ensure polygon validity on import |
| **Coordinate precision** | 6 decimal places (~0.11m precision) | Sufficient for cadastral purposes |
| **Tile serving** | [PROPOSED] pg_tileserv or Martin for MVT tiles | For large-scale map rendering |

### 5.4 Large Dataset Considerations

For production with millions of parcels:

1. **Vector tiles (MVT)** instead of full GeoJSON for map rendering
2. **Simplified geometries** (`ST_Simplify()`) for zoom levels < 15
3. **Clustering** for overview zoom levels
4. **Spatial partitioning** by state/district if needed
5. **PostGIS topology** for ensuring no gaps/overlaps between adjacent parcels
6. **Materialized views** for pre-computed analytics (area by district, etc.)

---

## 6. Row Level Security (RLS)

**[CONFIRMED-CODE]** RLS policies defined in `002_rls_policies.sql`:

| Table | Policy | Condition |
|-------|--------|-----------|
| `citizens` | Citizens read own profile | `auth.uid() = auth_user_id` |
| `citizens` | Officers read for duties | Officer exists in officers table |
| `parcels` | Anyone can view | `TRUE` (public data) |
| `mutations` | Citizens view own | `applicant_id = get_current_citizen_id()` |
| `mutations` | Officers view in jurisdiction | Talathi: village match; Tehsildar: tehsil match |
| `applications` | Citizens view/create own | `citizen_id = get_current_citizen_id()` |
| `notifications` | Users view own | recipient matches citizen or officer ID |
| `audit_events` | Officers can view | Officer exists |
| `audit_events` | No UPDATE/DELETE | REVOKE enforced |

**[CONTRADICTORY]** RLS policies reference `auth_user_id` column on `citizens` and `officers` tables, but the main `schema.sql` does not include this column. The migration `001_core_schema.sql` likely defines a different schema. This means RLS may not function correctly with the current schema.

---

## 7. Schema Conflicts

| Issue | `schema.sql` | `001_core_schema.sql` | `002_rls_policies.sql` | Resolution |
|-------|-------------|----------------------|----------------------|------------|
| Citizens table name | `citizens` | May differ | References `citizens` | Verify migration matches schema.sql |
| `auth_user_id` column | Not present | Unknown | Required by RLS | Must add `auth_user_id` linking to `auth.users` |
| Officers table name | `government_users` | Unknown | References `officers` | Standardize to one name |
| Audit table name | `audit_events` | Unknown | References `audit_logs` | Standardize to one name |

**[CONTRADICTORY]** Multiple naming conflicts exist between `schema.sql` and the RLS migration. These must be resolved for RLS to function.

---

*This document defines the complete data model, database policies, and GIS architecture.*
