# 01 — Product Vision and Scope

> **LAND-STACK (Bharat Bhumi)** — India's unified, parcel-centric land information and land administration platform.

**Version**: 1.0 | **Date**: September 2026

---

## 0. Official Problem Statement (MoRD / DoLR)

| Parameter | Specification |
|---|---|
| **Problem Title** | **An Integrated GIS-based Digital Public Infrastructure for Land Governance** |
| **Organization** | Ministry of Rural Development (MoRD) |
| **Department** | Department of Land Resources (DoLR) |
| **Category** | Software |
| **Theme** | Agriculture, FoodTech & Rural Development |

### Background & National Mandate
Land governance in India involves multiple institutions maintaining land-related information in fragmented and disconnected systems. Core datasets such as cadastral maps, Record of Rights (RoR), registration records, land use information, Master Plan, Building Permission, Restrictions, property taxation records, utility infrastructure, and other land-related databases are often managed independently by different departments and agencies with limited interoperability. This results in duplication of effort, inconsistencies in records, delays in obtaining ownership information, lack of transparency in transactions, and inconvenience to citizens seeking land-related services.

The Department of Land Resources initiated the development and deployment of Land Stack in pilot locations of **Chandigarh** and **Tamil Nadu**, launched on **31 December 2025**. Following successful implementation, the platform is expanding across India by covering **one city and one village in every State and Union Territory**, and subsequently scaled to achieve nationwide coverage.

### Three-Tier Spatial Architecture
1. **Base Layer**: Georeferenced cadastral maps, parcel boundaries, and unique parcel identifiers (14-digit ULPIN / Bhu-Aadhaar).
2. **Essential Layers**: Core governance datasets linked to each parcel: Record of Rights (RoR), deed registration data, master plans, building permissions/approvals, encumbrance and mortgage records, land use and zoning regulations.
3. **Additional / Use-Case Layers**: Utility infrastructure, property taxation records, valuation references, environmental or restriction zones, and other public service linkages.

### Expected Deliverables
- Functional GIS-based DPI prototype with parcel-centric exploration.
- End-to-end interoperable workflows between Revenue, Registration, Survey, Courts, and Planning.
- Role-separated Citizen Portal and 14-role Government Operations Console.
- Standard Technical Document (API standards, interoperability standards, data schemas, GIS standards, security frameworks, UI/UX guidelines, color schemas, deployment and scalability considerations).

---

## 1. What LAND-STACK Is

LAND-STACK is a **parcel-centric, GIS-enabled Digital Public Infrastructure platform** for land governance in India. It unifies fragmented land records from multiple government departments — Revenue, Registration, Survey, Courts, Planning, and Municipal — into a single coherent system anchored on the 14-digit **ULPIN (Unique Land Parcel Identification Number / Bhu-Aadhaar)**.

The product provides:

- **A Citizen Portal** where landholders and the public access comprehensive parcel information, track mutations, file applications, and monitor land changes
- **A Government Operations Portal** where revenue officers, registrars, collectors, and administrators perform statutory land administration tasks through role-specific workspaces
- **A GIS Platform** that stores, validates, and serves cadastral geometry alongside tabular land records
- **A Governance Intelligence Layer** that provides analytics, data quality monitoring, and operational dashboards at every administrative level

**[CONFIRMED-CODE]** The current implementation uses React 18 + Vite for the frontend, Node.js + Express for the backend, and Supabase PostgreSQL (with PostGIS enabled) for the database.

**[CONFIRMED-RESEARCH]** LAND-STACK aligns with DILRMP 3.0 (2026–2031), which mandates GIS-enabled "Land Stack" digital infrastructure with ULPIN, interoperable APIs, and citizen service delivery.

---

## 2. Product Vision

> Enable any citizen to see the complete truth about any land parcel in India — ownership, map, encumbrances, restrictions, courts, zoning, tax — on one page, in their language, with source attribution for every fact. Simultaneously enable government officers at every level to process land administration workflows — mutations, surveys, registrations, disputes — through a unified, jurisdiction-aware, SLA-tracked platform.

### Vision Statements

| Stakeholder | Vision |
|-------------|--------|
| **Citizen** | "I can see everything about my land on one screen, track my mutation in real time, and get alerted if anything changes — without visiting a single government office." |
| **Talathi** | "My pending field verifications are organized in a work queue. I submit findings digitally. No paper. No ambiguity." |
| **Tehsildar** | "I see the complete parcel history, verification report, and risk analysis before sanctioning a mutation. Every decision is audited." |
| **District Collector** | "I see tehsil-by-tehsil performance, SLA compliance, and pending escalations across my district in one dashboard." |
| **State PMU** | "I monitor statewide land digitization progress, integration health, and cross-district performance from a single command center." |

---

## 3. Product Mission

Make land records **transparent**, **trustworthy**, **accessible**, and **interoperable** across departments and states, reducing:

1. Land disputes and litigation
2. Revenue office visits by citizens
3. Processing time for mutations and applications
4. Data inconsistencies between departments
5. Opportunities for fraud and unauthorized transactions

---

## 4. Actual Users

### 4.1 Citizen / Landholder

**[CONFIRMED-CODE]** Role: `CITIZEN`. Portal: `/citizen/*`. Authenticated via mobile OTP.

A rural farmer, urban property owner, NRI landholder, or prospective buyer who needs to view land records, track mutations, file applications, receive alerts, and perform due diligence.

### 4.2 Talathi / Patwari (Village Revenue Officer)

**[CONFIRMED-CODE]** Role: `TALATHI` / `PATWARI`. Portal: `/government/talathi`. Jurisdiction: Village/Circle level.

Maintains Form 6/7/12 entries, conducts field verifications for mutation cases, uploads geotagged photos, submits structured recommendations to the Tehsildar.

### 4.3 Tehsildar / Circle Revenue Officer (CRO)

**[CONFIRMED-CODE]** Role: `TEHSILDAR` / `CRO`. Portal: `/government/tehsildar`. Jurisdiction: Tehsil level.

The primary statutory authority who sanctions or rejects e-Ferfar mutations, hears quasi-judicial RTS revenue cases, manages SLA deadlines, and issues mutation orders.

### 4.4 Sub-Registrar Officer (SRO)

**[CONFIRMED-CODE]** Role: `SRO`. Portal: `/government/registration`. Jurisdiction: Sub-Registrar zone.

Performs pre-registration parcel verification (title clarity, encumbrance check, court stay check), registers deeds, and triggers mutation events in the revenue system.

### 4.5 District Collector

**[CONFIRMED-CODE]** Role: `COLLECTOR`. Portal: `/government/district`. Jurisdiction: District level.

District-level monitoring, Section 36A tribal land transfer approvals, revenue court appeal review, tehsil performance oversight.

### 4.6 State PMU Head

**[CONFIRMED-CODE]** Role: `STATE_PMU`. Portal: `/government/state`. Jurisdiction: State level.

State-wide DILRMP digitization monitoring, cadastral integration health, SLA compliance, district performance rankings.

### 4.7 National Monitor (DoLR)

**[CONFIRMED-CODE]** Role: `NATIONAL_MONITOR`. Portal: `/government/national`. Jurisdiction: National level.

Pan-India DILRMP benchmarks, ULPIN adoption metrics, cross-state federation health, national progress maps.

### 4.8 System Administrator

**[CONFIRMED-CODE]** Role: `ADMIN`. Portal: `/government/admin`. Jurisdiction: Platform-wide.

System health, RBAC management, audit trail integrity, API sync queue, security event monitoring.

### 4.9 Survey / GIS Officer

**[CONFIRMED-CODE]** Role: `SURVEY_GIS` / `SURVEY_OFFICER`. Defined in `config/roles.js` and `core/permissions.js`.

Cadastral survey operations, spatial geometry validation, polygon topology checks, drone layer processing. **[MISSING]** No dedicated frontend workspace exists yet.

### 4.10 ULB Officer (Urban Local Body)

**[CONFIRMED-CODE]** Role: `ULB_OFFICER`. Defined in `config/roles.js` and `core/permissions.js`.

Municipal property tax, building permissions, urban CTS card operations, zoning verification. **[MISSING]** No dedicated frontend workspace exists yet.

### 4.11 Public (Unauthenticated)

**[CONFIRMED-CODE]** Portal: `/` (public routes). No authentication required.

Anyone who visits the public website to learn about services, search public land information, or access government scheme details.

---

## 5. Problems Solved

| Problem | How LAND-STACK Solves It |
|---------|-------------------------|
| **Fragmented land records** across Revenue, Registration, Survey, Courts, Planning, and Tax departments | Unified Parcel 360° view aggregating all data sources keyed on ULPIN |
| **Opaque mutation process** — citizens cannot track status | Real-time mutation tracking with 12-state workflow timeline and notifications |
| **Manual, paper-based government workflows** | Digital work queues, field verification submission, and e-sanction |
| **No proactive alerts** on land changes | Watchlist system with configurable alerts for ownership, encumbrance, restriction, and court case changes |
| **No due diligence tool** for land buyers | Automated due diligence checklist aggregating title, encumbrance, restriction, court, zoning, and tax data |
| **No spatial data in land records** | PostGIS-backed geometry storage with map visualization and spatial queries |
| **No cross-department visibility** | Analytics dashboards from village to national level |
| **No audit trail** for land record changes | Hash-chained, append-only audit event log |

---

## 6. Product Principles

1. **Parcel-Centric**: Every interaction anchors to a land parcel identified by ULPIN. No orphan data.
2. **Database-Authoritative**: Supabase PostgreSQL is the single runtime source of truth. No mock data in production.
3. **Jurisdiction-Enforced**: Officers see only data within their assigned jurisdiction. Backend enforces this.
4. **Statutory Respect**: Software does not approve mutations or determine ownership. Officers make statutory decisions. AI outputs are labeled ADVISORY.
5. **Source Attribution**: Every data point carries provenance — source system, authority, retrieval timestamp.
6. **Secure by Default**: Authentication via Supabase Auth with JWT. Authorization via RBAC + jurisdiction. Audit everything.
7. **Progressive Enhancement**: Core features work on low-bandwidth connections. PWA capable.
8. **Standards-Compliant**: LADM (ISO 19152), ULPIN format, DILRMP 3.0, UX4G Design System, DPDP Act 2023.

---

## 7. Core Capabilities

### 7.1 Citizen-Facing

| Capability | Description | Status |
|-----------|-------------|--------|
| **Parcel Search** | Search by ULPIN, survey number, hierarchical location, or owner name | [CONFIRMED-CODE] Implemented |
| **Parcel 360° View** | Composite view: overview, map, ownership, encumbrances, restrictions, zoning, tax, courts, documents, data health | [CONFIRMED-CODE] Implemented |
| **My Parcels (Form 8A)** | List of parcels owned by the authenticated citizen | [CONFIRMED-CODE] Implemented |
| **Mutation Tracking** | Real-time status tracking of pending ownership mutations | [CONFIRMED-CODE] Implemented |
| **Applications** | Submit and track service applications (RoR extract, NEC, data correction) | [CONFIRMED-CODE] Implemented |
| **Documents / Digital Locker** | View and download certified documents associated with parcels | [CONFIRMED-CODE] Implemented |
| **Watchlist & Alerts** | Monitor parcels for unauthorized filings, ownership changes, or survey notices | [CONFIRMED-CODE] Implemented |
| **Notifications** | In-app notification center for mutation updates, alerts, and system messages | [CONFIRMED-CODE] Implemented |
| **Grievances** | File and track grievances against incorrect records | [CONFIRMED-CODE] Implemented |
| **Due Diligence** | Automated pre-purchase checklist aggregating all parcel intelligence | [CONFIRMED-CODE] Implemented |
| **Profile** | Manage citizen profile, preferences, and notification settings | [CONFIRMED-CODE] Implemented |

### 7.2 Government-Facing

| Capability | Description | Status |
|-----------|-------------|--------|
| **Role-Based Dashboards** | 7 distinct role workspaces with tailored metrics and actions | [CONFIRMED-CODE] Implemented |
| **Work Queue** | Pending tasks organized by priority, SLA, and jurisdiction | [CONFIRMED-CODE] Implemented |
| **Mutation Management** | Review, verify, notice, hear, approve/reject mutation cases | [CONFIRMED-CODE] Implemented |
| **Parcel Management** | View, search, and manage parcel records within jurisdiction | [CONFIRMED-CODE] Implemented |
| **Case Management** | Revenue court cases, disputes, and hearing schedules | [CONFIRMED-CODE] Implemented |
| **Deed Verification** | SRO deed audit and registration verification | [CONFIRMED-CODE] Implemented |
| **Map / GIS** | Interactive cadastral map with parcel boundaries | [CONFIRMED-CODE] Implemented |
| **Analytics** | Role-appropriate drill-down dashboards | [CONFIRMED-CODE] Implemented |
| **Data Quality** | Cross-source conflict detection and data health monitoring | [CONFIRMED-CODE] Implemented |
| **Integrations** | External system integration status and health | [CONFIRMED-CODE] Implemented |
| **Audit Trail** | Hash-chained, append-only event log viewer | [CONFIRMED-CODE] Implemented |
| **User Management** | Admin-only: role provisioning, user lifecycle | [CONFIRMED-CODE] Implemented |
| **System Health** | Admin-only: system monitoring and telemetry | [CONFIRMED-CODE] Implemented |

### 7.3 Public-Facing

| Capability | Description | Status |
|-----------|-------------|--------|
| **Landing Page** | Public information about the platform | [CONFIRMED-CODE] Implemented |
| **About / Services / Schemes** | Government services and schemes information | [CONFIRMED-CODE] Implemented |
| **Public Search** | Basic parcel search without authentication | [CONFIRMED-CODE] Routes exist |
| **Help / Contact** | Support and contact information | [CONFIRMED-CODE] Implemented |

---

## 8. Complete Product Scope

### 8.1 In Scope (Current Product)

- Parcel-centric land information platform
- Citizen portal with self-service land record access
- Government operations portal with 7 role workspaces
- e-Ferfar mutation workflow (12-state machine)
- Parcel 360° composite title dossier
- Citizen application submission and tracking
- Document management and digital locker
- Watchlist and alert system
- Grievance filing and tracking
- Notification engine
- PostGIS-backed spatial data
- Interactive cadastral mapping (Leaflet/React-Leaflet)
- RBAC + jurisdiction-based authorization
- Hash-chained audit trail
- Analytics dashboards (tehsil → district → state → national)
- Supabase Auth integration (citizen OTP + government email/password)
- UX4G Design System compliance

### 8.2 Not in Scope (Boundaries)

| Excluded | Rationale |
|----------|-----------|
| Replacement of state RoR systems (Bhulekh, Bhoomi, BhuNaksha) | LAND-STACK reads and projects from state systems; it does not replace them |
| Centralized national land database | Data sovereignty remains with states; LAND-STACK stores projections with provenance |
| Statutory authority | Software does not approve mutations or determine ownership |
| AI/ML decision-making | All AI outputs are advisory only; officers decide |
| Blockchain | PostgreSQL with hash-chained audit trail provides tamper evidence |
| Mobile native apps (iOS/Android) | Web PWA is the current delivery method |
| Payment gateway integration | Redirect to state portals for payments |

### 8.3 Long-Term Product Direction

**[PROPOSED]** based on DILRMP 3.0 alignment and project documentation:

1. **State Adapter Architecture**: Configuration-driven adapters for each state's terminology, hierarchy, and API integration
2. **Real OTP/SMS Gateway**: Replace demo OTP (`123456`) with production SMS gateway
3. **DigiLocker Integration**: Direct integration for certified document storage and retrieval
4. **NGDRS Webhook Integration**: Automated mutation case creation from deed registration events
5. **AI Land Intelligence**: Advisory anomaly detection, SLA prediction, bottleneck analysis
6. **Document Intelligence**: OCR, classification, metadata extraction for uploaded documents
7. **Multi-language Support**: Regional language interfaces per state
8. **Offline/Low-Bandwidth Mode**: PWA with service worker caching for rural access
9. **Survey/GIS Workspace**: Dedicated frontend for cadastral survey officers
10. **ULB Urban Workspace**: Dedicated frontend for urban local body officers

---

## 9. Important Product Decisions

| Decision | Source | Rationale |
|----------|--------|-----------|
| **ULPIN as universal key** | [CONFIRMED-RESEARCH] DILRMP 3.0 mandate | Every parcel interaction anchors on the 14-digit ULPIN |
| **Dual portals, shared backend** | [CONFIRMED-CODE] App.jsx routes | Citizen and Government are two experience planes sharing the same database and API layer |
| **Supabase PostgreSQL, not custom DB** | [CONFIRMED-CODE] Backend config | Managed PostgreSQL with built-in Auth, RLS, and realtime capabilities |
| **PostGIS for spatial data** | [CONFIRMED-CODE] schema.sql `CREATE EXTENSION postgis` | Enables geometry storage, spatial queries, and GeoJSON generation |
| **HttpOnly cookie sessions** | [CONFIRMED-CODE] API client uses `credentials: 'include'` | Secure session management without localStorage token exposure |
| **12-state mutation workflow** | [CONFIRMED-CODE] mutation.statemachine.js | Comprehensive workflow covering initiation through RoR update with objection and hearing branches |
| **Permission-based authorization** | [CONFIRMED-CODE] core/permissions.js | 40+ atomic permissions mapped to roles, replacing scattered role checks |
| **No mock fallback in production** | [CONFIRMED-CODE] supabase.js `isMockMode() → false` | All runtime data comes from the database |
| **UX4G Design System** | [CONFIRMED-CODE] Design.md | Government of India official design system for digital services |

---

## 10. Standards Compliance

| Standard | Application |
|----------|-------------|
| **LADM (ISO 19152:2012)** | Data model: Party → RRR (Rights, Restrictions, Responsibilities) → Spatial Unit |
| **ULPIN (Bhu-Aadhaar)** | 14-digit unique land parcel identifier as the universal key |
| **DILRMP 3.0 (2026-2031)** | GIS-enabled land stack with interoperable APIs and citizen service delivery |
| **MLRC Sections 148-154** | e-Ferfar mutation workflow compliance (Maharashtra context) |
| **UX4G Design System 3.0** | Government digital service UI components and tokens |
| **DPDP Act 2023** | Data protection: consent engine, purpose limitation, data minimization, no raw Aadhaar |
| **CERT-In Guidelines** | Session management, vulnerability management, incident reporting |
| **WGS84 (EPSG:4326)** | Coordinate reference system for spatial data |

---

*This document defines the product. All other documentation must be consistent with it.*
