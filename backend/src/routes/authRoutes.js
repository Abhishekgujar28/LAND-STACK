import { Router } from 'express';
import { authController } from '../controllers/authController.js';

const router = Router();

router.post('/login-citizen', authController.loginCitizen);
router.post('/login-officer', authController.loginOfficer);
router.get('/citizens/:id', authController.getCitizen);
router.get('/officers/:id', authController.getOfficer);
router.get('/roles/:role', authController.getUsersByRole);

export default router;
