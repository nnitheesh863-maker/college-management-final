import { motion } from 'framer-motion';

export default function AnimatedTable({ headers, rows, renderRow, emptyMessage = 'No data available' }) {
  return (
    <div className="overflow-x-auto -mx-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {headers.map((h, i) => (
              <th key={i} className="px-5 py-3.5 text-left text-[11px] font-semibold text-white/30 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? rows.map((row, i) => (
            <motion.tr
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02, duration: 0.2 }}
              className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
            >
              {renderRow(row, i)}
            </motion.tr>
          )) : (
            <tr>
              <td colSpan={headers.length} className="px-5 py-12 text-center">
                <p className="text-white/20 text-sm">{emptyMessage}</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
