/**
 * Land Stack — Application Controller
 */

import { ApplicationService } from './application.service.js';
import { sendSuccess, sendCreated, sendPaginated } from '../../core/response.js';

export const ApplicationController = {
  async getTypes(req, res, next) {
    try {
      const types = await ApplicationService.getApplicationTypes();
      return sendSuccess(res, types, 'Application types retrieved');
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const result = await ApplicationService.createApplication(req.body, req.user);
      return sendCreated(res, result, 'Application submitted successfully');
    } catch (err) {
      next(err);
    }
  },

  async list(req, res, next) {
    try {
      const { citizenId, status, typeCode, page = 1, limit = 20 } = req.query;
      const result = await ApplicationService.getApplications(
        {
          citizenId,
          status,
          typeCode,
          page: parseInt(page, 10) || 1,
          limit: parseInt(limit, 10) || 20,
        },
        req.user
      );

      return sendPaginated(res, result.items, result.page, result.limit, result.total, 'Applications retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await ApplicationService.getApplicationById(id, req.user);
      return sendSuccess(res, result, 'Application details retrieved');
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const result = await ApplicationService.updateStatus(id, req.body, req.user);
      return sendSuccess(res, result, 'Application status updated');
    } catch (err) {
      next(err);
    }
  },
};
