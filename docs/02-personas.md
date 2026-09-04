# Land Stack — Consolidated Persona Definitions (8 Core Roles)

**Version**: 2.1 | **Date**: September 2026  
**Scope**: Consolidated 8-Role Architecture — 1 Citizen Role + 7 Government Roles  
**Design Principle**: Maximum operational clarity, zero intermediate role overhead, clean statutory boundaries.

---

## The 8 Consolidated Roles Summary

```
CITIZEN PLANE (1 Role)
└── 1. Citizen Land Owner (Public search, Parcel 360°, Applications, Watchlist, Documents)

GOVERNMENT OPERATIONS PLANE (7 Roles)
├── 2. Talathi / Patwari (Village/Circle field verification, observations, photos, discrepancies)
├── 3. Tehsildar (Tehsil statutory decision-maker, mutation sanction, hearings, orders; absorbs RI & SDM)
├── 4. Sub-Registrar (SRO) (Registration area deed integration, pre-registration parcel verification)
├── 5. District Collector (District-level governance oversight, exception escalations, analytics)
├── 6. State PMU Head (State-wide implementation monitoring, integration health, AI executive briefs)
├── 7. DoLR / National Monitor (National cross-state governance, DILRMP compliance, interstate metrics)
└── 8. System Administrator (Platform configuration, state adapters, IAM/RBAC, security, audit trail)
```

---

## Part 1: Citizen Plane (1 Role)

### 1. Citizen Land Owner

| Dimension | Specification |
|---|---|
| **Role Objective** | Discover land parcels, inspect unified Parcel 360° data, submit service applications, monitor mutation lifecycles, configure watchlists, and retrieve certified documents. |
| **User Profile** | Any individual, farmer, landholder, prospective buyer, NRI owner, or citizen representative accessing land records. |
| **Jurisdiction Scope** | **Global / Any Parcel**: Public summary view.<br/>**Linked / Owned Parcels**: Full view of ownership, tax dues, encumbrance details, and personal service applications. |
| **Authentication** | Mobile OTP (Keycloak Citizen Realm) with optional Aadhaar eKYC / DigiLocker verification; DPDP Act consent ledger logging. |
| **Key Permissions** | `VIEW_PUBLIC`, `VIEW_OWNED`, `SEARCH`, `APPLY_SERVICE`, `TRACK_MUTATION`, `MANAGE_WATCHLIST`, `DOWNLOAD_DOC`. |
| **Dashboard KPIs** | • My Saved / Owned Parcels<br/>• Active Mutations Underway<br/>• Pending Applications (RoR extract, NEC, Corrections, Grievances)<br/>• Unread Watchlist Alerts & Notifications |
| **Active Work Queues** | • My Applications Queue (Draft, Submitted, Under Verification, Resolved)<br/>• My Watchlist (Real-time event feed for monitored parcels) |
| **Key Actions** | 1. Execute multi-modal parcel search (ULPIN, Survey/Gat/Khasra No, Owner Name, Map Pin).<br/>2. View 10-tab Citizen Parcel 360° (Map, Ownership, Encumbrances, Restrictions, Tax, Zoning, Court Status).<br/>3. Submit service applications (Certified Extract, Non-Encumbrance Certificate, Grievance, Boundary Check).<br/>4. Track mutation progress through the interactive 12-state visual timeline.<br/>5. Set up instant SMS/email alerts on parcel ownership or encumbrance updates. |
| **Document Access** | View and download digitally signed extracts (7/12, RTC, Patta), registered deed summaries, and receipt certificates via DigiLocker. |
| **GIS Capabilities** | MapLibre GL cadastral overlay, satellite basemap toggle, GPS-based location lookup, parcel boundary inspection. |
| **Sensitive Data Restriction** | Strictly prohibited from viewing other citizens' contact numbers, Aadhaar tokens, internal officer notes, draft recommendations, or internal fraud scores. |

---

## Part 2: Government Operations Plane (7 Roles)

### 2. Talathi / Patwari (Village Revenue Officer)

| Dimension | Specification |
|---|---|
| **Role Objective** | Execute on-the-ground field verifications, conduct boundary checks, upload geotagged site photographs, record initial field findings, and submit recommendations for mutations and disputes. |
| **Administrative Scope** | Assigned Village(s) and Circle within a Tehsil. |
| **Authentication** | Government SSO / Jan Parichay with TOTP/SMS MFA (Keycloak Government Realm). |
| **Key Permissions** | `VIEW_JURISDICTION`, `SEARCH_JURISDICTION`, `FIELD_VERIFY`, `UPLOAD_PHOTOS`, `RECORD_FINDINGS`, `RAISE_DISCREPANCY`, `SUBMIT_RECOMMENDATION`. |
| **Dashboard KPIs** | • Pending Field Verifications<br/>• Cases Approaching Verification SLA (<3 days)<br/>• Active Data Discrepancies Reported<br/>• Verifications Completed This Week |
| **Active Work Queues** | 1. **Field Verification Queue**: Mutation cases triggered by registration webhooks or citizen requests.<br/>2. **Citizen Clarification Queue**: Applications returned by citizens with updated evidence.<br/>3. **Discrepancy Notices Queue**: Parcels with automated RoR vs. GIS spatial mismatches. |
| **Key Actions** | 1. Access Officer Parcel 360° for parcels within assigned village(s).<br/>2. Inspect registered deed extracts and boundary drawings.<br/>3. Record geotagged site observations and upload timestamped field photos.<br/>4. Confirm parcel physical possession and boundary validity.<br/>5. Submit structured recommendation (`RECOMMEND_SANCTION` or `RAISE_OBJECTION`) directly to the Tehsildar. |
| **Approvals / Statutory** | **No statutory decision power**. Submits ground-level advisory recommendations only. |
| **GIS Capabilities** | View village cadastral boundary layers, mark observed boundary pins, check adjoining parcel owners. |
| **AI Land Intelligence** | Receives automated parcel discrepancy alerts (e.g., recorded area vs. digitized polygon mismatch >10%). |
| **Sensitive Data Scope** | Accesses owner names and parcel identifiers in assigned villages. Cannot access administrative records outside assigned boundary. |

---

### 3. Tehsildar (Primary Statutory Decision Maker)

| Dimension | Specification |
|---|---|
| **Role Objective** | Act as the primary competent revenue authority for the Tehsil: review verification reports, conduct hearings, issue statutory orders, sanction or reject mutations, resolve data conflicts, and enforce citizen charter SLAs. (Absorbs Revenue Inspector supervisory and SDM appellate duties). |
| **Administrative Scope** | Entire Tehsil / Taluka (encompassing all circles and villages). |
| **Authentication** | Government SSO with Hardware Token / TOTP MFA. |
| **Key Permissions** | `VIEW_TEHSIL`, `SEARCH_TEHSIL`, `REVIEW_CASE`, `SCHEDULE_HEARING`, `RECORD_HEARING`, `STATUTORY_APPROVE`, `STATUTORY_REJECT`, `RETURN_CLARIFICATION`, `ISSUE_ORDER`, `RESOLVE_DISCREPANCY`, `REASSIGN_TASK`. |
| **Dashboard KPIs** | • Mutations Awaiting Sanction<br/>• Hearings Scheduled This Week<br/>• SLA Breached Cases (>30 Days)<br/>• Talathi Verification Pendency by Village<br/>• Monthly Sanction / Rejection Ratio |
| **Active Work Queues** | 1. **Decision Queue**: Verified cases forwarded by Talathis ready for statutory determination.<br/>2. **Hearings & Objections Queue**: Cases with disputed rights, boundary objections, or encumbrance flags.<br/>3. **SLA Breach & Escalation Queue**: Cases exceeding statutory turnaround times.<br/>4. **Data Quality Exception Queue**: Cross-source mismatches (e.g., RoR vs. Court stay orders). |
| **Key Actions** | 1. Conduct split-panel case review: registered deed + Talathi field report + Officer Parcel 360° + AI Advisory summary.<br/>2. Schedule, manage, and record formal revenue court hearings and party attendance.<br/>3. **Execute statutory decisions**: Digitally sign mutation sanction or rejection orders with mandatory legal justifications.<br/>4. Return incomplete cases to Talathi with specific clarification instructions.<br/>5. Trigger authoritative RoR update event (`ror.updated`) upon mutation approval. |
| **Approvals / Statutory** | **AUTHORITATIVE STATUTORY AUTHORITY**: Sole officer authorized to approve or reject mutation orders and update the Record of Rights. |
| **GIS Capabilities** | Tehsil-level cadastral maps, hotspot density layers for pending disputes, spatial zoning cross-referencing. |
| **AI Land Intelligence** | AI Risk Advisory Panel highlighting title conflicts, area mismatches, and SLA breach predictions. Can override AI flags with audited notes. |

---

### 4. Sub-Registrar (SRO)

| Dimension | Specification |
|---|---|
| **Role Objective** | Verify parcel context prior to deed registration, verify encumbrance certificates, check for court injunctions/government land restrictions, and monitor real-time deed registration event transmission to Land Stack. |
| **Administrative Scope** | Sub-District / Registration Office (SRO) Jurisdiction. |
| **Authentication** | Department SSO with TOTP MFA. |
| **Key Permissions** | `SEARCH_PARCEL`, `VERIFY_TRANSACTION_CONTEXT`, `INSPECT_ENCUMBRANCE`, `VIEW_RESTRICTIONS`, `RECEIVE_WEBHOOK_STATUS`, `RETRY_FAILED_EVENTS`. |
| **Dashboard KPIs** | • Daily Deeds Processed<br/>• Parcel Lookups Completed<br/>• Parcels Flagged with Active Restrictions/Stays<br/>• Registration-to-Mutation Webhook Transmission Success Rate (Target: 100%) |
| **Active Work Queues** | 1. **Pre-Registration Verification Queue**: Scheduled deed appointments requiring title and encumbrance check.<br/>2. **Integration Event Sync Queue**: Registered deeds pending delivery or retry to Land Stack. |
| **Key Actions** | 1. Instant ULPIN / Survey Number lookup during document presentation.<br/>2. Inspect Officer Parcel 360° for active revenue court stays, forest/tribal restrictions, or bank mortgages.<br/>3. Flag fraudulent or restricted transaction attempts.<br/>4. Monitor automatic emission of `registration.completed` webhook to trigger mutation pipeline. |
| **Approvals / Statutory** | **Statutory Deed Registration Authority** (governed by Registration Act, 1908). Land Stack verifies parcel data context. |
| **GIS Capabilities** | Inspect parcel boundaries and adjoining plots to verify sale layout sketches. |

---

### 5. District Collector (District Administration & Oversight)

| Dimension | Specification |
|---|---|
| **Role Objective** | Exercise administrative oversight over all tehsils within the district, monitor mutation pendency, enforce SLA compliance, review district-wide data quality trends, and resolve escalated/inter-tehsil disputes. |
| **Administrative Scope** | Entire District (all tehsils, circles, and villages). |
| **Authentication** | Government SSO with biometric/TOTP MFA. |
| **Key Permissions** | `VIEW_DISTRICT`, `DISTRICT_ANALYTICS`, `DISTRICT_REPORTS`, `ESCALATION_OVERVIEW`, `REASSIGN_INTER_TEHSIL`, `EXPORT_GOV_DECK`. |
| **Dashboard KPIs** | • Total District Mutation Pendency (Target: <5% overdue)<br/>• Tehsil-by-Tehsil SLA Adherence Ranking<br/>• District Data Quality Index (DQI Grade A–E)<br/>• Registration-to-Mutation Handover Rate<br/>• High-Value / Government Land Dispute Alerts |
| **Active Work Queues** | 1. **District Escalation Queue**: Complex disputes escalated by Tehsildars.<br/>2. **SLA Breach Command Queue**: Tehsils operating below 80% SLA compliance.<br/>3. **Government Land Protection Queue**: Injunctions or unauthorized transactions on state-owned parcels. |
| **Key Actions** | 1. Inspect district-wide choropleth maps displaying mutation pendency and data health.<br/>2. Drill down from District → Tehsil → Village to locate operational bottlenecks.<br/>3. Issue administrative directions and reallocate officer resources across tehsils.<br/>4. Review AI Executive Summary of monthly district land governance performance. |
| **Approvals / Statutory** | District revenue administrative authority. Resolves administrative appeals and policy exceptions. |

---

### 6. State PMU Head (State Nodal Officer)

| Dimension | Specification |
|---|---|
| **Role Objective** | Direct the state-level Project Monitoring Unit (PMU): track statewide DILRMP milestones, supervise district performance, monitor State Adapter API uptime and data freshness, and present executive intelligence to state leadership. |
| **Administrative Scope** | Entire State (all districts, tehsils, and revenue systems). |
| **Authentication** | State Government Nodal SSO with Multi-Factor Authentication. |
| **Key Permissions** | `VIEW_STATE_ALL`, `STATE_ANALYTICS`, `INTEGRATION_HEALTH_VIEW`, `AI_EXECUTIVE_SUMMARY`, `STATE_REPORTS_EXPORT`, `DQI_AUDIT`. |
| **Dashboard KPIs** | • State ULPIN (Bhu-Aadhaar) Assignment Coverage %<br/>• Cadastral Map Digitization & RoR-Map Linkage Rate %<br/>• Statewide Mutation Pendency & Average Processing Days<br/>• State Adapter API Uptime (Mahabhulekh, Bhoomi, BhuNaksha, NGDRS)<br/>• Overall State Data Quality Index |
| **Active Work Queues** | 1. **Integration Failure & Outage Feed**: State API circuit-breaker trips or dead-letter surges.<br/>2. **District Performance Benchmark Feed**: Underperforming districts flagged for PMU intervention.<br/>3. **DILRMP Compliance Review**: Weekly progress against central ministry benchmarks. |
| **Key Actions** | 1. Inspect state choropleth maps with real-time district performance rankings.<br/>2. Monitor live integration health grid (API response latencies, cache hit ratios, webhook throughput).<br/>3. Review and export automated AI-generated State Land Governance Executive Briefs.<br/>4. Direct corrective data harmonization programs in low-DQI districts. |
| **GIS Capabilities** | State-level cadastral coverage maps, spatial anomaly clustering, forest/tribal boundary layer audits. |

---

### 7. DoLR / National Monitor (Central Ministry Oversight)

| Dimension | Specification |
|---|---|
| **Role Objective** | Provide national-level monitoring on behalf of the Department of Land Resources (DoLR), Ministry of Rural Development: track nationwide DILRMP 3.0 metrics, benchmark inter-state performance, and ensure standardization across state digital land infrastructures. |
| **Administrative Scope** | National (All States and Union Territories). |
| **Authentication** | Central Government SSO (NIC/Jan Parichay) with MFA. |
| **Key Permissions** | `VIEW_NATIONAL_ALL`, `NATIONAL_ANALYTICS`, `INTER_STATE_BENCHMARK`, `DILRMP_COMPLIANCE_EXPORT`, `READ_NATIONAL_REPORTS`. |
| **Dashboard KPIs** | • 36 States/UTs Onboarding Status<br/>• National ULPIN Coverage (Parcels Assigned vs. Total Estimated 40+ Crore)<br/>• National RoR-Map Integration %<br/>• National Average Mutation Turnaround Time<br/>• NGDRS & National Portal Interoperability Index |
| **Active Work Queues** | • National DILRMP Benchmark Monitor<br/>• Cross-State Standard Terminology (GoRT) Adoption Tracker |
| **Key Actions** | 1. Inspect National Land Stack Cockpit: heatmaps comparing state implementation velocity.<br/>2. Evaluate inter-state performance trends and identify best-performing administrative practices.<br/>3. Export formal progress reports for Parliamentary and Ministry reviews. |
| **Data Scope** | Read-only national aggregated metrics. No direct access to individual citizen PII without explicit audit authorization. |

---

### 8. System Administrator (Platform & Security Operations)

| Dimension | Specification |
|---|---|
| **Role Objective** | Manage platform technical operations: configure `state_config` metadata, administer Keycloak realms, maintain OPA authorization policies, monitor infrastructure health, and verify cryptographic audit trail integrity. (Absorbs Security Officer and Auditor operational tasks). |
| **Administrative Scope** | Platform-wide (All environments, states, and modules). |
| **Authentication** | Hardware Security Key (FIDO2 / WebAuthn) + Dedicated VPN / Bastion Access. |
| **Key Permissions** | `SYSTEM_ADMIN`, `MANAGE_USERS`, `MANAGE_STATE_CONFIG`, `DEPLOY_OPA_POLICIES`, `MANAGE_ADAPTERS`, `VIEW_AUDIT_TRAIL`, `VERIFY_HASH_CHAIN`, `MANAGE_DLQ`. |
| **Dashboard KPIs** | • System Availability & Cluster Health (99.9% Target)<br/>• API P95 / P99 Latency & Error Rates<br/>• Kafka Event Bus Consumer Lag & DLQ Depth<br/>• Cryptographic Hash-Chain Verification Status (Pass / Fail)<br/>• Failed Authentication / Security Event Alerts |
| **Active Work Queues** | 1. **Infrastructure Health Queue**: Pod restarts, memory saturation, slow spatial queries.<br/>2. **Integration Exception Queue**: Dead-letter payloads requiring payload correction and replay.<br/>3. **Security Audit Queue**: Unusual export activity, privilege elevation attempts, failed login surges. |
| **Key Actions** | 1. Onboard new states by inserting verified `state_config` schemas (zero code deployments).<br/>2. Run automated hash-chain verification across `audit_event` partitions to verify tamper-evident logs.<br/>3. Inspect and replay failed webhook transactions from Kafka Dead-Letter Queues.<br/>4. Manage API Gateway rate limits, WAF rules, and certificate rotations via HashiCorp Vault. |

---

*This document is the sole authority on role definitions in the Land Stack platform. All interfaces, workflows, and authorization policies must strictly conform to these 8 roles.*
