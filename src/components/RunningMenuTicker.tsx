import React, { useState, useEffect } from 'react';
import { Soup, Utensils, Dessert, Fish, Sparkles } from 'lucide-react';
import { DailyMenu, DEFAULT_DAILY_MENUS } from '../data';
import { getAppsScriptUrl } from '../config';

export default function RunningMenuTicker() {
  const [todayMenu, setTodayMenu] = useState<DailyMenu | null>(null);

  useEffect(() => {
    const fetchTodayMenu = async () => {
      // 1. Get from localStorage
      const savedLocal = localStorage.getItem('saffa_daily_menus_v2');
      let currentMenus = DEFAULT_DAILY_MENUS;

      if (savedLocal) {
        try {
          currentMenus = JSON.parse(savedLocal);
        } catch (e) {
          console.error('Gagal parse local daily menus:', e);
        }
      }

      // Try to fetch newest from sheets if configured
      const targetUrl = getAppsScriptUrl();
      if (targetUrl && targetUrl.startsWith('http')) {
        try {
          const response = await fetch(`${targetUrl}${targetUrl.includes('?') ? '&' : '?'}action=getMenus`);
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
              currentMenus = data;
            }
          }
        } catch (err) {
          console.warn('Gagal fetch menu harian dari Sheets, menggunakan data lokal:', err);
        }
      }

      // 2. Identify Today's Menu
      // Date.getDay() returns 0 for Sunday (Ahad), 1 for Monday (Senin), ..., 6 for Saturday (Sabtu)
      const dayIndex = new Date().getDay();
      const saffaIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Map Sunday (0) to Saffa's index 6 (Ahad)
      
      const foundToday = currentMenus[saffaIndex] || currentMenus[0];
      setTodayMenu(foundToday);
    };

    fetchTodayMenu();

    // Refresh every 10 minutes to stay correct
    const interval = setInterval(fetchTodayMenu, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!todayMenu) return null;

  // Check if any food text is entered
  const hasMenuContent = !!(
    todayMenu.menu1 ||
    todayMenu.menu2 ||
    todayMenu.nasiTim ||
    todayMenu.anekaLauk ||
    todayMenu.pudding
  );

  const getDayNameDisplay = () => {
    return todayMenu.dayName === 'Minggu' ? 'Ahad' : todayMenu.dayName;
  };

  // Construct text for the scrolling ticker (Desktop)
  const buildTickerText = () => {
    if (!hasMenuContent) {
      return `✨ MENU HARI ${getDayNameDisplay().toUpperCase()} ${todayMenu.dateLabel ? `(${todayMenu.dateLabel})` : ''}: Menu hari ini sedang disiapkan, Bunda! Hubungi outlet terdekat untuk info menu custom lezat hari ini. Saffa MPASI selalu segar setiap hari! 👶🍼 • `;
    }

    const items = [];
    if (todayMenu.menu1) items.push(`🥣 Bubur 1: ${todayMenu.menu1}`);
    if (todayMenu.menu2) items.push(`🥣 Bubur 2: ${todayMenu.menu2}`);
    if (todayMenu.nasiTim) items.push(`🍲 Nasi Tim: ${todayMenu.nasiTim}`);
    if (todayMenu.anekaLauk) items.push(`🐟 Lauk: ${todayMenu.anekaLauk}`);
    if (todayMenu.pudding) items.push(`🍮 Puding: ${todayMenu.pudding}`);

    return `🔥 MENU TERSEDIA HARI ${getDayNameDisplay().toUpperCase()} ${todayMenu.dateLabel ? `(${todayMenu.dateLabel})` : ''}:  ${items.join('  •  ')}  •  🏡 Dapatkan langsung di 11 outlet Saffa terdekat Tanjungpinang & Bintan! 🏡 • `;
  };

  // Construct split-text for Mobile (Row 1: Bubur & Nasi Tim)
  const buildMobileRow1Text = () => {
    const dayLabel = todayMenu.dateLabel ? `(${todayMenu.dateLabel})` : '';
    if (!hasMenuContent) {
      return `✨ MENU HARI ${getDayNameDisplay().toUpperCase()} ${dayLabel}: Menu sedang disiapkan Bunda! 👶🍼 • `;
    }
    const items = [];
    if (todayMenu.menu1) items.push(`🥣 Bubur 1: ${todayMenu.menu1}`);
    if (todayMenu.menu2) items.push(`🥣 Bubur 2: ${todayMenu.menu2}`);
    if (todayMenu.nasiTim) items.push(`🍲 Nasi Tim: ${todayMenu.nasiTim}`);
    
    return `✨ MENU ${getDayNameDisplay().toUpperCase()} ${dayLabel} ➡️ ${items.join('  •  ')}  •  `;
  };

  // Construct split-text for Mobile (Row 2: Lauk, Pudding, Outlets)
  const buildMobileRow2Text = () => {
    if (!hasMenuContent) {
      return `🏡 Hubungi outlet Saffa terdekat untuk info custom menu lezat hari ini! 💕 • `;
    }
    const items = [];
    if (todayMenu.anekaLauk) items.push(`🐟 Lauk: ${todayMenu.anekaLauk}`);
    if (todayMenu.pudding) items.push(`🍮 Puding: ${todayMenu.pudding}`);
    items.push(`🏡 Dapatkan di 11 outlet Saffa terdekat Tanjungpinang & Bintan! 🏡`);
    
    return `🔥 PELENGKAP & OUTLET ➡️ ${items.join('  •  ')}  •  `;
  };

  const tickerText = buildTickerText();
  const repeatedText = `${tickerText} ${tickerText} ${tickerText} ${tickerText}`;

  const row1Text = buildMobileRow1Text();
  const repeatedRow1 = `${row1Text} ${row1Text} ${row1Text} ${row1Text}`;

  const row2Text = buildMobileRow2Text();
  const repeatedRow2 = `${row2Text} ${row2Text} ${row2Text} ${row2Text}`;

  return (
    <>
      {/* 1. Desktop version (visible on md: and up) */}
      <div 
        className="hidden md:block bg-gradient-to-r from-pink-500 to-rose-400 text-white py-2 overflow-hidden relative border-y border-pink-600/20 shadow-xs z-30 select-none"
        id="today-running-menu-ticker-desktop"
      >
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-pink-500 via-pink-500/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-rose-400 via-rose-400/80 to-transparent z-20 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Stacked "Bertingkat" Label for Desktop */}
          <div className="flex flex-col justify-center items-center text-center bg-white/20 backdrop-blur-md py-1 px-3.5 rounded-xl shrink-0 border border-white/20 z-30 shadow-xs leading-none animate-pulse select-none min-w-[110px]">
            <span className="text-[9px] font-black tracking-widest text-amber-200">MENU</span>
            <span className="text-[11px] font-black tracking-wide text-white mt-0.5">{getDayNameDisplay().toUpperCase()}</span>
          </div>
          
          {/* Running Text */}
          <div className="overflow-hidden whitespace-nowrap ml-6 flex-1 relative flex items-center h-6 z-10">
            <div className="animate-marquee whitespace-nowrap flex items-center text-xs font-bold tracking-wide">
              {repeatedText}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Mobile version (visible below md) - Larger font and 2 rows */}
      <div 
        className="block md:hidden bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white py-3 overflow-hidden relative border-b border-pink-600/30 shadow-md z-30 select-none"
        id="today-running-menu-ticker-mobile"
      >
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-pink-500 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-pink-600 to-transparent z-10 pointer-events-none" />
        
        <div className="flex flex-col gap-2.5">
          {/* Row 1: Bubur & Nasi Tim */}
          <div className="flex items-center px-4 gap-3">
            <div className="flex flex-col justify-center items-center text-center bg-white/25 backdrop-blur-md px-2.5 py-1 rounded-lg shrink-0 border border-white/15 shadow-xs leading-none min-w-[70px]">
              <span className="text-[8px] font-black tracking-widest text-amber-200">MENU</span>
              <span className="text-[10px] font-black tracking-wider text-white mt-0.5">{getDayNameDisplay().toUpperCase()}</span>
            </div>
            <div className="overflow-hidden whitespace-nowrap flex-1 relative flex items-center h-6">
              <div className="animate-marquee whitespace-nowrap flex items-center text-sm font-black tracking-wide">
                {repeatedRow1}
              </div>
            </div>
          </div>

          {/* Dotted separator for professional touch */}
          <div className="border-t border-dashed border-white/15 mx-4" />

          {/* Row 2: Lauk, Pudding & Outlets */}
          <div className="flex items-center px-4 gap-3">
            <div className="flex flex-col justify-center items-center text-center bg-pink-700/40 px-2.5 py-1 rounded-lg shrink-0 border border-pink-400/20 shadow-xs leading-none min-w-[70px]">
              <span className="text-[8px] font-black tracking-widest text-rose-200">PELENGKAP</span>
              <span className="text-[10px] font-black tracking-wider text-white mt-0.5">LAUK/PUDING</span>
            </div>
            <div className="overflow-hidden whitespace-nowrap flex-1 relative flex items-center h-6">
              <div className="animate-marquee whitespace-nowrap flex items-center text-sm font-extrabold tracking-wide text-rose-100">
                {repeatedRow2}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
