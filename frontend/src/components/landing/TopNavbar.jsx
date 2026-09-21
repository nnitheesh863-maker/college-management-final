import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaGlobe, 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaBars, 
  FaTimes, 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaUserTie,
  FaPhoneAlt,
  FaEnvelope
} from 'react-icons/fa';
import { UnipixLogo } from './UnipixLogo';

export default function TopNavbar({ onOpenSearch, onOpenApply }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Programs', href: '#programs' },
    { name: 'About', href: '#story' },
    { name: 'Tuition', href: '#tuition' },
    { name: 'Campus Life', href: '#campus-life' },
    { name: 'Admissions', href: '#admissions' },
    { name: 'Events', href: '#events' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Utility Bar */}
      <div className={`bg-[#06080e]/90 text-slate-300 text-xs border-b border-white/10 px-4 lg:px-12 py-2 transition-all duration-300 ${isScrolled ? 'hidden' : 'block'}`}>
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <FaPhoneAlt className="text-[#8B1538]" /> +1 (800) 555-UNIPIX
            </span>
            <span className="hidden sm:flex items-center gap-2">
              <FaEnvelope className="text-[#8B1538]" /> admissions@unipix.edu
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 border-r border-white/15 pr-4">
              <a href="#" className="hover:text-[#8B1538] transition-colors"><FaFacebookF /></a>
              <a href="#" className="hover:text-[#8B1538] transition-colors"><FaTwitter /></a>
              <a href="#" className="hover:text-[#8B1538] transition-colors"><FaInstagram /></a>
              <a href="#" className="hover:text-[#8B1538] transition-colors"><FaLinkedinIn /></a>
            </div>

            <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
              <FaGlobe className="text-[#8B1538]" />
              <span className="font-semibold tracking-wider text-[11px]">ENG</span>
            </div>

            <Link
              to="/login"
              className="bg-[#8B1538] hover:bg-[#630D25] text-white px-3 py-1 rounded text-[11px] font-semibold tracking-wide transition-all shadow-sm flex items-center gap-1.5"
            >
              ERP Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`px-4 lg:px-12 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0a0d14]/95 backdrop-blur-md shadow-xl border-b border-white/10 py-3.5' 
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#hero" className="flex items-center group">
            <UnipixLogo />
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-200 hover:text-white relative py-1 transition-colors group text-[13.5px] uppercase font-semibold"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8B1538] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Action Area */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onOpenSearch}
              className="p-2.5 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              title="Search"
              aria-label="Search"
            >
              <FaSearch className="w-4 h-4" />
            </button>

            {/* Portal Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                className="bg-white/10 hover:bg-white/15 border border-white/20 text-white px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 backdrop-blur-sm"
              >
                Portals
                <span className="text-[10px]">▼</span>
              </button>

              {portalDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-[#0f1422] border border-white/15 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setPortalDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-white/10 text-[11px] font-semibold text-[#8B1538] tracking-widest uppercase">
                    Select University Portal
                  </div>
                  <Link
                    to="/student-dashboard"
                    onClick={() => setPortalDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-[#8B1538]/20 hover:text-white transition-colors"
                  >
                    <FaUserGraduate className="text-[#8B1538]" /> Student Dashboard
                  </Link>
                  <Link
                    to="/teacher-dashboard"
                    onClick={() => setPortalDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-[#8B1538]/20 hover:text-white transition-colors"
                  >
                    <FaChalkboardTeacher className="text-[#8B1538]" /> Faculty Portal
                  </Link>
                  <Link
                    to="/principal-dashboard"
                    onClick={() => setPortalDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-[#8B1538]/20 hover:text-white transition-colors"
                  >
                    <FaUserTie className="text-[#8B1538]" /> Dean / Principal Office
                  </Link>
                  <div className="border-t border-white/10 mt-1 pt-1">
                    <Link
                      to="/login"
                      onClick={() => setPortalDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-semibold text-center text-slate-300 hover:text-white"
                    >
                      Sign In to Account →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Apply Now Primary CTA */}
            <a
              href="#admissions"
              onClick={onOpenApply}
              className="bg-[#8B1538] hover:bg-[#630D25] text-white px-5 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all shadow-[0_4px_14px_rgba(139,21,56,0.39)] hover:shadow-[0_6px_20px_rgba(139,21,56,0.5)] transform hover:-translate-y-0.5"
            >
              Apply Now
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-300 hover:text-white"
              aria-label="Search"
            >
              <FaSearch className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4 bg-[#0d111a]/95 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-200 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px bg-white/10 my-2" />
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-white/10 text-white text-center py-2.5 rounded-lg text-xs font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-white/10 text-white text-center py-2.5 rounded-lg text-xs font-semibold"
                >
                  Register
                </Link>
              </div>
              <a
                href="#admissions"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenApply) onOpenApply();
                }}
                className="bg-[#8B1538] text-white text-center py-3 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg"
              >
                Apply for Admission
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
