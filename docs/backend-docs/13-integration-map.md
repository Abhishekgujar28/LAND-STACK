# Land Stack — Integration Map

**Version**: 1.0 | **Date**: September 2026
**Reference**: [DEPARTMENT_INTEGRATION_MATRIX.md](../../docs/DEPARTMENT_INTEGRATION_MATRIX.md)

---

## 1. The Integration Challenge

Land Stack doesn't own any land data. It reads from 9+ external government systems, each run by a different department, each with different APIs, formats, auth methods, and reliability characteristics. Our backend must connect to all of them gracefully — and handle failures without crashing.

---

## 2. The State Adapter Pattern (Adapted for Express + Supabase)

The original architecture describes a `StateAdapterRegistry` with `IStateAdapter` interfaces. We keep this pattern but implement it as Express service modules:

### How It Works

Each state gets an adapter module in Express that:
1. **Accepts a canonical request** (e.g., "fetch RoR for parcel with ULPIN X in state MH")
2. **Translates to state-specific request** (e.g., call Mahabhulekh API with Survey Number, using MH's API key and format)
3. **Receives state-specific response** (e.g., 7/12 data in Mahabhulekh's JSON schema)
4. **Transforms to canonical model** (e.g., maps `maal_no` → `survey_number`, `guntha` → `sq.m`, adds provenance)
5. **Stores as projection** in Supabase with full provenance metadata

### Configuration-Driven

Each state's configuration lives in the `state_config` table:
- **Terminology**: Maps state terms to canonical labels ("7/12 Extract" → "RoR Projection")
- **Identifiers**: Valid identifier types per state (Survey No, Gat No, Khasra No, etc.)
- **Hierarchy**: Administrative levels (State → Division → District → Taluka → Village for MH; State → District → Taluk → Hobli → Village for KA)
- **Units**: Area unit conversions (1 Guntha = 101.17 sq.m; 1 Cent = 40.47 sq.m)
- **Data sources**: API endpoints, auth methods, timeouts, rate limits

Adding a new state = inserting rows in state_config. No code deployment needed if the state's API follows patterns already supported.

---

## 3. External System Integrations

### 3.1 State RoR / Bhulekh Systems — READ ONLY

| Aspect | Detail |
|---|---|
| **What it provides** | Ownership records, rights, area, classification, mutation history |
| **Direction** | Land Stack ← State RoR |
| **For demo** | Mock Adapter returns deterministic fixtures |
| **For production** | REST/SOAP consumers per state |
| **Failure handling** | Circuit breaker: open after 5 consecutive failures. Serve cached projection with staleness warning. |
| **Freshness target** | < 24 hours for active parcels |

### 3.2 NGDRS / State Registration — WEBHOOK

| Aspect | Detail |
|---|---|
| **What it provides** | Deed registration events (sale, gift, mortgage, lease) |
| **Direction** | NGDRS → Land Stack (webhook push) |
| **Endpoint** | `POST /api/v1/webhooks/ngdrs/registration` |
| **Auth** | HMAC-SHA256 signature verification |
| **Key behavior** | Receiving a registration event automatically creates a mutation case |
| **Idempotency** | Deduplicate on `deed_number + sro_code` |
| **Failure handling** | Failed webhook processing → dead-letter queue for manual retry |

### 3.3 BhuNaksha / State GIS — READ ONLY

| Aspect | Detail |
|---|---|
| **What it provides** | Cadastral parcel boundaries (vector polygons) |
| **Direction** | Land Stack ← BhuNaksha |
| **Protocol** | WMS/WFS for tiles; GeoJSON/Shapefile for vector data |
| **Storage** | Geometry ingested into PostGIS `spatial_unit` table |
| **Validation** | ST_IsValid, ST_MakeValid, area threshold |
| **Freshness target** | < 7 days for cadastral tiles |

### 3.4 ULPIN Registry — BIDIRECTIONAL

| Aspect | Detail |
|---|---|
| **What it provides** | ULPIN ↔ state parcel identifier mapping |
| **Direction** | Bidirectional lookup |
| **Fallback** | If ULPIN not assigned, use state identifier and mark ULPIN as "pending" |

### 3.5 Revenue Courts (RCCMS / e-Courts) — READ ONLY

| Aspect | Detail |
|---|---|
| **What it provides** | Court case status, hearing dates, orders, injunctions |
| **Impact** | Court cases create restrictions on Parcel 360° |
| **Events produced** | `court_case.linked`, `court_order.issued` |

### 3.6 Town & Country Planning — READ ONLY

| Aspect | Detail |
|---|---|
| **What it provides** | Zoning, master plan land-use, FSI/FAR, building permission status |
| **Spatial** | Zone boundaries as PostGIS polygons; intersected with parcel boundaries |

### 3.7 Urban Local Bodies (Property Tax) — READ ONLY

| Aspect | Detail |
|---|---|
| **What it provides** | Property tax assessment, dues, payment status |
| **Stakeholder** | ULB/Municipal Officer role |

### 3.8 Restriction Layers (Forest, Tribal, CRZ) — READ ONLY

| Aspect | Detail |
|---|---|
| **What it provides** | Forest boundaries, tribal land, CRZ zones, environmental restrictions |
| **Spatial** | Restriction zones as PostGIS polygons; intersected with parcel boundaries |

### 3.9 Identity & Document Services

| System | Direction | Purpose |
|---|---|---|
| SMS Gateway | Land Stack → SMS | OTP delivery, notifications |
| Email Service | Land Stack → Email | Notifications |
| DigiLocker | Bidirectional | Document retrieval and verified storage (future) |

---

## 4. Mock vs Live Integrations

For the SIH demo and initial development, we mock all external systems:

| Integration | Demo Approach | Production Approach |
|---|---|---|
| State RoR | Mock Adapter returning scenario fixtures (clean, disputed, encumbered) | REST/SOAP consumers per state |
| NGDRS | Mock webhook sender simulating deed registrations | Real NGDRS webhook integration |
| BhuNaksha | Pre-loaded GeoJSON geometry in PostGIS | WMS/WFS ingestion pipeline |
| ULPIN | Pre-assigned ULPINs for mock parcels | ULPIN Registry API |
| Courts | Pre-loaded court cases in database | RCCMS / e-Courts API |
| Planning/Tax | Pre-loaded zoning and tax data | REST API consumers |
| SMS | Console logging (no actual SMS sent) | Production SMS gateway |

The mock adapter returns **deterministic scenarios** so that every demo is reproducible:
- `ULPIN-CLEAN-001`: A clean parcel with no issues
- `ULPIN-DISPUTED-002`: A parcel with an active court dispute
- `ULPIN-ENCUMBERED-003`: A parcel with a bank mortgage
- `ULPIN-AREA-MISMATCH-004`: A parcel where RoR area ≠ geometry area
- `ULPIN-TIMEOUT-005`: Simulates a state API timeout (tests circuit breaker)

---

## 5. Failure Handling

External government systems are not always reliable. Our failure handling strategy:

### Circuit Breaker Pattern
Each state adapter has a circuit breaker:
- **Closed** (normal): Requests go through to the external system
- **Open** (failing): After 5 consecutive failures, the circuit opens. Requests immediately return the last cached projection with a staleness warning. No calls to the external system.
- **Half-Open** (testing): After a timeout (e.g., 60 seconds), a single test request is sent. If it succeeds, the circuit closes. If it fails, it stays open.

### Cached Fallback
When a state system is down, we serve the last successful projection from our database. The response includes a freshness indicator so the user knows the data may be outdated.

### Dead-Letter Queue
Webhook events that fail processing are stored in a dead-letter table for manual inspection and retry by the System Administrator.

### Retry with Backoff
Failed API calls are retried with exponential backoff: 1s → 2s → 4s → 8s, max 3 retries.

---

## 6. Integration Health Monitoring

| Metric | What It Measures |
|---|---|
| Adapter uptime % | Percentage of successful calls per state per source |
| API response time P95 | 95th percentile response time per adapter |
| Circuit breaker status | Currently CLOSED, OPEN, or HALF-OPEN per adapter |
| Cache hit ratio | Percentage of requests served from cache vs live |
| Webhook receipt rate | Events received per hour from NGDRS |
| Dead-letter queue depth | Unprocessed failed events |
| Source freshness | Hours since last successful sync per state per source |

These metrics power the Integration Health dashboard visible to State PMU and System Administrator roles.

> *Reference: Integration specifications from [DEPARTMENT_INTEGRATION_MATRIX.md](../../docs/DEPARTMENT_INTEGRATION_MATRIX.md). Circuit breaker pattern from [architecture.md](../../docs/architecture.md) Section 4.3. Mock adapter scenarios from [phases.md](../../docs/phases.md) Phase 4.*

---

*Next: [14-architecture-diagram.md](./14-architecture-diagram.md) — The unified architecture diagram.*
