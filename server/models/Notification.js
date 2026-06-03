import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'warning', 'success', 'alert'], default: 'info' },
  category: { type: String, enum: ['assignment', 'fee', 'announcement', 'leave', 'disciplinary', 'system'], default: 'system' },
  read: { type: Boolean, default: false },
  link: { type: String, default: '' },
}, { timestamps: true });

notificationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
