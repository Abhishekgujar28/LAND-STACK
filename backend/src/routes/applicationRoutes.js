import { Router } from 'express';
import { applicationController } from '../controllers/applicationController.js';

const router = Router();

router.get('/', applicationController.getApplications);
router.post('/', applicationController.createApplication);
router.get('/types', applicationController.getApplicationTypes);
router.get('/:id', applicationController.getApplicationById);

export default router;
