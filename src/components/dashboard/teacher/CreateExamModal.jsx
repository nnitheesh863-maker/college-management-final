import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiPlus, FiTrash2, FiSend } from 'react-icons/fi';
import { createExam } from '../../../services/exams';

export default function CreateExamModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ title: '', description: '', subject: '', grade: '10', duration: '60', shuffleQuestions: false });
  const [questions, setQuestions] = useState([{ type: 'mcq', questionText: '', options: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }], correctAnswer: '0', marks: '5' }]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  function addQuestion() {
    setQuestions(prev => [...prev, { type: 'mcq', questionText: '', options: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }], correctAnswer: '0', marks: '5' }]);
  }

  function removeQuestion(i) {
    if (questions.length <= 1) return;
    setQuestions(prev => prev.filter((_, idx) => idx !== i));
  }

  function updateQuestion(i, field, value) {
    setQuestions(prev => prev.map((q, idx) => idx === i ? { ...q, [field]: value } : q));
  }

  function updateOption(qIdx, oIdx, value) {
    setQuestions(prev => prev.map((q, idx) => {
      if (idx !== qIdx) return q;
      const options = q.options.map((o, oi) => oi === oIdx ? { ...o, text: value } : o);
      return { ...q, options };
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.subject || !form.duration) {
      setError('Title, subject, and duration are required');
      return;
    }
    for (const q of questions) {
      if (!q.questionText) { setError('All questions need text'); return; }
      if (q.type === 'mcq' && q.options.some(o => !o.text)) { setError('All MCQ options need text'); return; }
    }

    setCreating(true);
    setError('');
    try {
      await createExam({
        ...form,
        duration: Number(form.duration),
        questions: questions.map(q => ({
          ...q,
          marks: Number(q.marks),
          correctAnswer: q.type === 'mcq' ? q.correctAnswer : '',
        })),
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally { setCreating(false); }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl my-8 rounded-2xl border border-white/[0.08] bg-surface-900/95 backdrop-blur-2xl shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] sticky top-0 bg-surface-900/95 z-10">
          <h3 className="text-sm font-semibold text-white">Create Exam</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-white/30 hover:text-white"><FiX className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">{error}</div>}

          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Exam Title *" className="input-glass col-span-2" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} />
            <textarea placeholder="Description" className="input-glass h-20 resize-none col-span-2" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
            <input placeholder="Subject *" className="input-glass" value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })} />
            <select className="input-glass" value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })}>
              {[9,10,11,12].map(g => <option key={g} value={String(g)}>Grade {g}</option>)}
            </select>
            <input type="number" placeholder="Duration (min) *" className="input-glass" value={form.duration}
              onChange={e => setForm({ ...form, duration: e.target.value })} />
            <label className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs text-white/50 cursor-pointer">
              <input type="checkbox" checked={form.shuffleQuestions} onChange={e => setForm({ ...form, shuffleQuestions: e.target.checked })}
                className="accent-accent-500" />
              Shuffle questions
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Questions ({questions.length})</h4>
              <button type="button" onClick={addQuestion}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-semibold hover:bg-accent-500/20 transition-all"
              ><FiPlus className="w-3 h-3" /> Add</button>
            </div>

            <div className="space-y-4">
              {questions.map((q, qi) => (
                <div key={qi} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-xs font-semibold text-white/30 bg-white/[0.06] px-2 py-0.5 rounded">Q{qi + 1}</span>
                    <div className="flex items-center gap-2">
                      <select className="text-[11px] bg-white/[0.06] border border-white/[0.08] rounded-lg px-2 py-1 text-white/60"
                        value={q.type} onChange={e => updateQuestion(qi, 'type', e.target.value)}
                      >
                        <option value="mcq">MCQ</option><option value="descriptive">Descriptive</option>
                      </select>
                      <input type="number" placeholder="Marks" className="text-[11px] bg-white/[0.06] border border-white/[0.08] rounded-lg px-2 py-1 w-16 text-white/60"
                        value={q.marks} onChange={e => updateQuestion(qi, 'marks', e.target.value)} />
                      <button type="button" onClick={() => removeQuestion(qi)} className="p-1 rounded text-white/20 hover:text-rose-400 transition-all">
                        <FiTrash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <textarea placeholder="Question text *" className="input-glass h-16 resize-none text-sm mb-3"
                    value={q.questionText} onChange={e => updateQuestion(qi, 'questionText', e.target.value)} />

                  {q.type === 'mcq' && (
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <input type="radio" name={`correct-${qi}`} checked={q.correctAnswer === String(oi)}
                            onChange={() => updateQuestion(qi, 'correctAnswer', String(oi))}
                            className="accent-accent-500" />
                          <span className="text-xs text-white/40 w-4">{String.fromCharCode(65 + oi)}.</span>
                          <input placeholder={`Option ${String.fromCharCode(65 + oi)} *`}
                            className="flex-1 text-xs bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-white/70 placeholder:text-white/20"
                            value={opt.text} onChange={e => updateOption(qi, oi, e.target.value)} />
                        </div>
                      ))}
                      <p className="text-[10px] text-white/20 mt-1">Selected radio = correct answer</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={creating}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {creating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSend className="w-4 h-4" />}
            {creating ? 'Creating...' : 'Create Exam'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
