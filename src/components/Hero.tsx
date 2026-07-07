import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, MessageCircle } from 'lucide-react';

interface HeroProps {
  onOpenOrderModal: () => void;
}

export default function Hero({ onOpenOrderModal }: HeroProps) {
  const scrollToMenu = () => {
    const element = document.getElementById('menu');
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
    <section
      id="home"
      className="relative pt-32 pb-16 sm:py-36 overflow-hidden bg-radial from-pink-50/70 via-white to-white"
    >
      {/* Absolute Decorative Blobs */}
      <div className="absolute top-20 left-10 w-48 h-48 bg-pink-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-pink-500 text-xs font-bold uppercase tracking-wider mx-auto lg:mx-0 shadow-xs"
            >
              <Sparkles size={14} className="animate-pulse text-pink-400" />
              Saffa Bubur Bayi — MPASI Masa Kini
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-800 leading-tight tracking-tight"
            >
              MPASI Premium <br className="hidden sm:inline" />
              <span className="text-pink-500">
                untuk Ananda
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-500 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 italic"
            >
              "Dibuat setiap hari tanpa pengawet dan telah hadir melalui 11 outlet di Tanjungpinang dan Bintan."
            </motion.p>

            {/* Interactive Call-To-Actions */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
              id="hero-cta-buttons"
            >
              <button
                onClick={onOpenOrderModal}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-pink-200/50 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Pesan via WhatsApp
              </button>

              <button
                onClick={scrollToMenu}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border-2 border-pink-100 hover:border-pink-300 text-pink-500 font-bold text-sm tracking-wide shadow-xs transition-all hover:bg-pink-50/20 cursor-pointer flex items-center justify-center gap-2 group"
              >
                Lihat Menu Saffa
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Trust highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-semibold text-slate-400"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-400" />
                100% Sehat & Alami
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Tanpa Pengawet / MSG
              </div>
            </motion.div>
          </div>

          {/* Graphic / Image Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: 1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.2 }}
            className="lg:col-span-5 relative"
            id="hero-image-block"
          >
            {/* Circular frames behind the image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-100 to-emerald-50 rounded-[2.5rem] -rotate-3 scale-102 -z-10 border border-pink-50" />
            
            <div className="bg-white p-4 rounded-[2.5rem] shadow-xl border border-pink-50 relative overflow-hidden group">
              <img
                src="https://lh3.googleusercontent.com/d/1fZsmc7XAx2kQYECe7NcwzynqmZPCYLNc"
                alt="Saffa Bubur Bayi Premium"
                className="w-full h-[280px] sm:h-[350px] object-cover rounded-3xl group-hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />

              {/* Float Card on Image */}
              <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-white/60 shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 text-pink-500 rounded-xl flex items-center justify-center font-bold">
                  9.8
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800">Sangat Disukai Si Kecil</p>
                  <p className="text-[10px] text-slate-500 truncate">Sesuai standar nutrisi ananda MPASI harian</p>
                </div>
              </div>
            </div>

            {/* Cute absolute elements floating around */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center border border-pink-100 animate-soft-bounce">
              👶
            </div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center border border-pink-100 animate-soft-bounce" style={{ animationDelay: '1s' }}>
              🥑
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
