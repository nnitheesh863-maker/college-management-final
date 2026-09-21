import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaGraduationCap, FaAward, FaBookReader, FaGlobeAmericas, FaLaptopCode } from 'react-icons/fa';
import { KPRCAS_LOGO_URL } from './UnipixLogo';

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden">
      {/* Background Image with Dark Vignette & Royal Blue Tint */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transform scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#070a13] via-[#070a13]/80 to-[#05070e]/95" />
        <div className="absolute inset-0 bg-radial-vignette opacity-85" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-6">
        
        {/* Animated Central KPRCAS College Logo Badge */}
        <div className="inline-flex flex-col items-center justify-center mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-2 shadow-[0_0_50px_rgba(30,58,138,0.4)] border-2 border-slate-200 flex items-center justify-center transition-all duration-500 hover:scale-105">
            <img
              src={KPRCAS_LOGO_URL}
              alt="KPRCAS - Learn Beyond Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="mt-3.5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs tracking-[0.3em] font-bold text-emerald-400 uppercase">
            <span>LEARN BEYOND</span> • <span>EXCELLENCE IN EDUCATION</span>
          </div>
        </div>

        {/* Grand Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6 drop-shadow-xl">
          KPR College of Arts <br />
          <span className="italic font-normal font-serif text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">
            Science and Research
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base md:text-lg font-normal leading-relaxed mb-10 text-balance">
          Empowering the next generation of scholars, tech innovators, and global business leaders through cutting-edge learning and holistic research.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <a
            href="#programs"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-8 py-4 rounded-full text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_10px_30px_rgba(37,99,235,0.4)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.6)] transform hover:-translate-y-1"
          >
            <span>Explore Programs</span>
            <FaArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>

          <Link
            to="/login"
            className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md text-white px-8 py-4 rounded-full text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 transform hover:-translate-y-1 hover:border-white/40"
          >
            <FaGraduationCap className="w-4 h-4 text-emerald-400" />
            <span>KPRCAS ERP Portal</span>
          </Link>
        </div>

        {/* Quick Institutional Highlights */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/10">
          <div className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/5">
            <FaAward className="w-5 h-5 text-emerald-400 mb-1.5" />
            <span className="text-xl font-bold text-white">NAAC 'A'</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Accredited Grade</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/5">
            <FaBookReader className="w-5 h-5 text-blue-400 mb-1.5" />
            <span className="text-xl font-bold text-white">35+</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">UG & PG Programs</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/5">
            <FaLaptopCode className="w-5 h-5 text-teal-400 mb-1.5" />
            <span className="text-xl font-bold text-white">100%</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Placement Assistance</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/5">
            <FaGraduationCap className="w-5 h-5 text-indigo-400 mb-1.5" />
            <span className="text-xl font-bold text-white">10,000+</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Global Alumni</span>
          </div>
        </div>

      </div>
    </section>
  );
}
