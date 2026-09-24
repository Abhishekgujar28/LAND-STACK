import { Router } from 'express';
import { watchlistController } from './watchlist.controller.js';
import { requireAuth } from '../../middleware/requireAuth.js';

const router = Router();

router.use(requireAuth);

router.get('/', watchlistController.getWatchlist);
router.post('/', watchlistController.addToWatchlist);
router.delete('/:id', watchlistController.removeFromWatchlist);

export default router;
