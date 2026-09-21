import React from 'react';
import { FaArrowRight, FaUniversity, FaAward, FaGraduationCap } from 'react-icons/fa';
import { KPRCAS_LOGO_URL } from './UnipixLogo';

export default function StorySection() {
  return (
    <section id="story" className="relative bg-[#0d1b3e] text-white py-24 overflow-hidden border-t border-b border-white/10">
      {/* Huge Outline Watermark Typography */}
      <div className="absolute -bottom-10 left-0 right-0 overflow-hidden pointer-events-none select-none opacity-5">
        <span className="font-serif text-[110px] sm:text-[160px] md:text-[210px] font-black uppercase tracking-tight text-white whitespace-nowrap block text-center">
          LEARN BEYOND
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Story Headline & Text */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm text-emerald-400">
              <FaUniversity />
              <span>About KPRCAS</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight mb-6">
              Empowering Minds: <br />
              <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-teal-200 to-emerald-300">
                Learn Beyond at KPRCAS
              </span>
            </h2>

            <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-6 font-light">
              KPR College of Arts Science and Research (KPRCAS) is dedicated to fostering academic excellence, industry-oriented innovation, and ethical leadership. With state-of-the-art laboratory complexes and research incubators, KPRCAS shapes students into globally competitive professionals.
            </p>

            <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-8">
              Under the motto <strong>"Learn Beyond"</strong>, our institution blends experiential learning with vibrant campus life, entrepreneurship cells, and world-class placement opportunities.
            </p>

            {/* Action CTA */}
            <div className="flex items-center gap-6">
              <a
                href="#programs"
                className="group inline-flex items-center gap-3 bg-white text-[#0d1b3e] hover:bg-slate-100 px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Discover Programs</span>
                <FaArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 text-[#0d1b3e]" />
              </a>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-emerald-400/40 flex items-center justify-center bg-emerald-500/10">
                  <FaAward className="text-emerald-400 text-sm" />
                </div>
                <div className="text-xs font-medium text-white/90">
                  <span>Autonomous Excellence</span>
                  <div className="text-[10px] text-emerald-300">Top-Tier Ranking</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Heritage Collage */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4 relative">
              {/* Image 1: High-Tech Learning & AI Labs */}
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/20 h-64 sm:h-80 group">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop"
                  alt="KPRCAS Smart Classrooms & Collaborative Learning"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Image 2: Central Research Library */}
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/20 h-64 sm:h-80 group mt-6">
                <img
                  src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop"
                  alt="KPRCAS Central Knowledge Center"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Floating Quality Assurance Badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#070a13] text-white px-5 py-3 rounded-2xl border border-emerald-500/30 shadow-2xl flex items-center gap-3 w-max">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <FaGraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">KPR Group of Institutions</div>
                  <div className="text-[10px] text-emerald-400 font-semibold">Coimbatore, Tamil Nadu</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
