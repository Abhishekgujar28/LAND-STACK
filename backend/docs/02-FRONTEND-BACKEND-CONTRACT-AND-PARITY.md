# Frontend-Backend Contract & Feature Parity Matrix

## 1. Purpose
This document maps every backend capability to its intended frontend usage, establishing a strict contract. It identifies mismatches where the frontend uses mocked data or bypasses the backend entirely. 

## 2. Global Contract & Error Standard
- **Transport:** All JSON payloads must be sent over HTTPS.
- **Authentication:** Must use HTTP-only cookies (`access_token`, `refresh_token`).
- **Fetch Setup:** The frontend API Client MUST set `credentials: 'include'` on every request.
- **Error Standard:** Backend errors adhere strictly to the following structure:
  ```json
  {
    "success": false,
    "error": {
      "code": "ERROR_CODE",
      "message": "Human readable message",
      "details": null
    },
    "requestId": "uuid"
  }
  ```
  The frontend API client must intercept 401 statuses and globally clear local state to redirect to `/login`.

## 3. Backend-Frontend Endpoint Matrix

| Backend Endpoint | Method | Backend Purpose | Frontend Consumer | Current UI Status | Required Action |
| --- | --- | --- | --- | --- | --- |
| `/api/v1/auth/me` | `GET` | Session hydration | `AuthContext` | ❌ Bypassed | Remove `localStorage`. Use this endpoint on load. |
| `/api/v1/auth/citizen/verify-otp` | `POST` | Citizen Login | `CitizenLoginPage` | ❌ Mocked | Update `authService` to call this and remove mock. |
| `/api/v1/auth/government/login` | `POST` | Officer Login | `GovernmentLoginPage` | ❌ Mocked | Update `authService` to call this and remove mock. |
| `/api/v1/auth/refresh` | `POST` | Token Refresh | `apiClient` Interceptor | ❌ Missing | Add 401 interceptor in `apiClient.js` to refresh. |
| `/api/v1/parcels` | `GET` | Parcel search | `ParcelSearchPage` | ❌ Mocked | Replace static array with API call. |
| `/api/v1/parcels/:ulpin/360` | `GET` | Parcel 360 title dossier | `ParcelDetailsPage` | ❌ Mocked | Replace `parcelsData.find()` with API call. |
| `/api/v1/cases/queue` | `GET` | Dynamic officer work queue | `WorkQueuePage` | ❌ Mocked | Fetch dynamically; do not hardcode queue arrays. |
| `/api/v1/mutations` | `POST` | Create mutation application | `MutationPage` | ❌ Mocked | Replace static UI push with API POST. |
| `/api/v1/mutations/:id/status` | `PATCH` | Statutory mutation approval | `TehsildarDashboard` | ❌ Mocked | Connect to backend to enforce state machine. |
| `/api/v1/notifications` | `GET` | Alerts and milestones | `NotificationPanel` | ❌ Mocked | Fetch from API. |

## 4. Feature Parity Breakdown

### Authentication
- **Backend Status:** Fully Implemented (OTP, Login, Cookies).
- **Frontend Status:** Mocked (`localStorage` fallback).
- **Required Fix:** Strip `AuthContext.jsx` of all mock JSON logic. Use `authService.me()`.

### Citizen Portal
- **Backend Status:** Implemented (`/citizens/profile`, `/parcels/owner/:id`, `/applications`).
- **Frontend Status:** Partially Implemented (UI built, data mocked).
- **Required Fix:** Bind `My Parcels`, `Watchlist`, and `Applications` tabs directly to API.

### Government Portal
- **Backend Status:** Implemented (Queues derived from assignment contexts, dossier generation).
- **Frontend Status:** Mocked. `talathiQueueData` and `tehsildarQueueData` are statically defined.
- **Required Fix:** Point officer dashboard directly to `/api/v1/cases/queue` and let backend role validation handle filtering.

### GIS Maps
- **Backend Status:** Implemented (`/gis/villages/:id/cadastral-map`).
- **Frontend Status:** Likely static GeoJSON files or mocked API calls.
- **Required Fix:** Ensure the Map view uses the backend GeoJSON API endpoint.
