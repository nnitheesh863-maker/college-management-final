import 'dotenv/config';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env'), override: false });
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { initSocket } from './services/socketManager.js';
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/student.js';
import teacherRoutes from './routes/teacher.js';
import principalRoutes from './routes/principal.js';
import notificationRoutes from './routes/notifications.js';
import assignmentRoutes from './routes/assignments.js';
import parentRoutes from './routes/parent.js';
import examRoutes from './routes/exams.js';
import chatbotRoutes from './routes/chatbot.js';
import feeRoutes from './routes/fees.js';

const app = express();
const httpServer = createServer(app);

const CORS_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({ origin: CORS_ORIGINS, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/principal', principalRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/fees', feeRoutes);

app.get('/', (req, res) => res.json({ message: 'College ERP API running' }));

const PORT = process.env.PORT || 5001;

connectDB().then((dbConnected) => {
  initSocket(httpServer);
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    if (!dbConnected) {
      console.log('⚠️  Running without database — API routes will return errors');
      console.log('   To fix: install MongoDB or set MONGO_URI in .env');
    }
  });
});
