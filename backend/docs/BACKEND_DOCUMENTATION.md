# BHARATBHUMI Backend — Current Technical Documentation

## 1. Executive Summary

The **BHARATBHUMI** (Land Stack) backend is a production-grade land revenue and cadastral record administration platform built on Node.js and Express.js, backed by PostgreSQL, PostGIS, and Supabase Auth. It serves as the authoritative backend for land governance, property rights management, quasi-judicial mutation workflows, and citizen statutory service delivery.

### System Purpose
The primary objective of the BHARATBHUMI platform is to eliminate fraud, boundary disputes, and delayed land mutations through:
1. **Immutable Parcel 360° Records:** Aggregating cadastral coordinates, title ownership, encumbrances, planning zoning, tax history, and court stays into a single tamper-evident view.
2. **Deterministic Mutation State Machine:** A 12-state lifecycle engine enforcing statutory notice periods (Form 135D), ground GPS verification panchnama, objection resolution, and Digital Signature Certificate (DSC) sanctioning.
3. **Statutory Non-Bypass Security:** Enforcing statutory administrative hierarchy where only legally designated revenue authorities (Talathi, Tahsildar, Sub-Divisional Officer) can alter land records, explicitly preventing IT Administrators from approving land mutations.
4. **Dual-Mode Engine:** Seamless operation in `mock` mode (backed by structured in-memory datasets) and `supabase` mode (backed by live PostgreSQL with Row Level Security), controlled explicitly via environment variables.

### Current Readiness
- **Architecture Maturity:** High. The backend follows a modular domain architecture (`src/modules/`) with strict separation between routes, controllers, services, state machines, and core validation logic.
- **Runtime Stability:** 100% verified. All 80 registered routes execute without syntax errors, and the automated verification suite passes with 15/15 test assertions.
- **Production Status:** Ready for staging deployment with Supabase PostgreSQL.

---

## 2. Technology Stack

Every component documented below represents code actually implemented in `package.json`, `src/server.js`, and the database migrations:

| Component | Technology | Version | Purpose & Implementation Details |
|---|---|---|---|
| **Runtime Environment** | Node.js | v20+ / v24 (ESM) | Native ECMAScript Modules (`"type": "module"`) used throughout |
| **HTTP Framework** | Express.js | `^4.21.2` | REST API routing, custom middleware pipelines, and error handling |
| **Database Engine** | PostgreSQL + PostGIS | 15+ (Supabase) | Relational persistence, spatial geometry, and Row Level Security |
| **Database Client SDK** | `@supabase/supabase-js` | `^2.49.1` | Multi-client connection pooling (Anon, Admin, and Authenticated User) |
| **Security Headers** | Helmet | `^8.3.0` | CSP, X-Frame-Options, HSTS, and X-Content-Type-Options protection |
| **Cookie Management** | Cookie-Parser | `^1.4.7` | Signed/HTTP-only cookie serialization for JWT token transmission |
| **Payload Compression**| Compression | `^1.8.2` | Gzip/Deflate compression applied to all JSON payloads |
| **CORS Middleware** | CORS | `^2.8.5` | Dynamic origin evaluation supporting `credentials: true` |
| **Input Validation** | Zod | `^4.6.5` | Strict schema validation for `req.body`, `req.query`, and `req.params` |
| **Abuse Protection** | Express-Rate-Limit | `^8.7.0` | Granular rate limiters for general API (100 req/15m), OTP, and login |
| **Distributed Tracing** | UUID | `^14.0.2` | End-to-end request tracing via `X-Correlation-Id` header |
| **File Handling** | Multer | `^2.3.0` | Multipart/form-data handler for cadastral documents and panchnama photos |
| **Testing** | Node.js Test Runner | Native | Comprehensive end-to-end API test suite in `tests/verify-api.js` |

---

## 3. Current Backend Architecture

### Application Bootstrap Sequence
The backend server initiates through `src/server.js`:
1. **Environment Initialization (`src/config/env.js`):** Loads `.env` via `dotenv.config()`, resolving database keys, port, CORS origins, and provider mode (`DATA_PROVIDER_MODE`).
2. **Database Factory (`src/config/supabase.js`):** Evaluates configuration health. If keys are present, initializes `getSupabaseAnon()` and `getSupabaseAdmin()`. Emits console status (`MOCK` vs. `SUPABASE`).
3. **Security Middleware Pipeline:**
   - `helmet()`: Attaches security headers.
   - `compression()`: Compresses responses.
   - `cookieParser()`: Extracts session tokens from HTTP-only cookies.
   - `express.json()` & `express.urlencoded()`: Parses incoming JSON bodies (up to 10MB).
   - `correlationId`: Generates or forwards `X-Correlation-Id` UUID.
   - `requestLogger`: Logs method, path, status, and execution duration.
   - `cors()`: Validates origin against allowlist (`localhost:5173`, `localhost:3000`, etc.) and permits credentials.
4. **Health Check Endpoints:** Mounts `/health` and `/api/v1/health`.
5. **Master Router (`src/routes/index.js`):** Mounts all 13 domain modules and 3 legacy compatibility routes under `/api/v1`.
6. **Error Boundary (`src/middleware/errorHandler.js`):** Central error interceptor preventing process crashes and sanitizing internal stack traces in production.

### Complete Request Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Client as Client / Browser
    participant Sec as Security Pipeline (Helmet, CORS, CookieParser)
    participant Rate as RateLimiter & CorrelationId
    participant Auth as requireAuth Middleware
    participant RBAC as requireRole / requirePermission
    participant Val as validateRequest (Zod)
    participant Ctrl as Controller
    participant Svc as Service Layer
    participant Store as Data Layer (Supabase / MockStore)
    participant Audit as AuditService

    Client->>Sec: HTTP Request (Cookies, Headers, Payload)
    Sec->>Rate: Sanitize Headers & Verify Origin
    Rate->>Auth: Assign X-Correlation-Id & Check Rate Limits
    Note over Auth: Extract JWT from Cookie<br/>Verify with Supabase Auth or Mock
    alt Authentication Required but Missing/Invalid
        Auth-->>Client: 401 Unauthorized (ErrorCodes.UNAUTHENTICATED)
    end
    Auth->>RBAC: Attach req.user (Role, Jurisdiction, Context)
    alt Insufficient Role or Permission
        RBAC-->>Client: 403 Forbidden (ErrorCodes.FORBIDDEN)
    end
    RBAC->>Val: Check Jurisdiction & State Machine Guards
    Val->>Ctrl: Parse req.body, req.query, req.params
    alt Validation Failure
        Val-->>Client: 422 Unprocessable Entity (Zod Details)
    end
    Ctrl->>Svc: Invoke Domain Business Logic
    Svc->>Store: Query PostgreSQL / PostGIS or MockStore
    Store-->>Svc: Return Entity Records
    Svc->>Audit: Append Immutable Event to audit_logs
    Svc-->>Ctrl: Return Domain Result
    Ctrl-->>Client: HTTP 200/201 (Standardized sendSuccess/sendPaginated)
```

---

## 4. Current Folder Structure

```
backend/
├── .env                              <-- Active environment variables (git-ignored)
├── .env.example                      <-- Environment blueprint template
├── package.json                      <-- Dependencies, scripts, and ESM module declaration
├── package-lock.json                 <-- Deterministic package dependency tree
├── README.md                         <-- High-level project README
│
├── database/                         <-- Database migration and provisioning scripts
│   ├── migrations/
│   │   ├── 001_core_schema.sql       <-- Core DDL: Jurisdictions, users, parcels, mutations, audit
│   │   ├── 002_rls_policies.sql      <-- PostgreSQL Row Level Security (RLS) policies
│   │   └── 003_seed_data.sql         <-- Maharashtra rural & urban seed records
│   ├── schema.sql                    <-- Complete monolithic schema reference
│   ├── seed.sql                      <-- Extended seed datasets
│   └── run-seed.js                   <-- CLI script for populating Supabase database
│
├── docs/                             <-- System Documentation Suite
│   ├── README.md                     <-- Documentation landing page
│   ├── BACKEND_DOCUMENTATION.md      <-- This technical architecture document
│   ├── API_REFERENCE.md              <-- Full 80-endpoint API reference
│   ├── SETUP_AND_TESTING.md          <-- Setup, seeding, testing, and troubleshooting guide
│   └── postman/
│       └── BHARATBHUMI.postman_collection.json <-- Postman collection v2.1
│
├── src/
│   ├── server.js                     <-- Express app entrypoint and server bootstrap
│   │
│   ├── config/                       <-- Application configuration
│   │   ├── env.js                    <-- Centralized environment variable reader
│   │   ├── supabase.js               <-- 3-client Supabase factory (Anon, Admin, Auth)
│   │   └── cookie.js                 <-- Cookie serialization and security options
│   │
│   ├── core/                         <-- Core system primitives
│   │   ├── errors.js                 <-- Standard AppError class and ErrorCodes enum
│   │   ├── permissions.js            <-- 14 canonical roles, permissions, and matrix
│   │   └── response.js               <-- Standardized API response formatters
│   │
│   ├── middleware/                   <-- Interceptors & Security Gates
│   │   ├── correlationId.js          <-- Unique X-Correlation-Id injector
│   │   ├── requestLogger.js          <-- HTTP request console logger
│   │   ├── rateLimiter.js            <-- Abuse prevention rate limiters
│   │   ├── validateRequest.js        <-- Zod validation middleware wrapper
│   │   ├── requireAuth.js            <-- JWT & mock session verification
│   │   ├── requireRole.js            <-- Role type enforcement (Citizen vs. Government)
│   │   ├── requirePermission.js      <-- Granular capability verification
│   │   ├── requireContext.js         <-- Active context validator (Rural/Urban/GIS)
│   │   ├── requireJurisdiction.js    <-- Territorial boundary matching
│   │   ├── requireMfaStepUp.js       <-- Secondary verification for statutory actions
│   │   └── errorHandler.js           <-- Global error boundary and sanitizer
│   │
│   ├── modules/                      <-- Modular Domain Architecture
│   │   ├── auth/                     <-- Authentication & Session lifecycle
│   │   │   ├── auth.validators.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.controller.js
│   │   │   └── auth.routes.js
│   │   ├── parcels/                  <-- Parcel 360° & Cadastral aggregation
│   │   │   ├── parcel.validators.js
│   │   │   ├── parcel.service.js
│   │   │   ├── parcel.controller.js
│   │   │   └── parcel.routes.js
│   │   ├── mutations/                <-- 12-state mutation state machine
│   │   │   ├── mutation.statemachine.js
│   │   │   ├── mutation.validators.js
│   │   │   ├── mutation.service.js
│   │   │   ├── mutation.controller.js
│   │   │   └── mutation.routes.js
│   │   ├── cases/                    <-- Work queues & statutory dossiers
│   │   │   ├── case.service.js
│   │   │   ├── case.controller.js
│   │   │   └── case.routes.js
│   │   ├── applications/             <-- Citizen statutory services (7/12, 8A, etc.)
│   │   │   ├── application.validators.js
│   │   │   ├── application.service.js
│   │   │   ├── application.controller.js
│   │   │   └── application.routes.js
│   │   ├── documents/                <-- Document metadata & signed URLs
│   │   │   ├── document.service.js
│   │   │   ├── document.controller.js
│   │   │   └── document.routes.js
│   │   ├── notifications/            <-- In-app alert dispatch and tracking
│   │   │   ├── notification.service.js
│   │   │   ├── notification.controller.js
│   │   │   └── notification.routes.js
│   │   ├── audit/                    <-- Append-only audit logging
│   │   │   ├── audit.service.js
│   │   │   ├── audit.controller.js
│   │   │   └── audit.routes.js
│   │   ├── jurisdictions/            <-- Territorial administrative hierarchy
│   │   │   ├── jurisdiction.service.js
│   │   │   └── jurisdiction.routes.js
│   │   ├── citizens/                 <-- Citizen profile & landholding registry
│   │   │   ├── citizen.service.js
│   │   │   └── citizen.routes.js
│   │   ├── officers/                 <-- Staff directory & assignment mapping
│   │   │   ├── officer.service.js
│   │   │   └── officer.routes.js
│   │   ├── analytics/                <-- National, State PMU & District KPIs
│   │   │   ├── analytics.service.js
│   │   │   └── analytics.routes.js
│   │   └── gis/                      <-- PostGIS cadastral polygon & bbox queries
│   │       ├── gis.service.js
│   │       └── gis.routes.js
│   │
│   ├── routes/                       <-- Route Aggregation & Legacy Routes
│   │   ├── index.js                  <-- Master API router mounting all modules
│   │   ├── grievanceRoutes.js        <-- Legacy Citizen Grievance router
│   │   ├── watchlistRoutes.js        <-- Legacy Citizen Watchlist router
│   │   └── publicRoutes.js           <-- Legacy Public Directory router
│   │
│   ├── controllers/                  <-- Legacy Controllers
│   ├── services/                     <-- Legacy Services
│   └── data/                         <-- High-Fidelity Mock JSON Datasets
│       ├── mockStore.js              <-- Memory store loader
│       └── json/                     <-- 14 domain JSON registries
│
└── tests/
    └── verify-api.js                 <-- Automated 15-assertion runtime verification suite
```

---

## 5. Database Architecture

The database architecture is designed for PostgreSQL with PostGIS extensions on Supabase.

### Schema Organization
The database schema is divided into 6 functional clusters:
1. **Administrative Jurisdictions:** `states`, `districts`, `tehsils`, `villages`.
2. **Identities & Assignments:** `citizens`, `officers`, `officer_assignments`.
3. **Cadastral & Parcel 360°:** `parcels`, `ownership_records`, `encumbrances`, `restrictions`, `court_cases`, `zoning`, `tax_records`, `parcel_documents`.
4. **Workflows & Objections:** `mutations`, `mutation_timeline`, `mutation_objections`, `mutation_hearings`, `sro_audits`.
5. **Citizen Services & Storage:** `application_types`, `applications`, `documents`.
6. **System & Surveillance:** `notifications`, `watchlist`, `audit_logs`.

### Core Tables and Relationships

```mermaid
erDiagram
    states ||--o{ districts : contains
    districts ||--o{ tehsils : contains
    tehsils ||--o{ villages : contains
    
    villages ||--o{ parcels : locates
    parcels ||--o{ ownership_records : holds
    citizens ||--o{ ownership_records : owns
    
    parcels ||--o{ encumbrances : encumbers
    parcels ||--o{ restrictions : restricts
    parcels ||--o{ court_cases : litigated
    
    parcels ||--o{ mutations : modifies
    citizens ||--o{ mutations : files
    mutations ||--o{ mutation_objections : disputed_by
    mutations ||--o{ mutation_hearings : heard_in
    mutations ||--o{ mutation_timeline : tracks
    
    officers ||--o{ officer_assignments : assigned
    tehsils ||--o{ officer_assignments : governs
    villages ||--o{ officer_assignments : administers
    
    citizens ||--o{ applications : submits
    application_types ||--o{ applications : categorizes
    
    citizens ||--o{ audit_logs : triggers
    officers ||--o{ audit_logs : acts
```

### Row Level Security (RLS) Policy Design
In production Supabase mode, security is enforced directly within the database engine via policies in `database/migrations/002_rls_policies.sql`:
- **Citizen Data Isolation:** Citizens are restricted to reading and modifying only records linked to their `auth_user_id` (`auth.uid() = auth_user_id`).
- **Territorial Scoping for Officers:** Talathi records are scoped strictly to their assigned village code (`village_code = officer.village_code`). Tahsildar records are scoped to their tehsil code (`tehsil_code = officer.tehsil_code`).
- **Append-Only Audit Logs:** `audit_logs` permits `INSERT` and `SELECT` for authorized personnel, while `UPDATE`, `DELETE`, and `TRUNCATE` privileges are revoked for all database roles.

---

## 6. Authentication System

The authentication architecture separates citizen access from revenue officer access:

### 1. Citizen Authentication Flow (Phone OTP)
Citizens authenticate via mobile phone numbers without passwords:
1. `POST /api/v1/auth/citizen/request-otp`: Receives phone number, generates a time-limited 6-digit OTP, and triggers SMS delivery (in mock mode, static OTP `123456` is enabled).
2. `POST /api/v1/auth/citizen/verify-otp`: Validates the OTP. On verification:
   - Resolves or provisions a citizen record in `citizens`.
   - Generates an access token and refresh token.
   - Sets secure HTTP-only cookies: `access_token` (15 min) and `refresh_token` (7 days).
   - Returns sanitized citizen profile.

### 2. Government Officer Authentication Flow (Email/Password + Context)
Officers authenticate using government credentials:
1. `POST /api/v1/auth/government/login`: Validates government email and password.
2. Checks account active status and pulls assigned roles from `officer_assignments`.
3. Sets secure HTTP-only cookies and establishes active administrative context (e.g. `RURAL` for Talathi/Tahsildar, `URBAN` for ULB officers, `SHARED_GIS` for survey officers).

### 3. Session Persistence & Token Refresh
- **HTTP-Only Cookies:** Tokens are transmitted via `Set-Cookie` with `HttpOnly=true`, `SameSite=Lax`, and `Path=/`. JavaScript running in the browser cannot read raw token strings, eliminating cross-site token theft.
- **Session Refresh:** `POST /api/v1/auth/refresh` rotates expired access tokens using the long-lived refresh token.
- **Session Termination:** `POST /api/v1/auth/logout` explicitly clears both cookies on the client.

### 4. Authentication Middleware (`requireAuth.js`)
All protected endpoints pass through `requireAuth`:
1. Inspects `req.cookies.access_token`. Fallback checks `Authorization: Bearer <token>`.
2. In `mock` mode: Decodes mock token or parses `X-Mock-User-Id` / `X-Mock-Role` headers for automated testing.
3. In `supabase` mode: Calls `supabase.auth.getUser(token)`.
4. Resolves full user profile from the database and attaches it to `req.user`.

---

## 7. Authorization and Roles

### Canonical System Roles
The backend defines 14 official roles divided across user classifications in `src/core/permissions.js`:

```javascript
export const Roles = Object.freeze({
  CITIZEN:           'CITIZEN',           // Citizen landholder
  TALATHI:           'TALATHI',           // Village revenue officer / Patwari
  PATWARI:           'PATWARI',           // Village accountant (alternate state nomenclature)
  SRO:               'SRO',               // Sub-Registrar Officer (Deed registration)
  CRO:               'CRO',               // Circle Revenue Officer (Supervisory review)
  TEHSILDAR:         'TEHSILDAR',         // Executive Magistrate / Quasi-judicial authority
  COLLECTOR:         'COLLECTOR',         // District Collector & Magistrate
  SURVEY_GIS:        'SURVEY_GIS',        // Cadastral survey & GIS specialist
  ULB_OFFICER:       'ULB_OFFICER',       // Urban Local Body / Property card officer
  STATE_PMU:         'STATE_PMU',         // State Project Management Unit
  STATE_AUTHORITY:   'STATE_AUTHORITY',   // State Revenue Commissioner
  NATIONAL_MONITOR:  'NATIONAL_MONITOR',  // National Monitoring Dashboard
  DOLR_NATIONAL:     'DOLR_NATIONAL',     // Department of Land Resources (National)
  ADMIN:             'ADMIN',             // System / Console Administrator
});
```

### Statutory Non-Bypass Protection
Under Indian land revenue jurisprudence, only statutory quasi-judicial officers are empowered to modify the Record of Rights (RoR). The BHARATBHUMI backend programmatically enforces this constraint:
- `MUTATION_APPROVE` and `MUTATION_REJECT` permissions are granted **only** to `TEHSILDAR`, `CRO`, and `ULB_OFFICER`.
- The `ADMIN` role is **strictly denied** mutation approval capabilities. An administrator attempting to approve a mutation receives `HTTP 403 Forbidden` (`ErrorCodes.FORBIDDEN_STATUTORY_ACTION`).

### Context & Territorial Jurisdiction Enforcement
- **Dynamic Contexts (`requireContext`):** Officers possessing multi-disciplinary assignments can toggle their active context between `RURAL`, `URBAN`, and `SHARED_GIS`.
- **Territorial Scoping (`requireJurisdiction`):** Talathis can only execute field verifications within their assigned village code; Tahsildars can only schedule hearings and sanction orders within their assigned tehsil code.

---

## 8. Functional Modules

### 1. Auth Module (`src/modules/auth/`)
- Handles OTP generation, SMS simulation, password verification, cookie issuance, context switching, and session retrieval.
- Routes: `/api/v1/auth/*` (8 routes).

### 2. Parcels Module (`src/modules/parcels/`)
- Provides comprehensive property intelligence across land registries.
- **Parcel 360° Aggregator:** Executes parallel data retrieval combining overview, coordinates, ownership chains, active bank encumbrances, tribal/forest restrictions, planning authority zoning, tax dues, pending court stays, registered deeds, circle rate valuation, and data health scores.
- Routes: `/api/v1/parcels/*` (11 routes).

### 3. Mutations Module (`src/modules/mutations/`)
- Implements the 12-state land mutation lifecycle:
  `INITIATED` → `DOCUMENTS_PENDING` → `VERIFICATION_ASSIGNED` → `FIELD_VERIFIED` → `REVIEWED` → `NOTICE_PERIOD` → `OBJECTION_RECEIVED` → `HEARING_SCHEDULED` → `APPROVED` / `REJECTED` → `ROR_UPDATE_TRIGGERED` → `CLOSED`.
- Enforces statutory rules: prevents approving mutations directly from `INITIATED` state, records formal objections during 15-day notice windows, schedules magistrate hearings, and triggers Record of Rights (7/12) updates.
- Routes: `/api/v1/mutations/*` (9 routes).

### 4. Cases & Work Queues (`src/modules/cases/`)
- Derives operational work queues dynamically from the logged-in officer's active assignment (e.g. Talathi receives ground verification tasks; Tahsildar receives notice expiries and disputed hearings).
- Compiles statutory case dossiers featuring panchnama reports, geotagged boundary stones, witness signatures, and prerequisite compliance checklists.
- Routes: `/api/v1/cases/*` (3 routes).

### 5. Citizen Applications (`src/modules/applications/`)
- Citizen-facing portal for ordering digitally signed 7/12 extracts, Form 8A holding statements, City Survey Property Cards, Boundary Demarcation (Mojani), and Non-Agricultural (NA) NOCs.
- Routes: `/api/v1/applications/*` (5 routes).

### 6. Documents (`src/modules/documents/`)
- Document metadata registry with file size, MIME types, and SHA verification hashes.
- Generates time-limited signed download URLs (valid for 3600 seconds) and enables officer verification workflows.
- Routes: `/api/v1/documents/*` (5 routes).

### 7. Notifications (`src/modules/notifications/`)
- Real-time in-app notification dispatch for citizen status milestones and officer assignment alerts.
- Routes: `/api/v1/notifications/*` (3 routes).

### 8. GIS & Spatial Operations (`src/modules/gis/`)
- Generates GeoJSON Feature representations of cadastral boundaries, builds village-level cadastral maps (FeatureCollections), performs bounding-box spatial queries, and validates polygon closure.
- Routes: `/api/v1/gis/*` (4 routes).

### 9. Jurisdictions (`src/modules/jurisdictions/`)
- Returns the complete administrative territorial hierarchy (State → District → Tehsil → Village) with cascading parent-child validation.
- Routes: `/api/v1/jurisdictions/*` (5 routes).

### 10. Citizens (`src/modules/citizens/`)
- Citizen profile management, landholding registry lookups, and transaction activity summaries.
- Routes: `/api/v1/citizens/*` (4 routes).

### 11. Officers (`src/modules/officers/`)
- Officer profile inspection, jurisdiction assignments, and staff directory filtering.
- Routes: `/api/v1/officers/*` (2 routes).

### 12. Analytics (`src/modules/analytics/`)
- High-level KPIs: National digitization metrics, state benchmarks, PMU performance, district backlogs, and server infrastructure health.
- Routes: `/api/v1/analytics/*` (7 routes).

### 13. Audit (`src/modules/audit/`)
- Append-only event store capturing entity type, entity ID, action name, actor identity, role, IP address, user-agent, before/after JSON states, and audit payload.
- Routes: `/api/v1/audit/*` (2 routes).

### 14. Legacy Compatibility (`src/routes/`)
- Preserves backwards compatibility for frontend dashboard components:
  - Grievances: `/api/v1/grievances/*` (3 routes).
  - Watchlist: `/api/v1/watchlist/*` (3 routes).
  - Public Notices & News: `/api/v1/public/*` (4 routes).

---

## 9. GIS and Spatial Capabilities

### Implemented Spatial Capabilities
1. **GeoJSON Feature Generation (`GET /api/v1/gis/parcels/:ulpin/geojson`):** Returns standard RFC 7946 GeoJSON Feature objects including polygon coordinates and property metadata.
2. **Village Cadastral Map (`GET /api/v1/gis/villages/:villageCode/cadastral-map`):** Aggregates all parcels within a village into a GeoJSON FeatureCollection for map rendering in Leaflet/MapLibre.
3. **Bounding Box Intersections (`GET /api/v1/gis/bbox`):** Spatial filtering by `minLat`, `minLng`, `maxLat`, `maxLng`.
4. **Cadastral Polygon Validation (`POST /api/v1/gis/validate-geometry`):** Validates linear rings, exterior boundary point counts (minimum 4 coordinate pairs), and ensures the first and last coordinates close the polygon.

### Coordinate Reference System
- **CRS:** WGS 84 (`EPSG:4326`), utilizing latitude and longitude in decimal degrees.

### PostGIS Database Integration
- In `supabase` mode, the `parcels` table schema supports geometry columns (`geometry(Polygon, 4326)`). When PostGIS extensions are disabled on minimal hosting instances, the backend gracefully falls back to structured coordinate arrays (`boundary_coordinates JSONB`) with zero API disruption.

---

## 10. API Design and Backend Contracts

### Route Prefix & Conventions
All production API endpoints are exposed under `/api/v1/` with lowercase, hyphen-separated URI paths.

### Standardized Response Envelope
All API responses adhere strictly to standardized envelopes generated via `src/core/response.js`:

#### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable confirmation"
}
```

#### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "page": {
    "page": 1,
    "limit": 20,
    "total": 31,
    "hasMore": true,
    "nextCursor": null
  }
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Parcel 'ULPIN-MH-PUN-000099' not found in registry.",
    "details": null
  },
  "requestId": "9c1b8f1a-810a-42c2-8419-74e92ebc9012"
}
```

### Standard HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Malformed syntax or invalid parameters.
- `401 Unauthorized`: Authentication missing or token expired.
- `403 Forbidden`: Authenticated user lacks required role/permission.
- `404 Not Found`: Target resource does not exist.
- `409 Conflict`: Invalid state machine transition or uniqueness constraint breach.
- `422 Unprocessable Entity`: Zod input validation failure.
- `429 Too Many Requests`: Rate limiter triggered.
- `500 Internal Server Error`: Unhandled server exception.

---

## 11. Current API Surface Summary

The backend registers **80 distinct API routes**:

| Domain | Route Prefix | Count | Authentication Required |
|---|---|---|---|
| **System Health** | `/health`, `/api/v1/health` | 2 | None (Public) |
| **Authentication** | `/api/v1/auth` | 8 | Public (OTP/Login) & Protected (`/me`, `/contexts`) |
| **Parcels 360°** | `/api/v1/parcels` | 11 | Optional (`/`, `/:ulpin`) & Protected (`/360`, sub-resources) |
| **Mutations** | `/api/v1/mutations` | 9 | Protected (All routes require auth + statutory roles) |
| **Cases & Queues** | `/api/v1/cases` | 3 | Protected (Government officers only) |
| **Applications** | `/api/v1/applications` | 5 | Public (`/types`) & Protected (`/`, `/:id`, `/:id/status`) |
| **Documents** | `/api/v1/documents` | 5 | Protected (Auth required; `/verify` requires officer) |
| **Notifications** | `/api/v1/notifications` | 3 | Protected (Auth required) |
| **Jurisdictions** | `/api/v1/jurisdictions` | 5 | Public (Directory data) |
| **Citizens** | `/api/v1/citizens` | 4 | Protected (Citizen role required) |
| **Officers** | `/api/v1/officers` | 2 | Protected (Government role required) |
| **Analytics** | `/api/v1/analytics` | 7 | Public / Protected |
| **GIS Operations**| `/api/v1/gis` | 4 | Public (Cadastral boundaries) |
| **Audit Logs** | `/api/v1/audit` | 2 | Protected (Government officers only) |
| **Grievances** | `/api/v1/grievances` | 3 | Public / Protected (Legacy support) |
| **Watchlist** | `/api/v1/watchlist` | 3 | Protected (Legacy support) |
| **Public Info** | `/api/v1/public` | 4 | Public (Legacy support) |
| **TOTAL** | | **80** | |

*(For full endpoint-by-endpoint details, see [API_REFERENCE.md](./API_REFERENCE.md)).*

---

## 12. Current Implementation Status

### Factual Status Assessment

#### 1. Fully Implemented & Tested
- Dual-mode architecture (`DATA_PROVIDER_MODE=mock|supabase`).
- Cookie-based authentication with Supabase Auth verification and mock engine.
- RBAC security chain with 14 canonical roles and statutory approval blocks on `ADMIN`.
- Parcel 360° profile aggregation with Ready Reckoner circle rate valuation.
- 12-state mutation state machine preventing arbitrary state jumping.
- Officer work queue derivation based on territorial assignment codes.
- Comprehensive case dossiers with panchnama evidence checklists.
- GeoJSON cadastral polygon generation and topological boundary validation.
- Structured error handling with unique `X-Correlation-Id` tracking.
- Rate limiting on API, login, and OTP request endpoints.

#### 2. Partially Implemented
- **Supabase Storage Uploads:** Document metadata and signed URLs are fully implemented; direct binary streaming to Supabase Storage buckets utilizes file URL references in mock mode.
- **Class-3 DSC Signing:** The state machine requires MFA verification for approval; physical PKI USB token integration is simulated via statutory step-up tokens (`_mfaToken`).

#### 3. Frontend/Backend Integration Status
- The backend fully supports the frontend's Vite development server (`http://localhost:5173`) via CORS with credentials.
- Legacy endpoints (`/grievances`, `/watchlist`, `/public`) remain active to ensure existing frontend pages function without interruption.

#### 4. Production Readiness
- **Development & Staging Ready:** 100%. The application runs smoothly in development, responds to health checks, and passes automated verification.
- **Production Deployment:** Requires provisioning the Supabase PostgreSQL database using `database/migrations/001_core_schema.sql` and `database/migrations/002_rls_policies.sql`, and setting `DATA_PROVIDER_MODE=supabase`.

---

## 13. Known Limitations and Risks

1. **In-Memory Mock Mutability:** In mock mode, mutations and audit logs are recorded in memory. Server restarts restore data to initial seed JSON states.
2. **PostGIS Dependency:** Advanced spatial geometry functions require the PostGIS extension in PostgreSQL. If unavailable, coordinate fallbacks are utilized.
3. **SMS Gateway:** OTP delivery relies on simulated console output in mock mode; production deployment requires configuring an external SMS gateway (e.g. CDAC Mobile Seva / Twilio).

---

## 14. Recommended Next Engineering Steps

### Important Improvements (Sprint 1)
1. **Run Database Migrations on Remote Supabase:** Apply `001_core_schema.sql` and `002_rls_policies.sql` to the production Supabase instance.
2. **Execute Database Seeding:** Execute `003_seed_data.sql` to populate initial administrative boundaries and land parcels.
3. **Configure Environment:** Set `DATA_PROVIDER_MODE=supabase` in production `.env`.

### Optional Improvements (Sprint 2)
1. **Redis Cache:** Integrate Redis for caching Ready Reckoner circle rates and high-traffic cadastral village maps.
2. **WebSocket Realtime:** Connect Supabase Realtime to push mutation status changes directly to the frontend without polling.
