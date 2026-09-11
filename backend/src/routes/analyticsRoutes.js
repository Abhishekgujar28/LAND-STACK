import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController.js';

const router = Router();

router.get('/national', analyticsController.getNational);
router.get('/benchmarks', analyticsController.getNationalBenchmarks);
router.get('/state/:stateCode/pmu', analyticsController.getStatePMU);
router.get('/state/:stateCode', analyticsController.getState);
router.get('/district/:districtCode', analyticsController.getDistrict);
router.get('/tehsil/:tehsilCode', analyticsController.getTehsil);
router.get('/tehsils', analyticsController.getTehsil);
router.get('/system-health', analyticsController.getSystemHealth);

export default router;
