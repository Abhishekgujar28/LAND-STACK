# Land Stack — Glossary of Land Governance Terms

**Aligned with**: GoRT (Glossary of Revenue Terms), DoLR, launched 31 December 2025

---

## Land Administration Terms

| Term | Definition | Context |
|------|-----------|---------|
| **ULPIN** | Unique Land Parcel Identification Number (Bhu-Aadhaar). 14-digit alphanumeric code assigned to every land parcel based on geo-coordinates of its vertices. OGC and ECCMA compliant. | National identifier; integration key for Land Stack |
| **RoR** | Record of Rights — the legal land ownership record maintained by the State Revenue Department. Contains owner name, area, classification, encumbrances, and mutation history. | Core data element; different name per State |
| **Mutation** | Legal process of updating the RoR to reflect a change in ownership or other rights. Triggered by deed registration, inheritance, court order, or partition. | Statutory process; requires Tehsildar sanction |
| **Cadastral Map** | Map showing boundaries of land parcels, their survey numbers, and spatial relationship to each other. Maintained by the State Survey/Revenue Department. | Layer 1 of Land Stack spatial architecture |
| **LADM** | Land Administration Domain Model (ISO 19152) — international standard for land administration data modeling. Defines Party, RRR (Rights, Restrictions, Responsibilities), Spatial Unit, and Administrative Source. | Basis of Land Stack canonical schema |
| **Parcel 360°** | Land Stack's core product screen — a unified view showing all information about a single land parcel from 10+ data sources on one page. | Core product feature |
| **Provenance** | Metadata tracking the origin, authority, timestamp, and confidence of every data element in Land Stack. Enables citizen trust through source transparency. | Trust architecture component |
| **Projection** | A derived copy of a data element from an authoritative State source, stored in Land Stack's canonical format with provenance. Not a legal copy. | Data architecture principle |

---

## State-Specific Document Names

| Document | State | Definition |
|----------|-------|-----------|
| **7/12 Extract** (Saat Baara) | Maharashtra | Combined ownership record (7) and cultivation details (12). The primary RoR document. |
| **8A Extract** | Maharashtra, Gujarat | Record of tenants and sharecroppers on a land parcel. |
| **RTC** (Pahani) | Karnataka | Record of Rights, Tenancy, and Crops — Karnataka's RoR document. |
| **Patta** | Tamil Nadu | Ownership certificate for a land parcel. Since 2015, merged with Chitta. |
| **Chitta** | Tamil Nadu | Land classification and revenue record. Merged with Patta since 2015. |
| **Khatauni** | Uttar Pradesh | Ownership register maintained at village level. |
| **Khasra** | UP, MP, RJ, CG | Plot-level record showing area, classification, crop, and boundaries. |
| **Jamabandi** | Rajasthan, Haryana, Punjab | Comprehensive record of rights containing ownership, tenancy, crop, and revenue details. |
| **Fard** | Haryana, Punjab | Copy of the Jamabandi record. |
| **Khatian** | Bihar, West Bengal | Ownership record with details of rights holders. |
| **Adangal** | Andhra Pradesh, Telangana | Village-level register of all land parcels with cultivation and revenue details. |
| **FMB** (Field Measurement Book) | Tamil Nadu | Sketch showing boundaries and measurements of parcels within a survey number. |
| **Property Card** | Urban areas (MH, GJ) | Ownership document for urban properties (as opposed to rural RoR). |

---

## Parcel Identifiers by State

| Identifier | State(s) | Definition |
|-----------|----------|-----------|
| **Survey Number** | MH, KA, TN, AP, TS | Primary plot identifier assigned during survey/settlement |
| **Gat Number** | Maharashtra | Used for irrigated/non-irrigated classification parcels |
| **CTS Number** | Maharashtra (urban) | City Survey Number for urban parcels |
| **Hissa Number** | Karnataka | Sub-division of a Survey Number |
| **Subdivision Number** | Tamil Nadu | Sub-division of a Survey Number |
| **Khasra Number** | UP, MP, RJ, CG, HR, PB, JH | Plot-level identifier in North Indian states |
| **Gata Number** | Uttar Pradesh | Consolidated plot number after consolidation (Chakbandi) |
| **Khata Number** | MH, KA, UP, RJ, OD | Account number linking owner to one or more parcels |
| **Khewat Number** | Haryana, Punjab | Owner account number (ownership register) |
| **Khatauni Number** | Haryana, Punjab | Cultivation account number (cultivation register) |
| **Murrabba Number** | Haryana, Punjab | Grid square reference for land parcels |
| **Killa Number** | Haryana, Punjab | Sub-division within a Murrabba |
| **Patta Number** | Tamil Nadu, AP, TS | Ownership account number |
| **Bhudhaar** | Telangana | State-specific ULPIN equivalent (GPS-based parcel ID) |
| **Plot Number / Dag Number** | West Bengal | Plot identifier |
| **Block Number** | Gujarat | Sub-division identifier |

---

## Administrative Hierarchy

| Level | Maharashtra | Karnataka | Tamil Nadu | Uttar Pradesh | Haryana/Punjab | Rajasthan |
|-------|-------------|-----------|------------|---------------|----------------|-----------|
| **Level 1** | Division | Division | — | Division | Division | — |
| **Level 2** | District | District | District | District | District | District |
| **Level 3** | Taluka | Taluk | Taluk | Tehsil | Tehsil | Tehsil |
| **Level 4** | — | Hobli | Firka | — | — | — |
| **Level 5** | Village | Village | Village | Village | Village | Village (Gram) |

---

## Revenue Officers

| Role | State Variation | Responsibilities |
|------|----------------|-----------------|
| **Patwari** | Lekhpal (UP), Talathi (MH), Shanbhog (KA), VAO (TN), Talati (GJ), Amin (BR/OD) | Ground-level: maintains RoR, conducts field verification, boundary demarcation, crop inspection |
| **Revenue Inspector** | Kanoongo (UP), Circle Inspector | Supervises Patwaris; assigns field verification; data quality check |
| **Tehsildar** | Tahsildar (KA/TN), Mamlatdar (GJ) | Mutation sanction/rejection; revenue court; land records supervision; certificate issuance |
| **SDM / SDO** | Sub-Divisional Magistrate / Sub-Divisional Officer, Prant Officer (MH) | Appeal hearing; escalation review; sub-division administration |
| **District Collector** | Deputy Commissioner (some States), DM | District revenue head; government land custodian; land acquisition authority |

---

## Area Units and Conversion

| Unit | Equivalent | Used In |
|------|-----------|---------|
| 1 Hectare | 2.4711 Acres | National standard; metric |
| 1 Acre | 40 Gunthas | MH, KA |
| 1 Acre | 100 Cents | TN, KL, AP, TS |
| 1 Acre | 8 Kanals | HR, PB, J&K |
| 1 Kanal | 20 Marlas | HR, PB, J&K |
| 1 Bigha | 20 Biswas | UP, RJ (varies by State; UP Bigha ≠ RJ Bigha) |
| 1 Bigha (UP) | ~0.625 Acres | Uttar Pradesh |
| 1 Bigha (RJ) | ~0.40 Acres | Rajasthan |
| 1 Vigha (GJ) | ~0.40 Acres | Gujarat |
| 1 Guntha | 1,089 sq. ft | MH, KA |
| 1 Are | 100 sq. m (~2.47 Gunthas) | Metric; MH |
| 1 Kattha | Varies by State | Bihar, Jharkhand |
| 1 Decimal | 1/100 Acre | WB, OD, JH |

> **Warning**: Area unit definitions vary even within the same State. Always store area in square meters internally and convert to display units based on State configuration.

---

## Government Systems

| Acronym | Full Name | Owner | Function |
|---------|-----------|-------|----------|
| **DILRMP** | Digital India Land Records Modernization Programme | DoLR, MoRD | Central Sector Scheme funding land records modernization |
| **NGDRS** | National Generic Document Registration System | DoLR + NIC | Standardized deed registration across States |
| **BhuNaksha** | — | NIC | Cadastral mapping application; FOSS-based |
| **SVAMITVA** | Survey of Villages and Mapping with Improvised Technology in Village Areas | MoPR + SoI | Drone-based survey of rural abadi land; property cards |
| **NAKSHA** | National Geospatial Knowledge-based Land Survey of Urban Habitations | DoLR + SoI | Urban land record modernization (drones, LiDAR, 3D) |
| **RCCMS** | Revenue Court Case Management System | DoLR + NIC | Case management for revenue courts |
| **GoRT** | Glossary of Revenue Terms | DoLR + CoE-LAM, YASHADA | Standardized revenue terminology across languages |
| **ILIMS** | Integrated Land Information Management System | DoLR | Ultimate vision for integrated land information |
| **CORS** | Continuously Operating Reference Stations | SoI | High-precision GPS reference network (903 stations) |
| **DigiLocker** | — | MeitY | Government document storage; citizen authentication via SSO |
| **NJDG** | National Judicial Data Grid | DoJ | Judicial data aggregation across courts |

---

## Government Institutions

| Institution | Ministry/Dept | Role |
|-------------|---------------|------|
| **DoLR** | Ministry of Rural Development | Nodal department for DILRMP, ULPIN, Land Stack |
| **NIC** | MeitY | Technical agency — develops BhuNaksha, Bhulekh, NGDRS |
| **SoI** | Dept of Science & Technology | National survey authority; CORS network; SVAMITVA/NAKSHA partner |
| **ISRO/NRSC** | Dept of Space | Satellite imagery (CARTOSAT-3); remote sensing |
| **C-DAC** | MeitY | Transliteration engine for 22 constitutional languages |
| **CERT-In** | MeitY | Cybersecurity requirements for government systems |
| **CoE-LAM** | DoLR | Centre of Excellence in Land Administration and Management (YASHADA, Pune) |

---

## Legal Framework

| Law / Act | Relevance to Land Stack |
|-----------|------------------------|
| **Constitution of India, Seventh Schedule, List II, Entry 18/45** | Land is a State Subject; Land Stack must respect State data sovereignty |
| **Registration Act, 1908** | Governs deed registration; Sub-Registrar is statutory authority |
| **Indian Stamp Act, 1899** (as amended) | Stamp duty and e-stamping framework |
| **Transfer of Property Act, 1882** | Property transfer rules; covered under Concurrent List (Entry 6) |
| **RFCTLARR Act, 2013** | Right to Fair Compensation and Transparency in Land Acquisition |
| **Indian Forest Act, 1927** | Forest land governance and restrictions |
| **Forest Rights Act (FRA), 2006** | Tribal and forest-dwelling community land rights |
| **Fifth/Sixth Schedule** | Constitutional protections for tribal land in Scheduled Areas |
| **Digital Personal Data Protection (DPDP) Act, 2023** | Personal data protection; consent; purpose limitation; no raw Aadhaar |
| **State Land Revenue Codes** | State-specific: e.g., Maharashtra Land Revenue Code 1966, Karnataka Land Revenue Act 1964 |

---

## Technical Terms

| Term | Definition |
|------|-----------|
| **PostGIS** | PostgreSQL spatial extension for geospatial data storage and queries |
| **COG** | Cloud Optimized GeoTIFF — efficient raster format for HTTP range requests |
| **MVT** | Mapbox Vector Tiles — binary vector tile format for efficient map rendering |
| **WMS** | Web Map Service — OGC standard for serving georeferenced map images |
| **WFS** | Web Feature Service — OGC standard for serving vector geospatial features |
| **GeoJSON** | JSON format for encoding geographic data structures |
| **SRID 4326** | Spatial Reference System ID for WGS 84 (GPS coordinate system) |
| **mTLS** | Mutual Transport Layer Security — both client and server verify certificates |
| **OPA** | Open Policy Agent — declarative policy engine for authorization |
| **ABAC** | Attribute-Based Access Control — authorization based on attributes of user, resource, and context |
| **Bi-temporal** | Data model tracking two time dimensions: valid time (real world) and system time (when recorded) |
| **CDC** | Change Data Capture — detecting and capturing changes in source databases |
| **CQRS** | Command Query Responsibility Segregation — separate read and write models |
