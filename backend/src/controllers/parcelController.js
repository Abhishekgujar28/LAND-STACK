import { parcelService } from '../services/parcelService.js';

export const parcelController = {
  getParcels: async (req, res, next) => {
    try {
      const { search, village, tehsil, district, state, status, limit, offset } = req.query;
      const parcels = await parcelService.getParcels({
        search,
        village,
        tehsil,
        district,
        state,
        status,
        limit: limit ? parseInt(limit, 10) : 100,
        offset: offset ? parseInt(offset, 10) : 0,
      });
      res.json({ success: true, count: parcels.length, data: parcels });
    } catch (err) {
      next(err);
    }
  },

  getParcelByUlpin: async (req, res, next) => {
    try {
      const { ulpin } = req.params;
      const parcel = await parcelService.getParcelByUlpin(ulpin);
      if (!parcel) {
        return res.status(404).json({ success: false, error: { message: `Parcel '${ulpin}' not found` } });
      }
      res.json({ success: true, data: parcel });
    } catch (err) {
      next(err);
    }
  },

  getParcel360: async (req, res, next) => {
    try {
      const { ulpin } = req.params;
      const dossier = await parcelService.getParcel360(ulpin);
      if (!dossier) {
        return res.status(404).json({ success: false, error: { message: `Parcel '${ulpin}' not found` } });
      }
      res.json({ success: true, data: dossier });
    } catch (err) {
      next(err);
    }
  },

  getOwners: async (req, res, next) => {
    try {
      const { ulpin } = req.params;
      const owners = await parcelService.getParcelOwners(ulpin);
      res.json({ success: true, data: owners });
    } catch (err) {
      next(err);
    }
  },

  getEncumbrances: async (req, res, next) => {
    try {
      const { ulpin } = req.params;
      const encumbrances = await parcelService.getParcelEncumbrances(ulpin);
      res.json({ success: true, data: encumbrances });
    } catch (err) {
      next(err);
    }
  },

  getRestrictions: async (req, res, next) => {
    try {
      const { ulpin } = req.params;
      const restrictions = await parcelService.getParcelRestrictions(ulpin);
      res.json({ success: true, data: restrictions });
    } catch (err) {
      next(err);
    }
  },

  getZoning: async (req, res, next) => {
    try {
      const { ulpin } = req.params;
      const zoning = await parcelService.getParcelZoning(ulpin);
      res.json({ success: true, data: zoning });
    } catch (err) {
      next(err);
    }
  },

  getTax: async (req, res, next) => {
    try {
      const { ulpin } = req.params;
      const tax = await parcelService.getParcelTaxRecord(ulpin);
      res.json({ success: true, data: tax });
    } catch (err) {
      next(err);
    }
  },

  getCourtCases: async (req, res, next) => {
    try {
      const { ulpin } = req.params;
      const cases = await parcelService.getParcelCourtCases(ulpin);
      res.json({ success: true, data: cases });
    } catch (err) {
      next(err);
    }
  },

  getDocuments: async (req, res, next) => {
    try {
      const { ulpin } = req.params;
      const docs = await parcelService.getParcelDocuments(ulpin);
      res.json({ success: true, data: docs });
    } catch (err) {
      next(err);
    }
  },
};
