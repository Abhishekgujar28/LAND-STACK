import parcelsData from '../data/parcels/parcels.json';
import ownershipData from '../data/parcels/ownership.json';
import encumbrancesData from '../data/parcels/encumbrances.json';
import restrictionsData from '../data/parcels/restrictions.json';
import zoningData from '../data/parcels/zoning.json';
import taxRecordsData from '../data/parcels/taxRecords.json';
import courtCasesData from '../data/parcels/courtCases.json';
import parcelDocumentsData from '../data/parcels/parcelDocuments.json';

/**
 * Service to fetch and manage Land Parcel entities and related 360 attributes
 */
export const parcelService = {
  getParcels: async () => {
    return parcelsData;
  },

  getParcelById: async (ulpinOrId) => {
    return parcelsData.find(
      (p) => p.ulpin.toLowerCase() === ulpinOrId.toLowerCase()
    ) || null;
  },

  searchParcels: async (query = '') => {
    const q = query.trim().toLowerCase();
    if (!q) return parcelsData;

    return parcelsData.filter(
      (p) =>
        p.ulpin.toLowerCase().includes(q) ||
        (p.surveyNumber && p.surveyNumber.toLowerCase().includes(q)) ||
        (p.gatNumber && p.gatNumber.toLowerCase().includes(q)) ||
        (p.villageName && p.villageName.toLowerCase().includes(q)) ||
        (p.ctsNumber && p.ctsNumber.toLowerCase().includes(q))
    );
  },

  getParcelOwners: async (parcelId) => {
    return ownershipData.filter((o) => o.parcelId.toLowerCase() === parcelId.toLowerCase());
  },

  getParcelDocuments: async (parcelId) => {
    return parcelDocumentsData.filter((d) => d.parcelId.toLowerCase() === parcelId.toLowerCase());
  },

  getParcelEncumbrances: async (parcelId) => {
    return encumbrancesData.filter((e) => e.parcelId.toLowerCase() === parcelId.toLowerCase());
  },

  getParcelRestrictions: async (parcelId) => {
    return restrictionsData.filter((r) => r.parcelId.toLowerCase() === parcelId.toLowerCase());
  },

  getParcelZoning: async (parcelId) => {
    return zoningData.find((z) => z.parcelId.toLowerCase() === parcelId.toLowerCase()) || null;
  },

  getParcelTaxRecord: async (parcelId) => {
    return taxRecordsData.find((t) => t.parcelId.toLowerCase() === parcelId.toLowerCase()) || null;
  },

  getParcelCourtCases: async (parcelId) => {
    return courtCasesData.filter((c) => c.parcelId.toLowerCase() === parcelId.toLowerCase());
  },

  /**
   * Returns a complete composite 360 degree dossier of a parcel
   */
  getParcel360: async (parcelId) => {
    const parcel = await parcelService.getParcelById(parcelId);
    if (!parcel) return null;

    const [owners, encumbrances, restrictions, zoning, tax, cases, documents] = await Promise.all([
      parcelService.getParcelOwners(parcelId),
      parcelService.getParcelEncumbrances(parcelId),
      parcelService.getParcelRestrictions(parcelId),
      parcelService.getParcelZoning(parcelId),
      parcelService.getParcelTaxRecord(parcelId),
      parcelService.getParcelCourtCases(parcelId),
      parcelService.getParcelDocuments(parcelId),
    ]);

    return {
      ...parcel,
      owners,
      encumbrances,
      restrictions,
      zoning,
      tax,
      courtCases: cases,
      documents,
    };
  },
};

export default parcelService;
