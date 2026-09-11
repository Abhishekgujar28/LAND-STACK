# Phase 2 — Auth & Identity

**Goal**: Implement complete authentication for both citizens and government officers, with JWT stored in HTTP-only cookies, custom claims carrying jurisdiction context, and RLS policies enforcing access control at the database level.

**Why Now**: Auth must come before any data-serving functionality. Without knowing WHO is asking, we can't enforce WHAT they're allowed to see.

---

## What Gets Built

### Citizen Authentication
- Mobile OTP login flow via Supabase Auth `signInWithOtp()`
- OTP rate limiting (5 attempts per 15 min, 10 OTPs per day per mobile)
- Mobile number stored as SHA-256 hash only
- Citizen profile creation/update in `citizen` table upon first login
- DPDP Act consent recording in `consent_log` table

### Government Authentication
- Email/password + MFA login via Supabase Auth
- MFA enforcement (TOTP via authenticator app) — no login without second factor
- Officer assignment lookup: on login, Express queries `officer_assignment` table to load role, department, state, district, tehsil, villages
- Custom JWT claims injection with jurisdiction context

### Cookie-Based Session Management
- Access token and refresh token set as HTTP-only, Secure, SameSite=Strict cookies
- Express middleware that reads cookies, validates JWT, and creates authenticated Supabase client per request
- Auto-refresh middleware: when access token expires but refresh token is valid, silently refresh and set new cookies
- `/api/v1/auth/me` endpoint returning user profile for frontend UI rendering

### Row Level Security Policies
- RLS enabled on all tables in `public` schema
- Policies for each role:
  - CITIZEN: own parcels (full) + public parcels (summary)
  - SRO: parcels within sub-registry jurisdiction (both rural and urban contexts)
  - CRO_TEHSILDAR: parcels within assigned tehsil/rural jurisdiction
  - SURVEY_GIS: parcels and spatial units across rural and urban pilot areas
  - ULB_MUNICIPAL: parcels within assigned municipal / urban ward jurisdiction
  - STATE_AUTHORITY: aggregated state metrics (read-only, no direct parcel modification)
  - DOLR_NATIONAL: national federation metrics (read-only aggregates)

### Supporting Tables
- `officer_assignment` — links user to role + jurisdiction hierarchy and active pilot context
- `consent_log` — DPDP Act consent records (append-only)
- `session_log` — login/logout and context-switch tracking for security audit

## Stakeholders Served
- **Citizen**: Can register, login with OTP, manage profile and DPDP consent
- **5 Government Personas**: SRO, CRO/Tehsildar, Survey/GIS Officer, ULB/Municipal Officer, State Authority / DoLR (SSO + MFA, context-resolved and jurisdiction-scoped data)
- **Platform Operations**: Internal admin capability via service role for platform config and maintenance (not a primary product persona)

## Key Decisions
- **HTTP-only cookies over localStorage**: Security decision. See [02-auth-and-roles.md](./02-auth-and-roles.md) for full rationale.
- **RLS over application-level filtering**: Defense-in-depth. Even if Express middleware has a bug, the database blocks unauthorized access.
- **Separate citizen and officer auth flows**: Different security requirements (OTP vs MFA), different JWT claim structures, different session durations.

## Dependencies
- Phase 1 (Foundation) complete — database and Express server running
- SMS gateway configured for OTP delivery
- Supabase Auth configured

## Exit Criteria
- Citizen can register, receive OTP, verify, and get a cookie-based session
- Officer can login with email + MFA and get jurisdiction-scoped JWT in cookie
- RLS policies reject queries outside authorized jurisdiction (verifiable by switching JWT claims)
- Token refresh works transparently
- Consent recording works and is append-only
- Audit trail captures all auth events

## Risks
- **OTP delivery reliability**: SMS gateways can be unreliable in rural India. Mitigated by supporting multiple SMS providers with fallback.
- **JWT claim size**: Too many villages in the claims array could bloat the JWT. Mitigated by storing large assignments in database and checking via RLS subquery.
- **RLS policy performance**: Complex RLS policies with JWT parsing can slow queries. Mitigated by creating helper functions and ensuring jurisdiction columns are indexed.

## References
- [02-auth-and-roles.md](./02-auth-and-roles.md) — Full auth strategy
- [ROLE_PORTAL_MATRIX.md](../../docs/ROLE_PORTAL_MATRIX.md) — Role × Permission matrix
- [02-personas.md](../../docs/02-personas.md) — Persona jurisdiction scopes
- [workflows.md](../../docs/workflows.md) Section 2 — Registration & Login flows
- Supabase Auth documentation — JWT custom claims, auth hooks
- Web research — Supabase RLS patterns for jurisdiction isolation
