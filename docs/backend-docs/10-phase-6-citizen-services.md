# Phase 6 — Citizen Services

**Goal**: Build the citizen-facing experience — Parcel 360° unified view, mutation tracking, watchlist alerts, service applications, and document access — so that a citizen on a 2G phone in rural India can see everything about their land in one place.

**Why Now**: The backend now has auth, parcel data, GIS, and workflows. The citizen-facing APIs assemble these into user-friendly endpoints that the frontend PWA consumes.

---

## What Gets Built

### Parcel 360° (Citizen Mode)
The flagship feature. A single API endpoint that returns the complete picture of a land parcel, assembled from multiple data sources:

1. **Overview Tab**: ULPIN, all state identifiers, area (recorded + calculated), land classification, status, provenance
2. **Map Tab**: Interactive cadastral map with parcel boundary highlighted, satellite toggle, GPS locate
3. **Ownership Tab**: Current owners, right type, share percentage, ownership history timeline
4. **Transaction History Tab**: Timeline of deed registrations affecting this parcel
5. **Encumbrances Tab**: Active mortgages, liens, bank charges with lender details
6. **Restrictions Tab**: Forest land, tribal area, CRZ zone, court injunction, acquisition notification — each with source attribution
7. **Planning Tab**: Zoning (residential/commercial/industrial), FSI/FAR, building permission status
8. **Tax Tab**: Property tax assessment, dues, last payment date
9. **Courts Tab**: Active revenue/civil court cases, hearing dates, orders
10. **Data Health Tab**: Completeness, consistency, and currency scores — showing the citizen how reliable each data source is

Every field carries a provenance badge showing source system, authority, and retrieval timestamp.

A non-dismissible legal disclaimer is included: "This information is derived from government sources and is provided for reference only. For legally binding records, contact the relevant government department."

### Mutation Tracking
- Visual 12-state timeline showing where the citizen's mutation currently stands
- Each completed step shows: who did it, when, and what happened
- SLA traffic light: GREEN (on schedule), YELLOW (nearing deadline), RED (overdue)
- Real-time updates via Supabase Realtime (no page refresh needed)
- Push notification at each state transition

### Watchlist & Alerts
- Citizens add parcels to their watchlist (even parcels they don't own — for prospective buyers)
- Configurable alert types: ownership change, new encumbrance, court case linked, boundary change, tax status change
- Alert delivery: SMS, email, in-app notification — per citizen preference
- Change detection via database triggers on watched parcel's related tables

### Service Applications
- Apply for RoR Extract / Certified Copy
- Apply for Non-Encumbrance Certificate (NEC)
- Submit Data Correction Request (e.g., "My father's name is misspelled")
- Submit Grievance / Dispute Intimation
- Each application tracked with status: Draft → Submitted → Under Verification → Resolved

### Document Access
- Download digitally-signed RoR extracts (7/12, RTC, Patta) for owned parcels
- View registered deed summaries
- Access via Supabase Storage with presigned URLs (time-limited access)

## Stakeholders Served
- **Citizen**: Full self-service experience — search, view, track, watch, apply, download

## Key Decisions
- **Parallel data fetching for Parcel 360°**: The 10 tabs fetch from different tables concurrently (ownership, geometry, encumbrances, etc.), not sequentially. Response time target: < 2 seconds P95.
- **Progressive loading**: On slow 2G connections, the overview and map tabs load first; other tabs load on demand (lazy loading).
- **Provenance on everything**: No data point is displayed without source attribution. This builds citizen trust.
- **Legal disclaimer is non-dismissible**: Cannot be closed or hidden — always visible on Parcel 360°. Legal requirement for derived/projected data.

## Dependencies
- Phase 2 (Auth) — citizen JWT and RLS
- Phase 3 (Parcel Core) — parcel data and search
- Phase 4 (Workflows) — mutation status for tracking

## Exit Criteria
- Parcel 360° endpoint returns all 10 tabs for a known parcel in < 2 seconds
- Mutation tracking shows correct real-time status
- Watchlist alert fires within 30 seconds of a relevant change
- Service application can be submitted and tracked
- Document download works with presigned URL
- Works on simulated 2G connection (< 200KB initial payload)

## Risks
- **Data assembly latency**: 10 concurrent data fetches could be slow if any source is slow. Mitigated by circuit breaker patterns — if one source times out, serve the other 9 tabs and show "Data unavailable" for the slow one.
- **2G performance**: Heavy payloads kill 2G connections. Mitigated by progressive loading, lazy tab rendering, and aggressive response compression.

## References
- [citizen-features.md](../../docs/citizen-features.md) — Citizen feature specifications
- [01-prd.md](../../docs/01-prd.md) FR-C1 through FR-C6 — Citizen functional requirements
- [workflows.md](../../docs/workflows.md) Sections 2-9 — Citizen workflows
- [00-product-vision.md](../../docs/00-product-vision.md) Section 3.1 — Citizen Experience Plane
