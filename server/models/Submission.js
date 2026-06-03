import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, default: '' },
  fileSize: { type: Number, default: 0 },
  status: { type: String, enum: ['submitted', 'late'], default: 'submitted' },
  marks: { type: Number, default: null },
  feedback: { type: String, default: '' },
  gradedAt: { type: Date, default: null },
}, { timestamps: true });

submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });
submissionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Submission', submissionSchema);
