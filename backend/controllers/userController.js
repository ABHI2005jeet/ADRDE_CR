import User from '../models/User.js';
import Meeting from '../models/Meeting.js';
import Document from '../models/Document.js';
import Notification from '../models/Notification.js';
import Letter from '../models/Letter.js';
import Inventory from '../models/Inventory.js';
import Activity from '../models/Activity.js';

export async function listUsers(req, res, next) {
  try {
    const users = await User.find().select('-password -resetPasswordToken -resetPasswordExpires').sort({ name: 1 });
    res.json(users.map((u) => u.toPublicJSON()));
  } catch (error) {
    next(error);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Admin only' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (req.body.role) user.role = req.body.role;
    if (req.body.status) user.status = req.body.status;
    await user.save();
    res.json({ user: user.toPublicJSON() });
  } catch (error) {
    next(error);
  }
}

export async function globalSearch(req, res, next) {
  try {
    const q = req.query.q?.trim();
    if (!q) return res.json({ results: [] });
    const regex = new RegExp(q, 'i');
    const [users, meetings, documents, notifications, letters, inventory, activities] = await Promise.all([
      User.find({ $or: [{ name: regex }, { email: regex }, { employeeId: regex }] }).limit(5),
      Meeting.find({ $or: [{ title: regex }, { meetingId: regex }, { description: regex }] }).limit(5),
      Document.find({ $or: [{ name: regex }, { originalName: regex }, { category: regex }] }).limit(5),
      Notification.find({ $or: [{ title: regex }, { message: regex }] }).limit(5),
      Letter.find({ $or: [{ subject: regex }, { reference: regex }] }).limit(5),
      Inventory.find({ $or: [{ name: regex }, { itemId: regex }] }).limit(5),
      Activity.find({ $or: [{ text: regex }, { actor: regex }] }).limit(5),
    ]);

    const results = [
      ...users.map((u) => ({ type: 'User', label: u.name, detail: u.role, page: 'users-management', id: u._id })),
      ...meetings.map((m) => ({ type: 'Meeting', label: m.title, detail: m.meetingId, page: 'meetings-upcoming', id: m._id })),
      ...documents.map((d) => ({ type: 'Document', label: d.originalName, detail: d.status, page: 'documents-view', id: d._id })),
      ...notifications.map((n) => ({ type: 'Notification', label: n.title, detail: n.category, page: 'notifications-alerts', id: n._id })),
      ...letters.map((l) => ({ type: 'Letter', label: l.subject, detail: l.direction, page: `letters-${l.direction.toLowerCase()}`, id: l._id })),
      ...inventory.map((i) => ({ type: 'Inventory', label: i.name, detail: i.category, page: `inventory-${i.category.toLowerCase()}`, id: i._id })),
      ...activities.map((a) => ({ type: 'Activity', label: a.text, detail: a.actor, page: 'reports-activity', id: a._id })),
    ];
    res.json({ results });
  } catch (error) {
    next(error);
  }
}

export async function listActivities(req, res, next) {
  try {
    const items = await Activity.find().sort({ createdAt: -1 }).limit(50);
    res.json(items);
  } catch (error) {
    next(error);
  }
}
