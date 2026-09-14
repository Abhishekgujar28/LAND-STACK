/**
 * Land Stack — Master API Router (v1)
 * 
 * Mounts all domain modules with standardized error boundaries,
 * security middleware, and legacy compatibility routes.
 */

import { Router } from 'express';

// Domain Modules
import authRoutes from '../modules/auth/auth.routes.js';
import parcelRoutes from '../modules/parcels/parcel.routes.js';
import mutationRoutes from '../modules/mutations/mutation.routes.js';
import applicationRoutes from '../modules/applications/application.routes.js';
import caseRoutes from '../modules/cases/case.routes.js';
import documentRoutes from '../modules/documents/document.routes.js';
import notificationRoutes from '../modules/notifications/notification.routes.js';
import jurisdictionRoutes from '../modules/jurisdictions/jurisdiction.routes.js';
import citizenRoutes from '../modules/citizens/citizen.routes.js';
import officerRoutes from '../modules/officers/officer.routes.js';
import analyticsRoutes from '../modules/analytics/analytics.routes.js';
import gisRoutes from '../modules/gis/gis.routes.js';
import auditRoutes from '../modules/audit/audit.routes.js';

// Legacy Compatibility Routes
import grievanceRoutes from './grievanceRoutes.js';
import watchlistRoutes from './watchlistRoutes.js';
import publicRoutes from './publicRoutes.js';

const router = Router();

// ─── Production Domain Routes ────────────────────────────────────────────────
router.use('/auth', authRoutes);
router.use('/parcels', parcelRoutes);
router.use('/mutations', mutationRoutes);
router.use('/applications', applicationRoutes);
router.use('/cases', caseRoutes);
router.use('/documents', documentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/jurisdictions', jurisdictionRoutes);
router.use('/citizens', citizenRoutes);
router.use('/officers', officerRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/gis', gisRoutes);
router.use('/audit', auditRoutes);

// ─── Legacy Compatibility Routes ─────────────────────────────────────────────
router.use('/grievances', grievanceRoutes);
router.use('/watchlist', watchlistRoutes);
router.use('/public', publicRoutes);

export default router;
