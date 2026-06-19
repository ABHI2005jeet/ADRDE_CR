import { Router } from 'express';
import { authRequired, attachUser } from '../middleware/auth.js';
import * as notifications from '../controllers/notificationController.js';

const router = Router();
router.use(authRequired, attachUser);

router.get('/', notifications.listNotifications);
router.patch('/:id/read', notifications.markRead);
router.patch('/read-all', notifications.markAllRead);

export default router;
