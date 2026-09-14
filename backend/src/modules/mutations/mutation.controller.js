/**
 * Land Stack — Mutation Controller
 */

import { MutationService } from './mutation.service.js';
import { sendSuccess, sendCreated, sendPaginated } from '../../core/response.js';

export const MutationController = {
  async create(req, res, next) {
    try {
      const result = await MutationService.createMutation(req.body, req.user);
      return sendCreated(res, result, 'Mutation initiated successfully');
    } catch (err) {
      next(err);
    }
  },

  async list(req, res, next) {
    try {
      const { parcelUlpin, tehsilCode, villageCode, status, applicantId, page = 1, limit = 20 } = req.query;
      const result = await MutationService.getMutations(
        {
          parcelUlpin,
          tehsilCode,
          villageCode,
          status,
          applicantId,
          page: parseInt(page, 10) || 1,
          limit: parseInt(limit, 10) || 20,
        },
        req.user
      );

      return sendPaginated(res, result.items, result.page, result.limit, result.total, 'Mutations retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await MutationService.getMutationById(id, req.user);
      return sendSuccess(res, result, 'Mutation details retrieved');
    } catch (err) {
      next(err);
    }
  },

  async executeAction(req, res, next) {
    try {
      const { id, action } = req.params;
      const ipAddress = req.ip || req.socket?.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await MutationService.executeAction(id, action.toUpperCase(), {
        actor: req.user,
        payload: req.body,
        ipAddress,
        userAgent,
      });

      return sendSuccess(res, result, `Action ${action} executed successfully`);
    } catch (err) {
      next(err);
    }
  },

  async approve(req, res, next) {
    try {
      const { id } = req.params;
      const { remarks, _mfaToken } = req.body;
      const ipAddress = req.ip || req.socket?.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await MutationService.approve(id, {
        remarks,
        _mfaToken,
        actor: req.user,
        ipAddress,
        userAgent,
      });

      return sendSuccess(res, result, 'Mutation approved successfully');
    } catch (err) {
      next(err);
    }
  },

  async reject(req, res, next) {
    try {
      const { id } = req.params;
      const { reason, _mfaToken } = req.body;
      const ipAddress = req.ip || req.socket?.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await MutationService.reject(id, {
        reason,
        _mfaToken,
        actor: req.user,
        ipAddress,
        userAgent,
      });

      return sendSuccess(res, result, 'Mutation rejected');
    } catch (err) {
      next(err);
    }
  },

  async recordObjection(req, res, next) {
    try {
      const { id } = req.params;
      const ipAddress = req.ip || req.socket?.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await MutationService.recordObjection(id, {
        ...req.body,
        actor: req.user,
        ipAddress,
        userAgent,
      });

      return sendSuccess(res, result, 'Objection recorded successfully');
    } catch (err) {
      next(err);
    }
  },

  async scheduleHearing(req, res, next) {
    try {
      const { id } = req.params;
      const ipAddress = req.ip || req.socket?.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await MutationService.scheduleHearing(id, {
        ...req.body,
        actor: req.user,
        ipAddress,
        userAgent,
      });

      return sendSuccess(res, result, 'Hearing scheduled successfully');
    } catch (err) {
      next(err);
    }
  },

  async submitFieldVerification(req, res, next) {
    try {
      const { id } = req.params;
      const ipAddress = req.ip || req.socket?.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await MutationService.submitFieldVerification(id, {
        ...req.body,
        actor: req.user,
        ipAddress,
        userAgent,
      });

      return sendSuccess(res, result, 'Field verification submitted successfully');
    } catch (err) {
      next(err);
    }
  },
};
