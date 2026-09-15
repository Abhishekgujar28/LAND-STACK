# Land Stack — Master Architecture Document

**Version**: 3.0 | **Last Updated**: September 2026  
**Architectural Thesis**: Parcel-Centric Federated Governance Intelligence and Workflow Mesh  
**Aligned With**: DILRMP 3.0 (2026–2031), ISO 19152 LADM  
**See Also**: [Product Vision](./00-product-vision.md) | [PRD](./01-prd.md) | [Government Portal Architecture](./GOVERNMENT_PORTAL_ARCHITECTURE.md)

> **Implementation Note**: This document describes the target architecture. The current implementation uses **Express.js + Supabase (PostgreSQL/PostGIS/Auth/Storage)** as the core stack. Components marked `[Planned]` or `[Architecturally Defined]` are not yet implemented. See `docs/backend-docs/01-architecture-overview.md` for the current implementation architecture.

---

## 1. Architecture Overview

### 1.1 What Land Stack Is

Land Stack is a **parcel-centric federated Digital Public Infrastructure and governance intelligence platform** that connects India's fragmented State land governance systems into a unified platform serving **two experience planes**: a Citizen Portal and a Government Operations Portal.

It provides:
- **Parcel Identity Resolution**: mapping heterogeneous State identifiers (Survey No, Khasra No, Patta No, CTS No) to a single canonical identity via ULPIN
- **Data Aggregation**: assembling 10+ data layers (ownership, map, encumbrances, restrictions, zoning, tax, court cases) for a single parcel from multiple government sources
- **Dual Experience Planes**: Citizen PWA for public access + Government Portal with explicit role selection across 13 administrative roles (organized into Rural, Urban, Shared GIS, and Monitoring domains)
- **Workflow Orchestration**: routing and tracking long-running government processes (mutation, survey, planning, court) with SLA monitoring, work queues, and escalation
- **Schemes & Financial Discovery**: bridging land context to potential government subsidies and institutional credit
- **Event Propagation**: connecting cross-department data flows (registration → mutation → RoR update → citizen notification)
- **AI Land Intelligence**: advisory anomaly detection, SLA prediction, parcel summaries, executive intelligence (see [AI Architecture](./AI_INTELLIGENCE_ARCHITECTURE.md))
- **Analytics & MIS**: drill-down dashboards from National to Parcel level (see [Analytics](./ANALYTICS_MIS.md))
- **Data Quality Detection**: identifying conflicts, gaps, and staleness across data sources with transparent health scoring
- **Trust Through Provenance**: source attribution for every data element displayed to citizens and officers

### 1.2 What Land Stack Is NOT

- NOT a replacement for Bhulekh, Bhoomi, BhuNaksha, NGDRS, RCCMS, or any State system
- NOT a centralized national land database — it stores projections, not originals
- NOT a system that makes statutory decisions — Tehsildars approve mutations, not software
- NOT an AI decision-maker — all AI outputs are labeled ADVISORY; officers decide
- NOT a blockchain — PostgreSQL with hash-chained audit trail provides tamper evidence without the trade-offs

### 1.3 Core Architectural Principles

| # | Principle | Implementation |
|---|----------|---------------|
| 1 | **Parcel-Centric** | Every interaction anchored to a land parcel; ULPIN is the universal key |
| 2 | **Federated, Not Centralized** | State data sovereignty respected; Land Stack federates via adapters |
| 3 | **Projections, Not Originals** | Every record is a derived projection with provenance metadata |
| 4 | **Configuration Over Code** | State-specific behavior driven by metadata, not code branches |
| 5 | **Events Over Polling** | Cross-department integration via event-driven architecture |
| 6 | **Trust Through Transparency** | Every fact includes source, authority, freshness, and confidence |
| 7 | **AI Advisory, Never Decision** | AI/ML outputs labeled ADVISORY; officers decide |

---

## 2. System Context

### 2.1 System Context Diagram

```mermaid
graph TB
    subgraph "Experience Planes"
        CIT["👤 Citizen Land Owner<br/>React PWA / Mobile Browser"]
        GOV["🏛️ Government Officers (13 Roles)<br/>Operations Portal (Rural/Urban/GIS/Monitor)"]
        PMU["📊 PMU, Collector & DoLR<br/>Executive Command Center"]
    end

    subgraph "API Layer"
        EXPRESS["Express.js API Server<br/>Routes + Middleware + Business Logic"]
        MW["Middleware Chain<br/>requireAuth → requireRole → requirePermission → requireJurisdiction"]
    end

    subgraph "Express Domain Modules"
        AUTH["Auth Module<br/>Login, OTP, JWT Cookies"]
        PARCEL["Parcel Module<br/>ULPIN, Search, Parcel 360"]
        MUTATION["Mutation Module<br/>12-State Workflow Engine"]
        GIS_MOD["GIS Module<br/>PostGIS Spatial Queries"]
        CASE["Case Module<br/>Work Queues, Dossier"]
        ANALYTICS_MOD["Analytics Module<br/>National → Tehsil Drill-down"]
        AUDIT_MOD["Audit Module<br/>Append-Only Event Log"]
        NOTIF["Notification Module<br/>In-App Alerts"]
    end

    subgraph "Supabase Platform"
        SUPA_AUTH["Supabase Auth<br/>JWT Lifecycle, OTP, Token Refresh"]
        SUPA_DB["Supabase PostgreSQL + PostGIS<br/>30+ Tables, RLS Policies"]
        SUPA_STORAGE["Supabase Storage<br/>Documents, Photos, Deeds"]
        SUPA_RT["Supabase Realtime<br/>Live Mutation Status [Planned]"]
    end

    subgraph "State Adapter Layer [Architecturally Defined]"
        ADAPTER_REG["State Adapter Registry<br/>Configuration-Driven"]
    end

    subgraph "Authoritative Government Systems (External)"
        STATE_ROR["State RoR Systems<br/>Mahabhulekh, Bhoomi, Bhulekh"]
        BHUNAKSHA["BhuNaksha<br/>Cadastral Maps (WMS/WFS)"]
        NGDRS["NGDRS<br/>Registration / Webhooks"]
        RCCMS["RCCMS / e-Courts<br/>Revenue + Civil Courts"]
    end

    CIT --> EXPRESS
    GOV --> EXPRESS
    PMU --> EXPRESS
    EXPRESS --> MW
    MW --> AUTH
    MW --> PARCEL
    MW --> MUTATION
    MW --> GIS_MOD
    MW --> CASE
    MW --> ANALYTICS_MOD
    MW --> AUDIT_MOD
    MW --> NOTIF

    AUTH --> SUPA_AUTH
    PARCEL --> SUPA_DB
    MUTATION --> SUPA_DB
    GIS_MOD --> SUPA_DB
    CASE --> SUPA_DB
    ANALYTICS_MOD --> SUPA_DB
    AUDIT_MOD --> SUPA_DB
    NOTIF --> SUPA_DB
    PARCEL --> SUPA_STORAGE

    ADAPTER_REG --> STATE_ROR
    ADAPTER_REG --> BHUNAKSHA
    ADAPTER_REG --> NGDRS
    ADAPTER_REG --> RCCMS
```

---

## 3. Domain Architecture

### 3.1 Architecture Decision: Modular Monolith

Land Stack is built as an **Express.js modular monolith** — a single deployable Node.js application with clear internal module boundaries. This is deliberately chosen over microservices because:

| Factor | Modular Monolith | Microservices |
|--------|------------------|---------------|
| **Development velocity** | Single codebase; fast iteration | Coordinated multi-repo deployments |
| **Operational complexity** | One deployment; one CI/CD pipeline | 10+ pipelines, service discovery, mesh |
| **Transactional integrity** | Single database; ACID transactions | Distributed transactions; eventual consistency |
| **Debugging** | Single process; stack traces | Distributed tracing across services |
| **Team size fit** | Small/medium team | Large teams with service ownership |
| **Extraction path** | Modules → services when needed | Already distributed (may be premature) |

**Migration path**: When a module's scale demands independent deployment (e.g., GIS saturating CPU, notifications requiring independent scaling), extract it to its own service. The module interface becomes the service API contract.

### 3.2 Domain Modules

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│                     Express.js Modular Monolith (Core Engine)                     │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  IDENTITY & ACCESS [Implemented]        CORE PARCEL DOMAIN [Implemented]           │
│  ┌──────────────────┐ ┌──────────────────┐   ┌──────────────────┐ ┌──────────────────┐ │
│  │ Auth Module      │ │ Jurisdiction     │   │ Parcel Module    │ │ Parcel 360 Agg │ │
│  │ • Supabase Auth  │ │ Module           │   │ • ULPIN search   │ │ • 9-table merge │ │
│  │ • JWT cookies    │ │ • States/Dist/   │   │ • Multi-ID index │ │ • Data health   │ │
│  │ • MFA step-up    │ │   Tehsil/Village │   │ • Owner search   │ │ • Dual mode     │ │
│  └──────────────────┘ └──────────────────┘   └──────────────────┘ └──────────────────┘ │
│  ┌──────────────────┐ ┌──────────────────┐                                             │
│  │ • OCR parsing    │ │ • Ordered topics │   │ • PMU Choropleth │ │ • Hash-chained   │ │
│  │ • Classification │ │ • Dead-letter q  │   │ • DILRMP KPIs    │ │ • Full lineage   │ │
│  └──────────────────┘ └──────────────────┘   └──────────────────┘ └──────────────────┘ │
│                                                                                        │
│  INTEGRATION HUB                                                                       │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐ │
│  │ State Adapter Registry (Configuration-Driven via state_config)                   │ │
│  │ • Terminology resolver  • Dynamic schema mapper  • Unit conversion engine         │ │
│  │ • Circuit breakers      • Resilience & caching   • Webhook signature verifier    │ │
│  └──────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```
```

### 3.3 Module Communication Rules

| Rule | Description |
|------|------------|
| **No cross-module repository access** | Module A cannot import Module B's database repositories. Communication is through Module B's exported service interface. |
| **Synchronous for reads** | Parcel 360 calls RoR Module's service synchronously within the same process. |
| **Asynchronous for events** | When a mutation status changes, the Workflow Module publishes an event; the Notification Module consumes it asynchronously via Kafka/Redis Streams. |
| **Shared nothing** | Each module owns its database tables. No shared tables across modules. Shared types (DTOs, enums) live in a `common/` package. |

---

## 4. State Adapter Architecture

### 4.1 Design Philosophy

India has 36 States/UTs with radically different land systems. The State Adapter Registry solves this through **configuration-driven adaptation**, not code-branched logic.

### 4.2 Adapter Architecture Diagram

```mermaid
graph TD
    subgraph "Land Stack Core"
        CORE["Core Service<br/>(works with canonical model)"]
    end

    subgraph "Adapter Registry"
        REG["State Adapter Registry<br/>• Loads state_config on boot<br/>• Resolves adapter by state_code<br/>• Caches config in Redis"]
    end

    subgraph "Adapter Interface Contract"
        IFACE["IStateAdapter Interface<br/>───────────────────<br/>fetchRoR(parcelRef)<br/>fetchGeometry(parcelRef)<br/>fetchEncumbrances(parcelRef)<br/>resolveIdentity(stateId)<br/>fetchRegistrations(parcelRef)<br/>getHierarchy(level, parentCode)<br/>───────────────────<br/>Returns: CanonicalModel + Provenance"]
    end

    subgraph "State Implementations"
        MH_A["Maharashtra Adapter<br/>───────────────────<br/>Maps: 7/12 → CanonicalRoR<br/>Maps: Survey/Gat → ParcelId<br/>Maps: Guntha → sq.m<br/>API: Mahabhulekh + IGR<br/>Auth: API Key + OAuth"]
        KA_A["Karnataka Adapter<br/>───────────────────<br/>Maps: RTC → CanonicalRoR<br/>Maps: Survey/Hissa → ParcelId<br/>Maps: Guntha → sq.m<br/>API: Bhoomi + Kaveri<br/>Auth: API Key"]
        TN_A["Tamil Nadu Adapter<br/>───────────────────<br/>Maps: Patta → CanonicalRoR<br/>Maps: Survey/Subdiv → ParcelId<br/>Maps: Cent → sq.m<br/>API: PattaChitta + TNReginet<br/>Auth: OAuth 2.0"]
        MOCK["Mock Adapter<br/>───────────────────<br/>Returns synthetic data<br/>Simulates latency (200-500ms)<br/>Simulates errors (5%)<br/>Same interface as production"]
    end

    CORE --> REG
    REG --> IFACE
    IFACE --> MH_A
    IFACE --> KA_A
    IFACE --> TN_A
    IFACE --> MOCK
```

### 4.3 What the Adapter Handles

| Responsibility | Implementation |
|----------------|---------------|
| **Terminology translation** | `state_config.terminology` maps State terms to canonical labels |
| **Identifier mapping** | `state_config.identifier_types` lists valid ID types per State |
| **Schema translation** | `state_config.schema_mapping` maps State API fields to canonical model |
| **Unit conversion** | `state_config.area_units.conversions` provides multipliers to sq.m |
| **Hierarchy resolution** | `state_config.hierarchy` defines admin levels for dropdown population |
| **API client** | `state_config.data_sources` defines endpoints, auth, timeouts |
| **Error handling** | Circuit breaker per State; fallback to cached projection |
| **Rate limiting** | Per-State rate limits respecting source system capacity |

### 4.4 Adding a New State

Adding support for a new State requires ONLY:
1. Insert a `state_config` row with terminology, hierarchy, units, data sources
2. Map the State's API response fields to the canonical schema via `schema_mapping`
3. Configure authentication credentials in Vault
4. Run adapter contract tests with sample State data
5. **No code deployment required** if the State's API follows patterns already supported

---

## 5. Database Architecture

### 5.1 Storage Strategy

| Store | Technology | Purpose | Data |
|-------|-----------|---------|------|
| **Primary DB** | PostgreSQL 16 + PostGIS 3.4 | Relational + spatial + bi-temporal | Parcels, RoR, mutations, parties, geometry, audit |
| **Cache** | Redis 7 (Cluster) | Hot data cache; sessions; rate limiting | Parcel 360 projections (TTL 1h); session tokens; search suggestions |
| **Search Index** | OpenSearch 2.x | Full-text + geospatial search | Parcel names, owner names, addresses, ULPIN; geo_shape |
| **Object Storage** | S3 / MinIO | Binary files | Documents, satellite COGs, deed PDFs, field photos |
| **Event Log** | Kafka / Redis Streams | Durable event stream | Domain events with guaranteed ordering per ULPIN |

### 5.2 Entity Relationship Model

The canonical data model is based on **ISO 19152 LADM** (Land Administration Domain Model), extended for Indian land governance:

```mermaid
erDiagram
    PARCEL ||--o{ PARCEL_IDENTIFIER : "has many"
    PARCEL ||--|| SPATIAL_UNIT : "has one"
    PARCEL ||--o{ RIGHT : "has many"
    PARCEL ||--o{ ROR_PROJECTION : "has many versions"
    PARCEL ||--o{ REGISTRATION_TRANSACTION : "has many"
    PARCEL ||--o{ ENCUMBRANCE : "has many"
    PARCEL ||--o{ RESTRICTION : "has many"
    PARCEL ||--o{ MUTATION_CASE : "has many"
    PARCEL ||--o{ COURT_CASE : "has many"
    PARCEL ||--o{ DATA_QUALITY_ISSUE : "has many"
    PARCEL ||--o{ WATCHLIST : "watched by many"

    PARTY ||--o{ RIGHT : "holds many"
    PARTY ||--o{ REGISTRATION_TRANSACTION : "party to"

    RIGHT }o--|| PARTY : "held by"
    RIGHT }o--|| PARCEL : "over"

    MUTATION_CASE ||--o{ MUTATION_TIMELINE : "has events"
    MUTATION_CASE }o--|| REGISTRATION_TRANSACTION : "triggered by"

    CITIZEN ||--o{ WATCHLIST : "watches"
    CITIZEN ||--o{ NOTIFICATION : "receives"
    CITIZEN ||--o{ SERVICE_APPLICATION : "submits"

    PARCEL {
        uuid id PK
        varchar ulpin UK
        varchar state_code FK
        varchar land_classification
        decimal area_sqm
        varchar status
        jsonb metadata
        timestamp valid_from
        timestamp valid_to
        timestamp system_from
        timestamp system_to
    }

    SPATIAL_UNIT {
        uuid id PK
        uuid parcel_id FK
        geometry boundary "MULTIPOLYGON 4326"
        geometry centroid "POINT 4326"
        decimal area_calculated_sqm
        varchar source_system
        varchar coordinate_accuracy
    }

    PARTY {
        uuid id PK
        varchar name
        varchar name_local
        varchar party_type
        varchar gender
        varchar aadhaar_token_hash
        varchar mobile_hash
    }

    RIGHT {
        uuid id PK
        uuid parcel_id FK
        uuid party_id FK
        varchar right_type
        decimal share_percentage
        timestamp valid_from
        timestamp valid_to
        uuid provenance_id FK
    }

    ROR_PROJECTION {
        uuid id PK
        uuid parcel_id FK
        varchar state_ror_type
        jsonb canonical_fields
        jsonb raw_state_data
        varchar source_system
        uuid provenance_id FK
        timestamp projected_at
    }
```

### 5.3 Key Tables (Complete SQL)

```sql
-- ==========================================
-- PARCEL — Central entity
-- ==========================================
CREATE TABLE parcel (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ulpin               VARCHAR(14) UNIQUE,
    state_code          VARCHAR(2) NOT NULL,
    land_classification VARCHAR(30),
    area_sqm            DECIMAL(15,4),
    status              VARCHAR(20) NOT NULL DEFAULT 'active',
    metadata            JSONB DEFAULT '{}',
    
    -- Bi-temporal
    valid_from          TIMESTAMP NOT NULL DEFAULT NOW(),
    valid_to            TIMESTAMP DEFAULT 'infinity',
    system_from         TIMESTAMP NOT NULL DEFAULT NOW(),
    system_to           TIMESTAMP DEFAULT 'infinity',
    
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    version             INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX idx_parcel_ulpin ON parcel(ulpin);
CREATE INDEX idx_parcel_state ON parcel(state_code);

-- ==========================================
-- PARCEL_IDENTIFIER — Multi-ID resolution
-- ==========================================
CREATE TABLE parcel_identifier (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_id           UUID NOT NULL REFERENCES parcel(id),
    identifier_type     VARCHAR(30) NOT NULL,
    identifier_value    VARCHAR(100) NOT NULL,
    state_code          VARCHAR(2) NOT NULL,
    
    -- Administrative location
    district_code       VARCHAR(10),
    district_name       VARCHAR(100),
    sub_district_code   VARCHAR(10),
    sub_district_name   VARCHAR(100),
    village_code        VARCHAR(10),
    village_name        VARCHAR(100),
    
    -- Verification
    verification_status VARCHAR(20) DEFAULT 'unverified',
    confidence_score    DECIMAL(3,2) DEFAULT 0.00,
    
    is_primary          BOOLEAN DEFAULT FALSE,
    source_system       VARCHAR(100),
    
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    
    UNIQUE(identifier_type, identifier_value, state_code, village_code)
);

CREATE INDEX idx_pi_parcel ON parcel_identifier(parcel_id);
CREATE INDEX idx_pi_lookup ON parcel_identifier(state_code, identifier_type, identifier_value);

-- ==========================================
-- SPATIAL_UNIT — PostGIS geometry
-- ==========================================
CREATE TABLE spatial_unit (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_id           UUID NOT NULL REFERENCES parcel(id),
    
    boundary            GEOMETRY(MULTIPOLYGON, 4326) NOT NULL,
    centroid            GEOMETRY(POINT, 4326),
    area_calculated_sqm DECIMAL(15,4),
    perimeter_m         DECIMAL(12,2),
    
    coordinate_accuracy VARCHAR(20),
    source_system       VARCHAR(100) NOT NULL,
    survey_date         DATE,
    
    provenance_id       UUID,
    
    valid_from          TIMESTAMP NOT NULL DEFAULT NOW(),
    valid_to            TIMESTAMP DEFAULT 'infinity',
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    version             INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX idx_su_parcel ON spatial_unit(parcel_id);
CREATE INDEX idx_su_geom ON spatial_unit USING GIST(boundary);
CREATE INDEX idx_su_centroid ON spatial_unit USING GIST(centroid);

-- ==========================================
-- PROVENANCE — Source attribution
-- ==========================================
CREATE TABLE provenance (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    authority           VARCHAR(100) NOT NULL,
    source_system       VARCHAR(100) NOT NULL,
    source_record_id    VARCHAR(200),
    
    effective_time      TIMESTAMP,
    transaction_time    TIMESTAMP NOT NULL DEFAULT NOW(),
    retrieval_time      TIMESTAMP NOT NULL DEFAULT NOW(),
    
    version             VARCHAR(20),
    digital_signature   TEXT,
    signature_status    VARCHAR(20) DEFAULT 'none',
    
    transformation      TEXT[],
    confidence_score    DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    freshness_score     DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    
    parent_provenance_id UUID REFERENCES provenance(id),
    
    created_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==========================================
-- AUDIT_EVENT — Append-only, hash-chained
-- ==========================================
CREATE TABLE audit_event (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_time          TIMESTAMP NOT NULL DEFAULT NOW(),
    
    actor_type          VARCHAR(20) NOT NULL,
    actor_id            VARCHAR(100) NOT NULL,
    actor_role          VARCHAR(50),
    actor_ip            INET,
    
    action              VARCHAR(50) NOT NULL,
    resource_type       VARCHAR(50) NOT NULL,
    resource_id         UUID,
    resource_ulpin      VARCHAR(14),
    
    correlation_id      VARCHAR(100),
    change_type         VARCHAR(20),
    previous_value      JSONB,
    new_value           JSONB,
    
    result              VARCHAR(20) NOT NULL,
    
    event_hash          VARCHAR(64) NOT NULL,
    previous_hash       VARCHAR(64)
) PARTITION BY RANGE (event_time);

CREATE INDEX idx_audit_time ON audit_event(event_time);
CREATE INDEX idx_audit_actor ON audit_event(actor_id);
CREATE INDEX idx_audit_resource ON audit_event(resource_type, resource_id);
CREATE INDEX idx_audit_ulpin ON audit_event(resource_ulpin);
```

### 5.4 Scaling Strategy

| Technique | Applied To | When |
|-----------|-----------|------|
| **Read replicas** | PostgreSQL | When read load exceeds primary capacity |
| **Table partitioning** | `audit_event` (by month), `parcel` (by state_code) | From day one |
| **Connection pooling** | PgBouncer | From day one |
| **GIST spatial indexing** | `spatial_unit.boundary`, `.centroid` | From day one |
| **Redis caching** | Parcel 360 projections (TTL 1h), search suggestions | From day one |
| **OpenSearch sharding** | Search index per State | When index exceeds 50M documents |
| **Kafka partitioning** | By ULPIN (ensures per-parcel ordering) | From day one |

---

## 6. GIS Architecture

### 6.1 Spatial Data Pipeline

```mermaid
flowchart TD
    subgraph "Data Ingestion"
        BN["BhuNaksha WMS/WFS"] --> INGEST["GIS Ingestion Service"]
        SVAMITVA["SVAMITVA API"] --> INGEST
        SHAPEFILE["Shapefiles / GeoJSON"] --> INGEST
    end

    subgraph "Storage"
        INGEST --> VALIDATE["Geometry Validation<br/>ST_IsValid / ST_MakeValid<br/>Self-intersection check<br/>Area threshold (>1 sq.m)"]
        VALIDATE --> POSTGIS["PostGIS<br/>spatial_unit table<br/>GIST index<br/>SRID 4326"]
    end

    subgraph "Tile Serving"
        POSTGIS --> MARTIN["Martin Tile Server<br/>PostGIS-native MVT<br/>Rust performance<br/>Dynamic tile generation"]
        MARTIN --> CACHE["Redis / CDN Cache<br/>Cadastral tiles: TTL 24h<br/>Satellite: TTL 7d"]
    end

    subgraph "Spatial Queries"
        POSTGIS --> POINT_IN_POLY["Point-in-Polygon<br/>ST_Contains / ST_Intersects<br/>Map click → parcel"]
        POSTGIS --> NEARBY["Nearby Parcels<br/>ST_DWithin(centroid, 500m)"]
        POSTGIS --> ZONE_INTERSECT["Zone Intersection<br/>ST_Intersects(parcel, zone)<br/>Restriction overlay"]
        POSTGIS --> AREA_CALC["Area Calculation<br/>ST_Area with UTM projection<br/>Accurate sq.m"]
    end

    subgraph "Frontend Rendering"
        CACHE --> MAPLIBRE["MapLibre GL JS<br/>Vector tile rendering<br/>Interactive layers<br/>Click-to-select"]
    end
```

### 6.2 Geometry Management

| Concern | Solution |
|---------|---------|
| **Storage format** | MULTIPOLYGON in SRID 4326 (WGS 84) |
| **Indexing** | GIST index on boundary and centroid columns |
| **Validation** | `ST_IsValid(geom)` on all incoming geometry; auto-fix with `ST_MakeValid` |
| **Area calculation** | Dynamic UTM projection for accurate area: `ST_Area(ST_Transform(geom, utm_srid))` |
| **Map click** | `ST_Contains(boundary, ST_SetSRID(ST_MakePoint(lng, lat), 4326))` |
| **Nearby search** | `ST_DWithin(centroid, query_point, distance_meters)` using geography cast |
| **Zone overlap** | `ST_Intersects(parcel_boundary, zone_boundary)` for restriction/zoning overlay |
| **Tile generation** | Martin reads directly from PostGIS via SQL functions → MVT tiles |
| **Versioning** | Bi-temporal: `valid_from/valid_to` tracks geometry changes over time |
| **Topology** | Overlap detection: `ST_Overlaps(a.boundary, b.boundary)` run as DQ check |

### 6.3 Vector Tile Architecture

```
Client Request: GET /tiles/{z}/{x}/{y}.pbf
         │
         ▼
  CDN / Redis Cache (hit? → return cached tile)
         │ (miss)
         ▼
  Martin Tile Server
         │
         ▼
  PostGIS SQL Function:
    SELECT ST_AsMVT(q, 'parcels', 4096, 'geom')
    FROM (
      SELECT ST_AsMVTGeom(boundary, ST_TileEnvelope(z,x,y)) AS geom,
             ulpin, land_classification, status
      FROM spatial_unit su
      JOIN parcel p ON su.parcel_id = p.id
      WHERE boundary && ST_TileEnvelope(z,x,y)
    ) q
         │
         ▼
  MVT Binary Response → CDN Cache (TTL 24h) → Client
```

---

## 7. Event Architecture

### 7.1 Event Envelope Schema

```json
{
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "event_type": "registration.completed",
  "event_version": "1.0",
  "source_system": "ngdrs",
  "source_module": "webhook-listener",
  "state_code": "MH",
  "timestamp": "2026-08-15T10:30:00Z",
  "correlation_id": "req-abc-123",
  "causation_id": "webhook-xyz-789",
  "partition_key": "IN-MH-PU-0001-12345",
  "payload": {
    "deed_number": "PUN-2026-00456",
    "registration_date": "2026-08-15",
    "sro_code": "PUN-HAVELI-01",
    "deed_type": "sale",
    "seller_name": "Ramesh Kumar",
    "buyer_name": "Priya Sharma",
    "parcel_ref": { "survey_no": "45/2A", "village": "Wadgaon Sheri" },
    "consideration_amount": 5000000,
    "stamp_duty_paid": 350000
  },
  "metadata": {
    "retry_count": 0,
    "max_retries": 3,
    "dead_letter_after": 3
  }
}
```

### 7.2 Event Catalogue

| Event | Producer | Consumers | Trigger |
|-------|---------|-----------|---------|
| `registration.completed` | Webhook Listener | Workflow Module, Notification | NGDRS webhook |
| `mutation.created` | Workflow Module | Notification, Audit | Registration event consumed |
| `mutation.status_changed` | Workflow Module | Notification, DQ Module | State system update |
| `ror.updated` | Adapter sync | Parcel 360 cache, Watchlist, DQ | State RoR system change |
| `encumbrance.added` | Adapter sync | Watchlist, Notification | New encumbrance detected |
| `encumbrance.released` | Adapter sync | Watchlist, Notification | Encumbrance released |
| `restriction.added` | Adapter sync | Watchlist, Notification | New restriction detected |
| `court_case.linked` | Adapter sync | Watchlist, Notification | Court case linked to parcel |
| `data_conflict.detected` | DQ Module | Notification (officer) | Cross-source mismatch |
| `parcel.geometry_updated` | GIS Module | Tile cache invalidation | Geometry change |
| `watchlist.alert` | Watchlist Module | Notification | Watched parcel data changed |

### 7.3 Idempotency and Ordering

- **Ordering**: Events partitioned by ULPIN. All events for the same parcel are processed in order.
- **Idempotency**: Every consumer tracks processed `event_id` values. Duplicate events are detected and skipped.
- **Retry**: Failed events retried up to `max_retries` with exponential backoff.
- **Dead Letter**: After max retries, events move to a dead-letter topic for manual inspection.
- **Replay**: The full event log is retained for 90 days, enabling replay for new consumers or error recovery.

---

## 8. Security Architecture

### 8.1 Authentication Flows

```mermaid
sequenceDiagram
    participant C as Citizen Browser
    participant O as Govt Officer
    participant GW as API Gateway
    participant SUPA_CIT as Supabase Auth (Citizen)
    participant SUPA_GOV as Supabase Auth (Govt)
    participant API as Land Stack Core API

    Note over C,API: Flow 1: Citizen Mobile OTP Login
    C->>GW: POST /api/v1/auth/otp/send {mobile}
    GW->>SUPA_CIT: Send SMS OTP
    C->>GW: POST /api/v1/auth/otp/verify {mobile, otp}
    GW->>SUPA_CIT: Verify OTP
    SUPA_CIT->>GW: JWT Access (15m) + Refresh (7d)
    GW->>C: Set tokens

    Note over O,API: Flow 2: Government SSO + MFA Login
    O->>GW: GET /api/v1/govt/auth/login
    GW->>SUPA_GOV: Redirect to Jan Parichay / Govt SSO
    SUPA_GOV->>O: Challenge: Credentials + TOTP/SMS MFA
    O->>SUPA_GOV: Submit MFA
    SUPA_GOV->>GW: JWT with claims {role, department, state, jurisdiction}
    GW->>O: Set HTTP-only secure cookies

    Note over O,API: Flow 3: Authorized Government Request with Middleware
    O->>GW: GET /api/v1/govt/cases/pending [Bearer JWT]
    GW->>API: Evaluate claims against RBAC/Jurisdiction Middleware
    API->>GW: Filtered work queue (jurisdiction-scoped)
    GW->>O: Render workspace
```

### 8.2 Authorization Model (RBAC + ABAC + Jurisdiction)

Authorization is centrally enforced by Express Middleware (`requireRole`, `requirePermission`, `requireJurisdiction`) evaluating incoming identity claims against geographical jurisdictions and role permissions:

| Domain / Persona | Primary Role | Permitted Actions | Geographic Jurisdiction | Middleware Enforcement Rule |
|---|---|---|---|---|
| **Public / Citizen** | CITIZEN | `VIEW`, `SEARCH`, `APPLY`, `WATCH`, `DOWNLOAD` | Own parcels (Full), Public parcels (Summary) | `requireRole(['CITIZEN'])` + ownership check |
| **Rural Govt** | TALATHI | `VIEW`, `SEARCH`, `FIELD_VERIFY`, `UPLOAD_PHOTOS`, `RECOMMEND` | Assigned Village(s) / Circle | `requireJurisdiction(village_code)` |
| **Rural Statutory** | TEHSILDAR | `VIEW`, `REVIEW`, `HEARING`, `APPROVE`, `REJECT`, `ORDER` | Assigned Tehsil / Taluka | **Only role authorized to execute statutory `APPROVE` on rural mutations** |
| **Urban Govt** | ULB_OFFICER | `SEARCH`, `VIEW`, `URBAN_TAX_VIEW` | Municipal Limits | `requireJurisdiction(municipal_code)` |
| **Registration** | SRO | `SEARCH`, `VIEW`, `VERIFY_CONTEXT` | SRO Office Jurisdiction | Pre-registration parcel verification, restriction checks |
| **Monitoring** | COLLECTOR | `VIEW`, `SEARCH`, `DISTRICT_ANALYTICS`, `ESCALATE`, `REASSIGN` | Entire District | High-level appellate and administrative oversight |
| **Monitoring** | STATE_PMU | `VIEW`, `SEARCH`, `STATE_ANALYTICS`, `EXPORT` | Entire State (Read-only) | Full cross-district analytics and executive intelligence |
| **National Governance**| DoLR / National Monitor | `VIEW`, `EXPORT`, `NATIONAL_ANALYTICS` | National / All States (Read-only) | Cross-state benchmarking, DILRMP compliance |
| **Platform Ops** | System Administrator | `ADMIN`, `VIEW`, `EDIT`, `AUDIT`, `VERIFY_HASH` | Platform-wide | Platform config, state adapters, cryptographic audit log check |

### 8.3 Data Protection

| Layer | Implementation |
|-------|---------------|
| **Transport** | TLS 1.3 everywhere (including local dev) |
| **At rest** | AES-256 for database encryption; S3 server-side encryption |
| **Field-level** | AES-256-GCM for PII: Aadhaar token hash, mobile hash, name (when linked to identity) |
| **Key management** | HashiCorp Vault; 90-day key rotation |
| **Audit trail** | Append-only; SHA-256 hash chain; tamper-evident |
| **PII minimization** | No raw Aadhaar; no full mobile numbers displayed; hashed contact info |

---

## 9. Integration Architecture

### 9.1 Integration Patterns

```mermaid
flowchart TD
    subgraph "Synchronous (Request-Response)"
        A["Citizen searches parcel"] --> B["API Gateway"]
        B --> C["Parcel Identity Module"]
        C --> D["State Adapter"]
        D --> E["State RoR API<br/>(cached? → Redis)<br/>(miss? → API call)"]
        E --> F["Response with provenance"]
    end

    subgraph "Asynchronous (Event-Driven)"
        G["NGDRS registers deed"] --> H["Webhook Listener<br/>POST /webhooks/registration-completed"]
        H --> I["Validate signature + publish event"]
        I --> J["Kafka: registration.completed"]
        J --> K["Workflow Module consumes"]
        K --> L["Create mutation_case"]
        L --> M["Notification Module consumes"]
        M --> N["SMS + Email to citizen"]
    end

    subgraph "Scheduled (Polling Fallback)"
        O["Cron: Every 6 hours"] --> P["Adapter polls State systems"]
        P --> Q["Compare with cached projection"]
        Q --> R{"Changed?"}
        R -->|Yes| S["Update projection<br/>Publish ror.updated event"]
        R -->|No| T["Update freshness_score"]
    end

    subgraph "Failure Handling"
        U["API call to State system"] --> V{"Success?"}
        V -->|Yes| W["Process response"]
        V -->|No| X["Retry (exponential backoff)"]
        X --> Y{"Max retries?"}
        Y -->|No| U
        Y -->|Yes| Z["Circuit breaker OPEN<br/>Serve cached projection<br/>Show STALE indicator"]
    end
```

### 9.2 Data Ownership Matrix

| Data Domain | Authoritative Owner | Land Stack Role | Sync Method | Freshness Target |
|-------------|--------------------|-----------------|-----------|--------------------|
| **Record of Rights** | State Revenue Dept | READ + PROJECT | API / Poll (6h) | < 24 hours |
| **Cadastral Geometry** | State Survey / NIC | READ + CACHE | WMS/WFS / Batch | < 7 days |
| **ULPIN** | DoLR | READ + RESOLVE | API | Real-time |
| **Registration** | State Registration | READ + EVENT | Webhook | Real-time (event) |
| **Mutation Status** | State Revenue | READ + TRACK | API / Poll | < 1 hour |
| **Encumbrance** | State Registration | READ + CACHE | API / Poll (12h) | < 24 hours |
| **Court Cases** | RCCMS / e-Courts | READ + CACHE | API / Poll (24h) | < 48 hours |
| **Property Tax** | Municipal / ULB | READ + CACHE | API / Poll (24h) | < 48 hours |
| **Zoning / Master Plan** | Town Planning | READ + CACHE | GIS Service / Batch | < 30 days |
| **Forest Restriction** | Forest Department | READ + CACHE | API / Batch | < 30 days |

---

## 10. Deployment Architecture

### 10.1 Local Development (Docker Compose)

```yaml
# docker-compose.yml (simplified)
services:
  app:            # Express modular monolith
    build: .
    ports: ["3001:3001"]
    depends_on: [postgres, redis, opensearch, minio]
    environment:
      DATABASE_URL: postgresql://land:land@postgres:5432/landstack
      REDIS_URL: redis://redis:6379
      OPENSEARCH_URL: http://opensearch:9200
      S3_ENDPOINT: http://minio:9000
      EVENT_BACKEND: redis  # Redis Streams for dev (not Kafka)
      MOCK_ADAPTERS: "true"  # Use mock State adapters

  postgres:       # PostgreSQL + PostGIS
    image: postgis/postgis:16-3.4
    ports: ["5432:5432"]
    volumes: [pgdata:/var/lib/postgresql/data]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  opensearch:
    image: opensearchproject/opensearch:2.11.0
    ports: ["9200:9200"]
    environment:
      discovery.type: single-node
      DISABLE_SECURITY_PLUGIN: "true"

  martin:         # Vector tile server
    image: ghcr.io/maplibre/martin
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgresql://land:land@postgres:5432/landstack

  minio:          # S3-compatible object storage
    image: minio/minio
    ports: ["9000:9000", "9001:9001"]
    command: server /data --console-address ":9001"

  supabase:       # Identity & Realtime
    image: supabase/supabase-local:latest
    ports: ["8080:8080"]
    command: start-dev
```

### 10.2 Production Architecture

| Component | Infrastructure | HA Strategy |
|-----------|---------------|-------------|
| **Application** | Kubernetes pods (3+ replicas) | Rolling deployment; health checks |
| **PostgreSQL** | Managed (RDS/NIC Cloud); Multi-AZ | Read replicas; continuous WAL archival; RPO 5 min |
| **Redis** | Managed cluster mode | Replica set; automatic failover |
| **Kafka** | Managed (MSK) or self-hosted | 3 brokers; replication factor 3 |
| **OpenSearch** | Managed; 3-node cluster | Snapshot-based recovery; RPO 1h |
| **Martin** | Kubernetes pods (3+ replicas) | Behind load balancer; CDN cache |
| **S3** | Managed object storage | Cross-region replication |
| **Supabase** | Kubernetes HA cluster | Identity & Realtime |

---

## 11. Technology Decision Matrix

| Layer | Technology | Why This | Why Not Alternatives |
|-------|-----------|----------|---------------------|
| **Backend** | Express.js (TypeScript) | Fast iteration; extensive middleware ecosystem; shared language with frontend | NestJS: overly complex. FastAPI: weak module system. Spring: heavy. |
| **Database** | PostgreSQL 16 + PostGIS 3.4 | Best spatial + relational + JSONB + bi-temporal; FOSS; proven at scale | MongoDB: poor spatial. DynamoDB: no joins. Oracle: license cost. |
| **Map renderer** | Leaflet JS | Lightweight; large plugin ecosystem; sufficient for current scale | MapLibre: overkill for basic vector/raster needs. |
| **Tile server** | Martin | PostGIS-native; Rust; no ETL needed; dynamic tiles | GeoServer: Java; heavier. pg_tileserv: less mature. |
| **Search** | OpenSearch 2.x | Full-text + fuzzy + geospatial; truly FOSS; multilingual | Elasticsearch: license concerns. MeiliSearch: limited geo. |
| **Cache** | Redis 7 | Pub/sub; rich data structures; rate limiting; session management | Memcached: no pub/sub; limited data structures. |
| **Events** | Supabase Realtime | Native to Postgres; simple CDC | Kafka: high operational overhead for our scale. |
| **Auth** | Supabase Auth | Postgres native; RLS integration; self-hostable | Keycloak: overly complex. Auth0: SaaS dependency. |
| **Policy** | Express Middleware | Native execution; simple custom RBAC & Jurisdiction logic | OPA: complex deployment overhead. |
| **Observability** | OpenTelemetry + Prometheus + Grafana + Loki | Unified; FOSS; full control; government-deployable | Datadog/New Relic: SaaS cost; data residency concerns. |
