/**
 * Land Stack — Document Controller
 */

import { DocumentService } from './document.service.js';
import { sendSuccess, sendCreated, sendPaginated } from '../../core/response.js';

export const DocumentController = {
  async list(req, res, next) {
    try {
      const { userId, parcelId, type, page = 1, limit = 20 } = req.query;
      const result = await DocumentService.getDocuments(
        {
          userId,
          parcelId,
          type,
          page: parseInt(page, 10) || 1,
          limit: parseInt(limit, 10) || 20,
        },
        req.user
      );

      return sendPaginated(res, result.items, result.page, result.limit, result.total, 'Documents retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await DocumentService.getDocumentById(id, req.user);
      return sendSuccess(res, result, 'Document details retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getSignedUrl(req, res, next) {
    try {
      const { id } = req.params;
      const result = await DocumentService.getDownloadUrl(id, req.user);
      return sendSuccess(res, result, 'Signed download URL generated');
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const result = await DocumentService.createDocument(req.body, req.user);
      return sendCreated(res, result, 'Document registered successfully');
    } catch (err) {
      next(err);
    }
  },

  async verify(req, res, next) {
    try {
      const { id } = req.params;
      const result = await DocumentService.verifyDocument(id, req.body, req.user);
      return sendSuccess(res, result, 'Document verification updated');
    } catch (err) {
      next(err);
    }
  },
};
