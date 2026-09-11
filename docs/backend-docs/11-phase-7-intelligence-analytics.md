# Phase 7 — Intelligence & Analytics

**Goal**: Build the data quality engine, basic anomaly detection, and drill-down analytics/MIS dashboards that give officers governance intelligence from national overview down to individual parcel.

**Why Now**: With data flowing from multiple sources (Phases 3-6), we now have enough data to detect inconsistencies, measure performance, and provide actionable intelligence to decision-makers.

---

## What Gets Built

### Data Quality Engine
A background system that continuously cross-checks data across sources and flags inconsistencies:

- **Area mismatch detection**: Compare RoR-recorded area against PostGIS-calculated polygon area. Flag when discrepancy exceeds 10%.
- **Duplicate owner detection**: Identify cases where the same owner name (with fuzzy matching for transliteration variants) appears on multiple unrelated parcels — potential data entry error or suspicious pattern.
- **Stale projection detection**: Flag parcels whose data projections haven't been refreshed from the source system in over 48 hours.
- **Missing data detection**: Parcels with no geometry, parcels with no RoR, parcels with no ULPIN — track completeness metrics.
- **Encumbrance-registration mismatch**: A parcel with an active mortgage that has a recent sale registration — potential conflict.

Each issue is stored in `data_quality_issue` with severity (INFO, WARNING, CRITICAL), category, affected parcel, and suggested action.

### Data Quality Scoring
Every parcel gets a composite Data Quality Index (DQI) grade:
- **A**: All sources consistent, fresh, complete
- **B**: Minor issues (slight area discrepancy, one stale source)
- **C**: Moderate issues (missing a data layer, moderate area mismatch)
- **D**: Significant issues (multiple conflicts, very stale data)
- **E**: Critical issues (suspected fraud pattern, major data contradiction)

The DQI shows in Parcel 360° (citizen sees simplified version, officer sees details).

### Analytics & MIS Dashboards
Drill-down dashboards serving different levels of the governance hierarchy:

- **National Federation (DoLR)**: Cross-state comparison — ULPIN coverage %, RoR-Map integration %, mutation pendency rate by state, national audit health
- **State Governance (State Authority)**: Statewide rankings — mutation clearance rate, average processing days, tehsil SLA compliance, DQI distribution, integration uptime
- **Tehsil / Rural (CRO/Tehsildar)**: Tehsil-wide and village-by-village stats — pending mutations, hearing backlogs, notice period tracking, SLA adherence %
- **Urban Municipal (ULB Officer)**: Ward-level property tax integration %, municipal title updates, urban boundary disputes
- **Spatial Quality (Survey/GIS Officer)**: Geometry overlap reports, area mismatch rates, unmapped parcel counts across rural and urban pilot areas

### Basic Anomaly Flagging (Rule-Based)
Before full AI/ML models (which would be a future enhancement):
- Rule-based alerts: "Parcel transferred 3 times in 6 months" → flag for review
- SLA risk prediction: cases nearing SLA deadline with high pending queue depth → flag for escalation
- Pattern detection: cluster of mutations in same village by same buyer → potential land aggregation alert

These are labeled **ADVISORY** — they inform officers but never make decisions.

## Stakeholders Served
- **CRO/Tehsildar**: Data quality issues on parcels undergoing mutation; hearing pendency; anomaly flags
- **ULB/Municipal Officer**: Urban tax discrepancy flags and municipal zoning anomaly alerts
- **State Authority**: Statewide DILRMP compliance metrics, district/tehsil SLA rankings
- **DoLR / National**: Cross-state federation benchmarking and national coverage KPIs
- **Survey/GIS Officer**: Area and boundary mismatch reports, spatial topological defect logs
- **SRO**: Pre-registration risk flags and encumbrance alerts
- **Citizen**: Simplified data health score on their parcel in Parcel 360°

## Key Decisions
- **Rule-based first, ML later**: We start with deterministic rules (area > 10% mismatch = flag) rather than ML models. This is simpler, more explainable, and sufficient for initial deployment. ML models can be added in a future phase.
- **Pre-computed aggregates**: Analytics dashboards use materialized views pre-computed on a schedule (hourly/daily), not real-time aggregation queries that would be slow on large datasets.
- **ADVISORY label mandatory**: Every anomaly flag, every risk score, every AI-generated insight carries the ADVISORY label. Officers are reminded that these are suggestions, not decisions.

## Dependencies
- Phase 3 (Parcel Core) — parcel and GIS data to analyze
- Phase 4 (Workflows) — mutation data for SLA analytics
- Phase 5 (Govt Operations) — dashboards need role-scoped endpoints

## Exit Criteria
- Data quality checks run on schedule and populate data_quality_issue table
- DQI grades appear on parcels in Parcel 360°
- District-level dashboard shows tehsil comparison metrics
- State-level dashboard shows district rankings
- Anomaly flags appear in officer work queues (labeled ADVISORY)
- Analytics queries complete within 5 seconds even for state-level aggregations

## Risks
- **False positives**: Overly aggressive anomaly rules may flood officers with noise. Mitigated by tunable thresholds and a feedback mechanism (officer can dismiss with reason).
- **Aggregate query performance**: State-level aggregations across millions of parcels. Mitigated by materialized views and partitioned tables.

## References
- [AI_INTELLIGENCE_ARCHITECTURE.md](../../docs/AI_INTELLIGENCE_ARCHITECTURE.md) — AI advisory architecture
- [ANALYTICS_MIS.md](../../docs/ANALYTICS_MIS.md) — Analytics requirements
- [01-prd.md](../../docs/01-prd.md) FR-G9 and FR-G10 — Analytics and AI requirements
- [phases.md](../../docs/phases.md) Phases 11-13 — Intelligence, Analytics, Data Quality
