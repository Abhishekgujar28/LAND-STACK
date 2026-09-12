# SIH_26014 — Citizen Mapping Module | AI Agent Prompt

## Objective
Implement/refine the **citizen-facing land mapping module** for SIH_26014. Build a convincing, functional prototype—not the full production land-record platform.

Citizen flow:

Search → Find Parcel → Cadastral Map → Select Parcel → Identify ULPIN/Survey/Gat → View Land Info → Citizen Action.

---

## 1. NON-NEGOTIABLE: GOVERNMENT HEADER

**Do NOT modify the existing government header.**

Preserve exactly:
- Department of Land Resources branding
- BharatBhumi/project branding
- Digital India branding
- Existing header layout, typography, spacing and navigation

All work must happen below the existing header.

---

## 2. SCOPE: CITIZEN MAPPING ONLY

Do not build or redesign:
- SRO dashboard
- CRO/Tehsildar dashboard
- Survey/GIS Officer dashboard
- ULB dashboard
- DOLR/Super Admin dashboard
- Full registration workflow
- Full court workflow
- Production authentication

---

## 3. REAL LOCATION

Use this real geographic reference:

```json
{
  "name": "Wagholi",
  "tehsil": "Haveli",
  "district": "Pune",
  "state": "Maharashtra",
  "country": "India",
  "latitude": 18.5793,
  "longitude": 73.9812
}
```

Target demonstration parcel:

```json
{
  "ulpin": "ULPIN-MH-PUN-000001",
  "survey_number": "104",
  "gat_number": "42",
  "village": "Wagholi",
  "tehsil": "Haveli",
  "district": "Pune",
  "state": "Maharashtra",
  "area": 1.45,
  "area_unit": "Hectare",
  "land_use": "Agricultural",
  "classification": "Jirayat",
  "status": "CLEAR"
}
```

---

## 4. DATA-PROVENANCE RULE

**Never fabricate an official cadastral boundary.**

Separate:

### Real/reference geography
Use permitted real GIS data for:
- Roads
- Settlements
- Water bodies
- Administrative boundaries
- Other non-cadastral context

Preferred source: **Bharat Maps / NIC**
https://bharatmaps.gov.in/

### Prototype cadastral data
Until an authorized Bhu-Naksha/state cadastral source is connected:
- Use deterministic synthetic parcel geometry.
- Mark it explicitly as `SYNTHETIC`.
- Never call it an official/legal boundary.
- Never derive a legal boundary from satellite imagery or a centroid.

Later architecture:

```text
PrototypeCadastralAdapter
        ↓ replaceable by
BhuNaksha / Authorized State Cadastral Adapter
```

The citizen UI must not change when the provider changes.

---

## 5. PRIMARY MAP EXPERIENCE

Default mode:

### Cadastral Map

It must look like a real cadastral/land-record GIS, not a satellite image with one green polygon.

Show:
- Light neutral cadastral background
- Selected parcel
- Neighboring parcel boundaries
- Parcel labels
- Gat/Survey labels
- Roads
- Settlements
- Water bodies where available
- Subtle administrative context

Selected parcel:
- Strong green outline
- Light green transparent fill
- Label: `Gat 42 / Survey 104`

Neighbor parcels:
- Thin boundaries
- Subtle fill
- Labels at useful zoom levels

The target parcel must be geographically anchored around the Wagholi reference location.

Create approximately **20–100 deterministic synthetic neighboring parcels** to make the cadastral neighborhood believable.

---

## 6. MAP MODES

Only provide:

1. **Cadastral Map** — default
2. **Satellite Reference** — secondary

Remove:
- Hybrid View
- Generic Map View
- Professional GIS editing tools

Satellite is contextual only and must never be presented as the cadastral boundary source.

---

## 7. REMOVE THESE CONTROLS

Do NOT show:
- Measure Distance
- Measure Area
- Large Layers panel
- Large Legend panel
- Hybrid View
- Complex GIS analysis/editing controls

Keep only useful citizen controls:
- Zoom in/out
- Reset
- Search/locate result
- Fullscreen if useful
- Cadastral/Satellite Reference toggle

---

## 8. PAGE LAYOUT

Keep the existing government header unchanged.

Below it:

```text
┌──────────────────────────────────────────────────────────────┐
│ Search by ULPIN / Survey / Gat / Village                    │
├───────────────┬───────────────────────────────┬──────────────┤
│ Citizen Nav   │                               │ Selected     │
│               │       LARGE CADASTRAL MAP     │ Parcel Info  │
│ My Land       │                               │              │
│ Search Land   │                               │ Overview     │
│ Services      │                               │ Ownership    │
│               │                               │ Documents    │
│               │                               │ Nearby       │
├───────────────┴───────────────────────────────┴──────────────┤
│ Parcel Snapshot | Location & Context | Map Reference         │
└──────────────────────────────────────────────────────────────┘
```

Map target: **65–70%** of main content.
Info panel: **30–35%**.

Keep the interface spacious and uncluttered.

---

## 9. SEARCH

Prominent search placeholder:

`Search by ULPIN, Survey No., Gat No., Village or Location`

Prototype searches must support:
- `ULPIN-MH-PUN-000001`
- `104`
- `42`
- `Wagholi`
- `Pune`

Selecting a result must:
1. Center the map.
2. Zoom to the parcel.
3. Highlight the parcel.
4. Open the parcel information panel.

---

## 10. MY LAND

Citizen shortcut:

`My Land`

Use the supplied prototype citizen:

```json
{
  "id": "CIT-001",
  "name": "Aarav Patil",
  "local_name": "आरव पाटील",
  "state_code": "MH",
  "mobile": "+91 98230 45891",
  "email": "aarav.patil@example.com",
  "aadhaar_hash": "XXXX-XXXX-8912",
  "kyc_verified": true
}
```

Show:
- Aarav Patil
- ULPIN-MH-PUN-000001
- Gat 42
- Survey 104
- Wagholi

Do not expose Aadhaar/hash information in the map UI.

---

## 11. NORMALIZED PARCEL CONTRACT

Frontend must consume a provider-independent model:

```json
{
  "ulpin": "ULPIN-MH-PUN-000001",
  "identifiers": {
    "survey_number": "104",
    "gat_number": "42",
    "plot_number": null
  },
  "administrative": {
    "state": {"code": "MH", "name": "Maharashtra"},
    "district": {"code": "DIST-PUN", "name": "Pune"},
    "tehsil": {"code": "TEH-HAV", "name": "Haveli"},
    "village": {"code": "VIL-WAG", "name": "Wagholi"},
    "ward": null
  },
  "location": {
    "centroid": {
      "latitude": 18.5793,
      "longitude": 73.9812
    },
    "crs": "EPSG:4326",
    "geometry": {
      "type": "Polygon",
      "coordinates": []
    }
  },
  "land": {
    "area": 1.45,
    "area_unit": "Hectare",
    "land_use": "Agricultural",
    "classification": "Jirayat"
  },
  "status": {
    "record_status": "CLEAR",
    "verification_status": "PROTOTYPE"
  },
  "source": {
    "reference_map": "Bharat Maps / NIC",
    "cadastral": "Prototype Synthetic Geometry",
    "geometry_status": "SYNTHETIC"
  }
}
```

Use GeoJSON for geometry.

For API interchange/display use `EPSG:4326`. For accurate local measurements, use an appropriate projected CRS.

---

## 12. PARCEL INFORMATION PANEL

Show:

```text
SELECTED LAND

Gat No. 42
Survey No. 104

ULPIN
ULPIN-MH-PUN-000001

Location
Wagholi, Haveli, Pune
Maharashtra

Area
1.45 Hectare

Land Use
Agricultural

Classification
Jirayat

Status
CLEAR
```

Tabs:
- Overview
- Ownership
- Documents
- Nearby

---

## 13. OWNERSHIP

Prototype:

```json
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
- Owner: Aarav Patil
- Share: 100%
- Relation: Sole Owner
- Identity Status: Verified

Never expose sensitive identity numbers.

---

## 14. DOCUMENTS

Provide:
- View Official RoR
- Download Parcel Map

Possible prototype statuses:
- Record of Rights — Available
- Parcel Map — Available
- Mutation Record — View Status

If no live government API exists, explicitly show:

`Prototype / Demonstration Data`

Do not represent generated documents as official government records.

---

## 15. NEARBY

Show contextual information:
- Nearby roads
- Nearby settlements
- Nearby water bodies
- Administrative location

Use real/reference geography where permitted.

---

## 16. CITIZEN ACTIONS

### Apply for Resurvey — REQUIRED

Button:

`Apply for Resurvey`

Form:

```text
Apply for Resurvey

ULPIN: ULPIN-MH-PUN-000001

Reason
[ Select reason ]

Description
[ Text area ]

Preferred contact
[ Mobile / Email ]

[ Submit Request ]
```

Reasons:
- Boundary dispute
- Boundary not visible
- Area mismatch
- Map discrepancy
- Other

After submission:

```text
Resurvey Request Submitted

Request ID: RES-2026-0001

Status: Submitted
```

This is a prototype workflow.

### Report Issue
Types:
- Incorrect parcel information
- Boundary discrepancy
- Wrong location
- Missing parcel
- Other

Return a prototype request ID.

### Add to Watchlist
Store ULPIN locally and show confirmation.

### Share Parcel
Generate/copy a route such as:

`/share/parcel/ULPIN-MH-PUN-000001`

### Download Parcel Map
Generate a clean map representation and label it prototype/demo until official cadastral integration exists.

---

## 17. MAP CONTEXT DATA

Create `map_context.json`:

```json
{
  "target_location": {
    "name": "Wagholi",
    "tehsil": "Haveli",
    "district": "Pune",
    "state": "Maharashtra",
    "country": "India"
  },
  "center": {
    "lat": 18.5793,
    "lng": 73.9812
  },
  "target_parcel": {
    "ulpin": "ULPIN-MH-PUN-000001",
    "survey_number": "104",
    "gat_number": "42",
    "area": 1.45,
    "area_unit": "Hectare"
  },
  "real_reference_data": [
    "roads",
    "settlements",
    "water_bodies",
    "administrative_boundaries"
  ],
  "prototype_data": [
    "cadastral_geometry",
    "ULPIN",
    "survey_number",
    "gat_number",
    "ownership",
    "land_use",
    "classification"
  ],
  "map_priority": [
    "cadastral",
    "roads",
    "settlements",
    "water_bodies"
  ],
  "map_modes": [
    "Cadastral Map",
    "Satellite Reference"
  ],
  "removed_controls": [
    "Measure Distance",
    "Measure Area",
    "Layers",
    "Legend",
    "Hybrid View"
  ],
  "citizen_actions": [
    "View Official RoR",
    "Download Parcel Map",
    "Apply for Resurvey",
    "Add to Watchlist",
    "Report Issue",
    "Share Parcel"
  ]
}
```

---

## 18. PROVIDER ADAPTER ARCHITECTURE

Use:

```text
frontend
   ↓
normalized parcel/reference API
   ↓
provider adapters
   ├── PrototypeCadastralAdapter
   ├── BharatMapsReferenceAdapter
   └── FutureBhuNakshaAdapter
```

Suggested interfaces:

```ts
interface CadastralProvider {
  searchParcel(query: string): Promise<Parcel[]>;
  getParcel(ulpin: string): Promise<Parcel>;
  getParcelsNear(lat: number, lng: number): Promise<Parcel[]>;
}

interface ReferenceMapProvider {
  getRoads(bounds: Bounds): Promise<GeoJSON>;
  getSettlements(bounds: Bounds): Promise<GeoJSON>;
  getWaterBodies(bounds: Bounds): Promise<GeoJSON>;
  getAdministrativeContext(bounds: Bounds): Promise<GeoJSON>;
}
```

Do not couple the frontend to Bharat Maps or Bhu-Naksha-specific formats.

---

## 19. SUGGESTED API

```text
GET  /api/citizen/land
GET  /api/parcels/search?q=
GET  /api/parcels/:ulpin
GET  /api/parcels/:ulpin/ownership
GET  /api/parcels/:ulpin/documents
GET  /api/parcels/:ulpin/nearby

POST /api/resurvey-requests
POST /api/issues
POST /api/watchlist

GET /api/reference/roads
GET /api/reference/settlements
GET /api/reference/water-bodies
GET /api/reference/admin
```

Local JSON/mock APIs are acceptable for the prototype.

---

## 20. FILE STRUCTURE

Adapt to the existing project's stack; do not rewrite unrelated modules.

```text
citizen-mapping/
├── frontend/
│   ├── components/
│   │   ├── CitizenMap
│   │   ├── ParcelSearch
│   │   ├── ParcelInfoPanel
│   │   ├── ParcelTabs
│   │   ├── ResurveyModal
│   │   ├── IssueModal
│   │   └── MapModeToggle
│   ├── data/
│   │   ├── citizen.json
│   │   ├── parcels.json
│   │   ├── ownership.json
│   │   ├── map_context.json
│   │   └── reference_layers/
│   └── services/
│       ├── parcelService
│       ├── referenceMapService
│       └── resurveyService
└── backend/
    ├── routes/
    ├── services/
    ├── providers/
    │   ├── PrototypeCadastralAdapter
    │   ├── BharatMapsReferenceAdapter
    │   └── BhuNakshaAdapter
    └── data/
```

---

## 21. ERROR STATES

Parcel not found:

```text
No land parcel found

Try searching with:
ULPIN
Survey Number
Gat Number
Village
```

Reference GIS unavailable:

```text
Reference map temporarily unavailable.
Showing cached demonstration geography.
```

Official record unavailable:

```text
Official record connection is not available in this prototype.
```

Never silently replace unavailable official data with fabricated official-looking data.

---

## 22. ACCESSIBILITY + RESPONSIVE

Desktop:
- Large map
- Right info panel

Mobile:
- Map first
- Info becomes bottom sheet/drawer
- Search remains prominent
- Actions remain accessible

Include:
- Keyboard navigation
- Clear focus states
- Accessible buttons
- Good contrast
- Text representation of selected parcel
- Do not rely only on color

---

## 23. DEMO DATA

Seed the prototype with:
- Aarav Patil
- Target Gat 42 / Survey 104
- ULPIN-MH-PUN-000001
- 20–100 deterministic neighboring synthetic parcels
- Real/reference geography around Wagholi where permitted
- Roads
- Administrative context

The same geometry should appear on every demo run.

---

## 24. DEMO SCRIPT

The finished prototype must support:

1. Open citizen land map.
2. Search `ULPIN-MH-PUN-000001`.
3. Map centers/zooms to Wagholi.
4. Gat 42 / Survey 104 is highlighted.
5. ULPIN and land details are visible.
6. Open Ownership.
7. Open Documents.
8. Click Apply for Resurvey.
9. Submit request.
10. Show `RES-2026-0001 — Submitted`.

The entire flow should be smooth enough for an SIH presentation/demo.

---

## 25. ACCEPTANCE CHECKLIST

### Header
- [ ] Existing government header unchanged.

### Search
- [ ] ULPIN search works.
- [ ] Survey search works.
- [ ] Gat search works.
- [ ] Village search works.

### Map
- [ ] Cadastral Map is default.
- [ ] Map is large and readable.
- [ ] Target parcel selected.
- [ ] Neighbor parcels visible.
- [ ] Parcel labels visible.
- [ ] Real/reference roads visible where available.
- [ ] Satellite Reference available.
- [ ] Hybrid View absent.
- [ ] Measure Distance absent.
- [ ] Measure Area absent.
- [ ] Large Layers control absent.
- [ ] Large Legend control absent.

### Parcel
- [ ] ULPIN visible.
- [ ] Survey visible.
- [ ] Gat visible.
- [ ] Area visible.
- [ ] Land use visible.
- [ ] Classification visible.
- [ ] Status visible.

### Actions
- [ ] View Official RoR exists.
- [ ] Download Parcel Map exists.
- [ ] Apply for Resurvey works.
- [ ] Report Issue works.
- [ ] Add to Watchlist works.
- [ ] Share Parcel works.

### Data integrity
- [ ] Synthetic cadastral geometry explicitly marked synthetic.
- [ ] No synthetic geometry claimed as official/legal.
- [ ] Real reference geography separated from cadastral data.
- [ ] Provider adapter architecture present.

### UX
- [ ] No unnecessary GIS clutter.
- [ ] Desktop works.
- [ ] Mobile is usable.
- [ ] Accessibility basics implemented.
- [ ] Loading/error states implemented.

---

# FINAL INSTRUCTION TO THE AI AGENT

First inspect the existing project and identify the current government header and map implementation.

Then implement this module **without modifying the protected government header or unrelated features**.

The visual target is:

> A clean, modern Indian government cadastral land-information portal where the citizen immediately understands: **“This is my land, this is where it is, this is its parcel identity, and these are the actions I can take.”**

Architecture:

```text
REAL REFERENCE GEOGRAPHY
(Bharat Maps / permitted GIS)
             +
SYNTHETIC CADASTRAL DEMO DATA
             ↓
NORMALIZED GIS/PARCEL API
             ↓
CITIZEN CADASTRAL MAP
             ↓
PARCEL INFORMATION
             ↓
CITIZEN ACTIONS
```

**Critical rule:** real roads/settlements/admin geography may be used as reference data, but the prototype cadastral polygon must be explicitly synthetic until an authorized Bhu-Naksha/state cadastral source is connected.

**Do not fabricate legal land boundaries.**

**Do not modify the existing government header.**
