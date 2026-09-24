/**
 * Land Stack — Notification Routes
 */

import { Router } from 'express';
import { NotificationController } from './notification.controller.js';
import { requireAuth } from '../../middleware/requireAuth.js';

const router = Router();

// All notification routes require authentication
router.use(requireAuth);

router.get('/', NotificationController.getMyNotifications);
router.post('/mark-all-read', NotificationController.markAllAsRead);
router.patch('/:id/read', NotificationController.markAsRead);

export default router;
