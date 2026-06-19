import Activity from '../models/Activity.js';

export async function logActivity(text, actor = 'System', actorId = null, type = 'general') {
  return Activity.create({ text, actor, actorId, type });
}

export function emitNotification(io, userId, payload) {
  if (!io) return;
  if (userId) io.to(String(userId)).emit('notification', payload);
  io.emit('notification:broadcast', payload);
}

export function emitEvent(io, event, payload) {
  if (!io) return;
  io.emit(event, payload);
}
