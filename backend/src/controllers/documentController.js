import { documentService } from '../services/documentService.js';

export const documentController = {
  getDocuments: async (req, res, next) => {
    try {
      const { userId } = req.query;
      const docs = await documentService.getDocuments({ userId });
      res.json({ success: true, count: docs.length, data: docs });
    } catch (err) {
      next(err);
    }
  },

  getDocumentById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const doc = await documentService.getDocumentById(id);
      if (!doc) {
        return res.status(404).json({ success: false, error: { message: `Document '${id}' not found` } });
      }
      res.json({ success: true, data: doc });
    } catch (err) {
      next(err);
    }
  },
};
