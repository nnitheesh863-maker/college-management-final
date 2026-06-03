import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiX, FiMessageSquare, FiTrash2, FiUser, FiCpu } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { sendQuery, getHistory, clearHistory } from '../../services/chatbot';

const ROLE_SUGGESTIONS = {
  student: [
    { label: 'My attendance summary', icon: '📊' },
    { label: 'My marks in Math', icon: '📝' },
    { label: 'Pending assignments', icon: '📚' },
    { label: 'My fee status', icon: '💰' },
  ],
  teacher: [
    { label: 'Weak students', icon: '⚠️' },
    { label: 'Class performance', icon: '📈' },
    { label: 'Assignment analytics', icon: '📋' },
    { label: 'Class attendance', icon: '✅' },
  ],
  principal: [
    { label: 'Department analytics', icon: '🏛️' },
    { label: 'Revenue report', icon: '💵' },
    { label: 'Attendance trends', icon: '📉' },
    { label: 'College overview', icon: '🎯' },
  ],
  parent: [
    { label: 'My child\'s progress', icon: '👨‍🎓' },
    { label: 'Attendance summary', icon: '📊' },
    { label: 'Fee details', icon: '💰' },
    { label: 'Upcoming events', icon: '📅' },
  ],
};

function TypingDots() {
  return (
    <div className="flex gap-1 items-center px-1">
      {[0, 0.15, 0.3].map((d, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, delay: d, ease: 'easeInOut' }}
          className="w-1.5 h-1.5 rounded-full bg-purple-400"
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg, index }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs ${
        isUser ? 'bg-purple-500/30 text-purple-300' : 'bg-emerald-500/30 text-emerald-300'
      }`}>
        {isUser ? <FiUser size={14} /> : <FiCpu size={14} />}
      </div>
      <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? 'bg-gradient-to-r from-purple-600/90 to-pink-600/90 text-white rounded-tr-md shadow-lg shadow-purple-900/20'
          : 'bg-white/8 text-purple-100 rounded-tl-md border border-white/8 shadow-md'
      }`}>
        <div className="break-words whitespace-pre-wrap">{msg.text}</div>
        {msg.timestamp && (
          <div className={`text-[10px] mt-1.5 ${isUser ? 'text-purple-200/60' : 'text-purple-300/40'}`}>
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function AIChatBot({ open, onToggle }) {
  const { user } = useAuth();
  const role = user?.role || 'student';
  const suggestions = ROLE_SUGGESTIONS[role] || ROLE_SUGGESTIONS.student;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open && !historyLoaded) {
      getHistory().then((msgs) => {
        if (msgs.length === 0) {
          setMessages([{ role: 'bot', text: `Hey ${user?.name || 'there'}! I'm your AI assistant. Ask me anything about your ${role} dashboard — attendance, marks, assignments, and more!`, timestamp: new Date().toISOString() }]);
        } else {
          setMessages(msgs.map((m) => ({ ...m, timestamp: m.timestamp || new Date().toISOString() })));
        }
        setHistoryLoaded(true);
      }).catch(() => {
        setMessages([{ role: 'bot', text: `Hey ${user?.name || 'there'}! I'm your AI assistant. Ask me anything about your ${role} dashboard!`, timestamp: new Date().toISOString() }]);
        setHistoryLoaded(true);
      });
    }
  }, [open, historyLoaded, user, role]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSend = useCallback(async (msg) => {
    const text = (msg || input).trim();
    if (!text || loading) return;

    setInput('');
    setError('');
    setMessages((prev) => [...prev, { role: 'user', text, timestamp: new Date().toISOString() }]);
    setLoading(true);

    try {
      const data = await sendQuery(text);
      setMessages((prev) => [...prev, { role: 'bot', text: data.reply || 'No response', timestamp: new Date().toISOString() }]);
    } catch (err) {
      const errMsg = err?.response?.data?.error || err?.response?.data?.detail || err.message || 'Server unreachable';
      setError(errMsg);
      setMessages((prev) => [...prev, { role: 'bot', text: `Sorry, I encountered an error: ${errMsg}. Please try again.`, timestamp: new Date().toISOString() }]);
    }

    setLoading(false);
  }, [input, loading]);

  const handleClear = useCallback(async () => {
    try {
      await clearHistory();
      setMessages([{ role: 'bot', text: `Conversation cleared. How can I help you?`, timestamp: new Date().toISOString() }]);
    } catch { /* silent */ }
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-[22rem] sm:w-96 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(168,85,247,0.25)] border border-purple-500/20"
            style={{ background: 'rgba(18,8,35,0.96)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-purple-600/30 to-pink-600/20">
              <div className="flex items-center gap-2.5">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                />
                <div>
                  <h3 className="font-semibold text-sm text-white flex items-center gap-1.5">
                    <FiCpu size={14} className="text-purple-400" />
                    AI Assistant
                  </h3>
                  <p className="text-[10px] text-purple-300/50 capitalize">{role} mode</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClear}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
                  title="Clear history"
                >
                  <FiTrash2 size={14} />
                </motion.button>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onToggle}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
                >
                  <FiX size={16} />
                </motion.button>
              </div>
            </div>

            <div className="h-80 overflow-y-auto p-3.5 space-y-3 scrollbar-thin">
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} index={i} />
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500/30 flex items-center justify-center">
                    <FiCpu size={14} className="text-emerald-300" />
                  </div>
                  <div className="bg-white/8 border border-white/8 px-3.5 py-2.5 rounded-2xl rounded-tl-md">
                    <TypingDots />
                  </div>
                </motion.div>
              )}
              {!loading && messages.length <= 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-1.5 mt-3"
                >
                  {suggestions.map((s, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.08 }}
                      whileHover={{ scale: 1.04, backgroundColor: 'rgba(168,85,247,0.15)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSend(s.label)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/8 border border-purple-500/15 text-purple-200 text-xs hover:bg-purple-500/15 transition-all"
                    >
                      <span>{s.icon}</span>
                      <span>{s.label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
              <div ref={endRef} />
            </div>

            <div className="p-3 border-t border-white/10 bg-black/20">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder={`Ask about ${role === 'student' ? 'grades, attendance...' : role === 'teacher' ? 'students, performance...' : role === 'principal' ? 'analytics, revenue...' : 'your child...'}`}
                    disabled={loading}
                    className="w-full p-2.5 pr-10 rounded-xl bg-white/10 border border-purple-500/25 text-white placeholder-purple-300/40 text-sm focus:outline-none focus:border-purple-400/50 transition-all disabled:opacity-50"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-40 shadow-lg flex items-center justify-center"
                >
                  <FiSend size={16} />
                </motion.button>
              </div>
              {error && (
                <p className="text-[10px] text-red-400/70 mt-1.5 px-1">{error}</p>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggle}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)] transition-shadow"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FiMessageSquare size={22} />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
