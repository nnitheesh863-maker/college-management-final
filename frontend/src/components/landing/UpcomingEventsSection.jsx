import React from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowRight, FaCertificate, FaGlobe } from 'react-icons/fa';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';

export default function UpcomingEventsSection() {
  const events = [
    {
      id: 1,
      date: 'Oct 14, 2026',
      time: '10:00 AM - 3:00 PM',
      location: 'Unipix Great Hall',
      title: 'Cultural Exchange: Building Global Connections Through Shared Traditions',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop',
      category: 'International'
    },
    {
      id: 2,
      date: 'Nov 02, 2026',
      time: '02:00 PM - 6:00 PM',
      location: 'Arts & Media Atrium',
      title: 'Future Voices: Celebrating Diverse Narratives In Contemporary Literature',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop',
      category: 'Arts & Culture'
    },
    {
      id: 3,
      date: 'Nov 18, 2026',
      time: '09:00 AM - 5:00 PM',
      location: 'Innovation & Science Hub',
      title: 'Shaping Tomorrow: Global Perspectives On AI, Robotics & Sustainable Tech',
      image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop',
      category: 'Symposium'
    }
  ];

  return (
    <section id="events" className="py-24 bg-[#0a0d16] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold tracking-[0.25em] text-[#8B1538] uppercase mb-2 block">
              Campus Life & Gatherings
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-white uppercase">
              Upcoming Event
            </h2>
          </div>

          <a
            href="#events"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A880] hover:text-white transition-colors"
          >
            <span>View All</span>
            <FaArrowUpRightFromSquare className="w-3 h-3" />
          </a>
        </div>

        {/* 3 Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-[#111726] rounded-2xl overflow-hidden border border-white/10 shadow-xl group transition-all duration-300 hover:-translate-y-1.5 hover:border-[#8B1538]/50"
            >
              {/* Event Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#8B1538] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                  {evt.category}
                </div>
              </div>

              {/* Event Details */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                  <span className="flex items-center gap-1.5 text-[#C5A880]">
                    <FaCalendarAlt className="w-3 h-3" /> {evt.date}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400 truncate">
                    <FaMapMarkerAlt className="w-3 h-3 text-[#8B1538]" /> {evt.location}
                  </span>
                </div>

                <h3 className="font-serif text-base font-bold text-white mb-4 line-clamp-2 leading-snug group-hover:text-amber-100 transition-colors">
                  {evt.title}
                </h3>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{evt.time}</span>
                  <button className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#8B1538] text-white flex items-center justify-center transition-all duration-300">
                    <FaArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Institutional Accreditation & Partner Crests Strip */}
        <div className="mt-20 pt-10 border-t border-white/10">
          <div className="text-center text-xs uppercase tracking-[0.3em] font-semibold text-slate-400 mb-8">
            Accredited & Recognized Worldwide
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2 text-sm font-serif font-bold tracking-widest text-slate-300">
              🏛️ AACSB ACCREDITED
            </div>
            <div className="flex items-center gap-2 text-sm font-serif font-bold tracking-widest text-slate-300">
              🎓 EQUIS CERTIFIED
            </div>
            <div className="flex items-center gap-2 text-sm font-serif font-bold tracking-widest text-slate-300">
              ⭐ QS 5-STAR RATED
            </div>
            <div className="flex items-center gap-2 text-sm font-serif font-bold tracking-widest text-slate-300">
              🌍 GLOBAL ALLIANCE
            </div>
            <div className="flex items-center gap-2 text-sm font-serif font-bold tracking-widest text-slate-300">
              📜 ISO 9001:2015
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
