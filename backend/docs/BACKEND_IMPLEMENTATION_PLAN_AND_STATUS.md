# BACKEND IMPLEMENTATION PLAN AND STATUS

## 1. Current Backend Health & Audit Report
**Date:** September 2026
**Status:** Incomplete Prototype (Refactoring Required)

### 1.1 Documentation vs Code Contradictions
- **TypeScript:** The documentation (main-docs) claims the backend uses TypeScript. The actual codebase is 100% plain JavaScript (ES Modules).
- **PostGIS:** The documentation claims PostGIS is used for spatial queries. The `schema.sql` only has NUMERIC `latitude` and `longitude` columns, completely lacking PostGIS `GEOMETRY` columns and spatial indexes.
- **Bi-Temporal Modeling:** The documentation claims bi-temporal data modeling (`valid_time`, `system_time`). The actual schema only has basic `created_at` and `updated_at`.
- **Database Projections:** The documentation strictly specifies `ror_projections` for read-only projected data. The actual schema uses a generic `parcels` table without strong provenance linking.

### 1.2 Structural & Architectural Issues
- **Fragmented Routing:** The application uses a hybrid approach. It has a `modules/` folder for Domain-Driven Design (e.g., `modules/auth`, `modules/parcels`), but also retains a legacy flat structure (`controllers/`, `routes/`, `services/`) for features like `grievance` and `watchlist`.
- **Empty Modules:** Most of the 13 folders in `src/modules/` contain empty files or do not exist (e.g., `analytics`, `applications`, `audit`).

### 1.3 Security & Role Mismatches
- **Role Constants:** `src/core/permissions.js` defines the 14 standard roles correctly. However, we must ensure these are properly enforced across all routes using `requireRole` and `requireJurisdiction`.
- **Audit Logging:** The `audit_events` table exists, but there is no mechanism (like PostgreSQL triggers) in `schema.sql` to enforce append-only guarantees or generate cryptographic hash chains.

---

## 2. Reconstruction Roadmap (Phases 0 - 17)

### Phase 0 — Repository and Documentation Audit
- [x] Complete code inspection and write Master Documentation files.

### Phase 1 — Architecture and Folder Cleanup
- [ ] Migrate all flat-structure code (`src/routes`, `src/controllers`, `src/services`) into the Modular Monolith structure (`src/modules/`).
- [ ] Standardize ES Modules imports.
- [ ] Align with TypeScript (or explicitly document that it is JS). *Decision: We will migrate to TypeScript to match documentation.*

### Phase 2 — Configuration Foundation
- [ ] Set up standardized `env` validation using Zod.
- [ ] Configure Supabase client securely.

### Phase 3 — Database Foundation
- [ ] Rewrite `schema.sql` to include PostGIS `GEOMETRY` columns.
- [ ] Implement Bi-Temporal tracking (`valid_from`, `system_from`).
- [ ] Implement append-only cryptographic hash chaining for `audit_events` via PostgreSQL triggers.

### Phase 4 — Authentication
- [ ] Supabase Auth integration (OTP/Email).
- [ ] Authentication middleware (`requireAuth`).

### Phase 5 — Authorization/RBAC/Jurisdiction
- [ ] Express Middleware for RBAC.
- [ ] `requireJurisdiction` implementation mapping to state, district, tehsil, village.

### Phase 6 — Core Parcel Domain
- [ ] `parcels` and `ownership_records` read models with provenance.

### Phase 7 — GIS/PostGIS
- [ ] GeoJSON APIs, spatial queries (bounding box, point-in-polygon).

### Phase 8 — Parcel 360/Read Models
- [ ] Assemble the full dossier API (ownership, encumbrances, courts).

### Phase 9 — Workflows
- [ ] Mutation engine, state machine transitions.

### Phase 10 — Documents/Watchlists/Notifications
- [ ] Implement `src/modules/documents` and `src/modules/notifications`.

### Phase 11 — External Integrations
- [ ] Mock adapters for RoR and NGDRS.

### Phase 12 — Synchronization/Events/Background Jobs
- [ ] Supabase Realtime Outbox pattern.

### Phase 13 — AI Advisory
- [ ] AI integration stubs (advisory only, explicit labels).

### Phase 14 — Analytics/MIS
- [ ] Drill-down APIs based on jurisdiction.

### Phase 15 — Frontend/Backend Contract Alignment
- [ ] Ensure API shapes match React 19/Vite 8 frontend expectations.

### Phase 16 — Testing/Security Hardening
- [ ] Write tests, configure rate limiting.

### Phase 17 — Final Verification
- [ ] Complete end-to-end tests.
