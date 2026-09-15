# Land Stack — Backend Vision

**Version**: 1.0 | **Date**: September 2026
**Stack**: Node.js + Express + Supabase (PostgreSQL + PostGIS + Auth + Storage + Realtime + Edge Functions)
**Reference Docs**: [Product Vision](../../docs/00-product-vision.md), [PRD](../../docs/01-prd.md), [Master Architecture](../../docs/architecture.md)

---

## 1. What This Backend Is Trying to Accomplish

Land Stack's backend exists to solve one fundamental problem: **India's land records are scattered across dozens of disconnected government systems, and no single platform stitches them together for either citizens or officers.**

This backend doesn't replace any State system. It sits in front of all of them — reading from Mahabhulekh, Bhoomi, BhuNaksha, NGDRS, Revenue Courts, Municipal systems, Forest departments — and assembles a complete picture of a land parcel. It then serves that picture to two very different audiences through two experience planes:

1. **The Citizen Plane** — A farmer in Maharashtra opens the app, types in their Survey Number, and sees everything about their land on one page: who owns it, where it is on the map, whether there's a court case, whether the property tax is paid, whether any mutation is pending. In Marathi. On a 2G connection. That's what this backend makes possible.

2. **The Government Operations Plane** — A CRO/Tehsildar logs in, sees pending mutation cases in their work queue, reviews the Survey/GIS Officer's spatial verification report alongside the AI advisory summary, checks for encumbrance conflicts, and sanctions the mutation with a digital order — all without leaving the platform. An SRO checks encumbrances before registration in both rural and urban contexts. A ULB Officer handles urban property mutations. A State Authority / DoLR monitor tracks statewide SLA adherence and national federation metrics.

The backend has to serve both planes from the same parcel-centric data foundation, with strict role-based access control ensuring that a local officer can only see parcels in their assigned jurisdiction and active context, while State and National monitors see aggregated metrics.

> *Reference: This dual-plane architecture comes directly from the [Product Vision](../../docs/00-product-vision.md), Section 3, which establishes that Land Stack serves "two experience planes sharing a common parcel-centric data and integration foundation."*

---

## 2. Core Principles

These aren't abstract ideals — they're engineering constraints that shape every decision in this backend.

### Parcel-Centric, Not User-Centric

Everything in this system revolves around a land parcel. A parcel is identified by a ULPIN (Unique Land Parcel Identification Number — a 14-digit "Aadhaar for land" derived from geo-coordinates). Every query, every workflow, every event, every notification anchors to a parcel. This is not a CRM where users are the primary entity. It's more like a healthcare system where the patient record (the parcel) is central, and various specialists (government officers) interact with it.

> *Reference: Product Vision Section 2 — "ONE PARCEL → ONE CANONICAL IDENTITY → MANY AUTHORITATIVE DATA SOURCES → MANY GOVERNMENT WORKFLOWS." Also informed by DILRMP 3.0 guidelines (pib.gov.in, September 2026) which mandate ULPIN as the foundational identifier.*

### Federated, Not Centralized

Land is a State subject under Entry 18 and 45 of the State List (Seventh Schedule, Constitution of India). We cannot and must not build a centralized national land database. Instead, we build a **federation layer** — an interoperability mesh that reads from State systems via configuration-driven adapters, stores derived "projections" of that data (never the originals), and always attributes the source.

Each State has radically different terminology (7/12 in Maharashtra vs RTC in Karnataka vs Patta in Tamil Nadu), different identifiers (Survey No vs Khasra No vs Patta No), different units (Guntha vs Cent vs Bigha), and different administrative hierarchies. The State Adapter pattern absorbs all of this variation through configuration, not code branches.

> *Reference: [Executive Summary](../../00_LAND_STACK_MASTER_EXECUTIVE_SUMMARY.md) Section 2.3 — constitutional constraint. [Architecture](../../docs/architecture.md) Section 4 — State Adapter Architecture.*

### Projections, Not Originals

This deserves emphasis because it's unusual. We never claim to hold "the truth." We hold projections — snapshots of data read from authoritative State systems, timestamped, attributed, and confidence-scored. If Mahabhulekh says Ramesh Kumar owns Gat 45/2A, we store that as "Mahabhulekh, Revenue Dept Govt of Maharashtra, says Ramesh Kumar owns this parcel, retrieved at 2026-09-10T14:30:00Z, confidence: HIGH." If the citizen disputes this, they dispute it with the Revenue Department — not with us.

Every piece of data in our system carries **provenance** — who said it, when they said it, where we got it from, and how fresh it is. This is the foundation of trust.

### AI is Advisory, Never Decision

The backend may include ML models that predict SLA breach risks, detect spatial anomalies, or summarize parcel intelligence. But every AI output is labeled **ADVISORY**. No AI system can approve a mutation, reject an application, or make any statutory determination. Only a Tehsildar can approve a mutation. Only a Sub-Registrar can register a deed. The software tracks, routes, and informs — it does not decide.

> *Reference: [Product Vision](../../docs/00-product-vision.md) Section 5 — "NOT an AI decision-maker." [Rules](../../docs/rules.md) for enforcement details.*

---

## 3. Why This Tech Stack

### Node.js + Express

We chose Express over NestJS or Fastify for a deliberate reason: **simplicity and velocity at this stage.**

NestJS is excellent — the existing `LAND-STACK/` folder in this project contains a full NestJS modular monolith with TypeScript, Vitest, and a sophisticated module structure. It's well-architected. But NestJS carries significant overhead: decorators, dependency injection containers, module boundaries, guards, interceptors, pipes — all of which are powerful for a large team maintaining a production system, but slow down a small team that needs to iterate rapidly during an SIH prototype phase.

Express gives us:
- **Minimal ceremony** — a route handler is a function, not a decorated class method
- **Ecosystem maturity** — 15+ years of middleware, libraries, and patterns
- **Developer familiarity** — every Node.js developer knows Express
- **Low cognitive overhead** — new team members contribute on day one

We explicitly leave the door open for a future migration to NestJS or Fastify if the codebase grows to a scale where DI containers and formal module boundaries become necessary. The Express route structure will mirror what would become NestJS modules, making extraction clean.

### Supabase (PostgreSQL + PostGIS + Auth + Storage + Realtime + Edge Functions)

Supabase is not just "a Firebase alternative." It's a **managed PostgreSQL platform with built-in authentication, row-level security, real-time subscriptions, file storage, and edge functions** — all backed by PostgreSQL, the world's most capable relational database.

For Land Stack, Supabase provides:

| Need | Supabase Solution | Why It Fits |
|------|-------------------|-------------|
| **Relational land records** | PostgreSQL 16 | LADM data model requires complex relational joins (Party → Rights → Parcel → Spatial Unit) |
| **Spatial queries** | PostGIS extension | Point-in-polygon, distance search, boundary intersections, area calculations — all native |
| **Authentication** | Supabase Auth | Mobile OTP for citizens, custom JWT claims for government roles |
| **Authorization** | Row Level Security (RLS) | Jurisdiction isolation enforced at the database level — an officer in Haveli literally cannot SELECT parcels outside their assigned jurisdiction and active context |
| **Real-time updates** | Supabase Realtime | Mutation status changes push to citizen's browser instantly via WebSocket subscriptions |
| **Document storage** | Supabase Storage | Field photos, deed PDFs, court orders — with SHA-256 integrity hashing |
| **Serverless processing** | Edge Functions | Lightweight webhook handlers, notification dispatchers |

**Why not raw PostgreSQL?** We'd have to build auth, RLS policy management, file storage, real-time subscriptions, and admin dashboards from scratch. Supabase gives us all of this out of the box, with a managed hosting option that eliminates ops burden during prototype phase.

**Why not Firebase?** Firebase uses a NoSQL document model. Land records are deeply relational (a parcel has many owners who have many rights with many restrictions from many sources). Trying to model LADM in Firestore would be an exercise in pain. Also, no PostGIS — we need real spatial queries, not Geohash approximations.

**Why not MongoDB?** Same relational argument, plus no PostGIS. We need ST_Contains, ST_Intersects, ST_DWithin, ST_Area — native spatial operations on actual geometry types with GIST indexing. MongoDB's geospatial support is limited to basic point queries.

> *Reference: Online research on Supabase PostGIS capabilities (supabase.com/docs). Stack comparison informed by [Architecture](../../docs/architecture.md) Section 5 which specifies PostgreSQL + PostGIS as the primary data store.*

---

## 4. How the Existing Docs Shaped These Decisions

We didn't start from scratch. The `docs/` folder contains 15 detailed planning documents covering product vision, PRD, personas, architecture, workflows, role matrices, department integrations, AI architecture, analytics, and more. Here's how they influenced the backend:

| Existing Doc | What It Taught Us | How It Shaped Backend Decisions |
|---|---|---|
| `00-product-vision.md` | Dual experience planes; 14 roles; parcel-centric thesis | Backend must serve two frontends from one data layer |
| `01-prd.md` | 40+ functional requirements across citizen and government | API surface area and module boundaries |
| `02-personas.md` | Detailed persona specs with jurisdiction scopes | RLS policies must be granular to village level |
| `architecture.md` | Express modular monolith with PostGIS | We adopt the module thinking and align with the stack |
| `ROLE_PORTAL_MATRIX.md` | 14 roles × 15 permissions × jurisdiction levels | JWT custom claims structure and RLS policy design |
| `DEPARTMENT_INTEGRATION_MATRIX.md` | 9 external system integrations | State Adapter pattern for Express |
| `workflows.md` | 15 citizen + government workflows | Event-driven mutation engine design |
| `phases.md` | 16-phase roadmap (0-15) | We compress to 8 practical phases for our stack |

The architecture originally considered a system with Keycloak, OPA sidecars, Kong API Gateway, and Kafka event mesh. We have standardized on an Express + Supabase implementation, simplifying without losing the essential properties:

| Original Architecture | Our Adaptation |
|---|---|
| Keycloak (2 realms) [Prior design] | Supabase Auth + custom JWT claims |
| OPA Rego policies [Prior design] | Supabase RLS policies + Express Middleware |
| Kong API Gateway [Prior design] | Express middleware |
| Kafka event mesh [Prior design] | Postgres Outbox + Supabase Realtime + database triggers + Edge Functions |
| Redis cache | Supabase connection pooling + application-level caching |
| Martin tile server | PostGIS ST_AsMVT via Supabase RPC (or optional Martin) |
| OpenSearch | PostgreSQL full-text search (pg_trgm + tsvector) |

The key insight: we're not dumbing down the architecture. We're **mapping the same architectural intents to a simpler technology surface** — fewer moving parts, same security properties, same data model fidelity.

---

## 5. What Success Looks Like

When this backend is done, a developer should be able to:

1. Hit a single endpoint with a ULPIN or Survey Number and get back a complete Parcel 360° response — ownership, map boundary, encumbrances, restrictions, court cases, tax status, mutation history, data quality scores, and provenance for every field.

2. Authenticate a citizen via mobile OTP and a government officer via SSO/MFA, with JWT tokens stored securely in HTTP-only cookies, and have RLS policies automatically scope every subsequent query to their authorized jurisdiction.

3. Submit a mutation case that flows through a 12-state workflow — from initiation through field verification, notice period, hearing, sanction, and RoR update — with each step tracked, SLA-monitored, and pushing real-time notifications.

4. Click anywhere on a cadastral map and have the system identify the parcel under the cursor via a PostGIS point-in-polygon query, returning its full record.

5. Run analytics queries that drill down from national aggregate to state to district to tehsil to village to individual parcel — all scoped by the officer's jurisdiction.

That's the backend we're building.

---

*This document is the entry point for all backend planning. Read it first, then proceed to [01-architecture-overview.md](./01-architecture-overview.md).*
