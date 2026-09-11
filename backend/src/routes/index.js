import { Router } from 'express';
import authRoutes from './authRoutes.js';
import parcelRoutes from './parcelRoutes.js';
import mutationRoutes from './mutationRoutes.js';
import applicationRoutes from './applicationRoutes.js';
import grievanceRoutes from './grievanceRoutes.js';
import documentRoutes from './documentRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import watchlistRoutes from './watchlistRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import publicRoutes from './publicRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/parcels', parcelRoutes);
router.use('/mutations', mutationRoutes);
router.use('/applications', applicationRoutes);
router.use('/grievances', grievanceRoutes);
router.use('/documents', documentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/watchlist', watchlistRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/public', publicRoutes);

export default router;
