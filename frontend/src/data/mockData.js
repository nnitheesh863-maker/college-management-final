export const STUDENT_GRADES = [
  { name: 'Alice Johnson', math: 92, physics: 88, chemistry: 78, cs: 95, english: 85 },
  { name: 'Bob Smith', math: 65, physics: 72, chemistry: 68, cs: 70, english: 74 },
  { name: 'Charlie Brown', math: 34, physics: 45, chemistry: 38, cs: 42, english: 55 },
  { name: 'Diana Prince', math: 88, physics: 91, chemistry: 85, cs: 89, english: 90 },
  { name: 'Grace Lee', math: 95, physics: 93, chemistry: 90, cs: 97, english: 92 },
  { name: 'Ivy Chen', math: 30, physics: 35, chemistry: 28, cs: 40, english: 32 },
];

export const TOP_PERFORMERS = [
  { name: 'Grace Lee', score: 93 },
  { name: 'Diana Prince', score: 89 },
  { name: 'Alice Johnson', score: 88 },
  { name: 'Jack Brown', score: 85 },
];

export const NEEDS_ATTENTION = [
  { name: 'Ivy Chen', score: 33 },
  { name: 'Charlie Brown', score: 43 },
  { name: 'Frank Miller', score: 30 },
  { name: 'Henry Davis', score: 35 },
];

export const ALERTS_DATA = [
  { student: 'Ivy Chen', detail: 'Failed: 33% average', severity: 'critical' },
  { student: 'Charlie Brown', detail: 'Failed: 43% average', severity: 'critical' },
  { student: 'Henry Davis', detail: 'Attendance dropped to 73%', severity: 'warning' },
  { student: 'Frank Miller', detail: 'Attendance dropped to 70%', severity: 'warning' },
];

export const ASSIGNMENTS_DATA = [
  { title: 'Calculus Homework', subject: 'Mathematics', due: '2026-06-01', status: 'active' },
  { title: 'Physics Lab Report', subject: 'Physics', due: '2026-05-28', status: 'active' },
  { title: 'Data Structures', subject: 'CS', due: '2026-06-05', status: 'active' },
  { title: 'Chemistry Essay', subject: 'Chemistry', due: '2026-06-10', status: 'pending' },
  { title: 'English Literature Review', subject: 'English', due: '2026-06-15', status: 'pending' },
];

export const TIMETABLE_DATA = [
  { day: 'Monday', periods: ['Math', 'Physics', 'Chemistry', 'Lunch', 'CS', 'English'] },
  { day: 'Tuesday', periods: ['Physics', 'Math', 'English', 'Lunch', 'Chemistry', 'CS'] },
  { day: 'Wednesday', periods: ['Chemistry', 'CS', 'Math', 'Lunch', 'English', 'Physics'] },
  { day: 'Thursday', periods: ['English', 'Chemistry', 'Physics', 'Lunch', 'Math', 'CS'] },
  { day: 'Friday', periods: ['CS', 'English', 'Math', 'Lunch', 'Physics', 'Chemistry'] },
];

export const FEE_RECORDS = [
  { id: 'FEE-001', student: 'Alice Johnson', amount: 25000, paid: 25000, due: '2026-04-15', status: 'paid' },
  { id: 'FEE-002', student: 'Bob Smith', amount: 25000, paid: 15000, due: '2026-04-15', status: 'partial' },
  { id: 'FEE-003', student: 'Charlie Brown', amount: 25000, paid: 0, due: '2026-04-15', status: 'unpaid' },
  { id: 'FEE-004', student: 'Diana Prince', amount: 25000, paid: 25000, due: '2026-04-15', status: 'paid' },
  { id: 'FEE-005', student: 'Grace Lee', amount: 25000, paid: 25000, due: '2026-04-15', status: 'paid' },
  { id: 'FEE-006', student: 'Ivy Chen', amount: 25000, paid: 5000, due: '2026-04-15', status: 'partial' },
];

export const EVENTS_DATA = [
  { title: 'Science Fair', date: '2026-06-10', type: 'academic', description: 'Annual science exhibition' },
  { title: 'Sports Day', date: '2026-06-20', type: 'sports', description: 'Inter-house sports competition' },
  { title: 'Parent-Teacher Meet', date: '2026-06-25', type: 'meeting', description: 'Quarterly review' },
  { title: 'Cultural Fest', date: '2026-07-05', type: 'cultural', description: 'Annual cultural festival' },
];

export const FACULTY_DATA = [
  { name: 'Dr. Sarah Wilson', subject: 'Mathematics', email: 'sarah@university.edu', students: 45, rating: 4.8 },
  { name: 'Prof. James Miller', subject: 'Physics', email: 'james@university.edu', students: 42, rating: 4.6 },
  { name: 'Dr. Emily Davis', subject: 'Chemistry', email: 'emily@university.edu', students: 38, rating: 4.7 },
  { name: 'Prof. Michael Brown', subject: 'Computer Science', email: 'michael@university.edu', students: 40, rating: 4.9 },
  { name: 'Dr. Lisa Anderson', subject: 'English', email: 'lisa@university.edu', students: 44, rating: 4.5 },
];

export const SIDEBAR_ITEMS = [
  { id: 'overview', icon: '📊', label: 'Overview' },
  { id: 'analytics', icon: '📈', label: 'Analytics' },
  { id: 'attendance', icon: '📅', label: 'Attendance' },
  { id: 'assignments', icon: '📝', label: 'Assignments' },
  { id: 'timetable', icon: '⏰', label: 'Time Table' },
  { id: 'students', icon: '👥', label: 'Students' },
  { id: 'fees', icon: '💰', label: 'Fee Management' },
  { id: 'faculty', icon: '👨‍🏫', label: 'Faculty' },
  { id: 'events', icon: '🎉', label: 'Events' },
  { id: 'alerts', icon: '🚨', label: 'Alerts' },
];

export const STAT_CARDS = [
  { icon: '👥', label: 'Total Students', key: 'total_students', color: 'from-violet-600/40 to-fuchsia-600/20', border: 'border-violet-500/40' },
  { icon: '✅', label: 'Present Today', key: 'present_today', color: 'from-emerald-600/40 to-teal-600/20', border: 'border-emerald-500/40' },
  { icon: '❌', label: 'Absent Today', key: 'absent_today', color: 'from-rose-600/40 to-pink-600/20', border: 'border-rose-500/40' },
  { icon: '📊', label: 'Attendance %', key: 'percent', color: 'from-amber-600/40 to-orange-600/20', border: 'border-amber-500/40' },
  { icon: '📝', label: 'Pending Grading', key: 'pending', color: 'from-blue-600/40 to-cyan-600/20', border: 'border-blue-500/40' },
  { icon: '⚠️', label: 'Need Attention', key: 'attention', color: 'from-red-600/40 to-rose-600/20', border: 'border-red-500/40' },
];

export const SUBJECT_COLORS = {
  Math: '#a855f7',
  Physics: '#ec4899',
  Chemistry: '#3b82f6',
  CS: '#06b6d4',
  English: '#f59e0b',
  Mathematics: '#a855f7',
};
