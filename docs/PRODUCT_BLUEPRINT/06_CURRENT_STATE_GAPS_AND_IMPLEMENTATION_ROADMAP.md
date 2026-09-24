# 06 — Current State, Gaps, and Implementation Roadmap

**Version**: 1.0 | **Date**: September 2026

---

## 1. Current State Summary

LAND-STACK has a functional frontend/backend architecture with:

- **50+ React pages** organized across Public, Auth, Citizen, and Government layouts
- **13 backend modules** with routes, controllers, services, and validators
- **21 database tables** covering parcels, users, mutations, applications, GIS, and audit
- **A working auth system** using Supabase Auth with JWT and HttpOnly cookies
- **Database-backed data flows** — services query PostgreSQL, not JSON files
- **A comprehensive permission system** with 40+ atomic permissions mapped to 13 roles
- **A 12-state mutation state machine** with action validation and MFA requirements

The platform is **architecturally sound** but has **specific implementation gaps** and **development-era shortcuts** that must be resolved before production.

---

## 2. What Works Today

| Area | Status | Evidence |
|------|--------|----------|
| Frontend routing | ✅ Working | 4 layouts, 50+ pages with React Router 6 |
| Backend REST API | ✅ Working | 13 modules under `/api/v1/` |
| Database schema | ✅ Working | 21 tables + PostGIS extension |
| Authentication | ✅ Working (with caveats) | Supabase Auth, HttpOnly cookies, JWT |
| Parcel Search | ✅ Working | Database-backed with cursor pagination |
| Parcel 360° | ✅ Working | 9 parallel queries, composite dossier |
| Mutation State Machine | ✅ Working | 12 states, validated transitions |
| Permission System | ✅ Working | Backend permissions.js, role mapping |
| API Client | ✅ Working | Fetch-based with credentials |
| Security headers | ✅ Working | Helmet, CORS, cookie security |
| Error handling | ✅ Working | Centralized error system |
| Audit trail | ✅ Working | Hash-chained, append-only |

---

## 3. Gap Analysis

### 3.1 Critical Gaps (Must Fix Before Production)

| # | Gap | Current State | Target State | Files Affected |
|---|-----|---------------|--------------|----------------|
| G-01 | **Demo OTP hardcoded** | OTP is always `123456` | Real SMS gateway integration | `auth.service.js` |
| G-02 | **Demo password fallback** | `Password123!` as universal fallback | Remove fallback; real credentials only | `auth.service.js` |
| G-03 | **Auto-login bypass** | AuthContext auto-logs-in as Talathi | Require explicit authentication; show login page | `AuthContext.jsx` |
| G-04 | **CORS permissive** | `callback(null, true)` for all origins | Strict origin allowlist | `server.js` |
| G-05 | **No frontend route guards** | Government pages render without role check | `ProtectedRoute` component with role validation | `App.jsx`, layouts |
| G-06 | **RLS bypass in services** | Services use `getSupabaseAdmin()` for all queries | Use `createAuthClient(token)` for user-scoped queries | All service files |
| G-07 | **Schema/RLS naming mismatch** | RLS references `officers`, schema uses `government_users` | Standardize table names | `schema.sql`, `002_rls_policies.sql` |

### 3.2 High-Priority Gaps (Should Fix for Beta)

| # | Gap | Current State | Target State |
|---|-----|---------------|--------------|
| G-08 | **Permission vocabulary mismatch** | Frontend uses `SANCTION_MUTATION`; backend uses `mutation.approve` | Align to backend constants |
| G-09 | **Hardcoded credentials in frontend** | `Password123!` in `authService.js` and `authConstants.js` | Remove; use proper login forms |
| G-10 | **No PostGIS geometry columns** | Parcels use lat/lng point columns only | Add `boundary GEOMETRY(Polygon, 4326)` column |
| G-11 | **Watchlist background job missing** | Watchlist CRUD exists but no change detection | Implement polling/webhook listener for changes |
| G-12 | **Valuation data hardcoded** | `_getValuation()` returns fixed circle rate | Connect to real valuation/ASR data source |
| G-13 | **Legacy routes not migrated** | Grievance, watchlist, public still in `src/routes/` | Move to `src/modules/` with controller/service pattern |
| G-14 | **Missing frontend services** | No GIS, citizen, officer, jurisdiction frontend services | Create service files mirroring backend modules |
| G-15 | **No loading/error states** | Some pages may not handle API failures gracefully | Add loading spinners, error boundaries, empty states |

### 3.3 Medium-Priority Gaps (For Full Feature Set)

| # | Gap | Current State | Target State |
|---|-----|---------------|--------------|
| G-16 | **Survey/GIS officer workspace** | Role exists, no frontend workspace | Build dedicated workspace page |
| G-17 | **ULB officer workspace** | Role exists, no frontend workspace | Build dedicated workspace page |
| G-18 | **Real OTP/SMS gateway** | Demo mode only | Integrate MSG91, Twilio, or government SMS gateway |
| G-19 | **DigiLocker integration** | Referenced in documentation but not implemented | Implement DigiLocker Pull/Push API |
| G-20 | **NGDRS webhook** | Mutation workflow references registration webhook | Implement webhook listener for deed events |
| G-21 | **Multi-language support** | English only | Implement i18n with regional language packs |
| G-22 | **Offline/PWA support** | Standard web app | Service worker, offline caching, sync |
| G-23 | **Document upload/storage** | Schema exists but no file upload service | Supabase Storage or S3 integration |
| G-24 | **Email notifications** | Schema and code reference email but no SMTP | Integrate email service (Resend, SES) |
| G-25 | **AI Advisory module** | Referenced in product vision but not implemented | Build advisory analysis service |

---

## 4. Implementation Roadmap

### Phase 0: Security Hardening (Immediate)

**Goal**: Remove all development shortcuts that create security risks.

| Task | Gap | Priority | Effort |
|------|-----|----------|--------|
| Remove auto-login from AuthContext | G-03 | 🔴 Critical | 1 hour |
| Remove hardcoded passwords from frontend | G-09 | 🔴 Critical | 1 hour |
| Restrict CORS origins | G-04 | 🔴 Critical | 30 min |
| Add ProtectedRoute component | G-05 | 🔴 Critical | 2 hours |
| Environment-gate demo OTP/password | G-01, G-02 | 🔴 Critical | 2 hours |

**Deliverable**: Platform requires real authentication; no implicit access.

---

### Phase 1: Data Integrity (1-2 Weeks)

**Goal**: Ensure all data flows are correct and secure.

| Task | Gap | Priority | Effort |
|------|-----|----------|--------|
| Synchronize schema.sql with migrations | G-07 | 🟠 High | 4 hours |
| Migrate services to use `createAuthClient()` for RLS | G-06 | 🟠 High | 1 day |
| Align frontend permissions to backend constants | G-08 | 🟠 High | 4 hours |
| Add PostGIS geometry columns and spatial indexes | G-10 | 🟠 High | 1 day |
| Migrate legacy routes to module structure | G-13 | 🟠 High | 1 day |
| Create missing frontend service files | G-14 | 🟠 High | 4 hours |

**Deliverable**: Database integrity verified, RLS functional, frontend/backend contracts aligned.

---

### Phase 2: Feature Completion (2-4 Weeks)

**Goal**: Complete all documented features to full operational status.

| Task | Gap | Priority | Effort |
|------|-----|----------|--------|
| Implement watchlist change detection job | G-11 | 🟡 Medium | 3 days |
| Connect valuation to real data source | G-12 | 🟡 Medium | 2 days |
| Add loading/error states to all pages | G-15 | 🟡 Medium | 3 days |
| Build Survey/GIS officer workspace | G-16 | 🟡 Medium | 5 days |
| Build ULB officer workspace | G-17 | 🟡 Medium | 5 days |
| Implement document upload/storage | G-23 | 🟡 Medium | 3 days |

**Deliverable**: All documented features are operational end-to-end.

---

### Phase 3: Production Readiness (4-8 Weeks)

**Goal**: Ready for pilot deployment with real users.

| Task | Gap | Priority | Effort |
|------|-----|----------|--------|
| Integrate real SMS gateway | G-18 | 🟢 Planned | 3 days |
| Integrate email notifications | G-24 | 🟢 Planned | 2 days |
| Implement multi-language support | G-21 | 🟢 Planned | 2 weeks |
| PWA with offline support | G-22 | 🟢 Planned | 1 week |
| DigiLocker integration | G-19 | 🟢 Planned | 1 week |
| NGDRS webhook integration | G-20 | 🟢 Planned | 1 week |

**Deliverable**: Platform ready for pilot with real citizens and officers.

---

### Phase 4: Intelligence Layer (8-12 Weeks)

**Goal**: Add governance intelligence and AI advisory capabilities.

| Task | Gap | Priority | Effort |
|------|-----|----------|--------|
| AI advisory analysis service | G-25 | 🔵 Future | 4 weeks |
| Document OCR and classification | — | 🔵 Future | 3 weeks |
| Advanced analytics with drill-down | — | 🔵 Future | 2 weeks |
| Cross-state federation | — | 🔵 Future | 4 weeks |

**Deliverable**: Full governance intelligence platform as envisioned.

---

## 5. Architecture Quality Assessment

| Dimension | Score | Notes |
|-----------|-------|-------|
| **Modularity** | 8/10 | Clean module structure; 3 legacy routes need migration |
| **Security design** | 7/10 | Strong architecture (RBAC, RLS, audit); implementation has dev shortcuts |
| **Data architecture** | 7/10 | Comprehensive schema; PostGIS underutilized; schema conflicts |
| **API design** | 8/10 | Consistent REST conventions; good error handling |
| **Frontend architecture** | 6/10 | Well-organized pages; auto-login bypass, permission mismatch |
| **Code quality** | 7/10 | Clear documentation in code; consistent patterns |
| **Test coverage** | 2/10 | No tests observed in the codebase |
| **Production readiness** | 4/10 | Development shortcuts prevent immediate deployment |

---

## 6. Codebase Metrics

| Metric | Value |
|--------|-------|
| Frontend pages | 50+ |
| Frontend components | 60+ |
| Frontend services | 10 |
| Backend modules | 13 |
| Backend routes | 16 files |
| Backend middleware | 8+ files |
| Database tables | 21 |
| Permissions defined | 40+ |
| Roles defined | 13 |
| Mutation states | 12 |
| Migration files | 3 |
| Seed data files | 2 (64KB + migration seed) |

---

## 7. Key Technical Decisions Remaining

| Decision | Options | Recommendation |
|----------|---------|----------------|
| **GIS tile serving** | pg_tileserv vs Martin vs pre-rendered tiles | Martin for MVT tiles — integrates with PostGIS |
| **SMS gateway** | MSG91 vs Twilio vs Gov SMS gateway | Government SMS gateway for compliance |
| **Email service** | Resend vs SES vs Nodemailer/SMTP | Depends on scale requirements |
| **File storage** | Supabase Storage vs S3 vs local | Supabase Storage for consistency |
| **Search engine** | PostgreSQL full-text vs OpenSearch/Elasticsearch | PostgreSQL FTS for MVP; OpenSearch for fuzzy name search at scale |
| **Caching** | None vs Redis vs in-memory | Redis for Parcel 360° caching in production |
| **Background jobs** | Node cron vs Bull/BullMQ vs pg-boss | pg-boss for PostgreSQL-native job queue |
| **i18n framework** | react-i18next vs custom | react-i18next — proven, well-supported |

---

## 8. Contradictions Found

| # | Source A | Source B | Conflict | Resolution Required |
|---|---------|---------|----------|---------------------|
| C-01 | `schema.sql` uses `government_users` | `002_rls_policies.sql` uses `officers` | Table name mismatch | Standardize to one name |
| C-02 | `schema.sql` uses `audit_events` | `002_rls_policies.sql` uses `audit_logs` | Table name mismatch | Standardize to one name |
| C-03 | RLS policies require `auth_user_id` | `schema.sql` does not include this column | Column missing | Add column or update RLS |
| C-04 | Frontend permissions: `SANCTION_MUTATION` | Backend permissions: `mutation.approve` | Vocabulary mismatch | Align to backend |
| C-05 | Backend `supabase.js`: `isMockMode() → false` | Frontend `AuthContext.jsx`: auto-login bypass | Design intent conflict | Remove auto-login |
| C-06 | Backend comment: "use createAuthClient" | Backend code: uses `getSupabaseAdmin()` | Implementation doesn't match intent | Migrate to auth client |
| C-07 | Product vision: "8 roles" | Code: 13 roles defined | Role count mismatch | Vision describes primary roles; code includes variants |

---

*This document defines the current state, gaps, and implementation roadmap for LAND-STACK.*
