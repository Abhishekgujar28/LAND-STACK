/**
 * Land Stack — Officer Controller & Routes
 */

import { Router } from 'express';
import { OfficerService } from './officer.service.js';
import { sendSuccess } from '../../core/response.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireGovernment } from '../../middleware/requireRole.js';

export const OfficerController = {
  async getProfile(req, res, next) {
    try {
      const profile = await OfficerService.getProfile(req.user, req.supabase);
      return sendSuccess(res, profile, 'Officer profile retrieved');
    } catch (err) {
      next(err);
    }
  },

  async list(req, res, next) {
    try {
      const { role, department, tehsilCode, villageCode } = req.query;
      const officers = await OfficerService.listOfficers({
        role,
        department,
        tehsilCode,
        villageCode,
      }, req.supabase);
      return sendSuccess(res, officers, 'Officers retrieved');
    } catch (err) {
      next(err);
    }
  },
};

const router = Router();

router.use(requireAuth, requireGovernment());

router.get('/profile', OfficerController.getProfile);
router.get('/', OfficerController.list);

export default router;
