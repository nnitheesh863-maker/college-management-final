import React, { useState } from 'react';
import { FaArrowUpRightFromSquare, FaGraduationCap, FaLaptopCode, FaMicroscope, FaPalette } from 'react-icons/fa6';

export default function ProgramsSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const programs = [
    {
      id: 1,
      title: 'Graduate & Undergraduate',
      category: 'undergrad',
      badge: 'B.Sc / B.A / B.Tech',
      description: 'Rigorous foundational and specialized degrees designed to foster critical thinking and practical leadership.',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop',
      stats: '4 Years • 120 Credits'
    },
    {
      id: 2,
      title: 'Lifelong Learning & Research',
      category: 'graduate',
      badge: 'M.Sc / Ph.D / MBA',
      description: 'Advanced postgraduate research programs mentored by world-renowned faculty and industry thought leaders.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop',
      stats: '2 Years • Thesis Track'
    },
    {
      id: 3,
      title: 'Applied Engineering & AI',
      category: 'engineering',
      badge: 'STEM Certified',
      description: 'Hands-on laboratories, machine learning clusters, and experiential robotics and engineering projects.',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop',
      stats: 'State-of-the-art Labs'
    },
    {
      id: 4,
      title: 'Global Exchange & Humanities',
      category: 'international',
      badge: 'Study Abroad',
      description: 'Cross-cultural immersion, dual-degree international pathways, and heritage humanities exploration.',
      image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1000&auto=format&fit=crop',
      stats: '30+ Global Partner Univs'
    }
  ];

  return (
    <section id="programs" className="py-24 bg-[#0e121c] text-white relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B1538]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading, Description & Curved Pointer */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-xs font-bold tracking-[0.25em] text-[#8B1538] uppercase mb-3">
              Academic Excellence
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-white mb-6">
              Our Programs
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Embark on a journey of knowledge, discovery, and growth at Unipix University. 
              Our admissions process is designed to identify bright, motivated individuals who are eager to contribute to our dynamic academic community.
            </p>

            {/* Pointer graphic + View All Programs CTA matching the screenshot */}
            <div className="relative mt-4 flex items-center gap-6">
              {/* Curved SVG Arrow */}
              <svg 
                className="w-20 h-16 text-slate-400 transform -rotate-12 hidden sm:block" 
                viewBox="0 0 100 80" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M10 70 C 30 50, 40 20, 85 25" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeDasharray="4 3" 
                  strokeLinecap="round" 
                />
                <polygon points="82,18 92,26 84,33" fill="currentColor" />
              </svg>

              <a
                href="#admissions"
                className="inline-flex items-center gap-2.5 bg-[#8B1538] hover:bg-[#630D25] text-white px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>View All Program</span>
                <FaArrowUpRightFromSquare className="w-3 h-3" />
              </a>
            </div>

            {/* Department Badges */}
            <div className="mt-12 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="p-2 rounded-lg bg-[#8B1538]/20 text-[#f199b0]">
                  <FaGraduationCap className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">Undergraduate</div>
                  <div className="text-slate-400 text-[11px]">80+ Degrees</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
                  <FaMicroscope className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">Postgraduate</div>
                  <div className="text-slate-400 text-[11px]">45+ Masters & PhD</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 4-Card Bento Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {programs.map((prog, idx) => (
                <div
                  key={prog.id}
                  className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-white/10 shadow-lg cursor-pointer transition-all duration-500 hover:shadow-2xl hover:border-[#8B1538]/60 hover:-translate-y-1.5"
                >
                  {/* Background Image */}
                  <img
                    src={prog.image}
                    alt={prog.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20 group-hover:from-black/90 group-hover:via-[#8B1538]/30 group-hover:to-transparent transition-all duration-500" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/60 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full text-white border border-white/20">
                      {prog.badge}
                    </span>
                  </div>

                  {/* Content Footer */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 transform transition-transform duration-300">
                    <h3 className="font-serif text-lg font-bold text-white mb-1.5 leading-snug group-hover:text-amber-100">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 mb-3 opacity-90 group-hover:opacity-100 transition-opacity">
                      {prog.description}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-[#C5A880] font-semibold border-t border-white/15 pt-2">
                      <span>{prog.stats}</span>
                      <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
