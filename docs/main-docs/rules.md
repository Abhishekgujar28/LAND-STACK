# Land Stack — Engineering Constitution (Rules)

**Version**: 3.0 | **Last Updated**: September 2026

**Purpose**: Inviolable engineering rules that every developer, AI agent, and code review must enforce. These are not guidelines — they are laws.

> **Implementation Note**: The platform uses **Express.js** and **Supabase** (Auth/Realtime). References to OPA and NestJS have been updated.

---

## R1: Data Sovereignty

### R1.1: Never Write to Authoritative Sources
Land Stack SHALL NOT write to, modify, or delete data in any State government system (Bhulekh, BhuNaksha, NGDRS, RCCMS, or any State Revenue/Registration database). Land Stack is a read-only consumer of authoritative data.

### R1.2: Store Projections, Not Originals
Every record in Land Stack's database is a **projection** — a derived, canonical representation of data from an authoritative source. The projection SHALL always carry provenance metadata. If the source updates, Land Stack re-projects.

### R1.3: State Systems Are Authoritative
When a conflict exists between Land Stack's projection and the State system, the State system is correct. Land Stack SHALL flag the conflict via the Data Quality Engine but SHALL NOT override the State data.

---

## R2: Statutory Authority

### R2.1: No Statutory Decisions in Code
Land Stack SHALL NOT approve, reject, sanction, or decide any statutory matter. Specifically:
- Mutation approval → Tehsildar's authority (Land Stack tracks status only)
- Deed registration → Sub-Registrar's authority (Land Stack receives event only)
- Court orders → Revenue Court's authority (Land Stack displays status only)
- Land classification change → Revenue Department's authority

### R2.2: AI Is Advisory Only
All AI/ML outputs SHALL be labeled `ADVISORY` or `SYSTEM_GENERATED`. No AI output SHALL be presented as `APPROVED`, `DECIDED`, or `SANCTIONED`. Officers can override any AI recommendation. Every AI output SHALL include contributing factors for explainability.

### R2.3: Legal Disclaimer Required
Every Parcel 360° view and every data display to a citizen SHALL include the non-dismissible disclaimer:

> *"This information is for reference only. Not a legal opinion or guarantee of title. Obtain certified copies from competent authority for legal purposes."*

---

## R3: Identity and Privacy

### R3.1: No Raw Aadhaar Storage
The system SHALL NEVER store a raw 12-digit Aadhaar number. Only UIDAI-issued tokens or SHA-256 hashes of Aadhaar are permitted. Aadhaar authentication SHALL be performed exclusively via UIDAI eKYC APIs.

### R3.2: PII Encryption at Rest
All Personally Identifiable Information SHALL be encrypted at rest with AES-256-GCM:
- Owner names (when linked to identity)
- Mobile numbers (SHA-256 hash; never stored in plaintext)
- Email addresses (SHA-256 hash)
- Aadhaar tokens (encrypted in vault)

### R3.3: Consent Before Processing
No citizen personal data SHALL be processed without explicit consent recorded in the consent engine. Consent records SHALL include: purpose, data scope, granted timestamp, expiry, revocability, and legal basis.

### R3.4: Purpose Limitation
Data collected for one purpose (e.g., "parcel_360_view") SHALL NOT be repurposed for another (e.g., "marketing") without separate consent.

---

## R4: State Adapter Architecture

### R4.1: No Hard-Coded State Logic
There SHALL be zero `if (state === 'MH')` or `switch(state)` blocks in the codebase for State-specific business logic. ALL State-specific behavior (terminology, hierarchy, units, data sources, schema mapping) SHALL be driven by the `state_config` metadata table/configuration.

### R4.2: Adapter Interface Contract
Every State adapter SHALL implement the same interface contract. Adding a new State SHALL require only configuration changes (no code deployment for the core platform).

### R4.3: Terminology Mapping
Display labels SHALL be resolved at runtime from the `state_config.terminology` JSONB field. Example:
- `terminology.parcel_id_label` → "Survey Number" (MH) / "Khasra Number" (UP)
- `terminology.village_officer` → "Talathi" (MH) / "Lekhpal" (UP)

---

## R5: Data Integrity

### R5.1: Provenance on Every Fact
Every data element displayed to a citizen SHALL carry provenance metadata:
- `authority`: which government body is legally authoritative
- `source_system`: which IT system the data was retrieved from
- `retrieval_time`: when fetched from the source
- `confidence_score`: composite reliability score (0.0 to 1.0)
- `freshness_score`: how recently verified against source

### R5.2: Bi-Temporal Modeling
All mutable entities SHALL use bi-temporal columns:
- `valid_from` / `valid_to`: when the fact was true in reality
- `system_from` / `system_to`: when recorded in Land Stack

No historical data SHALL be physically deleted — only soft-deleted via temporal boundaries.

### R5.3: Append-Only Audit Trail
The `audit_event` table SHALL be append-only. No UPDATE or DELETE operations SHALL be permitted on this table. Each audit event SHALL include a SHA-256 hash of its content and the hash of the previous event (hash chain) for tamper detection.

### R5.4: Idempotent Event Processing
All event consumers SHALL be idempotent. Processing the same event twice SHALL produce the same result. Events SHALL carry a unique `event_id` and consumers SHALL track processed IDs.

---

## R6: API Design

### R6.1: API Versioning
All public APIs SHALL be versioned: `/api/v1/...`. Breaking changes SHALL increment the major version. Old versions SHALL be supported for 12 months minimum.

### R6.2: Rate Limiting
Every API endpoint SHALL have rate limits configured per role:
- Citizen: 30–100 requests/min (endpoint-specific)
- Service-to-service: 1,000 requests/min
- Unauthenticated: 10 requests/min

### R6.3: Pagination
All list endpoints SHALL support cursor-based pagination. No endpoint SHALL return more than 100 items per page by default. Maximum page size SHALL be 500.

### R6.4: Error Responses
All error responses SHALL use a consistent envelope:
```json
{
  "error": {
    "code": "PARCEL_NOT_FOUND",
    "message": "No parcel found with ULPIN IN-MH-PU-0001-12345",
    "details": {},
    "correlation_id": "uuid",
    "timestamp": "ISO-8601"
  }
}
```

### R6.5: ULPIN as Path Parameter
When a route operates on a specific parcel, ULPIN SHALL be the path parameter: `/api/v1/parcels/{ulpin}/...`. Internal IDs (UUIDs) SHALL NOT be exposed in public APIs.

---

## R7: Security

### R7.1: TLS Everywhere
All HTTP communication SHALL use TLS 1.3. No plaintext HTTP is permitted in any environment (including development).

### R7.2: Service-to-Service Authentication
Internal service communication SHALL use mTLS with certificates managed by HashiCorp Vault. Certificate rotation SHALL occur every 90 days maximum.

### R7.3: JWT Lifecycle
- Access tokens: 15 minutes maximum
- Refresh tokens: 7 days maximum
- Citizen sessions: 30 minutes idle timeout; 24 hours maximum
- Officer sessions: 8 hours maximum; MFA for sensitive operations

### R7.4: Input Validation
All API inputs SHALL be validated against a schema (Zod validation in Express middleware). SQL queries SHALL use parameterized statements exclusively. No string concatenation for SQL.

### R7.5: CORS Policy
CORS SHALL be configured to allow only known frontend origins. Wildcard (`*`) origins are PROHIBITED in staging and production.

---

## R8: Geospatial

### R8.1: SRID 4326
All geometries SHALL be stored in SRID 4326 (WGS 84). Projections for display or area calculation SHALL be done dynamically (e.g., UTM zone for accurate area).

### R8.2: Geometry Validation
All incoming geometries SHALL be validated for:
- Validity (ST_IsValid)
- No self-intersections
- Minimum area threshold (> 1 sq. m)
- Maximum vertex count (< 10,000 for web display)

### R8.3: Raster vs Vector
Satellite imagery and orthophotos SHALL be stored as Cloud Optimized GeoTIFF (COG) on object storage. They SHALL NOT be stored in PostgreSQL. PostGIS SHALL only contain vector cadastral geometry.

### R8.4: Tile Caching
Vector tiles SHALL be cached with a TTL appropriate to the data update frequency (cadastral: 24h; satellite: 7d). Cache invalidation SHALL be triggered by data update events.

---

## R9: Testing

### R9.1: No Untested Database Migrations
Every database migration SHALL have a corresponding rollback migration. Migrations SHALL be tested in CI before deployment.

### R9.2: Adapter Contract Tests
Every State adapter SHALL have contract tests that verify it correctly translates State-specific data into the canonical model. Mock data for at least 3 States (MH, TN, UP) SHALL be maintained.

### R9.3: Integration Tests for Event Flows
Every event-driven flow (registration → mutation → RoR update → notification) SHALL have end-to-end integration tests.

---

## R10: Code Organization

### R10.1: Module Boundaries
Each Express router/module SHALL encapsulate a single bounded context. Cross-module communication SHALL use defined service interfaces, not direct repository access. Module A SHALL NOT import Module B's repository.

### R10.2: Configuration Over Code
Feature flags, State-specific behavior, workflow definitions, and notification templates SHALL be stored in configuration (database or config files), not in application code.

### R10.3: No Business Logic in Controllers
Controllers SHALL only handle HTTP concerns (request parsing, validation, response formatting). Business logic SHALL reside in service classes. Database queries SHALL reside in repository classes.

### R10.4: Logging Standards
All log entries SHALL be structured JSON with: `timestamp`, `level`, `service`, `correlation_id`, `message`, and relevant context fields. No `console.log` in production code.

---

## R11: Multi-Role Authorization & Jurisdiction Isolation

### R11.1: Strict Geographic Boundary Enforcement
Every API request originating from a government user SHALL be evaluated by Express Middleware (`requireJurisdiction`) against the user's assigned jurisdiction (State → District → Sub-Division → Tehsil → Circle → Village). No government user SHALL be permitted to view, update, verify, or act on parcels or workflow cases located outside their authorized geographic boundary, unless assigned an explicit multi-jurisdiction role (e.g., State PMU, Auditor).

### R11.2: Separation of Platform Actions from Statutory Authority
Land Stack SHALL maintain a strict semantic separation between:
1. **Platform Workflow Actions**: Data entry, checklist completion, digital document upload, draft recommendation generation.
2. **Statutory Decisions**: Sanction of mutation by Tehsildar, registration by Sub-Registrar, judicial stay by Revenue Court.
Platform software SHALL NOT simulate or automate statutory authority decisions.

### R11.3: Centralized Policy Engine (No Ad-Hoc Guards)
Authorization policies SHALL be declared centrally in Express middleware (`requireRole`, `requirePermission`, `requireJurisdiction`). Application controllers and services SHALL NOT implement ad-hoc role checking logic via hardcoded `if (user.role === 'admin')` statements within business logic.

---

## R12: Dual Experience Plane Separation

### R12.1: Experience Plane Boundary
Land Stack SHALL maintain strict separation between the Citizen / Public Experience Plane and the Government / Institutional Operations Plane. Citizen endpoints and officer endpoints SHALL use distinct route namespaces (`/api/v1/citizen/...` and `/api/v1/govt/...`).

### R12.2: Internal Deliberation Protection
Internal officer notes, inter-departmental verification communications, field investigator draft recommendations, and fraud risk scores SHALL NEVER be serialized or exposed in citizen-facing API responses.

---

## R13: AI Land Intelligence & Advisory Governance

### R13.1: Mandatory Advisory Labeling
Every output produced by an AI or machine learning model SHALL be explicitly labeled `ADVISORY`. No AI output SHALL be presented to any user or system as an authoritative determination, legal title confirmation, or approved order.

### R13.2: Explainability & Attribution
Every AI advisory recommendation (anomaly flag, SLA prediction, parcel intelligence summary) SHALL include:
- Contributing factors / explanatory rationale.
- Confidence score (decimal between 0.00 and 1.00).
- Model identifier and version.
- Retrieval timestamp and references to source data.

### R13.3: Officer Override & Dismissal Auditing
An authorized government officer SHALL have the explicit capability to override, reject, or dismiss any AI recommendation. Any such dismissal action SHALL be recorded in the append-only `audit_event` log with the officer's ID, timestamp, and mandatory justification note.

### R13.4: DPDP Compliance for AI Prompts
No Personally Identifiable Information (PII) including unmasked names, raw phone numbers, or tokenized identity hashes SHALL be transmitted to third-party or external Large Language Model APIs. An anonymization filter SHALL strip all PII prior to model inference.

---

## R14: Analytics, MIS & Operational Truth

### R14.1: Traceable Metrics
Every metric, KPI card, and choropleth value displayed on the National, State, or District PMU dashboards SHALL be directly traceable to either:
1. Verified operational workflow events recorded in the database.
2. Direct telemetry from external State adapter endpoints.
3. Official DILRMP guideline benchmarks.
Dashboards SHALL NOT display simulated or ungrounded statistical approximations.

### R14.2: Classification Transparency
All MIS dashboards SHALL clearly distinguish between:
- **Authoritative System Metrics** (e.g., officially published State RoR computerization rates).
- **Platform Operational Metrics** (e.g., Land Stack-tracked mutation SLA compliance).
- **Proposed Innovation Metrics** (e.g., automated Data Quality Index).

---

## R15: Document Intelligence & Integrity

### R15.1: Cryptographic Integrity of Ingested Documents
Every digital document (sale deed, 7/12 extract, court order, field photograph) uploaded to Land Stack SHALL be hashed with SHA-256 upon receipt. The resulting hash, file size, MIME type, and upload provenance SHALL be immutably stored in the database.

### R15.2: OCR Text Verification Gate
Text, survey numbers, and owner names extracted via Optical Character Recognition (OCR) or document parsing models SHALL remain in an `UNVERIFIED_EXTRACT` status until confirmed or corrected by an authorized officer or citizen applicant. Unverified OCR data SHALL NOT trigger automated record updates.

