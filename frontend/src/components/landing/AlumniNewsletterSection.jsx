import React, { useState } from 'react';
import { FaPaperPlane, FaEnvelope, FaCheck } from 'react-icons/fa';

export default function AlumniNewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 500);
  };

  return (
    <section className="bg-[#680f28] text-white py-14 relative overflow-hidden border-t border-b border-white/10">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left Title */}
          <div className="text-center md:text-left">
            <h3 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-white mb-2">
              Don't Miss Awesome Stories <br className="hidden sm:inline" />
              <span className="font-serif italic text-[#ffd4df]">From Our Alumni</span>
            </h3>
            <p className="text-white/80 text-xs sm:text-sm">
              Receive monthly journals, groundbreaking faculty research, and alumni spotlights.
            </p>
          </div>

          {/* Right Input Bar */}
          <div className="w-full md:w-auto min-w-[320px] max-w-md">
            {subscribed ? (
              <div className="bg-white/20 border border-white/30 rounded-full px-6 py-3.5 flex items-center justify-center gap-2 text-xs font-semibold text-white animate-in fade-in">
                <FaCheck className="text-emerald-300" />
                <span>Thank you! You have subscribed to Unipix Alumni Gazette.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <div className="absolute left-4 text-white/50">
                  <FaEnvelope className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-32 py-3.5 rounded-full bg-white/10 border border-white/25 text-white placeholder:text-white/50 text-xs focus:outline-none focus:bg-white/20 focus:border-white transition-all backdrop-blur-sm"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 bg-white text-[#8B1538] hover:bg-slate-100 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>Subscribe</span>
                  <FaPaperPlane className="w-3 h-3" />
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
