import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowRight, FaTicketAlt, FaCheckCircle, FaTimes, FaClock } from 'react-icons/fa';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';

export default function UpcomingEventsSection() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // Countdown timer to the next symposium (Nov 18, 2026)
  const [timeLeft, setTimeLeft] = useState({ days: 57, hours: 14, minutes: 22, seconds: 40 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const events = [
    {
      id: 1,
      date: 'Oct 14, 2026',
      time: '10:00 AM - 3:00 PM',
      location: 'Unipix Great Hall',
      title: 'Cultural Exchange: Building Global Connections Through Shared Traditions',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop',
      category: 'International',
      description: 'Join over 40 cultural student organizations celebrating heritage through cuisine, traditional arts, musical showcases, and open dialogue.'
    },
    {
      id: 2,
      date: 'Nov 02, 2026',
      time: '02:00 PM - 6:00 PM',
      location: 'Arts & Media Atrium',
      title: 'Future Voices: Celebrating Diverse Narratives In Contemporary Literature',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop',
      category: 'Arts & Culture',
      description: 'Keynote readings and panel discussions featuring Pulitzer and Booker Prize nominated alumni authors and poets.'
    },
    {
      id: 3,
      date: 'Nov 18, 2026',
      time: '09:00 AM - 5:00 PM',
      location: 'Innovation & Science Hub',
      title: 'Shaping Tomorrow: Global Perspectives On AI, Robotics & Sustainable Tech',
      image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop',
      category: 'Symposium',
      description: 'An international academic conference bringing together AI researchers, ethicists, and aerospace engineers discussing the next century of tech.'
    }
  ];

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    setRsvpSuccess(true);
  };

  return (
    <section id="events" className="py-24 bg-[#0a0d16] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Next Major Event Countdown Banner */}
        <div className="mb-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#8B1538]/40 via-[#151c2e] to-[#0a0d16] border border-[#8B1538]/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-[#8B1538] text-white px-3 py-1 rounded-full inline-block mb-2">
              Featured Annual Symposium
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Shaping Tomorrow: Global AI & Robotics Summit
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Live broadcast & on-campus registration starts November 18, 2026.
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3 text-center">
            <div className="bg-black/60 border border-white/15 px-3.5 py-2.5 rounded-2xl min-w-[64px]">
              <div className="text-xl sm:text-2xl font-bold text-white font-mono">{timeLeft.days}</div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400">Days</div>
            </div>
            <span className="text-xl font-bold text-[#8B1538]">:</span>
            <div className="bg-black/60 border border-white/15 px-3.5 py-2.5 rounded-2xl min-w-[64px]">
              <div className="text-xl sm:text-2xl font-bold text-white font-mono">{timeLeft.hours}</div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400">Hours</div>
            </div>
            <span className="text-xl font-bold text-[#8B1538]">:</span>
            <div className="bg-black/60 border border-white/15 px-3.5 py-2.5 rounded-2xl min-w-[64px]">
              <div className="text-xl sm:text-2xl font-bold text-white font-mono">{timeLeft.minutes}</div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400">Mins</div>
            </div>
            <span className="text-xl font-bold text-[#8B1538]">:</span>
            <div className="bg-black/60 border border-white/15 px-3.5 py-2.5 rounded-2xl min-w-[64px]">
              <div className="text-xl sm:text-2xl font-bold text-white font-mono">{timeLeft.seconds}</div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400">Secs</div>
            </div>
          </div>
        </div>

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
              className="bg-[#111726] rounded-2xl overflow-hidden border border-white/10 shadow-xl group transition-all duration-300 hover:-translate-y-1.5 hover:border-[#8B1538]/50 flex flex-col justify-between"
            >
              {/* Event Image */}
              <div>
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

                  <h3 className="font-serif text-base font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-amber-100 transition-colors">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                    {evt.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <FaClock className="w-3 h-3 text-[#8B1538]" /> {evt.time}
                </span>
                <button
                  onClick={() => {
                    setSelectedEvent(evt);
                    setRsvpSuccess(false);
                    setRsvpName('');
                    setRsvpEmail('');
                  }}
                  className="bg-[#8B1538]/20 hover:bg-[#8B1538] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-[#8B1538]/40 transition-all flex items-center gap-1.5"
                >
                  <span>RSVP Free</span>
                  <FaArrowRight className="w-2.5 h-2.5" />
                </button>
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

      {/* RSVP Modal Dialog */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md bg-[#0f1422] border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full"
            >
              <FaTimes className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-[#8B1538]/20 text-[#f199b0]">
                <FaTicketAlt className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A880]">Free Event Pass</span>
                <h3 className="font-serif text-lg font-bold text-white">Event RSVP</h3>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 mb-6 text-xs text-slate-300">
              <strong className="text-white block mb-1">{selectedEvent.title}</strong>
              <div className="text-slate-400">{selectedEvent.date} • {selectedEvent.location}</div>
            </div>

            {rsvpSuccess ? (
              <div className="text-center py-4 text-emerald-400">
                <FaCheckCircle className="w-10 h-10 mx-auto mb-2" />
                <h4 className="font-bold text-white text-base">You're on the Guest List!</h4>
                <p className="text-xs text-slate-300 mt-1 mb-4">
                  A digital pass has been sent to <strong>{rsvpEmail}</strong>.
                </p>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="bg-[#8B1538] text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#8B1538]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={rsvpEmail}
                    onChange={(e) => setRsvpEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#8B1538]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#8B1538] hover:bg-[#630D25] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all"
                >
                  Confirm Registration
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
