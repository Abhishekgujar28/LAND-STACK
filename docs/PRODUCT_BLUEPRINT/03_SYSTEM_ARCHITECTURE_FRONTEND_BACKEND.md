# 03 — System Architecture: Frontend and Backend

**Version**: 1.0 | **Date**: September 2026

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React 18 + Vite)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │  Public   │ │   Auth   │ │   Citizen    │ │  Government  │   │
│  │  Layout   │ │  Layout  │ │   Layout     │ │   Layout     │   │
│  └──────────┘ └──────────┘ └──────────────┘ └──────────────┘   │
│                        ↓                                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              API Client (fetch + credentials: include)  │    │
│  └─────────────────────────────────────────────────────────┘    │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP (JSON + HttpOnly Cookies)
┌────────────────────────────┴────────────────────────────────────┐
│                   BACKEND (Node.js + Express)                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Middleware: CORS → Helmet → Cookie → JSON → CorrelationId│   │
│  │ → RequestLogger → requireAuth → requireRole → ...        │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Domain Modules: auth | parcels | mutations | applications│   │
│  │ | cases | documents | notifications | jurisdictions      │   │
│  │ | citizens | officers | analytics | gis | audit          │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Legacy Routes: grievances | watchlist | public           │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │ Supabase JS Client
┌────────────────────────────┴────────────────────────────────────┐
│               DATABASE (Supabase PostgreSQL + PostGIS)          │
│  21 tables | RLS policies | PostGIS extension | Audit trail    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Architecture

### 2.1 Technology Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| Framework | React 18 | [CONFIRMED-CODE] |
| Build | Vite | [CONFIRMED-CODE] |
| Routing | React Router 6 | [CONFIRMED-CODE] |
| Icons | Lucide React | [CONFIRMED-CODE] |
| Maps | Leaflet + React-Leaflet | [CONFIRMED-CODE] |
| HTTP | Native `fetch` (custom `ApiClient` class) | [CONFIRMED-CODE] |
| State | React Context (`AuthContext`) | [CONFIRMED-CODE] |
| Design System | UX4G 3.0 (intended) | [CONFIRMED-CODE] from Design.md |

### 2.2 Directory Structure

```
frontend/src/
├── api/client.js              # Centralized HTTP client (fetch-based)
├── components/                # UI components organized by domain
│   ├── auth/                  # Login forms, OTP inputs
│   ├── citizen/               # Citizen-specific components
│   ├── common/                # Shared components
│   ├── government/            # Government-specific components
│   ├── landing/               # Public landing page components
│   ├── layout/                # Header, sidebar, footer
│   ├── maps/                  # Map/GIS components
│   ├── parcel/                # Parcel-related components
│   └── ui/                    # Generic UI primitives
├── config/
│   ├── appConfig.js           # App-wide settings
│   ├── navigation.js          # Navigation menu structure
│   ├── permissions.js         # Frontend permission hints (NOT authoritative)
│   ├── roles.js               # Role definitions and presets
│   └── routes.js              # Route path constants
├── context/
│   ├── AuthContext.jsx         # Auth state provider
│   ├── authConstants.js        # Demo user presets
│   └── authContextInstance.js  # Context instance
├── hooks/                     # Custom React hooks
├── layouts/
│   ├── PublicLayout.jsx       # Public pages layout
│   ├── AuthLayout.jsx         # Login/registration layout
│   ├── CitizenLayout.jsx      # Citizen portal layout
│   └── GovernmentLayout.jsx   # Government portal layout
├── pages/
│   ├── auth/                  # 7 auth pages
│   ├── citizen/               # 12 citizen pages
│   ├── government/            # 10 shared + 14 role-specific pages
│   └── public/                # 7 public pages
├── services/                  # 10 API service modules
├── styles/                    # CSS files
└── utils/                     # Utility functions
```

### 2.3 Route Architecture

**[CONFIRMED-CODE]** from `App.jsx`:

| Layout | Route Prefix | Pages | Auth Required |
|--------|-------------|-------|---------------|
| `PublicLayout` | `/` | 7 (Landing, About, Services, Resources, Schemes, Help, Contact) | No |
| `AuthLayout` | `/login/*` | 7 (Login, CitizenLogin, GovLogin, OTP, RoleSelection, ForgotPassword, CreateAccount) | No |
| `CitizenLayout` | `/citizen/*` | 12 pages | Yes (Citizen) |
| `GovernmentLayout` | `/government/*` | 24 pages (10 shared + 14 role-specific) | Yes (Government) |

### 2.4 API Client Architecture

**[CONFIRMED-CODE]** `api/client.js`:

- Single `ApiClient` class using native `fetch`
- Base URL from `VITE_API_BASE_URL` (default: `http://localhost:5000/api/v1`)
- `credentials: 'include'` on every request (for HttpOnly cookies)
- Methods: `get()`, `post()`, `put()`, `patch()`, `delete()`
- Auto-serializes body to JSON
- Extracts `data` field from response envelope
- Error handling: logs to console, re-throws

### 2.5 Auth State Management

**[CONFIRMED-CODE]** `AuthContext.jsx`:

- Provider wraps entire app
- State: `user`, `role`, `loading`, `isAuthenticated`
- On mount: calls `authService.me()` to check existing session
- **[CONTRADICTORY]** Falls back to auto-login as default Talathi if no session exists — this is a development-only behavior that bypasses proper authentication
- Provides: `switchOfficerRole()`, `loginAsCitizen()`, `loginAsOfficer()`, `logout()`

### 2.6 Current Frontend Problems

| Problem | Details | Impact |
|---------|---------|--------|
| **Auto-login bypass** | AuthContext auto-logs-in as Talathi when no session exists | Bypasses authentication entirely; insecure |
| **No route protection** | Government routes don't verify user role before rendering | Any user could navigate to any government page |
| **Permission vocabulary mismatch** | Frontend `config/permissions.js` uses different constants than backend `core/permissions.js` | Frontend permission checks may not match backend enforcement |
| **Hardcoded demo password** | `loginOfficer()` defaults to `Password123!` | Security risk if not removed for production |
| **DEFAULT_CITIZENS/OFFICERS in code** | Hardcoded user presets used as fallback | Mock data leaks into runtime behavior |

---

## 3. Backend Architecture

### 3.1 Technology Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| Runtime | Node.js (ESM modules) | [CONFIRMED-CODE] |
| Framework | Express.js | [CONFIRMED-CODE] |
| Database Client | `@supabase/supabase-js` | [CONFIRMED-CODE] |
| Security | Helmet, CORS, cookie-parser | [CONFIRMED-CODE] |
| Compression | compression | [CONFIRMED-CODE] |
| Environment | dotenv | [CONFIRMED-CODE] |

### 3.2 Module Structure

**[CONFIRMED-CODE]** 13 domain modules in `src/modules/`:

```
modules/
├── analytics/    (analytics.routes.js)
├── applications/ (application.routes.js, .controller.js, .service.js)
├── audit/        (audit.routes.js)
├── auth/         (auth.routes.js, .controller.js, .service.js, .validators.js)
├── cases/        (case.routes.js)
├── citizens/     (citizen.routes.js)
├── documents/    (document.routes.js)
├── gis/          (gis.routes.js, gis.service.js)
├── jurisdictions/(jurisdiction.routes.js)
├── mutations/    (mutation.routes.js, .controller.js, .service.js, .statemachine.js, .validators.js)
├── notifications/(notification.routes.js)
├── officers/     (officer.routes.js)
└── parcels/      (parcel.routes.js, .controller.js, .service.js, .validators.js)
```

Plus 3 legacy routes in `src/routes/`: `grievanceRoutes.js`, `watchlistRoutes.js`, `publicRoutes.js`

### 3.3 Middleware Chain

**[CONFIRMED-CODE]** Request processing order:

```
1. helmet()           — Security headers
2. compression()      — Response compression
3. cookieParser()     — Parse cookies
4. express.json()     — Parse JSON body (10MB limit)
5. correlationId      — Attach X-Correlation-Id
6. requestLogger      — Log request
7. cors()             — CORS with credentials: true
8. [Route-specific]:
   a. requireAuth     — Verify JWT, resolve user identity
   b. requireRole     — Check user has required role
   c. requirePermission — Check user has specific permission
   d. requireJurisdiction — Check resource is within user's jurisdiction
   e. requireMfaStepUp — Check MFA for critical actions
   f. validateRequest  — Validate request body/params
```

### 3.4 Supabase Client Architecture

**[CONFIRMED-CODE]** Three client tiers in `config/supabase.js`:

| Client | Key | Purpose | RLS |
|--------|-----|---------|-----|
| `getSupabaseAnon()` | anon key | Public endpoints, citizen sign-in | Enforced |
| `getSupabaseAdmin()` | service-role key | Trusted server ops (user lookup, audit writes) | Bypassed |
| `createAuthClient(token)` | anon key + user JWT | Per-request user-scoped queries | Enforced |

**[CONTRADICTORY]** Multiple backend services use `getSupabaseAdmin()` for all queries (including `parcelService`, `GisService`) instead of `createAuthClient(token)`. This bypasses RLS policies. The documented intent is to use the auth client for user-scoped queries, but the implementation does not follow this.

### 3.5 Authentication Flow

**[CONFIRMED-CODE]** from `auth.service.js` and `requireAuth.js`:

```
Citizen OTP Flow:
1. POST /auth/citizen/request-otp → Verify citizen exists in PostgreSQL → Return "OTP sent"
2. POST /auth/citizen/verify-otp → Verify OTP (demo: 123456) → Find/create Supabase Auth user
   → Sign in → Get JWT → Set HttpOnly cookies → Return user profile + permissions

Government Login Flow:
1. POST /auth/government/login → Look up officer in government_users (email + active) 
   → Authenticate with Supabase Auth → Resolve role, jurisdiction, permissions
   → Set HttpOnly cookies → Return officer profile

Session Check (requireAuth middleware):
1. Extract access token from cookie (or Authorization header fallback)
2. Verify token with Supabase Auth (admin.auth.getUser)
3. Resolve user identity from citizens or government_users table
4. Attach req.user with: authId, userType, userId, role, permissions, jurisdiction
5. Create per-request Supabase client (req.supabase) with user's token
```

### 3.6 Error Handling

**[CONFIRMED-CODE]** Centralized error system in `core/errors.js`:

- `Errors` factory with typed error constructors (badRequest, notFound, unauthenticated, forbidden, etc.)
- Each error has: status code, error code string, message, optional details
- `errorHandler` middleware catches all errors and returns consistent JSON response

### 3.7 Response Format

**[CONFIRMED-CODE]** from `core/response.js`:

```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "error": { "code": "ERROR_CODE", "message": "Human-readable message" } }
```

---

## 4. Request Lifecycle (Complete Path)

```
Browser (React)
  → apiClient.get('parcels/ULPIN-123/360')
    → fetch('http://localhost:5000/api/v1/parcels/ULPIN-123/360', { credentials: 'include' })

Express Server
  → helmet() → compression() → cookieParser() → express.json()
  → correlationId → requestLogger → cors()
  → Router: /api/v1/parcels/:ulpin/360
    → requireAuth (verify JWT → resolve user from DB → attach req.user)
    → parcelController.getParcel360(req, res, next)
      → parcelService.getParcel360(ulpin, req.user)
        → getSupabaseAdmin().from('parcels').select('*').ilike('ulpin', ulpin)
        → Promise.all([9 parallel queries against PostgreSQL])
        → Assemble 360° dossier
        → Role-based filtering
      → res.json({ success: true, data: dossier })
    → errorHandler (if any error thrown)

Browser
  → apiClient extracts data from response
  → React component renders Parcel 360° view
```

---

## 5. Frontend/Backend Synchronization Rules

### 5.1 Contract Rules

1. **Every frontend page that displays data MUST call a backend API.** No inline mock data.
2. **Every backend API MUST query the database.** No JSON file reads for runtime data.
3. **Frontend services (`services/*.js`) MUST mirror backend route structure.** If a backend module exists, a frontend service should exist.
4. **Permission names MUST match.** Backend `core/permissions.js` is authoritative. Frontend must use the same strings.
5. **User identity comes from the backend session.** Frontend never decides the user's role or permissions.

### 5.2 Current Mismatches

| Mismatch | Frontend | Backend | Resolution |
|----------|----------|---------|------------|
| Permission vocabulary | `SANCTION_MUTATION`, `ENTER_PENCIL_ENTRY` | `mutation.approve`, `mutation.field_verify` | Align frontend to backend constants |
| Auto-login | AuthContext auto-logs-in Talathi | No such concept in backend | Remove auto-login; show login page |
| Role switching | `switchOfficerRole()` with hardcoded passwords | Backend validates real credentials | Remove frontend role switching shortcuts |
| Watchlist module | `watchlistService.js` | Legacy `routes/watchlistRoutes.js` | Migrate to module structure |
| Grievance module | `grievanceService.js` | Legacy `routes/grievanceRoutes.js` | Migrate to module structure |
| GIS service | No frontend GIS service | `modules/gis/gis.service.js` exists | Create frontend GIS service |
| Citizen service | No frontend citizen service | `modules/citizens/citizen.routes.js` exists | Create frontend citizen service |
| Officer service | No frontend officer service | `modules/officers/officer.routes.js` exists | Create frontend officer service |
| Jurisdiction service | No frontend jurisdiction service | `modules/jurisdictions/jurisdiction.routes.js` exists | Create frontend jurisdiction service |

---

## 6. Target Architecture Corrections

### 6.1 Authentication

- Remove auto-login in AuthContext
- Remove hardcoded passwords from frontend
- Implement proper route guards that redirect unauthenticated users to login
- Separate citizen and government authentication flows in the frontend

### 6.2 Authorization

- Align frontend permission constants with backend
- Implement `ProtectedRoute` component that checks `req.user.role` and `req.user.permissions`
- Government pages must verify role before rendering

### 6.3 Data Flow

- Migrate all services to use database queries (already mostly done)
- Remove `DEFAULT_CITIZENS` / `DEFAULT_OFFICERS` from frontend runtime logic
- Replace `getSupabaseAdmin()` calls in services with `createAuthClient(token)` where RLS should apply

### 6.4 Module Consolidation

- Migrate grievance, watchlist, and public routes from legacy `src/routes/` to `src/modules/`
- Ensure every module follows the pattern: `module.routes.js` → `module.controller.js` → `module.service.js` → `module.validators.js`

---

*This document defines the complete system architecture and how frontend and backend must work together.*
