import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/college-erp';
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected to:', uri);
    return true;
  } catch (err) {
    console.warn('⚠️  MongoDB connection warning:', err.message);
    console.warn('👉 Ensure MongoDB is running on port 27017 for full database persistence.');
    return false;
  }
}
