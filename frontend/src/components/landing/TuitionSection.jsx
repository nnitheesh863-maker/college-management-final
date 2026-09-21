import React, { useState } from 'react';
import { FaCheck, FaArrowUpRightFromSquare, FaHandHoldingDollar, FaCalculator, FaBed, FaUtensils, FaGraduationCap } from 'react-icons/fa6';

export default function TuitionSection() {
  const [billingCycle, setBillingCycle] = useState('semester'); // 'semester' | 'annual'
  const [activeTab, setActiveTab] = useState('breakdown'); // 'breakdown' | 'calculator'
  
  // Interactive Calculator State
  const [credits, setCredits] = useState(15);
  const [housing, setHousing] = useState('dorm'); // 'none' | 'dorm' | 'suite'
  const [mealPlan, setMealPlan] = useState('standard'); // 'none' | 'standard' | 'unlimited'
  const [scholarshipTier, setScholarshipTier] = useState('merit'); // 'none' | 'merit' | 'presidential'

  const multiplier = billingCycle === 'annual' ? 2 : 1;

  // Calculate dynamic fees
  const tuitionBase = credits * 141;
  const housingCost = housing === 'dorm' ? 1200 : housing === 'suite' ? 1800 : 0;
  const mealCost = mealPlan === 'standard' ? 850 : mealPlan === 'unlimited' ? 1250 : 0;
  const techFee = 149;
  const activityFee = 99;
  const scholarshipDiscount = scholarshipTier === 'merit' ? 600 : scholarshipTier === 'presidential' ? 1400 : 0;

  const totalPerSemester = Math.max(0, tuitionBase + housingCost + mealCost + techFee + activityFee - scholarshipDiscount);
  const calculatedTotal = totalPerSemester * multiplier;

  return (
    <section id="tuition" className="py-24 bg-[#0a0e17] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-12">
          <div className="lg:col-span-6">
            <span className="text-xs font-bold tracking-[0.25em] text-[#8B1538] uppercase mb-3 block">
              Affordable & Transparent
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white mb-4 leading-tight">
              Tuition Fees At <br />
              <span className="font-serif italic font-normal text-slate-200">
                Unipix University
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              At Unipix University we are committed to providing a high-quality education that is accessible to a diverse range of students with transparent pricing and comprehensive financial support.
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-wrap items-center justify-start lg:justify-end gap-3">
            {/* View Switcher Tab */}
            <div className="inline-flex p-1 bg-white/5 rounded-full border border-white/10">
              <button
                onClick={() => setActiveTab('breakdown')}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'breakdown' 
                    ? 'bg-[#8B1538] text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Standard Schedule
              </button>
              <button
                onClick={() => setActiveTab('calculator')}
                className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'calculator' 
                    ? 'bg-[#8B1538] text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FaCalculator className="w-3 h-3" />
                Cost Estimator
              </button>
            </div>

            {/* Cycle Toggle */}
            <div className="inline-flex p-1 bg-white/5 rounded-full border border-white/10">
              <button
                onClick={() => setBillingCycle('semester')}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  billingCycle === 'semester' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Semester
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  billingCycle === 'annual' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Annual
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Standard Breakdown Cards */}
        {activeTab === 'breakdown' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Summary Box */}
            <div className="lg:col-span-4 p-8 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-white mb-3">
                  Merit & Need-Based Aid
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  More than 85% of incoming freshmen receive merit scholarships, federal work-study, or institutional grants that substantially reduce out-of-pocket expenses.
                </p>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <span>Average Scholarship Award</span>
                    <strong className="text-emerald-400 font-bold">$4,500 / yr</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <span>On-Campus Work-Study</span>
                    <strong className="text-white font-bold">$18.50 / hr</strong>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="#admissions"
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-[#8B1538] hover:bg-[#630D25] text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all"
                >
                  <span>Inquire for Financial Aid</span>
                  <FaArrowUpRightFromSquare className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Right Comparison Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Undergraduate Card (Solid Crimson) */}
              <div className="bg-[#8B1538] text-white rounded-3xl p-7 sm:p-8 shadow-2xl border border-white/20 flex flex-col justify-between transform transition-all duration-300 hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/20">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                      Undergraduate Programs
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2.5 py-1 rounded-full">
                      B.A / B.Sc / B.Tech
                    </span>
                  </div>

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
                  * Includes campus recreation, high-speed Wi-Fi & digital archives.
                </div>
              </div>

              {/* Graduate Card (Light Clean Theme) */}
              <div className="bg-[#f8fafc] text-slate-900 rounded-3xl p-7 sm:p-8 shadow-2xl border border-slate-200 flex flex-col justify-between transform transition-all duration-300 hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                      Graduate Programs
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full">
                      M.Sc / Ph.D / MBA
                    </span>
                  </div>

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

                  <div className="pt-4 border-t border-slate-200">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-[#8B1538] mb-3">
                      Additional University Fees
                    </h4>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                      <li className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-[#8B1538]/15 flex items-center justify-center flex-shrink-0">
                          <FaCheck className="w-2.5 h-2.5 text-[#8B1538]" />
                        </div>
                        <span>Technology Fee: <strong className="text-slate-900 font-bold">$149 / semester</strong></span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-[#8B1538]/15 flex items-center justify-center flex-shrink-0">
                          <FaCheck className="w-2.5 h-2.5 text-[#8B1538]" />
                        </div>
                        <span>Student Activity Fee: <strong className="text-slate-900 font-bold">$99 / semester</strong></span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-200 text-[11px] text-slate-500">
                  * Research assistantships and tuition waivers available.
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* Tab 2: Interactive Cost Estimator */
          <div className="bg-[#121827] rounded-3xl p-8 sm:p-10 border border-white/15 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Controls */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                    <span>Course Credits ({credits} Credits per semester)</span>
                    <span className="text-[#C5A880]">${tuitionBase}</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="21"
                    step="1"
                    value={credits}
                    onChange={(e) => setCredits(Number(e.target.value))}
                    className="w-full accent-[#8B1538] bg-white/10 rounded-lg cursor-pointer h-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Part-Time (3 cr)</span>
                    <span>Standard Full-Time (15 cr)</span>
                    <span>Heavy (21 cr)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Housing Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <FaBed className="text-[#8B1538]" /> Campus Housing
                    </label>
                    <select
                      value={housing}
                      onChange={(e) => setHousing(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#0a0d16] border border-white/15 text-white text-xs focus:outline-none focus:border-[#8B1538]"
                    >
                      <option value="none">Commuter / Off-Campus ($0)</option>
                      <option value="dorm">Standard Shared Dorm ($1,200/sem)</option>
                      <option value="suite">Private Suite Quad ($1,800/sem)</option>
                    </select>
                  </div>

                  {/* Dining Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <FaUtensils className="text-[#8B1538]" /> Campus Meal Plan
                    </label>
                    <select
                      value={mealPlan}
                      onChange={(e) => setMealPlan(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#0a0d16] border border-white/15 text-white text-xs focus:outline-none focus:border-[#8B1538]"
                    >
                      <option value="none">No Meal Plan ($0)</option>
                      <option value="standard">14 Meals/Week + Flex ($850/sem)</option>
                      <option value="unlimited">Unlimited 7-Day Dining ($1,250/sem)</option>
                    </select>
                  </div>
                </div>

                {/* Scholarship Tier */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <FaGraduationCap className="text-emerald-400" /> Estimated Merit Scholarship
                  </label>
                  <select
                    value={scholarshipTier}
                    onChange={(e) => setScholarshipTier(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0a0d16] border border-white/15 text-white text-xs focus:outline-none focus:border-[#8B1538]"
                  >
                    <option value="none">Standard Rate (No Scholarship Applied)</option>
                    <option value="merit">Dean's Academic Merit Scholarship (-$600/sem)</option>
                    <option value="presidential">Presidential Honors Fellowship (-$1,400/sem)</option>
                  </select>
                </div>
              </div>

              {/* Real-time Calculation Summary Card */}
              <div className="lg:col-span-5 bg-[#0a0d16] rounded-2xl p-6 sm:p-8 border border-white/15 text-center flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B1538] block mb-2">
                    Estimated Net Cost ({billingCycle})
                  </span>
                  <div className="font-serif text-4xl sm:text-5xl font-bold text-white mb-2">
                    ${calculatedTotal.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-400 mb-6">
                    Includes {credits * multiplier} credits, selected residence, dining, and mandatory fees.
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-300 border-t border-b border-white/10 py-3 mb-6 text-left">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tuition ({credits} cr):</span>
                      <span>${tuitionBase * multiplier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Housing & Dining:</span>
                      <span>${(housingCost + mealCost) * multiplier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Required Campus Fees:</span>
                      <span>${(techFee + activityFee) * multiplier}</span>
                    </div>
                    {scholarshipDiscount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-semibold">
                        <span>Scholarship Grant:</span>
                        <span>-${scholarshipDiscount * multiplier}</span>
                      </div>
                    )}
                  </div>
                </div>

                <a
                  href="#admissions"
                  className="w-full bg-[#8B1538] hover:bg-[#630D25] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-transform hover:-translate-y-0.5 block"
                >
                  Apply with this Estimate
                </a>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
