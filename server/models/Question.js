import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  type: { type: String, enum: ['mcq', 'descriptive'], required: true },
  questionText: { type: String, required: true },
  options: [{ text: String }], // only for MCQ
  correctAnswer: { type: String, default: '' }, // '0','1','2','3' for MCQ index, '' for descriptive
  marks: { type: Number, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

questionSchema.index({ examId: 1, order: 1 });

export default mongoose.model('Question', questionSchema);
