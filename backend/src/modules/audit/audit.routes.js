/**
 * Land Stack — Audit Controller & Routes
 */

import { Router } from 'express';
import { AuditService } from './audit.service.js';
import { sendSuccess } from '../../core/response.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireGovernment } from '../../middleware/requireRole.js';

export const AuditController = {
  async getRecent(req, res, next) {
    try {
      const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
      const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
      const { entityType } = req.query;

      const logs = await AuditService.getRecent({ limit, offset, entityType });
      return sendSuccess(res, logs, 'Audit logs retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getEntityTrail(req, res, next) {
    try {
      const { entityType, entityId } = req.params;
      const trail = await AuditService.getTrail(entityType.toUpperCase(), entityId);
      return sendSuccess(res, trail, `Audit trail for ${entityType} ${entityId}`);
    } catch (err) {
      next(err);
    }
  },
};

const router = Router();

// Audit logs are restricted to government officers
router.use(requireAuth, requireGovernment());

router.get('/', AuditController.getRecent);
router.get('/:entityType/:entityId', AuditController.getEntityTrail);

export default router;
