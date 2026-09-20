import { motion } from 'framer-motion';
import GlassCard, { GlassCardContent } from '../ui/GlassCard';
import ScrollReveal from '../animations/ScrollReveal';
import StaggerContainer from '../animations/StaggerContainer';
import { FACULTY_DATA, SUBJECT_COLORS } from '../../data/mockData';

export default function Faculty() {
  return (
    <div className="space-y-6">
      <ScrollReveal>
        <h2 className="text-2xl font-bold glow-text">👨‍🏫 Faculty</h2>
      </ScrollReveal>

      <StaggerContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FACULTY_DATA.map((f, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="rounded-2xl p-5 border bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0"
                >
                  {f.name.charAt(0)}
                </motion.div>
                <div>
                  <h4 className="font-bold text-white/90 text-sm">{f.name}</h4>
                  <p className="text-white/40 text-xs">{f.subject}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                  <span className="text-white/50">📧</span>
                  <span className="text-white/70 text-xs">{f.email}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                  <span className="text-white/50">👥 Students</span>
                  <span className="text-white font-bold">{f.students}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                  <span className="text-white/50">⭐ Rating</span>
                  <span className="text-amber-400 font-bold">{f.rating}</span>
                </div>
              </div>
              <div className="mt-3 w-full bg-white/10 rounded-full h-1">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(f.rating / 5) * 100}%` }}
                  transition={{ delay: i * 0.1, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ backgroundColor: SUBJECT_COLORS[f.subject] || '#a855f7' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </StaggerContainer>
    </div>
  );
}
