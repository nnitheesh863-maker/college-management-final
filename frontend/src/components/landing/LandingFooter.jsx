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
import { KprcasLogo } from './UnipixLogo';

export default function LandingFooter() {
  return (
    <footer className="bg-[#050811] text-slate-300 border-t border-white/10 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4">
            <KprcasLogo className="mb-4" />
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              KPR College of Arts Science and Research (KPRCAS) empowers students to <em>Learn Beyond</em> boundaries through transformative education, experiential industry training, and ethical leadership.
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <FaMapMarkerAlt className="text-emerald-400 flex-shrink-0" />
                <span>Avinashi Road, Arasur, Coimbatore, Tamil Nadu - 641407</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FaPhoneAlt className="text-emerald-400 flex-shrink-0" />
                <span>+91 422 263 5678 / +91 97509 11111</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FaEnvelope className="text-blue-400 flex-shrink-0" />
                <span>info@kprcas.ac.in • admissions@kprcas.ac.in</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-blue-600 text-white flex items-center justify-center transition-colors">
                <FaFacebookF className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-sky-500 text-white flex items-center justify-center transition-colors">
                <FaTwitter className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-pink-600 text-white flex items-center justify-center transition-colors">
                <FaInstagram className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-blue-700 text-white flex items-center justify-center transition-colors">
                <FaLinkedinIn className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-600 text-white flex items-center justify-center transition-colors">
                <FaYoutube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Our Campus */}
          <div className="lg:col-span-2">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-white/10">
              Campus & Labs
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#campus-life" className="hover:text-white transition-colors">AI & Data Analytics Lab</a></li>
              <li><a href="#campus-life" className="hover:text-white transition-colors">IoT & Robotics Center</a></li>
              <li><a href="#campus-life" className="hover:text-white transition-colors">Digital Knowledge Hub</a></li>
              <li><a href="#campus-life" className="hover:text-white transition-colors">Hostels & Living Suites</a></li>
              <li><a href="#campus-life" className="hover:text-white transition-colors">Sports & Fitness Complex</a></li>
              <li><a href="#campus-life" className="hover:text-white transition-colors">Cafeteria & Food Courts</a></li>
            </ul>
          </div>

          {/* Column 3: Quick Links & ERP Portal Access */}
          <div className="lg:col-span-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-white/10">
              KPRCAS ERP Systems
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/student-dashboard" className="text-emerald-400 hover:text-white transition-colors flex items-center gap-1.5 font-semibold">
                  <FaGraduationCap /> Student ERP Console
                </Link>
              </li>
              <li>
                <Link to="/teacher-dashboard" className="text-blue-400 hover:text-white transition-colors flex items-center gap-1.5 font-semibold">
                  <FaGraduationCap /> Faculty & Mark Entry
                </Link>
              </li>
              <li>
                <Link to="/principal-dashboard" className="text-purple-400 hover:text-white transition-colors flex items-center gap-1.5 font-semibold">
                  <FaGraduationCap /> Principal & Dean Office
                </Link>
              </li>
              <li><a href="#tuition" className="hover:text-white transition-colors">Tuition Fees & Scholarships</a></li>
              <li><a href="#admissions" className="hover:text-white transition-colors">Online Admission 2026-27</a></li>
              <li><a href="#programs" className="hover:text-white transition-colors">Academic Departments</a></li>
            </ul>
          </div>

          {/* Column 4: Recent News */}
          <div className="lg:col-span-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-white/10">
              Campus Gazette
            </h4>
            <div className="space-y-4">
              <div className="flex gap-3 group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=150&auto=format&fit=crop"
                  alt="News thumbnail"
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0 group-hover:opacity-80 transition-opacity"
                />
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Sept 20, 2026</span>
                  <h5 className="text-xs font-semibold text-white line-clamp-2 group-hover:text-blue-300 transition-colors">
                    KPRCAS Students Win National AI & Smart City Hackathon
                  </h5>
                </div>
              </div>

              <div className="flex gap-3 group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=150&auto=format&fit=crop"
                  alt="News thumbnail"
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0 group-hover:opacity-80 transition-opacity"
                />
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Sept 15, 2026</span>
                  <h5 className="text-xs font-semibold text-white line-clamp-2 group-hover:text-blue-300 transition-colors">
                    100+ Leading MNCs Participate in KPRCAS Annual Placement Drive
                  </h5>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} KPRCAS (KPR College of Arts Science and Research) • LEARN BEYOND. All Rights Reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">UGC & NAAC Portal</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
