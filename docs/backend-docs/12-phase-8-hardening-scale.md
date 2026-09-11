# Phase 8 — Hardening & Scale

**Goal**: Security hardening, performance optimization, observability, load testing, and multi-state readiness — making the system production-worthy.

**Why Now**: This is the final phase before any production deployment or serious demo. All features are built; now we ensure they're secure, fast, and reliable.

---

## What Gets Built

### Security Hardening
- **Penetration testing**: OWASP Top 10 audit against all Express endpoints
- **CSRF protection**: Verify SameSite=Strict cookies prevent cross-site attacks; add CSRF tokens for state-mutating operations if needed
- **Rate limiting per endpoint**: Different limits for search (high), auth (medium), mutation approval (low)
- **Input validation**: Every Express endpoint validates input against defined schemas (JSON schema or Zod)
- **SQL injection prevention**: Supabase client parameterizes all queries, but verify no raw SQL concatenation exists
- **Header hardening**: Helmet middleware sets X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security
- **Dependency audit**: Scan all npm dependencies for known vulnerabilities

### Performance Optimization
- **PostGIS query optimization**: EXPLAIN ANALYZE on all spatial queries; ensure GIST indexes are being used
- **Connection pooling**: Supabase's Supavisor handles this, but verify pool sizing is appropriate
- **Response compression**: gzip/brotli on all API responses (especially large Parcel 360° payloads)
- **Tile caching**: Verify MVT tile cache hit rates; adjust TTL if needed
- **Materialized view refresh**: Optimize refresh schedules for analytics aggregates
- **Pagination**: All list endpoints paginated with cursor-based pagination (not offset-based)

### Observability
- **Structured logging**: Every Express request logged with correlation ID, user ID, role, endpoint, duration, status code
- **Error tracking**: Unhandled errors captured with full context (stack trace, request body, user info)
- **Health checks**: `/health` endpoint checking database connectivity, PostGIS availability, and auth service status
- **Supabase dashboard**: Monitor database performance, RLS policy evaluation times, storage usage, realtime connection count

### Load Testing
- **Target**: 10,000 concurrent citizen users + 2,000 concurrent government officers
- **Critical paths**: Parcel search (P95 < 500ms), Parcel 360° (P95 < 2s), map tile delivery (P95 < 200ms), mutation status check (P95 < 1s)
- **Spatial query load**: Verify point-in-polygon performance under concurrent load with GIST indexes

### Multi-State Readiness
- **State onboarding**: Verify that adding a new state is purely a `state_config` insert — no code changes
- **Terminology verification**: Test with MH, KA, TN, UP terminologies simultaneously
- **Partitioning validation**: Verify parcel table partitioning by state_code works correctly for jurisdiction-scoped queries

### Audit Trail Verification
- **Hash-chain integrity check**: Run the full SHA-256 hash-chain verification across all audit events
- **Tamper detection test**: Manually modify an audit event and verify the verification catches it
- **Append-only enforcement**: Verify that UPDATE and DELETE on audit_event raise PostgreSQL errors

## Stakeholders Served
- **All 8 roles**: Everyone benefits from a faster, more secure, more reliable system
- **System Administrator**: Observability tools and audit verification capabilities

## Key Decisions
- **Security over convenience**: We accept slower development for tighter security. Every endpoint is validated, every query is parameterized, every response is filtered by role.
- **Cursor-based pagination**: Offset pagination breaks on large datasets (SELECT ... OFFSET 10000 is slow). Cursor-based pagination (WHERE id > last_seen_id) is stable regardless of dataset size.
- **No premature optimization**: We only optimize paths that load testing proves are slow. Don't guess at bottlenecks.

## Dependencies
- All previous phases (1-7) complete

## Exit Criteria
- Penetration test passes with no critical or high findings
- Load test meets performance targets for all critical paths
- Hash-chain verification runs successfully with zero integrity errors
- Adding a new state via state_config works without code deployment
- Structured logging captures all requests with correlation IDs
- Health check endpoint returns accurate system status

## Risks
- **Performance surprises under load**: Spatial queries may behave differently under concurrency. Mitigated by load testing with realistic spatial query patterns.
- **Supabase plan limits**: High traffic may hit Supabase's free/pro tier limits. Mitigated by understanding plan limits early and provisioning appropriately.

## References
- [architecture.md](../../docs/architecture.md) Section 8 — Security Architecture
- [01-prd.md](../../docs/01-prd.md) Section 8 — Non-Functional Requirements (performance targets)
- [phases.md](../../docs/phases.md) Phase 14 — Production Hardening
- [rules.md](../../docs/rules.md) — Platform rules and security constraints
- CERT-In guidelines — Session management and incident reporting requirements
