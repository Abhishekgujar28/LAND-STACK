# BACKEND FEATURES AND API IMPLEMENTATION

This document defines the implementation status and responsibilities for all backend modules. 

## 1. Auth Module (`src/modules/auth`)
- **Status:** Partially Implemented
- **APIs:** 
  - `POST /auth/login` (Citizen OTP / Govt Email)
  - `POST /auth/verify`
  - `POST /auth/context` (Frontend context setting)
- **Missing:** Role-based MFA.

## 2. Parcel 360 Module (`src/modules/parcels`)
- **Status:** Partially Implemented
- **APIs:**
  - `GET /parcels` (Search)
  - `GET /parcels/:ulpin`
  - `GET /parcels/:ulpin/360` (Dossier compilation)
- **Missing:** Actual integration with PostGIS for spatial intersection, complete pagination, caching.

## 3. GIS Module (`src/modules/gis`)
- **Status:** Missing
- **Planned APIs:** 
  - `GET /gis/tiles/:z/:x/:y`
  - `GET /gis/intersect`
- **Missing:** `schema.sql` lacks `GEOMETRY` types.

## 4. Mutation Engine (`src/modules/mutations`)
- **Status:** Stubbed / Not fully implemented
- **Planned APIs:**
  - `POST /mutations/apply`
  - `GET /mutations/:id`
  - `POST /mutations/:id/approve`
- **Missing:** State machine logic, jurisdiction validation, and audit trail chaining.

## 5. Workflows & Cases (`src/modules/cases`)
- **Status:** Missing
- **Purpose:** Manages work queues for Tehsildar, Talathi, etc.

## 6. Applications (`src/modules/applications`)
- **Status:** Missing
- **Purpose:** Citizen requests for RoR certificates.

## 7. Documents (`src/modules/documents`)
- **Status:** Missing
- **Purpose:** Secure document upload and retrieval with HMAC verification.

## 8. Notifications & Watchlist (`src/modules/notifications` and legacy routes)
- **Status:** Fragmented
- **Note:** Currently split between `src/routes/watchlistRoutes.js` and `src/modules/notifications`. Needs unification.

## 9. Analytics/MIS (`src/modules/analytics`)
- **Status:** Missing
- **Purpose:** Tiered drill-down analytics for state and national dashboards.

## 10. Audit (`src/modules/audit`)
- **Status:** Missing
- **Purpose:** APIs to query the append-only ledger for provenance.
