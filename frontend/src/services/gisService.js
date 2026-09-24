import apiClient from '../api/client';

/**
 * Service to interact with PostGIS spatial endpoints via backend REST API
 * Strictly Database-Only (PostGIS EPSG:4326 geometry)
 */
export const gisService = {
  /**
   * Get GeoJSON Feature for a specific parcel by ULPIN
   */
  getParcelPolygon: async (ulpin) => {
    if (!ulpin) return null;
    return apiClient.get(`gis/parcels/${encodeURIComponent(ulpin)}/geojson`);
  },

  /**
   * Get FeatureCollection of all cadastral parcels in a village
   */
  getVillageCadastralMap: async (villageCode = 'VIL-WAG') => {
    if (!villageCode) return { type: 'FeatureCollection', features: [] };
    return apiClient.get(`gis/villages/${encodeURIComponent(villageCode)}/cadastral-map`);
  },

  /**
   * Get Administrative Reference Layer (e.g. 'urban-wards', 'jurisdiction-boundary', 'zoning-overlay')
   */
  getAdministrativeLayer: async (layerType = 'urban-wards') => {
    return apiClient.get(`gis/layers/${encodeURIComponent(layerType)}`);
  },

  /**
   * Query cadastral parcels within a geographic bounding box
   */
  searchBbox: async ({ minLat, minLng, maxLat, maxLng }) => {
    return apiClient.get('gis/bbox', { minLat, minLng, maxLat, maxLng });
  },

  /**
   * Validate cadastral polygon geometry topology
   */
  validateGeometry: async (coordinates) => {
    return apiClient.post('gis/validate-geometry', { coordinates });
  },
};

export default gisService;
