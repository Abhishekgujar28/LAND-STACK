# Land Stack — Architecture Decision Records (ADRs)

**Format**: Each ADR records a significant architectural decision, its context, the options considered, the decision made, and the consequences.

---

## ADR-001: Modular Monolith as Initial Architecture

**Status**: Accepted  
**Date**: September 2026  

### Context
The existing design documents propose a full microservices architecture with 10+ independently deployed services. However, the team is building a new product from scratch, and premature microservices decomposition introduces:
- Distributed systems complexity (network failures, eventual consistency, distributed transactions)
- Operational overhead (10+ CI/CD pipelines, service discovery, load balancing per service)
- Development velocity penalty (cross-service changes require coordinated deployments)

### Decision
Start with an **Express.js modular monolith** — a single deployable application organized into clearly bounded modules (Parcel, Mutation, Auth, Cases, Analytics, etc.). Each module owns its specific services and routes, and can be extracted to an independent deployment later.

### Consequences
- **Positive**: Faster development; simpler deployment; easier debugging; transactional consistency within a single database
- **Positive**: Module boundaries are enforced via project structure and dependency injection
- **Negative**: Must enforce module boundaries disciplinarily (no cross-module database direct queries bypassing services)
- **Migration path**: When a module's scale demands it (e.g., GIS/Spatial queries saturating CPU), extract it to an independent service with its own database. The module interface becomes the service API.

### Module Extraction Candidates (ordered by likely extraction need)
1. **GIS Service** → Python/FastAPI with PostGIS (different language, compute-intensive)
2. **Search Service** → Thin wrapper over OpenSearch (independent scaling)
3. **Notification Service** → High-throughput, async (SMS/email delivery)
4. **Workflow Service** → Temporal integration (long-running state machines)

---

## ADR-002: Express.js as Primary Backend

**Status**: Accepted  
**Date**: September 2026  

### Context
The existing documents disagree on backend technology:
- Master Architecture → Express.js
- Application Architecture → Go + Node.js
- Citizen Workflow → FastAPI (Python)

### Options Considered
| Option | Pros | Cons |
|--------|------|------|
| **Express.js (Node.js)** | Huge ecosystem; fast iteration; shared language with frontend | Less structured than NestJS; manual boundary enforcement |
| **FastAPI (Python)** | Excellent GIS ecosystem (Fiona, Shapely, Rasterio, GDAL); fast dev | Weak for complex business logic modules |
| **Go** | Performance; low resource usage; good for microservices | Verbose; smaller ORM ecosystem; no Temporal TypeScript SDK advantage |
| **Spring Boot (Java/Kotlin)** | Enterprise-grade; strong typing | Heavier; larger memory footprint; slower development velocity |

### Decision
**Express.js (Node.js)** for the main backend. **Python/FastAPI** only for a separate GIS Spatial Service when extracted (for PostGIS-native spatial queries, raster processing, and GIS library access). This keeps the technology footprint minimal (2 languages instead of 3+) while leveraging each where it's strongest.

### Consequences
- **Positive**: JavaScript/TypeScript across frontend and backend; single language for most of the stack
- **Positive**: Massive ecosystem of Express middleware for security, rate-limiting, and validation
- **Negative**: GIS-intensive operations may need a Python sidecar service
- **Negative**: Some GIS libraries (GDAL, Rasterio) don't have TypeScript equivalents

---

## ADR-003: PostgreSQL + PostGIS as Primary Database

**Status**: Accepted  
**Date**: September 2026  

### Context
The system needs to store: relational data (parcels, parties, rights), spatial data (parcel geometries, zones), temporal data (bi-temporal history), semi-structured data (State adapter configs, provenance details), and full-text search data.

### Options Considered
| Option | Verdict |
|--------|---------|
| **PostgreSQL + PostGIS** | Best spatial support; JSONB for semi-structured; bi-temporal with standard SQL; proven at scale; FOSS |
| **MongoDB** | Good for semi-structured; poor spatial (limited); no bi-temporal; no relational integrity |
| **Oracle Spatial** | Commercial; excellent spatial; but licensing cost and vendor lock-in |
| **DynamoDB** | No spatial; no joins; not suitable for complex relational queries |

### Decision
**PostgreSQL 16 + PostGIS 3.4** as the single primary database. Use JSONB columns for semi-structured State adapter configuration and provenance details. Use PostGIS for all spatial operations. Use standard SQL temporal predicates for bi-temporal queries.

### Consequences
- **Positive**: Single database technology; strong spatial support; ACID compliance; FOSS
- **Positive**: PostGIS supports 40+ crore parcel geometries with GIST indexing
- **Negative**: Single database becomes a scaling bottleneck → mitigate with read replicas and table partitioning
- **Negative**: Full-text search is better in OpenSearch → use OpenSearch as a secondary index for search

---

## ADR-004: Configuration-Driven State Adapters

**Status**: Accepted  
**Date**: September 2026  

### Context
India has 36 States/UTs, each with unique:
- Terminology (7/12 vs RTC vs Patta vs Khatauni)
- Administrative hierarchy (Division→District→Taluka→Village vs District→Taluk→Hobli→Village)
- Area units (Acre/Guntha vs Bigha/Biswa vs Kanal/Marla)
- Data sources (different API endpoints, schemas, auth mechanisms)
- Workflow variations (mutation process steps vary by State)

### Decision
All State-specific behavior is encoded in a `state_config` table with JSONB columns for: `terminology`, `hierarchy`, `area_units`, `data_sources`, `schema_mapping`, and `mutation_workflow`. The application code is generic — it reads the configuration and adapts dynamically. No `if (state === 'MH')` anywhere in the codebase.

### Configuration Schema (per State)
```json
{
  "state_code": "MH",
  "state_name": "Maharashtra",
  "terminology": {
    "ror_document": "7/12 Extract",
    "parcel_id_label": "Survey / Gat Number",
    "owner_account_label": "Khata Number",
    "village_officer": "Talathi",
    "approving_officer": "Tehsildar",
    "mutation_term": "Ferfar"
  },
  "hierarchy": [
    { "level": 1, "name": "Division", "code_field": "division_code" },
    { "level": 2, "name": "District", "code_field": "district_code" },
    { "level": 3, "name": "Taluka", "code_field": "taluka_code" },
    { "level": 4, "name": "Village", "code_field": "village_code" }
  ],
  "area_units": {
    "primary": "Acre",
    "secondary": "Guntha",
    "conversions": {
      "acre_to_sqm": 4046.8564,
      "guntha_to_sqm": 101.17
    }
  },
  "data_sources": {
    "ror": { "type": "api", "endpoint": "https://mahabhulekh.api/...", "auth": "api_key" },
    "cadastral": { "type": "wms", "endpoint": "https://bhunaksha.mh.gov.in/..." },
    "registration": { "type": "webhook", "endpoint": "https://igr.mh.gov.in/..." }
  }
}
```

### Consequences
- **Positive**: New States onboarded via configuration, not code changes
- **Positive**: GoRT alignment built into the architecture
- **Negative**: Complex configuration validation required
- **Negative**: Testing matrix grows with each State (need contract tests per State)

---

## ADR-005: Event-Driven Architecture with Kafka

**Status**: Accepted  
**Date**: September 2026  

### Context
Cross-department workflows require asynchronous, ordered, durable event propagation. Key flow: NGDRS registration → mutation initiation → field verification → sanction → RoR update → citizen notification. This flow spans weeks to months and involves multiple departments.

### Decision
**PostgreSQL + Supabase Realtime** for database-driven event streaming and webhook triggering. Rather than deploying a complex Kafka cluster for the MVP, we use the `audit_events` and `notifications` tables as our event log, combined with Supabase Realtime for pub/sub. Event schema uses a standard envelope:

```json
{
  "event_id": "uuid",
  "event_type": "registration.completed",
  "event_version": "1.0",
  "source_system": "ngdrs",
  "state_code": "MH",
  "timestamp": "ISO-8601",
  "correlation_id": "uuid",
  "payload": { ... },
  "metadata": {
    "partition_key": "ulpin",
    "retry_count": 0
  }
}
```

### Consequences
- **Positive**: Zero additional infrastructure overhead; uses existing PostgreSQL DB
- **Positive**: Built-in pub/sub via Supabase Realtime
- **Negative**: Not as scalable as Kafka for massive inter-service messaging
- **Migration path**: Move to Kafka / AWS MSK when event volume exceeds database pub/sub capabilities.

---

## ADR-006: Temporal for Durable Workflows

**Status**: Accepted  
**Date**: September 2026  

### Context
Government workflows are fundamentally different from CRUD operations:
- Mutation: 30-90 days with objection periods, field verification, and statutory sanction
- Service applications: days to weeks with document upload, officer review, and fee payment
- Grievances: escalation chains with SLA tracking

These are **durable state machines** with human tasks, timers, compensation, and retry logic.

### Decision
**Express.js modular workflow engine** for production workflow orchestration. Build a state machine pattern directly in the `mutations` module (e.g., `mutation.statemachine.js`) backed by PostgreSQL state tracking. Migrate to Temporal only if cross-service orchestrations and compensation logic become necessary.

### Consequences
- **Positive**: Simple, cohesive codebase without requiring Temporal worker infrastructure
- **Positive**: Easy to track SLA and state history in a standard relational table
- **Negative**: No built-in distributed retry or long-polling sleep operations
- **Migration path**: The workflow interface is abstracted; switching from PG-backed state machine to Temporal requires only the workflow implementation, not the business logic.

---

## ADR-007: MapLibre GL JS + Martin for Map Rendering

**Status**: Accepted  
**Date**: September 2026  

### Context
The map is the highest-impact visual element. It must render cadastral boundaries for 40+ crore parcels with satellite imagery, zoning overlays, and restriction layers.

### Decision
- **MapLibre GL JS**: FOSS vector tile renderer (no Mapbox license dependency)
- **Martin**: PostGIS-native vector tile server (Rust; high performance; no intermediate tile cache generation needed)
- **Base map**: OpenStreetMap tiles (FOSS) for development; configurable for production (Mapbox, Google, ISRO)

### Consequences
- **Positive**: No vendor lock-in; FOSS stack; excellent performance
- **Positive**: Martin reads directly from PostGIS → no ETL for tile generation
- **Negative**: MapLibre has a learning curve vs simpler options (Leaflet)
- **Negative**: 40 crore polygons require spatial indexing and tile caching strategy

---

## ADR-008: OpenSearch for Full-Text and Geospatial Search

**Status**: Accepted  
**Date**: September 2026  

### Context
Citizens need to search parcels by: ULPIN (exact match), Survey Number (hierarchical), owner name (fuzzy, multilingual, transliterated), address (geocoding), and map click (spatial intersection).

### Decision
**OpenSearch 2.x** as a secondary search index. PostgreSQL remains the system of record. OpenSearch is populated via CDC/event-based indexing. Features used:
- Full-text search with multilingual analyzers (Hindi, Marathi, Tamil, etc.)
- Fuzzy matching for owner names (Levenshtein distance)
- Geospatial search (geo_shape, geo_point)
- Autocomplete suggestions

### Consequences
- **Positive**: Fast search across 40 crore+ records; multilingual support; fuzzy matching
- **Positive**: Geospatial queries complement PostGIS (for search vs. analytical queries)
- **Negative**: Data consistency lag (search index is eventually consistent)
- **Negative**: Operational overhead of managing OpenSearch cluster

---

## ADR-009: Progressive Web App (PWA) for Citizen Access

**Status**: Accepted  
**Date**: September 2026  

### Context
Target users range from IT professionals with high-speed broadband to rural citizens with 2G connections on low-end Android devices. A PWA provides the best reach without app store distribution.

### Decision
The citizen frontend is a **React 19 + Vite 8 PWA** with:
- Service workers for offline caching of saved parcel data
- Installable on mobile devices (Add to Home Screen)
- Progressive loading (critical content first; secondary tabs lazy-loaded)
- Works on 2G networks with 200KB initial bundle target

### Consequences
- **Positive**: No app store approval; works on all modern browsers; installable
- **Positive**: Offline access for saved parcels
- **Negative**: Limited access to device hardware (GPS, camera) compared to native
- **Negative**: iOS Safari has limited PWA support (no push notifications)

---

## ADR-010: Append-Only Hash-Chained Audit Trail

**Status**: Accepted  
**Date**: September 2026  

### Context
Land records are high-value targets for tampering. Every action must be auditable, and the audit trail itself must be tamper-evident.

### Decision
The `audit_event` table is **append-only** — no UPDATE or DELETE operations permitted (enforced via database trigger). Each event includes:
- SHA-256 hash of its content
- Hash of the previous event (hash chain)
- Actor identity, action, resource, result, and change details

### Consequences
- **Positive**: Tamper-evident; any modification breaks the hash chain
- **Positive**: Compliance with CERT-In and ISO 27001 audit requirements
- **Negative**: Table grows indefinitely → partition by month; archive to cold storage after 2 years
- **Negative**: Hash chain verification is sequential → periodic batch verification, not real-time

---

## ADR-011: Dual Experience Planes (Citizen + Government)

**Status**: Accepted  
**Date**: September 2026  
**Supersedes**: PRD v1.0 §5.2 ("Officer dashboard / portal → Out of Scope")

### Context
PRD v1.0 explicitly declared "Officer dashboard / portal" as out of scope. Architecture v1.0 stated "NOT a mobile officer/field app — citizen web platform only." However, the core value proposition of Land Stack — integrating fragmented land systems — is equally valuable to the government officers who process mutations, verify land records, and make statutory decisions. A platform that tracks mutation status for citizens but provides no workspace for the Tehsildar who approves that mutation is architecturally incomplete.

DILRMP 3.0 itself describes Land Stack as a governance platform, not merely a citizen viewer.

### Decision
Land Stack serves **two experience planes** sharing a common parcel-centric backend:

1. **Citizen / Public Experience Plane** (PWA) — parcel search, Parcel 360°, mutation tracking, watchlists, service applications
2. **Government / Institutional Operations Plane** (web application) — explicit selection of Domain (Rural/Urban/Registration/GIS/Monitoring) → Role (13 specific roles) → Authentication, leading to role-based workspaces.

Both planes authenticate via **Supabase Auth** and are authorized by a robust **Express middleware chain** (`requireRole`, `requirePermission`, `requireJurisdiction`).

### Consequences
- **Positive**: Land Stack becomes a complete governance platform, not just a data viewer
- **Positive**: Government adoption drives data quality (officers using the system identify and fix issues)
- **Positive**: Demo scenarios can show end-to-end: citizen search → officer verification → Tehsildar approval → citizen notification
- **Negative**: Significantly larger product scope; requires careful prioritization
- **Negative**: Explicit domain/role UX requires strict backend synchronization to prevent bypassing
- **Migration path**: Phase 1 delivers citizen portal + minimal officer views. Phase 2 adds full role-based workspaces.

---

## ADR-012: Role + Jurisdiction + Department Authorization Model

**Status**: Accepted  
**Date**: September 2026  

### Context
The v1.0 authorization model defined only three access levels: Citizen (own parcel), Citizen (other parcel), Unauthenticated. The platform now requires multi-dimensional access control mapping 14 explicit roles across 5 domains (Rural, Urban, Registration, GIS, Monitoring).

### Decision
Implement **RBAC + Jurisdiction + Permissions** using an Express middleware chain + Supabase RLS. Authorization dimensions:

- **Who**: Authenticated user identity (JWT via Supabase)
- **Role**: Platform role (14 exact roles, e.g. CITIZEN, TALATHI, TEHSILDAR, SRO, COLLECTOR)
- **Permission**: Granular action capabilities (e.g., `mutation.approve`)
- **Jurisdiction**: Hierarchical (Village → Tehsil → District → State)
- **Action**: VIEW, CREATE, VERIFY, APPROVE, REJECT, ESCALATE, etc.

Authorization is enforced via composable middleware (e.g., `router.post('/:id/approve', requireAuth, requirePermission('mutation.approve'), requireJurisdiction, ...)`).

### Consequences
- **Positive**: Fine-grained, declarative access control at the route level
- **Positive**: Jurisdiction filtering at API level prevents data leakage
- **Positive**: Deeply integrated with Express request lifecycle
- **Negative**: Business logic validation (e.g. checking if mutation is in correct state) still requires custom controller logic.

---

## ADR-013: AI Land Intelligence Layer (Advisory Only)

**Status**: Accepted  
**Date**: September 2026  

### Context
The v1.0 architecture included a minimal "AI Advisory Module" with only anomaly detection and name matching. The platform now requires comprehensive land intelligence across 7 domains: Parcel Intelligence, Data Quality Intelligence, Workflow Intelligence, Registration-Mutation Intelligence, GIS/Spatial Intelligence, Executive Intelligence, and Natural Language Analytics.

### Decision
Build an **AI Land Intelligence Layer** as a first-class platform capability with strict governance rules:

1. All outputs labeled `ADVISORY` — never `APPROVED` or `DECIDED`
2. Every output includes confidence score, source references, model version, timestamp
3. Officers can dismiss any advisory (dismissal is audited)
4. AI never makes statutory decisions (enforced by Express middleware)
5. No PII sent to external LLM APIs (anonymization pipeline)
6. Every AI interaction is logged in audit trail

**Technology**: Express router for orchestration; Python/FastAPI sidecar for ML models; external LLM API for text generation (RAG pattern for grounded responses).

### Consequences
- **Positive**: Officers get actionable intelligence, not just raw data
- **Positive**: Data quality improves through automated anomaly detection
- **Positive**: PMU gets executive summaries and bottleneck analysis
- **Negative**: LLM API costs; need cost management strategy
- **Negative**: Hallucination risk with NL analytics → mitigated by RAG + grounding
- **Negative**: Requires anonymization pipeline for DPDP compliance

