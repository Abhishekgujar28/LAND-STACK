/**
 * Land Stack — GIS Controller & Routes
 */

import { Router } from 'express';
import { GisController } from './gis.controller.js';
import { optionalAuth } from '../../middleware/requireAuth.js';

const router = Router();

router.get('/parcels/:ulpin/geojson', optionalAuth, GisController.getParcelPolygon);
router.get('/villages/:villageCode/cadastral-map', optionalAuth, GisController.getVillageMap);
router.get('/layers/:layerType', optionalAuth, GisController.getAdministrativeLayer);
router.get('/bbox', optionalAuth, GisController.searchBbox);
router.post('/validate-geometry', optionalAuth, GisController.validateGeometry);

export default router;
