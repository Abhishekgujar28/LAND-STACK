import { Router } from 'express';
import { grievanceController } from '../controllers/grievanceController.js';

const router = Router();

router.get('/', grievanceController.getGrievances);
router.post('/', grievanceController.createGrievance);
router.get('/:id', grievanceController.getGrievanceById);

export default router;
