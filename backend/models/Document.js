import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    originalName: { type: String, required: true },
    type: { type: String, required: true },
    category: { type: String, default: 'General' },
    filename: { type: String, required: true },
    mimetype: String,
    size: Number,
    status: { type: String, enum: ['Pending', 'Under Review', 'Approved', 'Archived'], default: 'Pending' },
    version: { type: Number, default: 1 },
    meetingId: { type: String, default: '' },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedByName: String,
    department: String,
    history: [
      {
        action: String,
        byName: String,
        at: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  { timestamps: true },
);

documentSchema.index({ name: 'text', originalName: 'text', category: 'text' });
documentSchema.index({ status: 1 });

export default mongoose.model('Document', documentSchema);
