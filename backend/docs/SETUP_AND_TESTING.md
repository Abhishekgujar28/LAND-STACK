# BHARATBHUMI Backend — Setup, Testing & Operations Guide

This guide provides step-by-step instructions for installing, configuring, running, and verifying the **BHARATBHUMI** (Land Stack) backend in both local mock development mode and live Supabase PostgreSQL staging/production environments.

---

## 1. Prerequisites

Before installing the BHARATBHUMI backend, ensure your environment meets the following software requirements:

- **Node.js:** `v20.0.0` or higher (tested on Node.js `v24.21.0`).
- **npm:** `v10.0.0` or higher.
- **Operating System:** Windows 10/11, macOS, or Linux (Ubuntu 22.04 LTS recommended).
- **PostgreSQL & PostGIS (Optional for live mode):** PostgreSQL 15+ with PostGIS extensions enabled (provided out-of-the-box by Supabase).
- **Network / Ports:** Port `5000` (configurable via `PORT` environment variable).

---

## 2. Installation

Navigate to the `backend` directory and install dependencies:

```bash
cd backend
npm install
```

### Dependency Audit
All dependencies are defined in `package.json`:
- `express` (`^4.21.2`): Core server engine.
- `@supabase/supabase-js` (`^2.49.1`): Database and Auth client.
- `helmet` (`^8.3.0`): HTTP security headers.
- `cookie-parser` (`^1.4.7`): Session cookie management.
- `compression` (`^1.8.2`): Response compression.
- `cors` (`^2.8.5`): Cross-origin resource sharing.
- `zod` (`^4.6.5`): Runtime request schema validation.
- `express-rate-limit` (`^8.7.0`): Rate limiting and DDoS protection.
- `uuid` (`^14.0.2`): Correlation tracing.
- `multer` (`^2.3.0`): File upload management.

---

## 3. Environment Configuration

Configuration is managed via environment variables loaded in `src/config/env.js`.

Create a local `.env` file from the provided template:

```bash
cp .env.example .env
```

### Environment Variable Reference

| Variable Name | Required | Default Value | Description |
|---|---|---|---|
| `PORT` | Optional | `5000` | Port for the Express HTTP server |
| `NODE_ENV` | Optional | `development` | Environment mode (`development` or `production`) |
| `DATA_PROVIDER_MODE` | Optional | `mock` | Data engine mode: `mock` (in-memory) or `supabase` (live DB) |
| `FRONTEND_URL` | Optional | `http://localhost:5173` | Allowed origin for frontend client CORS |
| `CORS_ORIGIN` | Optional | `http://localhost:5173` | Explicit CORS origin override |
| `SUPABASE_URL` | Required in live mode | `https://your-project.supabase.co` | Supabase project API URL |
| `SUPABASE_ANON_KEY` | Required in live mode | *(JWT Token)* | Public anonymous client API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Required in live mode | *(JWT Token)* | Private service-role key for administrative tasks |
| `ACCESS_TOKEN_MAX_AGE` | Optional | `900` | Access token lifetime in seconds (15 minutes) |
| `REFRESH_TOKEN_MAX_AGE` | Optional | `604800` | Refresh token lifetime in seconds (7 days) |
| `RATE_LIMIT_MAX` | Optional | `100` | Max requests per 15-minute window for general API |

> [!IMPORTANT]
> Never commit `.env` containing live Supabase service keys to Git. The `.gitignore` file is configured to exclude all `.env` variants.

---

## 4. Database Setup & Provisioning

The database scripts are organized under `backend/database/migrations/`:

### 1. Execute DDL Schema Migration (`001_core_schema.sql`)
Creates core administrative, cadastral, workflow, and audit tables:
```sql
-- In Supabase SQL Editor:
-- Run contents of database/migrations/001_core_schema.sql
```

### 2. Apply Row Level Security Policies (`002_rls_policies.sql`)
Configures fine-grained access control:
- Citizens restricted to their own records (`auth.uid() = auth_user_id`).
- Officers restricted to their assigned territorial boundary (`village_code`, `tehsil_code`).
- `audit_logs` secured as immutable append-only records (`REVOKE UPDATE, DELETE`).
```sql
-- Run contents of database/migrations/002_rls_policies.sql
```

### 3. Seed Realistic Records (`003_seed_data.sql`)
Populates administrative jurisdictions, demo officers, citizens, parcels, and mutation history across rural and urban Maharashtra:
```sql
-- Run contents of database/migrations/003_seed_data.sql
```

*(Alternatively, run the automated seed script `node database/run-seed.js` if Supabase keys are populated in `.env`).*

---

## 5. Starting the Server

### Development Mode (with Live Reloading)
```bash
npm run dev
```
*(Uses native Node.js watch mode: `node --watch src/server.js`).*

### Production Mode
```bash
npm start
```
*(Executes `node src/server.js`).*

### Expected Console Output
```text
[Supabase] Not configured. Running in mock mode.
=========================================
🚀 Land Stack Backend v2.0 Running
📍 Port: 5000
🌐 Base API: http://localhost:5000/api/v1
🩺 Health: http://localhost:5000/health
📦 Data Mode: MOCK
🔐 Supabase Connected: NO (Mock Mode Active)
=========================================
```

---

## 6. Verifying Server Health

Verify server availability using curl:

```bash
curl -i http://localhost:5000/health
```

### Expected Response (`200 OK`)
```json
{
  "status": "healthy",
  "timestamp": "2026-09-14T12:00:00.000Z",
  "service": "Land Stack Express Backend",
  "version": "2.0.0",
  "mode": "mock",
  "supabaseConnected": false,
  "correlationId": "581d4a8e-289c-4903-8d6f-801264c7001a"
}
```

---

## 7. Testing with Postman

The complete Postman collection is located at:
`backend/docs/postman/BHARATBHUMI.postman_collection.json`

### Import & Setup Instructions:
1. Open **Postman**.
2. Click **Import** and select `backend/docs/postman/BHARATBHUMI.postman_collection.json`.
3. Select the imported collection **"BHARATBHUMI API"** and inspect collection variables:
   - `baseUrl`: Set to `http://localhost:5000/api/v1` (default).
   - `ulpin`: Set to `ULPIN-MH-PUN-000001`.
   - `mutationId`: Set to `MUT-001`.
   - `villageCode`: Set to `VIL-WAG`.
4. **Cookie Handling:** Postman automatically stores and passes cookies returned from `POST /auth/citizen/verify-otp` and `POST /auth/government/login`.
5. **Testing Role Separation:**
   - Execute **Government Auth > Login as Tahsildar** to receive officer session.
   - Run **Cases & Queues > Get Officer Work Queue** to observe Tahsildar hearings.
   - Execute **Mutations > Approve Mutation** to verify statutory approval.

---

## 8. Executable curl Testing Examples

### 1. Citizen OTP Request & Verify
```bash
# Request OTP
curl -X POST http://localhost:5000/api/v1/auth/citizen/request-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile": "+919876543210"}'

# Verify OTP and save cookie jar
curl -X POST http://localhost:5000/api/v1/auth/citizen/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile": "+919876543210", "otp": "123456"}' \
  -c cookies.txt
```

### 2. Search Land Parcels
```bash
curl -X GET "http://localhost:5000/api/v1/parcels?search=Wagholi&limit=5"
```

### 3. Fetch Full Parcel 360° Profile
```bash
curl -X GET http://localhost:5000/api/v1/parcels/ULPIN-MH-PUN-000001/360 \
  -b cookies.txt
```

### 4. Fetch Cadastral GeoJSON Polygon
```bash
curl -X GET http://localhost:5000/api/v1/gis/parcels/ULPIN-MH-PUN-000001/geojson
```

### 5. Government Officer Login (Tahsildar)
```bash
curl -X POST http://localhost:5000/api/v1/auth/government/login \
  -H "Content-Type: application/json" \
  -d '{"email": "tahsildar.haveli@mahabhumi.gov.in", "password": "Password123!"}' \
  -c gov_cookies.txt
```

### 6. Inspect Officer Work Queue
```bash
curl -X GET http://localhost:5000/api/v1/cases/queue \
  -b gov_cookies.txt
```

### 7. Inspect Statutory Case Dossier
```bash
curl -X GET http://localhost:5000/api/v1/cases/MUT-PU-HVL-2026-00456/dossier \
  -b gov_cookies.txt
```

---

## 9. Complete End-to-End Testing Workflow

To validate the entire system from scratch, follow this 11-step sequence:

1. **Start Backend Server:** Ensure `http://localhost:5000/health` responds with `"status": "healthy"`.
2. **Retrieve Application Services:** Run `GET /api/v1/applications/types` to confirm public service listings.
3. **Public Cadastral Search:** Run `GET /api/v1/parcels?search=Wagholi` to verify search filtering.
4. **Citizen Authentication:** Execute OTP request and verify for mobile `+919876543210`. Retain session cookies.
5. **Inspect Citizen Landholdings:** Run `GET /api/v1/citizens/parcels` with citizen cookie to inspect owned parcels.
6. **Initiate Land Mutation:** Submit `POST /api/v1/mutations` for parcel `ULPIN-MH-PUN-000001`. Confirm state is `INITIATED`.
7. **Verify State Machine Guard:** Attempt to approve the new mutation immediately via `POST /api/v1/mutations/:id/approve`. Verify the server rejects the request with `409 Conflict`.
8. **Officer Authentication:** Log in as Tahsildar via `POST /api/v1/auth/government/login`.
9. **Inspect Work Queue:** Call `GET /api/v1/cases/queue` to review assigned pending tasks for Tehsil Haveli.
10. **Cadastral GIS Verification:** Request `GET /api/v1/gis/parcels/ULPIN-MH-PUN-000001/geojson` to confirm GeoJSON geometry.
11. **Audit Log Inspection:** Inspect `GET /api/v1/audit` to ensure the mutation creation and auth attempts were appended to the audit trail.

---

## 10. Troubleshooting & Common Issues

### 1. Error: `listen EADDRINUSE :::5000`
- **Cause:** Another process (e.g. earlier background dev server) is already listening on port 5000.
- **Fix (Windows PowerShell):**
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
  ```

### 2. Error: `401 Unauthorized` on Protected Routes
- **Cause:** Browser or curl client is not transmitting session cookies.
- **Fix:** In curl, supply `-b cookies.txt`. In Postman, ensure cookies are enabled in settings. In frontend client code, ensure `credentials: 'include'` is added to fetch requests.

### 3. Error: `403 Forbidden` on Mutation Approval
- **Cause:** Calling statutory approval endpoint (`/approve`) with an unauthorized role (e.g. `ADMIN` or `CITIZEN`).
- **Fix:** Log in as an authorized statutory magistrate (`TEHSILDAR` or `CRO`).

### 4. CORS Errors from Frontend (`localhost:5173`)
- **Cause:** Frontend domain missing from allowed origins or credentials omitted.
- **Fix:** Verify `FRONTEND_URL=http://localhost:5173` in backend `.env` and verify frontend requests include `credentials: 'include'`.

---

## 11. Runtime Verification Results

The automated verification test suite ([verify-api.js](file:///d:/PROGRAMMING/SIH-2026/BHARATBHUMI/backend/tests/verify-api.js)) was executed against the active backend server.

### Exact Runtime Test Execution Output
```text
$ node tests/verify-api.js
🧪 Starting LAND-STACK Backend Verification...

  ✅ PASS: GET /health returns healthy status
  ✅ PASS: GET /applications/types returns statutory services
  ✅ PASS: POST /auth/citizen/request-otp generates OTP
  ✅ PASS: POST /auth/citizen/verify-otp verifies and sets HTTP cookie
  ✅ PASS: POST /auth/government/login logs in Tahsildar with assignments
  ✅ PASS: GET /parcels search returns parcel list
  ✅ PASS: GET /parcels/:ulpin/360 returns comprehensive 360 profile
  ✅ PASS: GET /cases/queue returns jurisdiction-derived officer queue
  ✅ PASS: GET /cases/:id/dossier returns statutory checklist and artifacts
  ✅ PASS: POST /mutations creates new mutation in INITIATED state
  ✅ PASS: POST /mutations/:id/approve rejects premature approval (state machine guard)
  ✅ PASS: POST /mutations/:id/approve strictly blocks ADMIN role
  ✅ PASS: GET /jurisdictions returns states, districts, tehsils, villages
  ✅ PASS: GET /gis/parcels/:ulpin/geojson returns valid GeoJSON Feature
  ✅ PASS: GET /analytics/national returns national overview

🏁 Test Run Completed: 15 passed, 0 failed.
```

All 15 runtime tests passed with zero errors, verifying that authentication, authorization, parcel aggregation, 12-state mutation guards, and work queues are fully operational.
