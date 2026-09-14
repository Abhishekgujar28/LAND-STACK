# LAND-STACK Product Blueprint

> **Authoritative project-level documentation for LAND-STACK (Bharat Bhumi).**
> This folder defines the complete product as one connected system.
> Unless a newer approved decision explicitly supersedes a section, this blueprint is canonical.

**Created**: September 2026
**Source**: Full repository analysis, existing docs, DILRMP 3.0 research, codebase inspection
**Status**: Active — living document

---

## Purpose

This blueprint exists because LAND-STACK's frontend and backend have been developed through isolated instructions, resulting in:

- Frontend/backend contract mismatches
- Mock data mixed with database data
- Duplicate or incorrect feature implementations
- Incomplete workflows
- Inconsistent authentication approaches
- Unclear product scope

The seven files in this folder form a **single reliable source of truth** that answers:

> What exactly is LAND-STACK, who uses it, what can each user do, how does every feature work, what data is required, how does frontend connect to backend, and what is the correct long-term architecture?

---

## Document Map

| # | File | Contents | Read When |
|---|------|----------|-----------|
| 1 | [01_PRODUCT_VISION_AND_SCOPE.md](./01_PRODUCT_VISION_AND_SCOPE.md) | What the product is, who it serves, product principles, scope boundaries | Starting any new feature or making product decisions |
| 2 | [02_USERS_FEATURES_AND_WORKFLOWS.md](./02_USERS_FEATURES_AND_WORKFLOWS.md) | All roles, every feature specification, end-to-end workflows, permissions | Building or modifying any user-facing capability |
| 3 | [03_SYSTEM_ARCHITECTURE_FRONTEND_BACKEND.md](./03_SYSTEM_ARCHITECTURE_FRONTEND_BACKEND.md) | Frontend architecture, backend architecture, request lifecycle, module boundaries, how F/E and B/E connect | Making any architectural or integration change |
| 4 | [04_DATABASE_DATA_AND_GIS_ARCHITECTURE.md](./04_DATABASE_DATA_AND_GIS_ARCHITECTURE.md) | Database schema, data model, entities, GIS/PostGIS strategy, seed/import policy | Any database, data model, or GIS change |
| 5 | [05_API_CONTRACTS_AUTH_AND_SECURITY.md](./05_API_CONTRACTS_AUTH_AND_SECURITY.md) | API catalog, request/response contracts, authentication, authorization, security | Any API, auth, or security change |
| 6 | [06_CURRENT_STATE_GAPS_AND_IMPLEMENTATION_ROADMAP.md](./06_CURRENT_STATE_GAPS_AND_IMPLEMENTATION_ROADMAP.md) | Current state audit, gaps matrix, implementation roadmap, priorities | Planning sprints, understanding technical debt |

---

## Reading Order

1. **Start with File 1** (Product Vision) to understand what LAND-STACK is.
2. **Read File 2** (Users & Features) to understand who uses it and what they can do.
3. **Read File 3** (Architecture) to understand how frontend and backend work together.
4. **Read File 4** (Database & GIS) before making any data model changes.
5. **Read File 5** (API & Security) before creating or modifying any API endpoint.
6. **Read File 6** (Gaps & Roadmap) to understand current state vs. desired state.

---

## Rules for Developers

### All Developers

- Read the relevant blueprint file before writing code.
- Do not invent features, APIs, roles, or database tables without checking this blueprint first.
- Mark any deviation from the blueprint as a conscious decision and update the blueprint to reflect it.
- Never use mock data as a runtime data source. All runtime data comes from Supabase PostgreSQL.
- Every user-facing feature must have a clear path: Frontend Page → API Call → Backend Service → Database Query.

### Frontend Developers

- **Do not hardcode user data, parcel data, or any application data in frontend code.**
- All data must come from backend API calls via the `apiClient`.
- Frontend permissions (`config/permissions.js`) are **UI hints only**. The backend is the enforcement authority.
- The `DEFAULT_OFFICERS` and `DEFAULT_CITIZENS` in `authConstants.js` are for development convenience only; production authentication must go through the backend auth flow.
- Every page must handle loading, empty, and error states.
- Route protection must validate the user's role before rendering government pages.

### Backend Developers

- **All database access goes through Supabase client.** No direct SQL connections.
- Use `createAuthClient(token)` for user-scoped queries (RLS-enforced). Use `getSupabaseAdmin()` only for trusted server-side operations.
- Every endpoint must enforce authentication (`requireAuth`) and authorization (`requireRole`, `requirePermission`, `requireJurisdiction`) as applicable.
- Never trust frontend-supplied `userId`, `role`, or `citizenId`. Derive identity from the authenticated session.
- Follow the module structure: `module.routes.js` → `module.controller.js` → `module.service.js`.
- Validate all input using `module.validators.js`.

### Database Changes

- All schema changes must be added as numbered migration files in `backend/database/migrations/`.
- Run `schema.sql` as the reference DDL and keep it synchronized with migrations.
- Update File 4 of this blueprint when adding or modifying tables.
- PostGIS geometry columns require explicit SRID (4326 for WGS84).

### API Changes

- New endpoints must follow the existing URL convention: `/api/v1/{module}/{resource}`.
- Response format: `{ success: true, data: {...} }` or `{ success: false, error: { code, message } }`.
- Update File 5 of this blueprint with the new API contract.
- Frontend service files must be updated to match any backend API changes.

### Feature Additions

- Check File 2 to see if the feature is already specified.
- If not specified, document the feature in File 2 first, then implement.
- Every feature must specify: purpose, user role, API endpoints, database tables, and permissions.
- Update File 6 to mark the feature as implemented once complete.

---

## Accuracy Labels

Throughout the blueprint, conclusions are labeled:

| Label | Meaning |
|-------|---------|
| **[CONFIRMED-CODE]** | Verified by reading actual source code |
| **[CONFIRMED-RESEARCH]** | Verified from project documentation or DILRMP standards |
| **[INFERRED]** | Logically derived from code and documentation patterns |
| **[PROPOSED]** | Recommended but not yet implemented or confirmed |
| **[MISSING]** | Expected but not found in code or documentation |
| **[CONTRADICTORY]** | Found conflicting information between sources |

---

*This blueprint is a living document. Update it as the product evolves.*
