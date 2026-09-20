import 'dotenv/config';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env'), override: false });
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/student.js';
import teacherRoutes from './routes/teacher.js';
import principalRoutes from './routes/principal.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/principal', principalRoutes);

app.post('/api/chatbot', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: 'No message provided' });
    const API_KEY = process.env.OPENAI_API_KEY;
    if (API_KEY) {
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: API_KEY });
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an AI teaching assistant for a college ERP system. Answer concisely.' },
          { role: 'user', content: message }
        ],
        max_tokens: 300,
      });
      return res.json({ reply: response.choices[0].message.content });
    }
    res.json({ reply: `AI response to: "${message}" (configure OPENAI_API_KEY in .env for AI-powered replies)` });
  } catch (err) {
    res.status(500).json({ reply: 'AI server error', error: err.message });
  }
});

app.get('/', (req, res) => res.json({ message: 'College ERP API running' }));

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
