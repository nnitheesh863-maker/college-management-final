import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaPaperPlane, FaUserGraduate, FaClock, FaArrowRight, FaArrowLeft, FaAward, FaFileAlt } from 'react-icons/fa';

export default function AdmissionSection({ prefilledProgram }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    nationality: 'United States',
    degree: 'undergraduate',
    program: 'Computer Science & AI',
    term: 'Fall 2026',
    highSchoolGpa: '3.8',
    statement: '',
    agreedToTerms: true
  });

  useEffect(() => {
    if (prefilledProgram) {
      setFormData(prev => ({ ...prev, program: prefilledProgram }));
    }
  }, [prefilledProgram]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const appRef = 'UPX-' + Math.floor(100000 + Math.random() * 900000);
      setSubmittedApp({
        ref: appRef,
        name: `${formData.firstName} ${formData.lastName}`,
        program: formData.program,
        term: formData.term,
        email: formData.email,
        gpa: formData.highSchoolGpa,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
      setStep(1);
    }, 800);
  };

  return (
    <section id="admissions" className="py-24 bg-[#0d121f] text-white relative overflow-hidden">
      {/* Background Watermark */}
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
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 h-64 sm:h-72 group">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"
                  alt="Unipix Student Candidate"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 h-64 sm:h-72 group mt-6">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
                  alt="Student Study Team"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Quick Admissions Stats */}
            <div className="mt-6 p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#8B1538]/20 text-[#f199b0]">
                  <FaAward className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Holistic Review Process</div>
                  <div className="text-[11px] text-slate-400">We evaluate test scores, essays, extracurriculars & passion.</div>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-white/10 pt-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
                  <FaClock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Decision Turnaround</div>
                  <div className="text-[11px] text-slate-400">Preliminary status notifications within 2 to 3 weeks.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Step Application Wizard */}
          <div className="lg:col-span-7">
            <div className="bg-[#131929] rounded-3xl p-7 sm:p-10 border border-white/15 shadow-2xl relative">
              
              {/* Wizard Steps Indicator */}
              {!submittedApp && (
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-[#8B1538] text-white' : 'bg-white/10 text-slate-400'}`}>
                      1
                    </div>
                    <span className={`text-xs font-semibold ${step >= 1 ? 'text-white' : 'text-slate-500'}`}>Applicant</span>
                  </div>

                  <div className="h-0.5 w-8 bg-white/10" />

                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-[#8B1538] text-white' : 'bg-white/10 text-slate-400'}`}>
                      2
                    </div>
                    <span className={`text-xs font-semibold ${step >= 2 ? 'text-white' : 'text-slate-500'}`}>Program</span>
                  </div>

                  <div className="h-0.5 w-8 bg-white/10" />

                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-[#8B1538] text-white' : 'bg-white/10 text-slate-400'}`}>
                      3
                    </div>
                    <span className={`text-xs font-semibold ${step >= 3 ? 'text-white' : 'text-slate-500'}`}>Academics</span>
                  </div>
                </div>
              )}

              {submittedApp ? (
                <div className="text-center py-6 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-6 animate-in fade-in">
                  <FaCheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-3" />
                  <h4 className="font-serif text-2xl font-bold text-white mb-2">
                    Application Docket Registered!
                  </h4>
                  <p className="text-xs text-slate-300 mb-6 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{submittedApp.name}</strong>. Your application docket for <strong className="text-white">{submittedApp.program}</strong> ({submittedApp.term}) has been received by the Admissions Council.
                  </p>

                  <div className="bg-[#0a0d16] p-4 rounded-xl text-left border border-white/10 max-w-md mx-auto mb-6 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Reference Number:</span>
                      <strong className="text-[#C5A880] font-mono">{submittedApp.ref}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Applicant Email:</span>
                      <span className="text-white">{submittedApp.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Submission Date:</span>
                      <span className="text-white">{submittedApp.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Verification Status:</span>
                      <span className="text-emerald-400 font-semibold">Under Evaluation</span>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => setSubmittedApp(null)}
                      className="bg-[#8B1538] hover:bg-[#630D25] text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleNext}>
                  {/* Step 1: Personal Details */}
                  {step === 1 && (
                    <div className="space-y-4 animate-in fade-in">
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

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Country / Nationality</label>
                        <input
                          type="text"
                          placeholder="e.g. United States, United Kingdom, India, Canada..."
                          value={formData.nationality}
                          onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#8B1538]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Academic Program Selection */}
                  {step === 2 && (
                    <div className="space-y-4 animate-in fade-in">
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
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Department & Major of Interest</label>
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
                    </div>
                  )}

                  {/* Step 3: Prior Academics & Statement */}
                  {step === 3 && (
                    <div className="space-y-4 animate-in fade-in">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cumulative GPA (out of 4.0)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="1.0"
                          max="4.0"
                          value={formData.highSchoolGpa}
                          onChange={(e) => setFormData({ ...formData, highSchoolGpa: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#8B1538]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Brief Statement of Intent (Optional)</label>
                        <textarea
                          rows="3"
                          placeholder="Tell us what motivates your academic passion and aspirations at KPRCAS..."
                          value={formData.statement}
                          onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#8B1538]"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
                        <input
                          type="checkbox"
                          checked={formData.agreedToTerms}
                          onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                          className="accent-[#8B1538] rounded"
                        />
                        <span>I confirm all provided academic details are accurate to the best of my knowledge.</span>
                      </div>
                    </div>
                  )}

                  {/* Form Action Buttons */}
                  <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors"
                      >
                        <FaArrowLeft className="w-3 h-3" />
                        <span>Back</span>
                      </button>
                    ) : <div />}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#8B1538] hover:bg-[#630D25] text-white px-7 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-[0_4px_20px_rgba(139,21,56,0.4)] flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : step === 3 ? (
                        <>
                          <span>Submit Application</span>
                          <FaPaperPlane className="w-3 h-3" />
                        </>
                      ) : (
                        <>
                          <span>Continue</span>
                          <FaArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
