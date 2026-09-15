# BACKEND AUTH, AUTHORIZATION, AND SECURITY

## 1. Authentication
- **Provider:** Supabase Auth (PostgreSQL integrated).
- **Citizen:** Mobile OTP login.
- **Government:** Email/Password + MFA.
- **Token Verification:** Express Middleware `requireAuth.js` validates the Supabase JWT. It strips out frontend role selections and relies solely on the validated user ID.

## 2. The 14 System Roles
Defined exactly as in the documentation (`src/core/permissions.js`):
1. CITIZEN
2. TALATHI
3. PATWARI
4. SRO
5. CRO
6. TEHSILDAR
7. COLLECTOR
8. SURVEY_GIS
9. ULB_OFFICER
10. STATE_PMU
11. STATE_AUTHORITY
12. NATIONAL_MONITOR
13. DOLR_NATIONAL
14. ADMIN

## 3. Strict Authorization Principles
**CRITICAL RULE:** Frontend role selection is only for UI context. It is **never** used for authorization.
The backend queries the `government_users` table to determine the user's actual assigned role and jurisdiction.

### 3.1 Role-Based Access Control (RBAC)
Handled via `requireRole` middleware. Maps the validated user's assigned role to specific granular permissions (e.g., `MUTATION_APPROVE`, `PARCEL_VIEW_SENSITIVE`).

### 3.2 Jurisdiction Scope Checks
Handled via `requireJurisdiction` middleware and database RLS. 
Even if a user is a `TEHSILDAR` with `MUTATION_APPROVE` permissions, they can only approve mutations where `mutation.tehsil_code == user.tehsil_code`.

## 4. Privacy & PII
- No raw Aadhaar numbers are stored. Everything uses HMAC or index hashing.
- Sensitive fields (mobile numbers) are masked depending on the querying role.

## 5. Security Middlewares
- **Helmet:** Secure HTTP headers.
- **Rate Limiting:** Prevents brute-force attacks on OTP endpoints.
- **CORS:** Strictly tied to the frontend domain.
