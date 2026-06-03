import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBarChart2, FiChevronLeft, FiClock, FiCheckCircle } from 'react-icons/fi';
import { getMyResults } from '../../../services/exams';
import StatusBadge from '../../ui/StatusBadge';

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ExamResults({ onBack }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyResults().then(setResults).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-xl bg-white/[0.04] animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
          <FiChevronLeft className="w-4 h-4" />
        </button>
        <h2 className="text-lg font-bold gradient-text-blue"><FiBarChart2 className="inline w-5 h-5 mr-2" />My Exam Results</h2>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-white/30">
          <FiBarChart2 className="w-10 h-10 mb-3" />
          <p className="text-sm">No exam results yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((r, i) => (
            <motion.div key={r._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-xl border bg-white/[0.03] border-white/[0.06] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white text-sm truncate">{r.examId?.title || 'Exam'}</h4>
                  <p className="text-xs text-white/40">{r.examId?.subject} · {r.examId?.totalMarks} marks</p>
                  <p className="text-[11px] text-white/30 mt-0.5">Submitted: {formatDate(r.submittedAt)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-bold gradient-text">{r.obtainedMarks}/{r.totalMarks}</p>
                  <div className="mt-1">
                    <StatusBadge status={r.percentage >= 50 ? 'submitted' : r.percentage >= 35 ? 'warning' : 'missed'}>
                      {r.percentage}%
                    </StatusBadge>
                  </div>
                </div>
              </div>
              <div className="mt-3 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${r.percentage}%` }}
                  className={`h-full rounded-full ${r.percentage >= 50 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : r.percentage >= 35 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-rose-500 to-pink-500'}`}
                />
              </div>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-white/30">
                <span className="flex items-center gap-1"><FiClock className="w-3 h-3" /> {Math.floor(r.timeTaken / 60)}m {r.timeTaken % 60}s</span>
                <span className="flex items-center gap-1"><FiCheckCircle className="w-3 h-3" /> {r.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
