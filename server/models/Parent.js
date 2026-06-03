import mongoose from 'mongoose';

const parentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  relationship: { type: String, default: 'Guardian' },
}, { timestamps: true });

export default mongoose.model('Parent', parentSchema);
