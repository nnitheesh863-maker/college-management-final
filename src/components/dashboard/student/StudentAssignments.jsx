import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiFile, FiCheckCircle, FiClock, FiX, FiExternalLink, FiMessageSquare } from 'react-icons/fi';
import { getAssignments, submitAssignment } from '../../../services/assignments';
import GlassCard from '../../ui/GlassCard';
import StatusBadge from '../../ui/StatusBadge';

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

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

  async function handleSubmit(assignmentId) {
    if (!selectedFile) return;
    setUploading(assignmentId);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      await submitAssignment(assignmentId, formData);
      setSelectedFile(null);
      document.getElementById('file-input-' + assignmentId)?.click(); // reset
      await fetchAssignments();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setUploading(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-white/[0.04] border border-white/[0.06] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold gradient-text-blue">📚 My Assignments</h2>
        <span className="text-xs text-white/40">{assignments.length} total</span>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">{error}</div>
      )}

      {assignments.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-white/30">
          <FiFile className="w-10 h-10 mb-3" />
          <p className="text-sm">No assignments yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((a, i) => {
            const isPending = !a.submission;
            const isLate = a.submission?.status === 'late';
            const isSubmitted = !!a.submission;
            const deadlinePassed = a.deadlinePassed;

            return (
              <motion.div
                key={a._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12] transition-all overflow-hidden"
              >
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <h3 className="font-semibold text-white text-sm truncate">{a.title}</h3>
                        <StatusBadge status={isSubmitted ? (isLate ? 'late' : 'submitted') : (deadlinePassed ? 'missed' : 'pending')}>
                          {isSubmitted ? (isLate ? 'Late' : 'Submitted') : (deadlinePassed ? 'Missed' : 'Pending')}
                        </StatusBadge>
                      </div>
                      <p className="text-white/40 text-xs mb-1">{a.subject}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/30">
                        <span className="flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          Due: {formatDate(a.dueDate)}
                        </span>
                        {deadlinePassed && !isSubmitted && (
                          <span className="text-rose-400/70 font-medium">Deadline passed</span>
                        )}
                      </div>

                      {a.description && (
                        <p className="text-xs text-white/50 mt-2 line-clamp-2">{a.description}</p>
                      )}

                      {/* Grade & Feedback */}
                      {a.submission?.marks !== null && a.submission?.marks !== undefined && (
                        <div className="mt-3 flex flex-wrap gap-4">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <FiCheckCircle className="w-3 h-3 text-emerald-400" />
                            <span className="text-xs font-semibold text-emerald-300">Marks: {a.submission.marks}</span>
                          </div>
                          {a.submission.feedback && (
                            <div className="flex items-start gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 max-w-xs">
                              <FiMessageSquare className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-blue-200/80">{a.submission.feedback}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {a.submission?.fileUrl && (
                        <a
                          href={a.submission.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-2 text-[11px] text-accent-400 hover:text-accent-300 transition-colors"
                        >
                          <FiExternalLink className="w-3 h-3" />
                          View submitted file
                        </a>
                      )}
                    </div>

                    {/* Upload area */}
                    {isPending && (
                      <div className="flex-shrink-0 sm:w-48">
                        {uploading === a._id ? (
                          <div className="flex items-center justify-center h-20 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                            <div className="w-5 h-5 border-2 border-accent-500/30 border-t-accent-500 rounded-full animate-spin" />
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center h-20 rounded-lg border-2 border-dashed border-white/[0.12] hover:border-accent-500/40 bg-white/[0.02] cursor-pointer transition-all group">
                            <FiUpload className="w-4 h-4 text-white/30 group-hover:text-accent-400 mb-1" />
                            <span className="text-[10px] text-white/30 group-hover:text-white/50">
                              {selectedFile ? selectedFile.name : 'Upload File'}
                            </span>
                            <input
                              id={`file-input-${a._id}`}
                              type="file"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setSelectedFile(file);
                                  handleSubmit(a._id);
                                }
                              }}
                            />
                          </label>
                        )}
                        {deadlinePassed && (
                          <p className="text-[10px] text-amber-400/60 mt-1 text-center">Late submission</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
