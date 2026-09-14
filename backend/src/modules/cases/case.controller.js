/**
 * Land Stack — Case Controller
 */

import { CaseService } from './case.service.js';
import { sendSuccess } from '../../core/response.js';

export const CaseController = {
  async getMyQueue(req, res, next) {
    try {
      const queue = await CaseService.getOfficerQueue(req.user);
      return sendSuccess(res, queue, 'Officer work queue retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getDossier(req, res, next) {
    try {
      const { id } = req.params;
      const dossier = await CaseService.getCaseDossier(id, req.user);
      return sendSuccess(res, dossier, 'Case dossier retrieved successfully');
    } catch (err) {
      next(err);
    }
  },
};
