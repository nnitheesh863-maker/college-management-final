import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopNavbar from '../components/landing/TopNavbar';
import HeroSection from '../components/landing/HeroSection';
import ProgramsSection from '../components/landing/ProgramsSection';
import StorySection from '../components/landing/StorySection';
import TuitionSection from '../components/landing/TuitionSection';
import CampusLifeSection from '../components/landing/CampusLifeSection';
import AdmissionSection from '../components/landing/AdmissionSection';
import UpcomingEventsSection from '../components/landing/UpcomingEventsSection';
import AlumniNewsletterSection from '../components/landing/AlumniNewsletterSection';
import LandingFooter from '../components/landing/LandingFooter';
import SearchModal from '../components/landing/SearchModal';
import ProgramModal from '../components/landing/ProgramModal';
import VirtualTourModal from '../components/landing/VirtualTourModal';
import { FaGraduationCap, FaChalkboardTeacher, FaUserTie, FaChevronUp } from 'react-icons/fa';

export default function LandingPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [prefilledMajor, setPrefilledMajor] = useState('');
  const [showPortalFab, setShowPortalFab] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyForProgram = (programName) => {
    setPrefilledMajor(programName);
    const el = document.getElementById('admissions');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-[#8B1538] selection:text-white">
      {/* Top Navbar */}
      <TopNavbar 
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Our Programs */}
      <ProgramsSection onSelectProgram={(prog) => setSelectedProgram(prog)} />

      {/* Embark on a Journey / About Unipix University */}
      <StorySection />

      {/* Tuition Fees & Dynamic Cost Calculator */}
      <TuitionSection />

      {/* Campus Life with Virtual Tour Trigger */}
      <CampusLifeSection onOpenTour={() => setTourOpen(true)} />

      {/* Apply For Admission Multi-Step Wizard */}
      <AdmissionSection prefilledProgram={prefilledMajor} />

      {/* Upcoming Events & Countdown */}
      <UpcomingEventsSection />

      {/* Alumni Gazette Newsletter */}
      <AlumniNewsletterSection />

      {/* Footer */}
      <LandingFooter />

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Program Details Modal */}
      <ProgramModal 
        isOpen={!!selectedProgram} 
        program={selectedProgram} 
        onClose={() => setSelectedProgram(null)} 
        onApply={handleApplyForProgram}
      />

      {/* Virtual Tour Modal */}
      <VirtualTourModal isOpen={tourOpen} onClose={() => setTourOpen(false)} />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-[#8B1538] text-white border border-white/20 flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-md"
            title="Scroll to top"
            aria-label="Scroll to top"
          >
            <FaChevronUp className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Fast-Access ERP Hub Widget */}
        <div className="relative group">
          {showPortalFab && (
            <div className="absolute bottom-14 right-0 w-64 bg-[#0f1422] border border-white/20 rounded-2xl shadow-2xl p-3 mb-2 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#8B1538] px-2 mb-2">
                Quick Portal Jump
              </div>
              <div className="space-y-1">
                <Link
                  to="/student-dashboard"
                  className="flex items-center gap-2.5 p-2 rounded-lg text-xs text-slate-200 hover:bg-[#8B1538]/20 hover:text-white transition-colors"
                >
                  <FaGraduationCap className="text-[#8B1538]" /> Student Dashboard
                </Link>
                <Link
                  to="/teacher-dashboard"
                  className="flex items-center gap-2.5 p-2 rounded-lg text-xs text-slate-200 hover:bg-[#8B1538]/20 hover:text-white transition-colors"
                >
                  <FaChalkboardTeacher className="text-[#8B1538]" /> Teacher Dashboard
                </Link>
                <Link
                  to="/principal-dashboard"
                  className="flex items-center gap-2.5 p-2 rounded-lg text-xs text-slate-200 hover:bg-[#8B1538]/20 hover:text-white transition-colors"
                >
                  <FaUserTie className="text-[#8B1538]" /> Principal Dashboard
                </Link>
                <div className="border-t border-white/10 pt-1 mt-1">
                  <Link
                    to="/login"
                    className="block text-center py-1.5 text-[11px] font-semibold text-[#C5A880] hover:text-white"
                  >
                    Open Login Page →
                  </Link>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowPortalFab(!showPortalFab)}
            className="bg-[#8B1538] hover:bg-[#630D25] text-white p-3.5 rounded-full shadow-[0_8px_25px_rgba(139,21,56,0.5)] border border-white/25 flex items-center gap-2 transition-all transform hover:scale-105"
            title="ERP System Portals"
          >
            <FaGraduationCap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">ERP Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
}
