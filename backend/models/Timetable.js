import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
  grade: { type: String, required: true },
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], required: true },
  period: { type: Number, required: true },
  subject: { type: String, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
}, { timestamps: true });

export default mongoose.model('Timetable', timetableSchema);
