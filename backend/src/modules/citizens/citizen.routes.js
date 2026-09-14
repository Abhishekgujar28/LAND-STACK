/**
 * Land Stack — Citizen Controller & Routes
 */

import { Router } from 'express';
import { CitizenService } from './citizen.service.js';
import { sendSuccess } from '../../core/response.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireCitizen } from '../../middleware/requireRole.js';

export const CitizenController = {
  async getProfile(req, res, next) {
    try {
      const profile = await CitizenService.getProfile(req.user);
      return sendSuccess(res, profile, 'Profile retrieved');
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const updated = await CitizenService.updateProfile(req.user, req.body);
      return sendSuccess(res, updated, 'Profile updated');
    } catch (err) {
      next(err);
    }
  },

  async getMyParcels(req, res, next) {
    try {
      const parcels = await CitizenService.getMyParcels(req.user);
      return sendSuccess(res, parcels, 'Parcels retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getMyActivity(req, res, next) {
    try {
      const activity = await CitizenService.getMyActivity(req.user);
      return sendSuccess(res, activity, 'Citizen activity retrieved');
    } catch (err) {
      next(err);
    }
  },
};

const router = Router();

router.use(requireAuth, requireCitizen());

router.get('/profile', CitizenController.getProfile);
router.patch('/profile', CitizenController.updateProfile);
router.get('/parcels', CitizenController.getMyParcels);
router.get('/activity', CitizenController.getMyActivity);

export default router;
