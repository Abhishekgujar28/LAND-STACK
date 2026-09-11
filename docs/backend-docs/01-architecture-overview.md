# Land Stack — Architecture Overview

**Version**: 1.0 | **Date**: September 2026
**Prerequisite**: Read [00-backend-vision.md](./00-backend-vision.md) first
**Reference**: [Master Architecture](../../docs/architecture.md), [Government Portal Architecture](../../docs/GOVERNMENT_PORTAL_ARCHITECTURE.md)

---

## 1. The Big Picture: How Requests Flow

Every request in Land Stack follows a clean, predictable path. Whether it's a citizen checking their land record on a phone in rural Maharashtra or a Tehsildar sanctioning a mutation in an office in Karnataka, the request flows through the same pipeline:

```
   Citizen PWA / Government Portal (Frontend)
                    │
                    ▼
         Express.js API Server
         (Routes + Middleware)
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   Supabase      Supabase    Supabase
     Auth        Database     Storage
   (JWT +       (PostgreSQL   (Documents,
   Cookies)     + PostGIS     Photos,
                + RLS)        Deeds)
                    │
                    ▼
            Supabase Realtime
          (Live mutation status,
           watchlist alerts)
```

The Express server is the **orchestration brain** — it handles routing, business logic, request validation, and coordinates calls to Supabase's services. But it deliberately offloads heavy lifting:

- **Authentication** → Supabase Auth handles JWT lifecycle, OTP delivery, token refresh
- **Authorization** → PostgreSQL Row Level Security (RLS) policies enforce jurisdiction at the database level
- **Spatial queries** → PostGIS handles all GIS operations natively inside the database
- **Real-time subscriptions** → Supabase Realtime pushes mutation status changes to connected clients
- **File management** → Supabase Storage handles deed PDFs, field photos, court orders

This architecture means our Express server stays lean — it's primarily concerned with business orchestration, not infrastructure.

---

## 2. How Express Sits in Front of Supabase

Express is not a pass-through proxy. It adds critical value that Supabase alone cannot provide:

### What Express Does

1. **Cookie-Based Session Management** — Supabase Auth generates JWTs, but we intercept them and store them in HTTP-only secure cookies instead of letting the client put them in localStorage. The Express server handles setting, reading, and refreshing these cookies (see [02-auth-and-roles.md](./02-auth-and-roles.md) for full details on why).

2. **Business Logic Orchestration** — When a citizen requests a Parcel 360° view, the Express handler coordinates parallel calls to multiple Supabase tables (parcel, spatial_unit, right_record, encumbrance, restriction, court_case, etc.), assembles them into a unified response, and applies role-based field filtering. This is application-level logic that doesn't belong in database functions.

3. **State Adapter Layer** — External government system integrations (fetching RoR from Mahabhulekh, receiving webhooks from NGDRS, pulling geometry from BhuNaksha) are handled by Express route handlers with circuit breaker patterns, retry logic, and caching. Supabase doesn't know about these external systems.

4. **Workflow Orchestration** — The 12-state mutation workflow engine lives in Express. It manages state transitions, validates business rules (e.g., only a Tehsildar can execute APPROVE), triggers side effects (notifications, audit events, cache invalidation), and enforces SLA timers.

5. **Custom JWT Claims Injection** — When a government officer logs in, Express looks up their role, department, jurisdiction assignment (State → District → Tehsil → Village), and injects these as custom claims into the JWT. Supabase Auth doesn't inherently know about Indian land governance hierarchies.

6. **Webhook Handlers** — NGDRS sends a webhook when a deed is registered. Express receives it, verifies the HMAC-SHA256 signature, transforms the payload into our canonical model, creates a mutation case, and publishes the event. This is too complex for a Supabase Edge Function.

### What Express Does NOT Do

- **Store sessions in memory** — Sessions live in cookies (JWT) and database (refresh tokens)
- **Serve static assets** — The frontend CDN handles this
- **Manage database connections** — Supabase handles connection pooling
- **Enforce row-level access** — RLS does this at the PostgreSQL level, even if Express has a bug

This last point is crucial: RLS is a **defense-in-depth** layer. Even if an Express middleware has a bug that fails to check jurisdiction, the database itself will refuse to return rows outside the user's authorized scope. The security guarantee lives at the data layer, not the application layer.

> *Reference: The defense-in-depth principle comes from [architecture.md](../../docs/architecture.md) Section 8 (Security Architecture). The Supabase RLS approach was informed by online research on Supabase RLS patterns for role-based jurisdiction isolation.*

---

## 3. How Supabase Auth, RLS, and PostGIS Work Together

This is the architectural heart of Land Stack. Three Supabase capabilities interlock to provide a secure, spatial, jurisdiction-aware data platform:

### The Authentication → Authorization → Data Pipeline

1. **Citizen logs in** → Supabase Auth issues a JWT with `{ user_id, role: "CITIZEN", ... }`
2. **Express adds custom claims** → JWT gets enriched with `{ role: "TEHSILDAR", state_code: "MH", district_code: "PU", tehsil_code: "HVL", villages: ["WGS", "KHR", "HNJ"] }`
3. **JWT goes into HTTP-only cookie** → Cookie sent with every subsequent request
4. **Express passes JWT to Supabase client** → Supabase creates a per-request client authenticated with this JWT
5. **RLS policies evaluate JWT claims** → PostgreSQL checks: "Does this user's `tehsil_code` match the parcel's `tehsil_code`?" If no → zero rows returned
6. **PostGIS evaluates spatial queries** → Within the RLS-filtered scope, PostGIS runs ST_Contains, ST_DWithin, ST_Intersects on geometry columns

The beauty is that step 5 happens **inside the database engine**. It's not application-level filtering that could be bypassed. It's a PostgreSQL policy that's evaluated on every SELECT, INSERT, UPDATE, DELETE. A CRO/Tehsildar in Haveli literally cannot construct a SQL query that returns mutation cases in Kothrud — the database engine itself blocks it.

### How RLS Knows About Jurisdiction

RLS policies read the JWT claims via PostgreSQL's `auth.jwt()` function (provided by Supabase). A simplified version of the jurisdiction isolation logic:

- **Citizen**: Can SELECT parcels where `is_public = true` (summary) OR where `owner_party_id` matches the citizen's party record (full detail)
- **SRO**: Can SELECT parcels and deeds matching their sub-registry code in active rural or urban context
- **CRO/Tehsildar**: Can SELECT parcels and mutation cases where `tehsil_code` matches the officer's assigned tehsil
- **Survey/GIS Officer**: Can SELECT spatial units and cadastral layers across assigned rural and urban pilot areas
- **ULB/Municipal Officer**: Can SELECT parcels and property tax records where `ulb_code` / `ward_code` matches
- **State Authority**: Can SELECT aggregated metrics where `state_code` matches — but NOT individual PII
- **DoLR / National**: Can SELECT national aggregate metrics and federation sync logs only

> *Reference: The prototype personas, pilot context model, and jurisdiction scopes are defined in [02-auth-and-roles.md](./02-auth-and-roles.md). The RLS implementation pattern was informed by Supabase documentation on JWT custom claims + RLS policies.*

---

## 4. Supabase Realtime: Live Updates

Land Stack needs real-time behavior in two critical areas:

### Mutation Status Tracking (Citizen)

When a citizen is watching their mutation case, they shouldn't have to refresh the page. When the Survey/GIS Officer submits a spatial verification report, the mutation status should change from "VERIFICATION_ASSIGNED" to "FIELD_VERIFIED" on the citizen's screen within seconds.

Supabase Realtime enables this via PostgreSQL's `LISTEN/NOTIFY` mechanism. The frontend subscribes to changes on the `mutation_case` table filtered by the citizen's parcel ULPIN. When a row changes, the update pushes through a WebSocket to the citizen's browser.

### Watchlist Alerts (Citizen)

Citizens can "watch" parcels they're interested in (potential purchases, ancestral property, neighboring land). When anything changes on a watched parcel — ownership transfer, new encumbrance, court case linked — the system detects the change via database triggers and pushes an alert through Supabase Realtime.

### Work Queue Updates (Government)

When a new mutation case lands in an officer's jurisdiction (triggered by an SRO registered deed or webhook), their work queue counter should increment in real-time without a page refresh. Supabase Realtime handles this by subscribing to the `case_assignment` table filtered by the officer's jurisdiction.

> *Reference: The real-time requirements come from [workflows.md](../../docs/workflows.md) and [citizen-features.md](../../docs/citizen-features.md). Supabase Realtime architecture informed by Supabase documentation.*

---

## 5. Supabase Storage: Document Management

Land Stack is document-heavy. The system handles:

| Document Type | Source | Access Pattern |
|---|---|---|
| Deed PDFs | NGDRS / SRO Registration | Officers view during mutation processing |
| 7/12 Extracts / RTC / Patta | State RoR systems | Citizens download certified copies |
| Spatial verification photos | Survey/GIS mobile/tablet | Geotagged boundary photos uploaded during verification |
| Court orders | RCCMS / e-Courts | Officers and citizens view during dispute resolution |
| Mutation orders | CRO/Tehsildar digital order | Generated by system upon statutory sanction |
| Satellite imagery | BhuNaksha / SVAMITVA | Overlay on cadastral map |

Supabase Storage provides:
- **Bucket-level access control** — Deed documents are only accessible to officers processing that parcel's case
- **SHA-256 content hashing** — Every uploaded file gets an integrity hash, preventing silent corruption
- **CDN delivery** — Large files (satellite imagery tiles) served from edge locations
- **Virus scanning** — Can be added via Storage hooks

Documents are linked to parcels via a `document` table that records the document's storage path, the parcel ULPIN it relates to, the document type, uploader identity, upload timestamp, and SHA-256 hash.

> *Reference: Document management requirements from [PRD](../../docs/01-prd.md) FR-C7 and FR-G6. The SHA-256 hashing requirement comes from [architecture.md](../../docs/architecture.md) Section 5.*

---

## 6. Supabase Edge Functions: Serverless Processing

Some operations don't need a persistent Express server. Edge Functions are Deno-based serverless functions deployed to Supabase's infrastructure. We use them for:

1. **Notification Dispatch** — When a mutation status changes, a database trigger calls an Edge Function that sends an SMS (via SMS gateway) and/or email to the affected citizen. This is a fire-and-forget operation.

2. **Scheduled Data Freshness Checks** — A cron-triggered Edge Function runs nightly to check which parcel projections are stale (last sync > 48 hours) and flags them for re-sync.

3. **Lightweight Webhook Acknowledgment** — For simple webhooks that only need to store a payload and return 200, an Edge Function is faster and cheaper than routing through Express.

We deliberately keep Edge Functions thin — they handle event-driven side effects, not core business logic. The mutation workflow, Parcel 360° aggregation, and GIS operations all live in Express where they can access the full application context.

---

## 7. What We're Keeping, Adapting, and Simplifying

The existing architecture in `docs/architecture.md` describes a production-scale system. Here's how we map its concepts to our stack:

### Keeping (Same Intent, Different Technology)

| Concept | Original | Our Implementation |
|---|---|---|
| Parcel-centric data model | LADM + PostgreSQL | LADM-inspired + Supabase PostgreSQL + PostGIS |
| Bi-temporal versioning | valid_from/valid_to + system_from/system_to | Same — PostgreSQL handles this natively |
| Hash-chained audit trail | SHA-256 hash chain on audit_event | Same — implemented as database trigger |
| State Adapter pattern | Config-driven adapters per state | Same pattern in Express modules |
| Dual-mode Parcel 360° | Citizen view vs Officer view | Same — Express middleware applies view filtering |
| 12-state mutation workflow | State machine with SLA tracking | Same — Express workflow engine |
| Jurisdiction-scoped authorization | OPA Rego policies | Supabase RLS policies (same intent, PostgreSQL-native) |

### Adapting (Simplified for Our Scale)

| Concept | Original | Our Adaptation |
|---|---|---|
| Keycloak dual-realm IAM | Citizen realm + Government realm | Supabase Auth with role-based custom claims |
| Kong API Gateway | Rate limiting, mTLS, route isolation | Express middleware (rate-limiter, helmet, cors) |
| Kafka event mesh | ULPIN-partitioned durable event stream | Supabase Realtime + database triggers + Edge Functions |
| Martin tile server | Rust-based MVT serving from PostGIS | PostGIS ST_AsMVT via Supabase RPC (Martin optional later) |
| OpenSearch | Full-text + geo search | PostgreSQL pg_trgm + tsvector + PostGIS geo search |
| Redis cluster | Cache + sessions + rate limits | Supabase connection pooling + in-memory Express cache |

### Dropping (Not Needed Yet)

| Concept | Why We're Skipping It |
|---|---|
| Kubernetes / EKS | Supabase handles hosting; Express runs on a simple server |
| HashiCorp Vault | Supabase Secrets + environment variables for now |
| Terraform | Single-project deployment, not multi-environment infrastructure |
| OpenTelemetry + Prometheus + Grafana | Supabase dashboard + Express logging for now |
| OPA sidecar containers | RLS policies provide the same authorization guarantee |

The key principle: **we're not losing security or data integrity by simplifying the infrastructure. We're mapping the same guarantees to fewer moving parts.**

---

## 8. Module Boundaries

Even though Express doesn't enforce module boundaries like NestJS, we organize our code as if it does. This makes future extraction clean:

```
Express Server
├── auth/          — Login, OTP, session, JWT cookie management
├── parcel/        — Parcel identity, ULPIN resolution, Parcel 360°
├── gis/           — Spatial queries, tile serving, geometry management
├── workflow/      — Mutation lifecycle, state machine, SLA engine
├── case/          — Work queues, task assignment, escalation
├── integration/   — State Adapters, webhook handlers, external APIs
├── notification/  — SMS, email, push, real-time alerts
├── analytics/     — Drill-down aggregations, MIS dashboards
├── document/      — Upload, download, OCR, integrity verification
├── audit/         — Hash-chained event logging, tamper detection
└── common/        — Shared types, middleware, utilities, error handlers
```

Each module exports a router and a service. Modules communicate through service function calls (not by importing each other's database queries). When a module needs data from another module, it calls the service function — never the repository directly. This mirrors the NestJS modular monolith philosophy without the DI framework.

> *Reference: Module communication rules from [architecture.md](../../docs/architecture.md) Section 3.3 — "No cross-module repository access."*

---

*Next: [02-auth-and-roles.md](./02-auth-and-roles.md) — The complete authentication and authorization strategy.*
