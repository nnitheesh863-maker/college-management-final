export default function LoadingSkeleton({ count = 3, type = 'card' }) {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((_, i) => (
          <div key={i} className="rounded-2xl p-6 bg-white/5 border border-white/10 animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-white/10 mb-4" />
            <div className="h-4 bg-white/10 rounded w-2/3 mb-2" />
            <div className="h-6 bg-white/10 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((_, i) => (
        <div key={i} className="h-16 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
      ))}
    </div>
  );
}
