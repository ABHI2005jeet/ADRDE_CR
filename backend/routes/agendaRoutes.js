import { Router } from 'express';
import { authRequired, attachUser } from '../middleware/auth.js';
import * as agendas from '../controllers/agendaController.js';

const router = Router();
router.use(authRequired, attachUser);

router.get('/', agendas.listAgendas);
router.patch('/:id/approve', agendas.approveAgenda);
router.patch('/:id/reject', agendas.rejectAgenda);

export default router;
