/**
 * Land Stack — Parcel Controller
 */

import { parcelService } from './parcel.service.js';
import { sendSuccess, sendPaginated } from '../../core/response.js';

export const parcelController = {
  // GET /parcels
  searchParcels: async (req, res, next) => {
    try {
      const result = await parcelService.searchParcels(req.query);
      sendPaginated(res, result.parcels, result.page);
    } catch (err) {
      next(err);
    }
  },

  // GET /parcels/:ulpin
  getParcel: async (req, res, next) => {
    try {
      const parcel = await parcelService.getParcelByUlpin(req.params.ulpin);
      sendSuccess(res, parcel);
    } catch (err) {
      next(err);
    }
  },

  // GET /parcels/:ulpin/360
  getParcel360: async (req, res, next) => {
    try {
      const dossier = await parcelService.getParcel360(req.params.ulpin, req.user);
      sendSuccess(res, dossier);
    } catch (err) {
      next(err);
    }
  },

  // GET /parcels/:ulpin/ownership
  getOwnership: async (req, res, next) => {
    try {
      const data = await parcelService.getOwners(req.params.ulpin);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  },

  // GET /parcels/:ulpin/encumbrances
  getEncumbrances: async (req, res, next) => {
    try {
      const data = await parcelService.getEncumbrances(req.params.ulpin);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  },

  // GET /parcels/:ulpin/restrictions
  getRestrictions: async (req, res, next) => {
    try {
      const data = await parcelService.getRestrictions(req.params.ulpin);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  },

  // GET /parcels/:ulpin/zoning
  getZoning: async (req, res, next) => {
    try {
      const data = await parcelService.getZoning(req.params.ulpin);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  },

  // GET /parcels/:ulpin/tax
  getTax: async (req, res, next) => {
    try {
      const data = await parcelService.getTax(req.params.ulpin);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  },

  // GET /parcels/:ulpin/courts
  getCourtCases: async (req, res, next) => {
    try {
      const data = await parcelService.getCourtCases(req.params.ulpin);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  },

  // GET /parcels/:ulpin/documents
  getDocuments: async (req, res, next) => {
    try {
      const data = await parcelService.getDocuments(req.params.ulpin);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  },

  // GET /parcels/:ulpin/valuation
  getValuation: async (req, res, next) => {
    try {
      const data = await parcelService.getValuation(req.params.ulpin);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  },
};
