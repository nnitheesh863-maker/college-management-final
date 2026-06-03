import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { createAndEmitNotification } from '../services/socketManager.js';
import { upload, handleUploadError } from '../middleware/upload.js';
import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import User from '../models/User.js';

const router = Router();
router.use(authenticate);

// ─── Student: list assignments for their grade ───
router.get('/', async (req, res) => {
  try {
    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user.id });
      if (!student) return res.status(404).json({ message: 'Student profile not found' });

      const assignments = await Assignment.find({ grade: student.grade })
        .populate('teacherId', 'subject')
        .sort({ dueDate: 1 });

      const submissions = await Submission.find({ userId: req.user.id });
      const subMap = {};
      for (const s of submissions) subMap[s.assignmentId.toString()] = s;

      const result = assignments.map((a) => {
        const sub = subMap[a._id.toString()];
        const isSubmitted = !!sub;
        const deadlinePassed = new Date(a.dueDate) < new Date();
        return {
          ...a.toObject(),
          submission: sub || null,
          canSubmit: !isSubmitted,
          deadlinePassed,
        };
      });

      return res.json({ assignments: result });
    }

    if (req.user.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: req.user.id });
      if (!teacher) return res.status(404).json({ message: 'Teacher profile not found' });

      const assignments = await Assignment.find({ teacherId: teacher._id })
        .sort({ createdAt: -1 });

      const result = [];
      for (const a of assignments) {
        const submissionCount = await Submission.countDocuments({ assignmentId: a._id });
        const gradedCount = await Submission.countDocuments({ assignmentId: a._id, marks: { $ne: null } });
        result.push({ ...a.toObject(), submissionCount, gradedCount });
      }

      return res.json({ assignments: result });
    }

    if (req.user.role === 'principal') {
      const assignments = await Assignment.find()
        .populate('teacherId', 'subject')
        .sort({ createdAt: -1 });
      return res.json({ assignments });
    }

    res.status(403).json({ message: 'Invalid role' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Teacher: get submissions for a specific assignment ───
router.get('/:id/submissions', authorize('teacher'), async (req, res) => {
  try {
    const submissions = await Submission.find({ assignmentId: req.params.id })
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email' },
      })
      .sort({ createdAt: -1 });

    res.json({ submissions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Student: get my submissions ───
router.get('/my-submissions', authorize('student'), async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user.id })
      .populate({
        path: 'assignmentId',
        select: 'title subject dueDate',
      })
      .sort({ createdAt: -1 });

    res.json({ submissions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Teacher: create assignment ───
router.post('/', authorize('teacher'), upload.single('file'), handleUploadError, async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: 'Teacher profile not found' });

    const { title, description, subject, dueDate, grade } = req.body;

    if (!title || !subject || !dueDate || !grade) {
      return res.status(400).json({ message: 'Title, subject, dueDate, and grade are required' });
    }

    const assignment = await Assignment.create({
      teacherId: teacher._id,
      title,
      description: description || '',
      subject,
      dueDate,
      grade,
      fileUrl: req.file?.path || '',
    });

    // Notify students in this grade
    const students = await Student.find({ grade }).populate('userId', 'name');
    for (const s of students) {
      createAndEmitNotification({
        userId: s.userId._id,
        message: `New assignment: "${title}" in ${subject} — due ${new Date(dueDate).toLocaleDateString()}`,
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

// ─── Student: submit assignment ───
router.post('/:id/submit', authorize('student'), upload.single('file'), handleUploadError, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    if (!req.file) return res.status(400).json({ message: 'File is required' });

    // Check if already submitted
    const existing = await Submission.findOne({ assignmentId: assignment._id, studentId: student._id });
    if (existing) {
      return res.status(400).json({ message: 'Already submitted. Ask your teacher to allow resubmission.' });
    }

    // Determine if late
    const isLate = new Date() > new Date(assignment.dueDate);
    if (isLate) {
      // Still allow submission but mark as late
    }

    const submission = await Submission.create({
      assignmentId: assignment._id,
      studentId: student._id,
      userId: req.user.id,
      fileUrl: req.file.path,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      status: isLate ? 'late' : 'submitted',
    });

    // Notify teacher
    const teacher = await Teacher.findById(assignment.teacherId);
    if (teacher) {
      const teacherUser = await User.findById(teacher.userId);
      if (teacherUser) {
        createAndEmitNotification({
          userId: teacherUser._id,
          message: `${req.user.name} submitted "${assignment.title}"${isLate ? ' (late)' : ''}`,
          type: isLate ? 'warning' : 'success',
          category: 'assignment',
          link: '/teacher-dashboard',
        });
      }
    }

    res.status(201).json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Teacher: grade submission ───
router.put('/submissions/:submissionId/grade', authorize('teacher'), async (req, res) => {
  try {
    const { marks, feedback } = req.body;
    if (marks === undefined || marks === null) {
      return res.status(400).json({ message: 'Marks are required' });
    }

    const submission = await Submission.findById(req.params.submissionId);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.marks = marks;
    if (feedback !== undefined) submission.feedback = feedback;
    submission.gradedAt = new Date();
    await submission.save();

    // Notify student
    createAndEmitNotification({
      userId: submission.userId,
      message: `Your submission for "${(await Assignment.findById(submission.assignmentId))?.title}" was graded: ${marks} marks`,
      type: marks >= 50 ? 'success' : marks >= 35 ? 'warning' : 'alert',
      category: 'assignment',
      link: '/student-dashboard',
    });

    // Populate for response
    const populated = await Submission.findById(submission._id).populate({
      path: 'studentId',
      populate: { path: 'userId', select: 'name email' },
    });

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Teacher: update assignment (file + fields) ───
router.put('/:id', authorize('teacher'), upload.single('file'), handleUploadError, async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: 'Teacher profile not found' });

    const assignment = await Assignment.findOne({ _id: req.params.id, teacherId: teacher._id });
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const { title, description, subject, dueDate, grade } = req.body;
    if (title) assignment.title = title;
    if (description !== undefined) assignment.description = description;
    if (subject) assignment.subject = subject;
    if (dueDate) assignment.dueDate = dueDate;
    if (grade) assignment.grade = grade;
    if (req.file) assignment.fileUrl = req.file.path;

    await assignment.save();
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Teacher: delete assignment ───
router.delete('/:id', authorize('teacher'), async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: 'Teacher profile not found' });

    const assignment = await Assignment.findOneAndDelete({ _id: req.params.id, teacherId: teacher._id });
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    // Delete all submissions for this assignment
    await Submission.deleteMany({ assignmentId: assignment._id });

    res.json({ message: 'Assignment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
