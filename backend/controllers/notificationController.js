import Notification from '../models/Notification.js';
import { emitNotification } from '../utils/events.js';

export async function listNotifications(req, res, next) {
  try {
    const { category } = req.query;
    const filter = { $or: [{ userId: req.user._id }, { userId: null }] };
    if (category) filter.category = category;
    const items = await Notification.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json(items);
  } catch (error) {
    next(error);
  }
}

export async function markRead(req, res, next) {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    emitNotification(req.io, req.user._id, { id: req.params.id, read: true });
    res.json({ message: 'Marked read' });
  } catch (error) {
    next(error);
  }
}

export async function markAllRead(req, res, next) {
  try {
    await Notification.updateMany({ userId: req.user._id }, { read: true });
    res.json({ message: 'All marked read' });
  } catch (error) {
    next(error);
  }
}
