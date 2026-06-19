import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, enum: ['Assets', 'Equipment', 'Requests', 'Tracking'], default: 'Assets' },
    department: { type: String, default: '' },
    assignedTo: { type: String, default: '' },
    location: { type: String, default: '' },
    status: { type: String, default: 'Available' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedByName: String,
  },
  { timestamps: true },
);

inventorySchema.index({ category: 1 });
inventorySchema.index({ itemId: 1 });

export default mongoose.model('Inventory', inventorySchema);
