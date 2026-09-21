import React from 'react';

export const UnipixCrest = ({ className = "w-12 h-12", color = "#8B1538" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Laurel Wreath */}
    <path
      d="M30 35C24 45 25 62 35 73C38 76 43 80 50 82C57 80 62 76 65 73C75 62 76 45 70 35"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray="4 3"
    />
    <path
      d="M20 45C16 55 18 68 28 78C34 84 41 88 50 90C59 88 66 84 72 78C82 68 84 55 80 45"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Laurel Leaves Left */}
    <path d="M28 32C24 35 22 41 25 45C27 41 31 38 34 37" fill={color} opacity="0.85" />
    <path d="M22 45C18 49 17 56 21 60C23 55 27 52 30 50" fill={color} opacity="0.85" />
    <path d="M21 60C18 65 19 72 24 75C25 70 28 66 32 64" fill={color} opacity="0.85" />
    <path d="M27 74C26 79 29 84 35 86C35 81 37 77 41 74" fill={color} opacity="0.85" />
    
    {/* Laurel Leaves Right */}
    <path d="M72 32C76 35 78 41 75 45C73 41 69 38 66 37" fill={color} opacity="0.85" />
    <path d="M78 45C82 49 83 56 79 60C77 55 73 52 70 50" fill={color} opacity="0.85" />
    <path d="M79 60C82 65 81 72 76 75C75 70 72 66 68 64" fill={color} opacity="0.85" />
    <path d="M73 74C74 79 71 84 65 86C65 81 63 77 59 74" fill={color} opacity="0.85" />

    {/* University Pen / Torch Crest Center */}
    <path
      d="M50 16L54 28L50 64L46 28L50 16Z"
      fill={color}
    />
    <path
      d="M50 12L53 18H47L50 12Z"
      fill={color}
    />
    <circle cx="50" cy="40" r="3" fill="#ffffff" />
    <path
      d="M42 46C42 46 47 48 50 48C53 48 58 46 58 46L55 58C55 58 52 60 50 60C48 60 45 58 45 58L42 46Z"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    {/* Base Ribbon */}
    <path
      d="M38 88C44 91 56 91 62 88"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export const UnipixLogo = ({ className = "h-10", dark = false }) => (
  <div className={`flex items-center gap-3 font-cinzel select-none ${className}`}>
    <UnipixCrest className="w-9 h-9 flex-shrink-0" color="#8B1538" />
    <div className="flex flex-col text-left">
      <span className={`text-lg font-extrabold tracking-[0.2em] leading-none ${dark ? 'text-slate-900' : 'text-white'}`}>
        UNIPIX
      </span>
      <span className="text-[8.5px] tracking-[0.35em] font-semibold text-[#8B1538] uppercase mt-0.5">
        University
      </span>
    </div>
  </div>
);
