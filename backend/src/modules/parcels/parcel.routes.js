/**
 * Land Stack — Parcel Routes
 * 
 * Parcel search is public (with optional auth for enhanced data).
 * Parcel 360° and sub-resources require authentication.
 */

import { Router } from 'express';
import { parcelController } from './parcel.controller.js';
import { validate } from '../../middleware/validateRequest.js';
import { requireAuth, optionalAuth } from '../../middleware/requireAuth.js';
import { requirePermission } from '../../middleware/requirePermission.js';
import { parcelSearchSchema, ulpinParamSchema } from './parcel.validators.js';
import { Permissions } from '../../core/permissions.js';

const router = Router();

// ─── Public / Optional Auth ────────────────────────────────────────────────────
router.get(
  '/',
  optionalAuth,
  validate({ query: parcelSearchSchema }),
  parcelController.searchParcels
);

// ─── Protected: Parcel Detail ──────────────────────────────────────────────────
router.get(
  '/:ulpin/360',
  requireAuth,
  validate({ params: ulpinParamSchema }),
  parcelController.getParcel360
);

router.get(
  '/:ulpin/ownership',
  requireAuth,
  validate({ params: ulpinParamSchema }),
  parcelController.getOwnership
);

router.get(
  '/:ulpin/encumbrances',
  requireAuth,
  validate({ params: ulpinParamSchema }),
  parcelController.getEncumbrances
);

router.get(
  '/:ulpin/restrictions',
  requireAuth,
  validate({ params: ulpinParamSchema }),
  parcelController.getRestrictions
);

router.get(
  '/:ulpin/zoning',
  requireAuth,
  validate({ params: ulpinParamSchema }),
  parcelController.getZoning
);

router.get(
  '/:ulpin/tax',
  requireAuth,
  validate({ params: ulpinParamSchema }),
  parcelController.getTax
);

router.get(
  '/:ulpin/courts',
  requireAuth,
  validate({ params: ulpinParamSchema }),
  parcelController.getCourtCases
);

router.get(
  '/:ulpin/documents',
  requireAuth,
  validate({ params: ulpinParamSchema }),
  parcelController.getDocuments
);

router.get(
  '/:ulpin/valuation',
  requireAuth,
  validate({ params: ulpinParamSchema }),
  parcelController.getValuation
);

// Single parcel by ULPIN — after all sub-routes
router.get(
  '/:ulpin',
  optionalAuth,
  validate({ params: ulpinParamSchema }),
  parcelController.getParcel
);

export default router;
