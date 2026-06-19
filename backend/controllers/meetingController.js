import Meeting from '../models/Meeting.js';
import Notification from '../models/Notification.js';
import { logActivity, emitEvent, emitNotification } from '../utils/events.js';

function canTransition(role, action) {
  if (role === 'Admin') return true;
  if (action === 'submit_review' && ['Staff', 'Scientist', 'Technical Officer'].includes(role)) return true;
  if (action === 'review' && role === 'Scientist') return true;
  if (action === 'approve' && role === 'Para Head') return true;
  if (action === 'publish' && ['Para Head', 'Admin'].includes(role)) return true;
  if (action === 'create' && ['Staff', 'Scientist', 'Technical Officer', 'Admin'].includes(role)) return true;
  return false;
}

export async function listMeetings(req, res, next) {
  try {
    const { status, q } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { title: new RegExp(q, 'i') },
        { meetingId: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
      ];
    }
    const meetings = await Meeting.find(filter).sort({ date: -1, time: -1 });
    res.json(meetings);
  } catch (error) {
    next(error);
  }
}

export async function createMeeting(req, res, next) {
  try {
    if (!canTransition(req.user.role, 'create')) {
      return res.status(403).json({ message: 'You cannot create meetings' });
    }
    const data = req.body;
    const exists = await Meeting.findOne({ meetingId: data.meetingId });
    if (exists) return res.status(409).json({ message: 'Meeting ID already exists' });

    const meeting = await Meeting.create({
      ...data,
      status: 'Draft',
      createdBy: req.user._id,
      createdByName: req.user.name,
      auditTrail: [{ action: 'Created', by: req.user._id, byName: req.user.name, byRole: req.user.role }],
    });

    await logActivity(`Meeting #${meeting.meetingId.replace(/\D/g, '').slice(-3) || meeting.meetingId} created`, req.user.name, req.user._id, 'meeting');
    const note = await Notification.create({
      title: 'Meeting created',
      message: `${meeting.title} (${meeting.meetingId}) was created`,
      type: 'Meeting',
      category: 'Updates',
    });
    emitNotification(req.io, null, note);
    emitEvent(req.io, 'meeting:updated', meeting);
    res.status(201).json(meeting);
  } catch (error) {
    next(error);
  }
}

export async function updateMeeting(req, res, next) {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });

    Object.assign(meeting, req.body);
    meeting.auditTrail.push({ action: 'Updated', by: req.user._id, byName: req.user.name, byRole: req.user.role });
    await meeting.save();

    await logActivity(`Meeting ${meeting.meetingId} updated`, req.user.name, req.user._id, 'meeting');
    emitEvent(req.io, 'meeting:updated', meeting);
    res.json(meeting);
  } catch (error) {
    next(error);
  }
}

export async function meetingAction(req, res, next) {
  try {
    const { action, note } = req.body;
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });

    let notificationTitle = '';
    let notificationMessage = '';

    if (action === 'submit_review') {
      if (!canTransition(req.user.role, 'submit_review')) return res.status(403).json({ message: 'Not allowed' });
      meeting.status = 'Under Review';
      meeting.auditTrail.push({ action: 'Submitted for review', by: req.user._id, byName: req.user.name, byRole: req.user.role, note });
      notificationTitle = 'Meeting submitted for review';
      notificationMessage = `${meeting.meetingId} is under scientist review`;
    } else if (action === 'review') {
      if (!canTransition(req.user.role, 'review')) return res.status(403).json({ message: 'Not allowed' });
      meeting.status = 'Pending Approval';
      meeting.reviewedBy = req.user._id;
      meeting.reviewedByName = req.user.name;
      meeting.auditTrail.push({ action: 'Reviewed', by: req.user._id, byName: req.user.name, byRole: req.user.role, note });
      notificationTitle = 'Meeting reviewed';
      notificationMessage = `${meeting.meetingId} sent to Para Head for approval`;
    } else if (action === 'request_changes') {
      if (!canTransition(req.user.role, 'review')) return res.status(403).json({ message: 'Not allowed' });
      meeting.status = 'Draft';
      meeting.rejectionReason = note || 'Changes requested';
      meeting.auditTrail.push({ action: 'Changes requested', by: req.user._id, byName: req.user.name, byRole: req.user.role, note });
      notificationTitle = 'Changes requested';
      notificationMessage = `${meeting.meetingId} requires updates`;
    } else if (action === 'approve') {
      if (!canTransition(req.user.role, 'approve')) return res.status(403).json({ message: 'Not allowed' });
      meeting.status = 'Approved';
      meeting.approvedBy = req.user._id;
      meeting.approvedByName = req.user.name;
      meeting.approvalTime = new Date();
      meeting.auditTrail.push({ action: 'Approved', by: req.user._id, byName: req.user.name, byRole: req.user.role, note });
      notificationTitle = 'Meeting approved';
      notificationMessage = `${meeting.meetingId} approved by Para Head`;
    } else if (action === 'reject') {
      if (!canTransition(req.user.role, 'approve')) return res.status(403).json({ message: 'Not allowed' });
      meeting.status = 'Rejected';
      meeting.rejectionReason = note || 'Rejected';
      meeting.auditTrail.push({ action: 'Rejected', by: req.user._id, byName: req.user.name, byRole: req.user.role, note });
      notificationTitle = 'Meeting rejected';
      notificationMessage = `${meeting.meetingId} was rejected`;
    } else if (action === 'publish') {
      if (!canTransition(req.user.role, 'publish')) return res.status(403).json({ message: 'Not allowed' });
      meeting.status = 'Published';
      meeting.auditTrail.push({ action: 'Published', by: req.user._id, byName: req.user.name, byRole: req.user.role, note });
      notificationTitle = 'Meeting published';
      notificationMessage = `${meeting.meetingId} is now published`;
    } else {
      return res.status(400).json({ message: 'Unknown action' });
    }

    await meeting.save();
    await logActivity(notificationTitle, req.user.name, req.user._id, 'meeting');
    const notification = await Notification.create({
      title: notificationTitle,
      message: notificationMessage,
      type: 'Meeting',
      category: 'Alerts',
    });
    emitNotification(req.io, null, notification);
    emitEvent(req.io, 'meeting:updated', meeting);
    res.json(meeting);
  } catch (error) {
    next(error);
  }
}

export async function deleteMeeting(req, res, next) {
  try {
    if (!['Admin', 'Para Head'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not allowed' });
    }
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    await logActivity(`Meeting ${meeting.meetingId} deleted`, req.user.name, req.user._id, 'meeting');
    emitEvent(req.io, 'meeting:deleted', { id: req.params.id });
    res.json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
}
