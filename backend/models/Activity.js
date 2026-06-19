import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    actor: { type: String, default: 'System' },
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, default: 'general' },
  },
  { timestamps: true },
);

activitySchema.index({ createdAt: -1 });

export default mongoose.model('Activity', activitySchema);
