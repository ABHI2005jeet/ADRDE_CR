import mongoose from 'mongoose';

const shortcutSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'LAN Portal' },
    externalUrl: { type: String, default: '' },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    stats: {
      visits: { type: Number, default: 0 },
      lastVisited: Date,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Shortcut', shortcutSchema);
