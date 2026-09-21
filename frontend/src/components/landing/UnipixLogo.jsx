import React from 'react';

export const KPRCAS_LOGO_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdP-RRJw9azqzZPRS0X-mnx3PdXPS5QsgS4CX97vPFypWutU4AuuXr69W8&s=10";

export const KprcasLogo = ({ className = "h-11", dark = false, showTagline = true }) => (
  <div className={`flex items-center gap-3 select-none ${className}`}>
    <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md flex-shrink-0 bg-white p-0.5 border border-slate-200">
      <img
        src={KPRCAS_LOGO_URL}
        alt="KPRCAS - Learn Beyond Logo"
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback SVG if network image is blocked
          e.target.style.display = 'none';
        }}
      />
    </div>
    <div className="flex flex-col text-left">
      <div className="flex items-baseline gap-1.5">
        <span className={`text-xl font-black tracking-wider leading-none ${dark ? 'text-slate-900' : 'text-white'}`}>
          KPR<span className="text-[#1e3a8a] text-blue-500 font-extrabold">CAS</span>
        </span>
        <span className="text-[9px] font-bold text-emerald-500 tracking-wider uppercase">ERP</span>
      </div>
      {showTagline && (
        <span className="text-[8.5px] tracking-[0.22em] font-semibold text-slate-400 uppercase mt-0.5">
          Learn Beyond
        </span>
      )}
    </div>
  </div>
);

// Backward compatibility alias
export const UnipixLogo = KprcasLogo;
export const UnipixCrest = ({ className = "w-10 h-10" }) => (
  <img
    src={KPRCAS_LOGO_URL}
    alt="KPRCAS Crest"
    className={`rounded-xl object-contain bg-white p-1 border border-slate-200 shadow ${className}`}
  />
);
