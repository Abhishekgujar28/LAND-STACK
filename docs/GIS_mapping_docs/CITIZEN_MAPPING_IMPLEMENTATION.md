# Citizen Mapping Dashboard --- Implementation Specification

**Project:** SIH_26014\
**Module:** Citizen Mapping\
**Folder:** `mapping/`\
**Primary goal:** Build a clean, working citizen-facing cadastral GIS
prototype using synthetic land-record data, with a clear integration
boundary for Bharat Maps/NIC and future Bhu-Naksha integration.

------------------------------------------------------------------------

## 1. Non-Negotiable UI Rule

### DO NOT CHANGE THE EXISTING HEADER

The current Government of India / Department of Land Resources /
BharatBhumi / Digital India header is already approved.

**The header must remain visually and structurally unchanged.**

Do not: - redesign the header - change its height - change logos -
change branding - change colors - change language/accessibility
controls - move the citizen profile area - replace the Government of
India branding - add another application header above it

All improvements in this specification apply **below the existing
header**.

The implementation should treat the header as a fixed existing
application component.

------------------------------------------------------------------------

# 2. Design Objective

The current GIS page contains too many controls and too much information
competing for attention.

The new page should communicate one simple citizen journey:

> **Search → Find My Land → See Parcel → Understand Land Record → Take
> Action**

The map must become the primary visual element.

The interface should feel: - clean - spacious - government-grade -
trustworthy - easy for non-GIS users - bilingual-ready - responsive -
accessible - fast - visually consistent with the existing portal

Do not make the page look like a professional GIS editing workstation.
This is a **citizen land discovery and verification interface**.

------------------------------------------------------------------------

# 3. Scope for This Prototype

## In scope

1.  Citizen parcel search
2.  ULPIN search
3.  Survey Number search
4.  Gat Number search
5.  Village/location search
6.  My Land shortcut
7.  Interactive cadastral parcel map
8.  Synthetic parcel polygons
9.  Parcel selection
10. Parcel highlighting
11. Parcel labels
12. Bharat Maps/NIC reference-map integration boundary
13. Satellite / map / hybrid view where available
14. Administrative context
15. Layer controls
16. Selected parcel information
17. Ownership information
18. Land-record information
19. Map information
20. Nearby spatial information
21. Parcel status
22. Official RoR action
23. Download parcel map action
24. Apply for Resurvey
25. Report Issue
26. Share parcel
27. Add to Watchlist
28. Map reset
29. Legend
30. Responsive layout

## Explicitly out of scope for this version

Do NOT build: - actual Bhu-Naksha integration - real government
cadastral APIs - real mutation processing - actual survey/resurvey
workflow backend - GIS editing by citizens - parcel geometry
modification - complex GIS analysis - officer GIS dashboard - policy
dashboard - advanced measurement tools - distance measurement - area
measurement - drawing tools - buffer tools - spatial editing tools

### Important change

**REMOVE "Measure Distance" and "Measure Area" from the citizen
dashboard.**

These make the page feel like a GIS professional tool and are not
essential to the citizen journey.

Replace the space with citizen actions such as:

-   Apply for Resurvey
-   Report Issue
-   View Official RoR
-   Download Parcel Map
-   Add to Watchlist

------------------------------------------------------------------------

# 4. Recommended Page Layout

The page below the existing header should use a two-column application
layout.

## Desktop

``` text
┌──────────────────────────────────────────────────────────────┐
│ EXISTING GOVERNMENT HEADER — DO NOT CHANGE                  │
├────────────┬─────────────────────────────────────────────────┤
│            │ Page title                                      │
│ Existing   │ Search bar                                     │
│ Citizen    │                                                 │
│ Sidebar    │ ┌─────────────────────────┬───────────────────┐ │
│            │ │                         │                   │ │
│            │ │                         │ Selected Parcel   │ │
│            │ │       LARGE MAP         │ Details           │ │
│            │ │                         │                   │ │
│            │ │                         │                   │ │
│            │ │                         │                   │ │
│            │ └─────────────────────────┴───────────────────┘ │
│            │                                                 │
│            │ Map Information / Status / Nearby              │
└────────────┴─────────────────────────────────────────────────┘
```

### Primary layout rule

The map should occupy approximately **65--70% of the main content
area**.

The parcel-information panel should occupy approximately **30--35%**.

Do not allow the information cards below/around the map to make the map
small.

------------------------------------------------------------------------

# 5. Page Header

Below the existing Government header:

### Eyebrow

`CITIZEN LAND SERVICES`

### Main title

`Explore Your Land on Interactive Map`

### Supporting text

`Search by ULPIN, Survey No., Gat No., village or location to view cadastral map, land records and available land services.`

Keep this concise.

Do not use multiple explanatory paragraphs.

------------------------------------------------------------------------

# 6. Search Experience

The search area should be prominent and simple.

## Search input

Placeholder:

`Search by ULPIN, Survey No., Gat No., Village or Location`

Examples: - `ULPIN-MH-PUN-000001` - `Survey No. 104` - `Gat No. 42` -
`Wagholi`

### Controls

Primary: - Search

Secondary: - Use My Location

Optional: - Filters

Do not create multiple search forms.

------------------------------------------------------------------------

# 7. Quick Search Chips

Immediately below the search box show recently used / relevant
identifiers:

``` text
ULPIN-MH-PUN-000001
Survey No. 104
Gat No. 42
Wagholi
Pune
```

Clicking a chip must trigger the same search function.

------------------------------------------------------------------------

# 8. Citizen "My Land" Function

The existing sidebar contains `My Land Parcels`.

Clicking it should: 1. load parcels associated with the authenticated
citizen 2. display a list 3. allow the citizen to select a parcel 4.
zoom the map to the parcel 5. highlight it 6. open the parcel
information panel

For the synthetic citizen:

``` json
{
  "id": "CIT-001",
  "name": "Aarav Patil"
}
```

The system should find:

``` text
Ownership.owner_id == CIT-001
```

Then:

``` text
Ownership.parcel_ulpin
        ↓
Parcel
        ↓
Map geometry
```

------------------------------------------------------------------------

# 9. GIS Map

The map is the most important component of the page.

## Required characteristics

-   large
-   visually dominant
-   uncluttered
-   easy to zoom
-   clear parcel boundaries
-   selected parcel visually obvious
-   labels readable
-   no unnecessary GIS controls

## Map controls

Keep only:

-   Zoom in
-   Zoom out
-   Locate/center
-   Fullscreen
-   Reset view
-   Layer switcher
-   Legend

Do not add measurement controls.

------------------------------------------------------------------------

# 10. Map View Modes

Provide a compact segmented control:

``` text
Map
Satellite
Hybrid
```

If the selected Bharat Maps service supports the relevant view, use it.

For prototype fallback, use a standard compatible basemap.

The architecture must allow the basemap provider to be replaced later
without changing the parcel UI.

------------------------------------------------------------------------

# 11. Cadastral Parcel Layer

The synthetic parcel should be represented as a GeoJSON polygon.

Example:

``` json
{
  "type": "Feature",
  "properties": {
    "ulpin": "ULPIN-MH-PUN-000001",
    "survey_number": "104",
    "gat_number": "42",
    "village_name": "Wagholi",
    "area": 1.45,
    "area_unit": "Hectare",
    "land_use": "Agricultural",
    "classification": "Jirayat",
    "status": "CLEAR"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": []
  }
}
```

The geometry may be synthetic for the prototype.

------------------------------------------------------------------------

# 12. Synthetic Cadastral Neighborhood

Do not display only one polygon.

Generate a small synthetic cadastral neighborhood around the citizen
parcel.

Example:

``` text
┌────────┬──────────┬────────┐
│  101   │   102    │  103   │
├────────┼──────────┼────────┤
│  104   │ ★ 42     │  105   │
├────────┼──────────┼────────┤
│  106   │   107    │  108   │
└────────┴──────────┴────────┘
```

The selected citizen parcel should be visually distinct.

The neighboring parcels are synthetic only and must never be presented
as official cadastral records.

------------------------------------------------------------------------

# 13. Selected Parcel Styling

Selected parcel: - stronger outline - translucent fill - clear label -
location marker/centroid - visible Survey/Gat number

Example label:

``` text
Gat 42
Survey 104
```

Avoid putting the full ULPIN on every parcel at low zoom.

At higher zoom, ULPIN labels may be enabled through the layer control.

------------------------------------------------------------------------

# 14. Map Layers

The layer switcher should be simple.

## Reference layers

``` text
☑ Roads
☐ Administrative Boundaries
☐ Settlements
☐ Water Bodies
☐ Terrain
```

These may come from Bharat Maps/NIC or another approved reference
provider.

## Land layers

``` text
☑ Cadastral Parcels
☑ Selected / My Property
☐ Survey / Gat Labels
☐ ULPIN Labels
☐ Land Use
```

## Urban pilot

``` text
☐ Pune Ward Boundaries
```

The Pune ward GeoJSON can be used as a prototype administrative overlay.

------------------------------------------------------------------------

# 15. Parcel Information Panel

When a parcel is selected, the right-side panel opens.

Use tabs:

``` text
Overview
Ownership
Documents
Nearby
```

Do not show every field at once.

------------------------------------------------------------------------

# 16. Overview Tab

Header:

``` text
ULPIN-MH-PUN-000001
Gat No. 42 (Survey 104)
```

Show status:

`CLEAR`

Location:

`Wagholi, Haveli, Pune, Maharashtra`

Then a compact Land Information card.

### Fields

  Field            Value
  ---------------- --------------
  Survey Number    104
  Gat Number       42
  Area             1.45 Hectare
  Land Use         Agricultural
  Classification   Jirayat
  Status           CLEAR
  Village          Wagholi
  Tehsil           Haveli
  District         Pune

Avoid unnecessary fields.

------------------------------------------------------------------------

# 17. Ownership Tab

Use the ownership JSON.

Input:

``` json
{
  "id": "OWN-001",
  "parcel_ulpin": "ULPIN-MH-PUN-000001",
  "owner_id": "CIT-001",
  "owner_name": "Aarav Patil",
  "share": 100,
  "relation": "Sole Owner",
  "aadhaar_status": "Verified"
}
```

Display:

``` text
Owner
Aarav Patil (आरव पाटील)

Ownership
100%

Relationship
Sole Owner

KYC / Aadhaar Status
✓ Verified
```

Do not expose the actual Aadhaar number/hash.

------------------------------------------------------------------------


# 19. Nearby Tab

Use GIS calculations or synthetic values.

Example:

``` text
Nearest Road       38 m
Water Body         420 m
Village Centre     1.2 km
Wagholi Ward       850 m
```

This demonstrates spatial intelligence without requiring government
APIs.

------------------------------------------------------------------------

# 20. Primary Citizen Actions

The bottom of the selected parcel panel should contain the most useful
actions.

## Primary

### View Official RoR

Green primary action.

### Apply for Resurvey

Orange/attention action.

This is now a required citizen feature.

------------------------------------------------------------------------

# 21. Apply for Resurvey

Clicking `Apply for Resurvey` opens a simple workflow modal.

## Step 1 --- Selected Property

``` text
ULPIN
ULPIN-MH-PUN-000001

Survey No.
104

Gat No.
42

Village
Wagholi
```

## Step 2 --- Reason

Options:

``` text
○ Boundary does not match ground reality
○ Area appears incorrect
○ Boundary markers are missing
○ Map/record discrepancy
○ Other
```

## Step 3 --- Supporting information

Allow prototype fields:

``` text
Description
Upload supporting document/photo
Preferred contact
```

## Step 4 --- Submit

Generate a synthetic application number:

``` text
RES-2026-00001
```

Show:

`Resurvey request submitted successfully.`

This does not need a real survey department backend for the prototype.

------------------------------------------------------------------------

# 22. Report Issue

Allow citizens to report:

``` text
Incorrect parcel location
Incorrect boundary
Incorrect land information
Missing parcel
Other
```

Generate a synthetic grievance ID.

------------------------------------------------------------------------

# 23. Watchlist

`Add to Watchlist`

Stores the ULPIN in local prototype state.

After adding:

`✓ Added to Watchlist`

The existing `Land Watchlist` sidebar item should display the selected
parcel.

------------------------------------------------------------------------

# 24. Share Parcel

Generate a shareable route conceptually:

``` text
/citizen/search?ulpin=ULPIN-MH-PUN-000001
```

For prototype, use the browser share API where supported, otherwise copy
a link.

------------------------------------------------------------------------

# 25. Download Parcel Map

Generate a clean map export containing:

``` text
Department branding
ULPIN
Survey Number
Gat Number
Village
Area
Selected parcel
North arrow
Scale
Legend
```

Clearly label prototype-generated output as:

`Prototype / Demonstration Data`

until actual government data is connected.

------------------------------------------------------------------------

# 26. Parcel Status

Keep status extremely simple.

Possible statuses:

``` text
CLEAR
RECORD ISSUE
BOUNDARY ISSUE
COURT DISPUTE
RESTRICTED
PENDING VERIFICATION
```

Use a consistent status component.

Do not invent legal conclusions from synthetic data.

For `CLEAR`, phrase the UI as:

`No issue recorded in prototype data`

rather than making a legal title guarantee.

------------------------------------------------------------------------

# 27. Map Information Card

Below the map:

``` text
Map Information

Center Coordinates
18.5793° N, 73.9812° E

CRS
EPSG:4326 / WGS 84

Data Source
Bharat Maps (NIC) + Cadastral Prototype

Scale
1 : 2,500
```

Important:

If the cadastral geometry is synthetic, explicitly state:

`Cadastral layer: Prototype / Synthetic`

This prevents confusion between NIC reference data and our generated
geometry.

------------------------------------------------------------------------

# 28. Legend

Keep the legend compact.

``` text
■ Selected Parcel
□ Other Parcels
— Village Boundary
— Ward Boundary
— Tehsil Boundary
— Road
■ Water Body
```

Do not display a giant GIS legend.

------------------------------------------------------------------------

# 29. Responsive Behavior

## Desktop

Two-column layout: - large map - right parcel panel

## Tablet

Map remains dominant.

Parcel panel becomes a bottom sheet or collapsible panel.

## Mobile

Use:

``` text
Header
Search
Map
Selected parcel bottom sheet
```

The sidebar becomes a drawer.

Do not try to fit desktop cards into mobile.

------------------------------------------------------------------------



Adapt names to the project's existing framework conventions if those
already exist.

Do not duplicate existing global header/sidebar components.

------------------------------------------------------------------------


# 32. Canonical Parcel Resolver

This is the key backend/frontend logic.

Search input can be:

``` text
ULPIN
Survey Number
Gat Number
Village
```

The resolver normalizes it to:

``` text
ULPIN
```

Example:

``` text
Search "104"
      ↓
Survey number match
      ↓
ULPIN-MH-PUN-000001
```

Search:

``` text
"Gat 42"
      ↓
Gat match
      ↓
ULPIN-MH-PUN-000001
```

Search:

``` text
"ULPIN-MH-PUN-000001"
      ↓
direct match
```

------------------------------------------------------------------------

# 33. Data Relationship

The three existing JSON records are the minimum canonical model.

``` text
Citizen
  id
   │
   │ owner_id
   ▼
Ownership
  parcel_ulpin
   │
   │
   ▼
Parcel
  ulpin
  survey_number
  gat_number
  geometry
```

Never duplicate ownership data unnecessarily into the parcel object.

Use IDs to resolve relationships.

------------------------------------------------------------------------

# 34. Geometry Strategy

For this prototype, the input parcel has:

``` text
latitude
longitude
area
```

but no polygon.

Create a synthetic polygon generator.

Input:

``` text
center = 18.5793, 73.9812
area = 1.45 hectare
```

Output:

``` text
GeoJSON Polygon
```

Then generate neighboring synthetic polygons around it.

The generator should be deterministic so the map does not change
randomly on every refresh.

Use a fixed seed or deterministic calculation.

------------------------------------------------------------------------

# 35. Bharat Maps Integration Boundary

Do not hard-code Bharat Maps logic into every map component.

Create:

``` text
bharatMapsAdapter
```

with an interface conceptually like:

``` ts
interface MapProvider {
  getReferenceLayers(): Promise<MapLayer[]>;
  getMapConfig(): Promise<MapConfig>;
}
```

Then:

``` text
CitizenMap
    ↓
mapService
    ↓
MapProvider
    ↓
BharatMapsAdapter
```

For local development, provide:

``` text
MockMapProvider
```

This allows the prototype to work even if NIC services are unavailable
during a demo.

------------------------------------------------------------------------

# 36. Future Bhu-Naksha Integration

Do not modify the citizen UI when Bhu-Naksha is eventually connected.

The future architecture should be:

``` text
Citizen UI
    ↓
Parcel Service
    ↓
Cadastral Provider Interface
    ├── SyntheticProvider   ← NOW
    └── BhuNakshaProvider   ← FUTURE
```

The frontend should only consume the normalized parcel model.

------------------------------------------------------------------------

# 37. Normalized Parcel API

The frontend should ideally receive:

``` json
{
  "ulpin": "ULPIN-MH-PUN-000001",
  "surveyNumber": "104",
  "gatNumber": "42",
  "village": "Wagholi",
  "tehsil": "Haveli",
  "district": "Pune",
  "state": "Maharashtra",
  "area": 1.45,
  "areaUnit": "Hectare",
  "landUse": "Agricultural",
  "classification": "Jirayat",
  "status": "CLEAR",
  "centroid": {
    "lat": 18.5793,
    "lng": 73.9812
  },
  "geometry": {},
  "source": {
    "referenceMap": "Bharat Maps / NIC",
    "cadastral": "Prototype Synthetic Data"
  }
}
```

------------------------------------------------------------------------

# 38. Example API Endpoints

``` text
GET /api/mapping/parcels
GET /api/mapping/parcels/:ulpin
GET /api/mapping/search?q=
GET /api/mapping/citizens/:citizenId/parcels
GET /api/mapping/parcels/:ulpin/ownership
GET /api/mapping/parcels/:ulpin/documents
GET /api/mapping/parcels/:ulpin/nearby
POST /api/mapping/resurvey
POST /api/mapping/issues
POST /api/mapping/watchlist
```

For the first prototype, these can be backed by JSON files or in-memory
data.

------------------------------------------------------------------------

# 39. Example Resurvey Request

``` json
{
  "parcel_ulpin": "ULPIN-MH-PUN-000001",
  "citizen_id": "CIT-001",
  "reason": "Boundary does not match ground reality",
  "description": "Prototype resurvey request",
  "status": "SUBMITTED"
}
```

Response:

``` json
{
  "application_id": "RES-2026-00001",
  "status": "SUBMITTED"
}
```

------------------------------------------------------------------------

# 40. Important Prototype Data Rules

The following are synthetic demonstration records.

Never imply that: - Aarav Patil's record is real - the ownership is an
actual government record - the generated polygon is an official
cadastral boundary - the circle rate is authoritative - synthetic
neighboring parcels are official parcels - Bharat Maps is supplying the
synthetic cadastral polygon

The UI should clearly distinguish:

**Government reference layer**

from

**Prototype cadastral data**

------------------------------------------------------------------------

# 41. Performance Rules

For the prototype:

-   GeoJSON is acceptable for a small dataset.
-   Do not load thousands of synthetic parcels.
-   Keep the demo dataset around 20--100 parcels.
-   Render only necessary labels.
-   Avoid expensive calculations on every mouse movement.
-   Debounce search.
-   Cache parcel lookup results.
-   Load detailed information after parcel selection.
-   Keep the initial map load fast.

If the dataset grows later, migrate to vector tiles/PostGIS without
changing the UI contract.

------------------------------------------------------------------------

# 42. Accessibility

Required:

-   keyboard-accessible search
-   keyboard-accessible parcel actions
-   visible focus states
-   sufficient contrast
-   descriptive buttons
-   screen-reader labels
-   do not rely only on color for status
-   Hindi/local-language fields can coexist with English
-   map controls must have tooltips/accessible labels

------------------------------------------------------------------------

# 43. Visual Design Rules

Use the existing portal's government-green visual language.

Prefer: - white backgrounds - light gray borders - subtle shadows -
rounded cards - dark green primary actions - orange only for important
attention actions such as Resurvey - generous spacing - strong
typography hierarchy

Avoid: - excessive gradients - excessive badges - dense card grids - too
many icons - oversized headings - multiple competing primary buttons -
unnecessary GIS terminology

------------------------------------------------------------------------

# 44. Information Hierarchy

The user should see information in this order:

``` text
1. Where am I / what am I searching?
2. Which parcel did I select?
3. Where is the parcel?
4. What is the parcel's basic land information?
5. Who is associated with it?
6. What documents are available?
7. What can I do next?
```

Do not reverse this hierarchy.

------------------------------------------------------------------------

# 45. Final Citizen Journey

The complete prototype demo should work like this:

``` text
Citizen logs in
      ↓
Citizen Mapping Dashboard
      ↓
Search "Gat 42"
      ↓
System resolves ULPIN
      ↓
Map zooms to parcel
      ↓
Parcel highlighted
      ↓
Right panel opens
      ↓
Land information displayed
      ↓
Ownership resolved
      ↓
Documents displayed
      ↓
Citizen can:
      ├── View RoR
      ├── Download Parcel Map
      ├── Apply for Resurvey
      ├── Report Issue
      ├── Add to Watchlist
      └── Share Parcel
```

------------------------------------------------------------------------

# 46. Definition of Done

The citizen mapping prototype is complete when a demo user can:

-   open the existing citizen mapping page
-   see the unchanged government header
-   search for `ULPIN-MH-PUN-000001`
-   search using `Survey No. 104`
-   search using `Gat No. 42`
-   search using `Wagholi`
-   click `My Land`
-   see the synthetic cadastral neighborhood
-   identify parcel 104 / Gat 42
-   see the selected parcel highlighted
-   toggle map/reference layers
-   switch map/satellite/hybrid where supported
-   reset the map
-   view the parcel details
-   view ownership
-   view documents
-   view nearby features
-   see parcel status
-   view the prototype map source information
-   open the RoR action
-   download/export the parcel map
-   submit an `Apply for Resurvey` request
-   receive a synthetic resurvey application number
-   report an issue
-   add the parcel to the watchlist
-   share the parcel

Most importantly:

> **The map must be large, clear and understandable at first glance.**

The user should never feel that they are operating a complicated GIS
application.

------------------------------------------------------------------------

# 47. Recommended Final Screen

``` text
EXISTING GOVERNMENT HEADER
────────────────────────────────────────────────────────

CITIZEN LAND SERVICES

Explore Your Land on Interactive Map
Search by ULPIN, Survey No., Gat No., village or location.

[ Search ........................................ ] [Search]
[ULPIN] [Survey 104] [Gat 42] [Wagholi]

┌───────────────────────────────────┬────────────────────────┐
│                                   │ SELECTED PARCEL        │
│                                   │                        │
│                                   │ ULPIN                  │
│            LARGE MAP              │ ULPIN-MH-PUN-000001    │
│                                   │ Gat 42 (Survey 104)    │
│        ┌──────────────┐           │                        │
│        │              │           │ CLEAR                  │
│        │   ★ MY LAND  │           │                        │
│        │     104      │           │ Land Information       │
│        │              │           │ Ownership              │
│        └──────────────┘           │ Documents              │
│                                   │ Nearby                 │
│                                   │                        │
│                                   │ [View Official RoR]    │
│                                   │ [Download Parcel Map]  │
│                                   │                        │
│                                   │ [Apply for Resurvey]   │
│                                   │ [Report Issue]         │
└───────────────────────────────────┴────────────────────────┘

MAP INFORMATION
Center | CRS | Source

PARCEL STATUS | LOCATION | NEARBY FEATURES
```

------------------------------------------------------------------------

## 48. Implementation Priority

Build in this order:

### Phase 1 --- Map foundation

1.  Existing header preserved
2.  Page layout
3.  Map
4.  Basemap
5.  Synthetic cadastral GeoJSON
6.  Parcel selection

### Phase 2 --- Data linkage

7.  Search
8.  ULPIN resolver
9.  Citizen → ownership → parcel resolution
10. Parcel details panel
11. Ownership tab

### Phase 3 --- Citizen services

12. Documents
13. View RoR prototype
14. Download map
15. Apply for Resurvey
16. Report Issue
17. Watchlist
18. Share

### Phase 4 --- GIS polish

19. Layer control
20. Labels
21. Legend
22. Nearby spatial information
23. Map reset
24. Responsive behavior
25. Accessibility
26. Loading/error/empty states

### Phase 5 --- Integration-ready architecture

27. Bharat Maps adapter
28. Mock map provider
29. Normalized parcel API
30. Bhu-Naksha adapter interface placeholder

------------------------------------------------------------------------

## 49. Core Principle for Every Developer/AI Agent

When modifying this module, remember:

> **Do not build a GIS tool for GIS experts. Build a citizen land map.**

The citizen should be able to understand the selected property within
seconds.

**Large map + simple search + clear parcel + concise land information +
obvious citizen actions** is the final design direction.

The existing Government of India header is a fixed, protected UI
component and must not be redesigned as part of this module.
