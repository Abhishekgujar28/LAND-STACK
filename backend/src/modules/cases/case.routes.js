/**
 * Land Stack — Case Routes
 */

import { Router } from 'express';
import { CaseController } from './case.controller.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireGovernment } from '../../middleware/requireRole.js';

const router = Router();

// Work queues and dossiers require officer authentication
router.use(requireAuth, requireGovernment());

router.get('/queue', CaseController.getMyQueue);
router.get('/my-queue', CaseController.getMyQueue);
router.get('/:id/dossier', CaseController.getDossier);

export default router;
