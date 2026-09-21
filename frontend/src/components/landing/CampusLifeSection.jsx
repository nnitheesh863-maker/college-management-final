import React from 'react';
import { FaUsers, FaFootballBall, FaHotel, FaTheaterMasks, FaHeartbeat } from 'react-icons/fa';

export default function CampusLifeSection() {
  const highlights = [
    {
      icon: <FaUsers className="w-5 h-5 text-[#C5A880]" />,
      title: '150+ Student Clubs & Orgs',
      desc: 'From robotics and debate to sustainable agriculture and arts collectives.'
    },
    {
      icon: <FaFootballBall className="w-5 h-5 text-[#8B1538]" />,
      title: 'Championship Athletics',
      desc: '18 varsity teams competing with state-of-the-art training facilities.'
    },
    {
      icon: <FaHotel className="w-5 h-5 text-sky-400" />,
      title: 'Modern Residential Halls',
      desc: 'Comfortable living-learning communities with 24/7 security and dining.'
    },
    {
      icon: <FaHeartbeat className="w-5 h-5 text-emerald-400" />,
      title: 'Health & Wellness',
      desc: 'Comprehensive medical center, mental health counseling, and fitness hubs.'
    }
  ];

  return (
    <section id="campus-life" className="py-24 bg-[#080b12] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-xs font-semibold uppercase tracking-widest text-[#E5D4BA] mb-4">
            Campus Life
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-white mb-6">
            Thriving Beyond Classes <br />
            <span className="font-serif italic font-normal text-slate-300">
              Campus Life at Unipix
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Experience an enriching campus culture where friendships are forged, passions are ignited, and lifelong memories are made every single day.
          </p>
        </div>

        {/* Large Visual Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
          
          {/* Main Hero Shot: Students walking through university courtyard */}
          <div className="md:col-span-8 relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group h-80 sm:h-96 md:h-[450px]">
            <img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop"
              alt="Students enjoying campus life at Unipix"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="bg-[#8B1538] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Student Community
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-2">
                A Diverse, Inclusive Global Family
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Students from more than 95 nations come together to collaborate, celebrate cultural festivals, and drive social innovation.
              </p>
            </div>
          </div>

          {/* Secondary Collage */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group h-40 sm:h-52">
              <img
                src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop"
                alt="Student activities and leadership"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-xs font-semibold text-white">
                Extracurriculars & Innovation Hub
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group h-40 sm:h-52">
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop"
                alt="University symposiums and theater"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-xs font-semibold text-white">
                Performing Arts & Cultural Festivals
              </div>
            </div>
          </div>

        </div>

        {/* 4 Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-3 rounded-xl bg-white/5 w-max mb-4">
                {item.icon}
              </div>
              <h4 className="font-serif text-base font-bold text-white mb-2">
                {item.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
