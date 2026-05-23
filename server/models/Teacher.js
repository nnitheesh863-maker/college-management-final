import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  classesAssigned: [{ type: String }],
  salary: { type: Number, default: 0 },
  performanceRating: { type: Number, default: 4.0 },
  resources: [{ title: String, fileUrl: String, uploadedAt: Date }],
}, { timestamps: true });

export default mongoose.model('Teacher', teacherSchema);
