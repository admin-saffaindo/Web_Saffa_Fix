import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Soup, Sparkles, ShoppingBag, Info, ChevronRight, Utensils, Dessert, Fish, Check } from 'lucide-react';
import { DailyMenu, DEFAULT_DAILY_MENUS, PRODUCTS, Product } from '../data';
import { getAppsScriptUrl } from '../config';

interface DailyMenuSectionProps {
  onSelectProduct: (product: Product) => void;
}

export default function DailyMenuSection({ onSelectProduct }: DailyMenuSectionProps) {
  const [menus, setMenus] = useState<DailyMenu[]>([]);
  const [selectedDayId, setSelectedDayId] = useState<string>('day-1');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load daily menus from sheets or localStorage on mount
  useEffect(() => {
    loadDailyMenus();
  }, []);

  const loadDailyMenus = async () => {
    setIsLoading(true);
    const savedLocal = localStorage.getItem('saffa_daily_menus');
    let initialMenus = DEFAULT_DAILY_MENUS;
    
    if (savedLocal) {
      try {
        initialMenus = JSON.parse(savedLocal);
      } catch (e) {
        console.error("Gagal parse local daily menus:", e);
      }
    }
    
    setMenus(initialMenus);

    // Try to fetch from Google Sheets if URL is configured
    const targetUrl = getAppsScriptUrl();
    if (targetUrl && targetUrl.startsWith('http')) {
      try {
        const response = await fetch(`${targetUrl}${targetUrl.includes('?') ? '&' : '?'}action=getMenus`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setMenus(data);
            localStorage.setItem('saffa_daily_menus', JSON.stringify(data));
          }
        }
      } catch (err) {
        console.warn("Gagal fetch menu harian dari Sheets, menggunakan data lokal:", err);
      }
    }
    setIsLoading(false);
  };

  // Find currently selected day menu
  const activeMenu = menus.find(m => m.id === selectedDayId) || menus[0] || DEFAULT_DAILY_MENUS[0];

  // Helper to trigger ordering of a specific category product
  const handleOrderCategory = (productId: string) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) {
      onSelectProduct(product);
    }
  };

  return (
    <section id="jadwal-menu" className="py-16 sm:py-24 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-pink-100/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-50/40 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100/50 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
            <Calendar size={12} />
            Jadwal Menu Harian MPASI Saffa
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-800">
            Selalu Fresh <span className="text-pink-500">Beda Setiap Hari</span>
          </h2>
          <div className="w-16 h-1 bg-emerald-400 mx-auto rounded-full" />
          <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
            Saffa menyediakan variasi menu berbeda setiap harinya untuk mencegah si kecil bosan (GTM) dan memastikan pemenuhan gizi yang lengkap & bervariasi. Silakan geser atau klik hari untuk melihat jadwal menu siap saji.
          </p>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex overflow-x-auto pb-4 gap-2 scrollbar-none justify-start md:justify-center -mx-4 px-4 snap-x" id="daily-menu-tabs-scroll">
          {menus.map((day) => {
            const isActive = day.id === selectedDayId;
            return (
              <button
                key={day.id}
                onClick={() => setSelectedDayId(day.id)}
                type="button"
                className={`snap-center shrink-0 px-5 py-3.5 rounded-2xl flex flex-col items-center min-w-[90px] border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'border-pink-400 bg-gradient-to-br from-pink-500 to-rose-400 text-white shadow-md shadow-pink-100 scale-102 font-bold'
                    : 'border-slate-100 bg-slate-50 hover:bg-pink-50/30 text-slate-600 hover:border-pink-100'
                }`}
              >
                <span className="text-xs tracking-wider uppercase opacity-85">{day.dayName}</span>
                <span className="text-sm font-extrabold mt-0.5">{day.dateLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Menu Grid Cards for Selected Day */}
        <div className="mt-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 p-6 sm:p-10" id="selected-day-menu-container">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 pb-6 border-b border-slate-200/60">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-xl text-slate-800">
                  Menu Hari {activeMenu?.dayName || 'Senin'}
                </h3>
                <span className="bg-pink-100 text-pink-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {activeMenu?.dateLabel || '13 Juli'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium">Siap dipesan untuk diambil langsung di outlet terdekat</p>
            </div>
            
            <div className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-100/40 flex items-center gap-1.5 shrink-0">
              <Sparkles size={13} className="animate-pulse" />
              Bahan MPASI Premium 100% Organik & Halal
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" id="daily-menu-grid">
            
            {/* 1. Bubur Halus Menu 1 */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="p-3 bg-pink-50 text-pink-500 rounded-2xl w-11 h-11 flex items-center justify-center">
                  <Soup size={18} />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Menu 1 (6+ Bln)</span>
                  <h4 className="font-display font-extrabold text-xs text-slate-800 mt-0.5">Bubur Halus Menu 1</h4>
                </div>
                <div className="bg-pink-50/30 p-3 rounded-2xl border border-pink-100/20">
                  <p className="text-slate-600 text-xs font-semibold leading-relaxed min-h-[50px] line-clamp-3">
                    {activeMenu?.menu1 || 'Memuat...'}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-pink-500">Rp7.000</span>
                <button
                  onClick={() => handleOrderCategory('bubur-halus-1')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                >
                  <ShoppingBag size={11} />
                  Pesan
                </button>
              </div>
            </div>

            {/* 2. Bubur Halus Menu 2 */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl w-11 h-11 flex items-center justify-center">
                  <Soup size={18} />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Menu 2 (6+ Bln)</span>
                  <h4 className="font-display font-extrabold text-xs text-slate-800 mt-0.5">Bubur Halus Menu 2</h4>
                </div>
                <div className="bg-rose-50/30 p-3 rounded-2xl border border-rose-100/20">
                  <p className="text-slate-600 text-xs font-semibold leading-relaxed min-h-[50px] line-clamp-3">
                    {activeMenu?.menu2 || 'Memuat...'}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-pink-500">Rp7.000</span>
                <button
                  onClick={() => handleOrderCategory('bubur-halus-2')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                >
                  <ShoppingBag size={11} />
                  Pesan
                </button>
              </div>
            </div>

            {/* 3. Nasi Tim Saffa */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl w-11 h-11 flex items-center justify-center">
                  <Utensils size={18} />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Nasi Tim (9+ Bln)</span>
                  <h4 className="font-display font-extrabold text-xs text-slate-800 mt-0.5">Nasi Tim Saffa</h4>
                </div>
                <div className="bg-orange-50/30 p-3 rounded-2xl border border-orange-100/20">
                  <p className="text-slate-600 text-xs font-semibold leading-relaxed min-h-[50px] line-clamp-3">
                    {activeMenu?.nasiTim || 'Memuat...'}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-pink-500">Rp9.000</span>
                <button
                  onClick={() => handleOrderCategory('nasi-tim')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                >
                  <ShoppingBag size={11} />
                  Pesan
                </button>
              </div>
            </div>

            {/* 4. Aneka Lauk MPASI Tambahan */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl w-11 h-11 flex items-center justify-center">
                  <Fish size={18} />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Lauk Tambah (8+ Bln)</span>
                  <h4 className="font-display font-extrabold text-xs text-slate-800 mt-0.5">Aneka Lauk MPASI</h4>
                </div>
                <div className="bg-emerald-50/30 p-3 rounded-2xl border border-emerald-100/20">
                  <p className="text-slate-600 text-xs font-semibold leading-relaxed min-h-[50px] line-clamp-3">
                    {activeMenu?.anekaLauk || 'Memuat...'}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-pink-500">Rp12.000</span>
                <button
                  onClick={() => handleOrderCategory('lauk-mpasi')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                >
                  <ShoppingBag size={11} />
                  Pesan
                </button>
              </div>
            </div>

            {/* 5. Silky Pudding */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl w-11 h-11 flex items-center justify-center">
                  <Dessert size={18} />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Camilan Puding (7+ Bln)</span>
                  <h4 className="font-display font-extrabold text-xs text-slate-800 mt-0.5">Silky Pudding</h4>
                </div>
                <div className="bg-amber-50/30 p-3 rounded-2xl border border-amber-100/20">
                  <p className="text-slate-600 text-xs font-semibold leading-relaxed min-h-[50px] line-clamp-3">
                    {activeMenu?.pudding || 'Memuat...'}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-pink-500">Rp2.000</span>
                <button
                  onClick={() => handleOrderCategory('silky-pudding')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                >
                  <ShoppingBag size={11} />
                  Pesan
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
