# Land Stack — Role Portal Matrix (14 Roles)

**Version**: 3.0 | **Last Updated**: September 2026  
**Scope**: Canonical Role × Domain × Jurisdiction Matrix for the 14 total system roles: 1 citizen role + 13 government/institutional roles.  
**Enforcement**: Express Middleware (`requireRole`, `requirePermission`, `requireJurisdiction`) applied at the routing layer.

---

## 1. The 14 System Roles

The Land Stack system provides an explicit role selection UX backed by exactly 14 total system roles: 1 citizen role + 13 government/institutional roles organized into domains.

```text
CITIZEN PLANE (Public Domain)
  1. CITIZEN

GOVERNMENT OPERATIONS PLANE
  Rural Domain
    2. TALATHI
    3. PATWARI
    4. CRO
    5. TEHSILDAR
    6. COLLECTOR
  Urban Domain
    7. ULB_OFFICER
  Registration Domain
    8. SRO
  Shared GIS Domain
    9. SURVEY_GIS
  Monitoring & Admin Domain
    10. STATE_PMU
    11. STATE_AUTHORITY
    12. NATIONAL_MONITOR
    13. DOLR_NATIONAL
    14. ADMIN
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
| `ADMIN` | System Administration | Configure `state_config`, manage users, configure permissions, manage DLQs |

---

## 3. Master Role × Permission Matrix

| Role | Domain | VIEW | SEARCH | CREATE | EDIT | VERIFY | RECOMMEND | APPROVE | REJECT | HEARING | ESCALATE | DOWNLOAD | EXPORT | ASSIGN | AUDIT | ADMIN |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **CITIZEN** | Public | ✅¹ | ✅ | ✅² | ✅³ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅⁴ | ✅⁵ | ❌ | ✅⁶ | ❌ |
| **TALATHI** | Rural | ✅⁷ | ✅⁷ | ✅⁸ | ✅⁸ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅⁹ | ❌ | ✅⁶ | ❌ |
| **PATWARI** | Rural | ✅⁷ | ✅⁷ | ✅⁸ | ✅⁸ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅⁹ | ❌ | ✅⁶ | ❌ |
| **CRO** | Rural | ✅¹⁰ | ✅¹⁰ | ✅ | ✅ | ✅ | ✅ | ✅¹¹ | ✅¹¹ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **TEHSILDAR** | Rural | ✅¹⁰ | ✅¹⁰ | ✅ | ✅ | ✅ | ✅ | ✅¹¹ | ✅¹¹ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **COLLECTOR** | Rural | ✅¹⁴ | ✅¹⁴ | ❌ | ❌ | ❌ | ❌ | ✅¹⁵ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **ULB_OFFICER**| Urban | ✅²⁰ | ✅²⁰ | ✅ | ✅ | ✅ | ✅ | ✅²¹ | ✅²¹ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **SRO** | Registration| ✅¹² | ✅ | ❌ | ❌ | ✅¹³ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅⁶ | ❌ |
| **SURVEY_GIS** | Shared GIS| ✅²² | ✅²² | ✅ | ✅ | ✅²³ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| **STATE_PMU** | Monitoring| ✅¹⁶ | ✅¹⁶ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ |
| **STATE_AUTH.**| Monitoring| ✅¹⁶ | ✅¹⁶ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ |
| **NAT._MONITOR**| Monitoring| ✅¹⁷ | ✅¹⁷ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅¹⁷| ❌ |
| **DOLR_NAT.** | Monitoring| ✅¹⁷ | ✅¹⁷ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅¹⁷| ❌ |
| **ADMIN** | Monitoring| ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Permitted Action Footnotes:
1. **Full view** on owned/linked parcels; **Public summary view** on any other parcel.
2. Create own service applications, grievance intimations, watchlists, and data correction requests only.
3. Edit own user profile, contact details, and notification preferences only.
4. Download legally available documents, digitally signed RoR extracts, certified copies, and receipts for owned parcels.
5. Export own saved/search/history data where permitted. Parcel 360° summary PDF for owned parcels.
6. View public provenance/source history, transparency information, and own user action audit trail only. Never access internal security audit logs.
7. Scoped strictly to parcels within assigned Village(s) and Circle.
8. Field verification observations, geotagged site photographs, and discrepancy reports.
9. Village field verification summary reports.
10. Scoped to entire Tehsil / Taluka.
11. **PRIMARY STATUTORY AUTHORITY (RURAL)**: Empowered to sanction/reject rural agricultural mutation orders.
12. Scoped to parcels involved in pending deed registrations within the SRO jurisdiction.
13. Pre-registration verification of ownership, encumbrances, and court injunctions.
14. Scoped to entire District.
15. Administrative policy approvals and inter-tehsil dispute escalations only.
16. Scoped to entire State (Read-only analytics and integration telemetry).
17. National aggregated metrics (Read-only; PII masked by default).
20. Scoped to Municipal limits.
21. **PRIMARY STATUTORY AUTHORITY (URBAN)**: Empowered to sanction/reject urban property mutations.
22. Scoped to spatial/GIS boundaries.
23. QA of topology and spatial overlaps.

---

## 4. Jurisdiction Hierarchy & Operational Scope

Land Stack dynamically binds every government identity to an administrative boundary hierarchy:
`National → State → District → Tehsil / Municipality → Circle → Village / Ward → Parcel`

| Role | Administrative Boundary Level | Geographical Granularity |
|---|---|---|
| `CITIZEN` | Any (Public) / Specific (Owned) | Parcel-level |
| `TALATHI` / `PATWARI` | Village / Circle Level | Assigned Villages/Circles |
| `CRO` / `TEHSILDAR` | Tehsil / Taluka Level | Entire Tehsil |
| `SRO` | Sub-District Registration Level | SRO Office Area |
| `ULB_OFFICER` | Municipal Level | Municipal Limits / Wards |
| `SURVEY_GIS` | District/Tehsil (Spatial) | Spatial Data Coverage |
| `COLLECTOR` | District Level | Entire District |
| `STATE_PMU` / `STATE_AUTHORITY`| State Level | Entire State |
| `NATIONAL_MONITOR` / `DOLR_NATIONAL`| National Level | All 36 States/UTs |
| `ADMIN` | Platform Level | Global |

---

## 5. Express Middleware Enforcement

Authorization decisions are strictly evaluated by Express middleware using the request context `req.user` (from JWT) and `req.params`.

### 5.1 Core Middleware Chain

```javascript
// 1. Authentication (Who are you?)
const requireAuth = async (req, res, next) => {
  // Validates Supabase JWT and attaches req.user
};

// 2. Role-Based Access Control (What is your job title?)
const requireRole = (allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ error: 'Role unauthorized' });
  next();
};

// 3. Granular Permissions (What actions can your role perform?)
const requirePermission = (requiredPerm) => (req, res, next) => {
  const userPerms = ROLE_PERMISSIONS[req.user.role] || [];
  if (!userPerms.includes(requiredPerm)) return res.status(403).json({ error: 'Missing permission' });
  next();
};

// 4. Jurisdiction Enforcement (Where are you allowed to do this?)
const requireJurisdiction = async (req, res, next) => {
  // Extracts resource location (e.g., from req.params.ulpin or req.body.village_code)
  // Compares against req.user.jurisdiction bounds
  // Denies if outside assigned State/District/Tehsil/Village
};
```

### 5.2 Frontend UX vs Backend Authorization

Frontend role selection is **only a user-interface context selection. It is never authorization.**

The backend strictly validates:
- Authenticated user identity and active user account.
- Actual role assignment from the `government_users` database.
- Selected role belongs to assigned roles and is active.
- Jurisdiction permissions and department/domain restrictions.
- Resource-level access (ownership or case assignment where applicable).

The correct flow is:
**User Login** → **Select Domain** → **Select Exact Role** → **Authenticate** → **Backend loads database role assignments** → **Backend validates selected role & jurisdiction** → **Backend creates authorized session/context** → **Role-specific dashboard**.

Never trust role, department, district, or jurisdiction values sent only by the frontend. No application-level frontend conditional shall bypass or contradict this matrix.
