import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useApp } from '../../context/AppContext';
import GlassCard, { GlassCardContent } from '../ui/GlassCard';
import AnimatedTable from '../ui/AnimatedTable';
import AnimatedButton from '../ui/AnimatedButton';
import ScrollReveal from '../animations/ScrollReveal';
import StaggerContainer from '../animations/StaggerContainer';
import StatusBadge from '../ui/StatusBadge';

export default function Attendance() {
  const { analytics, students, presentPercent, total, refresh } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ student_name: '', status: 'present' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5001/api/attendance', form);
      setMessage('Attendance recorded!');
      setForm({ student_name: '', status: 'present' });
      refresh();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.message || err.message));
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const stats = [
    { label: 'Present', value: analytics.present_today, emoji: '✅', color: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/30' },
    { label: 'Absent', value: analytics.absent_today, emoji: '❌', color: 'from-rose-500/20 to-pink-500/10', border: 'border-rose-500/30' },
    { label: 'Total', value: total, emoji: '👥', color: 'from-violet-500/20 to-fuchsia-500/10', border: 'border-violet-500/30' },
    { label: 'Rate', value: `${presentPercent}%`, emoji: '📊', color: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/30' },
  ];

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold glow-text">📅 Attendance</h2>
          <AnimatedButton variant="success" onClick={() => setShowForm(!showForm)}>
            ➕ Mark Attendance
          </AnimatedButton>
        </div>
      </ScrollReveal>

      <StaggerContainer>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((item, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { delay: i * 0.08 } }
              }}
              whileHover={{ scale: 1.03, y: -2 }}
              className={`rounded-2xl p-4 text-center border bg-gradient-to-br ${item.color} ${item.border} backdrop-blur-sm transition-all`}
            >
              <p className="text-2xl mb-1">{item.emoji}</p>
              <p className="text-white/50 text-xs uppercase tracking-wider">{item.label}</p>
              <p className="text-3xl font-bold text-white mt-1">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </StaggerContainer>

      {showForm && (
        <ScrollReveal>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 rounded-2xl p-6 border border-purple-500/20"
          >
            <h3 className="font-bold text-lg mb-4 text-purple-200">Record Attendance</h3>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
              <select
                value={form.student_name}
                onChange={(e) => setForm({ ...form, student_name: e.target.value })}
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500/50 transition-all"
                required
              >
                <option value="" className="bg-[#0f0a1a]">Select Student</option>
                {students.map((s) => (
                  <option key={s.name} value={s.name} className="bg-[#0f0a1a]">{s.name} ({s.roll_number})</option>
                ))}
              </select>
              <div className="flex gap-6">
                {[
                  { value: 'present', label: '✓ Present', color: 'text-emerald-400' },
                  { value: 'absent', label: '✗ Absent', color: 'text-rose-400' },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio" name="status" value={opt.value}
                      checked={form.status === opt.value}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-4 h-4 accent-emerald-500"
                    />
                    <span className={`${opt.color} font-semibold`}>{opt.label}</span>
                  </label>
                ))}
              </div>
              <AnimatedButton type="submit" variant="success" className="w-full">Record</AnimatedButton>
            </form>
          </motion.div>
        </ScrollReveal>
      )}

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl text-center font-semibold ${
            message.includes('Error')
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}
        >
          {message}
        </motion.div>
      )}

      <ScrollReveal delay={0.2}>
        <GlassCard hoverable glow>
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <h3 className="text-white/80 font-semibold flex items-center gap-2">👥 Student Roster</h3>
          </div>
          <GlassCardContent>
            <AnimatedTable
              headers={['Name', 'Roll', 'Status']}
              rows={students}
              renderRow={(s, i) => (
                <>
                  <td className="p-3 font-medium text-white/90">{s.name}</td>
                  <td className="p-3">{s.roll_number}</td>
                  <td className="p-3">
                    <StatusBadge status="present">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Present
                    </StatusBadge>
                  </td>
                </>
              )}
              emptyMessage="No students registered yet."
            />
          </GlassCardContent>
        </GlassCard>
      </ScrollReveal>
    </div>
  );
}
