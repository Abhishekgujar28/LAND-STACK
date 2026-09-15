# Land Stack — Product Requirements Document (PRD)

**Version**: 3.0 | **Last Updated**: September 2026
**Status**: Canonical
**Owner**: Land Stack Product & Engineering Team
**Aligned With**: DILRMP 3.0 (2026–2031), ISO 19152 LADM
**Supersedes**: PRD v2.0 (citizen-only scope)

---

## 1. Executive Summary

Land Stack is a **parcel-centric federated Digital Public Infrastructure and governance intelligence platform** that connects India's fragmented State land governance systems into a unified platform serving two experience planes:

1. **Citizen Experience Plane**: A PWA providing unified Parcel 360° views (Rural/Urban), mutation tracking, watchlists, service applications, document access, and Schemes/Financial Discovery.

2. **Government Operations Plane**: Role-based workspaces for 14 granular system roles organized into domains (Rural, Urban, Shared GIS, Monitoring). The login experience features explicit role selection prior to backend authorization.

Both planes share a common parcel-centric backend built on Express.js and Supabase (PostgreSQL + PostGIS + Auth), with event-driven workflows, data quality scoring, analytics dashboards, and append-only audit trails.

### What Land Stack IS

- An **interoperability and service layer** reading from authoritative State systems
- A **dual-plane platform** serving both citizens and government officers
- A **parcel-centric data mesh** where every interaction revolves around the land parcel (ULPIN)
- A **workflow orchestrator** routing government processes with SLA monitoring
- A **governance intelligence platform** with analytics, AI advisory, and data quality detection
- A **document intelligence system** with OCR, classification, and integrity verification

### What Land Stack is NOT

- NOT a replacement for Bhulekh, Bhoomi, BhuNaksha, NGDRS, or any State system
- NOT a centralized national land database (it stores projections with provenance)
- NOT a statutory decision-maker (Tehsildars approve mutations; Sub-Registrars register deeds)
- NOT an AI authority (all AI outputs labeled ADVISORY; officers decide)

---

## 2. Problem Statement

### 2.1 The Fragmentation Problem

India has **no uniform national land record format, database schema, terminology, parcel identifier, or administrative workflow**. Each State maintains independently operated systems:

| Aspect | Variation |
|---|---|
| **Land record** | 7/12 (MH), RTC (KA), Patta (TN), Khatauni (UP), Jamabandi (RJ/HR/PB) |
| **Parcel identifier** | Survey No (MH), Survey/Hissa (KA), Khasra No (UP), Murrabba+Killa (HR/PB) |
| **Area units** | Acre/Guntha (MH/KA), Acre/Cent (TN), Bigha/Biswa (UP/RJ), Kanal/Marla (HR/PB) |
| **Village officer** | Talathi (MH), Shanbhog (KA), VAO (TN), Lekhpal (UP), Patwari (RJ/HR/PB) |
| **Hierarchy** | Division→District→Taluka→Village (MH), District→Taluk→Hobli→Village (KA) |

### 2.2 The Citizen Pain Point

A citizen checking land status must navigate 5–8 separate portals. Each uses different identifiers for the same parcel. There is no way to get a unified view.

### 2.3 The Government Operational Pain Point

Government officers lack:
- **Unified parcel context** when processing mutations, verifications, or approvals
- **Cross-department visibility** into registration events affecting their jurisdiction
- **SLA monitoring** across tehsils and districts
- **Data quality intelligence** to identify conflicting records across sources
- **Analytics** to understand governance performance and bottlenecks

### 2.4 What DILRMP 3.0 Mandates

> *"A GIS-based Land Stack that integrates the cadastral parcel layer as base layer with other spatial layers and overlay of Master Plan/Land Use, Building Plan etc. and related attribute data like Record of Rights, Registration, Circle Rate, Restriction, etc."*

Land Stack must create a **"trusted Digital Public Infrastructure (DPI) for land governance"** using Bhu-Aadhaar (ULPIN) as the common identifier.

---

## 3. Product Vision

> **One parcel. One identity. Many sources. Many workflows. One intelligence layer. Role-specific experiences.**

---

## 4. Roles and Domains (14 System Roles)

Land Stack operates across **14 distinct system roles** (defined in `core/permissions.js`), organized into functional domains to provide an explicit, clear user experience.

### 4.1 Citizen Plane

| Domain | Roles | Scope & Profile | Primary Function |
|---|---|---|---|
| **Public** | `CITIZEN` | Landholders, buyers, NRIs | Parcel search, Parcel 360° (Rural/Urban), service applications, Schemes & Financial Discovery, mutation tracking, watchlists. |

### 4.2 Government Operations Plane (13 Roles)

The government UX groups roles by domain so users can explicitly select their operating area before entering their workspace.

| Domain | Roles | Primary Functions |
|---|---|---|
| **Rural** | `TALATHI`, `PATWARI`, `CRO`, `TEHSILDAR`, `SRO`, `COLLECTOR` | Rural cadastral management, agricultural mutations, field verification, rural registration, district-level escalation. |
| **Urban** | `ULB_OFFICER`, `SRO` | Municipal property tax, urban zoning verification, urban registration, property card management. |
| **Shared GIS** | `SURVEY_GIS` | Cadastral boundaries, survey projects, spatial overlaps, geometry QA across both rural and urban domains. |
| **Monitoring** | `STATE_PMU`, `STATE_AUTHORITY`, `NATIONAL_MONITOR`, `DOLR_NATIONAL`, `ADMIN` | Executive oversight, SLA tracking, DILRMP compliance, platform administration, user management. |

---

## 5. Product Scope

### 5.1 In Scope

| Domain | Citizen Features | Government Features |
|---|---|---|
| **Parcel Discovery** | ULPIN, Survey No, owner name, map click, address search | Same + jurisdiction-filtered, advanced filters |
| **Parcel 360°** | 10-tab citizen view (differentiated for Rural vs Urban) | Extended officer view with audit, case history, AI advisory |
| **Mutation** | Status tracking, timeline, SLA display | Full lifecycle: verification → review → hearing → sanction → RoR update |
| **Service Applications** | Apply for RoR extract, NEC, correction, grievance | Process applications: verify, deficiency, approve/reject |
| **Schemes & Financial Discovery** | View matching agricultural/housing schemes, potential institutional credit | (Not applicable for govt processing; discovery only) |
| **Watchlist & Alerts** | Watch parcels, configurable alerts | SLA alerts, escalation alerts, integration failure alerts |
| **Map / GIS** | Interactive map with overlays (Cadastral vs Zoning) | Analytical GIS workspace with spatial queries, anomaly layers |
| **Documents** | View/download certified copies | Upload, OCR, classify, verify, link to cases |
| **Analytics** | — | Drill-down dashboards: National → State → District → Village |
| **AI Intelligence** | Parcel summary, data health explanation | Anomaly detection, SLA prediction, bottleneck analysis, NL queries |
| **Case Management** | View application status | Work queues, task assignment, SLA tracking, escalation chains |
| **Notifications** | SMS, email, in-app push | Role-aware: new tasks, SLA breach, escalation, AI advisory |

### 5.2 Out of Scope

| Domain | Reason |
|---|---|
| **Registration execution** | Statutory function of Sub-Registrar; Land Stack verifies parcel context but does not register deeds |
| **Mutation approval authority** | Statutory function of Tehsildar; Land Stack provides the workflow workspace but the decision is the officer's |
| **Revenue court judgments** | Judicial function; Land Stack displays status and facilitates case management |
| **Native mobile apps** | PWA covers mobile; native apps are future scope |
| **Blockchain / tokenization** | Not applicable |
| **Direct write to State DBs** | Land Stack reads and projects; never writes to authoritative sources |

---

## 6. Functional Requirements — Citizen

### FR-C1: Parcel Search
| ID | Requirement | Priority |
|---|---|---|
| FR-C1.1 | ULPIN exact-match search | P0 |
| FR-C1.2 | Hierarchical Survey Number search with state-specific terminology | P0 |
| FR-C1.3 | Owner name fuzzy search (multilingual, transliterated) | P0 |
| FR-C1.4 | Map click spatial search | P0 |
| FR-C1.5 | Address/landmark geocoding search | P1 |

### FR-C2: Parcel 360° (Citizen Mode)
| ID | Requirement | Priority |
|---|---|---|
| FR-C2.1 | Overview: ULPIN, identifiers, area, classification, status, provenance | P0 |
| FR-C2.2 | Map: boundary polygon, satellite, zoning overlay, restriction overlay | P0 |
| FR-C2.3 | Rural Mode: 7/12 & 8A extracts, agricultural mutations, cadastral boundaries | P0 |
| FR-C2.4 | Urban Mode: Property Card/CTS, municipal tax, urban zoning, building permissions | P0 |
| FR-C2.5 | Transaction History: timeline of ownership changes | P0 |
| FR-C2.6 | Encumbrances: mortgages, liens, attachments | P0 |
| FR-C2.7 | Restrictions: forest, tribal, acquisition, court stay, environmental | P0 |
| FR-C2.8 | Courts: revenue/civil cases, hearing dates, orders | P1 |
| FR-C2.9 | Data Health: completeness, consistency, currency scores | P0 |
| FR-C2.10 | Legal disclaimer (non-dismissible) | P0 |
| FR-C2.11 | Provenance display on every data element | P0 |

### FR-C3: Mutation Tracking
| ID | Requirement | Priority |
|---|---|---|
| FR-C3.1 | Auto-creation from registration.completed event | P0 |
| FR-C3.2 | 12-state workflow status display | P0 |
| FR-C3.3 | Timeline with timestamps | P0 |
| FR-C3.4 | SLA traffic light display | P0 |
| FR-C3.5 | Notification at each transition | P0 |

### FR-C4: Service Applications
| ID | Requirement | Priority |
|---|---|---|
| FR-C4.1 | Apply for RoR extract / certified copy | P1 |
| FR-C4.2 | Apply for Non-Encumbrance Certificate | P1 |
| FR-C4.3 | Submit data correction request | P1 |
| FR-C4.4 | Submit grievance / dispute intimation | P1 |

### FR-C5: Watchlist & Alerts
| ID | Requirement | Priority |
|---|---|---|
| FR-C5.1 | Add/remove parcels to watchlist | P0 |
| FR-C5.2 | Configurable alert types per parcel | P0 |
| FR-C5.3 | Change detection triggers alerts | P0 |
| FR-C5.4 | Communication preferences (language, channel, frequency) | P1 |

### FR-C6: Schemes & Financial Assistance Discovery
| ID | Requirement | Priority | Maturity |
|---|---|---|---|
| FR-C6.1 | Schemes Engine: Configuration-driven matching of parcel context (rural/urban, size, owner) with potential government benefits | P1 | Planned |
| FR-C6.2 | Financial Discovery: Advisory-only matching for institutional credit or property-linked assistance | P1 | Planned |
| FR-C6.3 | Disclaimer: Explicitly state that Land Stack does not approve loans or guarantee eligibility | P1 | Planned |

### FR-C7: Authentication
| ID | Requirement | Priority | Maturity |
|---|---|---|---|
| FR-C7.1 | Mobile OTP login (via Supabase Auth) | P0 | Implemented |
| FR-C7.2 | Aadhaar eKYC (consent-based, optional) | P1 | Planned |
| FR-C7.3 | Profile management (language, state, notifications) | P0 | Partially Implemented |
| FR-C7.4 | DPDP-compliant consent recording | P0 | Planned |

---

## 7. Functional Requirements — Government Operations

### FR-G1: Government Authentication & Jurisdiction
| ID | Requirement | Priority | Maturity |
|---|---|---|---|
| FR-G1.1 | Supabase Auth login with email/password + MFA step-up for sensitive operations | P0 | Implemented |
| FR-G1.2 | **Explicit Role Selection**: Users explicitly select Domain (Rural/Urban/Shared/Monitoring) and specific Role before authenticating | P0 | Architecturally Defined |
| FR-G1.3 | Jurisdiction binding: State → District → Tehsil → Village (stored in `government_users` table) | P0 | Implemented |
| FR-G1.4 | Role assignment with permission set (enforced via `requireRole` + `requirePermission` middleware on the backend, ensuring frontend selection is strictly validated) | P0 | Implemented |
| FR-G1.5 | Dynamic UI rendering based on explicitly selected role + validated jurisdiction | P0 | Implemented |
| FR-G1.6 | Session: HTTP-only cookie with JWT, MFA step-up for approve/reject actions | P0 | Implemented |

### FR-G2: Parcel 360° (Officer Mode)
| ID | Requirement | Priority |
|---|---|---|
| FR-G2.1 | All citizen tabs + extended officer context | P0 |
| FR-G2.2 | Authoritative source references with raw provenance | P0 |
| FR-G2.3 | Workflow history: every mutation/case that touched this parcel | P0 |
| FR-G2.4 | Officer action history: who did what and when | P0 |
| FR-G2.5 | Data conflicts: cross-source mismatches highlighted | P0 |
| FR-G2.6 | AI advisory panel: parcel intelligence summary | P1 |
| FR-G2.7 | Integration status: which sources are fresh vs stale | P0 |
| FR-G2.8 | Linked cases: related mutations, court cases, survey projects | P0 |

### FR-G3: Work Queue & Case Management
| ID | Requirement | Priority |
|---|---|---|
| FR-G3.1 | Role-specific work queue showing pending tasks | P0 |
| FR-G3.2 | Task assignment and reassignment | P0 |
| FR-G3.3 | SLA tracking with traffic-light indicators | P0 |
| FR-G3.4 | Escalation chain: auto-escalate on SLA breach | P0 |
| FR-G3.5 | Case workspace: all documents, timeline, actions, notes | P0 |
| FR-G3.6 | Bulk operations for queue management | P1 |

### FR-G4: Mutation Workflow (Officer Side)
| ID | Requirement | Priority |
|---|---|---|
| FR-G4.1 | Talathi: receive field verification task, record findings, upload photos, submit recommendation directly to Tehsildar | P0 |
| FR-G4.2 | Tehsildar: review case, verify data quality, conduct hearing if objected, authoritatively approve/reject, issue order | P0 |
| FR-G4.3 | SLA enforcement: automatic escalation to District Collector if Tehsildar queue exceeds statutory SLA | P0 |
| FR-G4.4 | Objection handling: record objections, schedule hearings, issue formal notices | P1 |

### FR-G5: Registration Integration
| ID | Requirement | Priority |
|---|---|---|
| FR-G5.1 | Sub-Registrar: search parcel, view ownership + encumbrances before registration | P0 |
| FR-G5.2 | Webhook ingestion: receive registration.completed events from NGDRS | P0 |
| FR-G5.3 | Auto-trigger mutation case creation on registration event | P0 |

### FR-G6: Survey & GIS Workflows
| ID | Requirement | Priority |
|---|---|---|
| FR-G6.1 | Survey Officer: create survey project, assign areas, track progress | P1 |
| FR-G6.2 | Surveyor: record field measurements, upload GPS data | P1 |
| FR-G6.3 | GIS Officer: process boundaries, detect overlaps, validate topology | P1 |
| FR-G6.4 | Map-based discrepancy hotspot visualization | P1 |

### FR-G7: Court Case Management
| ID | Requirement | Priority |
|---|---|---|
| FR-G7.1 | Link court case to parcel(s) | P1 |
| FR-G7.2 | Record hearings, orders, appeals | P1 |
| FR-G7.3 | Propagate restriction to Parcel 360° when court order issued | P1 |

### FR-G8: Planning & Municipal
| ID | Requirement | Priority |
|---|---|---|
| FR-G8.1 | Zoning verification: check parcel against master plan | P2 |
| FR-G8.2 | Building permission workflow: application → checks → approval | P2 |
| FR-G8.3 | Land-use change tracking | P2 |

### FR-G9: Analytics & MIS
| ID | Requirement | Priority |
|---|---|---|
| FR-G9.1 | National / State / District / Tehsil / Village drill-down | P0 |
| FR-G9.2 | Mutation pendency dashboard | P0 |
| FR-G9.3 | Registration-to-mutation conversion rate | P0 |
| FR-G9.4 | Data quality score trends | P0 |
| FR-G9.5 | Integration health and uptime | P0 |
| FR-G9.6 | ULPIN / RoR / Map coverage metrics | P1 |
| FR-G9.7 | District ranking and comparison | P1 |

### FR-G10: AI Land Intelligence
| ID | Requirement | Priority |
|---|---|---|
| FR-G10.1 | Parcel Intelligence: summarize 360°, identify events, explain history | P1 |
| FR-G10.2 | Data Quality Intelligence: detect RoR-map mismatch, duplicate owners, stale data | P0 |
| FR-G10.3 | Workflow Intelligence: predict SLA risk, identify bottlenecks | P1 |
| FR-G10.4 | Executive Intelligence: state/district summaries, governance performance | P1 |
| FR-G10.5 | Natural Language Queries: "Which tehsils have highest mutation backlog?" | P2 |
| FR-G10.6 | AI Governance: every output labeled ADVISORY with confidence, source, model version | P0 |

### FR-G11: Notifications (Officer)
| ID | Requirement | Priority |
|---|---|---|
| FR-G11.1 | New task assigned | P0 |
| FR-G11.2 | SLA approaching / breached | P0 |
| FR-G11.3 | Escalation received | P0 |
| FR-G11.4 | Data conflict detected | P1 |
| FR-G11.5 | Integration failure in jurisdiction | P1 |

---

## 8. Non-Functional Requirements

### 8.1 Performance
| Metric | Target | Alert Threshold |
|---|---|---|
| Parcel 360 query (P95) | < 2s | > 5s |
| Search query (P95) | < 500ms | > 2s |
| Map tile delivery (P95) | < 200ms | > 1s |
| Work queue load (P95) | < 1s | > 3s |
| Analytics dashboard (P95) | < 5s | > 10s |

### 8.2 Scale
| Dimension | Target |
|---|---|
| Total parcels addressable | 40+ crore (400M+) |
| Concurrent citizen users | 10,000+ |
| Concurrent government users | 5,000+ |
| Daily API calls | 10M+ |

### 8.3 Security
| Requirement | Standard |
|---|---|
| Transport encryption | TLS 1.3 everywhere |
| Data at rest | AES-256 |
| PII field-level | AES-256-GCM |
| Audit trail | Append-only, hash-chained |
| API rate limiting | Per-endpoint, per-role |
| WAF | OWASP Top 10 |

### 8.4 Compliance
| Regulation | Requirement |
|---|---|
| DPDP Act, 2023 | Consent engine; purpose limitation; data minimization; no raw Aadhaar |
| CERT-In | Session management; incident reporting |
| ISO 27001 | ISMS |
| WCAG 2.1 AA | Accessibility |

### 8.5 Internationalization
| Requirement | Detail |
|---|---|
| Languages | English + Hindi + State language (minimum 3 per State) |
| Scripts | Devanagari, Kannada, Tamil, Telugu, Gujarati, Bengali, Odia, Punjabi, Malayalam |
| RTL | Urdu |
| Numbers | Indian lakhs/crores system |
| Area units | Dynamic conversion based on state_config |

---

## 9. Constraints

| Constraint | Impact |
|---|---|
| **Land is a State Subject** | Must adapt to each State; cannot impose uniform schema |
| **State systems are authoritative** | Land Stack reads/projects; never writes |
| **Statutory authority for mutations** | Tehsildar approves; software tracks |
| **Statutory authority for registration** | Sub-Registrar registers; software integrates |
| **ULPIN coverage incomplete** | Fallback to State identifiers required |
| **State API availability varies** | Circuit breakers, cache fallback, graceful degradation |
| **Rural connectivity** | PWA on 2G; progressive loading; <200KB initial bundle |

---

## 10. Success Metrics

| Metric | 6-Month Pilot | 12-Month |
|---|---|---|
| Citizen registrations | 10,000 | 100,000 |
| Daily Parcel 360 views | 5,000 | 50,000 |
| Government users active | 200 | 2,000 |
| Mutation cases tracked | 500 | 5,000 |
| Avg mutation processing time | Baseline | 20% reduction |
| Data quality issues detected | 1,000 | 10,000 |
| States onboarded | 2 | 5 |
| Citizen NPS | > 40 | > 60 |
| Officer task completion rate | > 80% | > 90% |
| Analytics dashboard usage | 50 daily | 500 daily |

---

## 11. Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| State systems refuse API access | HIGH | CRITICAL | DoLR mandate; batch ingestion fallback; mock adapters |
| Data quality from States is poor | HIGH | HIGH | DQ Engine; health scores; AI anomaly detection |
| Government officer adoption resistance | MEDIUM | HIGH | Training; simple UX; task-first design; mobile-responsive |
| ULPIN coverage gaps | MEDIUM | HIGH | Fallback to State identifiers; identity graph |
| Scale: 40+ crore parcels | MEDIUM | HIGH | PostGIS GIST; Redis; read replicas; partitioning |
| Privacy/DPDP compliance | MEDIUM | HIGH | Consent engine; no raw Aadhaar; DPO appointment |

---

## 12. Product Demonstration Scenarios

| # | Scenario | Personas | What It Demonstrates |
|---|---|---|---|
| 1 | Citizen finds parcel via Survey Number | Citizen Land Owner | Multi-modal search, state-specific terminology |
| 2 | Citizen opens Parcel 360° | Citizen Land Owner | Data aggregation from multiple database layers |
| 3 | Citizen tracks mutation status | Citizen Land Owner | Workflow tracking, SLA display, notifications |
| 4 | Citizen submits service request | Citizen Land Owner | Application submission, document upload |
| 5 | Citizen explores potential schemes | Citizen Land Owner | Schemes & Financial Discovery engine |
| 6 | Officer explicitly selects role | All Government Roles | Login UX: Select Domain (Rural/Urban) → Role → Auth |
| 7 | Talathi sees pending verifications | Talathi / Patwari | Work queue, task-first design |
| 6 | Talathi completes field verification | Talathi / Patwari | Case workspace, photo upload, structured recommendation |
| 7 | Tehsildar reviews case and data health | Tehsildar | Decision workspace, AI advisory check, conflict review |
| 8 | Tehsildar sanctions mutation order | Tehsildar | Statutory approval, digital order, RoR update trigger |
| 9 | SRO verifies parcel context | Sub-Registrar (SRO) | Registration integration, encumbrance check |
| 10 | District Collector reviews tehsil SLA | District Collector | District analytics dashboard, SLA drill-down |
| 11 | PMU reviews statewide performance | State PMU Head | Executive command center, DILRMP indicators |
| 12 | National monitor tracks cross-state metrics | DoLR / National Monitor | Inter-state comparison, national ULPIN progress |
| 13 | System admin reviews system health | System Administrator | Platform health, integration status |
| 14 | Admin verifies audit trail | System Administrator | Append-only audit verification |

---

*This PRD is the canonical requirements document. All architecture, design, and implementation decisions must trace back to requirements defined here.*
