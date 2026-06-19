import mongoose from 'mongoose';

const letterSchema = new mongoose.Schema(
  {
    letterId: { type: String, required: true, unique: true },
    direction: { type: String, enum: ['Incoming', 'Outgoing', 'Draft'], required: true },
    subject: { type: String, required: true },
    reference: { type: String, required: true },
    status: { type: String, default: 'Draft' },
    department: { type: String, default: '' },
    date: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    filename: String,
    originalName: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdByName: String,
  },
  { timestamps: true },
);

letterSchema.index({ direction: 1 });
letterSchema.index({ subject: 'text', reference: 'text' });

export default mongoose.model('Letter', letterSchema);
