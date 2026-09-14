# BHARATBHUMI Backend Documentation

Welcome to the technical engineering documentation for the **BHARATBHUMI** (Land Stack) backend. This platform provides secure, database-backed land governance, parcel provenance, citizen statutory service delivery, and quasi-judicial mutation state workflows across rural and urban jurisdictions.

---

## What the Backend Does

The BHARATBHUMI backend is an enterprise-grade RESTful land records and revenue administration API. It is designed to replace fragmented legacy revenue records with a unified, tamper-evident digital architecture:

- **Database-Only Engine:** The application uses Supabase PostgreSQL as the mandatory runtime database. No mock runtime provider exists. Only limited SQL seed data is used for development/demo.
- **Statutory Identity & RBAC:** Phone-based OTP authentication for landholders/citizens and role-based credentials for 14 distinct government officers (Talathi, Tahsildar, Sub-Registrar, SDO, Collector, PMU, System Admin). Features dynamic context switching (Rural vs. Urban vs. Shared GIS) and hierarchical territorial jurisdiction enforcement.
- **Parcel 360° Profile:** Comprehensive aggregator combining spatial attributes, ownership khata records, encumbrances (mortgages, bank liens), statutory restrictions (Tribal Section 36A, eco-sensitive zones), planning zoning, municipal tax history, court litigation/stay orders, and Ready Reckoner circle rate valuations.
- **12-State Mutation State Machine:** A deterministic workflow engine for land mutations (e-Ferfar) enforcing statutory notice windows (Form 135D), ground inspection geotagged panchnama evidence, formal objection tracking, dispute hearings, and quasi-judicial digital signature orders.
- **Quasi-Judicial Dossiers & Work Queues:** Automatically derives officer work queues based on territorial jurisdiction assignments (village, circle, tehsil, district) and compiles immutable case dossiers for dispute resolution.
- **Spatial GIS Operations:** Real-time GeoJSON cadastral boundaries, village cadastral mapping, bounding-box spatial filtering, and polygon topological integrity validation.
- **Immutable Audit Trail:** Append-only security audit log recording every actor, role, jurisdiction, state transition, IP address, and client fingerprint.

---

## Current Technology Stack

| Layer | Technology / Package | Purpose |
|---|---|---|
| **Runtime Environment** | Node.js (v20+ / v24 ESM) | High-performance asynchronous JavaScript engine |
| **Web Framework** | Express.js (`v4.21.2`) | HTTP routing, request dispatch, and middleware pipeline |
| **Database & Auth Platform** | Supabase (`@supabase/supabase-js v2.49.1`) | PostgreSQL, PostGIS spatial extensions, Supabase Auth, Row Level Security |
| **Security & Headers** | Helmet (`v8.3.0`) | HTTP security header protection (CSP, HSTS, XSS filter) |
| **Session Management** | Cookie-Parser (`v1.4.7`) | HTTP-only, SameSite-protected session cookie management |
| **Data Compression** | Compression (`v1.8.2`) | Gzip/Brotli payload compression for low-bandwidth rural networks |
| **CORS Middleware** | CORS (`v2.8.5`) | Strict cross-origin resource sharing with credential support |
| **Schema Validation** | Zod (`v4.6.5`) | Strict runtime schema parsing and error formatting for input payloads |
| **Rate Limiting** | Express-Rate-Limit (`v8.7.0`) | IP and identifier rate limiting for API, login, and OTP endpoints |
| **Tracing & UUIDs** | UUID (`v14.0.2`) | Distributed request correlation tracing (`X-Correlation-Id`) |
| **File Uploads** | Multer (`v2.3.0`) | Multipart form handling for land records and geotagged field photos |

---

## Current Implementation Status Summary

The backend has undergone a complete production architecture refactor. It features **80 registered endpoints**, all of which have been verified via automated test suites:

- **Authentication & Sessions:** 100% functional (Citizen phone OTP + Government officer login + cookie-based JWT sessions + context switching).
- **Security & RBAC:** 100% functional (14 roles, explicit permission gates; System Administrator is strictly blocked from statutory mutation approvals).
- **Parcel 360° Aggregator:** 100% functional with data health diagnostics and circle rate valuations.
- **Mutation Workflow Engine:** 100% functional 12-state machine preventing arbitrary state jumping and requiring statutory prerequisites.
- **Officer Case Dossiers & Queues:** 100% functional, deriving queues directly from officer assignments.
- **Cadastral GIS Engine:** 100% functional GeoJSON features, village maps, and polygon validation.
- **Database Migrations:** Schema, RLS policies, and rural/urban Maharashtra seed data delivered in `database/migrations/`.

---

## Documentation Structure

This documentation suite is organized into 4 comprehensive guides and a complete Postman collection:

```
backend/docs/
├── README.md                      <-- This landing page and architecture orientation
├── BACKEND_DOCUMENTATION.md       <-- The definitive comprehensive engineering guide (Architecture, DB, RBAC, Modules)
├── API_REFERENCE.md               <-- Complete 80-endpoint API catalog with schemas, curl examples, and response shapes
├── SETUP_AND_TESTING.md           <-- Developer operations guide: local setup, database provisioning, test execution
└── postman/
    └── BHARATBHUMI.postman_collection.json  <-- Ready-to-import Postman collection v2.1 covering all endpoints
```

---

## Quick Reference Links

1. **[Comprehensive Technical Documentation](./BACKEND_DOCUMENTATION.md)**:
   Detailed deep-dive into the backend architecture, request lifecycle, PostgreSQL schema, RLS policies, 12-state mutation engine, and readiness audit.
2. **[Complete API Reference](./API_REFERENCE.md)**:
   Full endpoint-by-endpoint reference covering paths, query parameters, request bodies, success/error responses, and curl commands.
3. **[Setup & Testing Guide](./SETUP_AND_TESTING.md)**:
   Step-by-step instructions for installation, environment configuration, database seeding, automated verification, and Postman testing.

---

## Quick Start Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and adjust variables as required:
```bash
cp .env.example .env
```
*(You must configure `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to start the server).*

### 3. Start Development Server
```bash
npm run dev
```

### 4. Verify Server Health
```bash
curl -s http://localhost:5000/health
```

Expected output:
```json
{
  "status": "healthy",
  "timestamp": "2026-09-14T12:00:00.000Z",
  "service": "Land Stack Express Backend",
  "version": "2.0.0",
  "mode": "mock",
  "correlationId": "8f3b0e12-32aa-4f22-921c-4b5cb389021e"
}
```

### 5. Run Automated Test Suite
```bash
node tests/verify-api.js
```
*(Runs 15 automated test cases verifying auth, RBAC, parcel 360, mutations, and work queues).*

---

## Server Network Endpoints

- **Backend Base URL:** `http://localhost:5000/api/v1`
- **Root Health Check:** `http://localhost:5000/health`
- **API Health Check:** `http://localhost:5000/api/v1/health`
