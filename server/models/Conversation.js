import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  messages: [{
    role: { type: String, enum: ['user', 'bot'], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

export default mongoose.model('Conversation', conversationSchema);
