import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rollNo: { type: String, required: true, unique: true },
  grade: { type: String, required: true },
  section: { type: String, default: 'A' },
  parentContact: { type: String, default: '' },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent', default: null },
  feeStatus: { type: String, enum: ['paid', 'partial', 'unpaid'], default: 'unpaid' },
  attendance: [{ date: Date, status: { type: String, enum: ['present', 'absent', 'leave'] } }],
  disciplinaryRecords: [{ description: String, date: Date, action: String }],
  achievements: [{ title: String, date: Date, icon: String }],
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
