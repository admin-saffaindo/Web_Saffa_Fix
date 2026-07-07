import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Heart, Star, ChevronRight } from 'lucide-react';

interface SplashIntroProps {
  onComplete: () => void;
}

export default function SplashIntro({ onComplete }: SplashIntroProps) {
  const [secondsLeft, setSecondsLeft] = useState(3);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress bar animation simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 30); // 100 steps over ~3 seconds

    // Countdown timer
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Small delay before transition for smoother UX
          setTimeout(() => {
            onComplete();
          }, 300);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 bg-gradient-to-tr from-pink-50 via-white to-amber-50 z-[9999] flex flex-col items-center justify-between p-6 overflow-hidden select-none"
      id="saffa-splash-container"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row with Skip/X Button */}
      <div className="w-full max-w-lg flex justify-between items-center z-10 pt-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-pink-600 bg-pink-100/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-pink-200/40">
          <Sparkles size={12} className="animate-pulse" />
          <span>Saffa Premium Kid's Nutrition</span>
        </div>

        {/* Skip button with X icon */}
        <button
          type="button"
          onClick={onComplete}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-rose-600 active:scale-95 transition-all font-bold text-xs shadow-md border border-slate-800 cursor-pointer group"
          title="Lewati dan lihat dashboard"
          id="btn-splash-skip"
        >
          <span>Lewati</span>
          <X size={14} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Main Center Animated Logo Area */}
      <div className="flex flex-col items-center text-center justify-center flex-grow max-w-md z-10">
        {/* Pulsing/bouncing Logo container with radial glow */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-pink-400/20 rounded-full blur-2xl animate-ping scale-150 duration-1000" />
          <motion.div
            animate={{ 
              y: [0, -12, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 2.2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative"
          >
            <img
              src="https://lh3.googleusercontent.com/d/1CQA9uRMs3qCNkti_QpI3q-g22bzWLC8j"
              alt="Saffa Bubur Bayi Logo"
              className="w-28 h-28 md:w-36 md:h-36 object-contain rounded-full bg-white p-1.5 shadow-2xl border-4 border-pink-100"
              referrerPolicy="no-referrer"
            />
            {/* Cute floating badge */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white p-2 rounded-full shadow-lg border-2 border-white"
            >
              <Star size={14} className="fill-amber-100" />
            </motion.div>
          </motion.div>
        </div>

        {/* Title and Slogan */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-slate-800 tracking-tight leading-none">
            Saffa<span className="text-rose-500">.</span>
          </h1>
          <p className="text-xs uppercase tracking-widest font-black text-emerald-600 mt-1">
            BUBUR BAYI PREMIUM & SEHAT
          </p>
          <div className="h-0.5 w-12 bg-rose-300 mx-auto my-3 rounded-full" />
          <p className="text-sm font-medium text-slate-500 px-4">
            Nutrisi harian terbaik, higienis, dan lezat untuk tumbuh kembang optimal si Kecil
          </p>
        </motion.div>

        {/* Loading countdown & progress */}
        <div className="mt-10 w-full max-w-[280px] bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-pink-100/50 shadow-md">
          <div className="flex justify-between items-center mb-1.5 text-xs text-slate-500 font-bold">
            <span className="flex items-center gap-1">
              <Heart size={12} className="text-rose-500 fill-rose-500 animate-pulse" />
              Menyiapkan menu...
            </span>
            <span className="bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-full font-extrabold text-[11px]">
              {secondsLeft} Detik
            </span>
          </div>
          
          {/* Progress Bar Container */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/30">
            <motion.div 
              className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Footer Row with Cute Message */}
      <div className="w-full max-w-md text-center z-10 pb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={onComplete}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-600 active:scale-95 transition-all cursor-pointer"
        >
          <span>Klik tombol lewati di atas atau tunggu pengalihan otomatis</span>
          <ChevronRight size={14} className="text-slate-400 animate-bounce" />
        </motion.div>
      </div>
    </motion.div>
  );
}
