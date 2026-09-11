import { authService } from '../services/authService.js';

export const authController = {
  loginCitizen: async (req, res, next) => {
    try {
      const { identifier } = req.body;
      const result = await authService.loginCitizen({ identifier });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  loginOfficer: async (req, res, next) => {
    try {
      const { identifier, role } = req.body;
      const result = await authService.loginOfficer({ identifier, role });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  getCitizen: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await authService.getCitizenById(id);
      if (!user) {
        return res.status(404).json({ success: false, error: { message: 'Citizen not found' } });
      }
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },

  getOfficer: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await authService.getOfficerById(id);
      if (!user) {
        return res.status(404).json({ success: false, error: { message: 'Officer not found' } });
      }
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },

  getUsersByRole: async (req, res, next) => {
    try {
      const { role } = req.params;
      const users = await authService.getUsersByRole(role);
      res.json({ success: true, data: users });
    } catch (err) {
      next(err);
    }
  },
};
