# BACKEND DATABASE AND DATA MODEL

## 1. Database Technology
- **Primary Database:** PostgreSQL via Supabase.
- **Geospatial Engine:** PostGIS. Note: The current `schema.sql` is missing the `GEOMETRY` types. This will be corrected in Phase 3.
- **Model:** LADM (ISO 19152) inspired.
- **Temporal Strategy:** Bi-temporal tracking (`valid_from`, `system_from`) is planned but currently only uses `created_at` / `updated_at`.

## 2. Core Tables and Relationships

### 2.1 Jurisdiction Hierarchy
Defines the spatial boundaries for role assignments.
- `states` -> `districts` -> `tehsils` -> `villages`

### 2.2 Roles and Users
- `departments`: Functional branches (e.g., Revenue, Survey).
- `government_roles`: The 14 system roles linked to a strict jurisdiction level.
- `citizens`: Basic auth table linking to Supabase Auth UUID. Contains PII (mobile, encrypted Aadhaar).
- `government_users`: Links Supabase Auth UUID to a specific role, department, and jurisdiction boundary.

### 2.3 Parcel Dossier (Projections)
The `parcels` table is the hub (using `ulpin` as the primary key).
All related information are projections (read-only copies from external systems).
- `parcels`: ULPIN, survey numbers, area, land use, (Pending PostGIS geometry).
- `ownership_records`: Names, khata numbers, share percentage.
- `encumbrances`: Mortgages, attachments.
- `restrictions`: Forest, tribal land boundaries.
- `court_cases`: Sub-judice matters related to the parcel.
- `tax_records`: ULB property tax status.

### 2.4 Workflows and Applications
- `mutations`: Tracks ownership change requests.
- `mutation_timeline`: State machine tracking (Step 1 to N).
- `applications`: Citizen requests for certificates (7/12, 8A).
- `grievances`: Citizen complaints linked to parcels/departments.

### 2.5 Security and Audit
- `audit_events`: Append-only ledger for tracking all write operations. (Will use PostgreSQL triggers for cryptographic hash chaining).

## 3. Data Governance Rules
- **Authoritative Data:** Land Stack NEVER modifies external systems. All parcel tables are projections.
- **Freshness:** Projections include provenance timestamps.
- **Soft Deletion:** Records should not be hard-deleted; instead, valid time ranges expire.
