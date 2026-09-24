/**
 * Land Stack — Document Routes
 */

import { Router } from 'express';
import { DocumentController } from './document.controller.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireGovernment } from '../../middleware/requireRole.js';

const router = Router();

router.use(requireAuth);

router.get('/', DocumentController.list);
router.post('/', DocumentController.create);
router.get('/:id', DocumentController.getById);
router.get('/:id/download-url', DocumentController.getSignedUrl);
router.post('/:id/verify', requireGovernment(), DocumentController.verify);

export default router;
