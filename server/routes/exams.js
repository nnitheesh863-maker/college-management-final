import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { createAndEmitNotification } from '../services/socketManager.js';
import Exam from '../models/Exam.js';
import Question from '../models/Question.js';
import ExamSubmission from '../models/ExamSubmission.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';
import User from '../models/User.js';

const router = Router();
router.use(authenticate);

// ─── Auto-evaluate MCQ on submission ───
function autoEvaluate(questions, answers) {
  let totalMcqMarks = 0;
  let obtainedMcqMarks = 0;

  const evaluated = answers.map((ans) => {
    const question = questions.find(
      (q) => q._id.toString() === ans.questionId.toString()
    );
    if (!question || question.type !== 'mcq') {
      return { ...ans, marksObtained: 0, isCorrect: false };
    }

    const isCorrect = String(ans.selectedOption) === String(question.correctAnswer);
    const marksObtained = isCorrect ? question.marks : 0;
    totalMcqMarks += question.marks;
    if (isCorrect) obtainedMcqMarks += question.marks;

    return { ...ans, marksObtained, isCorrect };
  });

  return { evaluated, obtainedMcqMarks, totalMcqMarks };
}

// ─── List exams (role-aware) ───
router.get('/', async (req, res) => {
  try {
    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user.id });
      if (!student) return res.status(404).json({ message: 'Student profile not found' });

      const exams = await Exam.find({
        grade: student.grade,
        status: { $in: ['published', 'active', 'completed'] },
      }).sort({ startTime: -1 });

      const submissions = await ExamSubmission.find({ userId: req.user.id });
      const subMap = {};
      for (const s of submissions) subMap[s.examId.toString()] = s;

      const result = exams.map((e) => ({
        ...e.toObject(),
        submission: subMap[e._id.toString()] || null,
      }));

      return res.json({ exams: result });
    }

    if (req.user.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: req.user.id });
      if (!teacher) return res.status(404).json({ message: 'Teacher profile not found' });

      const exams = await Exam.find({ teacherId: teacher._id }).sort({ createdAt: -1 });
      const result = [];
      for (const e of exams) {
        const submissionCount = await ExamSubmission.countDocuments({ examId: e._id });
        result.push({ ...e.toObject(), submissionCount });
      }
      return res.json({ exams: result });
    }

    if (req.user.role === 'principal') {
      const exams = await Exam.find().sort({ createdAt: -1 });
      return res.json({ exams });
    }

    res.status(403).json({ message: 'Invalid role' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Get single exam with questions ───
router.get('/:id', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    let questions;
    if (req.user.role === 'student') {
      // Students only see questions if exam is active
      if (exam.status !== 'published' && exam.status !== 'active' && exam.status !== 'completed') {
        return res.status(403).json({ message: 'Exam not available' });
      }
      // Check if student already submitted
      const student = await Student.findOne({ userId: req.user.id });
      if (student) {
        const submission = await ExamSubmission.findOne({ examId: exam._id, studentId: student._id });
        if (submission && submission.status === 'submitted') {
          // Return exam info + submission for review
          questions = await Question.find({ examId: exam._id }).sort({ order: 1 });
          return res.json({ exam, questions, submission });
        }
        if (submission && submission.status === 'in-progress') {
          // Resume exam
          questions = await Question.find({ examId: exam._id }).sort({ order: 1 });
          return res.json({ exam, questions, submission });
        }
      }
      questions = await Question.find({ examId: exam._id }).sort({ order: 1 });
      // Don't send correct answers to students
      const sanitized = questions.map((q) => {
        const obj = q.toObject();
        delete obj.correctAnswer;
        return obj;
      });
      return res.json({ exam, questions: sanitized });
    }

    // Teacher/principal sees everything
    questions = await Question.find({ examId: exam._id }).sort({ order: 1 });
    res.json({ exam, questions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Teacher: create exam ───
router.post('/', authorize('teacher'), async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: 'Teacher profile not found' });

    const { title, description, subject, grade, duration, startTime, endTime, shuffleQuestions, questions } = req.body;

    if (!title || !subject || !grade || !duration) {
      return res.status(400).json({ message: 'Title, subject, grade, and duration are required' });
    }

    let totalMarks = 0;
    if (questions && Array.isArray(questions)) {
      for (const q of questions) {
        if (!q.marks || q.marks < 0) return res.status(400).json({ message: 'Each question needs valid marks' });
        totalMarks += Number(q.marks);
      }
    }

    const exam = await Exam.create({
      teacherId: teacher._id,
      title,
      description: description || '',
      subject,
      grade,
      duration: Number(duration),
      totalMarks,
      startTime,
      endTime,
      shuffleQuestions: !!shuffleQuestions,
      status: 'draft',
    });

    // Create questions
    if (questions && Array.isArray(questions)) {
      const questionDocs = questions.map((q, i) => ({
        examId: exam._id,
        type: q.type,
        questionText: q.questionText,
        options: q.options || [],
        correctAnswer: q.type === 'mcq' ? q.correctAnswer : '',
        marks: Number(q.marks),
        order: i + 1,
      }));
      await Question.insertMany(questionDocs);
    }

    const populated = await Question.find({ examId: exam._id }).sort({ order: 1 });
    res.status(201).json({ exam, questions: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Teacher: publish exam ───
router.put('/:id/publish', authorize('teacher'), async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: 'Teacher profile not found' });

    const exam = await Exam.findOneAndUpdate(
      { _id: req.params.id, teacherId: teacher._id },
      { status: 'published' },
      { new: true }
    );
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    const students = await Student.find({ grade: exam.grade }).populate('userId', 'name');
    for (const s of students) {
      createAndEmitNotification({
        userId: s.userId._id,
        message: `New exam published: "${exam.title}" in ${exam.subject} (${exam.duration} min)`,
        type: 'info',
        category: 'system',
        link: '/student-dashboard',
      });
    }

    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Teacher: update exam ───
router.put('/:id', authorize('teacher'), async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: 'Teacher profile not found' });

    const exam = await Exam.findOne({ _id: req.params.id, teacherId: teacher._id });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    const { title, description, subject, grade, duration, startTime, endTime, shuffleQuestions, status } = req.body;
    if (title) exam.title = title;
    if (description !== undefined) exam.description = description;
    if (subject) exam.subject = subject;
    if (grade) exam.grade = grade;
    if (duration) exam.duration = Number(duration);
    if (startTime) exam.startTime = startTime;
    if (endTime) exam.endTime = endTime;
    if (shuffleQuestions !== undefined) exam.shuffleQuestions = shuffleQuestions;
    if (status) exam.status = status;

    await exam.save();
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Teacher: delete exam ───
router.delete('/:id', authorize('teacher'), async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: 'Teacher profile not found' });

    const exam = await Exam.findOneAndDelete({ _id: req.params.id, teacherId: teacher._id });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    await Question.deleteMany({ examId: exam._id });
    await ExamSubmission.deleteMany({ examId: exam._id });

    res.json({ message: 'Exam deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Student: start exam ───
router.post('/:id/start', authorize('student'), async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    // Check if already submitted
    let submission = await ExamSubmission.findOne({ examId: exam._id, studentId: student._id });
    if (submission && submission.status === 'submitted') {
      return res.status(400).json({ message: 'Already submitted this exam' });
    }

    if (submission && submission.status === 'in-progress') {
      // Resume existing
      const elapsed = Math.floor((Date.now() - new Date(submission.startedAt).getTime()) / 1000);
      const remaining = exam.duration * 60 - elapsed;
      return res.json({ submission, remaining: Math.max(0, remaining) });
    }

    // Create new submission
    const questions = await Question.find({ examId: exam._id }).sort({ order: 1 });
    const answers = questions.map((q) => ({
      questionId: q._id,
      selectedOption: '',
      textAnswer: '',
    }));

    submission = await ExamSubmission.create({
      examId: exam._id,
      studentId: student._id,
      userId: req.user.id,
      answers,
      totalMarks: exam.totalMarks,
      status: 'in-progress',
      startedAt: new Date(),
    });

    res.status(201).json({ submission, remaining: exam.duration * 60 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Save progress (anti-refresh: save periodically) ───
router.put('/:id/save', authorize('student'), async (req, res) => {
  try {
    const { answers } = req.body;
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const submission = await ExamSubmission.findOne({
      examId: req.params.id,
      studentId: student._id,
      status: 'in-progress',
    });
    if (!submission) return res.status(404).json({ message: 'No active exam session' });

    submission.answers = answers;
    await submission.save();

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Student: submit exam ───
router.post('/:id/submit', authorize('student'), async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const submission = await ExamSubmission.findOne({
      examId: exam._id,
      studentId: student._id,
      status: 'in-progress',
    });
    if (!submission) return res.status(400).json({ message: 'No active exam session' });

    // Use provided answers or existing ones
    const answers = req.body.answers || submission.answers;

    // Get questions for auto-evaluation
    const questions = await Question.find({ examId: exam._id });
    const { evaluated, obtainedMcqMarks } = autoEvaluate(questions, answers);

    const elapsed = Math.floor((Date.now() - new Date(submission.startedAt).getTime()) / 1000);

    submission.answers = evaluated;
    submission.obtainedMarks = obtainedMcqMarks;
    submission.percentage = exam.totalMarks > 0 ? Math.round((obtainedMcqMarks / exam.totalMarks) * 100) : 0;
    submission.status = 'submitted';
    submission.submittedAt = new Date();
    submission.timeTaken = elapsed;

    await submission.save();

    // Notify teacher
    const teacher = await Teacher.findById(exam.teacherId);
    if (teacher) {
      const teacherUser = await User.findById(teacher.userId);
      if (teacherUser) {
        createAndEmitNotification({
          userId: teacherUser._id,
          message: `${req.user.name} submitted "${exam.title}" — ${submission.obtainedMarks}/${exam.totalMarks}`,
          type: 'info',
          category: 'system',
          link: '/teacher-dashboard',
        });
      }
    }

    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Teacher: grade descriptive answers ───
router.put('/submissions/:submissionId/grade', authorize('teacher'), async (req, res) => {
  try {
    const { answers } = req.body;
    const submission = await ExamSubmission.findById(req.params.submissionId);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    let totalObtained = 0;
    for (const submitted of submission.answers) {
      const updated = answers.find(
        (a) => a.questionId === submitted.questionId.toString()
      );
      if (updated && updated.marksObtained !== undefined) {
        submitted.marksObtained = Number(updated.marksObtained);
        submitted.isCorrect = updated.marksObtained > 0;
      }
      totalObtained += submitted.marksObtained || 0;
    }

    submission.obtainedMarks = totalObtained;
    submission.percentage = submission.totalMarks > 0 ? Math.round((totalObtained / submission.totalMarks) * 100) : 0;
    submission.status = 'graded';
    await submission.save();

    const populated = await ExamSubmission.findById(submission._id)
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email' } });

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Teacher: get submissions for an exam ───
router.get('/:id/submissions', authorize('teacher'), async (req, res) => {
  try {
    const submissions = await ExamSubmission.find({ examId: req.params.id })
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email' } })
      .sort({ obtainedMarks: -1 });

    res.json({ submissions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Student: my results ───
router.get('/results/my', authorize('student'), async (req, res) => {
  try {
    const submissions = await ExamSubmission.find({ userId: req.user.id, status: { $in: ['submitted', 'graded'] } })
      .populate('examId', 'title subject totalMarks duration')
      .sort({ submittedAt: -1 });

    res.json({ submissions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Leaderboard for an exam ───
router.get('/:id/leaderboard', async (req, res) => {
  try {
    const submissions = await ExamSubmission.find({
      examId: req.params.id,
      status: { $in: ['submitted', 'graded'] },
    })
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email' } })
      .sort({ obtainedMarks: -1, timeTaken: 1 })
      .limit(50);

    const ranked = submissions.map((s, i) => ({
      rank: i + 1,
      name: s.studentId?.userId?.name || 'Student',
      marks: s.obtainedMarks,
      total: s.totalMarks,
      percentage: s.percentage,
      timeTaken: s.timeTaken,
    }));

    res.json({ leaderboard: ranked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Exam analytics (teacher dashboard) ───
router.get('/analytics/overview', authorize('teacher'), async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: 'Teacher profile not found' });

    const exams = await Exam.find({ teacherId: teacher._id });
    const totalExams = exams.length;
    let totalSubmissions = 0;
    let avgScore = 0;
    let scoreSum = 0;
    let scoreCount = 0;

    const examStats = [];
    for (const exam of exams) {
      const submissions = await ExamSubmission.find({
        examId: exam._id,
        status: { $in: ['submitted', 'graded'] },
      });
      totalSubmissions += submissions.length;
      for (const s of submissions) {
        scoreSum += s.obtainedMarks;
        scoreCount++;
      }

      const avg = submissions.length > 0
        ? Math.round(submissions.reduce((sum, s) => sum + s.percentage, 0) / submissions.length)
        : 0;

      examStats.push({
        examId: exam._id,
        title: exam.title,
        subject: exam.subject,
        totalStudents: submissions.length,
        averageScore: avg,
        maxScore: submissions.length > 0 ? Math.max(...submissions.map(s => s.obtainedMarks)) : 0,
      });
    }

    avgScore = scoreCount > 0 ? Math.round(scoreSum / scoreCount) : 0;

    const passThreshold = req.query.passThreshold || 40;
    let passed = 0;
    for (const exam of exams) {
      const subs = await ExamSubmission.find({
        examId: exam._id,
        status: { $in: ['submitted', 'graded'] },
      });
      passed += subs.filter(s => s.percentage >= passThreshold).length;
    }

    res.json({
      totalExams,
      totalSubmissions,
      avgScore,
      passRate: scoreCount > 0 ? Math.round((passed / scoreCount) * 100) : 0,
      examStats,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
