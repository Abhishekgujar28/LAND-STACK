# Land Stack — References & Sources

**Version**: 1.0 | **Date**: September 2026
**Purpose**: Every source referenced across all backend planning documents, with notes on what was used from each.

---

## 1. Project Documentation (Internal)

These are the existing docs in our project that informed backend planning decisions.

| File | Path | What We Used It For |
|---|---|---|
| **Product Vision** | `docs/00-product-vision.md` | Dual experience planes thesis, 14-role architecture, core principles (federated, parcel-centric, projections-not-originals, AI advisory only) |
| **PRD** | `docs/01-prd.md` | 40+ functional requirements defining API surface area; performance targets (P360 < 2s, search < 500ms, tiles < 200ms); security requirements; compliance requirements (DPDP, CERT-In) |
| **Personas** | `docs/02-personas.md` | Detailed persona specs for all 14 roles — jurisdiction scopes, dashboard KPIs, work queue structures, permitted actions, sensitive data restrictions |
| **Master Architecture** | `docs/architecture.md` | System context diagram, domain module structure, State Adapter pattern, database schema (LADM, bi-temporal), GIS architecture (PostGIS, Martin, MVT), event architecture, security architecture (Express Middleware, Supabase Auth), authorization model |
| **Phases** | `docs/phases.md` | 16-phase roadmap (Phase 0-15) with dependency graph; parallel development tracks; MVP vs Production vs DPI scope comparison |
| **Workflows** | `docs/workflows.md` | 15 citizen and government workflow specifications with sequence diagrams; auth flow details (OTP rates, JWT expiry, session rules) |
| **Government Portal Architecture** | `docs/GOVERNMENT_PORTAL_ARCHITECTURE.md` | Portal shell architecture, state-aware auth flow, 7 government role workspace wireframes (Talathi, Tehsildar, SRO, Collector, PMU, National, Admin) |
| **Role Portal Matrix** | `docs/ROLE_PORTAL_MATRIX.md` | 14 roles × 15 permissions matrix with footnotes; jurisdiction hierarchy; data sensitivity masking matrix; Express Middleware enforcement |
| **Department Integration Matrix** | `docs/DEPARTMENT_INTEGRATION_MATRIX.md` | 9 external system integration specs — protocols, auth, retry, failure modes, freshness targets; state onboarding checklist |
| **Analytics & MIS** | `docs/ANALYTICS_MIS.md` | Multi-tier drill-down analytics requirements; visualization types; integration observability metrics |
| **AI Intelligence Architecture** | `docs/AI_INTELLIGENCE_ARCHITECTURE.md` | 7 AI advisory domains; ADVISORY label governance; document intelligence pipeline |
| **Citizen Features** | `docs/citizen-features.md` | Citizen-facing feature details — Parcel 360° tabs, watchlist, service applications |
| **Decisions** | `docs/decisions.md` | Architecture Decision Records (ADRs) — modular monolith rationale, role consolidation, event architecture choices |
| **Glossary** | `docs/glossary.md` | Indian land governance terminology — state-specific terms, administrative hierarchy names, land record document types |
| **Rules** | `docs/rules.md` | Platform rules and constraints — AI governance rules, data handling rules, security rules |
| **Executive Summary** | `00_LAND_STACK_MASTER_EXECUTIVE_SUMMARY.md` | Research findings: DILRMP coverage stats, Land Stack pilot launch (Dec 2025), state system variations, constitutional constraints, core value proposition |
| **Government Ecosystem** | `01_GOVERNMENT_LAND_GOVERNANCE_ECOSYSTEM.md` | Institutional hierarchy, department ownership, existing digital infrastructure (97% RoR computerized, 93% SRO computerized) |
| **State Portal Research** | `02_INDIAN_STATE_LAND_PORTAL_RESEARCH.md` | 17+ state portal analysis, terminology mapping, identifier variations, UX comparison |

---

## 2. BharatBhumi National Federated Architecture (Reference)

| Document | How We Used It |
|---|---|
| `BharatBhumi_National_Federated_Architecture_Final (1).md` | Referenced for understanding the national federated vision — how states connect to a central interoperability layer while maintaining data sovereignty. We did NOT copy its architecture; we drew our own conclusions adapted for Node.js + Express + Supabase. Key concepts absorbed: federation over centralization, state adapter pattern, ULPIN as universal key, provenance-first data model. |

**Note**: This file was not found in the project folder at the time of document creation. The federated architecture principles were instead drawn from `00_LAND_STACK_MASTER_EXECUTIVE_SUMMARY.md` and `docs/architecture.md`, which contain the same federated design philosophy.

---

## 3. Government & Policy Sources

| Source | URL/Reference | What We Used It For |
|---|---|---|
| **DILRMP 3.0 (2026-2031)** | PIB Press Release, September 2026 (pib.gov.in) | Official government mandate for GIS-based Land Stack; ₹565.50 crore outlay; key interventions (ULPIN universalization, georeferencing, paperless registration, RCCMS integration, NAKSHA urban mapping) |
| **DILRMP Guidelines** | Department of Land Resources (dolr.gov.in / s3waas.gov.in) | DILRMP 3.0 architecture requirements — federated design, API-based interoperability, parcel-centric approach |
| **Land Stack Pilot Launch** | PIB, December 2025 | Land Stack officially launched in Chandigarh and Tamil Nadu pilots; companion GoRT initiative |
| **ULPIN / Bhu-Aadhaar** | DoLR / DILRMP statistics | 14-digit coordinate-derived parcel identifier; 40+ crore parcels assigned across 28+ states |
| **SVAMITVA Scheme** | Ministry of Panchayati Raj | 3.3 lakh villages surveyed; 3.24 crore property cards; drone + CORS technology |
| **NAKSHA Urban Survey** | DoLR / Survey of India | Pilot in 152 ULBs across 26 states; urban property card preparation |
| **Constitution of India** | Seventh Schedule, Entry 18/45 (State List) | Land as a State subject — constitutional constraint requiring federated, not centralized, architecture |
| **DPDP Act, 2023** | Digital Personal Data Protection Act | Consent requirements, purpose limitation, data minimization — informed consent ledger design |
| **CERT-In Guidelines** | Computer Emergency Response Team - India | Session management (24-hour max), incident reporting — informed session management parameters |
| **ISO 19152 (LADM)** | International Organization for Standardization | Land Administration Domain Model — Party-RRR-Spatial Unit triplet — informed database schema design |

---

## 4. Technology & Architecture Sources (Online Research)

| Topic | Source | What We Learned |
|---|---|---|
| **PostGIS with Supabase** | Supabase documentation (supabase.com/docs/guides/database/extensions/postgis) | PostGIS extension enablement, geometry column types (GEOGRAPHY, GEOMETRY), GIST spatial indexing, spatial query examples, RPC function pattern for custom spatial queries |
| **Supabase RLS Patterns** | Supabase documentation + community patterns | Two patterns for jurisdiction isolation: (1) Membership table pattern with EXISTS subquery, (2) JWT custom claims pattern with auth.jwt(). Recommended combining both. Best practices: enforce RLS on all tables, use helper functions, index jurisdiction columns |
| **Supabase JWT + HTTP-Only Cookies** | Supabase SSR documentation + community patterns | Server-side session management with httpOnly cookies; Express middleware pattern for cookie-based auth; token refresh flow; trade-off that frontend JS cannot read httpOnly cookies (solved with /me endpoint) |
| **MapLibre GL JS + Vector Tiles** | MapLibre documentation (maplibre.org) | Vector tile consumption with addSource/addLayer API; WebGL GPU-accelerated rendering; click-to-select parcel interaction; multi-layer rendering |
| **PostGIS ST_AsMVT** | PostGIS documentation (postgis.net) | Native MVT tile generation from PostGIS; ST_AsMVTGeom for coordinate transformation and clipping; buffer parameter for tile edges |
| **pg_tileserv** | Crunchy Data documentation (crunchydata.com) | Zero-code tile server from PostGIS tables; auto-generated tile endpoints; alternative to Martin |
| **Martin Tile Server** | Martin documentation (maplibre.org/martin) | Rust-based high-performance tile server; serves from PostGIS tables/functions; recommended for high-traffic deployments |
| **LADM (ISO 19152)** | gdmc.nl, gim-international.com, geospatialworld.net | Party-RRR-Spatial Unit triplet; Basic Administrative Unit concept; fit-for-purpose adaptability; Edition II multi-part structure |
| **OGC Standards** | Open Geospatial Consortium (ogc.org) | WMS, WFS, WCS standards for serving spatial data; interoperability requirements for Indian GIS systems |
| **Indian GIS Standards** | Web research on BhuNaksha, ULPIN, SVAMITVA | BhuNaksha WMS/WFS endpoints, SVAMITVA drone survey methodology, ULPIN derivation from geo-coordinates, OGC compliance in Indian systems |

---

## 5. Architectural Patterns & Best Practices

| Pattern | Source | Where We Applied It |
|---|---|---|
| **State Adapter Pattern** | [architecture.md](../../docs/architecture.md) Section 4 | Configuration-driven state integration — terminology, identifiers, units, hierarchy all from database config |
| **Circuit Breaker** | Resilience engineering best practices | External system failure handling — open after 5 failures, serve cached projection |
| **Bi-temporal Modeling** | Temporal database design literature; [architecture.md](../../docs/architecture.md) Section 5 | valid_from/valid_to + system_from/system_to on all mutable records |
| **Hash-Chained Audit Trail** | Cryptographic audit log patterns; [LAND-STACK README](../../LAND-STACK/README.md) | SHA-256 forward hash chain on audit_event table |
| **Defense in Depth** | Security architecture best practices | Auth at Express middleware AND RLS at database level |
| **Projections with Provenance** | Data federation patterns; [00-product-vision.md](../../docs/00-product-vision.md) Section 5 | Never claim to hold truth; always attribute source, authority, freshness |
| **JWT in HTTP-Only Cookies** | OWASP Session Management Cheat Sheet | XSS protection, automatic cookie sending, CSRF mitigation with SameSite=Strict |
| **Cursor-Based Pagination** | Database performance best practices | Stable pagination on large datasets vs offset-based which degrades |
| **Event-Driven Architecture** | [architecture.md](../../docs/architecture.md) Section 7 | Registration → mutation trigger via webhook/event; status changes propagate via Realtime |
| **Modular Monolith** | [architecture.md](../../docs/architecture.md) Section 3; [decisions.md](../../docs/decisions.md) | Express modules mirror NestJS module boundaries for future extraction |

---

## 6. Existing LAND-STACK Codebase (Learning Reference)

| File | Path | What We Learned |
|---|---|---|
| **README** | `LAND-STACK/README.md` | NestJS modular monolith architecture, 9 mock government systems (ports 4001-4009), SHA-256 hash chain formula, 12-state mutation engine design |
| **API Sheet** | `LAND-STACK/API_SHEET.md` | API endpoint patterns, response structures, error handling conventions |
| **Package.json** | `LAND-STACK/backend/package.json` | NestJS dependencies, testing setup (Vitest), linting (oxlint) |

**Note**: The existing LAND-STACK is a NestJS + TypeScript backend. We are NOT using it — we're building fresh with Node.js + Express + Supabase. But we studied its design to understand the domain model, workflow states, and integration patterns, then adapted them to our simpler stack.

---

*This references document accompanies the 15 planning documents in `backend/docs/`. Every significant architectural decision traces back to one or more sources listed here.*
