import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { createAndEmitNotification } from '../services/socketManager.js';
import Fee from '../models/Fee.js';
import Payment from '../models/Payment.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import crypto from 'crypto';

const router = Router();

let razorpayInstance = null;
async function getRazorpay() {
  if (!razorpayInstance) {
    const Razorpay = (await import('razorpay')).default;
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder',
    });
  }
  return razorpayInstance;
}

// ---------- STUDENT: my fees ----------
router.get('/my', authenticate, authorize('student'), async (req, res) => {
  try {
    const fees = await Fee.find({ userId: req.user.id }).sort({ dueDate: -1 });
    const payments = await Payment.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const totalDue = fees.reduce((s, f) => s + (f.amount - f.paidAmount), 0);
    const totalPaid = fees.reduce((s, f) => s + f.paidAmount, 0);
    res.json({ fees, payments, stats: { totalDue, totalPaid, totalFees: fees.reduce((s, f) => s + f.amount, 0) } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- PRINCIPAL/ADMIN: all fees ----------
router.get('/', authenticate, authorize('principal'), async (req, res) => {
  try {
    const fees = await Fee.find().populate('userId', 'name email').sort({ dueDate: -1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- PRINCIPAL: create fee record ----------
router.post('/create', authenticate, authorize('principal'), async (req, res) => {
  try {
    const { studentId, userId, title, amount, dueDate, totalInstallments } = req.body;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const installments = [];
    if (totalInstallments > 1) {
      const perInstallment = Math.round(amount / totalInstallments);
      const baseDate = new Date(dueDate);
      for (let i = 0; i < totalInstallments; i++) {
        const instDate = new Date(baseDate);
        instDate.setMonth(instDate.getMonth() + i);
        installments.push({ amount: i === totalInstallments - 1 ? amount - perInstallment * (totalInstallments - 1) : perInstallment, dueDate: instDate, status: 'pending' });
      }
    }

    const fee = await Fee.create({
      studentId, userId: userId || student.userId,
      title: title || 'Tuition Fee', amount, dueDate,
      totalInstallments: totalInstallments || 1,
      installmentPlan: (totalInstallments || 1) > 1,
      installments,
    });

    const user = await User.findById(fee.userId);
    if (user) {
      createAndEmitNotification({
        userId: user._id, message: `New fee record: ${fee.title} — ₹${fee.amount} due ${fee.dueDate.toISOString().split('T')[0]}`,
        type: 'info', category: 'fee', link: '/student-dashboard',
      });
    }

    res.status(201).json(fee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- STUDENT: create Razorpay order ----------
router.post('/:id/create-order', authenticate, authorize('student'), async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee not found' });
    if (fee.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    const { amount, installmentId } = req.body;
    const payAmount = installmentId
      ? fee.installments.id(installmentId)?.amount
      : (amount || fee.dueAmount);

    if (!payAmount || payAmount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const receipt = `rcpt_${fee._id}_${Date.now()}`;
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
    let order;
    if (razorpayKeyId && razorpayKeyId !== 'rzp_test_placeholder') {
      const razorpay = await getRazorpay();
      order = await razorpay.orders.create({
        amount: Math.round(payAmount * 100), currency: 'INR', receipt,
        notes: { feeId: fee._id.toString(), userId: req.user.id, installmentId: installmentId || '' },
      });
    } else {
      order = { id: 'sim_' + Date.now(), amount: Math.round(payAmount * 100), currency: 'INR', receipt, status: 'created' };
    }

    const payment = await Payment.create({
      feeId: fee._id, studentId: fee.studentId, userId: req.user.id,
      amount: payAmount, razorpayOrderId: order.id, status: 'created',
    });

    res.json({ order, paymentId: payment._id, razorpayKeyId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- EXPRESS: verify Razorpay payment ----------
router.post('/verify', authenticate, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentId } = req.body;
    const isSimulated = razorpayOrderId && razorpayOrderId.startsWith('sim_');
    if (!isSimulated) {
      const secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder';
      const generated = crypto.createHmac('sha256', secret).update(`${razorpayOrderId}|${razorpayPaymentId}`).digest('hex');
      if (generated !== razorpaySignature) {
        if (paymentId) await Payment.findByIdAndUpdate(paymentId, { status: 'failed' });
        return res.status(400).json({ message: 'Invalid signature', verified: false });
      }
    }

    let payment = paymentId ? await Payment.findById(paymentId) : null;
    if (!payment && razorpayOrderId) payment = await Payment.findOne({ razorpayOrderId });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = 'captured';
    payment.paidAt = new Date();
    await payment.save();

    const fee = await Fee.findById(payment.feeId);
    if (!fee) return res.status(404).json({ message: 'Fee not found' });

    fee.paidAmount += payment.amount;
    fee.transactionId = razorpayPaymentId;
    fee.paymentMethod = 'razorpay';
    fee.status = fee.paidAmount >= fee.amount ? 'paid' : 'partial';

    if (payment.razorpayOrderId && !payment.razorpayOrderId.startsWith('sim_')) {
      try {
        const note = (await (await getRazorpay()).orders.fetch(payment.razorpayOrderId)).notes;
        if (note && note.installmentId) {
          const inst = fee.installments.id(note.installmentId);
          if (inst) { inst.status = 'paid'; inst.paidAt = new Date(); inst.paymentId = payment._id; }
        }
      } catch { /* non-razorpay order */ }
    }

    await fee.save();

    await Student.findByIdAndUpdate(payment.studentId, { feeStatus: fee.status });

    createAndEmitNotification({
      userId: req.user.id, message: `Payment of ₹${payment.amount} confirmed for "${fee.title}"`,
      type: 'success', category: 'fee', link: '/student-dashboard',
    });

    res.json({ verified: true, payment, fee, receiptUrl: `/api/fees/${fee._id}/receipt?paymentId=${payment._id}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- GET: payment receipt (HTML) ----------
router.get('/:id/receipt', authenticate, async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id).populate('userId', 'name email');
    const payment = await Payment.findById(req.query.paymentId);
    if (!fee || !payment) return res.status(404).json({ message: 'Receipt not found' });

    const student = await Student.findById(fee.studentId).populate('userId', 'name email');
    const userName = student?.userId?.name || fee.userId?.name || 'Student';
    const userEmail = student?.userId?.email || fee.userId?.email || '';

    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Payment Receipt</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f3f4f6; padding: 40px; }
  .receipt { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
  .header { background: linear-gradient(135deg, #7c3aed, #db2777); padding: 32px; text-align: center; color: white; }
  .header h1 { font-size: 24px; margin-bottom: 4px; }
  .header p { opacity: 0.85; font-size: 14px; }
  .body { padding: 32px; }
  .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
  .row:last-child { border-bottom: none; }
  .label { color: #6b7280; font-size: 14px; }
  .value { font-weight: 600; font-size: 14px; color: #111827; }
  .total { font-size: 20px; color: #059669; }
  .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: #d1fae5; color: #065f46; }
  .footer { text-align: center; padding: 24px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
  .print-btn { display: block; width: 200px; margin: 20px auto 0; padding: 12px; background: #7c3aed; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; }
  .print-btn:hover { background: #6d28d9; }
  @media print { .print-btn { display: none; } body { background: white; padding: 0; } .receipt { box-shadow: none; } }
</style></head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>Payment Receipt</h1>
      <p>College ERP System</p>
    </div>
    <div class="body">
      <div class="row"><span class="label">Receipt No.</span><span class="value">RCP-${payment._id.toString().slice(-8).toUpperCase()}</span></div>
      <div class="row"><span class="label">Student</span><span class="value">${userName}</span></div>
      <div class="row"><span class="label">Email</span><span class="value">${userEmail}</span></div>
      <div class="row"><span class="label">Fee Title</span><span class="value">${fee.title}</span></div>
      <div class="row"><span class="label">Payment ID</span><span class="value">${payment.razorpayPaymentId || 'N/A'}</span></div>
      <div class="row"><span class="label">Order ID</span><span class="value">${payment.razorpayOrderId || 'N/A'}</span></div>
      <div class="row"><span class="label">Date</span><span class="value">${payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span></div>
      <div class="row"><span class="label">Status</span><span class="value"><span class="status-badge">${payment.status}</span></span></div>
      <div class="row"><span class="label">Amount Paid</span><span class="value total">₹${payment.amount.toLocaleString('en-IN')}</span></div>
      <div class="row"><span class="label">Total Fee</span><span class="value">₹${fee.amount.toLocaleString('en-IN')}</span></div>
      <div class="row"><span class="label">Remaining</span><span class="value">₹${(fee.amount - fee.paidAmount).toLocaleString('en-IN')}</span></div>
    </div>
    <div class="footer">
      <p>This is a computer-generated receipt. No signature required.</p>
      <p>College ERP System &bull; Generated on ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
    <button class="print-btn" onclick="window.print()">🖨 Print / Save PDF</button>
  </div>
</body></html>`;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- PAYMENT HISTORY ----------
router.get('/payments', authenticate, authorize('student'), async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id, status: 'captured' })
      .populate({ path: 'feeId', select: 'title amount' })
      .sort({ paidAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/payments/all', authenticate, authorize('principal'), async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'captured' })
      .populate({ path: 'feeId', select: 'title amount' })
      .populate({ path: 'userId', select: 'name email' })
      .sort({ paidAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- ANALYTICS ----------
router.get('/analytics', authenticate, authorize('principal'), async (req, res) => {
  try {
    const fees = await Fee.find();
    const payments = await Payment.find({ status: 'captured' });

    const totalFees = fees.reduce((s, f) => s + f.amount, 0);
    const totalCollected = fees.reduce((s, f) => s + f.paidAmount, 0);
    const totalPending = totalFees - totalCollected;
    const paidCount = fees.filter(f => f.status === 'paid').length;
    const partialCount = fees.filter(f => f.status === 'partial').length;
    const unpaidCount = fees.filter(f => f.status === 'unpaid' || f.status === 'overdue').length;
    const totalRecords = fees.length;
    const collectionRate = totalFees > 0 ? Math.round((totalCollected / totalFees) * 100) : 0;

    const monthlyData = {};
    for (const p of payments) {
      if (p.paidAt) {
        const key = new Date(p.paidAt).toLocaleString('default', { month: 'short', year: 'numeric' });
        monthlyData[key] = (monthlyData[key] || 0) + p.amount;
      }
    }
    const revenueByMonth = Object.entries(monthlyData).map(([month, revenue]) => ({ month, revenue }));

    const gradeWise = {};
    const students = await Student.find();
    for (const s of students) {
      if (!gradeWise[s.grade]) gradeWise[s.grade] = { total: 0, paid: 0, partial: 0, unpaid: 0 };
    }
    for (const f of fees) {
      const st = await Student.findById(f.studentId);
      if (st && gradeWise[st.grade]) {
        gradeWise[st.grade].total++;
        gradeWise[st.grade][f.status === 'paid' ? 'paid' : f.status === 'partial' ? 'partial' : 'unpaid']++;
      }
    }
    const gradeAnalytics = Object.entries(gradeWise).map(([grade, data]) => ({ grade, ...data }));

    const overdueFees = fees.filter(f => f.status === 'unpaid' && new Date() > f.dueDate);
    const dueSoon = fees.filter(f => {
      if (f.status === 'paid') return false;
      const days = Math.ceil((new Date(f.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
      return days >= 0 && days <= 7;
    });

    res.json({
      stats: { totalFees, totalCollected, totalPending, paidCount, partialCount, unpaidCount, totalRecords, collectionRate },
      revenueByMonth,
      gradeAnalytics,
      alerts: { overdueCount: overdueFees.length, dueSoonCount: dueSoon.length },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- REMINDERS ----------
router.post('/remind', authenticate, authorize('principal'), async (req, res) => {
  try {
    const { feeId } = req.body;
    const filter = feeId ? { _id: feeId } : { status: { $in: ['unpaid', 'partial'] } };
    const fees = await Fee.find(filter);

    let sent = 0;
    for (const fee of fees) {
      const user = await User.findById(fee.userId);
      if (!user) continue;
      createAndEmitNotification({
        userId: user._id,
        message: `Reminder: "${fee.title}" of ₹${fee.amount} is due on ${fee.dueDate.toISOString().split('T')[0]}. Balance: ₹${fee.amount - fee.paidAmount}`,
        type: 'warning', category: 'fee', link: '/student-dashboard',
      });
      fee.reminderSent = true;
      fee.lastReminderAt = new Date();
      await fee.save();
      sent++;
    }

    res.json({ message: `Reminders sent to ${sent} student(s)`, sent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- INSTALLMENT PLAN ----------
router.post('/:id/installment-plan', authenticate, authorize('student'), async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee not found' });
    if (fee.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    if (fee.installmentPlan) return res.status(400).json({ message: 'Installment plan already active' });

    const { totalInstallments } = req.body;
    if (!totalInstallments || totalInstallments < 2 || totalInstallments > 12) {
      return res.status(400).json({ message: 'Installments must be between 2 and 12' });
    }

    const perInstallment = Math.round(fee.dueAmount / totalInstallments);
    const baseDate = new Date(fee.dueDate);
    const installments = [];
    for (let i = 0; i < totalInstallments; i++) {
      const instDate = new Date(baseDate);
      instDate.setMonth(instDate.getMonth() + i);
      installments.push({
        amount: i === totalInstallments - 1 ? fee.dueAmount - perInstallment * (totalInstallments - 1) : perInstallment,
        dueDate: instDate,
        status: 'pending',
      });
    }

    fee.installments = installments;
    fee.installmentPlan = true;
    fee.totalInstallments = totalInstallments;
    await fee.save();

    res.json(fee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
