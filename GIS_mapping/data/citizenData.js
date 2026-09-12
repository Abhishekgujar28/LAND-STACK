/**
 * GIS_mapping/data/citizenData.js
 *
 * Canonical synthetic citizen, ownership, document, and nearby-feature data.
 * Tied to ULPIN-MH-PUN-000001 (Aarav Patil, Wagholi, Haveli, Pune).
 *
 * PROTOTYPE / DEMONSTRATION DATA — Not an official government record.
 */

// ─── Citizen Profile ──────────────────────────────────────────────────────────
export const citizenProfile = {
  id: 'CIT-001',
  name: 'Aarav Patil',
  localName: 'आरव पाटील',
  stateCode: 'MH',
  mobile: '+91 98230 45891',
  email: 'aarav.patil@example.com',
  aadhaarHash: 'XXXX-XXXX-8912',
  kycStatus: 'Verified',
  address: 'Gat No 42, Wagholi, Pune, Maharashtra 412207',
};

// ─── Ownership Records ────────────────────────────────────────────────────────
export const ownershipRecords = [
  {
    id: 'OWN-001',
    parcel_ulpin: 'ULPIN-MH-PUN-000001',
    owner_id: 'CIT-001',
    owner_name: 'Aarav Patil',
    owner_local_name: 'आरव पाटील',
    share: 100,
    share_display: '100%',
    relation: 'Sole Owner',
    aadhaar_status: 'Verified',
    kyc_status: 'Verified',
    entry_date: '2018-03-15',
    mutation_number: 'MUT-HAV-2018-00234',
  },
];

// ─── Parcel Full Record ───────────────────────────────────────────────────────
export const parcels = [
  {
    ulpin: 'ULPIN-MH-PUN-000001',
    surveyNumber: '104',
    gatNumber: '42',
    village: 'Wagholi',
    villageCode: 'VIL-WAG',
    tehsil: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    area: 1.45,
    areaGuntha: 58,
    areaDisplay: '1.45 Hectare (58 Guntha)',
    areaUnit: 'Hectare',
    landUse: 'Agricultural',
    classification: 'Jirayat',
    khatadarType: 'Government / Municipal Record',
    circleRate: '₹ 4.64 Cr',
    status: 'CLEAR',
    statusLabel: 'No issue recorded in prototype data',
    centroid: { lat: 18.5793, lng: 73.9812 },
    source: {
      referenceMap: 'Bharat Maps / NIC',
      cadastral: 'Prototype Synthetic Data',
    },
    adminHierarchy: 'Wagholi › Haveli › Pune › Maharashtra',
  },
];

// ─── Documents ────────────────────────────────────────────────────────────────
export const parcelDocuments = {
  'ULPIN-MH-PUN-000001': [
    {
      id: 'DOC-001',
      type: 'RoR (7/12)',
      title: 'गाव नमुना ७/१२ (Record of Rights)',
      date: '2026-01-15',
      format: 'PDF',
      status: 'Certified',
      description: 'Official land ownership record issued by Revenue Department.',
      isPrototype: true,
    },
    {
      id: 'DOC-002',
      type: 'Mutation Certificate',
      title: 'Mutation Certificate — MUT-HAV-2018-00234',
      date: '2018-03-15',
      format: 'PDF',
      status: 'Certified',
      description: 'Registered mutation certificate for ownership transfer.',
      isPrototype: true,
    },
    {
      id: 'DOC-003',
      type: 'Map Extract (FMB)',
      title: 'Field Measurement Book — Survey 104',
      date: '2020-07-22',
      format: 'PDF',
      status: 'Available',
      description: 'Field measurement boundary extract from Survey Department.',
      isPrototype: true,
    },
    {
      id: 'DOC-004',
      type: 'Property Tax Receipt',
      title: 'Property Tax Receipt — FY 2025–26',
      date: '2025-04-01',
      format: 'PDF',
      status: 'Paid',
      description: 'Annual property tax payment receipt from Grampanchayat.',
      isPrototype: true,
    },
  ],
};

// ─── Nearby Spatial Features ──────────────────────────────────────────────────
export const nearbyFeatures = {
  'ULPIN-MH-PUN-000001': {
    nearestRoad: { label: 'Wagholi–Kesnand Road', distance: '38 m', icon: 'road' },
    waterBody: { label: 'Mula–Mutha Tributary', distance: '420 m', icon: 'water' },
    villageCentre: { label: 'Wagholi Village Centre', distance: '1.2 km', icon: 'village' },
    ward: { label: 'Wagholi Ward (NCP)', distance: '850 m', icon: 'ward' },
    school: { label: 'Zilla Parishad Primary School', distance: '1.1 km', icon: 'school' },
    hospital: { label: 'Primary Health Centre, Wagholi', distance: '1.8 km', icon: 'hospital' },
  },
};

// ─── Quick Search Chips ───────────────────────────────────────────────────────
export const quickSearchChips = [
  { label: 'ULPIN-MH-PUN-000001', query: 'ULPIN-MH-PUN-000001' },
  { label: 'Survey No. 104',       query: 'Survey No. 104' },
  { label: 'Gat No. 42',           query: 'Gat No. 42' },
  { label: 'Wagholi',              query: 'Wagholi' },
  { label: 'Pune',                 query: 'Pune' },
];

// ─── Watchlist state (in-memory prototype) ────────────────────────────────────
export const prototypeWatchlist = {
  items: [],
  add(ulpin) {
    if (!this.items.includes(ulpin)) this.items.push(ulpin);
  },
  remove(ulpin) {
    this.items = this.items.filter((u) => u !== ulpin);
  },
  has(ulpin) {
    return this.items.includes(ulpin);
  },
};

export default { citizenProfile, ownershipRecords, parcels, parcelDocuments, nearbyFeatures };
