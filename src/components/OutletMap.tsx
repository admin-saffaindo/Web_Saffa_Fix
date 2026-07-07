import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { Compass, MessageCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { Outlet } from '../data';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface OutletMapProps {
  outlets: Outlet[];
  activeOutlet: Outlet | null;
  onSelectOutlet: (outlet: Outlet) => void;
  onSelectProductWithOutlet: (outlet: Outlet) => void;
}

// Subcomponent to control map centering and zooming dynamically
function MapController({ activeOutlet, outlets }: { activeOutlet: Outlet | null; outlets: Outlet[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (activeOutlet) {
      // Pan to the selected outlet with zoom
      map.panTo({ lat: activeOutlet.latitude, lng: activeOutlet.longitude });
      map.setZoom(15);
    } else if (outlets.length > 0) {
      // Fit all markers in bounds or default center
      const bounds = new google.maps.LatLngBounds();
      outlets.forEach((o) => bounds.extend({ lat: o.latitude, lng: o.longitude }));
      
      // If single item, center it, else fit bounds
      if (outlets.length === 1) {
        map.setCenter({ lat: outlets[0].latitude, lng: outlets[0].longitude });
        map.setZoom(14);
      } else {
        map.fitBounds(bounds);
        // Prevent too close of a zoom
        const listener = google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
          if ((map.getZoom() || 12) > 14) map.setZoom(13);
        });
        setTimeout(() => google.maps.event.removeListener(listener), 1000);
      }
    }
  }, [map, activeOutlet, outlets]);

  return null;
}

export default function OutletMap({ outlets, activeOutlet, onSelectOutlet, onSelectProductWithOutlet }: OutletMapProps) {
  const [selectedMarkerOutlet, setSelectedMarkerOutlet] = useState<Outlet | null>(null);

  // Sync state if activeOutlet is changed from the parent list
  useEffect(() => {
    if (activeOutlet) {
      setSelectedMarkerOutlet(activeOutlet);
    }
  }, [activeOutlet]);

  // Center of Tanjungpinang (KM 8 area)
  const defaultCenter = { lat: 0.9167, lng: 104.4500 };

  if (!hasValidKey) {
    const mapOutlet = selectedMarkerOutlet || activeOutlet || outlets[0];
    
    // Create query for Google Maps free embed iframe
    const mapSearchQuery = mapOutlet 
      ? `${mapOutlet.name} Tanjungpinang Bintan`
      : "Saffa Bubur Bayi Tanjungpinang";
    
    const iframeSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapSearchQuery)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

    return (
      <div className="w-full h-[400px] sm:h-[500px] lg:h-full rounded-3xl overflow-hidden border border-pink-100 shadow-md flex flex-col bg-white" id="free-maps-embed-container">
        {/* Quick Map Bar Header with selected outlet name */}
        <div className="bg-slate-50 p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="min-w-0">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full inline-block mb-1">
              {mapOutlet?.region || "Peta Saffa"}
            </span>
            <h4 className="font-display font-bold text-slate-800 truncate text-xs sm:text-sm">{mapOutlet?.name || "Pilih Cabang di Samping"}</h4>
            <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">📍 Tanjungpinang & Bintan • Klik cabang di samping untuk update lokasi</p>
          </div>
          {mapOutlet && (
            <div className="flex gap-2 shrink-0">
              <a
                href={mapOutlet.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-bold text-[10px] tracking-wide transition-all"
              >
                <Compass size={11} />
                Buka di Maps App
              </a>
              <a
                href={`https://wa.me/${mapOutlet.whatsapp}?text=Halo%20Saffa%20Bubur%20Bayi%20${encodeURIComponent(mapOutlet.name)},%20apakah%20menu%20MPASI%20hangat%20pagi%20ini%20masih%20tersedia?`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] tracking-wide transition-all"
              >
                <MessageCircle size={11} />
                WhatsApp Outlet
              </a>
            </div>
          )}
        </div>
        
        {/* Interactive Free Google Maps Iframe */}
        <div className="flex-1 w-full relative min-h-[250px]">
          <iframe
            title={`Peta Lokasi Saffa - ${mapOutlet?.name || 'Cabang'}`}
            src={iframeSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        </div>

        {/* Small footer explaining it's 100% free */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" />
          Peta Outlet Aktif & Bebas Biaya (Google Maps Embed API)
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] sm:h-[500px] md:h-full rounded-3xl overflow-hidden border border-pink-100 shadow-md relative" id="interactive-google-map-container">
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={12}
          mapId="Saffa_Outlets_Map"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
          gestureHandling="cooperative"
          disableDefaultUI={false}
        >
          {outlets.map((outlet) => {
            const isSelected = selectedMarkerOutlet?.id === outlet.id;
            return (
              <AdvancedMarker
                key={outlet.id}
                position={{ lat: outlet.latitude, lng: outlet.longitude }}
                onClick={() => {
                  setSelectedMarkerOutlet(outlet);
                  onSelectOutlet(outlet);
                }}
              >
                <Pin
                  background={isSelected ? '#EC4899' : '#10B981'} // pink-500 if selected, emerald-500 otherwise
                  borderColor={isSelected ? '#DB2777' : '#059669'}
                  glyphColor="#FFFFFF"
                />
              </AdvancedMarker>
            );
          })}

          {selectedMarkerOutlet && (
            <InfoWindow
              position={{ lat: selectedMarkerOutlet.latitude, lng: selectedMarkerOutlet.longitude }}
              onCloseClick={() => setSelectedMarkerOutlet(null)}
            >
              <div className="p-1 max-w-[200px] sm:max-w-[220px] font-sans text-slate-800">
                <span className={`text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  selectedMarkerOutlet.region === 'Tanjungpinang' 
                    ? 'bg-pink-100 text-pink-600' 
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {selectedMarkerOutlet.region}
                </span>
                
                <h4 className="font-display font-bold text-xs mt-2 text-slate-900 leading-snug">
                  {selectedMarkerOutlet.name}
                </h4>
                
                <p className="text-[10px] text-slate-400 mt-1">
                  Hubungi outlet langsung untuk mengecek stok MPASI hangat pagi ini.
                </p>

                <div className="mt-3 flex flex-col gap-1.5">
                  {/* Google Maps Navigasi */}
                  <a
                    href={selectedMarkerOutlet.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-[9px] transition-colors text-center"
                  >
                    <Compass size={10} />
                    Petunjuk Arah Maps
                  </a>

                  {/* Direct WhatsApp chat to outlet */}
                  <a
                    href={`https://wa.me/${selectedMarkerOutlet.whatsapp}?text=Halo%20Saffa%20Bubur%20Bayi%20${encodeURIComponent(selectedMarkerOutlet.name)},%20apakah%20menu%20MPASI%20hangat%20pagi%20ini%20masih%20tersedia?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[9px] transition-colors text-center"
                  >
                    <MessageCircle size={10} />
                    Chat WA Outlet
                  </a>
                  
                  {/* Quick Order Form Trigger */}
                  <button
                    onClick={() => onSelectProductWithOutlet(selectedMarkerOutlet)}
                    className="flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-pink-500 hover:border-pink-200 font-bold text-[8px] transition-colors text-center cursor-pointer"
                  >
                    Formulir Pemesanan Saffa
                  </button>
                </div>
              </div>
            </InfoWindow>
          )}

          <MapController activeOutlet={activeOutlet} outlets={outlets} />
        </Map>
      </APIProvider>
    </div>
  );
}
