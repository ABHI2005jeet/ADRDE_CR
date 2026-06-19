import Letter from '../models/Letter.js';
import { logActivity } from '../utils/events.js';

export async function listLetters(req, res, next) {
  try {
    const { direction, q } = req.query;
    const filter = {};
    if (direction) filter.direction = direction;
    if (q) filter.$or = [{ subject: new RegExp(q, 'i') }, { reference: new RegExp(q, 'i') }, { letterId: new RegExp(q, 'i') }];
    const letters = await Letter.find(filter).sort({ createdAt: -1 });
    res.json(letters);
  } catch (error) {
    next(error);
  }
}

export async function createLetter(req, res, next) {
  try {
    const letter = await Letter.create({
      ...req.body,
      letterId: req.body.letterId || `LTR-${Date.now().toString().slice(-5)}`,
      createdBy: req.user._id,
      createdByName: req.user.name,
    });
    await logActivity(`Letter created: ${letter.reference}`, req.user.name, req.user._id, 'letter');
    res.status(201).json(letter);
  } catch (error) {
    next(error);
  }
}

export async function approveLetter(req, res, next) {
  try {
    const letter = await Letter.findByIdAndUpdate(req.params.id, { status: 'Approved' }, { new: true });
    if (!letter) return res.status(404).json({ message: 'Letter not found' });
    await logActivity('Letter approved', req.user.name, req.user._id, 'letter');
    res.json(letter);
  } catch (error) {
    next(error);
  }
}
