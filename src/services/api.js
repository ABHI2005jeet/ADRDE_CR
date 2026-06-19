import { api } from './apiClient.js';

export const authApi = {
  register: (body) => api.post('/auth/register', body).then((r) => r.data),
  login: (body) => api.post('/auth/login', body).then((r) => r.data),
  forgotPassword: (body) => api.post('/auth/forgot-password', body).then((r) => r.data),
  resetPassword: (body) => api.post('/auth/reset-password', body).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
  updateProfile: (body) => api.put('/auth/profile', body).then((r) => r.data),
};

export const meetingApi = {
  list: (params) => api.get('/meetings', { params }).then((r) => r.data),
  create: (body) => api.post('/meetings', body).then((r) => r.data),
  update: (id, body) => api.put(`/meetings/${id}`, body).then((r) => r.data),
  action: (id, body) => api.post(`/meetings/${id}/action`, body).then((r) => r.data),
  remove: (id) => api.delete(`/meetings/${id}`).then((r) => r.data),
};

export const documentApi = {
  list: (params) => api.get('/documents', { params }).then((r) => r.data),
  archive: (id) => api.patch(`/documents/${id}/archive`).then((r) => r.data),
  upload: (formData) =>
    api.post('/documents/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
};

export const notificationApi = {
  list: (params) => api.get('/notifications', { params }).then((r) => r.data),
  markRead: (id) => api.patch(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () => api.patch('/notifications/read-all').then((r) => r.data),
};

export const messageApi = {
  inbox: () => api.get('/messages/inbox').then((r) => r.data),
  sent: () => api.get('/messages/sent').then((r) => r.data),
  team: () => api.get('/messages/team').then((r) => r.data),
  send: (body) => api.post('/messages', body).then((r) => r.data),
  markRead: (id) => api.patch(`/messages/${id}/read`).then((r) => r.data),
};

export const inventoryApi = {
  list: (params) => api.get('/inventory', { params }).then((r) => r.data),
  create: (body) => api.post('/inventory', body).then((r) => r.data),
  update: (id, body) => api.put(`/inventory/${id}`, body).then((r) => r.data),
  remove: (id) => api.delete(`/inventory/${id}`).then((r) => r.data),
};

export const letterApi = {
  list: (params) => api.get('/letters', { params }).then((r) => r.data),
  create: (body) => api.post('/letters', body).then((r) => r.data),
  approve: (id) => api.patch(`/letters/${id}/approve`).then((r) => r.data),
};

export const agendaApi = {
  list: (params) => api.get('/agendas', { params }).then((r) => r.data),
  approve: (id) => api.patch(`/agendas/${id}/approve`).then((r) => r.data),
  reject: (id) => api.patch(`/agendas/${id}/reject`).then((r) => r.data),
};

export const userApi = {
  list: () => api.get('/users').then((r) => r.data),
  update: (id, body) => api.patch(`/users/${id}`, body).then((r) => r.data),
  search: (q) => api.get('/search', { params: { q } }).then((r) => r.data),
  activities: () => api.get('/activities').then((r) => r.data),
};

export const shortcutApi = {
  list: () => api.get('/shortcuts').then((r) => r.data),
  get: (key) => api.get(`/shortcuts/${key}`).then((r) => r.data),
  upsert: (body) => api.post('/shortcuts', body).then((r) => r.data),
  remove: (key) => api.delete(`/shortcuts/${key}`).then((r) => r.data),
};
