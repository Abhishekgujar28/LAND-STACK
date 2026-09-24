/**
 * Land Stack — Jurisdiction Controller & Routes
 */

import { Router } from 'express';
import { JurisdictionService } from './jurisdiction.service.js';
import { sendSuccess } from '../../core/response.js';

export const JurisdictionController = {
  async getHierarchy(req, res, next) {
    try {
      const { stateCode, districtCode, tehsilCode } = req.query;
      const data = await JurisdictionService.getFullHierarchy({
        stateCode,
        districtCode,
        tehsilCode,
      }, req.supabase);
      return sendSuccess(res, data, 'Jurisdiction hierarchy retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getStates(req, res, next) {
    try {
      const data = await JurisdictionService.getStates(req.supabase);
      return sendSuccess(res, data, 'States retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getDistricts(req, res, next) {
    try {
      const { stateCode } = req.query;
      const data = await JurisdictionService.getDistricts(stateCode, req.supabase);
      return sendSuccess(res, data, 'Districts retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getTehsils(req, res, next) {
    try {
      const { districtCode } = req.query;
      const data = await JurisdictionService.getTehsils(districtCode, req.supabase);
      return sendSuccess(res, data, 'Tehsils retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getVillages(req, res, next) {
    try {
      const { tehsilCode } = req.query;
      const data = await JurisdictionService.getVillages(tehsilCode, req.supabase);
      return sendSuccess(res, data, 'Villages retrieved');
    } catch (err) {
      next(err);
    }
  },
};

const router = Router();

router.get('/', JurisdictionController.getHierarchy);
router.get('/states', JurisdictionController.getStates);
router.get('/districts', JurisdictionController.getDistricts);
router.get('/tehsils', JurisdictionController.getTehsils);
router.get('/villages', JurisdictionController.getVillages);

export default router;
