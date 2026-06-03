import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import Conversation from '../models/Conversation.js';
import { buildContext } from '../services/contextBuilder.js';

const router = Router();

const FLASK_URL = process.env.FLASK_URL || 'http://127.0.0.1:5000';
const FLASK_SECRET = process.env.FLASK_SECRET || 'shared-flask-secret-2026';

router.post('/query', authenticate, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'No message provided' });

    const context = await buildContext(req.user);
    const systemPrompt = `You are an AI assistant for a College ERP system. You have access to real database context about this ${req.user.role}. Answer concisely and accurately based only on the data provided. If the data doesn't contain the answer, say so politely.\n\nREAL-TIME DATABASE CONTEXT:\n${context}`;

    let reply = '';

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const flaskRes = await fetch(`${FLASK_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': FLASK_SECRET },
        body: JSON.stringify({ systemPrompt, message, role: req.user.role, name: req.user.name }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (flaskRes.ok) {
        const data = await flaskRes.json();
        reply = data.reply || '';
      } else {
        reply = await fallbackReply(systemPrompt, message);
      }
    } catch {
      reply = await fallbackReply(systemPrompt, message);
    }

    if (!reply) reply = 'I could not process your query right now. Please try again.';

    let conversation = await Conversation.findOne({ userId: req.user.id });
    if (!conversation) {
      conversation = await Conversation.create({ userId: req.user.id, messages: [] });
    }

    conversation.messages.push({ role: 'user', text: message });
    conversation.messages.push({ role: 'bot', text: reply });
    if (conversation.messages.length > 50) {
      conversation.messages = conversation.messages.slice(-50);
    }
    await conversation.save();

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'AI server error', detail: err.message });
  }
});

async function fallbackReply(systemPrompt, message) {
  const API_KEY = process.env.OPENAI_API_KEY;
  if (!API_KEY) return `I understand you're asking: "${message}" — but I need an OPENAI_API_KEY configured for AI-powered responses.`;

  try {
    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({ apiKey: API_KEY });
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: message }],
      max_tokens: 500,
    });
    return response.choices[0]?.message?.content || 'No response generated.';
  } catch {
    return 'Failed to generate AI response.';
  }
}

router.get('/history', authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ userId: req.user.id });
    res.json({ messages: conversation?.messages || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/history', authenticate, async (req, res) => {
  try {
    await Conversation.findOneAndDelete({ userId: req.user.id });
    res.json({ message: 'Conversation history cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
