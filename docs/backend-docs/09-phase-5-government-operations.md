# Phase 5 — Government Operations

**Goal**: Build the jurisdiction-scoped workspaces, work queues, case management, and officer dashboards that let government officers do their jobs within Land Stack.

**Why Now**: With auth (Phase 2), parcel data (Phase 3), and workflows (Phase 4) in place, government officers can now meaningfully interact with the system — viewing their assigned cases, processing verifications, and making decisions.

---

## What Gets Built

### Role-Specific Work Queues
Each government role sees a personalized work queue when they log in — not a generic dashboard, but a **task-first workspace** showing exactly what needs their attention in their active context:

- **SRO Queue (Registration Desk — Rural & Urban)**: Registered deeds awaiting verification, pre-registration encumbrance & restriction checks, deed metadata forwarding to revenue/ULB.
- **CRO/Tehsildar Queue (Rural Sanction Desk)**: Mutation cases ready for statutory sanction (post GIS/field verification), disputed cases requiring formal revenue hearings, notice period tracking, and statutory order issuance.
- **Survey/GIS Officer Queue (Verification Desk — Shared)**: Spatial discrepancies, cadastral boundary alignment tasks, sub-division verification, field measurement reports, and geotagged survey reviews across rural and urban pilots.
- **ULB/Municipal Officer Queue (Urban Desk)**: Urban title updates, property tax register mutations, building permission clearances, and municipal parcel attribute updates.
- **State Authority & DoLR Consoles**: Escalated SLA breach queues, cross-jurisdiction exception monitors, statewide pendency overviews, and national federation synchronization status.

### Case Management
- **Case dossier view**: For any mutation case, show everything in one screen — the registered deed, Survey/GIS spatial reports with boundary overlays, the parcel's Parcel 360° data, the AI advisory (if enabled), officer notes, and the timeline of all actions taken.
- **Task assignment and routing**: Automated and manual routing of spatial verification to Survey/GIS officers within the assigned jurisdiction.
- **Statutory action gate**: Enforce that only the CRO/Tehsildar has the statutory authority to execute `APPROVE` or `REJECT` on rural mutations, requiring MFA re-authentication.

### Jurisdiction-Scoped Dashboards
- **SRO**: "My Registration Jurisdiction" — pending registrations, forward queue to mutation, deed encumbrance hits
- **CRO/Tehsildar**: "My Tehsil" — pending rural mutations, SLA adherence rate, hearing schedule, notice period timer
- **Survey/GIS Officer**: "My Spatial Jurisdiction" — pending spatial verifications, boundary mismatch alerts, area validation reports
- **ULB/Municipal Officer**: "My Ward / Municipal Area" — urban property mutations, tax assessment linkages, zoning compliance
- **State Authority**: "Statewide Governance Console" — district/tehsil SLA rankings, integration health, DILRMP compliance indicators
- **DoLR / National**: "National Federation Console" — interstate benchmarking, ULPIN adoption progress, national audit health

### State-Aware Vernacular
- Dynamic label rendering from `state_config`: Revenue Officer titles ("Tehsildar" vs "Mamlatdar"), registration terms, local revenue nomenclature
- Form "7/12 Extract" in Maharashtra becomes "Khatauni" in UP, "RTC" in Karnataka, "Patta" in Tamil Nadu
- Area units: "Guntha" (MH) vs "Cent" (TN) vs "Bigha" (UP) vs "Sq. Meters / Yards" (Urban)

### Officer Parcel 360° (Extended View)
Everything the citizen sees in Parcel 360°, PLUS:
- Full provenance with raw source system references
- Complete workflow history (every mutation that ever touched this parcel)
- Officer action audit trail
- Cross-source data conflicts highlighted
- AI advisory panel (when Phase 7 is complete)
- Integration freshness status (which sources are stale)

## Stakeholders Served
- **SRO**: Pre-registration checks and post-registration deed forwarding (Rural & Urban contexts)
- **CRO/Tehsildar**: Statutory rural mutation sanction authority and hearing workspace
- **Survey/GIS Officer**: Shared spatial unit verification and cadastral discrepancy resolution
- **ULB/Municipal Officer**: Urban municipal land governance and property tax integration
- **State Authority & DoLR**: Statewide and national monitoring, analytics, and federation governance

## Key Decisions
- **Task-first, not data-first**: Officers should see their TO-DO list on login, not a search bar. The primary interaction pattern is queue-driven.
- **Statutory Authority Isolation**: Clear legal demarcation — SRO registers and forwards; Survey/GIS verifies spatial units; only CRO/Tehsildar sanctions rural mutations; ULB handles urban records. No role can perform another's statutory duties.
- **Dual-Context SRO**: SRO operates across both rural and urban pilot parcels to reflect real Indian sub-registry jurisdiction.
- **Vernacular from config, not code**: State-specific labels come from the database, not hardcoded strings. Adding a new state's terminology is a database insert, not a code deployment.

## Dependencies
- Phase 2 (Auth) — role-based JWT claims, context resolution, and RLS
- Phase 3 (Parcel Core) — parcel data for case context
- Phase 4 (Workflows) — mutation cases and work queue data

## Exit Criteria
- Each of the 5 government personas sees their context-specific workspace and work queue on login
- SRO can perform pre-registration encumbrance checks and trigger mutation forwarding
- Survey/GIS Officer can review spatial discrepancies and verify cadastral boundaries
- CRO/Tehsildar can review case dossier, conduct hearings, and execute statutory APPROVE/REJECT with MFA
- ULB Officer can process urban municipal mutations and tax records
- State Authority and DoLR consoles display real-time analytics and SLA alerts
- Labels render correctly per state (MH vs KA vs UP terminology)

## Risks
- **UI complexity**: Government workspaces are feature-rich. Risk of overwhelming officers with too many options. Mitigated by progressive disclosure — primary actions prominent, advanced features in menus.
- **Performance of jurisdiction-scoped queries**: Aggregate dashboards spanning thousands of parcels. Mitigated by materialized views and indexed jurisdiction columns.

## References
- [GOVERNMENT_PORTAL_ARCHITECTURE.md](../../docs/GOVERNMENT_PORTAL_ARCHITECTURE.md) — Role workspace specifications
- [02-personas.md](../../docs/02-personas.md) — Detailed persona specs and dashboard KPIs
- [ROLE_PORTAL_MATRIX.md](../../docs/ROLE_PORTAL_MATRIX.md) — Permission matrix
- [phases.md](../../docs/phases.md) Phases 9-10 — Government Operations and Case Management
