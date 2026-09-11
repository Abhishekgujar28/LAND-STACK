# Land Stack — Database Design Philosophy

**Version**: 1.0 | **Date**: September 2026
**Prerequisite**: Read [02-auth-and-roles.md](./02-auth-and-roles.md) first
**Reference**: [Architecture](../../docs/architecture.md) Section 5, [Glossary](../../docs/glossary.md)

---

## 1. The Core Modeling Challenge

Land records are not like user profiles or e-commerce orders. They have unique properties that make naive database design dangerous:

- **They're relational across dimensions**: A parcel has many owners, each owner holds a share of a right, each right may have restrictions from different government departments, each restriction has a provenance from a different state system.
- **They're temporal**: A parcel's ownership changes over decades. We need to know not just who owns it now, but who owned it in 1995, and when we learned about that change.
- **They're spatial**: Every parcel is a polygon on the earth's surface. We need to perform geometric operations (area calculation, intersection, containment) at query time.
- **They're federated**: The same parcel might have a Survey Number in one system, a Gat Number in another, and a ULPIN in a third. All are valid identifiers for the same piece of land.
- **They're sensitive**: Land records contain information about people's most valuable asset. Privacy, integrity, and auditability are non-negotiable.

Our database design must handle all of these properties simultaneously.

---

## 2. LADM-Inspired Data Modeling

We model our data inspired by the **Land Administration Domain Model (LADM, ISO 19152)** — the international standard for land administration systems. LADM defines three core concepts:

### The Party-RRR-Spatial Unit Triplet

**Party**: A person or organization that holds rights over land. In Indian context: an individual landowner, a joint family (HUF), a government body, a trust, a corporation.

**RRR (Rights, Restrictions, Responsibilities)**: The legal or social relationship between a party and land.
- **Right**: Ownership, lease, mortgage, usufruct
- **Restriction**: Forest land, tribal land, CRZ zone, court injunction, acquisition notification
- **Responsibility**: Maintaining a boundary marker, preserving a heritage structure

**Spatial Unit**: The geometric representation of the land — a polygon (or multipolygon) with a specific coordinate reference system (SRID 4326 / WGS 84).

The central relationship is: **A Party holds a Right over a Spatial Unit.**

In practice, we add a fourth concept that LADM calls the **Basic Administrative Unit (BAUnit)** — we call it the **Parcel**. The Parcel is the canonical entity that links parties, rights, restrictions, and spatial units together. The ULPIN is the Parcel's unique identifier.

> *Reference: LADM structure from ISO 19152 documentation (gdmc.nl, gim-international.com). Applied to Indian context using terminology from [glossary.md](../../docs/glossary.md) and the BharatBhumi National Federated Architecture reference.*

---

## 3. Supabase PostgreSQL Capabilities

Supabase runs PostgreSQL 16, which gives us access to powerful extensions:

| Extension | Purpose |
|---|---|
| **PostGIS 3.4** | Geometry types (POINT, POLYGON, MULTIPOLYGON), spatial indexes (GIST), spatial functions (ST_Contains, ST_Intersects, ST_Area, ST_Distance) |
| **pgcrypto** | SHA-256 hashing for audit trail hash chains, PII hashing |
| **uuid-ossp** | UUID generation for primary keys (gen_random_uuid()) |
| **pg_trgm** | Trigram-based fuzzy text matching for owner name search across transliterations |
| **btree_gist** | Enables exclusion constraints on temporal ranges (prevents overlapping valid periods) |

These extensions are all available in Supabase and can be enabled via the Dashboard or SQL commands.

> *Reference: Supabase PostGIS documentation confirmed these extensions are available (supabase.com/docs/guides/database/extensions).*

---

## 4. Projections, Not Originals

This concept is so important it has its own section.

Land Stack **never holds the authoritative truth**. Bhulekh holds the truth about ownership. NGDRS holds the truth about registration. BhuNaksha holds the truth about cadastral geometry. Revenue Courts hold the truth about disputes.

What we hold are **projections** — snapshots of that data, read from the authoritative systems via State Adapters, timestamped, attributed, and scored for freshness and confidence.

Why does this matter for database design?

1. **Every table has provenance columns**: `source_system`, `source_authority`, `retrieval_time`, `freshness_score`, `confidence_score`. No piece of data exists without knowing where it came from.

2. **We never expose data without attribution**: The API response for a parcel's ownership includes "Source: Revenue Department, Government of Maharashtra, via Mahabhulekh, retrieved 2026-09-10T14:30:00Z, freshness: HIGH."

3. **We can handle contradictions**: If Mahabhulekh says the area is 0.5 hectares but the PostGIS-calculated area from the BhuNaksha polygon is 0.48 hectares, we don't silently pick one. We store both, flag the discrepancy in the `data_quality_issue` table, and let the officer see the conflict.

4. **We can survive source outages**: If Bhoomi (Karnataka's RoR system) goes down for maintenance, we serve the last cached projection with a "Data may be outdated" warning. The projection has a `retrieval_time` timestamp so the citizen knows how fresh it is.

---

## 5. Bi-Temporal Modeling

Every mutable record in Land Stack has **two independent time dimensions**:

### Valid Time (valid_from / valid_to)

"When was this fact true in the real world?"

Example: Ramesh Kumar owned Gat 45/2A from January 2015 to August 2026. Then he sold it to Priya Sharma. The ownership record for Ramesh has `valid_from = 2015-01-15` and `valid_to = 2026-08-20`. Priya's record has `valid_from = 2026-08-20` and `valid_to = infinity`.

### System Time (system_from / system_to)

"When did our system learn about this fact?"

Example: The sale happened on August 20, but NGDRS sent us the webhook on August 22, and we processed it on August 23. Priya's ownership record has `system_from = 2026-08-23` (when we learned it) but `valid_from = 2026-08-20` (when it actually happened).

### Why Both?

- **Time-travel queries**: "Show me who owned this parcel on March 1, 2020" → filter by `valid_from <= '2020-03-01' AND valid_to > '2020-03-01'`
- **Audit and correction**: "When did our system first record this ownership?" → check `system_from`
- **Retroactive corrections**: If we discover a data error, we don't UPDATE the row (that would destroy history). We close the old row (`system_to = NOW()`) and insert a corrected row (`system_from = NOW()`). The old incorrect record is still there for audit purposes.

This is the same temporal modeling approach used by banks, healthcare systems, and intelligence agencies — anywhere where the complete history of what was known and when it was known is legally important.

> *Reference: Bi-temporal modeling approach from [architecture.md](../../docs/architecture.md) Section 5.2 and [phases.md](../../docs/phases.md) Phase 1.*

---

## 6. Audit Trail Philosophy

The audit trail is not a nice-to-have feature. For a government land governance platform, it's a **legal necessity**. Every action by every actor must be recorded, and the record must be tamper-evident.

### Append-Only

The `audit_event` table only supports INSERT. No UPDATE, no DELETE — enforced by a PostgreSQL trigger that raises an exception on any attempt. This is not application-level protection that could be bypassed — it's a database-level constraint.

### Hash-Chained

Each audit event is linked to the previous one via a SHA-256 hash chain:

```
Hash[i] = SHA-256(Hash[i-1] + Action + ActorId + ResourceType + ResourceId + Timestamp)
```

If anyone modifies a historical audit event directly in the database (bypassing the application), the hash chain breaks. A verification function can scan the chain and detect the tampering point.

### What Gets Audited

Every meaningful action: login, logout, parcel view, search query, mutation state change, document upload, field verification submission, statutory approval, data quality flag creation, configuration change, RLS policy update.

### Verification

A System Administrator can run a hash-chain verification at any time. The system scans all audit events in chronological order, recalculates each hash, and compares. If any hash doesn't match, the system reports exactly which event was tampered with.

> *Reference: Hash-chained audit from [architecture.md](../../docs/architecture.md) Section 5.3 (audit_event table with SHA-256 hash chaining). The LAND-STACK README describes the mathematical formula.*

---

## 7. Data Flow Pipeline

Here's how data moves from the real world into our database and out to users:

```
EXTERNAL STATE SYSTEMS              OUR SYSTEM                         USERS
─────────────────────              ──────────                         ─────

Mahabhulekh (MH RoR)  ──┐
Bhoomi (KA RoR)       ──┤
Patta Chitta (TN RoR) ──┤         State Adapter
Bhulekh UP            ──┤──────→  (transform to     ──→  Supabase Tables
BhuNaksha (Cadastral)  ──┤         canonical model)       (PostgreSQL +
NGDRS (Registration)  ──┤                                  PostGIS + RLS)
RCCMS (Courts)        ──┤                                      │
ULB (Property Tax)    ──┤                                      ▼
Forest Dept           ──┘                                 Supabase Views
                                                          (role-filtered)
                                                               │
                                                               ▼
                                                         Express API
                                                         (orchestration)
                                                               │
                                                     ┌─────────┴─────────┐
                                                     ▼                   ▼
                                               Citizen PWA        Government Portal
                                               (Parcel 360°)     (Work Queues)
```

At each stage:
- **State Adapter** → Transforms state-specific format to canonical model, adds provenance
- **Supabase Tables** → Stores projection with bi-temporal timestamps
- **RLS Policies** → Filters rows based on JWT claims (role, jurisdiction)
- **Express API** → Orchestrates multi-table queries, applies business logic
- **Frontend** → Renders role-appropriate view (citizen vs officer)

---

## 8. Key Design Decisions

| Decision | Rationale |
|---|---|
| UUIDs for all primary keys | Enables distributed ID generation, prevents sequential enumeration attacks |
| ULPIN as natural key on parcel | DILRMP mandate; 14-digit geo-coordinate-derived identifier |
| Separate `provenance` table | Normalized provenance avoids duplicating source attribution across every table |
| `data_quality_issue` table | Explicit storage of detected conflicts rather than silent conflict resolution |
| Partitioning audit_event by month | Audit tables grow fastest; monthly partitions keep queries fast |
| Partitioning parcel by state_code | State-level data sovereignty; improves query performance for jurisdiction-scoped queries |

---

*Next: [04-gis-spatial-strategy.md](./04-gis-spatial-strategy.md) — The spatial deep-dive.*
