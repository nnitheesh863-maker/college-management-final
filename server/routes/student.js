import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import Student from '../models/Student.js';
import Fee from '../models/Fee.js';
import Attendance from '../models/Attendance.js';
import Mark from '../models/Mark.js';
import Assignment from '../models/Assignment.js';
import Timetable from '../models/Timetable.js';
import LeaveRequest from '../models/LeaveRequest.js';
import Announcement from '../models/Announcement.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import DisciplinaryIssue from '../models/DisciplinaryIssue.js';

const router = Router();
router.use(authenticate, authorize('student'));

router.get('/dashboard', async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id }).populate('userId', 'name email avatar');
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const fees = await Fee.find({ userId: req.user.id }).sort({ dueDate: -1 }).limit(5);
    const attendanceRecords = await Attendance.find({ studentId: student._id }).sort({ date: -1 }).limit(60);
    const marks = await Mark.find({ studentId: student._id }).sort({ createdAt: -1 });
    const assignments = await Assignment.find({ grade: student.grade }).sort({ dueDate: 1 });
    const timetable = await Timetable.find({ grade: student.grade }).sort({ day: 1, period: 1 });
    const leaveRequests = await LeaveRequest.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(5);
    const announcements = await Announcement.find({ $or: [{ targetRole: 'all' }, { targetRole: 'student' }] }).sort({ createdAt: -1 }).limit(10);
    const messages = await Message.find({ $or: [{ fromUserId: req.user.id }, { toUserId: req.user.id }] }).sort({ createdAt: -1 }).limit(20);
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10);
    const disciplinary = await DisciplinaryIssue.find({ studentId: student._id }).sort({ date: -1 });

    // Computed stats
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(a => a.status === 'present').length;
    const attendancePercent = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    const allMarks = marks.map(m => ({ subject: m.subject, marksObtained: m.marksObtained, totalMarks: m.totalMarks, grade: m.grade }));
    const avgMarks = allMarks.length > 0 ? Math.round(allMarks.reduce((s, m) => s + (m.marksObtained / m.totalMarks) * 100, 0) / allMarks.length) : 0;

    res.json({
      student,
      fees,
      attendance: { records: attendanceRecords, percent: attendancePercent, present: presentDays, total: totalDays },
      marks: allMarks,
      avgMarks,
      assignments,
      timetable,
      leaveRequests,
      announcements,
      messages,
      notifications,
      disciplinary,
      weakSubjects: allMarks.filter(m => (m.marksObtained / m.totalMarks) * 100 < 35),
      attendanceWarning: attendancePercent < 75,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/leave', async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    const leave = await LeaveRequest.create({ userId: req.user.id, role: 'student', startDate, endDate, reason });
    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/fee/pay', async (req, res) => {
  try {
    const { feeId, amount } = req.body;
    const fee = await Fee.findById(feeId);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });
    fee.paidAmount += amount;
    fee.status = fee.paidAmount >= fee.amount ? 'paid' : 'partial';
    fee.transactionId = 'TXN' + Date.now();
    await fee.save();
    res.json(fee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/messages/:otherUserId', async (req, res) => {
  try {
    const msgs = await Message.find({
      $or: [
        { fromUserId: req.user.id, toUserId: req.params.otherUserId },
        { fromUserId: req.params.otherUserId, toUserId: req.user.id },
      ]
    }).sort({ createdAt: 1 });
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/messages', async (req, res) => {
  try {
    const msg = await Message.create({ fromUserId: req.user.id, toUserId: req.body.toUserId, message: req.body.message });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/notifications/:id/read', async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ ok: true });
});

export default router;
