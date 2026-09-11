# Phase 3 — Parcel Core & GIS

**Goal**: Build the parcel identity system (ULPIN resolution), store and serve cadastral geometries, implement spatial queries, and deliver interactive map tiles — making the map come alive.

**Why Now**: Parcel identity and GIS are the backbone. Every feature that comes after (workflows, Parcel 360°, analytics) needs to know which parcel we're talking about and where it sits on the earth.

---

## What Gets Built

### Parcel Identity Resolution
- `parcel` table fully operational with ULPIN as the canonical key
- `parcel_identifier` table mapping heterogeneous state IDs to ULPIN:
  - Survey No / Gat No (Maharashtra)
  - Survey / Hissa No (Karnataka)
  - Khasra / Gata No (Uttar Pradesh)
  - Patta / Survey No (Tamil Nadu)
  - CTS No (urban Maharashtra)
- Multi-modal search: search by ULPIN, Survey Number (with state-specific terminology), owner name (fuzzy via pg_trgm), or map click
- Hierarchical cascading search: State → District → Tehsil → Village → Survey Number

### GIS Core
- `spatial_unit` table with MULTIPOLYGON geometry, GIST index, centroid computation
- Geometry validation pipeline (ST_IsValid, ST_MakeValid, area threshold)
- PostGIS functions for core spatial queries:
  - Point-in-polygon (map click → parcel)
  - Nearby parcels (ST_DWithin)
  - Zone intersection (parcel × overlay layer)
  - Area calculation (with UTM projection for accuracy)
- Seed geometry data: cadastral boundaries for demo tehsils in Maharashtra and Karnataka

### Vector Tile Serving
- Supabase database function that generates MVT tiles from spatial_unit table
- Express tile endpoint: `GET /api/v1/tiles/:z/:x/:y.pbf`
- Tile caching (in-memory or Redis) with 24-hour TTL for cadastral tiles
- Multiple tile layers: cadastral boundaries, restriction overlays, zoning

### Search
- Full-text search on owner names using PostgreSQL tsvector + pg_trgm
- Transliteration support for multilingual names (Marathi, Kannada, Tamil, Hindi)
- Geo-search: search results filtered/ranked by geographic proximity to a point

## Stakeholders Served
- **Citizen**: Can search for parcels by multiple methods, see them on a map, click to identify
- **Survey/GIS Officer**: Has geometry stored and queryable, can check and edit boundaries across rural and urban pilots
- **CRO/Tehsildar & ULB Officer**: Can visually verify parcels and spatial boundaries during mutation review
- **SRO**: Can spatially inspect parcels before registration to prevent overlapping registrations
- **All roles**: Map-based parcel discovery works for everyone (scoped by RLS)

## Key Decisions
- **SRID 4326 (WGS 84)**: Standard global CRS, compatible with all mapping libraries and GPS devices. Area calculations use dynamic UTM projection for accuracy.
- **PostGIS ST_AsMVT over Martin**: We start with PostGIS-native MVT serving via Express. Martin can be added later as a performance optimization.
- **Fuzzy search with pg_trgm**: Handles misspellings and transliteration variations in Indian names without requiring a separate search engine like Elasticsearch.

## Dependencies
- Phase 1 (Foundation) — database with PostGIS enabled
- Phase 2 (Auth) — RLS policies must be in place before serving spatial data
- Seed geometry data (mock BhuNaksha data for demo parcels)

## Exit Criteria
- Search by ULPIN returns correct parcel with geometry
- Search by Survey Number with cascading hierarchy works
- Map click at a known parcel's coordinates returns that parcel
- Vector tiles render in MapLibre GL JS on the frontend
- Nearby search returns correct parcels within specified radius
- Owner name fuzzy search works across transliterations

## Risks
- **Geometry data quality**: BhuNaksha data may have invalid geometries. Mitigated by ST_MakeValid and validation pipeline.
- **Tile serving performance**: Without caching, every tile request hits the database. Mitigated by caching with TTL.
- **ULPIN coverage gaps**: Not all parcels have ULPIN yet. Mitigated by supporting fallback to state identifiers.

## References
- [04-gis-spatial-strategy.md](./04-gis-spatial-strategy.md) — Full GIS strategy
- [architecture.md](../../docs/architecture.md) Section 6 — GIS Architecture
- [DEPARTMENT_INTEGRATION_MATRIX.md](../../docs/DEPARTMENT_INTEGRATION_MATRIX.md) Section 2.3 — BhuNaksha integration
- Web research — PostGIS ST_AsMVT, MapLibre GL JS vector tile consumption, pg_tileserv documentation
- DILRMP 3.0 — ULPIN mandate and georeferencing requirements
