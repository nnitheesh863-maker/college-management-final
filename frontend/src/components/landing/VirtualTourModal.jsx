import React, { useState } from 'react';
import { FaTimes, FaCamera, FaCompass, FaMapPin } from 'react-icons/fa';

export default function VirtualTourModal({ isOpen, onClose }) {
  const [activeLocation, setActiveLocation] = useState(0);

  if (!isOpen) return null;

  const locations = [
    {
      name: 'Great Gothic Quadrangle & Tower',
      tag: 'Historic Core',
      desc: 'Dating back to 1894, the Grand Quadrangle hosts university convocations, public lectures, and architectural heritage tours.',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'Central Research Library & Rare Book Archives',
      tag: 'Academic Hub',
      desc: 'Housing over 3.5 million volumes, state-of-the-art quiet study pods, and specialized manuscripts archives.',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'Advanced Quantum & Robotics Innovation Lab',
      tag: 'STEM Complex',
      desc: 'Equipped with supercomputer nodes, robotic fabrication arms, clean rooms, and collaborative maker spaces.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'Olympian Athletic Center & Aquatic Complex',
      tag: 'Recreation',
      desc: '50-meter Olympic swimming facility, indoor basketball courts, rock climbing wall, and sports medicine clinic.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-[#0e1322] border border-white/20 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#0a0d16]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#8B1538]/20 text-[#f199b0]">
              <FaCompass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                Unipix Campus 360° Virtual Explorer
              </h2>
              <p className="text-xs text-slate-400">
                Interactive photographic tour of our historic and modern facilities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Panoramic Display */}
        <div className="relative h-64 sm:h-96 w-full overflow-hidden bg-black">
          <img
            src={locations[activeLocation].image}
            alt={locations[activeLocation].name}
            className="w-full h-full object-cover transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1322] via-transparent to-black/30" />

          {/* Location Badge */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="bg-[#8B1538] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-2">
                {locations[activeLocation].tag}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white drop-shadow">
                {locations[activeLocation].name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl drop-shadow">
                {locations[activeLocation].desc}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs text-[#E5D4BA]">
              <FaCamera className="w-3 h-3" />
              <span>HD Panorama View</span>
            </div>
          </div>
        </div>

        {/* Location Switcher Tabs */}
        <div className="p-4 sm:p-6 bg-[#0a0d16] border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {locations.map((loc, idx) => (
            <button
              key={idx}
              onClick={() => setActiveLocation(idx)}
              className={`p-3 rounded-2xl border text-left transition-all duration-300 flex items-start gap-2.5 ${
                activeLocation === idx
                  ? 'bg-[#8B1538]/20 border-[#8B1538] text-white shadow-lg'
                  : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <FaMapPin className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${activeLocation === idx ? 'text-[#8B1538]' : 'text-slate-500'}`} />
              <div className="text-xs truncate">
                <div className="font-bold truncate">{loc.name.split('&')[0]}</div>
                <div className="text-[10px] opacity-75">{loc.tag}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
