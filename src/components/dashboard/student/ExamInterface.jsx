import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiAlertTriangle, FiCheckCircle, FiChevronLeft, FiChevronRight, FiSend } from 'react-icons/fi';
import { getExam, saveExamProgress, submitExam } from '../../../services/exams';

export default function ExamInterface({ session, onFinish }) {
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(session.remaining);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const autoSubmitRef = useRef(false);
  const saveIntervalRef = useRef(null);

  const loadExam = useCallback(async () => {
    try {
      const data = await getExam(session.examId);
      setExam(data.exam);
      setQuestions(data.questions);
      if (session.submission?.answers) {
        setAnswers(session.submission.answers);
      } else {
        setAnswers(data.questions.map(q => ({
          questionId: q._id,
          selectedOption: '',
          textAnswer: '',
        })));
      }
    } catch (_) { console.warn(_); }
  }, [session]);

  useEffect(() => { loadExam(); }, [loadExam]);

  const handleAutoSubmitRef = useRef(null);
  handleAutoSubmitRef.current = async () => {
    if (submitted) return;
    setSubmitting(true);
    try {
      const res = await submitExam(session.examId, answers);
      setResult(res);
      setSubmitted(true);
      setTimeout(() => onFinish(), 4000);
    } catch (_) { console.warn(_); } finally { setSubmitting(false); }
  };

  // Timer
  useEffect(() => {
    if (submitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          autoSubmitRef.current = true;
          handleAutoSubmitRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted, timeLeft]);

  const handleSaveRef = useRef(null);
  handleSaveRef.current = async () => {
    try {
      await saveExamProgress(session.examId, answers);
    } catch (_) { console.warn(_); }
  };

  // Auto-save every 30s
  useEffect(() => {
    saveIntervalRef.current = setInterval(() => {
      if (!submitted) handleSaveRef.current();
    }, 30000);
    return () => clearInterval(saveIntervalRef.current);
  }, [submitted]);

  // Anti-refresh warning
  useEffect(() => {
    const handler = (e) => {
      if (!submitted) {
        e.preventDefault();
        e.returnValue = 'Your exam is in progress. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [submitted]);

  async function handleSubmit() {
    setConfirmSubmit(false);
    setSubmitting(true);
    try {
      await handleSaveRef.current();
      const res = await submitExam(session.examId, answers);
      setResult(res);
      setSubmitted(true);
      setTimeout(() => onFinish(), 3000);
    } catch (_) { console.warn(_); } finally { setSubmitting(false); }
  }

  function updateAnswer(qId, field, value) {
    setAnswers(prev => prev.map(a =>
      a.questionId === qId ? { ...a, [field]: value } : a
    ));
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  const current = questions[currentIndex];
  const answeredCount = answers.filter(a =>
    a.selectedOption || a.textAnswer?.trim()
  ).length;
  const timerWarning = timeLeft < 120;

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
          className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4"
        >
          <FiCheckCircle className="w-8 h-8 text-emerald-400" />
        </motion.div>
        <h2 className="text-xl font-bold text-white mb-2">Exam Submitted!</h2>
        {result && (
          <div className="text-center">
            <p className="text-3xl font-bold gradient-text mb-1">{result.obtainedMarks}/{result.totalMarks}</p>
            <p className="text-white/50 text-sm">{result.percentage}% Score</p>
            <p className="text-xs text-white/30 mt-1">Time taken: {formatTime(result.timeTaken)}</p>
          </div>
        )}
        <p className="text-white/30 text-sm mt-4">Redirecting to dashboard...</p>
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-accent-500/30 border-t-accent-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-surface-900/80 border border-white/[0.06] backdrop-blur-xl sticky top-4 z-10">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">{exam.title}</h3>
          <p className="text-[11px] text-white/30">{exam.subject}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${timerWarning ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse' : 'bg-white/[0.06] text-white/60'}`}>
            <FiClock className="w-3.5 h-3.5" />
            {formatTime(timeLeft)}
          </div>
          <span className="text-xs text-white/30">{answeredCount}/{questions.length}</span>
          <button onClick={() => setConfirmSubmit(true)} disabled={submitting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-semibold hover:bg-accent-500/20 transition-all disabled:opacity-50"
          >
            {submitting ? <div className="w-3.5 h-3.5 border-2 border-accent-500/30 border-t-accent-500 rounded-full animate-spin" /> : <FiSend className="w-3.5 h-3.5" />}
            Submit
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Question nav sidebar */}
        <div className="hidden sm:flex flex-col gap-1.5 w-20 flex-shrink-0">
          {questions.map((q, i) => {
            const ans = answers.find(a => a.questionId === q._id);
            const isAnswered = ans && (ans.selectedOption || ans.textAnswer?.trim());
            return (
              <button key={q._id} onClick={() => setCurrentIndex(i)}
                className={`w-full py-2 rounded-lg text-xs font-semibold text-center border transition-all
                  ${i === currentIndex ? 'bg-accent-500/15 border-accent-500/30 text-accent-300' :
                    isAnswered ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' :
                    'bg-white/[0.03] border-white/[0.06] text-white/30 hover:text-white/50'}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        {/* Main question area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border bg-white/[0.03] border-white/[0.06] p-5 sm:p-6"
            >
              {current && (
                <>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <span className="px-2 py-0.5 rounded bg-white/[0.06] font-semibold">Q{currentIndex + 1}/{questions.length}</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.06] capitalize">{current.type}</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.06]">{current.marks} mark{current.marks > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-white/90 font-medium mb-5 leading-relaxed">{current.questionText}</p>

                  {current.type === 'mcq' ? (
                    <div className="space-y-2.5">
                      {current.options.map((opt, oi) => {
                        const ans = answers.find(a => a.questionId === current._id);
                        const selected = ans?.selectedOption === String(oi);
                        return (
                          <button key={oi} onClick={() => updateAnswer(current._id, 'selectedOption', String(oi))}
                            className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left text-sm transition-all
                              ${selected ? 'bg-accent-500/15 border-accent-500/30 text-white' :
                                'bg-white/[0.03] border-white/[0.08] text-white/60 hover:bg-white/[0.06] hover:border-white/[0.15]'}`}
                          >
                            <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold
                              ${selected ? 'border-accent-500 bg-accent-500/20 text-accent-300' : 'border-white/20 text-white/30'}`}
                            >
                              {String.fromCharCode(65 + oi)}
                            </span>
                            <span>{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <textarea
                      value={answers.find(a => a.questionId === current._id)?.textAnswer || ''}
                      onChange={(e) => updateAnswer(current._id, 'textAnswer', e.target.value)}
                      placeholder="Type your answer here..."
                      className="input-glass h-40 resize-none"
                    />
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4">
            <button onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))} disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/60 text-xs font-semibold transition-all disabled:opacity-30"
            >
              <FiChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))} disabled={currentIndex === questions.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/60 text-xs font-semibold transition-all disabled:opacity-30"
            >
              Next <FiChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Submit confirmation modal */}
      <AnimatePresence>
        {confirmSubmit && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirmSubmit(false)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-surface-900/95 backdrop-blur-2xl shadow-2xl p-6"
            >
              <FiAlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white text-center mb-2">Submit Exam?</h3>
              <p className="text-sm text-white/50 text-center mb-1">
                You have answered <span className="text-white font-semibold">{answeredCount}</span> of {questions.length} questions.
              </p>
              <p className="text-xs text-white/30 text-center mb-5">Unanswered questions will receive 0 marks.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmSubmit(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.06] text-white/60 text-sm font-semibold hover:bg-white/[0.10] transition-all"
                >Continue Exam</button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-300 text-sm font-semibold hover:bg-accent-500/20 transition-all disabled:opacity-50"
                >{submitting ? 'Submitting...' : 'Submit Now'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
