import mongoose from 'mongoose';

const agendaSchema = new mongoose.Schema(
  {
    agendaId: { type: String, required: true, unique: true },
    topic: { type: String, required: true },
    department: { type: String, default: '' },
    priority: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'], default: 'Medium' },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Completed'], default: 'Pending' },
    meetingId: { type: String, default: '' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedByName: String,
  },
  { timestamps: true },
);

export default mongoose.model('Agenda', agendaSchema);
