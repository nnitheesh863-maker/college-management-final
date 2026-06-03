import { motion } from 'framer-motion';
import GlassCard, { GlassCardContent } from '../ui/GlassCard';
import AnimatedTable from '../ui/AnimatedTable';
import ScrollReveal from '../animations/ScrollReveal';
import { STUDENT_GRADES, SUBJECT_COLORS } from '../../data/mockData';

export default function Analytics() {
  const subjects = ['Math', 'Physics', 'Chemistry', 'CS', 'English'];
  const averages = subjects.map((sub) => {
    const key = sub.toLowerCase();
    const vals = STUDENT_GRADES.map((s) => s[key]);
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  });

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <h2 className="text-2xl font-bold glow-text">📊 Analytics</h2>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <GlassCard hoverable glow>
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <h3 className="text-white/80 font-semibold flex items-center gap-2">📈 Subject Performance</h3>
          </div>
          <GlassCardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {subjects.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="text-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                >
                  <p className="text-white/50 text-xs mb-2 font-medium">{s}</p>
                  <motion.p
                    className="text-3xl font-bold"
                    style={{ color: SUBJECT_COLORS[s] }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.15 + 0.3, type: 'spring', stiffness: 200 }}
                  >
                    {averages[i]}%
                  </motion.p>
                  <div className="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${averages[i]}%` }}
                      transition={{ delay: i * 0.1 + 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                      style={{ backgroundColor: SUBJECT_COLORS[s] }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCardContent>
        </GlassCard>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <GlassCard hoverable glow>
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <h3 className="text-white/80 font-semibold flex items-center gap-2">👥 Student Grades</h3>
          </div>
          <GlassCardContent>
            <AnimatedTable
              headers={['Name', 'Math', 'Physics', 'Chemistry', 'CS', 'English', 'Avg']}
              rows={STUDENT_GRADES}
              renderRow={(row, i) => {
                const avg = Math.round(
                  (row.math + row.physics + row.chemistry + row.cs + row.english) / 5
                );
                return (
                  <>
                    <td className="p-3 font-medium text-white/90">{row.name}</td>
                    <td className="p-3">{row.math}</td>
                    <td className="p-3">{row.physics}</td>
                    <td className="p-3">{row.chemistry}</td>
                    <td className="p-3">{row.cs}</td>
                    <td className="p-3">{row.english}</td>
                    <td className="p-3">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                          avg >= 75
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : avg >= 50
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {avg}%
                      </motion.span>
                    </td>
                  </>
                );
              }}
            />
          </GlassCardContent>
        </GlassCard>
      </ScrollReveal>
    </div>
  );
}
