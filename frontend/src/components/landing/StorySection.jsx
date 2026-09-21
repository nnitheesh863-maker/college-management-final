import React from 'react';
import { FaArrowRight, FaLandmark, FaBookOpen, FaAward, FaUniversity } from 'react-icons/fa';

export default function StorySection() {
  return (
    <section id="story" className="relative bg-[#8B1538] text-white py-24 overflow-hidden">
      {/* Huge Outline Watermark Typography "About University" */}
      <div className="absolute -bottom-10 left-0 right-0 overflow-hidden pointer-events-none select-none opacity-10">
        <span className="font-serif text-[120px] sm:text-[180px] md:text-[230px] font-black uppercase tracking-tight text-white whitespace-nowrap block text-center">
          About University
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Story Headline & Text */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 bg-black/20 border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">
              <FaUniversity className="text-[#E5D4BA]" />
              <span>University Heritage</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-white leading-tight mb-6">
              Embark on a Journey: <br />
              <span className="font-serif italic font-normal text-[#ffd4df]">
                Unveiling the Story of Unipix University
              </span>
            </h2>

            <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-6 font-light">
              Embark on a journey of knowledge, discovery, and growth at Unipix University. 
              Our admissions process is designed to identify bright, motivated individuals who are eager to contribute to our dynamic academic community.
            </p>

            <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-8">
              Founded with the vision of cultivating visionary thinkers, Unipix unites centuries of academic tradition with cutting-edge 21st century research labs, inspiring a global family of scholars.
            </p>

            {/* Action CTA & Ripple Ring */}
            <div className="flex items-center gap-6">
              <a
                href="#campus-life"
                className="group inline-flex items-center gap-3 bg-white text-[#8B1538] hover:bg-slate-100 px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Learn More</span>
                <FaArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 text-[#8B1538]" />
              </a>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center animate-pulse">
                  <FaLandmark className="text-white/80 text-sm" />
                </div>
                <div className="text-xs font-medium text-white/90">
                  <span>130+ Years</span>
                  <div className="text-[10px] text-white/60">Of Distinction</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Heritage Collage (Statues, Classic Library, Grand Hall) */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4 relative">
              {/* Image 1: Classical Marble Bust / Sculpture */}
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20 h-64 sm:h-80 group">
                <img
                  src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop"
                  alt="University Classical Art & Sculpture"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Image 2: Historic Books / Library Stacks */}
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20 h-64 sm:h-80 group mt-6">
                <img
                  src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop"
                  alt="Unipix Historic Research Library"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Floating Award Badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#0a0e17] text-white px-5 py-3 rounded-xl border border-white/20 shadow-2xl flex items-center gap-3 w-max">
                <div className="p-2 rounded-lg bg-[#8B1538] text-white">
                  <FaAward className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">QS World Top 50</div>
                  <div className="text-[10px] text-slate-400">Global Academic Excellence</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
