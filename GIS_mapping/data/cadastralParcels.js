/**
 * GIS_mapping/data/cadastralParcels.js
 *
 * Synthetic Cadastral GeoJSON dataset for Wagholi, Haveli, Pune, Maharashtra.
 * Modeled to match the official SIH_26014 Version 2 Cadastral Map specifications.
 *
 * Focal parcel: Gat No. 42 | Survey 104 | ULPIN-MH-PUN-000001 (Aarav Patil)
 *
 * PROTOTYPE / DEMONSTRATION DATA — Not an official cadastral record.
 * Geometry is synthetic and deterministic.
 * Reference GIS: Bharat Maps (NIC) + Wagholi Cadastral Prototype.
 */

// ─── Center Reference (Wagholi, Pune) ─────────────────────────────────────────
export const WAGHOLI_CENTER = { lat: 18.5793, lng: 73.9812 };
export const FOCAL_PARCEL_ULPIN = 'ULPIN-MH-PUN-000001';

// Helper: Make GeoJSON Polygon Feature from [lat, lng] array
function makePolygonFeature(properties, latLngCoords) {
  return {
    type: 'Feature',
    properties,
    geometry: {
      type: 'Polygon',
      coordinates: [latLngCoords.map(([lat, lng]) => [lng, lat])],
    },
  };
}

// ─── 1. CADASTRAL PARCELS MESH (Contiguous boundaries matching screenshot) ───
// Central Parcel: Survey 104 / Gat 42 (Aarav Patil)
const parcel104Coords = [
  [18.5801, 73.9804], // Top-left along road
  [18.5804, 73.9818], // Top-right along road
  [18.5786, 73.9816], // Bottom-right meeting 105 & 106
  [18.5784, 73.9801], // Bottom-left meeting 103 & 117
  [18.5801, 73.9804], // Close
];

// Parcel 105 (Adjacent East)
const parcel105Coords = [
  [18.5804, 73.9818],
  [18.5807, 73.9832],
  [18.5788, 73.9830],
  [18.5786, 73.9816],
  [18.5804, 73.9818],
];

// Parcel 106 (South-East)
const parcel106Coords = [
  [18.5786, 73.9816],
  [18.5788, 73.9830],
  [18.5772, 73.9827],
  [18.5770, 73.9813],
  [18.5786, 73.9816],
];

// Parcel 107 (East of 106)
const parcel107Coords = [
  [18.5788, 73.9830],
  [18.5790, 73.9845],
  [18.5773, 73.9842],
  [18.5772, 73.9827],
  [18.5788, 73.9830],
];

// Parcel 108 (Far East)
const parcel108Coords = [
  [18.5790, 73.9845],
  [18.5793, 73.9860],
  [18.5774, 73.9858],
  [18.5773, 73.9842],
  [18.5790, 73.9845],
];

// Parcel 103 (West of 104)
const parcel103Coords = [
  [18.5799, 73.9790],
  [18.5801, 73.9804],
  [18.5784, 73.9801],
  [18.5782, 73.9788],
  [18.5799, 73.9790],
];

// Parcel 102 (West of 103)
const parcel102Coords = [
  [18.5797, 73.9776],
  [18.5799, 73.9790],
  [18.5782, 73.9788],
  [18.5780, 73.9774],
  [18.5797, 73.9776],
];

// Parcel 123 (Near Lake)
const parcel123Coords = [
  [18.5795, 73.9760],
  [18.5797, 73.9776],
  [18.5780, 73.9774],
  [18.5778, 73.9758],
  [18.5795, 73.9760],
];

// Parcel 117 (South-West)
const parcel117Coords = [
  [18.5784, 73.9801],
  [18.5786, 73.9816],
  [18.5770, 73.9813],
  [18.5768, 73.9798],
  [18.5784, 73.9801],
];

// Parcel 118 (South)
const parcel118Coords = [
  [18.5770, 73.9813],
  [18.5772, 73.9827],
  [18.5756, 73.9824],
  [18.5754, 73.9810],
  [18.5770, 73.9813],
];

// Parcel 111 (North of Wagholi Road, West)
const parcel111Coords = [
  [18.5815, 73.9790],
  [18.5818, 73.9810],
  [18.5804, 73.9808],
  [18.5801, 73.9788],
  [18.5815, 73.9790],
];

// Parcel 99 (North of Wagholi Road, East)
const parcel99Coords = [
  [18.5818, 73.9810],
  [18.5822, 73.9835],
  [18.5808, 73.9832],
  [18.5804, 73.9808],
  [18.5818, 73.9810],
];

// ─── GeoJSON Features for Cadastral Parcels ───────────────────────────────────
export const focalParcelFeature = makePolygonFeature(
  {
    ulpin: 'ULPIN-MH-PUN-000001',
    survey_number: '104',
    gat_number: '42',
    village_name: 'Wagholi',
    village_code: 'VIL-WAG',
    tehsil: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    area: 1.45,
    area_unit: 'Hectare',
    area_local: '58 Guntha',
    land_use: 'Agricultural',
    classification: 'Jirayat',
    status: 'CLEAR',
    is_focal: true,
    owner_name: 'Aarav Patil',
    owner_local: 'आरव पाटील',
    circle_rate: '₹ 4.64 Cr',
    khatadar_type: 'Government / Municipal Record',
    admin_hierarchy: 'Wagholi > Haveli > Pune > Maharashtra',
    centroid: [18.5793, 73.9812],
    label_center: [18.5793, 73.9812],
  },
  parcel104Coords
);

export const neighborFeatures = [
  makePolygonFeature(
    {
      ulpin: 'ULPIN-MH-PUN-000011',
      survey_number: '99',
      gat_number: '38',
      area: 1.10,
      area_unit: 'Hectare',
      area_local: '44 Guntha',
      land_use: 'Agricultural',
      classification: 'Jirayat',
      status: 'CLEAR',
      is_focal: false,
      centroid: [18.5813, 73.9821],
      label_center: [18.5813, 73.9821],
    },
    parcel99Coords
  ),
  makePolygonFeature(
    {
      ulpin: 'ULPIN-MH-PUN-000018',
      survey_number: '111',
      gat_number: '39',
      area: 0.95,
      area_unit: 'Hectare',
      area_local: '38 Guntha',
      land_use: 'Agricultural',
      classification: 'Jirayat',
      status: 'CLEAR',
      is_focal: false,
      centroid: [18.5810, 73.9799],
      label_center: [18.5810, 73.9799],
    },
    parcel111Coords
  ),
  makePolygonFeature(
    {
      ulpin: 'ULPIN-MH-PUN-000013',
      survey_number: '103',
      gat_number: '41',
      area: 0.85,
      area_unit: 'Hectare',
      area_local: '34 Guntha',
      land_use: 'Agricultural',
      classification: 'Jirayat',
      status: 'CLEAR',
      is_focal: false,
      centroid: [18.5791, 73.9796],
      label_center: [18.5791, 73.9796],
    },
    parcel103Coords
  ),
  makePolygonFeature(
    {
      ulpin: 'ULPIN-MH-PUN-000012',
      survey_number: '102',
      gat_number: '40',
      area: 0.78,
      area_unit: 'Hectare',
      area_local: '31 Guntha',
      land_use: 'Agricultural',
      classification: 'Jirayat',
      status: 'CLEAR',
      is_focal: false,
      centroid: [18.5789, 73.9782],
      label_center: [18.5789, 73.9782],
    },
    parcel102Coords
  ),
  makePolygonFeature(
    {
      ulpin: 'ULPIN-MH-PUN-000028',
      survey_number: '123',
      gat_number: '37',
      area: 0.70,
      area_unit: 'Hectare',
      area_local: '28 Guntha',
      land_use: 'Agricultural',
      classification: 'Jirayat',
      status: 'CLEAR',
      is_focal: false,
      centroid: [18.5787, 73.9767],
      label_center: [18.5787, 73.9767],
    },
    parcel123Coords
  ),
  makePolygonFeature(
    {
      ulpin: 'ULPIN-MH-PUN-000014',
      survey_number: '105',
      gat_number: '43',
      area: 1.20,
      area_unit: 'Hectare',
      area_local: '48 Guntha',
      land_use: 'Agricultural',
      classification: 'Jirayat',
      status: 'CLEAR',
      is_focal: false,
      centroid: [18.5796, 73.9824],
      label_center: [18.5796, 73.9824],
    },
    parcel105Coords
  ),
  makePolygonFeature(
    {
      ulpin: 'ULPIN-MH-PUN-000015',
      survey_number: '106',
      gat_number: '44',
      area: 0.90,
      area_unit: 'Hectare',
      area_local: '36 Guntha',
      land_use: 'Agricultural',
      classification: 'Jirayat',
      status: 'RECORD_ISSUE',
      is_focal: false,
      centroid: [18.5778, 73.9821],
      label_center: [18.5778, 73.9821],
    },
    parcel106Coords
  ),
  makePolygonFeature(
    {
      ulpin: 'ULPIN-MH-PUN-000016',
      survey_number: '107',
      gat_number: '45',
      area: 1.05,
      area_unit: 'Hectare',
      area_local: '42 Guntha',
      land_use: 'Agricultural',
      classification: 'Jirayat',
      status: 'CLEAR',
      is_focal: false,
      centroid: [18.5780, 73.9836],
      label_center: [18.5780, 73.9836],
    },
    parcel107Coords
  ),
  makePolygonFeature(
    {
      ulpin: 'ULPIN-MH-PUN-000017',
      survey_number: '108',
      gat_number: '46',
      area: 1.35,
      area_unit: 'Hectare',
      area_local: '54 Guntha',
      land_use: 'Agricultural',
      classification: 'Jirayat',
      status: 'COURT_DISPUTE',
      is_focal: false,
      centroid: [18.5782, 73.9851],
      label_center: [18.5782, 73.9851],
    },
    parcel108Coords
  ),
  makePolygonFeature(
    {
      ulpin: 'ULPIN-MH-PUN-000024',
      survey_number: '117',
      gat_number: '47',
      area: 0.88,
      area_unit: 'Hectare',
      area_local: '35 Guntha',
      land_use: 'Agricultural',
      classification: 'Jirayat',
      status: 'CLEAR',
      is_focal: false,
      centroid: [18.5776, 73.9806],
      label_center: [18.5776, 73.9806],
    },
    parcel117Coords
  ),
  makePolygonFeature(
    {
      ulpin: 'ULPIN-MH-PUN-000025',
      survey_number: '118',
      gat_number: '48',
      area: 1.15,
      area_unit: 'Hectare',
      area_local: '46 Guntha',
      land_use: 'Agricultural',
      classification: 'Jirayat',
      status: 'CLEAR',
      is_focal: false,
      centroid: [18.5763, 73.9818],
      label_center: [18.5763, 73.9818],
    },
    parcel118Coords
  ),
];

// ─── 2. REAL REFERENCE GIS GEOGRAPHY ──────────────────────────────────────────

// Water body: Wagholi Lake (soft pastel blue polygon to the west)
export const wagholiLakeFeature = {
  type: 'Feature',
  properties: {
    name: 'Wagholi Lake',
    type: 'WATER_BODY',
    label_center: [18.5796, 73.9742],
  },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [73.9730, 18.5810],
      [73.9745, 18.5812],
      [73.9755, 18.5802],
      [73.9752, 18.5785],
      [73.9740, 18.5775],
      [73.9728, 18.5788],
      [73.9730, 18.5810],
    ]],
  },
};

// Road: Wagholi Road (crisp corridor running across north boundary of 104)
export const wagholiRoadFeature = {
  type: 'Feature',
  properties: {
    name: 'Wagholi Road',
    type: 'ROAD',
    label_center: [18.5806, 73.9805],
  },
  geometry: {
    type: 'LineString',
    coordinates: [
      [73.9720, 18.5798],
      [73.9760, 18.5800],
      [73.9790, 18.5803],
      [73.9804, 18.5805],
      [73.9820, 18.5807],
      [73.9840, 18.5810],
      [73.9870, 18.5815],
    ],
  },
};

// Settlements / House footprints (subtle building rectangles)
export const settlementFeatures = [
  // Cluster on parcel 103
  {
    type: 'Feature',
    properties: { type: 'BUILDING' },
    geometry: {
      type: 'Polygon',
      coordinates: [[[73.9792, 18.5794], [73.9795, 18.5794], [73.9795, 18.5792], [73.9792, 18.5792], [73.9792, 18.5794]]],
    },
  },
  {
    type: 'Feature',
    properties: { type: 'BUILDING' },
    geometry: {
      type: 'Polygon',
      coordinates: [[[73.9796, 18.5793], [73.9799, 18.5793], [73.9799, 18.5790], [73.9796, 18.5790], [73.9796, 18.5793]]],
    },
  },
  // Cluster on parcel 105
  {
    type: 'Feature',
    properties: { type: 'BUILDING' },
    geometry: {
      type: 'Polygon',
      coordinates: [[[73.9822, 18.5800], [73.9826, 18.5800], [73.9826, 18.5797], [73.9822, 18.5797], [73.9822, 18.5800]]],
    },
  },
  // Cluster on parcel 102
  {
    type: 'Feature',
    properties: { type: 'BUILDING' },
    geometry: {
      type: 'Polygon',
      coordinates: [[[73.9780, 18.5786], [73.9784, 18.5786], [73.9784, 18.5783], [73.9780, 18.5783], [73.9780, 18.5786]]],
    },
  },
];

// ─── 3. COMPLETE FEATURE COLLECTION ───────────────────────────────────────────
export const cadastralFeatureCollection = {
  type: 'FeatureCollection',
  crs: {
    type: 'name',
    properties: { name: 'urn:ogc:def:crs:EPSG::4326' },
  },
  metadata: {
    source: 'Prototype Synthetic Geometry',
    referenceMap: 'Bharat Maps / NIC',
    geometry_status: 'SYNTHETIC',
    disclaimer: 'PROTOTYPE DEMONSTRATION DATA — NOT LEGAL BOUNDARY',
    village: 'Wagholi',
    tehsil: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
  },
  features: [focalParcelFeature, ...neighborFeatures],
};

// ─── Helper Functions ─────────────────────────────────────────────────────────
export function getParcelByULPIN(ulpin) {
  return (
    cadastralFeatureCollection.features.find(
      (f) => f.properties.ulpin === ulpin
    ) || focalParcelFeature
  );
}

export function getParcelBySurvey(surveyNumber) {
  const s = String(surveyNumber).trim();
  return (
    cadastralFeatureCollection.features.find(
      (f) => f.properties.survey_number === s
    ) || null
  );
}

export function getParcelByGat(gatNumber) {
  const g = String(gatNumber).trim();
  return (
    cadastralFeatureCollection.features.find(
      (f) => f.properties.gat_number === g
    ) || null
  );
}

export function getAllParcels() {
  return cadastralFeatureCollection.features;
}

export default cadastralFeatureCollection;
