import { Router } from 'express';
import { authRequired, attachUser } from '../middleware/auth.js';
import * as messages from '../controllers/messageController.js';

const router = Router();
router.use(authRequired, attachUser);

router.get('/inbox', messages.inbox);
router.get('/sent', messages.sent);
router.get('/team', messages.teamMessages);
router.post('/', messages.sendMessage);
router.patch('/:id/read', messages.markMessageRead);

export default router;
