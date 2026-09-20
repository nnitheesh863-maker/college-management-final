import { motion } from 'framer-motion';

export default function AnimatedTable({ headers, rows, renderRow, emptyMessage = 'No data' }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-white/70">
        <thead>
          <tr className="border-b border-white/10 text-white/50 uppercase text-xs tracking-wider">
            {headers.map((h, i) => (
              <th key={i} className="p-3 text-left font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? rows.map((row, i) => (
            <motion.tr
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              className="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              {renderRow(row, i)}
            </motion.tr>
          )) : (
            <tr>
              <td colSpan={headers.length} className="p-8 text-center text-white/40">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
