import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Student from './models/Student.js';
import Teacher from './models/Teacher.js';
import Fee from './models/Fee.js';
import Attendance from './models/Attendance.js';
import Mark from './models/Mark.js';
import Notification from './models/Notification.js';
import Announcement from './models/Announcement.js';
import Timetable from './models/Timetable.js';
import Assignment from './models/Assignment.js';

async function seed() {
  await connectDB();
  await Promise.all([
    User.deleteMany({}), Student.deleteMany({}), Teacher.deleteMany({}),
    Fee.deleteMany({}), Attendance.deleteMany({}), Mark.deleteMany({}),
    Notification.deleteMany({}), Announcement.deleteMany({}), Timetable.deleteMany({}),
    Assignment.deleteMany({}),
  ]);

  // Create users
  const studentUser = await User.create({ name: 'Alice Johnson', email: 'alice@demo.edu', password: 'password123', role: 'student' });
  const teacherUser = await User.create({ name: 'Dr. Sarah Wilson', email: 'sarah@demo.edu', password: 'password123', role: 'teacher' });
  const principalUser = await User.create({ name: 'Dr. James Principal', email: 'james@demo.edu', password: 'password123', role: 'principal' });

  // Create student profiles
  const student = await Student.create({
    userId: studentUser._id, rollNo: 'STU101', grade: '10', section: 'A',
    parentContact: '+1-555-0101',
    achievements: [
      { title: 'Math Olympiad Winner', date: new Date('2026-01-15'), icon: '🏆' },
      { title: 'Perfect Attendance', date: new Date('2026-03-01'), icon: '🎯' },
    ],
    disciplinaryRecords: [],
  });

  // More students for teacher views
  const student2 = await User.create({ name: 'Bob Smith', email: 'bob@demo.edu', password: 'password123', role: 'student' });
  const student3 = await User.create({ name: 'Charlie Brown', email: 'charlie@demo.edu', password: 'password123', role: 'student' });
  const student4 = await User.create({ name: 'Diana Prince', email: 'diana@demo.edu', password: 'password123', role: 'student' });
  const student5 = await User.create({ name: 'Grace Lee', email: 'grace@demo.edu', password: 'password123', role: 'student' });

  const studentProfiles = [
    { userId: student2._id, rollNo: 'STU102', grade: '10', section: 'A' },
    { userId: student3._id, rollNo: 'STU103', grade: '10', section: 'A' },
    { userId: student4._id, rollNo: 'STU104', grade: '10', section: 'A' },
    { userId: student5._id, rollNo: 'STU105', grade: '10', section: 'A' },
  ];
  await Student.insertMany(studentProfiles);
  const allStudents = await Student.find();

  // Teacher profile
  const teacher = await Teacher.create({
    userId: teacherUser._id, subject: 'Mathematics', classesAssigned: ['10', '10A'], salary: 60000, performanceRating: 4.8,
  });

  // Fees
  const feeData = allStudents.map((s, i) => ({
    userId: s.userId, studentId: s._id, amount: 25000, dueDate: new Date('2026-06-15'),
    status: i % 3 === 0 ? 'paid' : i % 3 === 1 ? 'partial' : 'unpaid',
    paidAmount: i % 3 === 0 ? 25000 : i % 3 === 1 ? 15000 : 0,
    transactionId: i % 3 === 0 ? 'TXN' + Date.now() + i : '',
  }));
  await Fee.insertMany(feeData);

  // Attendance
  const subjects = ['Math', 'Physics', 'Chemistry', 'CS', 'English'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  for (const student of allStudents) {
    for (let d = 0; d < 30; d++) {
      const date = new Date();
      date.setDate(date.getDate() - d);
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      await Attendance.create({
        studentId: student._id, date, status: Math.random() > 0.15 ? 'present' : 'absent', grade: '10',
      });
    }
  }

  // Marks
  for (const student of allStudents) {
    for (const subject of subjects) {
      const marksObtained = student.rollNo === 'STU103' ? Math.floor(Math.random() * 25) + 10 : Math.floor(Math.random() * 40) + 60;
      const totalMarks = 100;
      const grade = marksObtained >= 90 ? 'A+' : marksObtained >= 75 ? 'A' : marksObtained >= 50 ? 'B' : marksObtained >= 35 ? 'C' : 'F';
      await Mark.create({
        studentId: student._id, subject, examType: 'midterm', marksObtained, totalMarks, grade,
      });
    }
  }

  // Timetable
  let period = 0;
  for (const day of days) {
    for (let p = 1; p <= 6; p++) {
      const subj = subjects[period % subjects.length];
      await Timetable.create({ grade: '10', day, period: p, subject: subj, teacherId: teacher._id });
      period++;
    }
  }

  // Assignments
  await Assignment.insertMany([
    { teacherId: teacher._id, subject: 'Mathematics', title: 'Calculus & Integration Problem Set', description: 'Complete exercises 4.1 through 4.5 on definite integrals.', dueDate: new Date('2026-06-01'), grade: '10' },
    { teacherId: teacher._id, subject: 'Physics', title: 'Electromagnetism Lab Report', description: 'Submit the formal lab report for Experiment 3 (Magnetic Field Mapping).', dueDate: new Date('2026-05-28'), grade: '10' },
    { teacherId: teacher._id, subject: 'Computer Science', title: 'Data Structures: Binary Trees & BST', description: 'Implement insert, search, and in-order traversal in C++ / Java / Python.', dueDate: new Date('2026-06-05'), grade: '10' },
    { teacherId: teacher._id, subject: 'Chemistry', title: 'Organic Chemistry Reactions Essay', description: 'Analyze nucleophilic addition mechanisms with reaction diagrams.', dueDate: new Date('2026-06-10'), grade: '10' },
    { teacherId: teacher._id, subject: 'English', title: 'Shakespearean Literature Analysis', description: 'Write a 1000-word critical review of Hamlet Act III.', dueDate: new Date('2026-06-15'), grade: '10' },
  ]);

  // Announcements
  await Announcement.insertMany([
    { title: '📢 Exam Schedule Published', description: 'Final exams start June 1st. Check timetable.', targetRole: 'all', createdBy: principalUser._id },
    { title: '🏆 Science Fair Next Week', description: 'Annual science exhibition on Friday. All participants report to lab.', targetRole: 'student', createdBy: teacherUser._id },
    { title: '📅 Parent-Teacher Meeting', description: 'Quarterly review meeting on June 25th at 10 AM.', targetRole: 'teacher', createdBy: principalUser._id },
  ]);

  // Notifications
  await Notification.insertMany([
    { userId: studentUser._id, message: '📚 New assignment: Calculus Homework due June 1st', type: 'info' },
    { userId: studentUser._id, message: '💰 Fee payment due: ₹25,000 by June 15th', type: 'warning' },
    { userId: teacherUser._id, message: '✅ Leave request approved', type: 'success' },
    { userId: principalUser._id, message: '📊 Monthly report ready for review', type: 'info' },
  ]);

  console.log('✅ Seed data inserted');
  console.log(`   Student: alice@demo.edu / password123`);
  console.log(`   Teacher: sarah@demo.edu / password123`);
  console.log(`   Principal: james@demo.edu / password123`);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
