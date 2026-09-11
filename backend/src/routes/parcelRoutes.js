import { Router } from 'express';
import { parcelController } from '../controllers/parcelController.js';

const router = Router();

router.get('/', parcelController.getParcels);
router.get('/:ulpin/360', parcelController.getParcel360);
router.get('/:ulpin/owners', parcelController.getOwners);
router.get('/:ulpin/encumbrances', parcelController.getEncumbrances);
router.get('/:ulpin/restrictions', parcelController.getRestrictions);
router.get('/:ulpin/zoning', parcelController.getZoning);
router.get('/:ulpin/tax', parcelController.getTax);
router.get('/:ulpin/court-cases', parcelController.getCourtCases);
router.get('/:ulpin/documents', parcelController.getDocuments);
router.get('/:ulpin', parcelController.getParcelByUlpin);

export default router;
