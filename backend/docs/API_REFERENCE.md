# BHARATBHUMI Backend API Reference

## Base URL
- **Production / Local Development API Base URL:** `http://localhost:5000/api/v1`
- **Root Health Endpoint:** `http://localhost:5000/health`

## Authentication Requirements
The BHARATBHUMI API uses secure, HTTP-only session cookies containing JSON Web Tokens (JWT) for authentication:
- **Access Cookie:** `access_token` (Lifetime: 15 minutes).
- **Refresh Cookie:** `refresh_token` (Lifetime: 7 days).
- **Header Fallback (API testing / Curl):** `Authorization: Bearer <access_token>`.
- **Mock Mode Testing:** When `DATA_PROVIDER_MODE=mock`, requests can simulate authentication by supplying:
  - `X-Mock-User-Id`: Identifier (e.g. `c1`, `off-tahsildar-01`, `off-talathi-01`).
  - `X-Mock-Role`: Role (e.g. `CITIZEN`, `TALATHI`, `TEHSILDAR`, `ADMIN`).
  - `X-Mock-User-Type`: `CITIZEN` or `GOVERNMENT`.

## API Status Legend
- **Implemented:** Fully implemented in source code and validated against the runtime server.
- **Partially Implemented:** Functional logic active; external integration (e.g. physical DSC hardware or live SMS gateway) simulated.
- **Deprecated:** Legacy route preserved for backwards compatibility with earlier frontend versions.

---

## Complete Route Inventory Table

| Method | Path | Module | Auth | Role / Permission | Status | Source Implementation |
|---|---|---|---|---|---|---|
| `GET` | `/health` | System Health | None | Public | Implemented | `src/server.js:healthHandler` |
| `GET` | `/api/v1/health` | System Health | None | Public | Implemented | `src/server.js:healthHandler` |
| `POST` | `/api/v1/auth/citizen/request-otp` | Authentication | None | Public (Rate Limited) | Implemented | `src/modules/auth/auth.controller.js:requestOtp` |
| `POST` | `/api/v1/auth/citizen/verify-otp` | Authentication | None | Public (Rate Limited) | Implemented | `src/modules/auth/auth.controller.js:verifyOtp` |
| `POST` | `/api/v1/auth/government/login` | Authentication | None | Public (Rate Limited) | Implemented | `src/modules/auth/auth.controller.js:governmentLogin` |
| `POST` | `/api/v1/auth/refresh` | Authentication | None | Public | Implemented | `src/modules/auth/auth.controller.js:refreshToken` |
| `POST` | `/api/v1/auth/logout` | Authentication | None | Public | Implemented | `src/modules/auth/auth.controller.js:logout` |
| `GET` | `/api/v1/auth/me` | Authentication | Cookie / Bearer | Authenticated User | Implemented | `src/modules/auth/auth.controller.js:getMe` |
| `GET` | `/api/v1/auth/contexts` | Authentication | Cookie / Bearer | `GOVERNMENT` | Implemented | `src/modules/auth/auth.controller.js:getContexts` |
| `POST` | `/api/v1/auth/context/switch` | Authentication | Cookie / Bearer | `GOVERNMENT` | Implemented | `src/modules/auth/auth.controller.js:switchContext` |
| `GET` | `/api/v1/parcels` | Parcels | Optional | Public (Filtered) | Implemented | `src/modules/parcels/parcel.controller.js:searchParcels` |
| `GET` | `/api/v1/parcels/:ulpin/360` | Parcels | Cookie / Bearer | Authenticated User | Implemented | `src/modules/parcels/parcel.controller.js:getParcel360` |
| `GET` | `/api/v1/parcels/:ulpin/ownership` | Parcels | Cookie / Bearer | Authenticated User | Implemented | `src/modules/parcels/parcel.controller.js:getOwnership` |
| `GET` | `/api/v1/parcels/:ulpin/encumbrances` | Parcels | Cookie / Bearer | Authenticated User | Implemented | `src/modules/parcels/parcel.controller.js:getEncumbrances` |
| `GET` | `/api/v1/parcels/:ulpin/restrictions` | Parcels | Cookie / Bearer | Authenticated User | Implemented | `src/modules/parcels/parcel.controller.js:getRestrictions` |
| `GET` | `/api/v1/parcels/:ulpin/zoning` | Parcels | Cookie / Bearer | Authenticated User | Implemented | `src/modules/parcels/parcel.controller.js:getZoning` |
| `GET` | `/api/v1/parcels/:ulpin/tax` | Parcels | Cookie / Bearer | Authenticated User | Implemented | `src/modules/parcels/parcel.controller.js:getTax` |
| `GET` | `/api/v1/parcels/:ulpin/courts` | Parcels | Cookie / Bearer | Authenticated User | Implemented | `src/modules/parcels/parcel.controller.js:getCourtCases` |
| `GET` | `/api/v1/parcels/:ulpin/documents` | Parcels | Cookie / Bearer | Authenticated User | Implemented | `src/modules/parcels/parcel.controller.js:getDocuments` |
| `GET` | `/api/v1/parcels/:ulpin/valuation` | Parcels | Cookie / Bearer | Authenticated User | Implemented | `src/modules/parcels/parcel.controller.js:getValuation` |
| `GET` | `/api/v1/parcels/:ulpin` | Parcels | Optional | Public (Summary) | Implemented | `src/modules/parcels/parcel.controller.js:getParcel` |
| `GET` | `/api/v1/mutations` | Mutations | Cookie / Bearer | Authenticated User | Implemented | `src/modules/mutations/mutation.controller.js:list` |
| `POST` | `/api/v1/mutations` | Mutations | Cookie / Bearer | `mutation.create` | Implemented | `src/modules/mutations/mutation.controller.js:create` |
| `GET` | `/api/v1/mutations/:id` | Mutations | Cookie / Bearer | Authenticated User | Implemented | `src/modules/mutations/mutation.controller.js:getById` |
| `POST` | `/api/v1/mutations/:id/actions/:action` | Mutations | Cookie / Bearer | Dynamic by Action | Implemented | `src/modules/mutations/mutation.controller.js:executeAction` |
| `POST` | `/api/v1/mutations/:id/approve` | Mutations | Cookie / Bearer | `mutation.approve` + MFA | Implemented | `src/modules/mutations/mutation.controller.js:approve` |
| `POST` | `/api/v1/mutations/:id/reject` | Mutations | Cookie / Bearer | `mutation.reject` + MFA | Implemented | `src/modules/mutations/mutation.controller.js:reject` |
| `POST` | `/api/v1/mutations/:id/field-verify` | Mutations | Cookie / Bearer | `mutation.field_verify` | Implemented | `src/modules/mutations/mutation.controller.js:submitFieldVerification` |
| `POST` | `/api/v1/mutations/:id/objections` | Mutations | Cookie / Bearer | Authenticated User | Implemented | `src/modules/mutations/mutation.controller.js:recordObjection` |
| `POST` | `/api/v1/mutations/:id/hearings` | Mutations | Cookie / Bearer | `mutation.hearing` | Implemented | `src/modules/mutations/mutation.controller.js:scheduleHearing` |
| `GET` | `/api/v1/cases/queue` | Cases | Cookie / Bearer | `GOVERNMENT` | Implemented | `src/modules/cases/case.controller.js:getMyQueue` |
| `GET` | `/api/v1/cases/my-queue` | Cases | Cookie / Bearer | `GOVERNMENT` | Implemented | `src/modules/cases/case.controller.js:getMyQueue` |
| `GET` | `/api/v1/cases/:id/dossier` | Cases | Cookie / Bearer | `GOVERNMENT` | Implemented | `src/modules/cases/case.controller.js:getDossier` |
| `GET` | `/api/v1/applications/types` | Applications | None | Public | Implemented | `src/modules/applications/application.controller.js:getTypes` |
| `GET` | `/api/v1/applications` | Applications | Cookie / Bearer | Authenticated User | Implemented | `src/modules/applications/application.controller.js:list` |
| `POST` | `/api/v1/applications` | Applications | Cookie / Bearer | Authenticated User | Implemented | `src/modules/applications/application.controller.js:create` |
| `GET` | `/api/v1/applications/:id` | Applications | Cookie / Bearer | Authenticated User | Implemented | `src/modules/applications/application.controller.js:getById` |
| `PATCH` | `/api/v1/applications/:id/status` | Applications | Cookie / Bearer | `GOVERNMENT` | Implemented | `src/modules/applications/application.controller.js:updateStatus` |
| `GET` | `/api/v1/documents` | Documents | Cookie / Bearer | Authenticated User | Implemented | `src/modules/documents/document.controller.js:list` |
| `POST` | `/api/v1/documents` | Documents | Cookie / Bearer | Authenticated User | Implemented | `src/modules/documents/document.controller.js:create` |
| `GET` | `/api/v1/documents/:id` | Documents | Cookie / Bearer | Authenticated User | Implemented | `src/modules/documents/document.controller.js:getById` |
| `GET` | `/api/v1/documents/:id/download-url` | Documents | Cookie / Bearer | Authenticated User | Implemented | `src/modules/documents/document.controller.js:getSignedUrl` |
| `POST` | `/api/v1/documents/:id/verify` | Documents | Cookie / Bearer | `GOVERNMENT` | Implemented | `src/modules/documents/document.controller.js:verify` |
| `GET` | `/api/v1/notifications` | Notifications | Cookie / Bearer | Authenticated User | Implemented | `src/modules/notifications/notification.controller.js:getMyNotifications` |
| `POST` | `/api/v1/notifications/mark-all-read` | Notifications | Cookie / Bearer | Authenticated User | Implemented | `src/modules/notifications/notification.controller.js:markAllAsRead` |
| `PATCH` | `/api/v1/notifications/:id/read` | Notifications | Cookie / Bearer | Authenticated User | Implemented | `src/modules/notifications/notification.controller.js:markAsRead` |
| `GET` | `/api/v1/jurisdictions` | Jurisdictions | None | Public | Implemented | `src/modules/jurisdictions/jurisdiction.routes.js:getHierarchy` |
| `GET` | `/api/v1/jurisdictions/states` | Jurisdictions | None | Public | Implemented | `src/modules/jurisdictions/jurisdiction.routes.js:getStates` |
| `GET` | `/api/v1/jurisdictions/districts` | Jurisdictions | None | Public | Implemented | `src/modules/jurisdictions/jurisdiction.routes.js:getDistricts` |
| `GET` | `/api/v1/jurisdictions/tehsils` | Jurisdictions | None | Public | Implemented | `src/modules/jurisdictions/jurisdiction.routes.js:getTehsils` |
| `GET` | `/api/v1/jurisdictions/villages` | Jurisdictions | None | Public | Implemented | `src/modules/jurisdictions/jurisdiction.routes.js:getVillages` |
| `GET` | `/api/v1/citizens/profile` | Citizens | Cookie / Bearer | `CITIZEN` | Implemented | `src/modules/citizens/citizen.routes.js:getProfile` |
| `PATCH` | `/api/v1/citizens/profile` | Citizens | Cookie / Bearer | `CITIZEN` | Implemented | `src/modules/citizens/citizen.routes.js:updateProfile` |
| `GET` | `/api/v1/citizens/parcels` | Citizens | Cookie / Bearer | `CITIZEN` | Implemented | `src/modules/citizens/citizen.routes.js:getMyParcels` |
| `GET` | `/api/v1/citizens/activity` | Citizens | Cookie / Bearer | `CITIZEN` | Implemented | `src/modules/citizens/citizen.routes.js:getMyActivity` |
| `GET` | `/api/v1/officers/profile` | Officers | Cookie / Bearer | `GOVERNMENT` | Implemented | `src/modules/officers/officer.routes.js:getProfile` |
| `GET` | `/api/v1/officers` | Officers | Cookie / Bearer | `GOVERNMENT` | Implemented | `src/modules/officers/officer.routes.js:list` |
| `GET` | `/api/v1/analytics/national` | Analytics | None | Public | Implemented | `src/modules/analytics/analytics.routes.js:getNational` |
| `GET` | `/api/v1/analytics/national-benchmarks` | Analytics | None | Public | Implemented | `src/modules/analytics/analytics.routes.js:getNationalBenchmarks` |
| `GET` | `/api/v1/analytics/state/:stateCode` | Analytics | None | Public | Implemented | `src/modules/analytics/analytics.routes.js:getState` |
| `GET` | `/api/v1/analytics/state-pmu/:stateCode?` | Analytics | None | Public | Implemented | `src/modules/analytics/analytics.routes.js:getStatePMU` |
| `GET` | `/api/v1/analytics/district/:districtCode` | Analytics | None | Public | Implemented | `src/modules/analytics/analytics.routes.js:getDistrict` |
| `GET` | `/api/v1/analytics/tehsil/:tehsilCode` | Analytics | None | Public | Implemented | `src/modules/analytics/analytics.routes.js:getTehsil` |
| `GET` | `/api/v1/analytics/system-health` | Analytics | None | Public | Implemented | `src/modules/analytics/analytics.routes.js:getSystemHealth` |
| `GET` | `/api/v1/gis/parcels/:ulpin/geojson` | GIS | None | Public | Implemented | `src/modules/gis/gis.routes.js:getParcelPolygon` |
| `GET` | `/api/v1/gis/villages/:villageCode/cadastral-map` | GIS | None | Public | Implemented | `src/modules/gis/gis.routes.js:getVillageMap` |
| `GET` | `/api/v1/gis/bbox` | GIS | None | Public | Implemented | `src/modules/gis/gis.routes.js:searchBbox` |
| `POST` | `/api/v1/gis/validate-geometry` | GIS | None | Public | Implemented | `src/modules/gis/gis.routes.js:validateGeometry` |
| `GET` | `/api/v1/audit` | Audit | Cookie / Bearer | `GOVERNMENT` | Implemented | `src/modules/audit/audit.routes.js:getRecent` |
| `GET` | `/api/v1/audit/:entityType/:entityId` | Audit | Cookie / Bearer | `GOVERNMENT` | Implemented | `src/modules/audit/audit.routes.js:getEntityTrail` |
| `GET` | `/api/v1/grievances` | Legacy Grievances | None | Public / Citizen | Deprecated | `src/controllers/grievanceController.js:getGrievances` |
| `POST` | `/api/v1/grievances` | Legacy Grievances | None | Citizen | Deprecated | `src/controllers/grievanceController.js:createGrievance` |
| `GET` | `/api/v1/grievances/:id` | Legacy Grievances | None | Citizen | Deprecated | `src/controllers/grievanceController.js:getGrievanceById` |
| `GET` | `/api/v1/watchlist` | Legacy Watchlist | None | Citizen | Deprecated | `src/controllers/watchlistController.js:getWatchlist` |
| `POST` | `/api/v1/watchlist` | Legacy Watchlist | None | Citizen | Deprecated | `src/controllers/watchlistController.js:addToWatchlist` |
| `DELETE` | `/api/v1/watchlist/:id` | Legacy Watchlist | None | Citizen | Deprecated | `src/controllers/watchlistController.js:removeFromWatchlist` |
| `GET` | `/api/v1/public/services` | Legacy Public | None | Public | Deprecated | `src/controllers/publicController.js:getServices` |
| `GET` | `/api/v1/public/news` | Legacy Public | None | Public | Deprecated | `src/controllers/publicController.js:getNews` |
| `GET` | `/api/v1/public/notices` | Legacy Public | None | Public | Deprecated | `src/controllers/publicController.js:getNotices` |
| `GET` | `/api/v1/public/jurisdictions` | Legacy Public | None | Public | Deprecated | `src/controllers/publicController.js:getJurisdictions` |

---

## Detailed Endpoint Documentation

---

### 1. System Health & Diagnostics

#### GET /health
**Purpose:** Root application health check. Returns backend version, running mode, and request correlation ID.  
**Status:** Implemented  
**Authentication:** Public  
**Required Role/Permission:** None  
**Request Headers:** None  
**Path Parameters:** None  
**Query Parameters:** None  
**Request Body:** None  
**Success Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2026-09-14T12:00:00.000Z",
  "service": "Land Stack Express Backend",
  "version": "2.0.0",
  "mode": "mock",
  "correlationId": "4c219f80-781e-45fa-bb26-ec4831f24e90"
}
```
**Implementation:** `src/server.js:healthHandler`  
**Example Request:**
```bash
curl -X GET http://localhost:5000/health
```

#### GET /api/v1/health
**Purpose:** Versioned health endpoint under API route prefix.  
**Status:** Implemented  
*(Parameters and response format identical to `/health`).*

---

### 2. Authentication Module

#### POST /api/v1/auth/citizen/request-otp
**Purpose:** Initiate SMS OTP authentication for citizen landholders.  
**Status:** Implemented  
**Authentication:** Public (Rate limited: 5 requests per 15 min)  
**Request Headers:** `Content-Type: application/json`  
**Request Body Schema:**
```json
{
  "mobile": "+919876543210"
}
```
**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "OTP sent successfully (mock mode: use 123456)."
  }
}
```
**Implementation:** `src/modules/auth/auth.controller.js:requestOtp`  
**Example Request:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/citizen/request-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile": "+919876543210"}'
```

#### POST /api/v1/auth/citizen/verify-otp
**Purpose:** Verify phone OTP, provision citizen session, and set secure HTTP-only cookies.  
**Status:** Implemented  
**Authentication:** Public (Rate limited: 10 attempts per 15 min)  
**Request Headers:** `Content-Type: application/json`  
**Request Body Schema:**
```json
{
  "mobile": "+919876543210",
  "otp": "123456"
}
```
**Success Response (200 OK):** Sets `Set-Cookie: access_token=...; HttpOnly; SameSite=Lax`
```json
{
  "success": true,
  "data": {
    "id": "CIT-001",
    "name": "Aarav Patil",
    "role": "CITIZEN",
    "userType": "CITIZEN",
    "permissions": ["parcel.search", "parcel.view_public", "mutation.create", "application.create"]
  },
  "message": "Authentication successful."
}
```
**Implementation:** `src/modules/auth/auth.controller.js:verifyOtp`  
**Example Request:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/citizen/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile": "+919876543210", "otp": "123456"}' -i
```

#### POST /api/v1/auth/government/login
**Purpose:** Government officer email/password login. Returns officer profile, assignments, and sets session cookies.  
**Status:** Implemented  
**Authentication:** Public (Rate limited: 10 attempts per 15 min)  
**Request Headers:** `Content-Type: application/json`  
**Request Body Schema:**
```json
{
  "email": "tahsildar.haveli@mahabhumi.gov.in",
  "password": "Password123!"
}
```
**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "GOV-001",
    "name": "Sanjay Deshmukh",
    "role": "TEHSILDAR",
    "userType": "GOVERNMENT",
    "department": "DEPT-REV",
    "activeContext": "RURAL",
    "assignments": [
      {
        "role": "TEHSILDAR",
        "context": "RURAL",
        "tehsilCode": "TEH-HAV"
      }
    ]
  },
  "message": "Login successful."
}
```
**Implementation:** `src/modules/auth/auth.controller.js:governmentLogin`

#### GET /api/v1/auth/me
**Purpose:** Retrieve currently authenticated user profile, active context, jurisdiction, and permissions.  
**Status:** Implemented  
**Authentication:** Protected (Cookie or `Authorization: Bearer <token>`)  
**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "authId": "mock-auth-GOV-001",
    "userType": "GOVERNMENT",
    "userId": "GOV-001",
    "role": "TEHSILDAR",
    "name": "Sanjay Deshmukh",
    "email": "sanjay.deshmukh@maharashtra.gov.in",
    "activeContext": "RURAL",
    "jurisdiction": {
      "stateCode": "MH",
      "districtCode": "DIST-PUN",
      "tehsilCode": "TEH-HAV"
    },
    "permissions": ["parcel.search", "mutation.approve", "mutation.reject", "case.view_queue"]
  }
}
```

#### POST /api/v1/auth/context/switch
**Purpose:** Switch active officer context (e.g. toggle between RURAL and URBAN).  
**Status:** Implemented  
**Authentication:** Protected (`GOVERNMENT` role required)  
**Request Body:** `{"context": "URBAN"}`  
**Success Response (200 OK):** Returns updated context profile.

#### POST /api/v1/auth/logout
**Purpose:** Terminate session and clear HTTP-only cookies.  
**Status:** Implemented  
**Authentication:** Public  
**Success Response (200 OK):** Clears `access_token` and `refresh_token` cookies.

---

### 3. Parcel 360° Module

#### GET /api/v1/parcels
**Purpose:** Search and filter cadastral land parcels. Public view filters sensitive landholder identifiers.  
**Status:** Implemented  
**Authentication:** Optional (authenticated users receive enriched attributes)  
**Query Parameters:**
- `search`: Case-insensitive text search matching ULPIN, survey number, gat number, or village.
- `state`: State code (e.g. `MH`).
- `district`: District code (e.g. `DIST-PUN`).
- `tehsil`: Tehsil code (e.g. `TEH-HAV`).
- `village`: Village code (e.g. `VIL-WAG`).
- `status`: Filter by status (`CLEAR`, `ENCUMBERED`, `RESTRICTED`, `DISPUTED`).
- `limit`: Number of results (default 50).
- `cursor`: ULPIN cursor for pagination.
**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "ulpin": "ULPIN-MH-PUN-000001",
      "surveyNumber": "104",
      "gatNumber": "42",
      "villageName": "Wagholi",
      "area": 1.45,
      "areaUnit": "Hectare",
      "status": "CLEAR"
    }
  ],
  "page": {
    "page": 1,
    "limit": 50,
    "total": 31,
    "hasMore": false
  }
}
```
**Implementation:** `src/modules/parcels/parcel.controller.js:searchParcels`

#### GET /api/v1/parcels/:ulpin/360
**Purpose:** Aggregates comprehensive Parcel 360° intelligence dossier including Ready Reckoner valuation and data health scoring.  
**Status:** Implemented  
**Authentication:** Protected (`requireAuth`)  
**Path Parameters:** `ulpin` (e.g. `ULPIN-MH-PUN-000001`)  
**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "ulpin": "ULPIN-MH-PUN-000001",
      "gatNumber": "42",
      "villageName": "Wagholi",
      "area": 1.45,
      "landUse": "Agricultural",
      "status": "CLEAR"
    },
    "map": { "latitude": 18.5793, "longitude": 73.9812 },
    "ownership": {
      "current": [{ "ownerName": "Aarav Patil", "share": 100, "khataNumber": "KH-8A-1001" }]
    },
    "encumbrances": { "records": [], "count": 0 },
    "restrictions": { "records": [], "count": 0 },
    "tax": { "pendingDues": 0, "paymentStatus": "PAID" },
    "courts": { "cases": [], "count": 0 },
    "valuation": {
      "circleRate": { "value": 4500, "unit": "INR/sq.m", "source": "Ready Reckoner 2026" }
    },
    "mutations": { "records": [], "count": 0 },
    "documents": [],
    "dataHealth": { "completeness": 80, "score": "4/5" }
  }
}
```
**Implementation:** `src/modules/parcels/parcel.controller.js:getParcel360`

#### GET /api/v1/parcels/:ulpin/valuation
**Purpose:** Inspect government Ready Reckoner benchmark circle rate for property valuation.  
**Status:** Implemented  
**Authentication:** Protected (`requireAuth`)  
**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "ulpin": "ULPIN-MH-PUN-000001",
    "valuation": {
      "circleRate": {
        "value": 4500,
        "unit": "INR/sq.m",
        "source": "Ready Reckoner 2026"
      },
      "disclaimer": "Reference value only. Not an authoritative transaction valuation."
    }
  }
}
```

---

### 4. 12-State Mutation Module

#### GET /api/v1/mutations
**Purpose:** List land mutation applications. Citizens see their own; officers see records scoped to their territorial jurisdiction.  
**Status:** Implemented  
**Authentication:** Protected (`requireAuth`)  
**Query Parameters:** `parcelUlpin`, `tehsilCode`, `villageCode`, `status`, `page`, `limit`.  
**Success Response (200 OK):** Paginated list of mutations.

#### POST /api/v1/mutations
**Purpose:** Initiate a formal land mutation (e-Ferfar) for a parcel. Sets initial state to `INITIATED`.  
**Status:** Implemented  
**Authentication:** Protected (`requireAuth`)  
**Request Body Schema:**
```json
{
  "parcelUlpin": "ULPIN-MH-PUN-000001",
  "type": "Sale Deed Mutation",
  "buyerName": "Rohan Kadam",
  "remarks": "Sale Deed registered at SRO Haveli"
}
```
**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "MUT-2026-00456",
    "mutationNumber": "FERFAR-2026-1428",
    "parcelUlpin": "ULPIN-MH-PUN-000001",
    "status": "INITIATED",
    "slaDays": 30
  },
  "message": "Mutation initiated successfully"
}
```

#### GET /api/v1/mutations/:id
**Purpose:** Get full mutation details, including timeline milestones, objections, hearings, and audit trail.  
**Status:** Implemented  
**Authentication:** Protected (`requireAuth`)  
**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "MUT-001",
    "mutationNumber": "FERFAR-2025-0101",
    "status": "APPROVED",
    "timeline": [
      {
        "title": "SRO Deed Registration & Stamp Duty Verification",
        "status": "COMPLETED",
        "date": "2025-01-05"
      }
    ],
    "objections": [],
    "hearings": [],
    "auditTrail": []
  }
}
```

#### POST /api/v1/mutations/:id/actions/:action
**Purpose:** Execute deterministic state machine transition actions (`ASSIGN_VERIFICATION`, `REVIEW`, `START_NOTICE`, `CLOSE`).  
**Status:** Implemented  
**Authentication:** Protected (`requireAuth` + granular action permission)  
**Error Behavior:** Returns `409 Conflict` if the requested action is invalid in the current state.

#### POST /api/v1/mutations/:id/approve
**Purpose:** Statutory approval of mutation. Enforces `mutation.approve` permission (Tahsildar/CRO) and MFA token.  
**Status:** Implemented  
**Authentication:** Protected (`requirePermission('mutation.approve')`, `requireMfaStepUp()`)  
**Request Body:**
```json
{
  "remarks": "Form 135D notice elapsed with zero objections. Panchnama verified.",
  "_mfaToken": "mock-mfa-token"
}
```
**Statutory Non-Bypass Enforcement:** An administrator attempting this call receives `403 Forbidden`. Attempting approval directly from `INITIATED` without field verification returns `409 Conflict`.

#### POST /api/v1/mutations/:id/field-verify
**Purpose:** Submit Talathi physical ground inspection panchnama and geotagged boundary verification.  
**Status:** Implemented  
**Authentication:** Protected (`requirePermission('mutation.field_verify')` — Talathi/Patwari)  
**Request Body:**
```json
{
  "remarks": "Boundary stones inspected and intact. Possession confirmed.",
  "boundaryChecked": true,
  "photos": [1, 2]
}
```

#### POST /api/v1/mutations/:id/objections
**Purpose:** Record a third-party objection during the Form 135D 15-day notice window. Moves state to `OBJECTION_RECEIVED`.  
**Status:** Implemented  
**Authentication:** Protected (`requireAuth`)  
**Request Body:**
```json
{
  "objectorName": "Suresh Jadhav",
  "objectionType": "Title Dispute",
  "description": "Partition suit pending in Senior Civil Court Pune"
}
```

#### POST /api/v1/mutations/:id/hearings
**Purpose:** Schedule executive magistrate dispute hearing for contested mutations. Moves state to `HEARING_SCHEDULED`.  
**Status:** Implemented  
**Authentication:** Protected (`requirePermission('mutation.hearing')` — Tahsildar)  
**Request Body:**
```json
{
  "scheduledDate": "2026-10-15T10:30:00Z",
  "venue": "Tehsildar Court Room No. 2, Haveli",
  "notes": "Bring original registered deed and family pedigree"
}
```

---

### 5. Cases & Work Queues

#### GET /api/v1/cases/queue
**Purpose:** Dynamically derive officer work queue according to territorial assignments.  
**Status:** Implemented  
**Authentication:** Protected (`GOVERNMENT` role required)  
**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "officer": { "id": "GOV-001", "role": "TEHSILDAR" },
    "metrics": { "total": 4, "highPriorityCount": 1, "overdueCount": 0 },
    "items": [
      {
        "id": "MUT-PU-HVL-2026-00456",
        "gatNumber": "Gat 45/2A",
        "village": "Wadgaon Sheri",
        "status": "READY_FOR_ORDER",
        "priority": "NORMAL"
      }
    ]
  }
}
```

#### GET /api/v1/cases/:id/dossier
**Purpose:** Compiles full quasi-judicial case dossier for decision making, including prerequisite compliance checklists.  
**Status:** Implemented  
**Authentication:** Protected (`GOVERNMENT` role required)  
**Success Response (200 OK):** Returns comprehensive case details, panchnama report, photos, and statutory checklist.

---

### 6. Citizen Applications Module

#### GET /api/v1/applications/types
**Purpose:** List available statutory land services (7/12 Extract, 8A, Property Card, Mojani, NA NOC) with SLA days and fees.  
**Status:** Implemented  
**Authentication:** Public  
**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    { "type": "EXTRACT_712", "name": "Digitally Signed 7/12 Extract", "slaDays": 1, "fee": 15 },
    { "type": "MOJANI", "name": "Cadastral Boundary Measurement", "slaDays": 30, "fee": 1000 }
  ]
}
```

#### POST /api/v1/applications
**Purpose:** Submit a statutory citizen service request.  
**Status:** Implemented  
**Authentication:** Protected (`requireAuth`)  
**Request Body:**
```json
{
  "typeCode": "EXTRACT_712",
  "parcelUlpin": "ULPIN-MH-PUN-000001",
  "feeAmount": 15
}
```

---

### 7. GIS & Cadastral Operations

#### GET /api/v1/gis/parcels/:ulpin/geojson
**Purpose:** Get standard RFC 7946 GeoJSON Feature representation of a cadastral parcel polygon.  
**Status:** Implemented  
**Authentication:** Public  
**Success Response (200 OK):**
```json
{
  "type": "Feature",
  "id": "ULPIN-MH-PUN-000001",
  "properties": {
    "ulpin": "ULPIN-MH-PUN-000001",
    "surveyNumber": "104",
    "gatNumber": "42",
    "village": "Wagholi",
    "areaHectares": 1.45
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [73.9802, 18.5783],
        [73.9822, 18.5783],
        [73.9822, 18.5803],
        [73.9802, 18.5803],
        [73.9802, 18.5783]
      ]
    ]
  }
}
```

#### GET /api/v1/gis/villages/:villageCode/cadastral-map
**Purpose:** Returns village cadastral map as a GeoJSON FeatureCollection.  
**Status:** Implemented  
**Authentication:** Public  

#### POST /api/v1/gis/validate-geometry
**Purpose:** Verify topological correctness of cadastral boundary coordinates.  
**Status:** Implemented  
**Authentication:** Public  
**Request Body:** `{"coordinates": [[[73.9, 18.5], [73.91, 18.5], [73.91, 18.51], [73.9, 18.5]]]`  
**Success Response (200 OK):** `{"success": true, "data": {"valid": true}}`

---

### 8. Analytics & Audit Modules

#### GET /api/v1/analytics/national
**Purpose:** High-level dashboard metrics on land digitization, active mutations, and processing times.  
**Status:** Implemented  
**Authentication:** Public  
**Success Response (200 OK):** Returns national KPIs.

#### GET /api/v1/audit
**Purpose:** Query recent immutable system audit events.  
**Status:** Implemented  
**Authentication:** Protected (`GOVERNMENT` role required)  

#### GET /api/v1/audit/:entityType/:entityId
**Purpose:** Retrieve complete immutable audit trail for a specific entity (e.g. `MUTATION`, `MUT-001`).  
**Status:** Implemented  
**Authentication:** Protected (`GOVERNMENT` role required)  

---

### 9. Legacy Compatibility Routes

#### GET /api/v1/grievances
**Purpose:** Retrieve citizen grievances.  
**Status:** Deprecated (Maintained for backwards compatibility)  

#### GET /api/v1/watchlist
**Purpose:** Retrieve land parcels on citizen monitoring list.  
**Status:** Deprecated (Maintained for backwards compatibility)  

#### GET /api/v1/public/services
**Purpose:** List public revenue portal services catalog.  
**Status:** Deprecated (Maintained for backwards compatibility)  
