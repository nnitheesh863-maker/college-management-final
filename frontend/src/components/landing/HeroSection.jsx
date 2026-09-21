import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaGraduationCap, FaAward, FaBookReader, FaLaptopCode, FaRocket } from 'react-icons/fa';
import { KPRCAS_LOGO_URL } from './UnipixLogo';

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden bg-[#050813]">
      {/* Background Animated Gradients and Watermark Logo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Large Floating Ambient Light Orbs */}
        <div className="absolute -top-32 -left-32 w-[650px] h-[650px] bg-blue-600/20 rounded-full blur-[160px] float" />
        <div className="absolute -bottom-32 -right-32 w-[650px] h-[650px] bg-emerald-500/20 rounded-full blur-[160px] float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1e3a8a]/15 rounded-full blur-[180px] float-fast" />

        {/* Large Subtle Animated KPRCAS Background Emblem Watermark */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.07, scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[750px] pointer-events-none select-none"
        >
          <img
            src={KPRCAS_LOGO_URL}
            alt="KPRCAS Background Emblem"
            className="w-full h-full object-contain filter invert contrast-200"
          />
        </motion.div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Hero Content with Framer Motion Staggered Animations */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-4">
        
        {/* Animated Central KPRCAS College Logo Emblem */}
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -15 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          className="inline-flex flex-col items-center justify-center mb-6"
        >
          <motion.div 
            whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white p-2.5 shadow-[0_0_60px_rgba(37,99,235,0.45)] border-2 border-emerald-400/60 flex items-center justify-center relative group cursor-pointer"
          >
            {/* Glowing Ring Animation */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-emerald-400 to-indigo-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt -z-10" />
            
            <img
              src={KPRCAS_LOGO_URL}
              alt="KPRCAS - Learn Beyond Official Logo"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-blue-900/60 via-emerald-950/60 to-blue-900/60 backdrop-blur-xl border border-emerald-400/40 text-[11px] sm:text-xs tracking-[0.25em] font-extrabold text-emerald-300 uppercase shadow-lg"
          >
            <span>LEARN BEYOND</span> • <span>ACADEMIC EXCELLENCE</span>
          </motion.div>
        </motion.div>

        {/* Grand Headline with Gradient Text */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 drop-shadow-2xl"
        >
          KPR College of Arts <br />
          <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">
            Science and Research
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base md:text-lg font-normal leading-relaxed mb-10 text-balance"
        >
          Empowering the next generation of scholars, tech innovators, and global leaders through experiential learning, world-class labs, and industry mentorship.
        </motion.p>

        {/* Action Buttons with Hover Animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          <Link
            to="/login"
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_10px_35px_rgba(37,99,235,0.45)] hover:shadow-[0_15px_45px_rgba(37,99,235,0.65)] transform hover:-translate-y-1"
          >
            <FaRocket className="w-4 h-4 text-emerald-300 transition-transform group-hover:scale-125" />
            <span>Launch ERP Portal 🚀</span>
            <FaArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <a
            href="#programs"
            className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md text-white px-8 py-4 rounded-2xl text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 transform hover:-translate-y-1 hover:border-emerald-400/50"
          >
            <FaGraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Explore Programs</span>
          </a>
        </motion.div>

        {/* Quick Institutional Highlights Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.8 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/10"
        >
          <motion.div whileHover={{ scale: 1.04 }} className="flex flex-col items-center p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 shadow-lg">
            <FaAward className="w-6 h-6 text-emerald-400 mb-1.5" />
            <span className="text-xl font-extrabold text-white">NAAC 'A'</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Accredited Grade</span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.04 }} className="flex flex-col items-center p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 shadow-lg">
            <FaBookReader className="w-6 h-6 text-blue-400 mb-1.5" />
            <span className="text-xl font-extrabold text-white">35+</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">UG & PG Programs</span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.04 }} className="flex flex-col items-center p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 shadow-lg">
            <FaLaptopCode className="w-6 h-6 text-teal-400 mb-1.5" />
            <span className="text-xl font-extrabold text-white">100%</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Placement Training</span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.04 }} className="flex flex-col items-center p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 shadow-lg">
            <FaGraduationCap className="w-6 h-6 text-indigo-400 mb-1.5" />
            <span className="text-xl font-extrabold text-white">10,000+</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Global Alumni</span>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
