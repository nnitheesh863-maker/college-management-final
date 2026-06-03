import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiClock, FiUsers, FiBarChart2, FiTrash2, FiSend, FiChevronDown, FiChevronUp, FiStar } from 'react-icons/fi';
import { getExams, publishExam, deleteExam, getExamSubmissions, gradeDescriptive } from '../../../services/exams';
import StatusBadge from '../../ui/StatusBadge';
import CreateExamModal from './CreateExamModal';
import ExamAnalytics from './ExamAnalytics';

export default function TeacherExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [expandedExam, setExpandedExam] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [subLoading, setSubLoading] = useState(false);
  const [grading, setGrading] = useState(null);
  const [error, setError] = useState('');

  const fetchExams = useCallback(async () => {
    try { setLoading(true); const d = await getExams(); setExams(d); }
    catch (_) { console.warn(_); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchExams(); }, [fetchExams]);

  async function handlePublish(id) {
    try { await publishExam(id); fetchExams(); }
    catch (e) { setError(e.message); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this exam and all submissions?')) return;
    try { await deleteExam(id); if (expandedExam === id) setExpandedExam(null); fetchExams(); }
    catch (e) { setError(e.message); }
  }

  async function openSubmissions(examId) {
    setExpandedExam(examId);
    setSubLoading(true);
    try { const d = await getExamSubmissions(examId); setSubmissions(d); }
    catch (_) { console.warn(_); } finally { setSubLoading(false); }
  }

  async function handleGrade(submissionId) {
    if (!grading) return;
    try {
      const answers = Object.entries(grading.scores).map(([qId, marks]) => ({
        questionId: qId, marksObtained: Number(marks),
      }));
      await gradeDescriptive(submissionId, answers);
      setGrading(null);
      if (expandedExam) openSubmissions(expandedExam);
    } catch (e) { setError(e.message); }
  }

  if (showAnalytics) return <ExamAnalytics onBack={() => setShowAnalytics(false)} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold gradient-text">📝 Exam Management</h2>
        <div className="flex gap-2">
          <button onClick={() => setShowAnalytics(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/50 text-xs font-semibold hover:text-white transition-all"
          >
            <FiBarChart2 className="w-3.5 h-3.5" /> Analytics
          </button>
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-semibold hover:bg-accent-500/20 transition-all"
          >
            <FiPlus className="w-3.5 h-3.5" /> Create Exam
          </button>
        </div>
      </div>

      {error && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">{error}</div>}

      {showCreate && <CreateExamModal onClose={() => setShowCreate(false)} onCreated={fetchExams} />}

      {loading ? (
        <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-20 rounded-xl bg-white/[0.04] animate-pulse" />)}</div>
      ) : exams.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-white/30">
          <FiClock className="w-10 h-10 mb-3" />
          <p className="text-sm">No exams created yet</p>
          <button onClick={() => setShowCreate(true)} className="mt-3 text-xs text-accent-400 hover:text-accent-300">Create your first exam →</button>
        </div>
      ) : (
        <div className="space-y-3">
          {exams.map((exam, i) => (
            <motion.div key={exam._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="rounded-xl border bg-white/[0.03] border-white/[0.06] overflow-hidden"
            >
              <div className="p-4 cursor-pointer hover:bg-white/[0.02] transition-all" onClick={() => openSubmissions(exam._id)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white text-sm truncate">{exam.title}</h3>
                      <StatusBadge status={exam.status === 'published' ? 'info' : exam.status === 'completed' ? 'submitted' : 'neutral'}>
                        {exam.status}
                      </StatusBadge>
                    </div>
                    <p className="text-xs text-white/40">{exam.subject} · Grade {exam.grade}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/30 mt-1">
                      <span className="flex items-center gap-1"><FiClock className="w-3 h-3" /> {exam.duration} min</span>
                      <span>{exam.totalMarks} marks</span>
                      <span className="flex items-center gap-1"><FiUsers className="w-3 h-3" /> {exam.submissionCount || 0} submitted</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {exam.status === 'draft' && (
                      <button onClick={(e) => { e.stopPropagation(); handlePublish(exam._id); }}
                        className="p-2 rounded-lg text-accent-400 hover:bg-accent-500/10 transition-all" title="Publish"
                      ><FiSend className="w-3.5 h-3.5" /></button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(exam._id); }}
                      className="p-2 rounded-lg text-white/20 hover:text-rose-400 hover:bg-rose-500/10 transition-all" title="Delete"
                    ><FiTrash2 className="w-3.5 h-3.5" /></button>
                    <span>{expandedExam === exam._id ? <FiChevronUp className="w-4 h-4 text-white/30" /> : <FiChevronDown className="w-4 h-4 text-white/30" />}</span>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedExam === exam._id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/[0.06] bg-white/[0.02]"
                  >
                    <div className="p-4">
                      {subLoading ? (
                        <div className="flex justify-center py-8"><div className="w-5 h-5 border-2 border-accent-500/30 border-t-accent-500 rounded-full animate-spin" /></div>
                      ) : submissions.length === 0 ? (
                        <div className="flex flex-col items-center py-8 text-white/30"><FiUsers className="w-6 h-6 mb-2" /><p className="text-xs">No submissions</p></div>
                      ) : (
                        <div className="space-y-2">
                          {submissions.map((s) => {
                            const hasDescriptive = s.answers?.some(a => a.marksObtained === 0 && a.textAnswer);
                            return (
                              <div key={s._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-white truncate">{s.studentId?.userId?.name || 'Student'}</span>
                                    <StatusBadge status={s.status}>{s.status}</StatusBadge>
                                    <span className="text-xs font-semibold text-emerald-400">{s.obtainedMarks}/{s.totalMarks}</span>
                                  </div>
                                  <p className="text-[11px] text-white/30 mt-0.5">Score: {s.percentage}% · Time: {Math.floor(s.timeTaken / 60)}m {s.timeTaken % 60}s</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {hasDescriptive && s.status !== 'graded' && (
                                    <button onClick={(e) => { e.stopPropagation(); setGrading({ submissionId: s._id, answers: s.answers, studentName: s.studentId?.userId?.name || 'Student' }); }}
                                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-semibold hover:bg-accent-500/20 transition-all"
                                    ><FiStar className="w-3 h-3" /> Grade</button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Grading modal for descriptive questions */}
      <AnimatePresence>
        {grading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setGrading(null)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl border border-white/[0.08] bg-surface-900/95 backdrop-blur-2xl shadow-2xl"
            >
              <div className="p-5 border-b border-white/[0.06] flex items-center justify-between sticky top-0 bg-surface-900/95">
                <h3 className="text-sm font-semibold text-white">Grade: {grading.studentName}</h3>
                <button onClick={() => setGrading(null)} className="p-1 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06]"><FiTrash2 className="w-4 h-4" /></button>
              </div>
              <div className="p-5 space-y-4">
                {grading.answers.filter(a => a.textAnswer).map((ans, i) => {
                  const val = grading.scores?.[ans.questionId] ?? 0;
                  return (
                    <div key={ans.questionId} className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                      <p className="text-xs text-white/40 mb-2">Question {i + 1} (Descriptive)</p>
                      <p className="text-sm text-white/80 mb-3 whitespace-pre-wrap line-clamp-4">{ans.textAnswer}</p>
                      <div className="flex items-center gap-3">
                        <label className="text-xs text-white/50">Marks:</label>
                        <input type="number" className="input-glass w-24" value={val}
                          onChange={(e) => setGrading(prev => ({ ...prev, scores: { ...prev.scores, [ans.questionId]: e.target.value } }))}
                        />
                      </div>
                    </div>
                  );
                })}
                <button onClick={() => handleGrade(grading.submissionId)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                ><FiStar className="w-4 h-4" /> Save Grades</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
