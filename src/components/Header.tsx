import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, MessageCircle } from 'lucide-react';
import Logo from './Logo';

interface HeaderProps {
  onOpenOrderModal: () => void;
  onOpenAdmin: () => void;
}

export default function Header({ onOpenOrderModal, onOpenAdmin }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of fixed header
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
    <header
      className={`fixed top-4 left-4 right-4 z-40 transition-all duration-300 rounded-3xl border ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-pink-200/60 py-3'
          : 'bg-white/90 backdrop-blur-md border-pink-100 py-4 shadow-sm'
      }`}
      id="main-app-header"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div onClick={() => scrollToSection('home')} className="cursor-pointer">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium" id="desktop-nav-menu">
          <button
            onClick={() => scrollToSection('home')}
            className="text-slate-600 hover:text-pink-600 font-bold transition-colors cursor-pointer"
          >
            Beranda
          </button>
          <button
            onClick={() => scrollToSection('jadwal-menu')}
            className="text-slate-600 hover:text-pink-600 font-bold transition-colors cursor-pointer"
          >
            Jadwal Harian
          </button>
          <button
            onClick={() => scrollToSection('menu')}
            className="text-slate-600 hover:text-pink-600 font-bold transition-colors cursor-pointer"
          >
            Daftar Produk
          </button>
          <button
            onClick={() => scrollToSection('outlet')}
            className="text-slate-600 hover:text-pink-600 font-bold transition-colors cursor-pointer"
          >
            11 Outlet Kami
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="text-slate-600 hover:text-pink-600 font-bold transition-colors cursor-pointer"
          >
            Tentang Kami
          </button>
          <button
            onClick={onOpenAdmin}
            className="text-pink-500 hover:text-pink-600 font-bold transition-colors cursor-pointer"
          >
            Panel Admin
          </button>
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenOrderModal}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            id="header-order-now-btn"
          >
            PESAN SEKARANG
          </button>
        </div>

        {/* Mobile Buttons */}
        <div className="flex md:hidden items-center gap-2">
          {/* Direct order bag icon for rapid checkout on mobile */}
          <button
            onClick={onOpenOrderModal}
            className="p-2.5 bg-pink-500 text-white rounded-full shadow-sm active:scale-90 transition-all cursor-pointer"
            aria-label="Keranjang Pemesanan"
          >
            <ShoppingCart size={18} />
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 text-slate-700 hover:bg-pink-50 rounded-full transition-colors cursor-pointer"
            id="mobile-menu-toggle"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-pink-100 shadow-xl py-4 px-6 flex flex-col gap-4 mt-2 rounded-2xl animate-in fade-in slide-in-from-top-5 duration-200"
          id="mobile-nav-drawer"
        >
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              scrollToSection('home');
            }}
            className="text-left py-2.5 text-slate-700 font-bold border-b border-pink-50 hover:text-pink-500 text-sm"
          >
            Beranda
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              scrollToSection('jadwal-menu');
            }}
            className="text-left py-2.5 text-slate-700 font-bold border-b border-pink-50 hover:text-pink-500 text-sm"
          >
            Jadwal Harian
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              scrollToSection('menu');
            }}
            className="text-left py-2.5 text-slate-700 font-bold border-b border-pink-50 hover:text-pink-500 text-sm"
          >
            Daftar Produk
          </button>
          <button
            onClick={() => scrollToSection('outlet')}
            className="text-left py-2.5 text-slate-700 font-bold border-b border-pink-50 hover:text-pink-500 text-sm"
          >
            11 Outlet Kami
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="text-left py-2.5 text-slate-700 font-bold border-b border-pink-50 hover:text-pink-500 text-sm"
          >
            Tentang Saffa
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenAdmin();
            }}
            className="text-left py-2.5 text-pink-500 font-bold border-b border-pink-50 hover:text-pink-600 text-sm"
          >
            Panel Admin
          </button>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenOrderModal();
            }}
            className="w-full bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-center shadow-lg flex items-center justify-center gap-2 mt-2"
          >
            <MessageCircle size={18} />
            Pesan Sekarang (WhatsApp)
          </button>
        </div>
      )}
    </header>
  );
}
