import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import { FiDollarSign, FiUsers, FiAlertTriangle, FiBell, FiDownload, FiPlus } from 'react-icons/fi';
import { getAnalytics, getAllPayments, sendBulkReminders, createFee } from '../../../services/fees';
import GlassCard from '../../ui/GlassCard';
import StatusBadge from '../../ui/StatusBadge';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];
const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

function CustomTooltip({ active, payload, label }) {
  if (active && payload?.length) {
    return (
      <div className="bg-[#1a1035] border border-purple-500/30 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-white/60 text-xs">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-white font-semibold text-sm">₹{p.value?.toLocaleString('en-IN') || p.value}</p>
        ))}
      </div>
    );
  }
  return null;
}

function CreateFeeModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ studentId: '', userId: '', title: 'Tuition Fee', amount: '', dueDate: '', totalInstallments: 1 });
  const [students, setStudents] = useState([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (open) {
      fetch('http://127.0.0.1:5001/api/principal/dashboard', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then(r => r.json()).then(d => {
        if (d.students) setStudents(d.students);
      }).catch(() => {});
    }
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    setCreating(true);
    try {
      await createFee({ ...form, amount: Number(form.amount), totalInstallments: Number(form.totalInstallments) });
      onCreated();
      onClose();
    } catch (err) {
      console.warn(err);
    } finally {
      setCreating(false);
    }
  }

  if (!open) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-purple-500/20 p-6"
        style={{ background: 'rgba(20,10,40,0.97)', backdropFilter: 'blur(28px)' }}>
        <h3 className="text-lg font-bold text-white mb-4">Create Fee Record</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <select value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-white/10 border border-purple-500/30 text-white text-sm" required>
            <option value="">Select Student</option>
            {students.map(s => (
              <option key={s._id} value={s._id}>{s.name} ({s.rollNo})</option>
            ))}
          </select>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-white/10 border border-purple-500/30 text-white text-sm" placeholder="Fee Title" />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white/10 border border-purple-500/30 text-white text-sm" placeholder="Amount (₹)" required />
            <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white/10 border border-purple-500/30 text-white text-sm [color-scheme:dark]" required />
          </div>
          <div>
            <label className="text-white/40 text-xs mb-1 block">Installments (1 = full payment)</label>
            <input type="number" min="1" max="12" value={form.totalInstallments}
              onChange={e => setForm({ ...form, totalInstallments: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white/10 border border-purple-500/30 text-white text-sm" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 p-2.5 rounded-xl bg-white/10 text-white/70 text-sm hover:bg-white/15 transition-all">Cancel</button>
            <button type="submit" disabled={creating}
              className="flex-1 p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium disabled:opacity-50 transition-all">
              {creating ? 'Creating...' : 'Create Fee'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function AdminFeeAnalytics() {
  const [data, setData] = useState(null);
  const [allPayments, setAllPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [reminding, setReminding] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [a, p] = await Promise.all([getAnalytics(), getAllPayments()]);
      setData(a);
      setAllPayments(p || []);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleRemindAll() {
    setReminding(true);
    try { await sendBulkReminders(); fetchData(); } catch (e) { console.warn(e); } finally { setReminding(false); }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex gap-2">
          {[0, 0.15, 0.3].map((d, i) => (
            <motion.div key={i} animate={{ y: [0, -10, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d }}
              className="w-3 h-3 rounded-full bg-purple-400" />
          ))}
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const pieData = [
    { name: 'Paid', value: stats.paidCount || 0 },
    { name: 'Partial', value: stats.partialCount || 0 },
    { name: 'Unpaid', value: stats.unpaidCount || 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-lg font-bold gradient-text-blue">💰 Fee Analytics & Management</h2>
          <p className="text-white/40 text-xs mt-0.5">Complete payment platform overview</p>
        </motion.div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm hover:from-purple-500 hover:to-pink-500 transition-all">
          <FiPlus size={16} /> Create Fee
        </motion.button>
      </div>

      {data?.alerts && (data.alerts.overdueCount > 0 || data.alerts.dueSoonCount > 0) && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <FiAlertTriangle className="text-amber-400" size={20} />
          <span className="text-amber-200 text-sm">
            {data.alerts.overdueCount} overdue fee(s) &middot; {data.alerts.dueSoonCount} due within 7 days
          </span>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={handleRemindAll} disabled={reminding}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs hover:bg-amber-500/30 transition-all disabled:opacity-50">
            <FiBell size={14} /> {reminding ? 'Sending...' : 'Send Reminders'}
          </motion.button>
        </motion.div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue', value: `₹${(stats.totalCollected || 0).toLocaleString('en-IN')}`, icon: '💰', color: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/30' },
          { label: 'Pending', value: `₹${(stats.totalPending || 0).toLocaleString('en-IN')}`, icon: '⏳', color: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/30' },
          { label: 'Collection Rate', value: `${stats.collectionRate || 0}%`, icon: '📊', color: 'from-blue-500/20 to-cyan-500/10', border: 'border-blue-500/30' },
          { label: 'Total Records', value: stats.totalRecords || 0, icon: '📋', color: 'from-purple-500/20 to-pink-500/10', border: 'border-purple-500/30' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`rounded-xl p-4 border bg-gradient-to-br ${item.color} ${item.border}`}>
            <p className="text-white/40 text-[11px] uppercase tracking-wider">{item.label}</p>
            <p className="text-lg font-bold text-white mt-0.5">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard>
            <h3 className="text-sm font-semibold text-white/80 mb-4">📈 Monthly Revenue</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.revenueByMonth || []}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#7c3aed" fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <GlassCard>
            <h3 className="text-sm font-semibold text-white/80 mb-4">📊 Fee Status Distribution</h3>
            <div className="h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4}
                    dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <GlassCard>
          <h3 className="text-sm font-semibold text-white/80 mb-4">🏫 Grade-wise Fee Collection</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.gradeAnalytics || []}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <XAxis dataKey="grade" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11 }} />
                <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="paid" name="Paid" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="partial" name="Partial" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="unpaid" name="Unpaid" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>

      {allPayments.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <GlassCard>
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h3 className="text-white/80 font-semibold flex items-center gap-2 text-sm">
                <FiDollarSign size={14} /> All Payments
              </h3>
              <span className="text-white/30 text-xs">{allPayments.length} transaction(s)</span>
            </div>
            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] sticky top-0" style={{ background: 'rgba(18,8,35,0.98)' }}>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Student</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Payment ID</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {allPayments.map((p, i) => (
                    <motion.tr key={p._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-white text-xs">{p.userId?.name || 'N/A'}</td>
                      <td className="px-4 py-3 text-white font-medium">₹{p.amount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-white/50 text-xs">{p.paidAt ? new Date(p.paidAt).toLocaleDateString('en-IN') : '-'}</td>
                      <td className="px-4 py-3 text-white/40 text-xs font-mono">{p.razorpayPaymentId?.slice(-16) || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <a href={`http://127.0.0.1:5001/api/fees/${p.feeId?._id || p.feeId}/receipt?paymentId=${p._id}`}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-xs hover:bg-purple-500/30 transition-all">
                          <FiDownload size={12} /> PDF
                        </a>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>
      )}

      <CreateFeeModal open={showCreate} onClose={() => setShowCreate(false)} onCreated={fetchData} />
    </div>
  );
}
