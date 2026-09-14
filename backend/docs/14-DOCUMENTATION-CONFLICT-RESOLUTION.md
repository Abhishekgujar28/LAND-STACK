# Documentation Conflict Resolution

## 1. Overview
The BHARATBHUMI documentation contained historic, prototype, and speculative architecture that contradicted the actual implemented code in the `/backend` and `/frontend` folders. This document outlines the resolutions to those contradictions, acting as the final ruling.

## 2. Resolved Contradictions

### 2.1. Authentication: Supabase Auth vs Keycloak
- **Contradiction:** Main architecture documents frequently mentioned an OPA (Open Policy Agent) sidecar and Keycloak for IAM.
- **Resolution:** **Supabase Auth** is the canonical and implemented IAM provider. The OPA sidecar design is officially deprecated in favor of Express middleware executing programmatic verification against the database (`requireRole.js`, `requirePermission.js`). 

### 2.2. Dual Mode vs Database-Only
- **Contradiction:** Documentation stated `DATA_PROVIDER_MODE=mock` is a valid environment.
- **Resolution:** **Database-Only**. `DATA_PROVIDER_MODE` is deprecated. The system relies 100% on Supabase PostgreSQL.

### 2.3. Role Count: 8 vs 9 vs 14 Roles
- **Contradiction:** Frontend `roles.js` defined 9 roles. Older PRDs defined 8 consolidated roles. Backend `permissions.js` defined 14 roles.
- **Resolution:** **14 Roles** is canonical. The complex matrix of Indian land governance requires granular authorities (e.g., distinguishing a CRO from a Tahsildar, or a Survey GIS officer from a Talathi). The frontend MUST map its UI to the backend's 14 roles.

### 2.4. Session State: Cookie vs LocalStorage
- **Contradiction:** Frontend `AuthContext` stored JSON profiles and roles in `localStorage`, bypassing security.
- **Resolution:** **HTTP-Only Cookies**. The frontend `apiClient.js` must set `credentials: 'include'`. The backend mints cookies. The frontend requests its identity on-mount via `/api/v1/auth/me`.

### 2.5. Mutation Approval: UI Override vs Statutory Backend Block
- **Contradiction:** Previously, an ADMIN user in the frontend could force a mutation status update because the UI allowed it, or the API lacked guards.
- **Resolution:** **Statutory Non-Bypass**. The `ADMIN` role is programmatically banned from `MUTATION_APPROVE` and `MUTATION_REJECT`. All statuses are strictly managed by the backend state machine. Frontend UI buttons for mutation approval must be hidden if the user's role is `ADMIN` or `CITIZEN`.

## 3. Deprecated Documentation
Any document referencing the following concepts is considered **stale** and overridden by this folder:
- Fake / Hardcoded / In-Memory Queues
- Keycloak / OPA Sidecar
- 8/9-Role Matrix
- Client-side JWT parsing or LocalStorage Auth Hydration
- "Mock Mode" setups

Please consult `00-CANONICAL-ARCHITECTURE-AND-MIGRATION.md` for the single source of architectural truth moving forward.
