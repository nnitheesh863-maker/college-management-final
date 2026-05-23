export default function StatusBadge({ status, children }) {
  const styles = {
    present: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    absent: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    paid: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    partial: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    unpaid: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    pending: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    critical: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    warning: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    high: 'bg-emerald-500/20 text-emerald-300',
    medium: 'bg-amber-500/20 text-amber-300',
    low: 'bg-rose-500/20 text-rose-300',
  };

  const s = styles[status] || 'bg-white/10 text-white/60';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${s}`}>
      {children}
    </span>
  );
}
