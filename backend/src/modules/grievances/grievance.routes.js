import { Router } from 'express';
import { grievanceController } from './grievance.controller.js';
import { requireAuth } from '../../middleware/requireAuth.js';

const router = Router();

router.use(requireAuth);

router.get('/', grievanceController.getGrievances);
router.post('/', grievanceController.createGrievance);
router.get('/:id', grievanceController.getGrievanceById);

export default router;
