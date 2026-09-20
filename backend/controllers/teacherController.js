import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';
import Mark from '../models/Mark.js';
import Timetable from '../models/Timetable.js';
import Assignment from '../models/Assignment.js';
import Announcement from '../models/Announcement.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';

export const getTeacherDashboard = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id }).populate('userId', 'name email avatar');
    if (!teacher) return res.status(404).json({ message: 'Teacher profile not found' });

    const students = await Student.find({ grade: { $in: teacher.classesAssigned } }).populate('userId', 'name email');
    const timetable = await Timetable.find({ teacherId: teacher._id }).sort({ day: 1, period: 1 });
    const assignments = await Assignment.find({ createdBy: teacher._id }).sort({ dueDate: 1 });
    const announcements = await Announcement.find({ $or: [{ targetRole: 'all' }, { targetRole: 'teacher' }] }).sort({ createdAt: -1 }).limit(10);
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10);

    const studentIds = students.map(s => s._id);
    const marks = await Mark.find({ studentId: { $in: studentIds } });
    const attendanceRecords = await Attendance.find({ studentId: { $in: studentIds } }).sort({ date: -1 }).limit(100);

    res.json({
      teacher,
      students,
      timetable,
      assignments,
      announcements,
      notifications,
      marks,
      attendance: attendanceRecords,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { studentId, status, date, grade } = req.body;
    const attendance = await Attendance.findOneAndUpdate(
      { studentId, date: new Date(date) },
      { status, grade },
      { upsert: true, new: true }
    );
    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const submitMarks = async (req, res) => {
  try {
    const { studentId, subject, examType, marksObtained, totalMarks, grade } = req.body;
    const mark = await Mark.create({ studentId, subject, examType, marksObtained, totalMarks, grade });
    res.status(201).json(mark);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
