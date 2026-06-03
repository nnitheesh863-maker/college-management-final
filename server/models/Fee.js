import mongoose from 'mongoose';

const installmentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  paidAt: { type: Date },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
}, { _id: true });

const feeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'Tuition Fee' },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['paid', 'partial', 'unpaid', 'overdue'], default: 'unpaid' },
  paidAmount: { type: Number, default: 0 },
  transactionId: { type: String, default: '' },
  receiptUrl: { type: String, default: '' },
  paymentMethod: { type: String, default: '' },
  installments: [installmentSchema],
  installmentPlan: { type: Boolean, default: false },
  totalInstallments: { type: Number, default: 1 },
  reminderSent: { type: Boolean, default: false },
  lastReminderAt: { type: Date },
}, { timestamps: true });

feeSchema.virtual('dueAmount').get(function () {
  return this.amount - this.paidAmount;
});

feeSchema.virtual('overdue').get(function () {
  return this.status === 'unpaid' && new Date() > this.dueDate;
});

feeSchema.set('toJSON', { virtuals: true });
feeSchema.set('toObject', { virtuals: true });

export default mongoose.model('Fee', feeSchema);
