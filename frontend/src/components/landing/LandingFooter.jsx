import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaYoutube, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaGraduationCap 
} from 'react-icons/fa';
import { UnipixLogo } from './UnipixLogo';

export default function LandingFooter() {
  return (
    <footer className="bg-[#06080e] text-slate-300 border-t border-white/10 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4">
            <UnipixLogo className="mb-4" />
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Unipix University is an internationally acclaimed institution dedicated to academic brilliance, transformative research, and empowering global citizens.
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <FaMapMarkerAlt className="text-[#8B1538] flex-shrink-0" />
                <span>450 University Quadrangle Ave, Cambridge, MA 02138</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FaPhoneAlt className="text-[#8B1538] flex-shrink-0" />
                <span>+1 (800) 555-UNIPIX / +1 (617) 495-1000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FaEnvelope className="text-[#8B1538] flex-shrink-0" />
                <span>info@unipix.edu • registrar@unipix.edu</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#8B1538] text-white flex items-center justify-center transition-colors">
                <FaFacebookF className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#8B1538] text-white flex items-center justify-center transition-colors">
                <FaTwitter className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#8B1538] text-white flex items-center justify-center transition-colors">
                <FaInstagram className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#8B1538] text-white flex items-center justify-center transition-colors">
                <FaLinkedinIn className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#8B1538] text-white flex items-center justify-center transition-colors">
                <FaYoutube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Our Campus */}
          <div className="lg:col-span-2">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-white/10">
              Our Campus
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#campus-life" className="hover:text-white transition-colors">Campus Virtual Tour</a></li>
              <li><a href="#campus-life" className="hover:text-white transition-colors">Residential Halls</a></li>
              <li><a href="#campus-life" className="hover:text-white transition-colors">Athletics & Recreation</a></li>
              <li><a href="#campus-life" className="hover:text-white transition-colors">Student Health Center</a></li>
              <li><a href="#campus-life" className="hover:text-white transition-colors">Dining & Cafeterias</a></li>
              <li><a href="#campus-life" className="hover:text-white transition-colors">Library & Archives</a></li>
            </ul>
          </div>

          {/* Column 3: Quick Links & ERP Portal Access */}
          <div className="lg:col-span-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-white/10">
              ERP & Resources
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/student-dashboard" className="text-[#C5A880] hover:text-white transition-colors flex items-center gap-1.5 font-semibold">
                  <FaGraduationCap /> Student ERP Dashboard
                </Link>
              </li>
              <li>
                <Link to="/teacher-dashboard" className="text-[#C5A880] hover:text-white transition-colors flex items-center gap-1.5 font-semibold">
                  <FaGraduationCap /> Faculty & Grading Portal
                </Link>
              </li>
              <li>
                <Link to="/principal-dashboard" className="text-[#C5A880] hover:text-white transition-colors flex items-center gap-1.5 font-semibold">
                  <FaGraduationCap /> Principal / Dean Console
                </Link>
              </li>
              <li><a href="#tuition" className="hover:text-white transition-colors">Tuition & Financial Aid</a></li>
              <li><a href="#admissions" className="hover:text-white transition-colors">Admissions Guidelines</a></li>
              <li><a href="#programs" className="hover:text-white transition-colors">Undergraduate & Graduate Majors</a></li>
            </ul>
          </div>

          {/* Column 4: Recent Posts */}
          <div className="lg:col-span-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-white/10">
              Recent News
            </h4>
            <div className="space-y-4">
              <div className="flex gap-3 group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=150&auto=format&fit=crop"
                  alt="News thumbnail"
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0 group-hover:opacity-80 transition-opacity"
                />
                <div>
                  <span className="text-[10px] text-[#8B1538] font-bold uppercase tracking-wider">Sept 18, 2026</span>
                  <h5 className="text-xs font-semibold text-white line-clamp-2 group-hover:text-[#E5D4BA] transition-colors">
                    New AI & Quantum Computing Research Institute Launched
                  </h5>
                </div>
              </div>

              <div className="flex gap-3 group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=150&auto=format&fit=crop"
                  alt="News thumbnail"
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0 group-hover:opacity-80 transition-opacity"
                />
                <div>
                  <span className="text-[10px] text-[#8B1538] font-bold uppercase tracking-wider">Sept 12, 2026</span>
                  <h5 className="text-xs font-semibold text-white line-clamp-2 group-hover:text-[#E5D4BA] transition-colors">
                    Unipix Faculty Wins Prestigious International Fellowship
                  </h5>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} UNIPIX UNIVERSITY. All Rights Reserved. Comprehensive College Management & ERP System.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Accreditation</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
