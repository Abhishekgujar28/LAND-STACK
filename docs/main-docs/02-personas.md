# Land Stack — System Roles & Experience Types

**Version**: 3.0 | **Last Updated**: September 2026  
**Scope**: 14 System Roles  
**Design Principle**: Explicit role selection, clean statutory boundaries, and domain-driven workspaces.

---

## The 14 System Roles

The Land Stack backend (`core/permissions.js`) enforces authorization across exactly 14 granular system roles. To provide a clear user experience, these roles are organized into distinct Experience Types and Domains.

```text
1. CITIZEN PLANE
   └── Public
       └── CITIZEN (Citizen Land Owner)

2. GOVERNMENT OPERATIONS PLANE
   ├── Rural
   │   ├── TALATHI (Village Revenue Officer)
   │   ├── PATWARI (Village Revenue Officer - Alternate)
   │   ├── CRO (Circle Revenue Officer)
   │   ├── TEHSILDAR (Primary Statutory Decision Maker)
   │   ├── SRO (Sub-Registrar - Rural context)
   │   └── COLLECTOR (District Administrator)
   │
   ├── Urban
   │   ├── ULB_OFFICER (Urban Local Body Officer)
   │   └── SRO (Sub-Registrar - Urban context)
   │
   ├── Shared GIS
   │   └── SURVEY_GIS (Survey & GIS Officer)
   │
   └── Monitoring & Admin
       ├── STATE_PMU (State Nodal Officer)
       ├── STATE_AUTHORITY (State Executive)
       ├── NATIONAL_MONITOR (Central Ministry Oversight)
       ├── DOLR_NATIONAL (DoLR Executive)
       └── ADMIN (System Administrator)
```

---

## Part 1: Citizen Plane

### 1. CITIZEN (Citizen Land Owner)

| Dimension | Specification |
|---|---|
| **Role Objective** | Discover land parcels, inspect unified Parcel 360° data (Rural/Urban), submit service applications, monitor mutation lifecycles, configure watchlists, and explore Schemes & Financial Discovery. |
| **Operating Area** | Public |
| **Authentication** | Mobile OTP via Supabase Auth with optional Aadhaar eKYC. |
| **Key Actions** | 1. Access Parcel 360° (Rural: 7/12 & bounds; Urban: CTS & zoning).<br/>2. Submit applications (Certified Extract, Grievance).<br/>3. Track mutation progress.<br/>4. Discover matching government schemes and financial assistance. |
| **Data Scope** | Public summary view for any parcel; full view of owned parcels. |

---

## Part 2: Government Operations Plane

Users entering the Government Portal must explicitly select their **Domain** and **Role** before authenticating.

### Domain: Rural

#### 2. TALATHI / 3. PATWARI (Village Revenue Officer)
| Dimension | Specification |
|---|---|
| **Role Objective** | Execute on-the-ground field verifications, conduct boundary checks, upload geotagged site photographs, and submit structured recommendations to the Tehsildar. |
| **Administrative Scope** | Assigned Village(s) and Circle. |
| **Key Actions** | Record field observations, confirm physical possession, report data discrepancies. |
| **Statutory Power** | No statutory decision power. Advisory recommendations only. |

#### 4. CRO (Circle Revenue Officer)
| Dimension | Specification |
|---|---|
| **Role Objective** | Supervise Talathis, verify complex field reports, and manage circle-level dispute mediation. |
| **Administrative Scope** | Revenue Circle (group of villages). |
| **Key Actions** | Review Talathi recommendations, escalate critical cases to Tehsildar. |

#### 5. TEHSILDAR (Primary Statutory Decision Maker)
| Dimension | Specification |
|---|---|
| **Role Objective** | Act as the primary competent revenue authority for the Tehsil: review cases, conduct hearings, sanction/reject mutations, and enforce SLAs. |
| **Administrative Scope** | Entire Tehsil / Taluka. |
| **Key Actions** | Conduct split-panel case reviews, schedule revenue court hearings, digitally sign mutation orders triggering RoR updates. |
| **Statutory Power** | **AUTHORITATIVE STATUTORY AUTHORITY**: Sole officer authorized to approve/reject mutation orders. |

#### 6. COLLECTOR (District Administrator)
| Dimension | Specification |
|---|---|
| **Role Objective** | Administrative oversight over all tehsils within the district, enforce SLA compliance, review data quality trends, and resolve escalated disputes. |
| **Administrative Scope** | Entire District. |
| **Key Actions** | Inspect district-wide choropleth maps, reallocate resources across tehsils, review AI executive summaries. |

---

### Domain: Urban

#### 7. ULB_OFFICER (Urban Local Body Officer)
| Dimension | Specification |
|---|---|
| **Role Objective** | Manage urban property records, verify municipal tax status, check master plan zoning, and handle urban property mutations. |
| **Administrative Scope** | Municipal Corporation / Council limits. |
| **Key Actions** | Verify building permissions against parcel zoning, update CTS/Property Card records, integrate with property tax databases. |

#### 8. SRO (Sub-Registrar) — *Applies to Rural & Urban*
| Dimension | Specification |
|---|---|
| **Role Objective** | Verify parcel context (encumbrances, court stays) prior to deed registration, and monitor webhook transmission. |
| **Administrative Scope** | Sub-District / Registration Office (SRO) Jurisdiction. |
| **Key Actions** | Instant ULPIN lookup during document presentation, flag fraudulent transactions, trigger `registration.completed` webhooks. |
| **Statutory Power** | Statutory Deed Registration Authority. |

---

### Domain: Shared GIS

#### 9. SURVEY_GIS (Survey & GIS Officer)
| Dimension | Specification |
|---|---|
| **Role Objective** | Manage cadastral boundaries, validate topology, resolve spatial overlaps, and oversee survey projects across both rural and urban areas. |
| **Administrative Scope** | Assigned District / Tehsil (Spatial). |
| **Key Actions** | Process surveyor GPS data, run ST_Intersects queries to find topology errors, update canonical PostGIS geometries. |

---

### Domain: Monitoring & Admin

#### 10. STATE_PMU / 11. STATE_AUTHORITY (State Monitoring)
| Dimension | Specification |
|---|---|
| **Role Objective** | Direct the state-level PMU: track statewide DILRMP milestones, supervise district performance, monitor State Adapter API uptime. |
| **Administrative Scope** | Entire State. |
| **Key Actions** | Monitor live integration health grids, review automated AI-generated State Land Governance Executive Briefs. |

#### 12. NATIONAL_MONITOR / 13. DOLR_NATIONAL (Central Ministry)
| Dimension | Specification |
|---|---|
| **Role Objective** | Track nationwide DILRMP 3.0 metrics, benchmark inter-state performance, and ensure standardization across state digital land infrastructures. |
| **Administrative Scope** | National (All States and Union Territories). |
| **Key Actions** | Evaluate inter-state performance trends, track national ULPIN rollout velocity. |

#### 14. ADMIN (System Administrator)
| Dimension | Specification |
|---|---|
| **Role Objective** | Manage platform technical operations: administer users, configure platform settings, and verify audit trail integrity. |
| **Administrative Scope** | Platform-wide. |
| **Key Actions** | Manage government user accounts, verify cryptographic hash-chain integrity of audit logs. |
| **Statutory Power** | **None**. Explicitly prohibited from approving/rejecting mutations (enforced in code). |

---

*This document is the sole authority on role definitions in the Land Stack platform. All interfaces, workflows, and authorization policies must strictly conform to these 14 roles and their designated domains.*
