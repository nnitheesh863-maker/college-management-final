import mongoose from 'mongoose';

const markSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: String, required: true },
  examType: { type: String, enum: ['midterm', 'final', 'quiz', 'assignment'], default: 'midterm' },
  marksObtained: { type: Number, required: true },
  totalMarks: { type: Number, default: 100 },
  grade: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Mark', markSchema);
