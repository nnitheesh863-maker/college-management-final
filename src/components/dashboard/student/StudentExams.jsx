import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiPlay, FiCheckCircle, FiBarChart2 } from 'react-icons/fi';
import { getExams, startExam } from '../../../services/exams';
import StatusBadge from '../../ui/StatusBadge';
import ExamInterface from './ExamInterface';
import ExamResults from './ExamResults';

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function StudentExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeExam, setActiveExam] = useState(null);
  const [examSession, setExamSession] = useState(null);
  const [viewResults, setViewResults] = useState(false);

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getExams();
      setExams(data);
    } catch (_) { console.warn(_); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchExams(); }, [fetchExams]);

  async function handleStart(examId) {
    try {
      const { submission, remaining } = await startExam(examId);
      setActiveExam(examId);
      setExamSession({ submission, remaining, examId });
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  }

  function handleFinish() {
    setActiveExam(null);
    setExamSession(null);
    fetchExams();
  }

  if (activeExam && examSession) {
    return <ExamInterface session={examSession} onFinish={handleFinish} />;
  }

  if (viewResults) {
    return <ExamResults onBack={() => setViewResults(false)} />;
  }

  if (loading) {
    return <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 rounded-xl bg-white/[0.04] animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold gradient-text-blue">📝 Exams</h2>
        <button onClick={() => setViewResults(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-semibold hover:bg-accent-500/20 transition-all"
        >
          <FiBarChart2 className="w-3 h-3" /> My Results
        </button>
      </div>

      {exams.length === 0 && (
        <div className="flex flex-col items-center py-16 text-white/30">
          <FiClock className="w-10 h-10 mb-3" />
          <p className="text-sm">No exams available</p>
        </div>
      )}

      <div className="space-y-3">
        {exams.map((exam, i) => {
          const isSubmitted = exam.submission?.status === 'submitted';
          const isInProgress = exam.submission?.status === 'in-progress';
          return (
            <motion.div key={exam._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="rounded-xl border bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12] transition-all p-4 sm:p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <h3 className="font-semibold text-white text-sm truncate">{exam.title}</h3>
                    {isSubmitted ? (
                      <StatusBadge status="submitted">Completed</StatusBadge>
                    ) : isInProgress ? (
                      <StatusBadge status="warning">In Progress</StatusBadge>
                    ) : (
                      <StatusBadge status={exam.status === 'published' ? 'info' : 'neutral'}>{exam.status}</StatusBadge>
                    )}
                  </div>
                  <p className="text-white/40 text-xs mb-1">{exam.subject} · Grade {exam.grade}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/30">
                    <span className="flex items-center gap-1"><FiClock className="w-3 h-3" /> {exam.duration} min</span>
                    <span>{exam.totalMarks} marks</span>
                    {exam.startTime && <span>Starts: {formatDate(exam.startTime)}</span>}
                  </div>
                  {exam.description && <p className="text-xs text-white/50 mt-2 line-clamp-2">{exam.description}</p>}

                  {isSubmitted && exam.submission && (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <FiCheckCircle className="w-3 h-3 text-emerald-400" />
                        <span className="text-xs font-semibold text-emerald-300">{exam.submission.obtainedMarks}/{exam.submission.totalMarks}</span>
                      </div>
                      <span className="text-xs text-white/30">Score: {exam.submission.percentage}%</span>
                    </div>
                  )}
                </div>

                <div className="flex-shrink-0 flex items-center gap-2">
                  {isSubmitted ? (
                    <span className="text-xs text-white/30">Submitted</span>
                  ) : isInProgress ? (
                    <button onClick={() => handleStart(exam._id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-all"
                    >
                      <FiPlay className="w-3 h-3" /> Resume
                    </button>
                  ) : (
                    <button onClick={() => handleStart(exam._id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-semibold hover:bg-accent-500/20 transition-all"
                    >
                      <FiPlay className="w-3 h-3" /> Start
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
