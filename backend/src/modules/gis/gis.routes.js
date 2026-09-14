/**
 * Land Stack — GIS Controller & Routes
 */

import { Router } from 'express';
import { GisService } from './gis.service.js';
import { sendSuccess } from '../../core/response.js';

export const GisController = {
  async getParcelPolygon(req, res, next) {
    try {
      const { ulpin } = req.params;
      const feature = await GisService.getParcelGeoJson(ulpin);
      return res.status(200).json(feature);
    } catch (err) {
      next(err);
    }
  },

  async getVillageMap(req, res, next) {
    try {
      const { villageCode } = req.params;
      const featureCollection = await GisService.getVillageCadastralMap(villageCode);
      return res.status(200).json(featureCollection);
    } catch (err) {
      next(err);
    }
  },

  async searchBbox(req, res, next) {
    try {
      const { minLat, minLng, maxLat, maxLng } = req.query;
      const featureCollection = await GisService.searchByBoundingBox({
        minLat: parseFloat(minLat),
        minLng: parseFloat(minLng),
        maxLat: parseFloat(maxLat),
        maxLng: parseFloat(maxLng),
      });
      return res.status(200).json(featureCollection);
    } catch (err) {
      next(err);
    }
  },

  async validateGeometry(req, res, next) {
    try {
      const { coordinates } = req.body;
      const result = GisService.validatePolygon(coordinates);
      return sendSuccess(res, result, 'Geometry validation result');
    } catch (err) {
      next(err);
    }
  },
};

const router = Router();

router.get('/parcels/:ulpin/geojson', GisController.getParcelPolygon);
router.get('/villages/:villageCode/cadastral-map', GisController.getVillageMap);
router.get('/bbox', GisController.searchBbox);
router.post('/validate-geometry', GisController.validateGeometry);

export default router;
