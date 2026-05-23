import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['paid', 'partial', 'unpaid'], default: 'unpaid' },
  paidAmount: { type: Number, default: 0 },
  transactionId: { type: String, default: '' },
  receiptUrl: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Fee', feeSchema);
