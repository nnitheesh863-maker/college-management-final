import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaGraduationCap, FaAward, FaBookReader, FaLaptopCode, FaRocket } from 'react-icons/fa';
import { KPRCAS_LOGO_URL, KPRCAS_CAMPUS_BG_URL } from './UnipixLogo';

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center pt-32 pb-24 overflow-hidden bg-[#040711]">
      {/* Background Layer: Real College Campus Photo with Cinematic Backdrop Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Campus Photo with Smooth Scale and Crisp Visibility */}
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.45 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={KPRCAS_CAMPUS_BG_URL}
            alt="KPRCAS College Campus Infrastructure"
            className="w-full h-full object-cover object-center filter brightness-105 contrast-115"
          />
        </motion.div>

        {/* Dynamic Dark Gradient & Glass Vignette Overlays for Crisp Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040711] via-[#040711]/60 to-[#040711]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040711]/80 via-transparent to-[#040711]/80" />

        {/* Floating Ambient Glowing Light Beams */}
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 20, 0],
            opacity: [0.35, 0.55, 0.35]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-blue-600/25 rounded-full blur-[140px] pointer-events-none"
        />
        <motion.div
          animate={{
            x: [0, -40, 20, 0],
            y: [0, 40, -20, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 -right-24 w-[650px] h-[650px] bg-emerald-500/20 rounded-full blur-[150px] pointer-events-none"
        />

        {/* Tech Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-2">
        
        {/* College Logo with Glowing Pulse & Floating Badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
          className="inline-flex flex-col items-center justify-center mb-6"
        >
          <motion.div 
            whileHover={{ scale: 1.08, rotate: [0, -2, 2, 0] }}
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-white p-2.5 shadow-[0_0_60px_rgba(37,99,235,0.4)] border-2 border-emerald-400/50 flex items-center justify-center relative group cursor-pointer"
          >
            {/* Animated Glow Border */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-emerald-400 to-indigo-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-700 animate-tilt -z-10" />
            
            <img
              src={KPRCAS_LOGO_URL}
              alt="KPRCAS - Learn Beyond Logo"
              className="w-full h-full object-contain"
            />
          </motion.div>

          {/* Institutional Accolade Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-4 inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-blue-950/80 via-emerald-950/80 to-blue-950/80 backdrop-blur-xl border border-emerald-400/50 text-[11px] sm:text-xs tracking-[0.25em] font-extrabold text-emerald-300 uppercase shadow-xl"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>KPRCAS</span> • <span>LEARN BEYOND</span> • <span>AUTONOMOUS</span>
          </motion.div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.12] mb-6 drop-shadow-2xl"
        >
          KPR College of Arts <br />
          <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">
            Science and Research
          </span>
        </motion.h1>

        {/* Subtitle description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="max-w-2xl mx-auto text-slate-200 text-sm sm:text-base md:text-lg font-normal leading-relaxed mb-10 text-balance drop-shadow-md"
        >
          Empowering the next generation of scholars, tech innovators, and global leaders through experiential learning, world-class labs, and industry mentorship.
        </motion.p>

        {/* Primary ERP Action & Program Exploration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
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

        {/* Institutional Statistics & Accreditations Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/15"
        >
          <motion.div whileHover={{ scale: 1.05, y: -3 }} className="flex flex-col items-center p-4 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/15 shadow-xl transition-all">
            <FaAward className="w-6 h-6 text-emerald-400 mb-1.5" />
            <span className="text-xl font-extrabold text-white">NAAC 'A'</span>
            <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Accredited Grade</span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05, y: -3 }} className="flex flex-col items-center p-4 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/15 shadow-xl transition-all">
            <FaBookReader className="w-6 h-6 text-blue-400 mb-1.5" />
            <span className="text-xl font-extrabold text-white">35+</span>
            <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">UG & PG Programs</span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05, y: -3 }} className="flex flex-col items-center p-4 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/15 shadow-xl transition-all">
            <FaLaptopCode className="w-6 h-6 text-teal-400 mb-1.5" />
            <span className="text-xl font-extrabold text-white">100%</span>
            <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Placement Training</span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05, y: -3 }} className="flex flex-col items-center p-4 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/15 shadow-xl transition-all">
            <FaGraduationCap className="w-6 h-6 text-indigo-400 mb-1.5" />
            <span className="text-xl font-extrabold text-white">10,000+</span>
            <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Global Alumni</span>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
