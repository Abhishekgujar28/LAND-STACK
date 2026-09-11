# Land Stack — Full-Stack Land Governance Platform

**Land Stack** is India's unified, parcel-centric land records and cadastral governance platform, connecting citizens and government authorities with multi-department land intelligence.

---

## 📁 Repository Structure

```text
Land-Stack/
├── frontend/             # React (Vite) Single Page Application & Citizen/Official Portals
├── backend/              # Node.js + Express.js REST API with Supabase PostgreSQL
└── docs/                 # Product requirements, PRD, architecture, and backend blueprints
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18 or higher (v20+ recommended)
- **Supabase**: Account and PostgreSQL database instance (optional for local fallback mode)

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials (SUPABASE_URL and SUPABASE_ANON_KEY)
npm run dev
```
Backend runs at `http://localhost:5000` (API base: `http://localhost:5000/api/v1`).

### 3. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Frontend runs at `http://localhost:5173`.

### 4. Database Setup (Supabase)
To provision the database schema and sample seed records on Supabase:
1. Open [Supabase SQL Editor](https://supabase.com/dashboard).
2. Run `backend/database/schema.sql`.
3. Run `backend/database/seed.sql`.

---

## 🏛️ Key Capabilities

- **Parcel 360° Dossier**: Comprehensive 360-degree view combining RoR, spatial geometry, encumbrances, restrictions, zoning, tax status, and court cases.
- **e-Ferfar Workflow Engine**: 6-step statutory mutation workflow with field verification, objection windows, and Tehsildar sanctions.
- **7 Government Workspaces**: Task-first portals for Talathi, Tehsildar, Sub-Registrar (SRO), District Collector, State PMU, National Monitor (DoLR), and System Admin.
- **Real-Time Watchlist**: Citizen alerts on mutation notices and encumbrance filings.
