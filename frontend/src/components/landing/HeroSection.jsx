import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaGraduationCap, FaAward, FaBookReader, FaGlobeAmericas } from 'react-icons/fa';
import { UnipixCrest } from './UnipixLogo';

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden">
      {/* Background Image with Dark Vignette Gradient */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transform scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        {/* Multilayer Dark Gradients to match Unipix styling */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/75 to-[#06080e]/90" />
        <div className="absolute inset-0 bg-radial-vignette opacity-80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-8">
        {/* Animated Central University Crest Badge */}
        <div className="inline-flex flex-col items-center justify-center mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 p-3 shadow-[0_0_40px_rgba(139,21,56,0.35)] flex items-center justify-center transition-all duration-500 hover:scale-110">
            <UnipixCrest className="w-full h-full text-white" color="#ffffff" />
          </div>
          <div className="mt-3 text-xs tracking-[0.4em] font-bold text-[#E5D4BA] uppercase">
            Est. 1894 • Center for Higher Learning
          </div>
        </div>

        {/* Grand Headline matching reference image */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-white leading-[1.1] mb-6 drop-shadow-lg">
          Academic Journey <br />
          <span className="italic font-normal font-serif text-[#f1c5c5]">Begins Unipix</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base md:text-lg font-normal leading-relaxed mb-10 text-balance">
          Remember to tailor the section names to fit the specific needs and structure of your university website.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <a
            href="#programs"
            className="group inline-flex items-center gap-3 bg-[#8B1538] hover:bg-[#630D25] text-white px-8 py-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 shadow-[0_10px_30px_rgba(139,21,56,0.4)] hover:shadow-[0_15px_40px_rgba(139,21,56,0.6)] transform hover:-translate-y-1"
          >
            <span>View Our Program</span>
            <FaArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>

          <Link
            to="/login"
            className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md text-white px-8 py-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 transform hover:-translate-y-1 hover:border-white/40"
          >
            <FaGraduationCap className="w-4 h-4 text-[#C5A880]" />
            <span>Campus ERP Portal</span>
          </Link>
        </div>

        {/* Quick Highlights Strip */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/10">
          <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/5">
            <FaAward className="w-5 h-5 text-[#C5A880] mb-1.5" />
            <span className="text-xl font-bold text-white">#1</span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">Research Impact</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/5">
            <FaBookReader className="w-5 h-5 text-[#8B1538] mb-1.5" />
            <span className="text-xl font-bold text-white">180+</span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">Academic Majors</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/5">
            <FaGlobeAmericas className="w-5 h-5 text-sky-400 mb-1.5" />
            <span className="text-xl font-bold text-white">95+</span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">Countries Represented</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/5">
            <FaGraduationCap className="w-5 h-5 text-emerald-400 mb-1.5" />
            <span className="text-xl font-bold text-white">98%</span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">Graduate Employment</span>
          </div>
        </div>
      </div>
    </section>
  );
}
