import React, { useState } from 'react';
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
import { FaGraduationCap, FaChalkboardTeacher, FaUserTie } from 'react-icons/fa';

export default function LandingPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [showPortalFab, setShowPortalFab] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-[#8B1538] selection:text-white">
      {/* Top Navbar */}
      <TopNavbar 
        onOpenSearch={() => setSearchOpen(true)}
        onOpenApply={() => {
          const el = document.getElementById('admissions');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Our Programs */}
      <ProgramsSection />

      {/* Embark on a Journey / About Unipix University */}
      <StorySection />

      {/* Tuition Fees */}
      <TuitionSection />

      {/* Campus Life */}
      <CampusLifeSection />

      {/* Apply For Admission */}
      <AdmissionSection />

      {/* Upcoming Events */}
      <UpcomingEventsSection />

      {/* Alumni Gazette Newsletter */}
      <AlumniNewsletterSection />

      {/* Footer */}
      <LandingFooter />

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Floating Fast-Access ERP Hub Widget */}
      <div className="fixed bottom-6 right-6 z-40">
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
