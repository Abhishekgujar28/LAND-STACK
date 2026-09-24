/**
 * Land Stack — Analytics Controller & Routes
 */

import { Router } from 'express';
import { AnalyticsService } from './analytics.service.js';
import { sendSuccess } from '../../core/response.js';

export const AnalyticsController = {
  async getNational(req, res, next) {
    try {
      const data = await AnalyticsService.getNationalData();
      return sendSuccess(res, data, 'National analytics retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getNationalBenchmarks(req, res, next) {
    try {
      const data = await AnalyticsService.getNationalBenchmarks();
      return sendSuccess(res, data, 'National benchmarks retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getState(req, res, next) {
    try {
      const { stateCode } = req.params;
      const data = await AnalyticsService.getStateData(stateCode);
      return sendSuccess(res, data, 'State analytics retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getStatePMU(req, res, next) {
    try {
      const { stateCode } = req.params;
      const data = await AnalyticsService.getStatePMU(stateCode);
      return sendSuccess(res, data, 'State PMU data retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getDistrict(req, res, next) {
    try {
      const { districtCode } = req.params;
      const data = await AnalyticsService.getDistrictData(districtCode);
      return sendSuccess(res, data, 'District analytics retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getTehsil(req, res, next) {
    try {
      const { tehsilCode } = req.params;
      const data = await AnalyticsService.getTehsilData(tehsilCode);
      return sendSuccess(res, data, 'Tehsil analytics retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getSystemHealth(req, res, next) {
    try {
      const data = await AnalyticsService.getSystemHealth();
      return sendSuccess(res, data, 'System health metrics retrieved');
    } catch (err) {
      next(err);
    }
  },
};

const router = Router();

router.get('/national', AnalyticsController.getNational);
router.get('/national-benchmarks', AnalyticsController.getNationalBenchmarks);
router.get('/benchmarks', AnalyticsController.getNationalBenchmarks); // Frontend alias
router.get('/state/:stateCode', AnalyticsController.getState);
router.get('/state/:stateCode/pmu', AnalyticsController.getStatePMU); // Frontend alias
router.get('/state-pmu/:stateCode?', AnalyticsController.getStatePMU);
router.get('/district/:districtCode', AnalyticsController.getDistrict);
router.get('/tehsil/:tehsilCode', AnalyticsController.getTehsil);
router.get('/system-health', AnalyticsController.getSystemHealth);

export default router;
