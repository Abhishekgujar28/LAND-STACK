/**
 * GIS_mapping/services/mapProviderAdapter.js
 *
 * BharatMaps / NIC map provider adapter interface per SIH_26014 Version 2.
 * Provides a clean abstraction layer so the UI never hard-codes tile URLs.
 *
 * Supported Map Modes:
 *   1. CADASTRAL: Default light neutral cadastral canvas with parcel polygons, roads, lake.
 *   2. SATELLITE: Secondary reference satellite imagery (Context Only — Not Legal Cadastre).
 *
 * Note: Hybrid View and Generic Map View are explicitly removed per Section 6 & 7.
 */

export const VIEW_MODES = {
  CADASTRAL: 'CADASTRAL',
  SATELLITE: 'SATELLITE',
};

// ─── Tile layer configurations ────────────────────────────────────────────────
const TILE_CONFIGS = {
  [VIEW_MODES.CADASTRAL]: {
    // Light neutral cadastral basemap — full global coverage at high zoom, free, no watermark
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors &bull; Bharat Maps (NIC) Cadastral Prototype',
    maxZoom: 19,
    label: 'Cadastral Map',
  },
  [VIEW_MODES.SATELLITE]: {
    // High-res satellite reference layer (Esri World Imagery, free / no key required)
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri World Imagery | Reference Only — Not Official Boundary',
    maxZoom: 19,
    label: 'Satellite Reference',
  },
};

// ─── MockMapProvider (no API key, always available) ───────────────────────────
class MockMapProvider {
  constructor() {
    this.name = 'MockMapProvider';
    this.description = 'Cadastral Vector Canvas + Esri Satellite Reference. No API key required.';
  }

  getMapConfig() {
    return {
      defaultCenter: { lat: 18.5793, lng: 73.9812 },
      defaultZoom: 17,
      minZoom: 12,
      maxZoom: 20,
      crs: 'EPSG:4326 / WGS 84',
      scaleDisplay: '1 : 2,500',
      dataSource: 'Bharat Maps (NIC) + Prototype Cadastral Geometry',
      disclaimer: 'Cadastral layer: Prototype Synthetic Geometry (Not Official Boundary)',
    };
  }

  getTileConfig(viewMode = VIEW_MODES.CADASTRAL) {
    return TILE_CONFIGS[viewMode] || TILE_CONFIGS[VIEW_MODES.CADASTRAL];
  }

  async getReferenceLayers() {
    return [
      { id: 'roads',       label: 'Roads (Wagholi Road)',        defaultOn: true },
      { id: 'water_bodies',label: 'Water Bodies (Wagholi Lake)', defaultOn: true },
      { id: 'settlements', label: 'Settlement Footprints',       defaultOn: true },
      { id: 'admin',       label: 'Administrative Hierarchy',    defaultOn: true },
    ];
  }

  async getCadastralLayers() {
    return [
      { id: 'cadastral',   label: 'Cadastral Parcel Mesh',       defaultOn: true },
      { id: 'survey_lbls', label: 'Survey / Gat Numbers',        defaultOn: true },
      { id: 'my_land',     label: 'Selected Land Parcel',        defaultOn: true },
    ];
  }
}

// ─── BhuNaksha adapter placeholder (FUTURE) ───────────────────────────────────
class BhuNakshaProvider {
  constructor() {
    this.name = 'BhuNakshaProvider';
    this.description = 'Future: State Land Records BhuNaksha WMS/WMTS integration.';
  }

  getMapConfig() {
    throw new Error('BhuNakshaProvider is not yet connected. Use MockMapProvider.');
  }

  getTileConfig() {
    throw new Error('BhuNakshaProvider is not yet connected. Use MockMapProvider.');
  }
}

// ─── Factory — returns the active provider ────────────────────────────────────
const ENV = typeof import.meta !== 'undefined' ? import.meta.env : {};
const USE_BHUNAKSHA = ENV?.VITE_USE_BHUNAKSHA === 'true';

export const mapProvider = USE_BHUNAKSHA
  ? new BhuNakshaProvider()
  : new MockMapProvider();

export { MockMapProvider, BhuNakshaProvider, TILE_CONFIGS };
export default mapProvider;
