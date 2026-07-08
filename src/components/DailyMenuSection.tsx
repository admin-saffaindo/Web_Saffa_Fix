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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load daily menus from sheets or localStorage on mount
  useEffect(() => {
    loadDailyMenus();
  }, []);

  const loadDailyMenus = async () => {
    setIsLoading(true);
    const savedLocal = localStorage.getItem('saffa_daily_menus_v2');
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
            localStorage.setItem('saffa_daily_menus_v2', JSON.stringify(data));
          }
        }
      } catch (err) {
        console.warn("Gagal fetch menu harian dari Sheets, menggunakan data lokal:", err);
      }
    }
    setIsLoading(false);
  };

  // Set up viewingDay: defaults to 'tomorrow' if after 12:00, otherwise 'today'
  const [viewingDay, setViewingDay] = useState<'today' | 'tomorrow'>(() => {
    const hour = new Date().getHours();
    return hour >= 12 ? 'tomorrow' : 'today';
  });

  const getTodayDate = (): Date => {
    return new Date();
  };

  const getTomorrowDate = (): Date => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  const getMenuTargetDate = (): Date => {
    return viewingDay === 'tomorrow' ? getTomorrowDate() : getTodayDate();
  };

  const formatIndonesianDate = (date: Date): string => {
    try {
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      };
      let dateStr = date.toLocaleDateString('id-ID', options);
      // Ensure 'Minggu' is replaced with 'Ahad' for Saffa client preference
      dateStr = dateStr.replace(/Minggu/i, 'Ahad');
      return dateStr;
    } catch (e) {
      const indonesianDays = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      return indonesianDays[date.getDay()];
    }
  };

  // Find currently selected day menu based on target date automatically
  const getActiveMenuForToday = (): DailyMenu => {
    if (menus.length === 0) return DEFAULT_DAILY_MENUS[0];
    const targetDate = getMenuTargetDate();
    const dayIndex = targetDate.getDay(); // 0 is Sunday, 1 is Monday...
    const saffaIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Sunday is index 6 (Ahad), Monday is 0 (Senin)...
    return menus[saffaIndex] || menus[0];
  };

  const activeMenu = getActiveMenuForToday();

  // Helper to get image from PRODUCTS data for small view
  const getProductImage = (productId: string) => {
    const prod = PRODUCTS.find(p => p.id === productId);
    return prod?.image || '';
  };

  // Helper to safely display Day Name (map Minggu to Ahad if needed, though already mapped in data)
  const getDayNameDisplay = (): string => {
    if (!activeMenu || !activeMenu.dayName) {
      const indonesianDays = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const targetDate = getMenuTargetDate();
      const dayIndex = targetDate.getDay();
      return indonesianDays[dayIndex];
    }
    return activeMenu.dayName === 'Minggu' ? 'Ahad' : activeMenu.dayName;
  };

  // Helper to get automatic Indonesia Day and Date today
  const getIndonesianDateToday = () => {
    return formatIndonesianDate(getMenuTargetDate());
  };

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
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100/50 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs">
            <Calendar size={12} />
            Menu Harian MPASI Saffa
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-800">
            Menu Sehat <span className="text-pink-500">Hari Ini</span>
          </h2>
          <div className="w-16 h-1 bg-emerald-400 mx-auto rounded-full animate-pulse" />
          <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-lg mx-auto">
            Saffa menyajikan variasi menu bernutrisi berbeda setiap hari untuk tumbuh kembang optimal si kecil. Berikut menu lezat yang siap Bunda dapatkan hari ini!
          </p>
        </div>

        {/* Menu Grid Cards for Selected Day */}
        <div className="mt-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 p-6 sm:p-10 shadow-xs" id="selected-day-menu-container">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 pb-6 border-b border-slate-200/60">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-display font-extrabold text-xl text-slate-800">
                  {viewingDay === 'tomorrow' ? 'Menu Hari Besok' : 'Menu Hari Ini'}
                </h3>
                <span className={`bg-gradient-to-r ${viewingDay === 'tomorrow' ? 'from-emerald-500 to-teal-500' : 'from-pink-500 to-rose-500'} text-white text-xs sm:text-sm px-3.5 py-1.5 rounded-full font-extrabold shadow-xs flex items-center gap-1.5 animate-pulse`}>
                  <span>{viewingDay === 'tomorrow' ? '🌙' : '📅'}</span>
                  <span>{getIndonesianDateToday()}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium">Siap dipesan untuk diambil langsung di outlet terdekat</p>
            </div>
            
            <div className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-100/40 flex items-center gap-1.5 shrink-0">
              <Sparkles size={13} className="animate-pulse" />
              Bahan MPASI Premium 100% Organik & Halal
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            
            {/* Column 1: Status Panel */}
            <div className="w-full lg:w-72 xl:w-80 shrink-0 bg-white border border-slate-100 rounded-[2rem] p-5 shadow-xs flex flex-col justify-between" id="schedule-status-panel">
              <div className="space-y-5">
                <div className="pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    Status Operasional
                  </div>
                  <h4 className="font-display font-black text-slate-800 text-lg mt-1">
                    Jadwal Menu Saffa
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed font-medium">
                    Sistem otomatis memperbarui tampilan menu pada pukul <span className="font-bold text-slate-700">12.00 WIB</span> siang setiap hari.
                  </p>
                </div>

                {/* Interactive Toggles */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">Pilih Tampilan Menu:</span>
                  
                  {/* Button Today */}
                  <button
                    type="button"
                    onClick={() => setViewingDay('today')}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                      viewingDay === 'today'
                        ? 'bg-pink-50 border-pink-200 shadow-xs ring-2 ring-pink-100'
                        : 'bg-slate-50/50 border-slate-200/50 hover:bg-slate-50'
                    }`}
                    id="btn-view-today"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl transition-colors ${
                        viewingDay === 'today' ? 'bg-pink-500 text-white' : 'bg-slate-200/60 text-slate-500'
                      }`}>
                        <span>☀️</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-800">Menu Hari Ini</span>
                          {new Date().getHours() < 12 && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Default Berjalan" />
                          )}
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                          {formatIndonesianDate(getTodayDate()).split(',')[1] || formatIndonesianDate(getTodayDate())}
                        </span>
                      </div>
                    </div>
                    {viewingDay === 'today' && (
                      <div className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold">
                        <Check size={11} strokeWidth={3} />
                      </div>
                    )}
                  </button>

                  {/* Button Tomorrow */}
                  <button
                    type="button"
                    onClick={() => setViewingDay('tomorrow')}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                      viewingDay === 'tomorrow'
                        ? 'bg-emerald-50 border-emerald-200 shadow-xs ring-2 ring-emerald-100'
                        : 'bg-slate-50/50 border-slate-200/50 hover:bg-slate-50'
                    }`}
                    id="btn-view-tomorrow"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl transition-colors ${
                        viewingDay === 'tomorrow' ? 'bg-emerald-500 text-white' : 'bg-slate-200/60 text-slate-500'
                      }`}>
                        <span>🌙</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-800">Menu Besok</span>
                          {new Date().getHours() >= 12 && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Default Berjalan" />
                          )}
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                          {formatIndonesianDate(getTomorrowDate()).split(',')[1] || formatIndonesianDate(getTomorrowDate())}
                        </span>
                      </div>
                    </div>
                    {viewingDay === 'tomorrow' && (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                        <Check size={11} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                </div>

                {/* Explanation Card */}
                <div className="bg-slate-50/70 rounded-2xl p-3.5 border border-slate-100 text-[10.5px] leading-relaxed text-slate-500 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <span>⏰</span>
                    <span>Sistem Auto-Switch 12.00</span>
                  </div>
                  <p>
                    {new Date().getHours() >= 12 ? (
                      <>
                        Sudah melewati pukul <span className="font-bold text-slate-700">12.00 WIB</span> siang. Karena operasional hari ini sudah tutup, menu default otomatis beralih ke <span className="font-bold text-emerald-600">Menu Hari Esok</span> agar Bunda dapat melakukan <span className="font-semibold text-slate-700">Pre-Order</span> lebih awal dengan tenang.
                      </>
                    ) : (
                      <>
                        Tampilan default saat ini adalah <span className="font-bold text-pink-600">Menu Hari Ini</span>. Apabila melewati pukul <span className="font-bold text-slate-700">12.00 WIB</span> siang, menu default otomatis berganti ke menu hari esok.
                      </>
                    )}
                  </p>
                  <p className="text-[10px] text-pink-500 font-bold italic pt-1 border-t border-slate-100 mt-1">
                    * Sangat disarankan pesan malam ini agar tidak kehabisan menu segar si kecil besok pagi!
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: Menu Grid */}
            <div className="flex-grow">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5" id="daily-menu-grid">
            
            {/* 1. Bubur Halus Menu 1 */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {getProductImage('bubur-halus-1') ? (
                    <img 
                      src={getProductImage('bubur-halus-1')} 
                      alt="Bubur Halus Menu 1" 
                      className="w-11 h-11 rounded-xl object-cover border border-pink-100 shadow-xs shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="p-3 bg-pink-50 text-pink-500 rounded-2xl w-11 h-11 flex items-center justify-center shrink-0">
                      <Soup size={18} />
                    </div>
                  )}
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Menu 1 (6+ Bln)</span>
                    <h4 className="font-display font-extrabold text-xs text-slate-800 mt-0.5 leading-tight">Bubur Halus Menu 1</h4>
                  </div>
                </div>
                <div className="bg-pink-50/30 p-3 rounded-2xl border border-pink-100/20">
                  <p className="text-slate-600 text-xs font-semibold leading-relaxed min-h-[50px] line-clamp-3">
                    {activeMenu?.menu1 || '-'}
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
                <div className="flex items-center gap-3">
                  {getProductImage('bubur-halus-2') ? (
                    <img 
                      src={getProductImage('bubur-halus-2')} 
                      alt="Bubur Halus Menu 2" 
                      className="w-11 h-11 rounded-xl object-cover border border-rose-100 shadow-xs shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl w-11 h-11 flex items-center justify-center shrink-0">
                      <Soup size={18} />
                    </div>
                  )}
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Menu 2 (6+ Bln)</span>
                    <h4 className="font-display font-extrabold text-xs text-slate-800 mt-0.5 leading-tight">Bubur Halus Menu 2</h4>
                  </div>
                </div>
                <div className="bg-rose-50/30 p-3 rounded-2xl border border-rose-100/20">
                  <p className="text-slate-600 text-xs font-semibold leading-relaxed min-h-[50px] line-clamp-3">
                    {activeMenu?.menu2 || '-'}
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
                <div className="flex items-center gap-3">
                  {getProductImage('nasi-tim') ? (
                    <img 
                      src={getProductImage('nasi-tim')} 
                      alt="Nasi Tim Saffa" 
                      className="w-11 h-11 rounded-xl object-cover border border-orange-100 shadow-xs shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl w-11 h-11 flex items-center justify-center shrink-0">
                      <Utensils size={18} />
                    </div>
                  )}
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Nasi Tim (9+ Bln)</span>
                    <h4 className="font-display font-extrabold text-xs text-slate-800 mt-0.5 leading-tight">Nasi Tim Saffa</h4>
                  </div>
                </div>
                <div className="bg-orange-50/30 p-3 rounded-2xl border border-orange-100/20">
                  <p className="text-slate-600 text-xs font-semibold leading-relaxed min-h-[50px] line-clamp-3">
                    {activeMenu?.nasiTim || '-'}
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

            {/* 4. Aneka Lauk MPASI */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {getProductImage('lauk-mpasi') ? (
                    <img 
                      src={getProductImage('lauk-mpasi')} 
                      alt="Aneka Lauk MPASI" 
                      className="w-11 h-11 rounded-xl object-cover border border-emerald-100 shadow-xs shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl w-11 h-11 flex items-center justify-center shrink-0">
                      <Fish size={18} />
                    </div>
                  )}
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Lauk Tambah (8+ Bln)</span>
                    <h4 className="font-display font-extrabold text-xs text-slate-800 mt-0.5 leading-tight">Aneka Lauk MPASI</h4>
                  </div>
                </div>
                <div className="bg-emerald-50/30 p-3 rounded-2xl border border-emerald-100/20">
                  <p className="text-slate-600 text-xs font-semibold leading-relaxed min-h-[50px] line-clamp-3">
                    {activeMenu?.anekaLauk || '-'}
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
                <div className="flex items-center gap-3">
                  {getProductImage('silky-pudding') ? (
                    <img 
                      src={getProductImage('silky-pudding')} 
                      alt="Silky Pudding" 
                      className="w-11 h-11 rounded-xl object-cover border border-amber-100 shadow-xs shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl w-11 h-11 flex items-center justify-center shrink-0">
                      <Dessert size={18} />
                    </div>
                  )}
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Camilan Puding (7+ Bln)</span>
                    <h4 className="font-display font-extrabold text-xs text-slate-800 mt-0.5 leading-tight">Silky Pudding</h4>
                  </div>
                </div>
                <div className="bg-amber-50/30 p-3 rounded-2xl border border-amber-100/20">
                  <p className="text-slate-600 text-xs font-semibold leading-relaxed min-h-[50px] line-clamp-3">
                    {activeMenu?.pudding || '-'}
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
        </div>

      </div>
    </section>
  );
}
