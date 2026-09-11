# Land Stack — Role Portal Matrix (8 Consolidated Roles)

**Version**: 2.1 | **Date**: September 2026  
**Scope**: Canonical Role × Permission × Jurisdiction × Data Sensitivity Matrix for the Streamlined 8-Role Architecture  
**Enforcement**: Open Policy Agent (OPA) embedded sidecar with Rego policies at the API Gateway.

---

## 1. The 8 Consolidated Platform Roles

```
CITIZEN PLANE (1 Role)
  1. Citizen Land Owner (CITIZEN)

GOVERNMENT OPERATIONS PLANE (7 Roles)
  2. Talathi / Patwari (TALATHI)
  3. Tehsildar (TEHSILDAR)
  4. Sub-Registrar (SRO)
  5. District Collector (COLLECTOR)
  6. State PMU Head (STATE_PMU)
  7. DoLR / National Monitor (NATIONAL_MONITOR)
  8. System Administrator (SYS_ADMIN)
```

---

## 2. Permission Codes Reference

| Permission Code | Name | Description |
|---|---|---|
| `VIEW` | View Records | Read authoritative/projected parcel, transaction, or case information |
| `SEARCH` | Search & Discovery | Query database by ULPIN, Survey Number, Owner Name, or Spatial click |
| `CREATE` | Create / Initiate | Initiate applications, file field observations, or create cases |
| `EDIT` | Modify Data | Update drafts, edit field notes, or revise configurations |
| `VERIFY` | Field/Desk Verification | Verify boundary, physical possession, and document authenticity |
| `RECOMMEND` | Submit Recommendation | Formally submit verified findings to higher statutory authority |
| `APPROVE` | Statutory Sanction | Authoritatively approve mutation, issue order, or update RoR |
| `REJECT` | Statutory Rejection | Authoritatively reject mutation with mandatory legal grounds |
| `HEARING` | Manage Hearings | Schedule hearings, record formal minutes, and issue notices |
| `ESCALATE` | Escalate Case | Forward overdue or complex disputes to higher administrative level |
| `DOWNLOAD` | Download Documents | Access certified copies, deed summaries, or field photographs |
| `EXPORT` | Export Analytics | Export governance MIS reports, choropleth datasets, or audit summaries |
| `ASSIGN` | Task Assignment | Assign or reallocate cases across subordinate officers |
| `AUDIT` | Inspect Audit Trail | View cryptographic hash-chained transaction logs |
| `ADMIN` | System Administration | Configure `state_config`, manage users, deploy OPA policies, manage DLQs |

---

## 3. Master Role × Permission Matrix

| Role | VIEW | SEARCH | CREATE | EDIT | VERIFY | RECOMMEND | APPROVE | REJECT | HEARING | ESCALATE | DOWNLOAD | EXPORT | ASSIGN | AUDIT | ADMIN |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1. Citizen Land Owner** | ✅¹ | ✅ | ✅² | ✅³ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅⁴ | ✅⁵ | ❌ | ✅⁶ | ❌ |
| **2. Talathi / Patwari** | ✅⁷ | ✅⁷ | ✅⁸ | ✅⁸ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅⁹ | ❌ | ✅⁶ | ❌ |
| **3. Tehsildar** | ✅¹⁰ | ✅¹⁰ | ✅ | ✅ | ✅ | ✅ | ✅¹¹ | ✅¹¹ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **4. Sub-Registrar (SRO)** | ✅¹² | ✅ | ❌ | ❌ | ✅¹³ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅⁶ | ❌ |
| **5. District Collector** | ✅¹⁴ | ✅¹⁴ | ❌ | ❌ | ❌ | ❌ | ✅¹⁵ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **6. State PMU Head** | ✅¹⁶ | ✅¹⁶ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ |
| **7. DoLR / National Monitor**| ✅¹⁷ | ✅¹⁷ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅¹⁷ | ❌ |
| **8. System Administrator** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Permitted Action Footnotes:
1. **Full view** on owned/linked parcels; **Public summary view** on any other parcel.
2. Service applications, grievance intimations, and data correction requests only.
3. Own user profile, contact details, and notification preferences only.
4. Digitally signed RoR extracts, certified copies, and receipts for owned parcels.
5. Parcel 360° summary PDF for owned parcels.
6. Own user action audit trail only.
7. Scoped strictly to parcels within assigned Village(s) and Circle.
8. Field verification observations, geotagged site photographs, and discrepancy reports.
9. Village field verification summary reports.
10. Scoped to entire Tehsil / Taluka.
11. **PRIMARY STATUTORY AUTHORITY**: Sole officer empowered to sanction or reject mutation orders.
12. Scoped to parcels involved in pending deed registrations within the SRO jurisdiction.
13. Pre-registration verification of ownership, encumbrances, and court injunctions.
14. Scoped to entire District.
15. Administrative policy approvals and inter-tehsil dispute escalations only.
16. Scoped to entire State (Read-only analytics and integration telemetry).
17. National aggregated metrics (Read-only; PII masked by default).

---

## 4. Jurisdiction Hierarchy & Operational Scope

Land Stack dynamically binds every government identity to an administrative boundary hierarchy:
`National → State → District → Tehsil → Circle → Village → Parcel`

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        JURISDICTION SCOPE BY ROLE                                      │
├─────────────────────────┬──────────────────────────────────┬───────────────────────────┤
│ Role                    │ Administrative Boundary Level    │ Geographical Granularity  │
├─────────────────────────┼──────────────────────────────────┼───────────────────────────┤
│ 1. Citizen Land Owner   │ Any (Public) / Specific (Owned)  │ Parcel-level              │
│ 2. Talathi / Patwari    │ Village / Circle Level           │ Assigned Villages/Circles │
│ 3. Tehsildar            │ Tehsil / Taluka Level            │ Entire Tehsil             │
│ 4. Sub-Registrar (SRO)  │ Sub-District Registration Level  │ SRO Office Area           │
│ 5. District Collector   │ District Level                   │ Entire District           │
│ 6. State PMU Head       │ State Level                      │ Entire State              │
│ 7. DoLR / National Mon. │ National Level                   │ All 36 States/UTs         │
│ 8. System Administrator │ Platform Level                   │ Global                    │
└─────────────────────────┴──────────────────────────────────┴───────────────────────────┘
```

---

## 5. Data Sensitivity & Attribute Masking Matrix

| Data Category | Citizen (Own) | Citizen (Other) | Talathi | Tehsildar | SRO | Collector | State PMU | Sys Admin |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Parcel Identification (ULPIN, Survey No) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cadastral Geometry & Spatial Boundary | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Owner Name (Public Record of Rights) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Owner Contact (Mobile / Email Hash) | ✅ | ❌ | ✅¹⁸ | ✅¹⁸ | ❌ | ❌ | ❌ | ❌ |
| Aadhaar Token / eKYC Reference Hash | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅¹⁹ |
| Active Encumbrances & Mortgages | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Active Court Cases & Injunction Stays | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Internal Officer Deliberation Notes | ❌ | ❌ | ✅¹⁸ | ✅¹⁸ | ❌ | ✅ | ❌ | ✅ |
| Raw API Provenance Metadata | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| AI Advisory Risk Flags & Anomaly Scores | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Cryptographic Audit Trail Hash Chain | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### Data Masking Footnotes:
18. Available only for parcels located within the officer's assigned jurisdiction during active case processing.
19. Vault-encrypted token accessible only for cryptographic compliance verification. Raw Aadhaar is never stored anywhere.

---

## 6. Open Policy Agent (OPA) Rego Policies

Authorization decisions are strictly evaluated by OPA using input context `{ user, role, department, state_code, jurisdiction, action, resource }`:

```rego
package landstack.authz

default allow = false

# -----------------------------------------------------------
# RULE 1: Citizen Access
# -----------------------------------------------------------
allow {
    input.role == "CITIZEN"
    input.action == "VIEW"
    input.resource.is_public == true
}

allow {
    input.role == "CITIZEN"
    input.action in ["VIEW", "DOWNLOAD"]
    input.resource.owner_party_id == input.user.party_id
}

allow {
    input.role == "CITIZEN"
    input.action in ["CREATE", "EDIT"]
    input.resource.type in ["service_application", "grievance", "watchlist"]
}

# -----------------------------------------------------------
# RULE 2: Talathi / Patwari (Village/Circle Bound)
# -----------------------------------------------------------
allow {
    input.role == "TALATHI"
    input.action in ["VIEW", "SEARCH", "FIELD_VERIFY", "UPLOAD_PHOTOS", "RECOMMEND"]
    input.resource.village_code in input.user.jurisdiction.villages
}

# -----------------------------------------------------------
# RULE 3: Tehsildar (Tehsil Bound - Primary Statutory Authority)
# -----------------------------------------------------------
allow {
    input.role == "TEHSILDAR"
    input.action in ["VIEW", "SEARCH", "REVIEW", "HEARING", "RETURN_CLARIFICATION"]
    input.resource.tehsil_code == input.user.jurisdiction.tehsil_code
}

# Only Tehsildar can execute statutory sanction or rejection
allow {
    input.role == "TEHSILDAR"
    input.action in ["APPROVE", "REJECT"]
    input.resource.type == "mutation_case"
    input.resource.tehsil_code == input.user.jurisdiction.tehsil_code
}

# -----------------------------------------------------------
# RULE 4: Sub-Registrar (SRO Bound)
# -----------------------------------------------------------
allow {
    input.role == "SRO"
    input.action in ["VIEW", "SEARCH", "VERIFY_CONTEXT"]
    input.resource.sro_code == input.user.jurisdiction.sro_code
}

# -----------------------------------------------------------
# RULE 5: District Collector (District Bound Oversight)
# -----------------------------------------------------------
allow {
    input.role == "COLLECTOR"
    input.action in ["VIEW", "SEARCH", "EXPORT", "DISTRICT_ANALYTICS", "ESCALATE"]
    input.resource.district_code == input.user.jurisdiction.district_code
}

# -----------------------------------------------------------
# RULE 6: State PMU Head (State Bound Read-Only Analytics)
# -----------------------------------------------------------
allow {
    input.role == "STATE_PMU"
    input.action in ["VIEW", "SEARCH", "EXPORT", "STATE_ANALYTICS"]
    input.resource.state_code == input.user.jurisdiction.state_code
    input.action != "APPROVE"
    input.action != "REJECT"
}

# -----------------------------------------------------------
# RULE 7: DoLR / National Monitor (National Aggregations)
# -----------------------------------------------------------
allow {
    input.role == "NATIONAL_MONITOR"
    input.action in ["VIEW", "EXPORT", "NATIONAL_ANALYTICS"]
    input.resource.is_aggregated == true
}

# -----------------------------------------------------------
# RULE 8: System Administrator
# -----------------------------------------------------------
allow {
    input.role == "SYS_ADMIN"
    input.action in ["ADMIN", "VIEW", "SEARCH", "EDIT", "AUDIT"]
}

# -----------------------------------------------------------
# INVIOLABLE SAFETY GUARDS
# -----------------------------------------------------------
# Automated AI system can NEVER execute statutory approvals
deny {
    input.actor_type == "ai_system"
    input.action in ["APPROVE", "REJECT", "SANCTION"]
}

# No officer may approve mutations outside their assigned Tehsil
deny {
    input.action in ["APPROVE", "REJECT"]
    input.resource.tehsil_code != input.user.jurisdiction.tehsil_code
}
```

---

*This document defines the strict, unyielding authorization rules for Land Stack. No application-level conditional shall bypass or contradict this matrix.*
