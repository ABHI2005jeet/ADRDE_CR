import { Router } from 'express';
import { authRequired, attachUser } from '../middleware/auth.js';
import * as users from '../controllers/userController.js';
import * as shortcuts from '../controllers/shortcutController.js';

const router = Router();

router.get('/search', authRequired, attachUser, users.globalSearch);
router.get('/activities', authRequired, attachUser, users.listActivities);

router.get('/shortcuts', authRequired, attachUser, shortcuts.listShortcuts);
router.get('/shortcuts/:key', authRequired, attachUser, shortcuts.getShortcut);
router.post('/shortcuts', authRequired, attachUser, shortcuts.upsertShortcut);
router.delete('/shortcuts/:key', authRequired, attachUser, shortcuts.deleteShortcut);

router.get('/users', authRequired, attachUser, users.listUsers);
router.patch('/users/:id', authRequired, attachUser, users.updateUserRole);

export default router;
