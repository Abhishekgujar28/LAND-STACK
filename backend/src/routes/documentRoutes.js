import { Router } from 'express';
import { documentController } from '../controllers/documentController.js';

const router = Router();

router.get('/', documentController.getDocuments);
router.get('/:id', documentController.getDocumentById);

export default router;
