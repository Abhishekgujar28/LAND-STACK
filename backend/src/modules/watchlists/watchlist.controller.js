import { watchlistService } from './watchlist.service.js';

export const watchlistController = {
  getWatchlist: async (req, res, next) => {
    try {
      const { citizenId } = req.query;
      const list = await watchlistService.getWatchlist(citizenId, req.supabase);
      res.json({ success: true, count: list.length, data: list });
    } catch (err) {
      next(err);
    }
  },

  addToWatchlist: async (req, res, next) => {
    try {
      const item = await watchlistService.addToWatchlist(req.body, req.supabase);
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },

  removeFromWatchlist: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await watchlistService.removeFromWatchlist(id, req.supabase);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};
