/**
 * Land Stack — Application Routes
 */

import { Router } from 'express';
import { ApplicationController } from './application.controller.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireGovernment } from '../../middleware/requireRole.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import {
  createApplicationSchema,
  updateApplicationStatusSchema,
  applicationIdParamSchema,
} from './application.validators.js';

const router = Router();

// Public: list available application types
router.get('/types', ApplicationController.getTypes);

// Authenticated routes
router.use(requireAuth);

router.get('/', ApplicationController.list);
router.post(
  '/',
  validateRequest({ body: createApplicationSchema }),
  ApplicationController.create
);

router.get(
  '/:id',
  validateRequest({ params: applicationIdParamSchema }),
  ApplicationController.getById
);

// Officer only: update status
router.patch(
  '/:id/status',
  requireGovernment(),
  validateRequest({
    params: applicationIdParamSchema,
    body: updateApplicationStatusSchema,
  }),
  ApplicationController.updateStatus
);

export default router;
