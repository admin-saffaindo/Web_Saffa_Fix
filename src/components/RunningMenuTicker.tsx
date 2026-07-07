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

  // Construct text for the scrolling ticker
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

  const tickerText = buildTickerText();
  // Duplicate the text multiple times to ensure seamless infinite looping on wider displays
  const repeatedText = `${tickerText} ${tickerText} ${tickerText} ${tickerText}`;

  return (
    <div 
      className="bg-gradient-to-r from-pink-500 to-rose-400 text-white py-2.5 overflow-hidden relative border-y border-pink-600/20 shadow-xs z-30 select-none"
      id="today-running-menu-ticker"
    >
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-pink-500 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-rose-400 to-transparent z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest bg-white/25 backdrop-blur-md px-3 py-1 rounded-full shrink-0 animate-pulse border border-white/20">
          <Sparkles size={11} className="text-amber-200 fill-amber-200" />
          <span>MENU HARI INI ({getDayNameDisplay()})</span>
        </div>
        
        <div className="overflow-hidden whitespace-nowrap ml-4 flex-1 relative flex items-center h-5">
          <div className="animate-marquee whitespace-nowrap flex items-center text-xs font-bold tracking-wide">
            {repeatedText}
          </div>
        </div>
      </div>
    </div>
  );
}
