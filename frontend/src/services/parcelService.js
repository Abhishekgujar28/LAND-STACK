import apiClient from '../api/client';

/**
 * Service to fetch and manage Land Parcel entities via backend REST API
 */
export const parcelService = {
  getParcels: async (params = {}) => {
    return apiClient.get('parcels', params);
  },

  getParcelsByOwner: async () => {
    return apiClient.get('citizens/parcels');
  },

  getParcelById: async (ulpinOrId) => {
    if (!ulpinOrId) return null;
    return apiClient.get(`parcels/${encodeURIComponent(ulpinOrId)}`);
  },

  searchParcels: async (query = '') => {
    return apiClient.get('parcels', { search: query });
  },

  getParcelOwners: async (parcelId) => {
    return apiClient.get(`parcels/${encodeURIComponent(parcelId)}/owners`);
  },

  getParcelDocuments: async (parcelId) => {
    return apiClient.get(`parcels/${encodeURIComponent(parcelId)}/documents`);
  },

  getParcelEncumbrances: async (parcelId) => {
    return apiClient.get(`parcels/${encodeURIComponent(parcelId)}/encumbrances`);
  },

  getParcelRestrictions: async (parcelId) => {
    return apiClient.get(`parcels/${encodeURIComponent(parcelId)}/restrictions`);
  },

  getParcelZoning: async (parcelId) => {
    return apiClient.get(`parcels/${encodeURIComponent(parcelId)}/zoning`);
  },

  getParcelTaxRecord: async (parcelId) => {
    return apiClient.get(`parcels/${encodeURIComponent(parcelId)}/tax`);
  },

  getParcelCourtCases: async (parcelId) => {
    return apiClient.get(`parcels/${encodeURIComponent(parcelId)}/court-cases`);
  },

  /**
   * Returns a complete composite 360 degree dossier of a parcel
   */
  getParcel360: async (parcelId) => {
    return apiClient.get(`parcels/${encodeURIComponent(parcelId)}/360`);
  },
};

export default parcelService;
