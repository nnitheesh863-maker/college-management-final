import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Fee from '../models/Fee.js';
import Attendance from '../models/Attendance.js';
import Mark from '../models/Mark.js';
import LeaveRequest from '../models/LeaveRequest.js';
import Announcement from '../models/Announcement.js';
import DisciplinaryIssue from '../models/DisciplinaryIssue.js';
import Notification from '../models/Notification.js';

const router = Router();
router.use(authenticate, authorize('principal'));

router.get('/dashboard', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const totalUsers = await User.countDocuments();

    const fees = await Fee.find();
    const totalRevenue = fees.reduce((s, f) => s + f.paidAmount, 0);
    const pendingFees = fees.filter(f => f.status !== 'paid').length;

    const marks = await Mark.find().populate('studentId');
    const avgPerformance = marks.length > 0
      ? Math.round(marks.reduce((s, m) => s + (m.marksObtained / m.totalMarks) * 100, 0) / marks.length)
      : 0;

    const attendanceRecords = await Attendance.find();
    const totalAttendance = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(a => a.status === 'present').length;
    const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

    const leaveRequests = await LeaveRequest.find().sort({ createdAt: -1 }).limit(20).populate('userId', 'name');
    const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(10);
    const disciplinary = await DisciplinaryIssue.find().sort({ date: -1 }).limit(20).populate('studentId').populate('raisedBy');
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10);

    // Expense tracking (mock)
    const expenses = [
      { category: 'Salaries', amount: 500000, month: 'Jan' },
      { category: 'Infrastructure', amount: 200000, month: 'Jan' },
      { category: 'Utilities', amount: 80000, month: 'Jan' },
      { category: 'Events', amount: 50000, month: 'Jan' },
    ];

    // Revenue by month (mock)
    const revenueByMonth = [
      { month: 'Jan', revenue: 850000 }, { month: 'Feb', revenue: 820000 },
      { month: 'Mar', revenue: 900000 }, { month: 'Apr', revenue: 780000 },
      { month: 'May', revenue: 880000 }, { month: 'Jun', revenue: 920000 },
    ];

    // Department analytics (mock)
    const departments = [
      { name: 'Science', teachers: 12, students: 180, avgMarks: 78 },
      { name: 'Math', teachers: 8, students: 150, avgMarks: 82 },
      { name: 'CS', teachers: 6, students: 120, avgMarks: 85 },
      { name: 'English', teachers: 10, students: 160, avgMarks: 76 },
      { name: 'Arts', teachers: 5, students: 90, avgMarks: 80 },
    ];

    res.json({
      stats: { totalStudents, totalTeachers, totalUsers, totalRevenue, pendingFees, avgPerformance, attendanceRate },
      fees,
      expenses,
      revenueByMonth,
      departments,
      leaveRequests,
      announcements,
      disciplinary,
      notifications,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/leave/:id', async (req, res) => {
  try {
    const leave = await LeaveRequest.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (leave) {
      await Notification.create({ userId: leave.userId, message: `Your leave request was ${req.body.status}`, type: req.body.status === 'approved' ? 'success' : 'warning' });
    }
    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/announcements', async (req, res) => {
  try {
    const ann = await Announcement.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(ann);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Student.deleteOne({ userId: req.params.id });
    await Teacher.deleteOne({ userId: req.params.id });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/disciplinary/:id', async (req, res) => {
  try {
    const issue = await DisciplinaryIssue.findByIdAndUpdate(req.params.id, { actionTaken: req.body.action, status: 'resolved' }, { new: true });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
