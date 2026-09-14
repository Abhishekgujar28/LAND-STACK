# 02 — Users, Features, and Workflows

**Version**: 1.0 | **Date**: September 2026

---

## 1. User Roles Matrix

| Role | Code | Portal | Auth Method | Jurisdiction Level | Database Table | Status |
|------|------|--------|-------------|-------------------|----------------|--------|
| Citizen / Landholder | `CITIZEN` | `/citizen/*` | Mobile OTP (Supabase Auth) | Personal (own records) | `citizens` | [CONFIRMED-CODE] |
| Talathi / Patwari | `TALATHI` / `PATWARI` | `/government/talathi` | Email + Password (Supabase Auth) | Village / Circle | `government_users` | [CONFIRMED-CODE] |
| Tehsildar / CRO | `TEHSILDAR` / `CRO` | `/government/tehsildar` | Email + Password + MFA | Tehsil | `government_users` | [CONFIRMED-CODE] |
| Sub-Registrar (SRO) | `SRO` | `/government/registration` | Email + Password | Sub-Registrar zone | `government_users` | [CONFIRMED-CODE] |
| Survey / GIS Officer | `SURVEY_GIS` | — (no workspace yet) | Email + Password | District / State | `government_users` | [CONFIRMED-CODE] role, [MISSING] frontend |
| ULB Officer | `ULB_OFFICER` | — (no workspace yet) | Email + Password | Municipal area | `government_users` | [CONFIRMED-CODE] role, [MISSING] frontend |
| District Collector | `COLLECTOR` | `/government/district` | Email + Password + MFA | District | `government_users` | [CONFIRMED-CODE] |
| State PMU Head | `STATE_PMU` | `/government/state` | Email + Password | State | `government_users` | [CONFIRMED-CODE] |
| National Monitor (DoLR) | `NATIONAL_MONITOR` | `/government/national` | Email + Password | National | `government_users` | [CONFIRMED-CODE] |
| System Administrator | `ADMIN` | `/government/admin` | Email + Password + MFA | Platform-wide | `government_users` | [CONFIRMED-CODE] |
| Auditor | `AUDITOR` | — (no workspace yet) | Email + Password | Varies | `government_users` | [CONFIRMED-CODE] role definition, [MISSING] frontend |
| Public (unauthenticated) | — | `/` | None | None | — | [CONFIRMED-CODE] |

---

## 2. Feature Specifications

### 2.1 Citizen Portal Features

---

#### F-CIT-01: Citizen Dashboard

- **Purpose**: Central hub showing owned parcels summary, active mutations, recent notifications, and quick actions
- **User**: Citizen
- **Frontend Page**: `pages/citizen/CitizenDashboard.jsx` [CONFIRMED-CODE]
- **Route**: `/citizen/dashboard`
- **API Dependencies**: `GET /api/v1/auth/me`, `GET /api/v1/parcels` (owner-filtered), `GET /api/v1/mutations` (citizen-filtered), `GET /api/v1/notifications`
- **Permissions**: `parcel.search`, `parcel.view.full`, `notification.view`
- **Status**: [CONFIRMED-CODE] Page exists (27KB). Currently uses backend APIs.

---

#### F-CIT-02: Parcel Search

- **Purpose**: Find any parcel by ULPIN, survey/gat/khasra number, village, district, or keyword
- **User**: Citizen, Public (limited)
- **Frontend Page**: `pages/citizen/ParcelSearchPage.jsx` [CONFIRMED-CODE] (41KB — largest citizen page)
- **Route**: `/citizen/search`
- **API Dependencies**: `GET /api/v1/parcels?search={query}&district={code}&village={code}&status={status}`
- **Backend Service**: `parcelService.searchParcels()` — cursor-based pagination against PostgreSQL [CONFIRMED-CODE]
- **Permissions**: `parcel.search`, `parcel.view.public`
- **Status**: [CONFIRMED-CODE] Fully database-backed. Supports search, district/village/status filters, cursor pagination.

---

#### F-CIT-03: Parcel 360° View

- **Purpose**: Complete composite title dossier — overview, map, ownership, encumbrances, restrictions, zoning, tax, courts, documents, data health
- **User**: Citizen (filtered view), Government Officer (full view)
- **Frontend Page**: `pages/citizen/Parcel360Page.jsx` [CONFIRMED-CODE]
- **Route**: `/citizen/parcels/:id`
- **API Dependencies**: `GET /api/v1/parcels/:ulpin/360`
- **Backend Service**: `parcelService.getParcel360()` — parallel fetch of 9 data sections from PostgreSQL [CONFIRMED-CODE]
- **Database Tables**: `parcels`, `ownership_records`, `encumbrances`, `restrictions`, `zoning`, `tax_records`, `court_cases`, `parcel_documents`, `mutations`
- **Permissions**: `parcel.view.full` (citizen), `parcel.view.officer` (government)
- **Data Sections**: Overview, Map (lat/lng + geometry), Ownership, Encumbrances, Restrictions, Planning/Zoning, Tax, Court Cases, Mutations, Documents, Data Health Score
- **Status**: [CONFIRMED-CODE] Core implementation complete. All sections query real database. Valuation section uses hardcoded circle rate.

---

#### F-CIT-04: My Parcels (Form 8A / Khate Pustika)

- **Purpose**: List all parcels owned by the authenticated citizen
- **User**: Citizen
- **Frontend Page**: `pages/citizen/MyParcelsPage.jsx` [CONFIRMED-CODE]
- **Route**: `/citizen/parcels`
- **API Dependencies**: `GET /api/v1/parcels?search={citizenId}` [INFERRED — uses owner search]
- **Status**: [CONFIRMED-CODE] Page exists. Fetches from backend.

---

#### F-CIT-05: Mutation Tracking

- **Purpose**: Track real-time status of pending ownership mutations through the 12-state workflow
- **User**: Citizen (view own), Government Officer (manage within jurisdiction)
- **Frontend Page**: `pages/citizen/MutationPage.jsx` [CONFIRMED-CODE]
- **Route**: `/citizen/mutations`
- **API Dependencies**: `GET /api/v1/mutations`, `POST /api/v1/mutations`, `PATCH /api/v1/mutations/:id/transition`
- **Backend Service**: `mutationService` with `mutation.statemachine.js` [CONFIRMED-CODE]
- **Database Tables**: `mutations`, `mutation_timeline`
- **State Machine**: INITIATED → DOCUMENTS_PENDING → VERIFICATION_ASSIGNED → FIELD_VERIFIED → REVIEWED → NOTICE_PERIOD → OBJECTION_RECEIVED → HEARING_SCHEDULED → APPROVED → ROR_UPDATE_TRIGGERED → CLOSED (+ REJECTED terminal) [CONFIRMED-CODE]
- **Permissions**: Citizen: `mutation.create`. Talathi: `mutation.field_verify`, `mutation.notice`. Tehsildar: `mutation.approve`, `mutation.reject`, `mutation.issue_order`, `mutation.hearing`.
- **Status**: [CONFIRMED-CODE] State machine implemented. Routes and service exist.

---

#### F-CIT-06: Applications

- **Purpose**: Submit and track citizen service applications (RoR extract, NEC, data correction, etc.)
- **User**: Citizen
- **Frontend Page**: `pages/citizen/ApplicationsPage.jsx` [CONFIRMED-CODE]
- **Route**: `/citizen/applications`
- **API Dependencies**: `GET /api/v1/applications`, `POST /api/v1/applications`
- **Database Tables**: `applications`, `application_types`
- **Permissions**: `application.create`, `application.view.own`
- **Status**: [CONFIRMED-CODE] Backend module exists. Schema includes `application_types` for configurable service catalog.

---

#### F-CIT-07: Documents / Digital Locker

- **Purpose**: View and download certified documents associated with owned parcels
- **User**: Citizen
- **Frontend Page**: `pages/citizen/DocumentsPage.jsx` [CONFIRMED-CODE]
- **Route**: `/citizen/documents`
- **API Dependencies**: `GET /api/v1/documents`
- **Database Tables**: `documents`, `parcel_documents`
- **Permissions**: `document.view.own`, `document.download`
- **Status**: [CONFIRMED-CODE] Backend module exists. Two document tables in schema.

---

#### F-CIT-08: Watchlist & Alerts

- **Purpose**: Monitor parcels for ownership changes, new encumbrances, restrictions, or court cases
- **User**: Citizen
- **Frontend Page**: `pages/citizen/WatchlistPage.jsx` [CONFIRMED-CODE]
- **Route**: `/citizen/watchlist`
- **API Dependencies**: `GET /api/v1/watchlist`, `POST /api/v1/watchlist`, `DELETE /api/v1/watchlist/:id`
- **Database Table**: `watchlist` with `notify_mutations`, `notify_encumbrances`, `notify_court_cases` flags [CONFIRMED-CODE]
- **Permissions**: `watchlist.manage`
- **Status**: [CONFIRMED-CODE] Table, routes, controller, service exist. Alert trigger mechanism is [PROPOSED] — not yet implemented as background job.

---

#### F-CIT-09: Notifications

- **Purpose**: In-app notification center for mutation updates, alerts, and system messages
- **User**: Citizen, Government Officer
- **Frontend Page**: `pages/citizen/NotificationsPage.jsx` [CONFIRMED-CODE]
- **Route**: `/citizen/notifications`
- **API Dependencies**: `GET /api/v1/notifications`
- **Database Table**: `notifications` with `user_id`, `type`, `is_read` [CONFIRMED-CODE]
- **Permissions**: `notification.view`
- **Status**: [CONFIRMED-CODE] Backend module exists.

---

#### F-CIT-10: Grievances

- **Purpose**: File and track grievances against incorrect land records
- **User**: Citizen
- **Frontend Page**: `pages/citizen/GrievancesPage.jsx` [CONFIRMED-CODE]
- **Route**: `/citizen/grievances`
- **API Dependencies**: `GET /api/v1/grievances`, `POST /api/v1/grievances`
- **Database Table**: `grievances` [CONFIRMED-CODE]
- **Permissions**: `grievance.create`, `grievance.view.own`
- **Status**: [CONFIRMED-CODE] Legacy routes exist in `routes/grievanceRoutes.js`. Module migration needed.

---

#### F-CIT-11: Due Diligence

- **Purpose**: Automated pre-purchase checklist aggregating title, encumbrance, restriction, court, zoning, and tax intelligence
- **User**: Citizen
- **Frontend Page**: `pages/citizen/DueDiligencePage.jsx` [CONFIRMED-CODE]
- **Route**: `/citizen/due-diligence`
- **API Dependencies**: Aggregates data from Parcel 360° API
- **Status**: [CONFIRMED-CODE] Frontend page exists (15KB). Likely aggregates P360 data client-side.

---

#### F-CIT-12: Profile

- **Purpose**: View and manage citizen profile, preferences, and notification settings
- **User**: Citizen
- **Frontend Page**: `pages/citizen/ProfilePage.jsx` [CONFIRMED-CODE]
- **Route**: `/citizen/profile`
- **Status**: [CONFIRMED-CODE] Page exists.

---

### 2.2 Government Portal Features

---

#### F-GOV-01: Government Dashboard (Hub)

- **Purpose**: Landing page that redirects to the user's role-specific workspace
- **Frontend Page**: `pages/government/GovernmentDashboard.jsx` [CONFIRMED-CODE] (small — 1.3KB redirect logic)
- **Route**: `/government/dashboard`
- **Status**: [CONFIRMED-CODE] Redirects based on authenticated role.

---

#### F-GOV-02: Talathi Dashboard

- **Purpose**: Village-level work queue: pending field verifications, Form 6 entries, geotagged inspections
- **Frontend Page**: `pages/government/revenue/TalathiDashboard.jsx` [CONFIRMED-CODE]
- **Route**: `/government/talathi`
- **Permissions**: `mutation.field_verify`, `mutation.notice`, `gis.verify`, `gis.boundary_check`
- **Status**: [CONFIRMED-CODE] Page exists.

---

#### F-GOV-03: Tehsildar Dashboard

- **Purpose**: Statutory decision bench: mutation approvals/rejections, RTS cases, SLA tracking
- **Frontend Page**: `pages/government/revenue/TehsildarDashboard.jsx` [CONFIRMED-CODE]
- **Route**: `/government/tehsildar`
- **Permissions**: `mutation.approve`, `mutation.reject`, `mutation.issue_order`, `mutation.hearing`, `case.assign`
- **Status**: [CONFIRMED-CODE] Page exists.

---

#### F-GOV-04: Registration Dashboard (SRO)

- **Purpose**: Deed registration audit, pre-registration title checks, NGDRS synchronization
- **Frontend Page**: `pages/government/registration/RegistrationDashboard.jsx` [CONFIRMED-CODE]
- **Route**: `/government/registration`
- **Related**: `DeedVerificationPage.jsx` at `/government/registration/deed-verification`
- **Database**: `sro_audits` table [CONFIRMED-CODE]
- **Permissions**: `registration.verify`, `registration.forward`
- **Status**: [CONFIRMED-CODE] Dashboard and deed verification pages exist.

---

#### F-GOV-05: District Dashboard (Collector)

- **Purpose**: District command cockpit: tehsil performance, SLA choropleth, escalations, Section 36A
- **Frontend Page**: `pages/government/district/DistrictDashboard.jsx` [CONFIRMED-CODE]
- **Route**: `/government/district`
- **Related**: `TehsilOverviewPage.jsx` at `/government/district/tehsil-overview`
- **Permissions**: `analytics.district`, `case.reassign`, `audit.view`
- **Status**: [CONFIRMED-CODE] Dashboard and tehsil overview pages exist.

---

#### F-GOV-06: State Dashboard (PMU)

- **Purpose**: State-wide monitoring: digitization progress, integration health, district rankings
- **Frontend Page**: `pages/government/state/StateDashboard.jsx` [CONFIRMED-CODE]
- **Route**: `/government/state`
- **Related**: `StateAnalyticsPage.jsx` at `/government/state/analytics`
- **Permissions**: `analytics.state`
- **Status**: [CONFIRMED-CODE] Dashboard and analytics pages exist.

---

#### F-GOV-07: National Dashboard (DoLR)

- **Purpose**: Pan-India DILRMP benchmarks, state comparisons, ULPIN adoption metrics
- **Frontend Page**: `pages/government/national/NationalDashboard.jsx` [CONFIRMED-CODE]
- **Route**: `/government/national`
- **Related**: `StateBenchmarkPage.jsx` at `/government/national/benchmarks`
- **Permissions**: `analytics.national`
- **Status**: [CONFIRMED-CODE] Dashboard and benchmarks pages exist.

---

#### F-GOV-08: Admin Dashboard

- **Purpose**: System health, user management, audit logs, security controls
- **Frontend Page**: `pages/government/admin/AdminDashboard.jsx` [CONFIRMED-CODE]
- **Route**: `/government/admin`
- **Related**: `UserManagementPage.jsx`, `SystemHealthPage.jsx`
- **Permissions**: `admin.users`, `admin.roles`, `admin.config`
- **Status**: [CONFIRMED-CODE] Dashboard, user management, and system health pages exist.

---

#### F-GOV-09: Shared Government Pages

| Page | Route | Purpose | Status |
|------|-------|---------|--------|
| Work Queue | `/government/work-queue` | Pending tasks organized by SLA | [CONFIRMED-CODE] |
| Parcel Management | `/government/parcels` | Search and manage parcels | [CONFIRMED-CODE] |
| Mutation Management | `/government/mutations` | Process mutation cases | [CONFIRMED-CODE] |
| Cases | `/government/cases` | Revenue court cases and disputes | [CONFIRMED-CODE] |
| Map | `/government/map` | Interactive cadastral map | [CONFIRMED-CODE] |
| Analytics | `/government/analytics` | Role-appropriate analytics | [CONFIRMED-CODE] |
| Data Quality | `/government/data-quality` | Cross-source conflict detection | [CONFIRMED-CODE] |
| Integrations | `/government/integrations` | External system health | [CONFIRMED-CODE] |
| Audit | `/government/audit` | Audit event log viewer | [CONFIRMED-CODE] |

---

## 3. End-to-End Workflows

### 3.1 Citizen Authentication Workflow

```
1. Citizen navigates to /login/citizen
2. Enters mobile number → Frontend calls POST /api/v1/auth/citizen/request-otp
3. Backend verifies citizen exists in PostgreSQL citizens table
4. Backend returns "OTP sent" (demo: 123456)
5. Citizen enters OTP → Frontend calls POST /api/v1/auth/citizen/verify-otp
6. Backend verifies OTP, creates/signs-in Supabase Auth user
7. Backend issues JWT access token + refresh token
8. Backend sets HttpOnly cookie with tokens
9. Frontend receives user profile (userId, role, permissions)
10. AuthContext stores user state → redirects to /citizen/dashboard
```

**[CONFIRMED-CODE]** This flow is implemented in `auth.service.js` and `AuthContext.jsx`.

**[CONTRADICTORY]** The AuthContext currently auto-logs-in a default Talathi officer when no session exists (line 29-49 of AuthContext.jsx). This is a development convenience that must not persist in production.

---

### 3.2 Government Officer Authentication Workflow

```
1. Officer navigates to /login/government
2. Enters email + password → Frontend calls POST /api/v1/auth/government/login
3. Backend verifies officer exists in government_users table (email match + active=true)
4. Backend authenticates against Supabase Auth
5. Backend resolves role, department, jurisdiction from database
6. Backend issues JWT with HttpOnly cookie
7. Frontend receives officer profile with role, permissions, jurisdiction codes
8. AuthContext stores user state → redirects to role workspace
```

**[CONFIRMED-CODE]** Implemented in `auth.service.js`. Falls back to demo password if custom password fails.

---

### 3.3 Parcel 360° Retrieval Workflow

```
User (Frontend)
  → GET /api/v1/parcels/:ulpin/360
    → requireAuth middleware (verify JWT from cookie)
    → parcelController.getParcel360()
      → parcelService.getParcel360(ulpin, user)
        → getParcelByUlpin(ulpin) — main parcel record
        → Promise.all([
            _getOwners(ulpin),         — ownership_records table
            _getEncumbrances(ulpin),   — encumbrances table
            _getRestrictions(ulpin),   — restrictions table
            _getZoning(ulpin),         — zoning table
            _getTax(ulpin),            — tax_records table
            _getCourtCases(ulpin),     — court_cases table
            _getDocuments(ulpin),      — parcel_documents table
            _getMutations(ulpin),      — mutations table
            _getValuation(ulpin),      — hardcoded circle rate
          ])
        → Assemble composite dossier
        → Role-based filtering (citizen vs officer view)
    → Return JSON response
  → Frontend renders 10-tab Parcel 360° view
```

**[CONFIRMED-CODE]** Complete data path verified in `parcel.service.js`.

---

### 3.4 Mutation Lifecycle Workflow

```
State Machine (12 states):

INITIATED
  → DOCUMENTS_PENDING (if documents needed)
  → VERIFICATION_ASSIGNED (Talathi assigned for field visit)
    → FIELD_VERIFIED (Talathi submits report)
      → REVIEWED (Tehsildar reviews report)
        → NOTICE_PERIOD (30-day public notice)
          → OBJECTION_RECEIVED (if objection filed)
            → HEARING_SCHEDULED (Tehsildar hearing)
              → APPROVED or REJECTED
          → APPROVED (if no objection after notice period)
        → APPROVED (fast-track uncontested)
        → REJECTED (Tehsildar rejects)
  → REJECTED (immediate rejection if invalid)

APPROVED → ROR_UPDATE_TRIGGERED → CLOSED
REJECTED → CLOSED
```

**[CONFIRMED-CODE]** State machine in `mutation.statemachine.js` with valid transitions, action definitions, and permission requirements. The `APPROVE` and `REJECT` actions require MFA step-up.

Each transition:
1. Validates current state → next state is allowed
2. Checks user has required permission
3. Checks MFA if required for the action
4. Updates `mutations` table status
5. Inserts `mutation_timeline` entry
6. Creates notification
7. Logs audit event

---

### 3.5 Watchlist Alert Workflow

```
1. Citizen adds parcel to watchlist → POST /api/v1/watchlist
2. Backend inserts into watchlist table with alert preferences
3. [PROPOSED] Background job periodically checks for changes:
   - Ownership changes on watched parcels
   - New encumbrances
   - Court case filings
   - Zoning changes
4. When change detected → create notification for watching citizen
5. [PROPOSED] Send SMS/email alert
6. Citizen sees alert in notification center
```

**[CONFIRMED-CODE]** Watchlist table and CRUD operations exist. **[MISSING]** Background change detection job not yet implemented.

---

### 3.6 Grievance Filing Workflow

```
1. Citizen navigates to /citizen/grievances → clicks "File Grievance"
2. Selects category, enters subject and description, optionally links parcel
3. Frontend calls POST /api/v1/grievances
4. Backend creates grievance with status: OPEN
5. Backend assigns to relevant department based on category
6. [PROPOSED] Officer sees grievance in work queue
7. Officer updates status: IN_PROGRESS → RESOLVED → CLOSED
8. Citizen receives notification at each status change
```

**[CONFIRMED-CODE]** Grievance table and routes exist. Department assignment and officer workflow [PROPOSED].

---

## 4. Permissions Reference

### 4.1 Backend Permission Constants (Source of Truth)

**[CONFIRMED-CODE]** From `core/permissions.js`:

| Permission | Citizen | Talathi | Tehsildar | SRO | Collector | State PMU | National | Admin |
|-----------|---------|---------|-----------|-----|-----------|-----------|----------|-------|
| `parcel.search` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `parcel.view.public` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `parcel.view.full` | ✅ | — | — | — | — | — | — | — |
| `parcel.view.officer` | — | ✅ | ✅ | ✅ | ✅ | — | — | — |
| `parcel.view.sensitive` | — | — | ✅ | — | ✅ | — | — | — |
| `mutation.create` | ✅ | — | — | — | — | — | — | — |
| `mutation.field_verify` | — | ✅ | — | — | — | — | — | — |
| `mutation.approve` | — | — | ✅ | — | — | — | — | — |
| `mutation.reject` | — | — | ✅ | — | — | — | — | — |
| `mutation.issue_order` | — | — | ✅ | — | — | — | — | — |
| `gis.verify` | — | ✅ | — | — | — | — | — | — |
| `gis.edit` | — | — | — | — | — | — | — | — |
| `registration.verify` | — | — | — | ✅ | — | — | — | — |
| `analytics.district` | — | — | ✅ | — | ✅ | ✅ | — | ✅ |
| `analytics.state` | — | — | — | — | ✅ | ✅ | ✅ | ✅ |
| `analytics.national` | — | — | — | — | — | — | ✅ | ✅ |
| `admin.users` | — | — | — | — | — | — | — | ✅ |
| `audit.view` | — | — | ✅ | — | ✅ | ✅ | — | ✅ |

### 4.2 Frontend Permissions Mismatch

**[CONTRADICTORY]** Frontend `config/permissions.js` defines a different permission vocabulary (e.g., `VIEW_PUBLIC_RECORDS`, `SANCTION_MUTATION`, `ENTER_PENCIL_ENTRY`) than backend `core/permissions.js` (e.g., `parcel.view.public`, `mutation.approve`, `mutation.field_verify`). These must be synchronized. **The backend is authoritative.**

---

## 5. Data Flow Summary per Feature

| Feature | Frontend Service | Backend Module | Database Tables | Auth Required |
|---------|-----------------|----------------|-----------------|---------------|
| Parcel Search | `parcelService.getParcels()` | `modules/parcels` | `parcels` | Optional |
| Parcel 360° | `parcelService.getParcel360()` | `modules/parcels` | 9 tables | Yes |
| Mutations | `mutationService.*` | `modules/mutations` | `mutations`, `mutation_timeline` | Yes |
| Applications | `applicationService.*` | `modules/applications` | `applications`, `application_types` | Yes |
| Documents | `documentService.*` | `modules/documents` | `documents`, `parcel_documents` | Yes |
| Notifications | `notificationService.*` | `modules/notifications` | `notifications` | Yes |
| Watchlist | `watchlistService.*` | legacy `routes/watchlistRoutes` | `watchlist` | Yes |
| Grievances | `grievanceService.*` | legacy `routes/grievanceRoutes` | `grievances` | Yes |
| Analytics | `analyticsService.*` | `modules/analytics` | aggregate queries | Yes (officer) |
| GIS | (via map components) | `modules/gis` | `parcels` (lat/lng) | Yes |
| Auth | `authService.*` | `modules/auth` | `citizens`, `government_users` | N/A |

---

*This document defines every user, feature, and workflow in the product.*
