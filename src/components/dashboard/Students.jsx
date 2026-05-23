import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useApp } from '../../context/AppContext';
import GlassCard, { GlassCardContent } from '../ui/GlassCard';
import AnimatedTable from '../ui/AnimatedTable';
import AnimatedButton from '../ui/AnimatedButton';
import ScrollReveal from '../animations/ScrollReveal';

export default function Students({ initialShowForm = false }) {
  const { students, setStudents, refresh } = useApp();
  const [showForm, setShowForm] = useState(initialShowForm);
  const [form, setForm] = useState({ name: '', roll_number: '', email: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:5001/api/students', form);
      setMessage(res.data.message);
      setForm({ name: '', roll_number: '', email: '' });
      refresh();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.message || err.message));
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold glow-text">👥 Students</h2>
          <AnimatedButton variant="primary" onClick={() => setShowForm(!showForm)}>
            ➕ Add Student
          </AnimatedButton>
        </div>
      </ScrollReveal>

      {showForm && (
        <ScrollReveal>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 rounded-2xl p-6 border border-purple-500/20"
          >
            <h3 className="font-bold text-lg mb-4 text-purple-200">Register Student</h3>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
              {[
                { name: 'name', placeholder: 'Full Name', type: 'text', required: true },
                { name: 'roll_number', placeholder: 'Roll Number', type: 'text', required: true },
                { name: 'email', placeholder: 'Email', type: 'email', required: false },
              ].map((field) => (
                <input
                  key={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 transition-all"
                  required={field.required}
                />
              ))}
              <AnimatedButton type="submit" variant="primary" className="w-full">Add</AnimatedButton>
            </form>
          </motion.div>
        </ScrollReveal>
      )}

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl text-center font-semibold ${
            message.includes('Error')
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}
        >
          {message}
        </motion.div>
      )}

      <ScrollReveal delay={0.1}>
        <GlassCard hoverable glow>
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <h3 className="text-white/80 font-semibold flex items-center gap-2">👥 All Students</h3>
            <span className="text-white/40 text-xs">{students.length} registered</span>
          </div>
          <GlassCardContent>
            <AnimatedTable
              headers={['Name', 'Roll', 'Email']}
              rows={students}
              renderRow={(s) => (
                <>
                  <td className="p-3 font-medium text-white/90">{s.name}</td>
                  <td className="p-3">{s.roll_number}</td>
                  <td className="p-3 text-white/50">{s.email}</td>
                </>
              )}
              emptyMessage="No students registered."
            />
          </GlassCardContent>
        </GlassCard>
      </ScrollReveal>
    </div>
  );
}
