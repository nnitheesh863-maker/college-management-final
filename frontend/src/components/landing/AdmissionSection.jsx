import React, { useState } from 'react';
import { FaCheckCircle, FaPaperPlane, FaUserGraduate, FaIdCard, FaClock, FaUniversity } from 'react-icons/fa';

export default function AdmissionSection() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    degree: 'undergraduate',
    program: 'Computer Science & AI',
    term: 'Fall 2026',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const appRef = 'UPX-' + Math.floor(100000 + Math.random() * 900000);
      setSubmittedApp({
        ref: appRef,
        name: `${formData.firstName} ${formData.lastName}`,
        program: formData.program,
        term: formData.term,
        email: formData.email
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        degree: 'undergraduate',
        program: 'Computer Science & AI',
        term: 'Fall 2026',
        notes: ''
      });
    }, 800);
  };

  return (
    <section id="admissions" className="py-24 bg-[#0d121f] text-white relative overflow-hidden">
      {/* Background Watermark Typography */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 overflow-hidden pointer-events-none select-none opacity-5">
        <span className="font-serif text-[110px] sm:text-[180px] md:text-[220px] font-black uppercase tracking-tight text-white whitespace-nowrap block text-center">
          Admission Now
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-[0.25em] text-[#8B1538] uppercase mb-2 block">
            Start Your Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-white mb-4">
            Apply For Admission
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Take the first step toward your extraordinary future. Our admissions team is here to guide you through every stage.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Image Mosaic */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 h-72 sm:h-80 group">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"
                  alt="Unipix Student Candidate"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 h-72 sm:h-80 group mt-6">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
                  alt="Student Study Team"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Quick Admissions Checklist */}
            <div className="mt-8 p-6 rounded-2xl bg-white/[0.03] border border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A880] mb-3 flex items-center gap-2">
                <FaClock /> Upcoming Deadlines
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-semibold text-white">Early Decision</div>
                  <div className="text-slate-400 text-[11px]">November 15, 2026</div>
                </div>
                <div>
                  <div className="font-semibold text-white">Regular Decision</div>
                  <div className="text-slate-400 text-[11px]">January 15, 2027</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Application Form */}
          <div className="lg:col-span-6">
            <div className="bg-[#131929] rounded-3xl p-8 sm:p-10 border border-white/15 shadow-2xl relative">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    Application Form
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Complete your online inquiry in less than 2 minutes.
                  </p>
                </div>
                <FaUserGraduate className="w-8 h-8 text-[#8B1538]" />
              </div>

              {submittedApp ? (
                <div className="text-center py-8 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-6 animate-in fade-in">
                  <FaCheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <h4 className="font-serif text-xl font-bold text-white mb-1">
                    Application Received!
                  </h4>
                  <p className="text-xs text-slate-300 mb-4">
                    Thank you, <strong className="text-white">{submittedApp.name}</strong>. Your inquiry for <strong className="text-white">{submittedApp.program}</strong> ({submittedApp.term}) has been submitted.
                  </p>
                  <div className="bg-black/40 p-3 rounded-lg text-xs font-mono text-[#C5A880] mb-6 inline-block">
                    Application Reference: {submittedApp.ref}
                  </div>
                  <div>
                    <button
                      onClick={() => setSubmittedApp(null)}
                      className="bg-[#8B1538] hover:bg-[#630D25] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider"
                    >
                      Submit Another Application
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">First Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Alexander"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#8B1538]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Last Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Hamilton"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#8B1538]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="alexander@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#8B1538]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#8B1538]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Degree Level</label>
                      <select
                        value={formData.degree}
                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0f1422] border border-white/15 text-white text-xs focus:outline-none focus:border-[#8B1538]"
                      >
                        <option value="undergraduate">Undergraduate (Bachelor's)</option>
                        <option value="graduate">Graduate (Master's)</option>
                        <option value="phd">Doctoral (Ph.D)</option>
                        <option value="certificate">Professional Certificate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Intake Term</label>
                      <select
                        value={formData.term}
                        onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0f1422] border border-white/15 text-white text-xs focus:outline-none focus:border-[#8B1538]"
                      >
                        <option value="Fall 2026">Fall Semester 2026</option>
                        <option value="Spring 2027">Spring Semester 2027</option>
                        <option value="Summer 2027">Summer Immersion 2027</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Program of Interest</label>
                    <select
                      value={formData.program}
                      onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0f1422] border border-white/15 text-white text-xs focus:outline-none focus:border-[#8B1538]"
                    >
                      <option value="Computer Science & AI">School of Computer Science & AI</option>
                      <option value="Business & Finance">School of Business, Finance & Analytics</option>
                      <option value="Mechanical & Robotics">College of Engineering & Robotics</option>
                      <option value="Biomedical Sciences">Institute of Biomedical Sciences</option>
                      <option value="Arts, Design & Media">School of Arts, Design & Global Media</option>
                      <option value="Law & Public Policy">Faculty of Law & International Policy</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 bg-[#8B1538] hover:bg-[#630D25] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-[0_4px_20px_rgba(139,21,56,0.4)] flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting Application...
                      </span>
                    ) : (
                      <>
                        <span>Apply Now</span>
                        <FaPaperPlane className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
