import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, MessageCircle, ZoomIn, ZoomOut, RotateCcw, Maximize2, X } from 'lucide-react';

interface HeroProps {
  onOpenOrderModal: () => void;
}

export default function Hero({ onOpenOrderModal }: HeroProps) {
  const [zoomScale, setZoomScale] = useState(1.0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxScale, setLightboxScale] = useState(1.0);

  const handleZoomIn = () => {
    setZoomScale(prev => Math.min(prev + 0.25, 3.0));
  };

  const handleZoomOut = () => {
    setZoomScale(prev => Math.max(prev - 0.25, 0.75));
  };

  const handleReset = () => {
    setZoomScale(1.0);
  };

  const handleLightboxZoomIn = () => {
    setLightboxScale(prev => Math.min(prev + 0.25, 4.0));
  };

  const handleLightboxZoomOut = () => {
    setLightboxScale(prev => Math.max(prev - 0.25, 0.75));
  };

  const handleLightboxReset = () => {
    setLightboxScale(1.0);
  };

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
              {/* Zoom Instruction Tip */}
              <div className="absolute top-6 left-6 bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-80 flex items-center gap-1.5">
                <span>🔍</span>
                <span>Cubit / Geser untuk Zoom</span>
              </div>

              {/* Image Frame with overflow hidden to crop zoomed images */}
              <div className="w-full h-auto max-h-[380px] sm:max-h-[480px] overflow-hidden rounded-3xl bg-pink-50/10 flex items-center justify-center relative select-none">
                <motion.img
                  src="https://lh3.googleusercontent.com/d/1fZsmc7XAx2kQYECe7NcwzynqmZPCYLNc"
                  alt="Saffa Bubur Bayi Premium"
                  referrerPolicy="no-referrer"
                  drag={zoomScale > 1}
                  dragConstraints={{
                    left: -200 * (zoomScale - 1),
                    right: 200 * (zoomScale - 1),
                    top: -200 * (zoomScale - 1),
                    bottom: 200 * (zoomScale - 1)
                  }}
                  animate={{ scale: zoomScale }}
                  className={`w-full h-auto max-h-[380px] sm:max-h-[480px] object-contain rounded-3xl select-none transition-transform duration-200 ${
                    zoomScale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
                  }`}
                />
              </div>

              {/* Floating Zoom Controls Centered on the Bottom */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/60 shadow-lg flex items-center gap-3 z-30 select-none">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoomScale <= 0.75}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-40 transition-colors cursor-pointer"
                  title="Perkecil (Zoom Out)"
                  id="btn-hero-zoom-out"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="text-xs font-mono font-bold text-slate-700 min-w-[36px] text-center">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoomScale >= 3.0}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-40 transition-colors cursor-pointer"
                  title="Perbesar (Zoom In)"
                  id="btn-hero-zoom-in"
                >
                  <ZoomIn size={16} />
                </button>
                <div className="w-[1px] h-4 bg-slate-200" />
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={zoomScale === 1.0}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-40 transition-colors cursor-pointer"
                  title="Atur Ulang"
                  id="btn-hero-zoom-reset"
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLightboxScale(1.0);
                    setShowLightbox(true);
                  }}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
                  title="Layar Penuh"
                  id="btn-hero-zoom-fullscreen"
                >
                  <Maximize2 size={15} />
                </button>
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

      {/* Dynamic Lightbox Modal */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 select-none"
            id="hero-image-lightbox"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowLightbox(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-all cursor-pointer border border-white/10 shadow-lg"
              title="Tutup"
              id="btn-lightbox-close"
            >
              <X size={20} />
            </button>

            {/* Instruction tooltip */}
            <div className="absolute top-6 left-6 text-xs text-white/60 font-medium">
              💡 Geser gambar untuk melihat detail
            </div>

            {/* Interactive Image Frame */}
            <div className="relative w-full max-w-4xl h-[70vh] flex items-center justify-center overflow-hidden rounded-3xl border border-white/5 bg-slate-900/30">
              <motion.img
                src="https://lh3.googleusercontent.com/d/1fZsmc7XAx2kQYECe7NcwzynqmZPCYLNc"
                alt="Saffa Bubur Bayi Premium Full"
                referrerPolicy="no-referrer"
                drag={lightboxScale > 1}
                dragConstraints={{
                  left: -300 * (lightboxScale - 1),
                  right: 300 * (lightboxScale - 1),
                  top: -300 * (lightboxScale - 1),
                  bottom: 300 * (lightboxScale - 1)
                }}
                animate={{ scale: lightboxScale }}
                className={`max-w-full max-h-full object-contain select-none transition-transform duration-200 ${
                  lightboxScale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
                }`}
              />
            </div>

            {/* Lightbox Controls */}
            <div className="mt-6 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-xl flex items-center gap-5">
              <button
                type="button"
                onClick={handleLightboxZoomOut}
                disabled={lightboxScale <= 0.75}
                className="p-2 rounded-lg text-white hover:bg-white/10 active:bg-white/20 disabled:opacity-40 transition-colors cursor-pointer"
                title="Perkecil (Zoom Out)"
                id="btn-lightbox-zoom-out"
              >
                <ZoomOut size={18} />
              </button>
              <span className="text-sm font-mono font-bold text-white min-w-[45px] text-center">
                {Math.round(lightboxScale * 100)}%
              </span>
              <button
                type="button"
                onClick={handleLightboxZoomIn}
                disabled={lightboxScale >= 4.0}
                className="p-2 rounded-lg text-white hover:bg-white/10 active:bg-white/20 disabled:opacity-40 transition-colors cursor-pointer"
                title="Perbesar (Zoom In)"
                id="btn-lightbox-zoom-in"
              >
                <ZoomIn size={18} />
              </button>
              <div className="w-[1px] h-5 bg-white/20" />
              <button
                type="button"
                onClick={handleLightboxReset}
                disabled={lightboxScale === 1.0}
                className="p-2 rounded-lg text-white hover:bg-white/10 active:bg-white/20 disabled:opacity-40 transition-colors cursor-pointer"
                title="Atur Ulang"
                id="btn-lightbox-zoom-reset"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
