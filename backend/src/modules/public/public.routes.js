import { Router } from 'express';
import { publicController } from './public.controller.js';

const router = Router();

router.get('/services', publicController.getServices);
router.get('/news', publicController.getNews);
router.get('/notices', publicController.getNotices);
router.get('/jurisdictions', publicController.getJurisdictions);

export default router;
