# 05 — API Contracts, Authentication, and Security

**Version**: 1.0 | **Date**: September 2026

---

## 1. API Design Principles

1. **RESTful**: Resources as nouns, HTTP verbs for actions
2. **Versioned**: All endpoints under `/api/v1/`
3. **Modular**: Grouped by domain module (auth, parcels, mutations, etc.)
4. **Consistent responses**: `{ success, data }` or `{ success, error: { code, message } }`
5. **Database-backed**: Every response comes from PostgreSQL, never from JSON files
6. **Auth-enforced**: Protected endpoints require valid JWT via HttpOnly cookie
7. **Jurisdiction-scoped**: Government endpoints filter by officer's jurisdiction

---

## 2. API Endpoint Catalog

### 2.1 Authentication Module (`/api/v1/auth`)

| Method | Endpoint | Auth | Purpose | Status |
|--------|----------|------|---------|--------|
| POST | `/auth/citizen/request-otp` | None | Request OTP for citizen mobile | [CONFIRMED-CODE] |
| POST | `/auth/citizen/verify-otp` | None | Verify OTP, create session | [CONFIRMED-CODE] |
| POST | `/auth/government/login` | None | Government email/password login | [CONFIRMED-CODE] |
| GET | `/auth/me` | Required | Get current user profile + permissions | [CONFIRMED-CODE] |
| POST | `/auth/refresh` | Cookie | Refresh access token | [CONFIRMED-CODE] |
| POST | `/auth/logout` | Required | End session, clear cookies | [CONFIRMED-CODE] |
| GET | `/auth/contexts` | Required (Govt) | Get officer's available contexts | [CONFIRMED-CODE] |
| POST | `/auth/context/switch` | Required (Govt) | Switch operational context | [CONFIRMED-CODE] |

**Request/Response Examples**:

```json
// POST /auth/citizen/verify-otp
Request:  { "mobile": "+91 98230 45891", "otp": "123456" }
Response: { "success": true, "data": {
  "userId": "CIT-001", "userType": "CITIZEN", "role": "CITIZEN",
  "name": "Aarav Patil", "permissions": ["parcel.search", "parcel.view.full", ...]
}}
// Sets HttpOnly cookie: ls_access_token, ls_refresh_token

// POST /auth/government/login
Request:  { "email": "prakash.shinde@maharashtra.gov.in", "password": "..." }
Response: { "success": true, "data": {
  "userId": "GOV-002", "userType": "GOVERNMENT", "role": "TALATHI",
  "name": "Prakash Shinde", "jurisdiction": "Wagholi Circle, Haveli",
  "jurisdictionCodes": { "stateCode": "MH", "districtCode": "DIST-PUN", ... },
  "permissions": ["parcel.search", "mutation.field_verify", ...]
}}
```

---

### 2.2 Parcels Module (`/api/v1/parcels`)

| Method | Endpoint | Auth | Purpose | Status |
|--------|----------|------|---------|--------|
| GET | `/parcels` | Optional | Search/list parcels with filters | [CONFIRMED-CODE] |
| GET | `/parcels/:ulpin` | Required | Get single parcel by ULPIN | [CONFIRMED-CODE] |
| GET | `/parcels/:ulpin/360` | Required | Complete 360° title dossier | [CONFIRMED-CODE] |
| GET | `/parcels/:ulpin/owners` | Required | Ownership records | [CONFIRMED-CODE] |
| GET | `/parcels/:ulpin/encumbrances` | Required | Encumbrance records | [CONFIRMED-CODE] |
| GET | `/parcels/:ulpin/restrictions` | Required | Restriction records | [CONFIRMED-CODE] |
| GET | `/parcels/:ulpin/zoning` | Required | Zoning/planning data | [CONFIRMED-CODE] |
| GET | `/parcels/:ulpin/tax` | Required | Tax records | [CONFIRMED-CODE] |
| GET | `/parcels/:ulpin/court-cases` | Required | Court case records | [CONFIRMED-CODE] |
| GET | `/parcels/:ulpin/documents` | Required | Parcel documents | [CONFIRMED-CODE] |

**Query parameters for `/parcels`**: `search`, `village`, `tehsil`, `district`, `state`, `status`, `cursor`, `limit`

**Pagination**: Cursor-based using ULPIN ordering. Response includes `{ parcels, page: { nextCursor, hasMore, total } }`.

---

### 2.3 Mutations Module (`/api/v1/mutations`)

| Method | Endpoint | Auth | Permission | Purpose | Status |
|--------|----------|------|-----------|---------|--------|
| GET | `/mutations` | Required | — | List mutations (filtered by user type) | [CONFIRMED-CODE] |
| GET | `/mutations/:id` | Required | — | Get mutation detail with timeline | [CONFIRMED-CODE] |
| POST | `/mutations` | Required | `mutation.create` | Create new mutation application | [CONFIRMED-CODE] |
| PATCH | `/mutations/:id/transition` | Required | Action-specific | Execute state transition | [CONFIRMED-CODE] |
| GET | `/mutations/:id/timeline` | Required | — | Get mutation timeline events | [CONFIRMED-CODE] |

**State transition request**:
```json
// PATCH /mutations/:id/transition
{ "action": "APPROVE", "remarks": "All verifications satisfactory" }
// Backend validates: current state allows this action, user has permission, MFA verified if required
```

---

### 2.4 Applications Module (`/api/v1/applications`)

| Method | Endpoint | Auth | Purpose | Status |
|--------|----------|------|---------|--------|
| GET | `/applications` | Required | List citizen's applications | [CONFIRMED-CODE] |
| GET | `/applications/:id` | Required | Application detail | [CONFIRMED-CODE] |
| POST | `/applications` | Required | Submit new application | [CONFIRMED-CODE] |
| GET | `/applications/types` | Optional | Available application types catalog | [INFERRED] |

---

### 2.5 GIS Module (`/api/v1/gis`)

| Method | Endpoint | Auth | Purpose | Status |
|--------|----------|------|---------|--------|
| GET | `/gis/parcel/:ulpin` | Required | GeoJSON Feature for single parcel | [CONFIRMED-CODE] |
| GET | `/gis/village/:code/cadastral` | Required | FeatureCollection for village parcels | [CONFIRMED-CODE] |
| POST | `/gis/search/bbox` | Required | Search parcels in bounding box | [CONFIRMED-CODE] |
| POST | `/gis/validate-polygon` | Required | Validate GeoJSON polygon geometry | [CONFIRMED-CODE] |

---

### 2.6 Other Modules

| Module | Base Path | Key Endpoints | Status |
|--------|-----------|--------------|--------|
| Cases | `/api/v1/cases` | CRUD for revenue court cases | [CONFIRMED-CODE] routes exist |
| Documents | `/api/v1/documents` | List/download user documents | [CONFIRMED-CODE] routes exist |
| Notifications | `/api/v1/notifications` | List/mark-read notifications | [CONFIRMED-CODE] routes exist |
| Jurisdictions | `/api/v1/jurisdictions` | Hierarchy lookups (states, districts, etc.) | [CONFIRMED-CODE] routes exist |
| Citizens | `/api/v1/citizens` | Citizen profile operations | [CONFIRMED-CODE] routes exist |
| Officers | `/api/v1/officers` | Officer directory/lookup | [CONFIRMED-CODE] routes exist |
| Analytics | `/api/v1/analytics` | Statistical dashboards | [CONFIRMED-CODE] routes exist |
| Audit | `/api/v1/audit` | Audit event log queries | [CONFIRMED-CODE] routes exist |

### 2.7 Legacy Routes (To Migrate)

| Module | Base Path | Status |
|--------|-----------|--------|
| Grievances | `/api/v1/grievances` | [CONFIRMED-CODE] Legacy route file, not in module structure |
| Watchlist | `/api/v1/watchlist` | [CONFIRMED-CODE] Legacy route file, not in module structure |
| Public | `/api/v1/public` | [CONFIRMED-CODE] Legacy route file, not in module structure |

---

## 3. Request/Response Conventions

### 3.1 Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": { "nextCursor": "...", "hasMore": true, "total": 150 }
  }
}
```

### 3.2 Error Response

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Parcel 'ULPIN-999' not found in database"
  }
}
```

### 3.3 Standard Error Codes

| Code | HTTP | Meaning |
|------|------|---------|
| `BAD_REQUEST` | 400 | Invalid input |
| `UNAUTHENTICATED` | 401 | No valid session |
| `INVALID_TOKEN` | 401 | Expired or malformed JWT |
| `SESSION_EXPIRED` | 401 | Refresh token expired |
| `INVALID_OTP` | 401 | Wrong OTP code |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `FORBIDDEN_ROLE` | 403 | Role not allowed |
| `FORBIDDEN_JURISDICTION` | 403 | Outside officer's jurisdiction |
| `RESOURCE_NOT_FOUND` | 404 | Entity not found |
| `CONFLICT` | 409 | Duplicate or state conflict |
| `INVALID_STATE_TRANSITION` | 422 | Invalid workflow transition |
| `INTERNAL_ERROR` | 500 | Server error |
| `SOURCE_UNAVAILABLE` | 503 | Database unavailable |

---

## 4. Authentication Architecture

### 4.1 Authentication Flow

```
                    ┌─────────────┐
                    │   Browser   │
                    └──────┬──────┘
                           │ POST /auth/citizen/verify-otp
                           │ or POST /auth/government/login
                    ┌──────┴──────┐
                    │   Express   │
                    │   Backend   │
                    └──────┬──────┘
                           │ signInWithPassword()
                    ┌──────┴──────┐
                    │  Supabase   │
                    │    Auth     │
                    └──────┬──────┘
                           │ Returns JWT + Refresh Token
                    ┌──────┴──────┐
                    │   Express   │──→ Set-Cookie: ls_access_token (HttpOnly, Secure)
                    │   Backend   │──→ Set-Cookie: ls_refresh_token (HttpOnly, Secure)
                    └──────┬──────┘
                           │ JSON: { user profile + permissions }
                    ┌──────┴──────┐
                    │   Browser   │ Cookies sent automatically on subsequent requests
                    └─────────────┘
```

### 4.2 Session Management

| Property | Value | Status |
|----------|-------|--------|
| **Access token storage** | HttpOnly cookie (`ls_access_token`) | [CONFIRMED-CODE] |
| **Refresh token storage** | HttpOnly cookie (`ls_refresh_token`) | [CONFIRMED-CODE] |
| **Token verification** | Supabase `admin.auth.getUser(token)` | [CONFIRMED-CODE] |
| **User resolution** | Email/phone → `government_users` or `citizens` table | [CONFIRMED-CODE] |
| **CORS credentials** | `credentials: true` (both frontend and backend) | [CONFIRMED-CODE] |

### 4.3 Citizen Identity Resolution

```
1. Extract phone from Supabase Auth user
2. Clean phone number (remove +91, spaces)
3. Query citizens table: mobile ILIKE pattern
4. If found → return citizen identity with userId, role: CITIZEN
```

### 4.4 Government Identity Resolution

```
1. Extract email from Supabase Auth user
2. Query government_users table: email match + active = true
3. If found → resolve role, department, jurisdiction from database
4. Build assignments array with context (RURAL/URBAN/STATE/NATIONAL)
```

**Critical rule**: Role and jurisdiction are ALWAYS derived from the database, never from the request payload or frontend state.

---

## 5. Authorization Architecture

### 5.1 Security Chain

```
requireAuth        → Is the user authenticated? (JWT valid, user exists in DB)
    ↓
requireRole        → Does the user have one of the allowed roles?
    ↓
requirePermission  → Does the user's role include the required permission?
    ↓
requireJurisdiction → Is the requested resource within the user's jurisdiction?
    ↓
requireMfaStepUp   → For critical actions (mutation approval), has MFA been verified?
    ↓
validateRequest    → Is the request body/params valid?
    ↓
Controller         → Execute business logic
```

### 5.2 Jurisdiction Enforcement

**[CONFIRMED-CODE]** `requireJurisdiction.js` checks:

- A Talathi (village-level) can only access resources in their assigned village
- A Tehsildar (tehsil-level) can only access resources in their tehsil
- A Collector (district-level) can access resources across their district
- A State PMU (state-level) can access resources across their state
- National monitors and admins have broader access

The check compares the resource's jurisdiction codes against the officer's assigned codes.

### 5.3 RBAC Model

```
User (citizen or officer)
  → Role (CITIZEN, TALATHI, TEHSILDAR, ...)
    → Permission Set (parcel.search, mutation.approve, ...)
      → Allowed Actions on Resources
```

**Source of truth**: `core/permissions.js` `ROLE_PERMISSIONS` mapping [CONFIRMED-CODE].

The Admin role explicitly does NOT include `mutation.approve` or `mutation.reject`. Admin is not a statutory bypass.

---

## 6. Security Analysis

### 6.1 Current Security Strengths

| Feature | Implementation | Status |
|---------|---------------|--------|
| **HttpOnly cookies** | Tokens stored in cookies, not localStorage | [CONFIRMED-CODE] ✅ |
| **Helmet headers** | Security headers enabled | [CONFIRMED-CODE] ✅ |
| **CORS configuration** | Credentials mode with origin allowlist | [CONFIRMED-CODE] ✅ |
| **JWT verification** | Server-side token validation via Supabase | [CONFIRMED-CODE] ✅ |
| **Permission system** | 40+ atomic permissions, role-mapped | [CONFIRMED-CODE] ✅ |
| **Jurisdiction checks** | Middleware validates resource scope | [CONFIRMED-CODE] ✅ |
| **MFA for critical ops** | Required for mutation approval/rejection | [CONFIRMED-CODE] ✅ |
| **Audit trail** | Hash-chained, append-only event log | [CONFIRMED-CODE] ✅ |
| **Input validation** | Validator modules per domain | [CONFIRMED-CODE] ✅ |
| **Aadhaar hashing** | Only SHA-256 hash stored, never plaintext | [CONFIRMED-CODE] ✅ |
| **Rate limiting** | Rate limiter middleware exists | [CONFIRMED-CODE] ✅ |
| **Error standardization** | Typed errors prevent info leakage | [CONFIRMED-CODE] ✅ |

### 6.2 Current Security Risks

| Risk | Severity | Details | Resolution |
|------|----------|---------|------------|
| **Demo OTP hardcoded** | 🔴 Critical | OTP is always `123456` | Integrate real SMS gateway for production |
| **Demo password fallback** | 🔴 Critical | Auth service falls back to `Password123!` | Remove demo password in production config |
| **Auto-login in frontend** | 🔴 Critical | AuthContext auto-logs-in as Talathi | Remove auto-login; require explicit authentication |
| **Admin client overuse** | 🟠 High | Services use `getSupabaseAdmin()` (bypasses RLS) instead of `createAuthClient()` | Migrate services to use auth client where RLS should apply |
| **CORS permissive** | 🟠 High | Line 57 in server.js: `return callback(null, true)` always | Enforce origin allowlist in production |
| **No route guards** | 🟡 Medium | Frontend doesn't validate role before rendering government pages | Add ProtectedRoute component |
| **Password in frontend code** | 🟡 Medium | `Password123!` hardcoded in authService.js and authConstants.js | Remove from frontend; use proper login flow |
| **Schema/RLS mismatch** | 🟡 Medium | RLS policies reference columns/tables not in schema.sql | Synchronize schema.sql with migration files |

### 6.3 Target Security Posture

1. **Authentication**: Supabase Auth with real OTP for citizens, SSO/LDAP for government (future)
2. **Authorization**: requireAuth → requireRole → requirePermission → requireJurisdiction chain on every endpoint
3. **Session**: HttpOnly cookies, 15-min access token, 7-day refresh, idle timeout
4. **Data access**: RLS-enforced queries via `createAuthClient(token)` for user-facing operations
5. **Audit**: Every data modification logged with actor, role, action, resource, payload hash
6. **Secrets**: Service-role key never exposed to frontend; environment variables for all secrets
7. **Transport**: HTTPS only in production; HSTS headers
8. **Input**: Server-side validation on all endpoints; SQL injection prevented by Supabase client parameterization

---

## 7. Frontend/Backend API Contract Rules

1. **Frontend calls backend APIs via `apiClient`.** Frontend never accesses Supabase directly.
2. **Backend derives user identity from session cookie.** Frontend never sends userId, role, or citizenId in request body for authorization purposes.
3. **Backend response format is standardized.** Frontend `apiClient` extracts `data` from the response envelope.
4. **Errors include machine-readable codes.** Frontend can switch on `error.code` for specific handling.
5. **Pagination uses cursor-based model.** Frontend passes `cursor` param; backend returns `nextCursor` and `hasMore`.
6. **All dates are ISO 8601 timestamps in UTC.** Frontend handles timezone display.
7. **All monetary values are numbers** (not strings). Currency is always INR unless specified.

---

*This document defines the complete API surface, authentication, authorization, and security posture.*
