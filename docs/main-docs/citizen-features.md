# Land Stack — Citizen Features Specification

**Version**: 3.0 | **Last Updated**: September 2026  
**Primary User**: Citizen (Land Owner, Buyer, Stakeholder)  
**Interface**: Web / Progressive Web App (PWA)

> **Implementation Note**: The citizen portal is implemented using **React 19 / Vite 8**, **Leaflet JS**, and **Supabase Auth / Realtime**. References to older tech (like Next.js or generic CDC) have been updated to match the current stack.

This document specifies the exact behavior of every citizen-facing feature in the Land Stack platform.

---

## 1. Account & Profile Features

### 1.1 Citizen Registration & Login (OTP)

**Purpose**: Secure, password-less authentication for citizens.
**Problem solved**: Eliminates password fatigue and ensures the account is tied to a verified mobile number (the de facto digital identity in India).

- **User journey**: Citizen enters mobile → Receives SMS OTP → Enters OTP → Logged in.
- **Frontend behavior**:
  - Simple mobile number input with +91 prefix default.
  - 30-second countdown timer for resend OTP.
  - Auto-read OTP on Android if WebOTP API is supported.
- **Backend behavior**:
  - Rate limits OTP generation (max 3 per 5 mins per IP/mobile).
  - Verifies OTP and issues JWT + Refresh Token.
  - Creates citizen profile on first successful login.
- **API requirements**: `POST /api/v1/auth/otp/send`, `POST /api/v1/auth/otp/verify`
- **Security**: AES-256 hash of mobile number. JWT access token (15m expiry).
- **Failure cases**: SMS gateway delay; max retries exceeded; expired OTP.
- **Success criteria**: 99% OTP delivery within 10 seconds; successful token issuance.

### 1.2 Aadhaar eKYC Linkage (Optional)

**Purpose**: Elevate account trust level to access certified documents and submit mutation requests.
**Problem solved**: Verifies identity cryptographically without requiring a physical visit.

- **User journey**: Profile → "Link Aadhaar" → Redirect to UIDAI/DigiLocker → Consent → Linked.
- **Frontend behavior**: Explicit DPDP consent checkbox before redirect.
- **Backend behavior**: Receives eKYC payload. Extracts Name, DoB, Gender, Address. Stores only the Aadhaar reference token (never raw Aadhaar).
- **External integrations**: UIDAI ASA/AUA APIs or DigiLocker OAuth.
- **Security**: Raw Aadhaar numbers are explicitly forbidden from database storage.
- **Success criteria**: Successfully matches citizen identity to RoR owner name.

### 1.3 Multilingual Interface

**Purpose**: Make the platform accessible in the citizen's native language.
**Problem solved**: Rural citizens often cannot navigate complex English legal terminology.

- **User journey**: Global language toggle in header (e.g., English / मराठी / हिंदी).
- **Frontend behavior**: Dynamic string replacement via `react-i18next`. RTL support for Urdu.
- **Backend behavior**: Returns State-specific terminology based on selected language via `state_config`.
- **Success criteria**: Entire UI, including data labels from the backend, translates correctly.

---

## 2. Parcel Discovery Features

### 2.1 ULPIN Search

**Purpose**: Direct exact-match lookup of a land parcel.
**Problem solved**: Bypasses the complex hierarchical search if the citizen knows the 14-digit ID.

- **User journey**: Enters 14-digit alphanumeric code → Directs to Parcel 360.
- **Frontend behavior**: Input mask formatting `XX-XX-XX-XXXX-XXXX`. Auto-capitalization.
- **Backend behavior**: Queries `parcel` table. If not found, falls back to external ULPIN Registry API.
- **Failure cases**: Invalid format (client-side validation); Not found (404).

### 2.2 Hierarchical Survey Number Search

**Purpose**: Find a parcel using traditional State-specific administrative boundaries.
**Problem solved**: Most citizens don't know their ULPIN yet, only their Survey/Khasra/Gat number.

- **User journey**: Select State → District → Tehsil → Village → Enter Survey No.
- **Frontend behavior**: Cascading dropdowns. State-specific labels (e.g., "Taluka" in MH, "Taluk" in KA).
- **Backend behavior**: Queries `parcel_identifier` table.
- **External integrations**: If not in Land Stack DB, queries State RoR API via State Adapter.

### 2.3 Owner Name Search (Fuzzy)

**Purpose**: Find parcels owned by a specific person or family.
**Problem solved**: Citizens often want to see "all land owned by my grandfather."

- **User journey**: Search bar → Type "Ramesh Patil" → See list of matching parcels.
- **Backend behavior**: OpenSearch query across `owner_name` and `owner_name_transliterated` with fuzziness.
- **Privacy constraint**: Returns parcel IDs and villages, but NEVER full contact details or Aadhaar numbers of the owner.
- **Failure cases**: Too many results (e.g., searching "Patil") → prompts to refine by District/Village.

### 2.4 Interactive Map Search

**Purpose**: Spatial discovery of land parcels.
**Problem solved**: Finding a parcel when the identifier is unknown but the physical location is known.

- **User journey**: Open map → Pan/Zoom to area → Click on polygon → See Parcel 360 summary.
- **Frontend behavior**: Leaflet JS rendering vector tiles (or MapLibre wrapper if WebGL needed). Click triggers spatial query.
- **Backend behavior**: PostGIS `ST_Contains` query to find the polygon under the click coordinate.
- **External integrations**: BhuNaksha WMS tiles for cadastral boundaries.

---

## 3. Parcel 360° Features

### 3.1 Unified Overview (Rural vs Urban)

**Purpose**: Single snapshot of the parcel's most critical data tailored to its administrative context.
**Problem solved**: Eliminates the need to mentally aggregate data from 5 different portals and standardizes terminology based on location.

- **Frontend behavior**: Displays ULPIN, State ID, Area, Classification, and a color-coded "Clear/Encumbered/Disputed" status badge.
  - **Rural Context**: Uses agricultural terminology (Survey No, Gat, Hissa), focuses on 7/12 & 8A extracts, and highlights cadastral boundaries.
  - **Urban Context**: Uses municipal terminology (CTS No, Property Card), focuses on property tax, FSI, and master plan zoning.
- **Backend behavior**: Aggregates data from `parcel`, `ror_projection`, and `data_quality_issue` tables based on the `is_urban` flag.
- **Provenance**: Every field has an info icon showing "Source: [System], Authority: [Dept], Last verified: [Time]".

### 3.2 Ownership & Record of Rights (RoR) Tab

**Purpose**: Display current legal ownership.
**Problem solved**: Reading cryptic RoR documents.

- **Frontend behavior**: Tabular display of owners, shares, and acquisition details.
- **Backend behavior**: Fetches latest valid `ror_projection`.
- **External integrations**: State RoR API (via adapter).

### 3.3 Transaction History Tab

**Purpose**: Show the chain of title.
**Problem solved**: Tracking how land changed hands over decades.

- **Frontend behavior**: Vertical timeline UI (newest first).
- **Backend behavior**: Merges `registration_transaction` and historical `ror_projection` records.

### 3.4 Encumbrances Tab

**Purpose**: Display active financial liabilities on the land.
**Problem solved**: Buyers discovering mortgages only after paying an advance.

- **Frontend behavior**: Lists active mortgages, liens, attachments. Button to "Request Official NEC".
- **Backend behavior**: Fetches from `encumbrance` table (synced from Registration Dept).
- **Failure cases**: Registration API down → displays cached data with "STALE" warning.

### 3.5 Restrictions & Government Land Watch Tab

**Purpose**: Prevent illegal transactions on restricted land.
**Problem solved**: Citizens unknowingly buying forest land or land notified for acquisition.

- **Frontend behavior**: Prominent red/yellow alerts for Forest, Tribal, or Acquisition overlaps.
- **Backend behavior**: PostGIS spatial intersection between parcel boundary and restricted zone geometries.
- **External integrations**: Forest Dept, Tribal Dept, NHAI/Collector acquisition APIs.

### 3.6 Zoning & Planning Tab

**Purpose**: Show permitted land use.
**Problem solved**: Buying agricultural land hoping to build a commercial complex, only to find it's a green zone.

- **Frontend behavior**: Displays Master Plan zone (e.g., Residential R-1) and permitted FSI.
- **Backend behavior**: Spatial intersection with Town Planning `planning_zone` layers.

### 3.7 Property Tax Tab

**Purpose**: Show municipal tax compliance.
**Problem solved**: Buying property with years of unpaid tax arrears.

- **Frontend behavior**: Displays assessment year, amount due, and "Pay Now" link.
- **External integrations**: Redirects to municipal payment gateway with parcel context.

### 3.8 Disputes & Courts Tab

**Purpose**: Highlight active litigation.
**Problem solved**: Buying land stuck in a 10-year civil suit.

- **Frontend behavior**: Lists case numbers, court names, and next hearing dates.
- **External integrations**: RCCMS (Revenue Courts) and e-Courts (Civil).

---

## 4. Due Diligence Features

### 4.1 Automated Due Diligence Report

**Purpose**: Generate a comprehensive pre-purchase risk assessment.
**Problem solved**: Paying advocates for basic initial fact-checking.

- **User journey**: Click "Generate Due Diligence Report" → System checks 8 criteria → Generates PDF.
- **Frontend behavior**: Displays a checklist (Ownership, Encumbrance, Restrictions, etc.) with Pass/Fail/Warning icons.
- **Backend behavior**: Aggregates all Parcel 360 data, runs rules engine (e.g., if active mortgage -> WARNING).
- **Success criteria**: Generates a clean PDF that explicitly states "Advisory only - not a legal document."

---

## 5. Mutation Tracking Features

### 5.1 End-to-End Tracking Timeline

**Purpose**: Transparent view of the mutation lifecycle.
**Problem solved**: Citizens making repeated trips to the Tehsil office just to ask "What is the status?"

- **User journey**: Dashboard → Active Mutations → Click case → View timeline.
- **Frontend behavior**: Stepper UI showing: Initiated → Notice → Field Verification → Tehsildar Sanction → RoR Updated.
- **Backend behavior**: `workflow` module tracks state machine transitions via webhook events from Revenue Dept.
- **SLA tracking**: Shows "Target Completion Date" and color-codes delays (Green/Yellow/Red).

---

## 6. Watchlist & Alert Features

### 6.1 Parcel Watchlist

**Purpose**: Proactive monitoring of land assets.
**Problem solved**: NRI or urban owners discovering encroachments or fraudulent sales years after the fact.

- **User journey**: Parcel 360 → Click "⭐️ Watch this Parcel" → Configure alerts.
- **Frontend behavior**: Modal to select alert triggers (Ownership change, New encumbrance, Zoning change).
- **Backend behavior**: Supabase Realtime detects changes in projections and triggers the notification module via Postgres triggers.
- **Failure cases**: False positives due to data formatting changes (mitigated by DQ engine normalization).

---

## 7. Document Access Features

### 7.1 Digital Document Wallet

**Purpose**: Central repository for land-related documents.
**Problem solved**: Losing physical 7/12 extracts or sale deeds.

- **User journey**: Parcel 360 → Documents Tab → Download.
- **Frontend behavior**: List of PDFs with "Download" or "Request Certified Copy" actions.
- **Backend behavior**: Generates pre-signed S3 URLs (15-minute expiry). Logs all access in the audit trail.
- **Security**: Documents are stored in encrypted S3 buckets. Only authorized citizens (verified owners) can download sensitive deeds; public extracts available to all.

---

## 8. Grievance & Application Features

### 8.1 Data Discrepancy Reporting

**Purpose**: Crowdsource data quality improvements.
**Problem solved**: State has no mechanism to know when digitized data is wrong.

- **User journey**: Parcel 360 → Data Health Tab → "Report Error" → Select field (e.g., Area is wrong) → Upload evidence.
- **Backend behavior**: Creates a `grievance` record and routes it to the respective State Revenue API.
- **Tracking**: Appears in the citizen's "My Applications" dashboard.

---

## 9. Notification Features

### 9.1 Multi-Channel Alerts

**Purpose**: Keep citizens informed where they are.
**Problem solved**: Citizens missing 30-day objection notices for mutations.

- **Features**: SMS (critical alerts), Email (detailed reports, due diligence), In-app push (status updates).
- **Backend behavior**: Template engine dynamically translates messages into the citizen's preferred language.

---

## 10. AI Advisory Features (System-Generated)

### 10.1 Name Matching (Advisory)

**Purpose**: Resolve transliteration and spelling variations.
**Problem solved**: "Ramesh Kumar" in registration vs "Rameshkumar" in RoR causing automated mutation failures.

- **Backend behavior**: Uses NLP/Levenshtein distance to calculate match confidence.
- **Constraint**: If confidence < 95%, it flags for human officer review; it NEVER auto-approves a mutation.

### 10.2 Valuation Estimator (Advisory)

**Purpose**: Provide an approximate land value based on government circle rates.
**Problem solved**: Buyers not knowing the official ready-reckoner rate.

- **Backend behavior**: Multiplies parcel area by the geographic circle rate zone.
- **Disclaimer**: Strictly labeled as "ESTIMATED GOVT VALUATION - Consult SRO for actual stamp duty".

---

## 11. Schemes & Financial Discovery Features

### 11.1 Government Schemes Engine

**Purpose**: Connect eligible citizens with relevant land/property-related government benefits.
**Problem solved**: Citizens are often unaware of subsidies (e.g., PM-KISAN, crop insurance, housing schemes) applicable to their specific land profile.

- **User journey**: Citizen Profile + Parcel Context → "View Eligible Schemes" → Redirect to Official Application.
- **Frontend behavior**: Lists matching schemes categorized by Rural (agriculture/irrigation) vs Urban (housing/infrastructure).
- **Backend behavior**: A configuration-driven matching engine evaluates `parcel` attributes (size, classification, owner profile, geography) against a `schemes_config` registry.
- **Integration**: Land Stack does NOT process applications; it redirects to the authoritative State/Central portal with pre-filled context parameters.

### 11.2 Financial Assistance Discovery

**Purpose**: Discover potential institutional credit opportunities linked to the parcel.
**Problem solved**: Formalizing credit access by bridging verified land records with financial institutions.

- **User journey**: Parcel 360 → "Financial Assistance" → View potential agricultural credit or property-linked assistance programs.
- **Frontend behavior**: Displays a strict, non-dismissible disclaimer: "Advisory Discovery Only - Not a Loan Approval".
- **Constraints**: Land Stack does **not** act as a bank. It does not underwrite, guarantee, or issue loans. It only surfaces verified parcel context to authorized institutional partners if the citizen provides explicit DPDP consent.
