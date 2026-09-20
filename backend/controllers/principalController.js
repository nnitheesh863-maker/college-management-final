import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Fee from '../models/Fee.js';
import Attendance from '../models/Attendance.js';
import Mark from '../models/Mark.js';
import Announcement from '../models/Announcement.js';
import DisciplinaryIssue from '../models/DisciplinaryIssue.js';
import LeaveRequest from '../models/LeaveRequest.js';

export const getPrincipalDashboard = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const allFees = await Fee.find();
    const totalRevenue = allFees.reduce((s, f) => s + (f.paidAmount || 0), 0);
    const pendingFees = allFees.reduce((s, f) => s + ((f.amount || 0) - (f.paidAmount || 0)), 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttendance = await Attendance.find({ date: { $gte: today } });
    const todayPresent = todayAttendance.filter(a => a.status === 'present').length;
    const todayAttendanceRate = todayAttendance.length > 0 ? Math.round((todayPresent / todayAttendance.length) * 100) : 88;

    const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(10);
    const pendingLeaves = await LeaveRequest.find({ status: 'pending' }).populate('userId', 'name email role');
    const disciplinary = await DisciplinaryIssue.find().populate('studentId').sort({ date: -1 }).limit(10);
    const teachers = await Teacher.find().populate('userId', 'name email');

    res.json({
      stats: {
        totalStudents,
        totalTeachers,
        totalRevenue,
        pendingFees,
        todayAttendanceRate,
      },
      announcements,
      pendingLeaves,
      disciplinary,
      teachers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const { title, description, targetRole } = req.body;
    const announcement = await Announcement.create({
      title,
      description,
      targetRole: targetRole || 'all',
      createdBy: req.user.id,
    });
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
