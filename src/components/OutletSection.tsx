import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Search, Compass, MessageCircle, Clock } from 'lucide-react';
import { Outlet, OUTLETS } from '../data';
import OutletMap from './OutletMap';

interface OutletSectionProps {
  onSelectProductWithOutlet: (outlet: Outlet) => void;
}

export default function OutletSection({ onSelectProductWithOutlet }: OutletSectionProps) {
  const [selectedRegion, setSelectedRegion] = useState<'Semua' | 'Tanjungpinang' | 'Bintan'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOutlet, setActiveOutlet] = useState<Outlet | null>(null);

  // Filter logic
  const filteredOutlets = OUTLETS.filter(outlet => {
    const matchesRegion = selectedRegion === 'Semua' || outlet.region === selectedRegion;
    const matchesSearch = outlet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          outlet.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const handleCardClick = (outlet: Outlet) => {
    setActiveOutlet(outlet);
  };

  return (
    <section id="outlet" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100/50 px-3 py-1 rounded-full">
            Lokasi Cabang Resmi
          </span>
          <h2 className="font-display font-extrabold text-3xl text-slate-800">
            Temukan Outlet <span className="text-pink-500">Saffa Terdekat</span>
          </h2>
          <div className="w-16 h-1 bg-pink-400 mx-auto rounded-full" />
          <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
            Saffa Bubur Bayi tersebar luas di <span className="text-pink-500 font-bold">11 titik strategis</span> Tanjungpinang dan Bintan. Temukan cabang terdekat dari rumah Bunda!
          </p>
        </div>

        {/* Operating Hours Banner */}
        <div className="max-w-3xl mx-auto mb-10 bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex gap-3 items-center">
          <Clock className="text-amber-500 shrink-0" size={20} />
          <div className="text-xs text-amber-900 leading-relaxed font-medium">
            ⏰ <span className="font-bold">Jam Operasional Outlet:</span> Setiap hari pukul <span className="font-bold">06.00 - 09.00 WIB</span> (Sangat disarankan membeli lebih awal karena bubur segar kami cepat habis terjual!).
          </div>
        </div>

        {/* Search and Filters Controller */}
        <div className="max-w-4xl mx-auto mb-10 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-xs" id="outlet-filters-container">
          
          {/* Tabs for Region selection */}
          <div className="flex gap-1.5 p-1 bg-white border border-slate-100 rounded-xl w-full md:w-auto">
            {(['Semua', 'Tanjungpinang', 'Bintan'] as const).map((region) => (
              <button
                key={region}
                onClick={() => {
                  setSelectedRegion(region);
                  setActiveOutlet(null); // Reset active zoom
                }}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-xs tracking-wide transition-all cursor-pointer ${
                  selectedRegion === region
                    ? 'bg-pink-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-pink-500 hover:bg-pink-50/30'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Cari nama outlet/lokasi..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveOutlet(null); // Reset active zoom
              }}
              className="w-full bg-white border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl pl-4 pr-10 py-2.5 text-xs focus:outline-none focus:border-pink-400 transition-colors"
              id="outlet-search-input-section"
            />
            <Search className="absolute right-3.5 top-3 text-slate-400" size={16} />
          </div>

        </div>

        {/* Interactive Map and Cards Split Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start" id="outlets-map-split-container">
          
          {/* Left Column: Outlets Scrollable Grid */}
          <div className="w-full lg:w-3/5 order-2 lg:order-1 space-y-4">
            <div className="text-xs text-slate-400 font-bold mb-2 flex items-center gap-1.5">
              <span>Menampilkan {filteredOutlets.length} outlet terdaftar</span>
              {filteredOutlets.length > 0 && (
                <span className="text-[10px] text-pink-500 font-semibold bg-pink-50 px-2 py-0.5 rounded-full">
                  💡 Klik kartu untuk fokus di peta
                </span>
              )}
            </div>

            <div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:max-h-[550px] lg:overflow-y-auto pr-1" 
              id="outlets-cards-grid"
            >
              {filteredOutlets.length === 0 ? (
                <div className="col-span-full text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <MapPin size={32} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-bold text-slate-700">Outlet Tidak Ditemukan</p>
                  <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
                </div>
              ) : (
                filteredOutlets.map((outlet, i) => {
                  const isActive = activeOutlet?.id === outlet.id;
                  return (
                    <motion.div
                      key={outlet.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: '-20px' }}
                      transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.4) }}
                      onClick={() => handleCardClick(outlet)}
                      className={`bg-white rounded-2xl border p-5 shadow-xs transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer select-none ${
                        isActive 
                          ? 'border-pink-500 ring-2 ring-pink-500/25 shadow-md bg-pink-50/10' 
                          : 'border-pink-100/45 hover:shadow-md hover:border-pink-300'
                      }`}
                    >
                      {/* Outlet Header */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                            outlet.region === 'Tanjungpinang' 
                              ? 'bg-pink-50 text-pink-500' 
                              : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {outlet.region}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {isActive ? 'Terfokus' : 'Aktif'}
                          </span>
                        </div>
                        
                        <h3 className="font-display font-bold text-sm text-slate-800 leading-snug">
                          {outlet.name}
                        </h3>
                        <p className="text-slate-400 text-[10px] font-medium leading-normal flex items-start gap-1">
                          <MapPin size={12} className="text-pink-400 shrink-0 mt-0.5" />
                          Tanjungpinang & Bintan, Kepulauan Riau
                        </p>
                      </div>

                      {/* Info and Buttons */}
                      <div className="pt-3 border-t border-slate-50 space-y-3">
                        {/* Actions Row */}
                        <div className="grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
                          {/* Google Maps Button */}
                          <a
                            href={outlet.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-50 hover:bg-pink-50 text-slate-600 hover:text-pink-500 border border-slate-100 hover:border-pink-100 font-bold text-[10px] transition-colors text-center"
                            id={`maps-btn-${outlet.id}`}
                          >
                            <Compass size={12} />
                            Petunjuk Arah
                          </a>

                          {/* Order Button */}
                          <button
                            onClick={() => onSelectProductWithOutlet(outlet)}
                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] shadow-sm shadow-emerald-50 transition-colors text-center cursor-pointer"
                            id={`order-outlet-btn-${outlet.id}`}
                          >
                            <MessageCircle size={12} />
                            Hubungi WA
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Google Map */}
          <div className="w-full lg:w-2/5 order-1 lg:order-2 h-[400px] sm:h-[450px] lg:h-[550px] lg:sticky lg:top-24">
            <OutletMap
              outlets={filteredOutlets}
              activeOutlet={activeOutlet}
              onSelectOutlet={(outlet) => setActiveOutlet(outlet)}
              onSelectProductWithOutlet={onSelectProductWithOutlet}
            />
          </div>

        </div>

      </div>
    </section>
  );
}
