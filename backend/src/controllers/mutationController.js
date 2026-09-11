import { mutationService } from '../services/mutationService.js';

export const mutationController = {
  getMutations: async (req, res, next) => {
    try {
      const { parcelId, tehsilCode, status, applicantId } = req.query;
      const mutations = await mutationService.getMutations({
        parcelId,
        tehsilCode,
        status,
        applicantId,
      });
      res.json({ success: true, count: mutations.length, data: mutations });
    } catch (err) {
      next(err);
    }
  },

  getMutationById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const mutation = await mutationService.getMutationById(id);
      if (!mutation) {
        return res.status(404).json({ success: false, error: { message: `Mutation '${id}' not found` } });
      }
      res.json({ success: true, data: mutation });
    } catch (err) {
      next(err);
    }
  },

  getTimeline: async (req, res, next) => {
    try {
      const { id } = req.params;
      const steps = await mutationService.getMutationTimeline(id);
      res.json({ success: true, data: steps });
    } catch (err) {
      next(err);
    }
  },

  createMutation: async (req, res, next) => {
    try {
      const mutation = await mutationService.createMutation(req.body);
      res.status(201).json({ success: true, data: mutation });
    } catch (err) {
      next(err);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, remarks, officerName, officerRole } = req.body;
      const updated = await mutationService.updateMutationStatus(id, {
        status,
        remarks,
        officerName,
        officerRole,
      });
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  getTalathiQueue: async (req, res, next) => {
    try {
      const { villageCode } = req.query;
      const queue = await mutationService.getTalathiQueue(villageCode);
      res.json({ success: true, count: queue.length, data: queue });
    } catch (err) {
      next(err);
    }
  },

  getTehsildarQueue: async (req, res, next) => {
    try {
      const { tehsilCode } = req.query;
      const queue = await mutationService.getTehsildarQueue(tehsilCode);
      res.json({ success: true, count: queue.length, data: queue });
    } catch (err) {
      next(err);
    }
  },

  getSroAudits: async (req, res, next) => {
    try {
      const { sroCode } = req.query;
      const audits = await mutationService.getSroAudits(sroCode);
      res.json({ success: true, count: audits.length, data: audits });
    } catch (err) {
      next(err);
    }
  },
};
