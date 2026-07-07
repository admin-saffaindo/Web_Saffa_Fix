import React from 'react';
import { MessageCircle, Instagram, Facebook, Heart } from 'lucide-react';
import Logo from './Logo';
import { SOCIAL_LINKS, PRIMARY_WHATSAPP_DISPLAY } from '../data';

interface FooterProps {
  onOpenAdmin: () => void;
}

export default function Footer({ onOpenAdmin }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800" id="main-app-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Logo and Brand Presentation */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white/5 inline-block p-2 rounded-2xl">
              {/* White-optimized Logo representation */}
              <div className="flex items-center gap-2 select-none">
                <img
                  src="https://lh3.googleusercontent.com/d/1CQA9uRMs3qCNkti_QpI3q-g22bzWLC8j"
                  alt="Saffa Bubur Bayi"
                  className="w-9 h-9 object-contain rounded-full bg-white p-0.5"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col leading-none">
                  <span className="font-display font-bold text-lg text-white tracking-tight">
                    Saffa<span className="text-pink-400">.</span>
                  </span>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-400">
                    Bubur Bayi
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-medium max-w-sm">
              Saffa Bubur Bayi adalah pelopor penyedia MPASI premium yang segar, sehat, dan alami di Kepulauan Riau. Dibuat dengan cinta setiap pagi demi gizi terbaik si kecil.
            </p>

            {/* Social Icons row */}
            <div className="flex items-center gap-3 pt-2" id="footer-social-links">
              {/* Instagram */}
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-pink-400 hover:bg-slate-700/80 transition-colors flex items-center justify-center"
                aria-label="Saffa Instagram"
              >
                <Instagram size={18} />
              </a>

              {/* TikTok Icon represented using Custom Svg or Music Icon */}
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-pink-400 hover:bg-slate-700/80 transition-colors flex items-center justify-center font-bold text-xs"
                aria-label="Saffa TikTok"
              >
                T
              </a>

              {/* Facebook */}
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-pink-400 hover:bg-slate-700/80 transition-colors flex items-center justify-center"
                aria-label="Saffa Facebook"
              >
                <Facebook size={18} />
              </a>

              {/* Central WhatsApp */}
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-pink-400 hover:bg-slate-700/80 transition-colors flex items-center justify-center"
                aria-label="Saffa WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links Map */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigasi Website</h4>
            <div className="flex flex-col gap-2 text-xs font-semibold">
              <button onClick={() => scrollToSection('home')} className="text-left text-slate-500 hover:text-pink-400 transition-colors">
                Beranda
              </button>
              <button onClick={() => scrollToSection('menu')} className="text-left text-slate-500 hover:text-pink-400 transition-colors">
                Menu Sehat MPASI
              </button>
              <button onClick={() => scrollToSection('outlet')} className="text-left text-slate-500 hover:text-pink-400 transition-colors">
                11 Outlet Terdekat
              </button>
              <button onClick={() => scrollToSection('about')} className="text-left text-slate-500 hover:text-pink-400 transition-colors">
                Tentang Saffa
              </button>
              <button onClick={onOpenAdmin} className="text-left text-pink-400 hover:text-pink-300 font-bold transition-colors mt-2">
                🔐 Panel Admin Saffa
              </button>
            </div>
          </div>

          {/* Contact and HQ Address */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Kantor Pusat</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              📍 {SOCIAL_LINKS.headquarters}
            </p>
            <div className="text-xs text-slate-500 font-medium">
              <p>Email: saffaindo@gmail.com</p>
              <p className="mt-1">Hotline: <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">{PRIMARY_WHATSAPP_DISPLAY}</a></p>
            </div>
          </div>

        </div>

        {/* Bottom copyright segment */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© {currentYear} Saffa Bubur Bayi — MPASI Premium. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={12} className="text-pink-500 fill-pink-500" /> for healthy babies.
          </p>
        </div>

      </div>
    </footer>
  );
}
