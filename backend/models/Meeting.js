import mongoose from 'mongoose';

const auditEntrySchema = new mongoose.Schema(
  {
    action: String,
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    byName: String,
    byRole: String,
    note: String,
    at: { type: Date, default: Date.now },
  },
  { _id: false },
);

const meetingSchema = new mongoose.Schema(
  {
    meetingId: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    date: { type: String, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    department: { type: String, default: '' },
    priority: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'], default: 'Medium' },
    agendaNotes: { type: String, default: '' },
    participants: [{ type: String }],
    attachments: [
      {
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['Draft', 'Under Review', 'Pending Approval', 'Approved', 'Rejected', 'Published'],
      default: 'Draft',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdByName: String,
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedByName: String,
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedByName: String,
    approvalTime: Date,
    rejectionReason: String,
    auditTrail: [auditEntrySchema],
  },
  { timestamps: true },
);

meetingSchema.index({ meetingId: 1 });
meetingSchema.index({ status: 1 });
meetingSchema.index({ date: 1 });

export default mongoose.model('Meeting', meetingSchema);
