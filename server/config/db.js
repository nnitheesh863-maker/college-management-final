import mongoose from 'mongoose';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../../.env') });

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('⚠️ MONGO_URI not set. Server will start without database.');
    return false;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000 });
    console.log('✅ MongoDB connected');
    return true;
  } catch (err) {
    console.warn('⚠️ MongoDB unavailable, running without database:', err.message);
    return false;
  }
}
