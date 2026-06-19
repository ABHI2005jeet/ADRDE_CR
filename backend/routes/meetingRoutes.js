import { Router } from 'express';
import { authRequired, attachUser } from '../middleware/auth.js';
import * as meetings from '../controllers/meetingController.js';

const router = Router();
router.use(authRequired, attachUser);

router.get('/', meetings.listMeetings);
router.post('/', meetings.createMeeting);
router.put('/:id', meetings.updateMeeting);
router.post('/:id/action', meetings.meetingAction);
router.delete('/:id', meetings.deleteMeeting);

export default router;
