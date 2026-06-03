import { motion } from 'framer-motion';

export default function GlassCard({ children, className, hoverable = false, glow = false, onClick, padding = true }) {
  return (
    <motion.div
      whileHover={hoverable ? { y: -2, transition: { duration: 0.2 } } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`rounded-xl border bg-white/[0.04] backdrop-blur-sm border-white/[0.06] transition-all duration-300
        ${glow ? 'hover:border-accent-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.08)]' : ''}
        ${hoverable ? 'cursor-pointer' : ''}
        ${className || ''}`}
    >
      {padding ? <div className="p-5">{children}</div> : children}
    </motion.div>
  );
}

export function GlassCardHeader({ icon, title, action, className }) {
  return (
    <div className={`flex items-center justify-between px-5 py-4 border-b border-white/[0.06] ${className || ''}`}>
      <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2">
        {icon} {title}
      </h3>
      {action && <div>{action}</div>}
    </div>
  );
}

export function GlassCardContent({ children, className }) {
  return <div className={`p-5 ${className || ''}`}>{children}</div>;
}
