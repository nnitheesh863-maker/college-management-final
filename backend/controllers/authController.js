import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';

export const register = async (req, res) => {
  let createdUser = null;
  try {
    const { name, email, password, role, rollNo, grade, subject } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(400).json({ message: 'Email is already registered. Please sign in or use another email.' });
    }

    const assignedRole = ['student', 'teacher', 'principal'].includes(role) ? role : 'student';
    createdUser = await User.create({ name: name.trim(), email: normalizedEmail, password, role: assignedRole });

    if (assignedRole === 'student') {
      const studentRoll = rollNo && rollNo.trim() ? rollNo.trim() : 'STU' + Date.now();
      const existingRoll = await Student.findOne({ rollNo: studentRoll });
      if (existingRoll) {
        await User.findByIdAndDelete(createdUser._id);
        return res.status(400).json({ message: `Roll number ${studentRoll} is already registered.` });
      }
      await Student.create({ userId: createdUser._id, rollNo: studentRoll, grade: grade || '10', section: 'A' });
    } else if (assignedRole === 'teacher') {
      await Teacher.create({ userId: createdUser._id, subject: subject || 'General', classesAssigned: [grade || '10'] });
    }

    const jwtSecret = process.env.JWT_SECRET || 'college_management_super_secret_jwt_key_2026';
    const token = jwt.sign(
      { id: createdUser._id, role: createdUser.role, name: createdUser.name },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({ token, user: createdUser.toJSON() });
  } catch (err) {
    if (createdUser && createdUser._id) {
      try { await User.findByIdAndDelete(createdUser._id); } catch {}
    }
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'Field';
      return res.status(400).json({ message: `${field} already exists` });
    }
    res.status(500).json({ message: err.message || 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'college_jwt_secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({ token, user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'No token' });
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'college_jwt_secret');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: user.toJSON() });
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
