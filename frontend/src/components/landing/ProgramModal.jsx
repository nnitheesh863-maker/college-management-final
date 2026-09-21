import React from 'react';
import { FaTimes, FaGraduationCap, FaCheckCircle, FaBriefcase, FaBookOpen, FaArrowRight } from 'react-icons/fa';

export default function ProgramModal({ program, isOpen, onClose, onApply }) {
  if (!isOpen || !program) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-[#0f1422] border border-white/20 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Image Banner */}
        <div className="relative h-48 sm:h-60 overflow-hidden flex-shrink-0">
          <img
            src={program.image}
            alt={program.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1422] via-[#0f1422]/60 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="bg-[#8B1538] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              {program.badge}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-2">
              {program.title}
            </h2>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-300 text-sm">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#C5A880] mb-2 flex items-center gap-2">
              <FaBookOpen /> Program Overview
            </h3>
            <p className="leading-relaxed text-slate-200">
              {program.description} Our curriculum combines foundational theoretical principles with experiential capstones, research colloquiums, and industry mentorship to prepare tomorrow's pioneers.
            </p>
          </div>

          {/* Key Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
              <span className="text-[11px] text-slate-400 block uppercase">Duration</span>
              <span className="text-base font-bold text-white">{program.stats || '4 Academic Years'}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
              <span className="text-[11px] text-slate-400 block uppercase">Faculty Ratio</span>
              <span className="text-base font-bold text-white">8:1 Student-Faculty</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
              <span className="text-[11px] text-slate-400 block uppercase">Placement Rate</span>
              <span className="text-base font-bold text-emerald-400">98.4% Employed</span>
            </div>
          </div>

          {/* Curriculum Pillars */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#C5A880] mb-3 flex items-center gap-2">
              <FaGraduationCap /> Core Curriculum Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Advanced Theoretical Modeling & Practical Labs',
                'Global Case Studies & Seminar Workshops',
                'Interdisciplinary Electives & Minor Specializations',
                'Senior Capstone Thesis & Industry Internship'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                  <FaCheckCircle className="w-3.5 h-3.5 text-[#8B1538] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Career Pathways */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#C5A880] mb-2 flex items-center gap-2">
              <FaBriefcase /> Career Pathways
            </h3>
            <p className="text-xs text-slate-400">
              Graduates of this program secure leadership roles at leading Fortune 500 corporations, high-impact startups, federal research agencies, and premier global universities.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-[#0a0d16] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-400">
            Admissions open for <strong className="text-white">Fall 2026 / Spring 2027</strong> intake.
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-white/20 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                if (onApply) onApply(program.title);
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#8B1538] hover:bg-[#630D25] text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5"
            >
              <span>Apply for this Major</span>
              <FaArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
