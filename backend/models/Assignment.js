import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  subject: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  dueDate: { type: Date, required: true },
  fileUrl: { type: String, default: '' },
  grade: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Assignment', assignmentSchema);
