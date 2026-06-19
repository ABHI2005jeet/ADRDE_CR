import Message from '../models/Message.js';
import { logActivity, emitEvent } from '../utils/events.js';

export async function inbox(req, res, next) {
  try {
    const messages = await Message.find({ to: req.user._id }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
}

export async function sent(req, res, next) {
  try {
    const messages = await Message.find({ from: req.user._id }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const { to, subject, body, category = 'mail' } = req.body;
    const User = (await import('../models/User.js')).default;
    const recipient = await User.findById(to);
    if (!recipient) return res.status(404).json({ message: 'Recipient not found' });

    const message = await Message.create({
      from: req.user._id,
      fromName: req.user.name,
      to: recipient._id,
      toName: recipient.name,
      subject,
      body,
      category,
    });

    await logActivity(`Message sent to ${recipient.name}`, req.user.name, req.user._id, 'message');
    emitEvent(req.io, 'message:new', { to: String(recipient._id), message });
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
}

export async function markMessageRead(req, res, next) {
  try {
    const message = await Message.findOneAndUpdate(
      { _id: req.params.id, to: req.user._id },
      { read: true },
      { new: true },
    );
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json(message);
  } catch (error) {
    next(error);
  }
}

export async function teamMessages(req, res, next) {
  try {
    const messages = await Message.find({ category: 'team' }).sort({ createdAt: -1 }).limit(50);
    res.json(messages);
  } catch (error) {
    next(error);
  }
}
