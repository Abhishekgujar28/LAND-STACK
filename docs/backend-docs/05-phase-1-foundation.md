# Phase 1 — Foundation

**Goal**: Stand up the technical foundation — Supabase project, PostGIS, Express server, base schema, and development environment — so that every subsequent phase has solid ground to build on.

**Why First**: Nothing else can happen without a database, an API server, and a configured development environment. This is laying the plumbing.

---

## What Gets Built

### Supabase Project Setup
A Supabase project is created and configured with the correct region (Asia — Mumbai or Singapore for lowest latency to Indian users). PostGIS, pgcrypto, uuid-ossp, and pg_trgm extensions are enabled. Database connection strings and API keys are securely stored.

### Express Server Scaffold
A clean Express.js project with:
- Route structure mirroring future modules (auth/, parcel/, gis/, workflow/, etc.)
- Middleware stack: cookie-parser, helmet (security headers), cors, rate-limiter, request logging
- Error handling middleware with structured JSON error responses
- Health check endpoint
- Environment variable management (.env with Supabase URL, keys, etc.)

### Base Database Schema
The foundational tables that everything else depends on:
- `parcel` — central entity with ULPIN, state_code, classification, bi-temporal columns
- `parcel_identifier` — multi-ID resolution (Survey No, Khasra No, etc. mapping to parcel)
- `spatial_unit` — PostGIS geometry column (MULTIPOLYGON, SRID 4326) with GIST index
- `provenance` — source attribution records
- `audit_event` — append-only, hash-chained audit log with INSERT-only trigger
- `state_config` — configuration metadata per state (terminology, hierarchy, units)

### Development Environment
- Local development setup instructions
- Supabase CLI for local development (optional)
- Seed data: a handful of mock parcels with geometry in Maharashtra and Karnataka for testing

## Stakeholders Served
None directly — this is infrastructure. But it unblocks every stakeholder in subsequent phases.

## Key Decisions
- **Supabase Cloud vs Self-Hosted**: We use Supabase Cloud (managed) for development speed. Self-hosted is a future option for production government deployment.
- **Schema naming**: We use the `public` schema for application tables. PostGIS goes in `gis` schema. RLS is enabled on all `public` tables from day one.
- **Audit from day one**: The audit_event table and hash-chaining trigger are set up immediately, not retrofitted later.

## Dependencies
- Supabase account and project
- Node.js 20+ installed
- Domain and SSL certificate (for HTTPS cookies in production)

## Exit Criteria
- Express server starts and responds to `/health`
- Supabase connection established and tested
- PostGIS spatial query works (insert a polygon, query ST_Contains)
- Audit event insert triggers hash chain computation
- Seed data loaded and queryable

## Risks
- **Supabase region selection**: Choosing the wrong region adds latency. Mitigated by selecting Asia region.
- **Extension compatibility**: Verify all needed PostgreSQL extensions are available in Supabase. Confirmed via documentation.

## References
- [00-backend-vision.md](./00-backend-vision.md) — Stack rationale
- [03-database-design-philosophy.md](./03-database-design-philosophy.md) — Schema principles
- [architecture.md](../../docs/architecture.md) Section 5 — Database architecture
- Supabase documentation — project setup and extension enablement
