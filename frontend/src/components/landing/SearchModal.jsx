import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaTimes, FaGraduationCap, FaCalendarAlt, FaBook, FaUserCheck } from 'react-icons/fa';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickLinks = [
    { label: 'Computer Science & AI Major', icon: <FaBook className="text-[#8B1538]" />, link: '#programs' },
    { label: 'Undergraduate Tuition Schedule', icon: <FaUserCheck className="text-emerald-400" />, link: '#tuition' },
    { label: 'Fall 2026 Admissions Portal', icon: <FaGraduationCap className="text-[#C5A880]" />, link: '#admissions' },
    { label: 'Student ERP Login', icon: <FaGraduationCap className="text-indigo-400" />, route: '/login' },
    { label: 'Faculty & Staff Directory', icon: <FaUserCheck className="text-sky-400" />, route: '/login' },
    { label: 'Upcoming Campus Events & Festivals', icon: <FaCalendarAlt className="text-amber-400" />, link: '#events' },
  ];

  const filteredLinks = query.trim()
    ? quickLinks.filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
    : quickLinks;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#0f1422] border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center gap-3">
          <FaSearch className="w-5 h-5 text-[#8B1538]" />
          <input
            type="text"
            autoFocus
            placeholder="Search programs, majors, tuition, faculty, campus events..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white text-base sm:text-lg focus:outline-none placeholder:text-slate-500"
          />
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Results / Quick Suggestions */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            {query.trim() ? 'Search Results' : 'Suggested Academic & Portal Links'}
          </div>

          <div className="space-y-2">
            {filteredLinks.length > 0 ? (
              filteredLinks.map((item, idx) => (
                item.route ? (
                  <Link
                    key={idx}
                    to={item.route}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 text-sm text-slate-200 hover:text-white transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#8B1538]/20">
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ) : (
                  <a
                    key={idx}
                    href={item.link}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 text-sm text-slate-200 hover:text-white transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#8B1538]/20">
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </a>
                )
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">
                No matching results found for "{query}".
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#0a0d16] border-t border-white/10 text-[11px] text-slate-500 text-center">
          Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono">ESC</kbd> to close
        </div>
      </div>
    </div>
  );
}
