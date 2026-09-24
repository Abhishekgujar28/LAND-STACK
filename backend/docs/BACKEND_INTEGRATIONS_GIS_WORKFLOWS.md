# BACKEND INTEGRATIONS, GIS, AND WORKFLOWS

## 1. GIS Architecture (PART A)

### 1.1 Geometry Model
- **Engine:** PostGIS (Supabase).
- **Coordinate System:** SRID 4326 (WGS 84).
- **Format:** GeoJSON for API boundaries; MVT (Mapbox Vector Tiles) for frontend rendering.

### 1.2 Authoritative Truth
- Land Stack does **NOT** generate authoritative geometries.
- Cadastral boundaries are ingested from State GIS/BhuNaksha and stored as projections.
- AI (if applied) can flag geometry anomalies (e.g., overlapping polygons) but cannot alter the legal boundary.

## 2. External Integrations (PART B)

Land Stack integrates with external state systems. All external systems are treated as the final source of truth.

### 2.1 Adapter Pattern
Every external system (RoR, NGDRS, ULPIN) will have an adapter in `src/modules/integrations/`.
- **RoR (Record of Rights):** Fetches ownership, 7/12, 8A details.
- **NGDRS (Registration):** Fetches encumbrance and registration details.
- **BhuNaksha:** Fetches cadastral geometries.
- **Courts:** Fetches sub-judice case details.

### 2.2 Integration Guarantees
- **Resilience:** Circuit breakers and timeouts.
- **Idempotency:** Repeated sync operations update the projection safely.
- **Provenance:** Every synced record maintains `source`, `source_system`, and `last_updated`.

## 3. Workflows (PART C)

### 3.1 e-Ferfar (Mutation) Workflow
A state machine governs mutations:
1. **PENDING:** Citizen applies.
2. **NOTICE_ISSUED:** Talathi issues 15-day notice.
3. **OBJECTION_WINDOW:** Wait for objections.
4. **FIELD_VERIFICATION:** Patwari/Talathi verifies bounds.
5. **SANCTIONED/REJECTED:** Tehsildar makes the statutory decision.

### 3.2 Jurisdiction Validation
Workflows strictly validate the actor's jurisdiction against the parcel's location. A Tehsildar in Pune cannot approve a mutation for a parcel in Nagpur.

### 3.3 Audit Trail
Every workflow transition triggers a write to `audit_events`.
