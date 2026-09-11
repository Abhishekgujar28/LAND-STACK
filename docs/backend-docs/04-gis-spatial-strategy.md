# Land Stack — GIS & Spatial Strategy

**Version**: 1.0 | **Date**: September 2026
**Prerequisite**: Read [03-database-design-philosophy.md](./03-database-design-philosophy.md) first
**Reference**: [Architecture](../../docs/architecture.md) Section 6, [DEPARTMENT_INTEGRATION_MATRIX.md](../../docs/DEPARTMENT_INTEGRATION_MATRIX.md) Section 2.3

---

## 1. Why GIS Is Central, Not Peripheral

Land Stack is not a system that "also has a map." The map IS the system. Every land parcel is a polygon on the earth's surface. Every search, every verification, every dispute ultimately comes down to "which piece of land are we talking about?" — and the answer is a geometry.

DILRMP 3.0 (launched September 2026) mandates a **"GIS-based Land Stack"** where the cadastral parcel layer serves as the base layer, overlaid with master plans, land use, building permissions, and restriction zones. This isn't optional — it's the government's stated architecture.

Our GIS strategy must handle:
- Storing millions of parcel polygons with high-fidelity geometry
- Serving those polygons as interactive map tiles to browsers and mobile devices
- Answering spatial questions: "Which parcel is at this lat/lng?" "What parcels are within 500m?" "Does this parcel overlap a forest zone?"
- Detecting spatial anomalies: "The RoR says 0.5 hectares but the polygon calculates to 0.38 hectares"
- Supporting the Survey/GIS Officer's workflow: boundary validation, overlap detection, topology checks

> *Reference: DILRMP 3.0 requirements from PIB.gov.in (September 2026). GIS architecture from [architecture.md](../../docs/architecture.md) Section 6.*

---

## 2. PostGIS in Supabase

Supabase fully supports PostGIS as a first-class extension. Here's what that gives us:

### What PostGIS Provides

**Geometry Types**: We store parcel boundaries as `MULTIPOLYGON` in SRID 4326 (WGS 84 — the global standard for latitude/longitude). Centroids are stored as `POINT` in the same SRID. This matches what BhuNaksha and SVAMITVA produce.

**Spatial Indexes**: GIST indexes on geometry columns enable fast spatial queries. Without GIST indexes, a point-in-polygon query on a million parcels would be a full table scan. With GIST, it's milliseconds.

**Spatial Functions**: The full PostGIS function library is available:
- `ST_Contains(boundary, point)` — "Is this click point inside this parcel?"
- `ST_Intersects(parcel, zone)` — "Does this parcel overlap a forest zone?"
- `ST_DWithin(centroid, point, distance)` — "Which parcels are within 500m?"
- `ST_Area(ST_Transform(boundary, utm_srid))` — "What's the area in square meters?"
- `ST_IsValid(boundary)` — "Is this geometry topologically valid?"
- `ST_MakeValid(boundary)` — "Fix this invalid geometry"
- `ST_AsMVT(...)` — "Generate a Mapbox Vector Tile from query results"
- `ST_Simplify(boundary, tolerance)` — "Reduce polygon complexity for zoom level"

### Enabling PostGIS in Supabase

PostGIS can be enabled through the Supabase Dashboard (Database → Extensions → search "postgis" → toggle on). We install it in a dedicated `gis` schema to keep our `public` schema clean. When calling PostGIS functions from the `public` schema, we either set the search_path or reference functions explicitly (e.g., `gis.ST_Contains(...)`).

> *Reference: Supabase PostGIS setup from supabase.com documentation. Verified that Supabase supports PostGIS 3.4 with full function library.*

---

## 3. Spatial Data Pipeline

How do cadastral boundaries get from government GIS systems into our database?

### Source Systems

| Source | Data Type | Format | Coverage |
|---|---|---|---|
| **BhuNaksha** | Cadastral parcel boundaries | WMS/WFS raster & vector | Pan-India (97% digitized) |
| **SVAMITVA** | Rural property boundaries (Abadi areas) | Drone survey → GeoJSON/Shapefile | 3.3 lakh villages |
| **State GIS portals** | State-specific cadastral layers | Varies (Shapefile, GeoJSON, KML) | State-specific |
| **Manual digitization** | Parcels not yet digitized | GeoJSON drawn in GIS tool | Gap-filling |

### Ingestion Pipeline

1. **Acquire**: Fetch geometry from BhuNaksha WFS endpoint (GeoJSON) or receive Shapefile uploads from state survey departments

2. **Validate**: Every incoming geometry passes through quality checks:
   - `ST_IsValid()` — topological validity (no self-intersections, no ring orientation errors)
   - `ST_MakeValid()` — auto-fix common issues
   - Area threshold check — reject polygons smaller than 1 sq.m (likely errors)
   - Coordinate range check — lat between 6°N and 38°N, lng between 68°E and 98°E (India bounds)
   - SRID verification — must be 4326 or transformed to 4326

3. **Transform**: Convert from source CRS to SRID 4326 if needed. Calculate centroid (`ST_Centroid`). Calculate area in square meters using UTM projection (`ST_Area(ST_Transform(geom, utm_srid))`).

4. **Store**: Insert into `spatial_unit` table with parcel_id foreign key, provenance, source system, survey date, and coordinate accuracy grade.

5. **Index**: GIST index on both `boundary` (polygon search) and `centroid` (point proximity search).

6. **Link**: Associate with the parcel record via ULPIN or state identifier, recording the linkage provenance.

> *Reference: Ingestion pipeline adapted from [architecture.md](../../docs/architecture.md) Section 6.1 (Spatial Data Pipeline diagram). BhuNaksha and SVAMITVA coverage from [DEPARTMENT_INTEGRATION_MATRIX.md](../../docs/DEPARTMENT_INTEGRATION_MATRIX.md) Section 2.3. Indian GIS standards research from web (ULPIN coverage confirmed at 40+ crore parcels across 28 states).*

---

## 4. Core Spatial Queries

These are the spatial operations that the application needs, explained in terms of what they accomplish rather than SQL syntax:

### Map Click → Parcel Identification

When a user clicks on the cadastral map, the frontend sends the clicked latitude/longitude to the backend. PostGIS checks which parcel polygon contains that point. This is the most common spatial query — it needs to be sub-100ms even with millions of parcels (GIST indexing ensures this).

### Nearby Parcel Search

"Show me all parcels within 500 meters of this point." Used for neighborhood context, finding adjacent parcels during boundary disputes, or locating parcels near a landmark. PostGIS calculates geodesic distance on the earth's surface, not flat-plane distance.

### Zone Intersection

"Does this parcel overlap a forest zone? A CRZ zone? A flood zone? A master plan residential zone?" PostGIS intersects the parcel boundary with zone boundaries from overlay layers. This is critical for the restriction and zoning tabs in Parcel 360°.

### Area Calculation

"What is the actual area of this parcel according to its geometry?" PostGIS calculates area by projecting from WGS 84 (degrees) to the appropriate UTM zone (meters), then computing the polygon area. This is compared against the RoR-recorded area to detect mismatches.

### Overlap Detection

"Does this parcel boundary overlap with any adjacent parcel's boundary?" Used by the Data Quality Engine and the Survey/GIS Officer. If two neighboring parcels overlap, it indicates a surveying error that needs resolution.

### Boundary Simplification

When serving map tiles at low zoom levels (showing an entire district or state), we don't need full-resolution parcel boundaries. PostGIS simplifies geometries to reduce data transfer without losing visual fidelity at the current zoom level.

---

## 5. Vector Tile Serving Strategy

Cadastral maps need to be rendered in the browser. The user must be able to pan, zoom, click parcels, and see overlays. The standard approach is **vector tiles** — pre-rendered or dynamically-generated tile sets that the browser's GPU can render efficiently.

### Option A: PostGIS → Express → MVT (Our Primary Approach)

PostGIS can generate Mapbox Vector Tiles (MVT) directly using the `ST_AsMVT()` function. We create a Supabase database function (RPC) that takes tile coordinates (z, x, y) and returns a binary MVT tile. Express exposes this as a tile endpoint that MapLibre GL JS on the frontend consumes.

**Advantages**: No additional infrastructure. PostGIS does the heavy lifting. Supabase RPC handles the database call.

**Disadvantage**: Every tile request hits the database. For high-traffic maps, we need caching.

**Mitigation**: Redis or in-memory cache with TTL (24 hours for cadastral tiles that rarely change). CDN caching for static basemap tiles.

### Option B: Martin Tile Server (Future Enhancement)

Martin is a Rust-based tile server that reads directly from PostGIS and serves MVT tiles with high performance. It handles caching, tile generation, and serves dynamic tiles from PostGIS tables or functions.

**When to add Martin**: If tile serving becomes a performance bottleneck (many concurrent map users), Martin can be deployed as a sidecar service that reads from the same Supabase PostgreSQL database. It doesn't require changing any data — it just provides a faster tile serving path.

### Frontend Rendering: MapLibre GL JS

MapLibre GL JS is the open-source fork of Mapbox GL JS. It renders vector tiles using WebGL (GPU-accelerated). The frontend adds our tile source and renders cadastral parcels as interactive polygons.

Features we need from MapLibre:
- **Click-to-select**: User clicks a parcel → fires a click event with the parcel's ULPIN → fetches Parcel 360° data
- **Multi-layer rendering**: Cadastral boundaries (base) + zoning overlay + restriction overlay + satellite basemap
- **GPS "Locate Me"**: For field officers using tablets, center the map on their current GPS position
- **Hover effects**: Highlight parcel boundary on mouse hover for desktop users
- **Low-bandwidth mode**: Progressive loading of tiles, simplified geometries at low zoom

> *Reference: MVT serving from PostGIS confirmed via Supabase docs and web research on ST_AsMVT + MapLibre. Martin tile server from maplibre.org documentation. Tile serving architecture adapted from [architecture.md](../../docs/architecture.md) Section 6.3 (Vector Tile Architecture).*

---

## 6. GIS Layers

The map is not a single layer — it's a stack of layers that users can toggle:

| Layer | Source | Geometry Type | Purpose |
|---|---|---|---|
| **Cadastral boundaries** | BhuNaksha / State GIS | MULTIPOLYGON | Base layer — shows every parcel boundary |
| **SVAMITVA property cards** | SVAMITVA drone surveys | POLYGON | Rural Abadi area boundaries |
| **Zoning / Master Plan** | Town & Country Planning | POLYGON | Residential, commercial, industrial, agricultural zones |
| **Forest boundaries** | Forest Department | POLYGON | Forest land restriction areas |
| **Tribal land** | Tribal Welfare | POLYGON | Schedule V / Schedule VI area boundaries |
| **CRZ zones** | Environment Ministry | POLYGON | Coastal Regulation Zone boundaries |
| **Acquisition areas** | Revenue Department | POLYGON | Land under acquisition proceedings |
| **Flood zones** | Disaster Management | POLYGON | Flood-prone area delineation |
| **Satellite basemap** | OpenStreetMap / Satellite provider | Raster tiles | Visual context under vector layers |

Each overlay layer is a separate PostGIS table with its own geometry column, GIST index, and provenance metadata. The frontend can toggle layers on/off and adjust opacity.

---

## 7. The Survey/GIS Officer's Needs

The Survey/GIS Officer is the only role that interacts with the spatial system at a technical level. Other roles see maps and click parcels — the GIS Officer manages the spatial data itself.

**What they need from the system**:

1. **Boundary validation tools**: Upload a new survey measurement (GPS points or GeoJSON polygon) and compare it against the existing cadastral boundary. The system highlights discrepancies.

2. **Overlap detection dashboard**: A view showing all parcels in their project area where boundaries overlap with adjacent parcels. Each overlap is quantified (area of overlap, percentage of total).

3. **Topology checks**: Verify that all parcels in an area tile perfectly — no gaps between parcels, no slivers, no overlapping edges.

4. **Area reconciliation**: Compare the geometry-calculated area (PostGIS) against the RoR-recorded area for every parcel. Flag discrepancies above a configurable threshold (e.g., >10%).

5. **Survey project management**: Create a survey project covering a specific area, assign surveyors, track progress, review and approve submitted measurements.

---

## 8. GIS and Data Quality

The spatial system is one of the richest sources of data quality intelligence:

- **Area mismatch**: RoR says 2.5 acres, PostGIS calculates 2.1 acres from the polygon → data quality issue flagged
- **Boundary overlap**: Two adjacent parcels overlap by 50 sq.m → surveying error or boundary dispute
- **Missing geometry**: Parcel exists in RoR but has no spatial_unit record → incomplete digitization
- **Coordinate anomaly**: Parcel boundary has vertices outside expected geographic area → data ingestion error
- **Stale geometry**: Spatial unit `retrieval_time` is > 7 days old → needs re-sync from source

These checks run as scheduled background jobs (daily or weekly) and populate the `data_quality_issue` table, which feeds into the officer's Data Quality dashboard and the citizen's Data Health tab in Parcel 360°.

> *Reference: GIS-data quality connection from [architecture.md](../../docs/architecture.md) Section 6.2 (Geometry Management). Data quality requirements from [PRD](../../docs/01-prd.md) FR-G10.2.*

---

## 9. PostGIS + Supabase: Capabilities and Limitations

Based on online research, here are the practical realities:

### What Works Well
- Full PostGIS function library available (ST_Contains, ST_Intersects, ST_AsMVT, etc.)
- GIST spatial indexing works normally
- RLS policies work on geometry columns (you can have location-based access control)
- Supabase RPC lets you call custom PostGIS functions from the frontend
- The `geography` type handles distance calculations on the earth's surface correctly

### Limitations to Be Aware Of
- **No built-in tile server**: Supabase doesn't natively serve map tiles. We either serve them through Express (calling PostGIS ST_AsMVT via RPC) or deploy a separate Martin/pg_tileserv instance.
- **Connection limits**: Complex spatial queries can hold connections longer. Supabase's connection pooling (via Supavisor) helps, but very heavy spatial workloads may need a dedicated database.
- **Large geometry imports**: Bulk importing millions of polygons (initial cadastral data load) is best done via direct PostgreSQL connection (pg_restore, COPY) rather than through the Supabase API.
- **Edge Functions can't do spatial queries**: Edge Functions connect to the database, but complex PostGIS operations should run as database functions (RPC), not as application-level code in Edge Functions.

> *Reference: Supabase PostGIS capabilities confirmed via supabase.com/docs/guides/database/extensions/postgis. Limitations identified through community discussions and documentation.*

---

*Next: [05-phase-1-foundation.md](./05-phase-1-foundation.md) — Phase 1 begins.*
