/**
 * Land Stack — Mutation Routes
 * 
 * Enforces authentication, permission gates, and input validation
 * for all mutation lifecycle operations.
 */

import { Router } from 'express';
import { MutationController } from './mutation.controller.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requirePermission } from '../../middleware/requirePermission.js';
import { requireMfaStepUp } from '../../middleware/requireMfaStepUp.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { Permissions } from '../../core/permissions.js';
import {
  createMutationSchema,
  mutationApproveSchema,
  mutationRejectSchema,
  objectionSchema,
  hearingSchema,
  mutationIdParamSchema,
} from './mutation.validators.js';

const router = Router();

// All mutation routes require authentication
router.use(requireAuth);

// List & Create
router.get('/', MutationController.list);
router.post(
  '/',
  validateRequest({ body: createMutationSchema }),
  MutationController.create
);

// Detail
router.get(
  '/:id',
  validateRequest({ params: mutationIdParamSchema }),
  MutationController.getById
);

// Generic state machine action execution
router.post(
  '/:id/actions/:action',
  validateRequest({ params: mutationIdParamSchema }),
  MutationController.executeAction
);

// Action: Approve (Requires MUTATION_APPROVE permission + MFA step-up)
// Note: Admin is explicitly forbidden from approving mutations in permissions.js
router.post(
  '/:id/approve',
  requirePermission(Permissions.MUTATION_APPROVE),
  requireMfaStepUp(),
  validateRequest({
    params: mutationIdParamSchema,
    body: mutationApproveSchema,
  }),
  MutationController.approve
);

// Action: Reject (Requires MUTATION_REJECT permission + MFA step-up)
router.post(
  '/:id/reject',
  requirePermission(Permissions.MUTATION_REJECT),
  requireMfaStepUp(),
  validateRequest({
    params: mutationIdParamSchema,
    body: mutationRejectSchema,
  }),
  MutationController.reject
);

// Action: Field Verification (Requires MUTATION_FIELD_VERIFY — Talathi)
router.post(
  '/:id/field-verify',
  requirePermission(Permissions.MUTATION_FIELD_VERIFY),
  validateRequest({ params: mutationIdParamSchema }),
  MutationController.submitFieldVerification
);

// Action: Record Objection (During notice period)
router.post(
  '/:id/objections',
  validateRequest({
    params: mutationIdParamSchema,
    body: objectionSchema,
  }),
  MutationController.recordObjection
);

// Action: Schedule Hearing (Requires MUTATION_HEARING — Tahsildar)
router.post(
  '/:id/hearings',
  requirePermission(Permissions.MUTATION_HEARING),
  validateRequest({
    params: mutationIdParamSchema,
    body: hearingSchema,
  }),
  MutationController.scheduleHearing
);

export default router;
