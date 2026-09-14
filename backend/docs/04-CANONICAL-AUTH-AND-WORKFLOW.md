# Canonical Auth, RBAC, and Mutation Workflow

## 1. Scope
This document resolves contradictions in role counts (9 vs 14) and standardizes the exact authentication, Role-Based Access Control (RBAC), and 12-state mutation workflows to be used by both the Frontend and Backend.

## 2. Canonical Authentication
- **Mechanism:** HTTP-only cookies storing JWT (`access_token`, `refresh_token`).
- **No LocalStorage:** `localStorage` must NEVER be used to store auth tokens or user session JSON.
- **Hydration:** The frontend must call `GET /api/v1/auth/me` on mount to hydrate user profile and role context.
- **Session Expiry:** A 401 response from the backend automatically triggers frontend session purge and redirect to `/login`.

## 3. Canonical 14-Role Model
The backend `src/core/permissions.js` defines exactly 14 roles. The frontend `roles.js` must be updated to mirror this exactly.

| Role | User Type | Description |
| --- | --- | --- |
| `CITIZEN` | Citizen | Standard landholder. |
| `TALATHI` | Govt | Village revenue officer. Field verification. |
| `PATWARI` | Govt | Village accountant (alias for Talathi in some states). |
| `SRO` | Govt | Sub-Registrar Officer (Deeds/Registration). |
| `CRO` | Govt | Circle Revenue Officer (Supervisory). |
| `TEHSILDAR` | Govt | Executive Magistrate. Approves rural mutations. |
| `COLLECTOR` | Govt | District Collector. |
| `SURVEY_GIS` | Govt | Cadastral survey & GIS specialist. |
| `ULB_OFFICER` | Govt | Urban Local Body. Approves urban mutations. |
| `STATE_PMU` | Govt | State-level monitoring. |
| `STATE_AUTHORITY`| Govt | State Revenue Commissioner. |
| `NATIONAL_MONITOR`| Govt | National Dashboard. |
| `DOLR_NATIONAL` | Govt | Department of Land Resources. |
| `ADMIN` | Govt | System Administrator. **No Mutation Authority.** |

**Rule of Non-Bypass:** `ADMIN` cannot approve mutations. Any attempt via API will return 403 Forbidden.

## 4. Canonical Mutation State Machine
The mutation lifecycle is governed entirely by backend business logic (`mutation.statemachine.js`). The frontend cannot force a state transition; it can only request specific actions (e.g., `Approve`, `Reject`, `Verify`).

### The 12 States
1. `INITIATED` - Application submitted.
2. `DOCUMENTS_PENDING` - Waiting for uploads.
3. `VERIFICATION_ASSIGNED` - Assigned to Talathi.
4. `FIELD_VERIFIED` - Panchnama completed.
5. `REVIEWED` - Checked by CRO.
6. `NOTICE_PERIOD` - Statutory 15-day notice period (Form 135D).
7. `OBJECTION_RECEIVED` - A dispute was filed.
8. `HEARING_SCHEDULED` - Tehsildar hearing set.
9. `APPROVED` - Mutation sanctioned (by Tehsildar/CRO/ULB).
10. `REJECTED` - Mutation dismissed.
11. `ROR_UPDATE_TRIGGERED` - Database update initiated.
12. `CLOSED` - Workflow complete.

### Strict Workflow Transitions
- Mutations cannot jump from `INITIATED` directly to `APPROVED`.
- `APPROVED` requires MFA step-up verification for statutory officers (simulated on backend via `_mfaToken` payload field).
- The frontend must dynamically disable UI buttons based on the current state returned by the backend.
