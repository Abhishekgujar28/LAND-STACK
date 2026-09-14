# Implementation Roadmap & Final Acceptance Checklist

## 1. Purpose
This document provides the exact phased roadmap for ripping out the frontend mock architecture and integrating it natively with the existing Supabase-powered backend.

## 2. Implementation Phases

### Phase 1: Total Mock Annihilation
- **File:** `backend/src/config/env.js` & `supabase.js`
  - Remove `DATA_PROVIDER_MODE`. Enforce `SUPABASE_URL` presence.
- **File:** `backend/src/data/mockStore.js`
  - Delete completely. Delete `backend/src/data/json/` directory.
- **File:** `frontend/src/api/client.js`
  - Delete static fallback datasets (`parcelsData`, etc.).
  - Add `credentials: 'include'` to base fetch options.

### Phase 2: Frontend Auth Realignment
- **File:** `frontend/src/context/AuthContext.jsx`
  - Remove all logic pertaining to `localStorage.getItem('landstack_user')`.
  - Add `useEffect` to call `apiClient.get('auth/me')` on mount to rehydrate session.
- **File:** `frontend/src/services/authService.js`
  - Remap `loginCitizen` and `loginOfficer` to call the true backend routes:
    - Citizen: `POST /api/v1/auth/citizen/verify-otp`
    - Officer: `POST /api/v1/auth/government/login`
- **File:** `frontend/src/config/roles.js`
  - Update exactly to the 14-role array established in `backend/src/core/permissions.js`.

### Phase 3: Citizen Feature Parity
- **File:** `frontend/src/pages/citizen/Dashboard.jsx` (and associated components)
  - Connect to `GET /api/v1/parcels/owner/:id` for form 8A lists.
  - Connect to `GET /api/v1/parcels/:ulpin/360` for Parcel details.
  - Connect to `POST /api/v1/mutations` for e-Ferfar submissions.
  
### Phase 4: Government Work Queues & Mutation Approvals
- **File:** `frontend/src/pages/government/WorkQueue.jsx` (or equivalent)
  - Fetch strictly from `GET /api/v1/cases/queue` (dynamic per-officer assignment).
- **File:** `frontend/src/pages/government/MutationReview.jsx`
  - Bind "Approve" button to `PATCH /api/v1/mutations/:id/status` (status: `APPROVED`).
  - Implement MFA UI prompt for the required `_mfaToken` payload field.

### Phase 5: GIS Verification
- **File:** `frontend/src/components/gis/CadastralMap.jsx` (or equivalent)
  - Bind to `GET /api/v1/gis/villages/:villageCode/cadastral-map` to fetch real GeoJSON.

## 3. Final End-to-End Acceptance Checklist
Do NOT consider the backend-frontend integration complete until ALL of the following conditions are met:

- [ ] **Database Integrity:** No JavaScript files contain hardcoded data arrays.
- [ ] **Cookie Security:** The browser network tab shows `access_token` and `refresh_token` stored as HttpOnly cookies.
- [ ] **Refresh Lifecycle:** Closing the browser and reopening it successfully restores the user session by fetching `/api/v1/auth/me`.
- [ ] **Statutory Enforcement:** Manually forcing `landstack_role = ADMIN` does not expose the "Approve Mutation" button in the UI, and attempting a raw API POST returns `403 Forbidden`.
- [ ] **Empty States:** A newly created officer with no assigned queue sees an empty queue UI, not a fallback mock list.
- [ ] **Mutation Safety:** An `INITIATED` mutation cannot be forced into `APPROVED` via API without passing through verification guards.
- [ ] **SQL Seeding:** The Supabase database contains exactly the SQL seed data provided in `003_seed_data.sql` and nothing else on initialization.
