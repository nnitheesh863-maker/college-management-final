import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  selectedOption: { type: String, default: '' }, // for MCQ: '0','1','2','3'
  textAnswer: { type: String, default: '' }, // for descriptive
  marksObtained: { type: Number, default: 0 },
  isCorrect: { type: Boolean, default: false },
}, { _id: false });

const examSubmissionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [answerSchema],
  totalMarks: { type: Number, default: 0 },
  obtainedMarks: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  status: { type: String, enum: ['in-progress', 'submitted', 'graded'], default: 'in-progress' },
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date },
  timeTaken: { type: Number, default: 0 }, // in seconds
}, { timestamps: true });

examSubmissionSchema.index({ examId: 1, studentId: 1 }, { unique: true });
examSubmissionSchema.index({ userId: 1 });

export default mongoose.model('ExamSubmission', examSubmissionSchema);
