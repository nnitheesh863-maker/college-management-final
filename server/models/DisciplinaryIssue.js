import mongoose from 'mongoose';

const disciplinaryIssueSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  actionTaken: { type: String, default: '' },
  status: { type: String, enum: ['open', 'resolved', 'pending'], default: 'open' },
}, { timestamps: true });

export default mongoose.model('DisciplinaryIssue', disciplinaryIssueSchema);
