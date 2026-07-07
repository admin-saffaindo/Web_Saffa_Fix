import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, ArrowUp, Sparkles } from 'lucide-react';

interface FloatingCTAProps {
  onOpenOrderModal: () => void;
}

export default function FloatingCTA({ onOpenOrderModal }: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none" id="floating-cta-layer">
      
      {/* Back to Top button */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={scrollToTop}
            className="p-3 rounded-full bg-white text-slate-600 border border-slate-100 hover:text-pink-500 hover:border-pink-100 shadow-lg active:scale-90 transition-all pointer-events-auto cursor-pointer flex items-center justify-center"
            title="Kembali ke Atas"
          >
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Pulsating WhatsApp Order Trigger Button */}
      <motion.button
        onClick={onOpenOrderModal}
        initial={{ scale: 0.9 }}
        animate={{ 
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2.2,
          ease: "easeInOut"
        }}
        className="relative p-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-200 pointer-events-auto active:scale-95 transition-colors cursor-pointer flex items-center justify-center group"
        title="Pesan Saffa via WhatsApp"
        id="floating-whatsapp-trigger"
      >
        <MessageCircle size={24} className="fill-white" />

        {/* Small badge count/alert */}
        <span className="absolute -top-1 -right-1 bg-pink-500 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded-full border border-white animate-bounce">
          Order
        </span>

        {/* Tooltip on Hover */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white font-bold text-[10px] tracking-wide uppercase px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none flex items-center gap-1">
          <Sparkles size={10} className="text-amber-400" />
          Pesan Cepat Saffa!
        </div>
      </motion.button>

    </div>
  );
}
