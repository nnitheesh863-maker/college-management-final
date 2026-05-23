import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const SUGGESTIONS = [
  'Show me student attendance',
  'Who needs attention?',
  'List top performers',
  'What assignments are due?',
];

export default function AIChatBot({ open, onToggle }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hey! I\'m your AI assistant. Ask me about students, attendance, or anything about your class!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (msg) => {
    const text = msg || input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:5001/api/chatbot', { message: text });
      setMessages((prev) => [...prev, { role: 'bot', text: res.data.reply || 'No response' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: "Can't reach the AI server right now. Here's what I can help with: attendance, grades, student info." }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-80 lg:w-96 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(168,85,247,0.3)] border border-purple-500/25"
            style={{ background: 'rgba(20,10,40,0.95)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)' }}
          >
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-gradient-to-r from-purple-600/40 to-pink-600/30">
              <h3 className="font-bold text-white flex items-center gap-2">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2.5 h-2.5 rounded-full bg-emerald-400"
                />
                <span className="glow-text">AI Assistant</span>
              </h3>
              <motion.button
                whileHover={{ rotate: 90 }}
                onClick={onToggle}
                className="text-white/60 hover:text-white transition-all text-xl"
              >
                &times;
              </motion.button>
            </div>

            <div className="h-72 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-md shadow-lg'
                      : 'bg-white/10 text-purple-100 rounded-bl-md border border-white/10'
                  }`}>
                    {msg.role === 'bot' && (
                      <motion.span
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="mr-1"
                      >
                        🤖
                      </motion.span>
                    )}
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                    <div className="flex gap-1.5">
                      {[0, 0.15, 0.3].map((d, i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: d }}
                          className="w-2 h-2 bg-purple-400 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {!loading && messages.length === 1 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {SUGGESTIONS.map((s, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSend(s)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 border border-purple-500/20 text-purple-200 text-xs hover:bg-purple-500/20 transition-all"
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="p-3 border-t border-white/10 bg-black/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
                  placeholder="Ask about students..."
                  className="flex-1 p-2.5 rounded-xl bg-white/10 border border-purple-500/30 text-white placeholder-purple-300/40 text-sm focus:outline-none focus:border-pink-500/50 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend()}
                  disabled={loading}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 shadow-lg"
                >
                  ➤
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggle}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white text-2xl flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.5)] pulse-glow-fast"
          >
            💬
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
