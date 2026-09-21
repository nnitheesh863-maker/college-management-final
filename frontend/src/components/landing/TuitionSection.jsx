import React, { useState } from 'react';
import { FaCheck, FaArrowUpRightFromSquare, FaHandHoldingDollar, FaFileInvoiceDollar } from 'react-icons/fa6';

export default function TuitionSection() {
  const [billingCycle, setBillingCycle] = useState('semester'); // 'semester' | 'annual'
  const multiplier = billingCycle === 'annual' ? 2 : 1;

  return (
    <section id="tuition" className="py-24 bg-[#0a0e17] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Information & Plan Details CTA */}
          <div className="lg:col-span-4">
            <span className="text-xs font-bold tracking-[0.25em] text-[#8B1538] uppercase mb-3 block">
              Affordable & Transparent
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white mb-6 leading-tight">
              Tuition Fees At <br />
              <span className="font-serif italic font-normal text-slate-200">
                Unipix University
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              At Unipix University we are committed to providing a high-quality education that is accessible to a diverse range of students with transparent pricing and comprehensive financial support.
            </p>

            {/* Toggle Billing Period */}
            <div className="inline-flex p-1 bg-white/5 rounded-full border border-white/10 mb-8">
              <button
                onClick={() => setBillingCycle('semester')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  billingCycle === 'semester' 
                    ? 'bg-[#8B1538] text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Per Semester
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  billingCycle === 'annual' 
                    ? 'bg-[#8B1538] text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Annual Estimate (Save 5%)
              </button>
            </div>

            <div>
              <a
                href="#admissions"
                className="inline-flex items-center gap-2.5 bg-[#8B1538] hover:bg-[#630D25] text-white px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Plan Details</span>
                <FaArrowUpRightFromSquare className="w-3 h-3" />
              </a>
            </div>

            {/* Financial Aid Notice */}
            <div className="mt-8 flex items-center gap-3 text-xs text-slate-400">
              <FaHandHoldingDollar className="w-5 h-5 text-[#C5A880] flex-shrink-0" />
              <span>Over 85% of incoming freshmen receive merit scholarships or institutional grants.</span>
            </div>
          </div>

          {/* Right Column: Pricing & Fee Comparison Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Undergraduate Programs (Solid Crimson Theme) */}
            <div className="bg-[#8B1538] text-white rounded-2xl p-7 sm:p-8 shadow-2xl border border-white/20 relative flex flex-col justify-between transform transition-all duration-300 hover:-translate-y-1">
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/20">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                    Undergraduate Programs
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2.5 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>

                {/* Sub-division: College of Arts and Sciences */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#ffd4df] mb-3">
                    College of Arts and Sciences
                  </h4>
                  <ul className="space-y-2.5 text-xs sm:text-sm">
                    <li className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <FaCheck className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span>Full-Time Tuition ({billingCycle}): <strong className="text-white font-bold">${241 * multiplier}</strong></span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <FaCheck className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span>Part-Time Tuition (per credit): <strong className="text-white font-bold">$141</strong></span>
                    </li>
                  </ul>
                </div>

                {/* Sub-division: School of Business */}
                <div className="pt-4 border-t border-white/15">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#ffd4df] mb-3">
                    School of Business & Tech
                  </h4>
                  <ul className="space-y-2.5 text-xs sm:text-sm">
                    <li className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <FaCheck className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span>Full-Time Tuition ({billingCycle}): <strong className="text-white font-bold">${241 * multiplier}</strong></span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <FaCheck className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span>Part-Time Tuition (per credit): <strong className="text-white font-bold">$141</strong></span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/20 text-[11px] text-white/80">
                * Includes access to campus labs, recreation center & digital library.
              </div>
            </div>

            {/* Card 2: Graduate Programs (Light Clean Theme) */}
            <div className="bg-[#f8fafc] text-slate-900 rounded-2xl p-7 sm:p-8 shadow-2xl border border-slate-200 relative flex flex-col justify-between transform transition-all duration-300 hover:-translate-y-1">
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    Graduate Programs
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full">
                    Advanced Degrees
                  </span>
                </div>

                {/* Sub-division: Graduate School/Department */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#8B1538] mb-3">
                    Graduate School / Department
                  </h4>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#8B1538]/15 flex items-center justify-center flex-shrink-0">
                        <FaCheck className="w-2.5 h-2.5 text-[#8B1538]" />
                      </div>
                      <span>Full-Time Tuition ({billingCycle}): <strong className="text-slate-900 font-bold">${241 * multiplier}</strong></span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#8B1538]/15 flex items-center justify-center flex-shrink-0">
                        <FaCheck className="w-2.5 h-2.5 text-[#8B1538]" />
                      </div>
                      <span>Part-Time Tuition (per credit): <strong className="text-slate-900 font-bold">$141</strong></span>
                    </li>
                  </ul>
                </div>

                {/* Sub-division: Additional Fees */}
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#8B1538] mb-3">
                    Additional University Fees
                  </h4>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#8B1538]/15 flex items-center justify-center flex-shrink-0">
                        <FaCheck className="w-2.5 h-2.5 text-[#8B1538]" />
                      </div>
                      <span>Technology Fee: <strong className="text-slate-900 font-bold">$149 per semester</strong></span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#8B1538]/15 flex items-center justify-center flex-shrink-0">
                        <FaCheck className="w-2.5 h-2.5 text-[#8B1538]" />
                      </div>
                      <span>Student Activity Fee: <strong className="text-slate-900 font-bold">$99 per semester</strong></span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 text-[11px] text-slate-500">
                * Graduate assistantships and departmental fellowships available.
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
