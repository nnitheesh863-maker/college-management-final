import { motion } from 'framer-motion';
import { cardHover } from '../../constants/animations';

export default function GlassCard({ children, className, hoverable = false, glow = false, onClick }) {
  return (
    <motion.div
      variants={hoverable ? cardHover : undefined}
      initial="rest"
      whileHover={hoverable ? 'hover' : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`rounded-2xl border bg-white/5 backdrop-blur-sm border-white/10 transition-colors ${glow ? 'hover:border-purple-500/30 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]' : ''} ${className || ''}`}
    >
      {children}
    </motion.div>
  );
}

export function GlassCardHeader({ icon, title, action }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/5">
      <h3 className="text-white/80 font-semibold flex items-center gap-2">
        {icon} {title}
      </h3>
      {action && <div>{action}</div>}
    </div>
  );
}

export function GlassCardContent({ children, className }) {
  return <div className={`p-4 ${className || ''}`}>{children}</div>;
}
