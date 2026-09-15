import { GisService } from './gis.service.js';
import { sendSuccess } from '../../core/response.js';

export const GisController = {
  async getParcelPolygon(req, res, next) {
    try {
      const { ulpin } = req.params;
      const feature = await GisService.getParcelGeoJson(ulpin, req.supabase);
      return res.status(200).json(feature);
    } catch (err) {
      next(err);
    }
  },

  async getVillageMap(req, res, next) {
    try {
      const { villageCode } = req.params;
      const featureCollection = await GisService.getVillageCadastralMap(villageCode, req.supabase);
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
      }, req.supabase);
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
