import Agenda from '../models/Agenda.js';
import { logActivity } from '../utils/events.js';

export async function listAgendas(req, res, next) {
  try {
    const { status, q } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (q) filter.$or = [{ topic: new RegExp(q, 'i') }, { agendaId: new RegExp(q, 'i') }, { department: new RegExp(q, 'i') }];
    const agendas = await Agenda.find(filter).sort({ createdAt: -1 });
    res.json(agendas);
  } catch (error) {
    next(error);
  }
}

export async function approveAgenda(req, res, next) {
  try {
    if (!['Admin', 'Para Head'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not allowed' });
    }
    const agenda = await Agenda.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved', approvedBy: req.user._id, approvedByName: req.user.name },
      { new: true },
    );
    if (!agenda) return res.status(404).json({ message: 'Agenda not found' });
    await logActivity(`Agenda ${agenda.agendaId} approved`, req.user.name, req.user._id, 'agenda');
    res.json(agenda);
  } catch (error) {
    next(error);
  }
}

export async function rejectAgenda(req, res, next) {
  try {
    if (!['Admin', 'Para Head'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not allowed' });
    }
    const agenda = await Agenda.findByIdAndUpdate(req.params.id, { status: 'Rejected' }, { new: true });
    if (!agenda) return res.status(404).json({ message: 'Agenda not found' });
    await logActivity(`Agenda ${agenda.agendaId} rejected`, req.user.name, req.user._id, 'agenda');
    res.json(agenda);
  } catch (error) {
    next(error);
  }
}
