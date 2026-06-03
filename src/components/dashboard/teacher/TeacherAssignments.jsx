import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus, FiFile, FiX, FiSend, FiStar, FiClock,
  FiUsers, FiCheckCircle, FiExternalLink, FiTrash2, FiMessageSquare,
} from 'react-icons/fi';
import {
  getAssignments, createAssignment, getSubmissions,
  gradeSubmission, deleteAssignment,
} from '../../../services/assignments';
import GlassCard from '../../ui/GlassCard';
import StatusBadge from '../../ui/StatusBadge';

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [subLoading, setSubLoading] = useState(false);
  const [grading, setGrading] = useState(null);
  const [error, setError] = useState('');

  // Create form
  const [form, setForm] = useState({ title: '', description: '', subject: '', dueDate: '', grade: '10' });
  const [formFile, setFormFile] = useState(null);
  const [creating, setCreating] = useState(false);

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAssignments();
      setAssignments(data);
    } catch {
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAssignments(); }, [fetchAssignments]);

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.title || !form.subject || !form.dueDate || !form.grade) {
      setError('Fill in all required fields');
      return;
    }
    setCreating(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('subject', form.subject);
      fd.append('dueDate', form.dueDate);
      fd.append('grade', form.grade);
      if (formFile) fd.append('file', formFile);

      await createAssignment(fd);
      setShowCreate(false);
      setForm({ title: '', description: '', subject: '', dueDate: '', grade: '10' });
      setFormFile(null);
      await fetchAssignments();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Creation failed');
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this assignment and all submissions?')) return;
    try {
      await deleteAssignment(id);
      if (showSubmissions === id) setShowSubmissions(null);
      await fetchAssignments();
    } catch (err) {
      setError(err.message);
    }
  }

  async function openSubmissions(assignmentId) {
    setShowSubmissions(assignmentId);
    setSubLoading(true);
    try {
      const data = await getSubmissions(assignmentId);
      setSubmissions(data);
    } catch {
      setError('Failed to load submissions');
    } finally {
      setSubLoading(false);
    }
  }

  async function handleGrade(submissionId) {
    if (grading?.marks === undefined || grading?.marks === null) return;
    try {
      await gradeSubmission(submissionId, Number(grading.marks), grading.feedback || '');
      setGrading(null);
      if (showSubmissions) openSubmissions(showSubmissions);
      await fetchAssignments();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }

  const sorted = [...assignments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold gradient-text">📚 Assignment Management</h2>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-semibold hover:bg-accent-500/20 transition-all"
        >
          <FiPlus className="w-3.5 h-3.5" /> Create
        </motion.button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">{error}</div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-surface-900/95 backdrop-blur-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <h3 className="text-sm font-semibold text-white">New Assignment</h3>
                <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06]">
                  <FiX className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <input
                  placeholder="Assignment Title *"
                  className="input-glass"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <textarea
                  placeholder="Description"
                  className="input-glass h-24 resize-none"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Subject *"
                    className="input-glass"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  />
                  <input
                    type="date"
                    className="input-glass"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select className="input-glass" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })}>
                    {[9, 10, 11, 12].map((g) => <option key={g} value={String(g)}>Grade {g}</option>)}
                  </select>
                  <label className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-white/[0.12] hover:border-accent-500/40 bg-white/[0.02] cursor-pointer transition-all text-xs text-white/30 hover:text-white/50">
                    <FiFile className="w-4 h-4" />
                    {formFile ? formFile.name : 'Reference file (optional)'}
                    <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" className="hidden" onChange={(e) => setFormFile(e.target.files[0])} />
                  </label>
                </div>
                <button type="submit" disabled={creating}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {creating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSend className="w-4 h-4" />}
                  {creating ? 'Creating...' : 'Create Assignment'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grading Modal */}
      <AnimatePresence>
        {grading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setGrading(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-surface-900/95 backdrop-blur-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <h3 className="text-sm font-semibold text-white">Grade Submission</h3>
                <button onClick={() => setGrading(null)} className="p-1 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06]">
                  <FiX className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-xs text-white/50">
                  Student: <span className="text-white font-medium">{grading?.studentName}</span>
                </p>
                <div>
                  <label className="text-[11px] text-white/40 font-semibold uppercase tracking-wider block mb-1.5">Marks</label>
                  <input
                    type="number"
                    placeholder="Enter marks"
                    className="input-glass"
                    value={grading?.marks ?? ''}
                    onChange={(e) => setGrading({ ...grading, marks: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-white/40 font-semibold uppercase tracking-wider block mb-1.5">Feedback</label>
                  <textarea
                    placeholder="Optional feedback"
                    className="input-glass h-20 resize-none"
                    value={grading?.feedback || ''}
                    onChange={(e) => setGrading({ ...grading, feedback: e.target.value })}
                  />
                </div>
                <button onClick={() => handleGrade(grading.submissionId)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <FiStar className="w-4 h-4" /> Save Grade
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assignment List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-white/[0.04] border border-white/[0.06] animate-pulse" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-white/30">
          <FiFile className="w-10 h-10 mb-3" />
          <p className="text-sm">No assignments created yet</p>
          <button onClick={() => setShowCreate(true)} className="mt-3 text-xs text-accent-400 hover:text-accent-300 transition-colors">
            Create your first assignment →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((a, i) => (
            <motion.div
              key={a._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl border bg-white/[0.03] border-white/[0.06] overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer hover:bg-white/[0.02] transition-all"
                onClick={() => openSubmissions(a._id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white text-sm truncate">{a.title}</h3>
                      <span className="text-[10px] text-white/30 bg-white/[0.06] px-2 py-0.5 rounded-full">{a.subject}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/30">
                      <span className="flex items-center gap-1"><FiClock className="w-3 h-3" /> Due: {formatDate(a.dueDate)}</span>
                      <span className="flex items-center gap-1"><FiUsers className="w-3 h-3" /> Grade {a.grade}</span>
                      <span className="font-medium text-accent-300">{a.submissionCount || 0} submissions</span>
                      {a.gradedCount > 0 && (
                        <span className="text-emerald-400">{a.gradedCount} graded</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(a._id); }}
                    className="flex-shrink-0 p-1.5 rounded-lg text-white/20 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    title="Delete"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Submissions panel */}
              <AnimatePresence>
                {showSubmissions === a._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/[0.06] bg-white/[0.02]"
                  >
                    <div className="p-4">
                      {subLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="w-5 h-5 border-2 border-accent-500/30 border-t-accent-500 rounded-full animate-spin" />
                        </div>
                      ) : submissions.length === 0 ? (
                        <div className="flex flex-col items-center py-8 text-white/30">
                          <FiUsers className="w-6 h-6 mb-2" />
                          <p className="text-xs">No submissions yet</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {submissions.map((s) => (
                            <div
                              key={s._id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-white truncate">
                                    {s.studentId?.userId?.name || 'Student'}
                                  </span>
                                  <StatusBadge status={s.status}>
                                    {s.status === 'late' ? 'Late' : 'On Time'}
                                  </StatusBadge>
                                  {s.marks !== null && (
                                    <span className="text-xs font-semibold text-emerald-400">{s.marks} pts</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 mt-0.5">
                                  <span className="text-[11px] text-white/30">{s.fileName}</span>
                                  <span className="text-[11px] text-white/20">|</span>
                                  <span className="text-[11px] text-white/30">{formatDate(s.createdAt)}</span>
                                </div>
                                {s.feedback && (
                                  <p className="text-[11px] text-blue-200/60 mt-1 flex items-center gap-1">
                                    <FiMessageSquare className="w-3 h-3" /> {s.feedback}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {s.fileUrl && (
                                  <a
                                    href={s.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg text-white/30 hover:text-accent-400 hover:bg-accent-500/10 transition-all"
                                    title="View file"
                                  >
                                    <FiExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                {s.marks === null && (
                                  <button
                                    onClick={() => setGrading({
                                      submissionId: s._id,
                                      studentName: s.studentId?.userId?.name || 'Student',
                                      marks: '',
                                      feedback: '',
                                    })}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-semibold hover:bg-accent-500/20 transition-all"
                                  >
                                    <FiStar className="w-3 h-3" /> Grade
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
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
    </div>
  );
}
