import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Attendance from '../models/Attendance.js';
import Mark from '../models/Mark.js';
import Fee from '../models/Fee.js';
import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';
import Parent from '../models/Parent.js';

export async function buildStudentContext(userId) {
  const user = await User.findById(userId);
  const student = await Student.findOne({ userId });
  if (!student) return 'Student profile not found.';

  const attendanceRecords = await Attendance.find({ studentId: student._id }).sort({ date: -1 }).limit(30);
  const totalDays = attendanceRecords.length;
  const presentDays = attendanceRecords.filter(a => a.status === 'present').length;
  const attendancePct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  const marks = await Mark.find({ studentId: student._id });
  const marksBySubject = {};
  for (const m of marks) {
    if (!marksBySubject[m.subject]) marksBySubject[m.subject] = [];
    marksBySubject[m.subject].push({ examType: m.examType, obtained: m.marksObtained, total: m.totalMarks });
  }

  const assignments = await Assignment.find({ grade: student.grade });
  const submissions = await Submission.find({ studentId: student._id });
  const submittedIds = submissions.map(s => s.assignmentId.toString());
  const pendingAssignments = assignments.filter(a => !submittedIds.includes(a._id.toString()));

  const fees = await Fee.find({ studentId: student._id }).sort({ dueDate: -1 });

  const ctx = [
    `STUDENT: ${user.name} (${student.rollNo}) | Grade ${student.grade}-${student.section}`,
    `ATTENDANCE: ${presentDays}/${totalDays} days present (${attendancePct}%)`,
    `RECENT ATTENDANCE:`,
    ...attendanceRecords.slice(0, 5).map(a => `  ${a.date.toISOString().split('T')[0]}: ${a.status}`),
    `MARKS:`,
    ...Object.entries(marksBySubject).map(([sub, exams]) =>
      `  ${sub}: ${exams.map(e => `${e.examType}=${e.obtained}/${e.total}`).join(', ')}`
    ),
    `PENDING ASSIGNMENTS: ${pendingAssignments.length}`,
    ...pendingAssignments.slice(0, 5).map(a => `  "${a.title}" due ${a.dueDate.toISOString().split('T')[0]}`),
    `FEE STATUS: ${student.feeStatus}`,
    ...fees.slice(0, 3).map(f => `  $${f.amount} due ${f.dueDate.toISOString().split('T')[0]} (${f.status})`),
  ].join('\n');
  return ctx;
}

export async function buildTeacherContext(userId) {
  const user = await User.findById(userId);
  const teacher = await Teacher.findOne({ userId });
  if (!teacher) return 'Teacher profile not found.';

  const classGrades = teacher.classesAssigned || [];
  let weakStudents = [];
  let classStats = [];

  for (const grade of classGrades) {
    const students = await Student.find({ grade });
    const studentIds = students.map(s => s._id);

    const marks = await Mark.find({ studentId: { $in: studentIds } });
    const avgPerStudent = {};
    for (const m of marks) {
      if (!avgPerStudent[m.studentId]) avgPerStudent[m.studentId] = { total: 0, count: 0, pct: 0 };
      avgPerStudent[m.studentId].total += (m.marksObtained / m.totalMarks) * 100;
      avgPerStudent[m.studentId].count += 1;
    }

    const studentsWithAvg = await Promise.all(
      students.map(async (s) => {
        const u = await User.findById(s.userId);
        const data = avgPerStudent[s._id];
        const avg = data && data.count > 0 ? Math.round(data.total / data.count) : 0;
        return { name: u?.name || 'Unknown', rollNo: s.rollNo, avg, grade };
      })
    );

    const weak = studentsWithAvg.filter(s => s.avg < 40);
    weakStudents.push(...weak);
    classStats.push({ grade, totalStudents: students.length, averagePct: Math.round(studentsWithAvg.reduce((a, s) => a + s.avg, 0) / (studentsWithAvg.length || 1)) });
  }

  const allAssignments = await Assignment.find({ teacherId: teacher._id });
  const submissionStats = await Promise.all(
    allAssignments.map(async (a) => {
      const subs = await Submission.find({ assignmentId: a._id });
      const total = subs.length;
      const graded = subs.filter(s => s.marks != null).length;
      return { title: a.title, total, graded, pending: total - graded };
    })
  );

  const ctx = [
    `TEACHER: ${user.name} | Subject: ${teacher.subject}`,
    `CLASSES: ${classGrades.join(', ') || 'None assigned'}`,
    `CLASS PERFORMANCE:`,
    ...classStats.map(c => `  Grade ${c.grade}: ${c.averagePct}% avg (${c.totalStudents} students)`),
    `WEAK STUDENTS (<40% avg):`,
    ...(weakStudents.length > 0
      ? weakStudents.map(s => `  ${s.name} (${s.rollNo}) - ${s.avg}% - Grade ${s.grade}`)
      : ['  None']),
    `ASSIGNMENTS:`,
    ...allAssignments.map(a => `  "${a.title}" due ${a.dueDate.toISOString().split('T')[0]}`),
    `SUBMISSION ANALYTICS:`,
    ...submissionStats.map(s => `  "${s.title}": ${s.total} submitted, ${s.graded} graded, ${s.pending} pending`),
  ].join('\n');
  return ctx;
}

export async function buildPrincipalContext() {
  const totalStudents = await Student.countDocuments();
  const totalTeachers = await Teacher.countDocuments();
  const totalFees = await Fee.find();
  const totalFeesAmount = totalFees.reduce((a, f) => a + f.amount, 0);
  const totalPaid = totalFees.reduce((a, f) => a + f.paidAmount, 0);
  const outstanding = totalFeesAmount - totalPaid;

  const attendanceRecords = await Attendance.find().sort({ date: -1 }).limit(200);
  const totalDays = attendanceRecords.length;
  const presentDays = attendanceRecords.filter(a => a.status === 'present').length;
  const absentDays = attendanceRecords.filter(a => a.status === 'absent').length;
  const leaveDays = attendanceRecords.filter(a => a.status === 'leave').length;

  const gradeWise = {};
  const students = await Student.find();
  for (const s of students) {
    if (!gradeWise[s.grade]) gradeWise[s.grade] = [];
    gradeWise[s.grade].push(s._id);
  }

  const gradeAttendance = {};
  for (const [grade, sids] of Object.entries(gradeWise)) {
    const recs = await Attendance.find({ studentId: { $in: sids } });
    const p = recs.filter(r => r.status === 'present').length;
    const total = recs.length;
    gradeAttendance[grade] = total > 0 ? Math.round((p / total) * 100) : 0;
  }

  const feesByStatus = { paid: 0, partial: 0, unpaid: 0 };
  for (const f of totalFees) feesByStatus[f.status] = (feesByStatus[f.status] || 0) + 1;

  const ctx = [
    `PRINCIPAL — COLLEGE OVERVIEW`,
    `STUDENTS: ${totalStudents}`,
    `TEACHERS: ${totalTeachers}`,
    `ATTENDANCE: ${presentDays} present, ${absentDays} absent, ${leaveDays} leave (${totalDays} records)`,
    `ATTENDANCE TRENDS:`,
    ...Object.entries(gradeAttendance).map(([g, pct]) => `  Grade ${g}: ${pct}%`),
    `REVENUE: Total Fees = $${totalFeesAmount}, Paid = $${totalPaid}, Outstanding = $${outstanding}`,
    `FEE DISTRIBUTION:`,
    ...Object.entries(feesByStatus).map(([s, c]) => `  ${s}: ${c}`),
    `GRADES: ${Object.keys(gradeWise).join(', ')}`,
  ].join('\n');
  return ctx;
}

export async function buildParentContext(userId) {
  const user = await User.findById(userId);
  const parent = await Parent.findOne({ userId });
  if (!parent) return 'Parent profile not found.';

  const childRecords = await Promise.all(
    (parent.children || []).map(async (childId) => {
      const student = await Student.findById(childId);
      if (!student) return '';
      const childUser = await User.findById(student.userId);
      const attendanceRecords = await Attendance.find({ studentId: student._id }).sort({ date: -1 }).limit(10);
      const present = attendanceRecords.filter(a => a.status === 'present').length;
      const marks = await Mark.find({ studentId: student._id });
      const fees = await Fee.find({ studentId: student._id }).sort({ dueDate: -1 }).limit(3);

      return [
        `CHILD: ${childUser?.name || 'Unknown'} (${student.rollNo}) - Grade ${student.grade}-${student.section}`,
        `  ATTENDANCE: ${present}/${attendanceRecords.length} present`,
        `  MARKS: ${marks.map(m => `${m.subject}=${m.marksObtained}/${m.totalMarks}`).join(', ') || 'No marks recorded'}`,
        `  FEE STATUS: ${student.feeStatus}`,
        ...fees.map(f => `  - $${f.amount} due ${f.dueDate.toISOString().split('T')[0]} (${f.status})`),
      ].join('\n');
    })
  );

  const ctx = [
    `PARENT: ${user.name}`,
    `CHILDREN (${parent.children?.length || 0}):`,
    ...childRecords.filter(Boolean),
  ].join('\n');
  return ctx;
}

export async function buildContext(user) {
  switch (user.role) {
    case 'student': return buildStudentContext(user.id);
    case 'teacher': return buildTeacherContext(user.id);
    case 'principal': return buildPrincipalContext();
    case 'parent': return buildParentContext(user.id);
    default: return `User role: ${user.role}. Respond to general college ERP queries.`;
  }
}
