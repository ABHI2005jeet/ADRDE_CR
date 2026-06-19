import { Router } from 'express';
import { authRequired, attachUser } from '../middleware/auth.js';
import * as letters from '../controllers/letterController.js';

const router = Router();
router.use(authRequired, attachUser);

router.get('/', letters.listLetters);
router.post('/', letters.createLetter);
router.patch('/:id/approve', letters.approveLetter);

export default router;
