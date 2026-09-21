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
import { KprcasLogo } from './UnipixLogo';

export default function TopNavbar({ onOpenSearch }) {
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
    { name: 'About KPRCAS', href: '#story' },
    { name: 'Tuition & Aid', href: '#tuition' },
    { name: 'Campus Life', href: '#campus-life' },
    { name: 'Admissions', href: '#admissions' },
    { name: 'Events', href: '#events' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Utility Bar */}
      <div className={`bg-[#06080e]/95 text-slate-300 text-xs border-b border-white/10 px-4 lg:px-12 py-2 transition-all duration-300 ${isScrolled ? 'hidden' : 'block'}`}>
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <FaPhoneAlt className="text-emerald-400" /> +91 422 263 5678 / +91 97509 11111
            </span>
            <span className="hidden sm:flex items-center gap-2">
              <FaEnvelope className="text-blue-400" /> admissions@kprcas.ac.in
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 border-r border-white/15 pr-4">
              <a href="#" className="hover:text-blue-400 transition-colors"><FaFacebookF /></a>
              <a href="#" className="hover:text-blue-400 transition-colors"><FaTwitter /></a>
              <a href="#" className="hover:text-pink-400 transition-colors"><FaInstagram /></a>
              <a href="#" className="hover:text-blue-500 transition-colors"><FaLinkedinIn /></a>
            </div>

            <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
              <FaGlobe className="text-emerald-400" />
              <span className="font-semibold tracking-wider text-[11px]">ENG</span>
            </div>

            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-3.5 py-1 rounded-lg text-[11px] font-bold tracking-wide transition-all shadow-sm flex items-center gap-1.5"
            >
              ERP Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`px-4 lg:px-12 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#070a13]/95 backdrop-blur-md shadow-2xl border-b border-white/10 py-3.5' 
          : 'bg-gradient-to-b from-black/85 via-black/50 to-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#hero" className="flex items-center group">
            <KprcasLogo />
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-200 hover:text-white relative py-1 transition-colors group text-[13px] uppercase font-bold"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300 group-hover:w-full" />
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
                className="bg-white/10 hover:bg-white/15 border border-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 backdrop-blur-sm"
              >
                <span>ERP Portals</span>
                <span className="text-[10px]">▼</span>
              </button>

              {portalDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-60 bg-[#0c1222] border border-white/15 rounded-2xl shadow-2xl py-2 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setPortalDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-white/10 text-[10px] font-bold text-emerald-400 tracking-widest uppercase">
                    KPRCAS Institutional Portals
                  </div>
                  <Link
                    to="/student-dashboard"
                    onClick={() => setPortalDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs text-slate-200 hover:bg-blue-600/20 hover:text-white transition-colors"
                  >
                    <FaUserGraduate className="text-blue-400" /> Student Dashboard
                  </Link>
                  <Link
                    to="/teacher-dashboard"
                    onClick={() => setPortalDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs text-slate-200 hover:bg-emerald-600/20 hover:text-white transition-colors"
                  >
                    <FaChalkboardTeacher className="text-emerald-400" /> Faculty & Grading
                  </Link>
                  <Link
                    to="/principal-dashboard"
                    onClick={() => setPortalDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs text-slate-200 hover:bg-purple-600/20 hover:text-white transition-colors"
                  >
                    <FaUserTie className="text-purple-400" /> Principal / Dean Console
                  </Link>
                  <div className="border-t border-white/10 mt-1 pt-1">
                    <Link
                      to="/login"
                      onClick={() => setPortalDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-bold text-center text-blue-400 hover:text-white"
                    >
                      Sign In to Account →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Launch ERP Primary CTA */}
            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)] transform hover:-translate-y-0.5 flex items-center gap-1.5"
            >
              <span>Launch ERP 🚀</span>
            </Link>
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
          <div className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4 bg-[#0d1222]/98 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl">
            <div className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-200 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg font-medium text-xs uppercase tracking-wider transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px bg-white/10 my-2" />
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-white/10 text-white text-center py-2.5 rounded-xl text-xs font-bold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-white/10 text-white text-center py-2.5 rounded-xl text-xs font-bold"
                >
                  Register
                </Link>
              </div>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-center py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
              >
                <span>Launch ERP 🚀</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

