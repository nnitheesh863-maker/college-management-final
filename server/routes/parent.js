import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import Parent from '../models/Parent.js';
import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';
import Mark from '../models/Mark.js';
import Fee from '../models/Fee.js';
import Timetable from '../models/Timetable.js';
import DisciplinaryIssue from '../models/DisciplinaryIssue.js';
import Announcement from '../models/Announcement.js';
import Notification from '../models/Notification.js';

const router = Router();
router.use(authenticate, authorize('parent'));

// GET /api/parent/dashboard — all linked children data
router.get('/dashboard', async (req, res) => {
  try {
    const parent = await Parent.findOne({ userId: req.user.id }).populate({
      path: 'children',
      populate: { path: 'userId', select: 'name email avatar' },
    });
    if (!parent) return res.status(404).json({ message: 'Parent profile not found' });

    const children = parent.children || [];
    const results = [];

    for (const student of children) {
      const studentId = student._id;

      const [attendanceRecords, marks, fees, timetable, disciplinary] = await Promise.all([
        Attendance.find({ studentId }).sort({ date: -1 }).limit(60),
        Mark.find({ studentId }).sort({ createdAt: -1 }),
        Fee.find({ studentId: student._id }).sort({ dueDate: -1 }).limit(5),
        Timetable.find({ grade: student.grade }).sort({ day: 1, period: 1 }),
        DisciplinaryIssue.find({ studentId }).sort({ date: -1 }),
      ]);

      const totalDays = attendanceRecords.length;
      const presentDays = attendanceRecords.filter((a) => a.status === 'present').length;
      const attendancePercent = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

      const allMarks = marks.map((m) => ({
        subject: m.subject, marksObtained: m.marksObtained, totalMarks: m.totalMarks, grade: m.grade, examType: m.examType,
      }));
      const avgMarks = allMarks.length > 0
        ? Math.round(allMarks.reduce((s, m) => s + (m.marksObtained / m.totalMarks) * 100, 0) / allMarks.length)
        : 0;

      results.push({
        student: {
          _id: student._id,
          name: student.userId?.name || 'Student',
          email: student.userId?.email || '',
          rollNo: student.rollNo,
          grade: student.grade,
          section: student.section,
        },
        attendance: { records: attendanceRecords, percent: attendancePercent, present: presentDays, total: totalDays },
        marks: allMarks,
        avgMarks,
        fees,
        timetable,
        disciplinary,
        weakSubjects: allMarks.filter((m) => (m.marksObtained / m.totalMarks) * 100 < 35),
        attendanceWarning: attendancePercent < 75,
      });
    }

    const announcements = await Announcement.find({
      $or: [{ targetRole: 'all' }, { targetRole: 'parent' }, { targetRole: 'student' }],
    }).sort({ createdAt: -1 }).limit(10);

    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10);

    res.json({
      parentName: req.user.name,
      children: results,
      announcements,
      notifications,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/parent/children — list linked children (summary)
router.get('/children', async (req, res) => {
  try {
    const parent = await Parent.findOne({ userId: req.user.id }).populate({
      path: 'children',
      populate: { path: 'userId', select: 'name email avatar' },
    });
    if (!parent) return res.status(404).json({ message: 'Parent profile not found' });

    res.json({ children: parent.children || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
