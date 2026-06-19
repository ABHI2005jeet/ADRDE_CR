import path from 'path';
import { fileURLToPath } from 'url';
import Document from '../models/Document.js';
import { logActivity, emitEvent } from '../utils/events.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const typeMap = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'image/png': 'Image',
  'image/jpeg': 'Image',
  'image/jpg': 'Image',
  'image/gif': 'Image',
  'image/webp': 'Image',
};

export async function listDocuments(req, res, next) {
  try {
    const { status, q } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { originalName: new RegExp(q, 'i') }, { category: new RegExp(q, 'i') }];
    const docs = await Document.find(filter).sort({ createdAt: -1 });
    res.json(docs);
  } catch (error) {
    next(error);
  }
}

export async function uploadDocument(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const doc = await Document.create({
      name: req.body.name || req.file.originalname,
      originalName: req.file.originalname,
      type: typeMap[req.file.mimetype] || 'File',
      category: req.body.category || 'General',
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      meetingId: req.body.meetingId || '',
      uploadedBy: req.user._id,
      uploadedByName: req.user.name,
      department: req.user.department,
      history: [{ action: 'Uploaded', byName: req.user.name, note: 'Initial upload' }],
    });
    await logActivity(`Document uploaded: ${doc.originalName}`, req.user.name, req.user._id, 'document');
    emitEvent(req.io, 'document:updated', doc);
    res.status(201).json(doc);
  } catch (error) {
    next(error);
  }
}

export async function archiveDocument(req, res, next) {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    doc.status = 'Archived';
    doc.history.push({ action: 'Archived', byName: req.user.name });
    await doc.save();
    await logActivity('Document archived', req.user.name, req.user._id, 'document');
    res.json(doc);
  } catch (error) {
    next(error);
  }
}

export async function downloadDocument(req, res, next) {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    res.download(path.join(__dirname, '..', 'uploads', doc.filename), doc.originalName);
  } catch (error) {
    next(error);
  }
}
