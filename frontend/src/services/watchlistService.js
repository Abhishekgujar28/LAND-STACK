import apiClient from '../api/client';

/**
 * Service to manage citizen watchlist via backend REST API
 */
export const watchlistService = {
  getWatchlist: async (citizenId) => {
    return apiClient.get('watchlist', { citizenId });
  },

  addToWatchlist: async (payload) => {
    return apiClient.post('watchlist', payload);
  },

  removeFromWatchlist: async (id) => {
    return apiClient.delete(`watchlist/${encodeURIComponent(id)}`);
  },
};

export default watchlistService;
