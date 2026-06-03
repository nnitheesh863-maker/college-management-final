import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  subject: { type: String, required: true },
  grade: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  totalMarks: { type: Number, default: 0 },
  startTime: { type: Date },
  endTime: { type: Date },
  status: { type: String, enum: ['draft', 'published', 'active', 'completed'], default: 'draft' },
  shuffleQuestions: { type: Boolean, default: false },
}, { timestamps: true });

examSchema.index({ grade: 1, status: 1 });
examSchema.index({ teacherId: 1, createdAt: -1 });

export default mongoose.model('Exam', examSchema);
