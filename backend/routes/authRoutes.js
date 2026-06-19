import { Router } from 'express';
import { authRequired, attachUser } from '../middleware/auth.js';
import * as auth from '../controllers/authController.js';

const router = Router();

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/forgot-password', auth.forgotPassword);
router.post('/reset-password', auth.resetPassword);
router.get('/me', authRequired, attachUser, auth.getMe);
router.put('/profile', authRequired, attachUser, auth.updateProfile);

export default router;
