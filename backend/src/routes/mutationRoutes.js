import { Router } from 'express';
import { mutationController } from '../controllers/mutationController.js';

const router = Router();

router.get('/', mutationController.getMutations);
router.post('/', mutationController.createMutation);
router.get('/queues/talathi', mutationController.getTalathiQueue);
router.get('/queues/tehsildar', mutationController.getTehsildarQueue);
router.get('/sro-audits', mutationController.getSroAudits);
router.get('/:id', mutationController.getMutationById);
router.get('/:id/timeline', mutationController.getTimeline);
router.patch('/:id/status', mutationController.updateStatus);

export default router;
