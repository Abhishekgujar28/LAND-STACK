# Land Stack Backend API

Production-ready REST API for the **Land Stack** platform, built with **Node.js, Express.js, and Supabase PostgreSQL**.

---

## 🏗️ Architecture

```text
backend/
├── src/
│   ├── config/             # Environment & Supabase initialization
│   ├── controllers/        # Request handlers per domain
│   ├── middleware/         # CORS, logging, error handling
│   ├── routes/             # REST API routes
│   ├── services/           # Business logic & Supabase database queries
│   ├── data/               # Built-in fallback mock provider
│   └── server.js           # Express app entry point
├── database/
│   ├── schema.sql          # Normalized PostgreSQL DDL for Supabase
│   └── seed.sql            # Seed dataset with all prototype records
├── .env.example
├── package.json
└── README.md
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Supabase PostgreSQL Credentials
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 3. Setup Supabase Database
1. Open your project in the [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor**.
3. Execute `backend/database/schema.sql` to create the normalized tables, constraints, and indexes.
4. Execute `backend/database/seed.sql` to populate sample parcels, citizens, officers, and mutations.

### 4. Run Server
```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

---

## 🔑 Test Credentials & Personas

### 👤 Citizen Accounts (`/login/citizen`)
* **Default OTP**: `123456`
* **Captcha**: `XbfL3`

| Citizen ID | Name | Registered Mobile | State | Sample Holdings & Rights |
| :--- | :--- | :--- | :--- | :--- |
| **`CIT-001`** *(Default)* | **Aarav Patil** (आरव पाटील) | `+91 98230 45891` | Maharashtra | Gat 42 Wagholi, Pune (Agricultural / Bagayat) |
| **`CIT-002`** | **Sunita Kulkarni** (सुनिता कुलकर्णी) | `+91 98231 12345` | Maharashtra | Flat 402, Shivneri, Lohegaon, Pune (Residential NA) |
| **`CIT-003`** | **Rajesh Gaikwad** (राजेश गायकवाड) | `+91 98232 23456` | Maharashtra | Survey 118, Hinjawadi Phase 1, Pune (Commercial) |
| **`CIT-004`** | **Priya Shinde** (प्रिया शिंदे) | `+91 98233 34567` | Maharashtra | Gat 88, Manjri Khurd, Haveli, Pune (Agricultural) |
| **`CIT-005`** | **Rameshwar Chaudhary** (रामेश्वर चौधरी) | `+91 98290 12345` | Rajasthan | Khasra 210, Jhotwara, Jaipur (Abadi Commercial) |

---

### 🛡️ Government Official Accounts (`/login`)
* **Default Password**: `GovPass@2026`
* **Captcha**: `XbfL3`

| Role Code | Designation | Sample Officer | Official Email | Jurisdiction / Target Dashboard |
| :--- | :--- | :--- | :--- | :--- |
| **`TALATHI`** | Village Revenue Officer / Patwari | **Prakash Shinde** | `prakash.shinde@maharashtra.gov.in` | Wagholi Circle, Pune (`/government/talathi`) |
| **`TEHSILDAR`** | Tehsildar & Executive Magistrate | **Sanjay Deshmukh** | `sanjay.deshmukh@maharashtra.gov.in` | Haveli Taluka, Pune (`/government/tehsildar`) |
| **`SRO`** | Sub-Registrar Officer (Class I) | **Rekha Joshi** | `rekha.joshi@igrmaharashtra.gov.in` | SRO Haveli No 5, Pune (`/government/sro`) |
| **`COLLECTOR`** | District Collector & DM | **Dr. Suhas Diwase, IAS** | `collector.pune@maharashtra.gov.in` | Pune District (`/government/district`) |
| **`STATE_PMU`** | State PMU Head (DILRMP) | **Anil Verma** | `anil.verma@pmu.landrecords.gov.in` | State of Maharashtra (`/government/state`) |
| **`NATIONAL_MONITOR`** | National Cadastral Monitor (DoLR) | **Meera Sengupta** | `meera.sengupta@dolr.gov.in` | Pan-India 36 States (`/government/national`) |
| **`ADMIN`** | System & Security Administrator | **Manoj Tiwari** | `admin.landstack@nic.in` | Platform Cloud (`/government/admin`) |

---

## 📡 REST API Reference

Base URL: `http://localhost:5000/api/v1`

### Health Check
- `GET /health` — Server health status and Supabase connection state
- `GET /api/v1/health` — API health check endpoint

### Parcels
- `GET /api/v1/parcels` — List parcels with query filters (`search`, `village`, `tehsil`, `district`, `state`, `status`)
- `GET /api/v1/parcels/:ulpin` — Get parcel by ULPIN / ID
- `GET /api/v1/parcels/:ulpin/360` — Get complete composite 360° dossier (owners, encumbrances, restrictions, zoning, tax, court cases, documents, mutations)
- `GET /api/v1/parcels/:ulpin/owners` — Get ownership records
- `GET /api/v1/parcels/:ulpin/encumbrances` — Get registered bank charges / mortgages
- `GET /api/v1/parcels/:ulpin/restrictions` — Get statutory / environmental restrictions
- `GET /api/v1/parcels/:ulpin/zoning` — Get master plan zoning & permissible land use
- `GET /api/v1/parcels/:ulpin/tax` — Get municipal / gram panchayat tax records
- `GET /api/v1/parcels/:ulpin/court-cases` — Get revenue & civil court disputes
- `GET /api/v1/parcels/:ulpin/documents` — Get attached parcel certificates / maps
- `GET /api/v1/parcels/owner/:citizenId` — Get all parcels owned by a citizen (Form 8A)

### Mutations & Work Queues (e-Ferfar)
- `GET /api/v1/mutations` — List mutations (filter by `status`, `tehsilCode`, `parcelId`, `applicantId`)
- `GET /api/v1/mutations/:id` — Get mutation details & timeline
- `POST /api/v1/mutations` — Submit new mutation application
- `PATCH /api/v1/mutations/:id/status` — Update mutation status (sanction/reject/field verify)
- `GET /api/v1/mutations/queues/talathi` — Talathi field verification work queue
- `GET /api/v1/mutations/queues/tehsildar` — Tehsildar statutory sanction work queue
- `GET /api/v1/mutations/sro-audits` — SRO deed registration audits

### Authentication & Users
- `POST /api/v1/auth/login-citizen` — Citizen login (by mobile/email/id)
- `POST /api/v1/auth/login-officer` — Officer login (by role/email/id)
- `GET /api/v1/auth/citizens/:id` — Get citizen profile
- `GET /api/v1/auth/officers/:id` — Get officer profile
- `GET /api/v1/auth/roles/:role` — Get officers by role

### Applications & Grievances
- `GET /api/v1/applications` — List citizen service applications
- `POST /api/v1/applications` — Submit citizen application (7/12 extract, zone cert, conversion)
- `GET /api/v1/applications/types` — Service application catalogue
- `GET /api/v1/grievances` — List citizen grievances
- `POST /api/v1/grievances` — File a new land dispute / record grievance

### Watchlist & Notifications
- `GET /api/v1/watchlist` — Get citizen parcel watchlist
- `POST /api/v1/watchlist` — Add parcel to watchlist for mutation & encumbrance alerts
- `DELETE /api/v1/watchlist/:id` — Remove parcel from watchlist
- `GET /api/v1/notifications` — Get user alerts
- `PATCH /api/v1/notifications/:id/read` — Mark notification as read

### Analytics & Cadastral Monitoring
- `GET /api/v1/analytics/national` — National cadastral KPIs & state benchmarks
- `GET /api/v1/analytics/benchmarks` — State performance ranking matrix
- `GET /api/v1/analytics/state/:stateCode` — State PMU digitization & SLA compliance metrics
- `GET /api/v1/analytics/district/:districtCode` — District-level revenue KPIs
- `GET /api/v1/analytics/tehsil/:tehsilCode` — Tehsil-level pendency & mutation KPIs
- `GET /api/v1/analytics/system-health` — Administrative system uptime & API telemetry

### Public Content & Jurisdictions
- `GET /api/v1/public/services` — Public services directory
- `GET /api/v1/public/news` — Policy updates & land news
- `GET /api/v1/public/notices` — Public 15-day objection notices
- `GET /api/v1/public/jurisdictions` — Administrative hierarchy (States → Districts → Tehsils → Villages)
