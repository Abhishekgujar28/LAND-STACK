# BACKEND MASTER ARCHITECTURE

## 1. System Overview
**Purpose:** LAND-STACK is a read-only projection system for citizen discovery and a read/write system for workflows (mutations, applications, grievances) and spatial annotations. It relies strictly on external authoritative systems (State RoR, NGDRS, BhuNaksha) for official truth.
**Core Principle:** *Projections, not originals.* The backend stores only projected copies of land records, linked to their external sources via cryptographic provenance.

## 2. Technology Stack
- **Framework:** Express.js (Node.js). Note: Code is currently in JS but will be migrated to **TypeScript** per documentation requirements.
- **Database:** PostgreSQL with PostGIS (hosted on Supabase).
- **Authentication:** Supabase Auth.
- **Authorization:** Express Middleware (`requireRole`, `requireJurisdiction`) combined with Supabase Row Level Security (RLS).
- **Events:** PostgreSQL Outbox pattern + Supabase Realtime + Background Workers (Kafka is planned only for Future Migration).

## 3. Modular Monolith Architecture
We use a **Modular Monolith** structure, separating the domain into strictly isolated modules inside `src/modules/` to emulate NestJS module boundaries, keeping the door open for future microservices.

### 3.1 Folder Structure
```
backend/
├── src/
│   ├── modules/          # Domain boundaries
│   │   ├── auth/         # Supabase token validation and session context
│   │   ├── parcels/      # Parcel 360 dossiers
│   │   ├── gis/          # Spatial queries
│   │   ├── mutations/    # Workflow engine
│   │   └── audit/        # Append-only ledger
│   ├── core/             # Centralized rules (permissions, constants)
│   ├── middleware/       # Express security and context extractors
│   ├── config/           # Environment validation
│   └── server.js         # Express app bootstrap
```

### 3.2 Request Lifecycle
1. **Ingress:** API request hits `/api/v1/module/endpoint`.
2. **Context (requireAuth):** Validates Supabase JWT, extracts User ID.
3. **Authorization (requireRole/requireJurisdiction):** Checks if the user is assigned the required role in `government_users` table and whether the resource belongs to their jurisdiction scope.
4. **Validation:** Zod schemas validate request body/params.
5. **Controller:** Handles HTTP semantics and delegates to Service.
6. **Service:** Executes business logic and database transactions.
7. **Audit:** Triggers PostgreSQL functions for hash-chained `audit_events`.
8. **Response:** Unified JSON response structure.

## 4. Current vs Future Architecture
| Component | Current Implementation | Future Scale Plan |
|-----------|------------------------|-------------------|
| **Event Bus** | Postgres Outbox + Realtime | Apache Kafka Event Mesh |
| **Microservices** | Express Modular Monolith | Extracted NestJS Microservices |
| **API Gateway** | Express Router | Kong API Gateway |
| **Authorization**| Express Middleware + RLS | OPA (Open Policy Agent) Sidecars |

## 5. Security & Observability
- **Audit Logging:** Every mutating action is recorded in `audit_events`.
- **Error Handling:** Standardized error formats masking internal DB errors.
- **Correlation IDs:** Propagated through all logs (`X-Correlation-Id`).
