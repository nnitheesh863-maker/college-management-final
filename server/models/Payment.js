import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  feeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fee', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  razorpayOrderId: { type: String, default: '' },
  razorpayPaymentId: { type: String, default: '' },
  razorpaySignature: { type: String, default: '' },
  status: { type: String, enum: ['created', 'captured', 'failed', 'refunded'], default: 'created' },
  method: { type: String, default: '' },
  receiptUrl: { type: String, default: '' },
  paidAt: { type: Date },
}, { timestamps: true });

paymentSchema.index({ feeId: 1, userId: 1 });
paymentSchema.index({ razorpayOrderId: 1 });

export default mongoose.model('Payment', paymentSchema);
