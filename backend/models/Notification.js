import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, default: 'System' },
    category: { type: String, enum: ['Alerts', 'Updates', 'Messages'], default: 'Alerts' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    read: { type: Boolean, default: false },
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ read: 1 });

export default mongoose.model('Notification', notificationSchema);
