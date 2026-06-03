import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDollarSign, FiClock, FiCheckCircle, FiAlertCircle, FiDownload, FiSend, FiCreditCard, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { getMyFees, createOrder, verifyPayment, getPaymentHistory, setupInstallmentPlan } from '../../../services/fees';
import StatusBadge from '../../ui/StatusBadge';
import GlassCard from '../../ui/GlassCard';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function PaymentRow({ payment, index }) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
    >
      <td className="px-4 py-3 text-white/60 text-xs font-mono">{payment.razorpayPaymentId?.slice(-12) || 'N/A'}</td>
      <td className="px-4 py-3 text-white text-sm">₹{payment.amount.toLocaleString('en-IN')}</td>
      <td className="px-4 py-3 text-white/50 text-xs">{payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('en-IN') : '-'}</td>
      <td className="px-4 py-3">
        <StatusBadge status={payment.status === 'captured' ? 'paid' : payment.status}>{payment.status === 'captured' ? 'Success' : payment.status}</StatusBadge>
      </td>
      <td className="px-4 py-3">
        <a
          href={`http://127.0.0.1:5001/api/fees/${payment.feeId?._id || payment.feeId}/receipt?paymentId=${payment._id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 text-xs hover:bg-purple-500/30 transition-all"
        >
          <FiDownload size={12} /> Receipt
        </a>
      </td>
    </motion.tr>
  );
}

function FeeCard({ fee, onPay, onInstallment, processing }) {
  const [expanded, setExpanded] = useState(false);
  const progress = fee.amount > 0 ? Math.round((fee.paidAmount / fee.amount) * 100) : 0;
  const due = fee.amount - fee.paidAmount;
  const isOverdue = fee.status === 'unpaid' && new Date(fee.dueDate) < new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-4 bg-gradient-to-br ${
        fee.status === 'paid' ? 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20' :
        isOverdue ? 'from-rose-500/10 to-red-500/5 border-rose-500/20' :
        'from-blue-500/10 to-purple-500/5 border-blue-500/20'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-white text-sm">{fee.title || 'Tuition Fee'}</h4>
          <p className="text-white/40 text-xs mt-0.5">
            Due: {new Date(fee.dueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <StatusBadge status={fee.status}>
          {fee.status === 'paid' ? 'Paid' : isOverdue ? 'Overdue' : fee.status === 'partial' ? 'Partial' : 'Unpaid'}
        </StatusBadge>
      </div>

      <div className="flex items-center gap-4 mb-2">
        <span className="text-white/50 text-xs">₹{fee.paidAmount.toLocaleString('en-IN')} / ₹{fee.amount.toLocaleString('en-IN')}</span>
        <span className="text-xs font-semibold text-white/70">{progress}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            fee.status === 'paid' ? 'bg-emerald-400' : isOverdue ? 'bg-rose-400' : 'bg-blue-400'
          }`}
        />
      </div>

      <div className="flex items-center gap-2">
        {fee.status !== 'paid' && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={processing}
            onClick={() => onPay(fee._id, due)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-medium hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50"
          >
            <FiCreditCard size={14} />
            Pay ₹{due.toLocaleString('en-IN')}
          </motion.button>
        )}
        {fee.status !== 'paid' && !fee.installmentPlan && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/10 text-white/70 text-xs hover:bg-white/15 transition-all"
          >
            <FiClock size={14} />
            Installments
            {expanded ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
          </motion.button>
        )}
        {fee.status === 'paid' && (
          <span className="flex items-center gap-1 text-emerald-400 text-xs"><FiCheckCircle size={14} /> Fully Paid</span>
        )}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
              <p className="text-white/50 text-xs">Choose installment plan:</p>
              <div className="flex flex-wrap gap-2">
                {[2, 3, 4, 6].map((n) => (
                  <motion.button
                    key={n}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={processing}
                    onClick={() => onInstallment(fee._id, n)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-xs hover:bg-purple-500/20 hover:text-purple-300 transition-all disabled:opacity-50"
                  >
                    {n} installments (₹{Math.round(due / n).toLocaleString('en-IN')}/mo)
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function StudentFees() {
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({ totalDue: 0, totalPaid: 0, totalFees: 0 });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyFees();
      setFees(data.fees || []);
      setStats(data.stats || {});
      const p = await getPaymentHistory();
      setPayments(p || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handlePay(feeId, amount) {
    setProcessing(true);
    setError('');
    try {
      const { order, razorpayKeyId } = await createOrder(feeId, { amount });
      const isSimulated = order.id?.startsWith('sim_');

      if (isSimulated) {
        await verifyPayment({
          razorpayOrderId: order.id,
          razorpayPaymentId: 'sim_pay_' + Date.now(),
          razorpaySignature: 'sim_sig',
          paymentId: null,
        });
        await fetchData();
        setProcessing(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) { setError('Failed to load payment gateway. Please try again.'); return; }

      const options = {
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: 'College ERP',
        description: 'Fee Payment',
        order_id: order.id,
        handler: async function (response) {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              paymentId: null,
            });
            await fetchData();
          } catch (e) {
            setError('Payment verification failed: ' + (e?.response?.data?.message || e.message));
          } finally {
            setProcessing(false);
          }
        },
        modal: { ondismiss: () => setProcessing(false) },
        prefill: { name: '', email: '', contact: '' },
        theme: { color: '#7c3aed' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function () { setError('Payment failed. Please try again.'); setProcessing(false); });
      rzp.open();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
      setProcessing(false);
    }
  }

  async function handleInstallment(feeId, totalInstallments) {
    setProcessing(true);
    try {
      await setupInstallmentPlan(feeId, totalInstallments);
      await fetchData();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setProcessing(false);
    }
  }

  const totalProgress = stats.totalFees > 0 ? Math.round((stats.totalPaid / stats.totalFees) * 100) : 0;

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

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-lg font-bold gradient-text-blue">💰 Fee Management</h2>
        <p className="text-white/40 text-xs mt-0.5">Online fee payment with Razorpay</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Fees', value: `₹${(stats.totalFees || 0).toLocaleString('en-IN')}`, icon: '📋', color: 'from-blue-500/20 to-cyan-500/10', border: 'border-blue-500/30' },
          { label: 'Paid', value: `₹${(stats.totalPaid || 0).toLocaleString('en-IN')}`, icon: '✅', color: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/30' },
          { label: 'Pending', value: `₹${(stats.totalDue || 0).toLocaleString('en-IN')}`, icon: '⏳', color: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/30' },
          { label: 'Completed', value: `${totalProgress}%`, icon: '📊', color: 'from-purple-500/20 to-pink-500/10', border: 'border-purple-500/30' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`rounded-xl p-4 border bg-gradient-to-br ${item.color} ${item.border}`}>
            <p className="text-white/40 text-[11px] uppercase tracking-wider">{item.label}</p>
            <p className="text-lg font-bold text-white mt-0.5">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="h-2.5 rounded-full bg-white/10 overflow-hidden mb-6">
          <motion.div initial={{ width: 0 }} animate={{ width: `${totalProgress}%` }} transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
        </div>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2">
          <FiAlertCircle size={16} /> {error}
          <button onClick={() => setError('')} className="ml-auto text-rose-400/60 hover:text-rose-300">&times;</button>
        </motion.div>
      )}

      {fees.length === 0 ? (
        <GlassCard>
          <div className="p-8 text-center">
            <FiDollarSign size={40} className="mx-auto text-white/20 mb-3" />
            <p className="text-white/50">No fee records found.</p>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {fees.map((fee) => (
            <FeeCard key={fee._id} fee={fee} onPay={handlePay} onInstallment={handleInstallment} processing={processing} />
          ))}
        </div>
      )}

      {payments.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard>
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h3 className="text-white/80 font-semibold flex items-center gap-2 text-sm">
                <FiSend size={14} /> Payment History
              </h3>
              <span className="text-white/30 text-xs">{payments.length} transaction(s)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Transaction</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, i) => <PaymentRow key={p._id} payment={p} index={i} />)}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
