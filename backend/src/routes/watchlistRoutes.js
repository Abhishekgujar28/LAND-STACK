import { Router } from 'express';
import { watchlistController } from '../controllers/watchlistController.js';

const router = Router();

router.get('/', watchlistController.getWatchlist);
router.post('/', watchlistController.addToWatchlist);
router.delete('/:id', watchlistController.removeFromWatchlist);

export default router;
