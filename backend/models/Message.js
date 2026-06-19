import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fromName: String,
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toName: String,
    subject: { type: String, required: true },
    body: { type: String, required: true },
    read: { type: Boolean, default: false },
    threadId: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    category: { type: String, enum: ['mail', 'chat', 'team'], default: 'mail' },
  },
  { timestamps: true },
);

messageSchema.index({ to: 1, createdAt: -1 });
messageSchema.index({ from: 1, createdAt: -1 });
messageSchema.index({ threadId: 1 });

export default mongoose.model('Message', messageSchema);
