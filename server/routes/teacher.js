import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { createAndEmitNotification } from '../services/socketManager.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';
import Mark from '../models/Mark.js';
import Attendance from '../models/Attendance.js';
import Assignment from '../models/Assignment.js';
import DisciplinaryIssue from '../models/DisciplinaryIssue.js';
import LeaveRequest from '../models/LeaveRequest.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Timetable from '../models/Timetable.js';

const router = Router();
router.use(authenticate, authorize('teacher'));

router.get('/dashboard', async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id }).populate('userId', 'name email avatar');
    if (!teacher) return res.status(404).json({ message: 'Teacher profile not found' });

    const allStudents = await Student.find({ grade: { $in: teacher.classesAssigned } }).populate('userId', 'name email');
    const marks = await Mark.find().populate('studentId');
    const _attendanceRecords = await Attendance.find().populate('studentId').sort({ date: -1 }).limit(100);
    const assignments = await Assignment.find({ teacherId: teacher._id }).sort({ createdAt: -1 });
    const timetable = await Timetable.find({ teacherId: teacher._id }).sort({ day: 1, period: 1 });
    const leaveRequests = await LeaveRequest.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10);
    const disciplinary = await DisciplinaryIssue.find().populate('studentId').sort({ date: -1 }).limit(20);

    // Weak students (marks < 35)
    const weakStudents = [];
    for (const student of allStudents) {
      const sMarks = await Mark.find({ studentId: student._id });
      for (const m of sMarks) {
        if ((m.marksObtained / m.totalMarks) * 100 < 35) {
          weakStudents.push({ student, subject: m.subject, marks: m.marksObtained, total: m.totalMarks, percent: Math.round((m.marksObtained / m.totalMarks) * 100) });
        }
      }
    }

    // Low attendance students (< 75%)
    const lowAttendance = [];
    for (const student of allStudents) {
      const sAtt = await Attendance.find({ studentId: student._id });
      if (sAtt.length > 0) {
        const present = sAtt.filter(a => a.status === 'present').length;
        const pct = Math.round((present / sAtt.length) * 100);
        if (pct < 75) lowAttendance.push({ student, percent: pct, present, total: sAtt.length });
      }
    }

    // Class stats
    const classStats = {};
    for (const student of allStudents) {
      const sMarks = await Mark.find({ studentId: student._id });
      for (const m of sMarks) {
        if (!classStats[m.subject]) classStats[m.subject] = { total: 0, count: 0 };
        classStats[m.subject].total += (m.marksObtained / m.totalMarks) * 100;
        classStats[m.subject].count++;
      }
    }
    const subjectAverages = Object.entries(classStats).map(([subject, data]) => ({
      subject,
      average: Math.round(data.total / data.count),
    }));

    res.json({
      teacher,
      allStudents,
      marks,
      assignments,
      timetable,
      leaveRequests,
      notifications,
      disciplinary,
      weakStudents,
      lowAttendance,
      subjectAverages,
      studentCount: allStudents.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/marks', async (req, res) => {
  try {
    const { studentId, subject, examType, marksObtained, totalMarks } = req.body;
    const mark = await Mark.create({ studentId, subject, examType, marksObtained, totalMarks });

    const student = await Student.findById(studentId).populate('userId', 'name');
    if (student) {
      const percent = Math.round((marksObtained / totalMarks) * 100);
      createAndEmitNotification({
        userId: student.userId._id,
        message: `Your ${examType} marks for ${subject}: ${marksObtained}/${totalMarks} (${percent}%)`,
        type: percent < 35 ? 'alert' : percent < 60 ? 'warning' : 'success',
        category: 'assignment',
        link: '/student-dashboard',
      });
    }

    res.status(201).json(mark);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/attendance', async (req, res) => {
  try {
    const { studentId, date, status, grade } = req.body;
    const att = await Attendance.findOneAndUpdate(
      { studentId, date: new Date(date) },
      { studentId, date: new Date(date), status, grade },
      { upsert: true, new: true }
    );
    res.status(201).json(att);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/assignments', async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    const assignment = await Assignment.create({ ...req.body, teacherId: teacher._id });

    const students = await Student.find({ grade: assignment.grade }).populate('userId', 'name');
    for (const s of students) {
      createAndEmitNotification({
        userId: s.userId._id,
        message: `New assignment: "${assignment.title}" in ${assignment.subject} — due ${new Date(assignment.dueDate).toLocaleDateString()}`,
        type: 'info',
        category: 'assignment',
        link: '/student-dashboard',
      });
    }

    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/disciplinary', async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    const issue = await DisciplinaryIssue.create({ ...req.body, raisedBy: teacher._id });

    const principals = await User.find({ role: 'principal' });
    const student = await Student.findById(req.body.studentId).populate('userId', 'name');
    for (const p of principals) {
      createAndEmitNotification({
        userId: p._id,
        message: `Disciplinary issue raised for ${student?.userId?.name || 'a student'}: ${issue.description?.substring(0, 100)}`,
        type: 'alert',
        category: 'disciplinary',
        link: '/principal-dashboard',
      });
    }

    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/messages', async (req, res) => {
  try {
    const msg = await Message.create({ fromUserId: req.user.id, ...req.body });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
