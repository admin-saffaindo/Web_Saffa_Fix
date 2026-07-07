import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, MapPin, MessageSquare, AlertCircle, Sparkles, User as UserIcon } from 'lucide-react';
import { Product, Outlet, PRODUCTS, OUTLETS } from '../data';
import { getAppsScriptUrl } from '../config';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct: Product | null;
  initialOutlet: Outlet | null;
}

export default function OrderModal({ isOpen, onClose, initialProduct, initialOutlet }: OrderModalProps) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [selectedCity, setSelectedCity] = useState<'Tanjungpinang' | 'Bintan' | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [searchOutletQuery, setSearchOutletQuery] = useState<string>('');

  // Customer identity and submission state
  const [customerName, setCustomerName] = useState<string>('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Set initial state when modal opens
  useEffect(() => {
    if (isOpen) {
      const initialCart: Record<string, number> = {};
      if (initialProduct) {
        initialCart[initialProduct.id] = 1;
      } else if (PRODUCTS.length > 0) {
        initialCart[PRODUCTS[0].id] = 1;
      }
      setCart(initialCart);
      setNotes('');
      setCustomerName('');
      setCustomerWhatsapp('');

      // Pre-select outlet and city if initialOutlet is provided
      if (initialOutlet) {
        setSelectedOutlet(initialOutlet);
        if (initialOutlet.region === 'Tanjungpinang' || initialOutlet.region === 'Bintan') {
          setSelectedCity(initialOutlet.region as 'Tanjungpinang' | 'Bintan');
        }
      } else {
        setSelectedOutlet(null);
        setSelectedCity(null);
      }
    }
  }, [initialProduct, initialOutlet, isOpen]);

  if (!isOpen) return null;

  const selectedItems = PRODUCTS.map(product => ({
    product,
    quantity: cart[product.id] || 0
  })).filter(item => item.quantity > 0);

  const totalPrice = selectedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalQty = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  // Filter outlets based on selected city and search query
  const filteredOutlets = OUTLETS.filter(outlet => {
    const matchesCity = selectedCity ? outlet.region.toLowerCase() === selectedCity.toLowerCase() : false;
    const matchesSearch = outlet.name.toLowerCase().includes(searchOutletQuery.toLowerCase()) ||
                          outlet.region.toLowerCase().includes(searchOutletQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOutlet || selectedItems.length === 0 || !customerName.trim() || !customerWhatsapp.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const createdAtStr = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    const orderId = 'SF-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const productSummary = selectedItems.map(item => `${item.product.name} (${item.quantity} ${item.product.unit})`).join(', ');
    const quantitySummary = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

    const orderData = {
      id: orderId,
      customerName: customerName.trim(),
      customerWhatsapp: '0' + customerWhatsapp.trim(),
      productId: selectedItems.map(i => i.product.id).join(', '),
      productName: productSummary,
      quantity: quantitySummary,
      totalPrice: totalPrice,
      outletId: selectedOutlet.id,
      outletName: selectedOutlet.name,
      notes: notes.trim(),
      status: 'pending',
      createdAt: createdAtStr
    };

    try {
      // 1. Save to local storage of the browser as immediate local backup
      const localOrders = JSON.parse(localStorage.getItem('saffa_local_orders') || '[]');
      localOrders.push(orderData);
      localStorage.setItem('saffa_local_orders', JSON.stringify(localOrders));

      // 2. Post to Google Apps Script if URL is configured
      const url = getAppsScriptUrl();
      if (url) {
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: JSON.stringify(orderData)
        });
      }
    } catch (error) {
      console.error("Gagal mengirim data pesanan ke Google Sheets:", error);
    } finally {
      setIsSubmitting(false);
    }

    // Format WhatsApp Message
    const formattedPrice = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(totalPrice);

    const itemDetailsText = selectedItems.map((item, index) => {
      const itemSubtotal = item.product.price * item.quantity;
      const formattedSubtotal = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
      }).format(itemSubtotal);
      
      return `${index + 1}. *${item.product.name}* (${item.product.recommendedAge})
   └  Jumlah: *${item.quantity} ${item.product.unit}*
   └  Subtotal: *${formattedSubtotal}*`;
    }).join('\n\n');

    const message = `Halo Saffa Bubur Bayi (${selectedOutlet.name})! 👋

Saya ingin memesan MPASI Premium Saffa untuk buah hati saya:

*Data Diri Pelanggan:*
👤 Nama: *${customerName.trim()}*
📞 WhatsApp: *0${customerWhatsapp.trim()}*

*Rincian Pesanan:*
${itemDetailsText}

*Total Pembayaran:* *${formattedPrice}*

${notes ? `*Catatan Tambahan:* \n_"${notes}"_` : '*Catatan Tambahan:* \n_Tidak ada catatan tambahan_'}

Mohon konfirmasi pesanan dan ketersediaan stoknya ya kak. Terima kasih! 😊`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${selectedOutlet.whatsapp}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden" id="order-modal-backdrop-layer">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          id="modal-overlay"
        />

        {/* Modal Sheet container */}
        <motion.div
          initial={{ y: '100%', opacity: 0.9 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col z-10 overflow-hidden"
          id="order-modal-sheet"
        >
          {/* Header indicator for mobile drag-style look */}
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-3 sm:hidden" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4 pt-2 sm:pt-6 border-b border-pink-50" id="modal-header">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-pink-50 text-pink-500 rounded-full">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-800">Form Pemesanan</h3>
                <p className="text-xs text-pink-500 font-medium">MPASI Premium Saffa</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-pink-500 rounded-full hover:bg-pink-50 transition-colors"
              id="close-modal-button"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Content (Scrollable) */}
          <form onSubmit={handleOrderSubmit} className="flex-1 overflow-y-auto p-6 space-y-5" id="order-form">
            {/* Step 1: Data Diri Pelanggan */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Lengkapi Data Diri Anda
              </label>
              <div className="space-y-2">
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400">
                    <UserIcon size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap Ibu / Ayah..."
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-pink-400 transition-colors"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400 text-xs font-bold">
                    +62
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="Nomor WhatsApp (contoh: 812345678)..."
                    value={customerWhatsapp}
                    onChange={(e) => {
                      // Normalize number input
                      const val = e.target.value.replace(/\D/g, '');
                      setCustomerWhatsapp(val);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl pl-12 pr-4 py-2.5 text-xs focus:outline-none focus:border-pink-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Product Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                2. Pilih Menu MPASI Saffa
              </label>
              <div className="grid grid-cols-2 gap-2" id="modal-product-selector-grid">
                {PRODUCTS.map((p) => {
                  const qty = cart[p.id] || 0;
                  const isSelected = qty > 0;
                  const isLastItem = p.id === 'silky-pudding';
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setCart(prev => ({
                          ...prev,
                          [p.id]: (prev[p.id] || 0) + 1
                        }));
                      }}
                      className={`relative p-2.5 rounded-xl border transition-all text-left cursor-pointer flex flex-col justify-between h-[84px] select-none ${
                        isSelected
                          ? 'border-pink-500 bg-pink-50/20 ring-2 ring-pink-500/25 shadow-sm'
                          : 'border-slate-200 bg-slate-50/50 hover:border-pink-200 hover:bg-pink-50/10'
                      } ${isLastItem ? 'col-span-2' : ''}`}
                    >
                      <div className="w-full">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-md leading-none ${
                            isSelected ? 'bg-pink-500 text-white' : 'bg-slate-200 text-slate-500'
                          }`}>
                            {p.recommendedAge}
                          </span>
                          <span className={`text-[9px] font-bold ${
                            isSelected ? 'text-pink-500' : 'text-slate-400'
                          }`}>
                            Rp{p.price.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <h4 className={`text-[11px] font-bold mt-2 leading-snug line-clamp-1 ${
                          isSelected ? 'text-pink-600' : 'text-slate-700'
                        }`}>
                          {p.name}
                        </h4>
                      </div>
                      <p className={`text-[9px] font-medium leading-normal line-clamp-1 truncate ${
                        isSelected ? 'text-pink-500/80' : 'text-slate-400'
                      }`}>
                        {p.unit === 'porsi' ? 'Hangat & lezat' : p.unit === 'pack' ? 'Lauk sehat harian' : 'Manis lembut segar'}
                      </p>
                      
                      <div 
                        className={`absolute bottom-1.5 right-1.5 flex items-center rounded-lg p-0.5 gap-1 text-[10px] font-extrabold shadow-sm transition-all z-10 ${
                          isSelected 
                            ? 'bg-pink-500 text-white' 
                            : 'bg-slate-200 text-slate-500'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                        id={`qty-selector-inline-${p.id}`}
                      >
                        <button
                          type="button"
                          disabled={qty === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCart(prev => {
                              const newCart = { ...prev };
                              if (qty <= 1) {
                                delete newCart[p.id];
                              } else {
                                newCart[p.id] = qty - 1;
                              }
                              return newCart;
                            });
                          }}
                          className={`w-4 h-4 flex items-center justify-center rounded-md transition-all font-black text-center ${
                            qty === 0 
                              ? 'opacity-35 cursor-not-allowed text-slate-400' 
                              : isSelected 
                                ? 'hover:bg-pink-600 text-white' 
                                : 'hover:bg-slate-300 text-slate-600'
                          }`}
                          title="Kurangi"
                        >
                          -
                        </button>
                        <span className="min-w-[12px] text-center font-display leading-none">{qty}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCart(prev => ({
                              ...prev,
                              [p.id]: (prev[p.id] || 0) + 1
                            }));
                          }}
                          className={`w-4 h-4 flex items-center justify-center rounded-md transition-all font-black text-center ${
                            isSelected 
                              ? 'hover:bg-pink-600 text-white' 
                              : 'hover:bg-slate-300 text-slate-600'
                          }`}
                          title="Tambah"
                        >
                          +
                        </button>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Selected Items Breakdown */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                3. Rincian Pilihan Menu Anda
              </label>
              
              {selectedItems.length === 0 ? (
                <div className="bg-amber-50/50 border border-amber-100/50 rounded-2xl p-4 flex gap-3 items-center" id="no-item-alert">
                  <AlertCircle className="text-amber-500 shrink-0" size={18} />
                  <p className="text-[11px] text-amber-800 font-semibold leading-relaxed">
                    Silakan pilih minimal 1 menu MPASI di atas untuk melanjutkan pemesanan.
                  </p>
                </div>
              ) : (
                <div className="space-y-2" id="selected-items-breakdown-list">
                  {selectedItems.map(({ product, quantity }) => (
                    <div 
                      key={product.id}
                      className="flex gap-3 p-3 bg-pink-50/30 rounded-2xl border border-pink-100/40 items-center justify-between"
                    >
                      <div className="flex gap-3 items-center min-w-0 flex-1">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover border border-pink-100 bg-white"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <h4 className="font-display font-bold text-[11px] text-slate-800 truncate">
                            {product.name}
                          </h4>
                          <p className="text-[10px] text-slate-400">
                            Rp{product.price.toLocaleString('id-ID')} / {product.unit} • <span className="font-semibold text-emerald-600">{product.recommendedAge}</span>
                          </p>
                        </div>
                      </div>
                      
                      {/* Quantity & Subtotal */}
                      <div className="text-right shrink-0">
                        <p className="font-display font-extrabold text-[11px] text-pink-600">
                          Rp{(product.price * quantity).toLocaleString('id-ID')}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold">
                          {quantity} {product.unit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 3: Outlet Finder */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  4. Pilih Outlet Saffa Terdekat
                </label>
                <span className="bg-pink-100 text-pink-600 font-bold text-[10px] px-2 py-0.5 rounded-full">
                  11 Outlet Aktif
                </span>
              </div>

              {/* City Selector */}
              <div className="grid grid-cols-2 gap-2 mb-3" id="modal-city-selector-grid">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCity('Tanjungpinang');
                    if (selectedOutlet?.region !== 'Tanjungpinang') {
                      setSelectedOutlet(null);
                    }
                  }}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all border cursor-pointer text-center flex flex-col items-center justify-center gap-0.5 ${
                    selectedCity === 'Tanjungpinang'
                      ? 'bg-pink-500 border-pink-500 text-white shadow-sm shadow-pink-100'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-pink-200 hover:bg-pink-50/20'
                  }`}
                  id="modal-select-tp"
                >
                  <span className="text-xs font-extrabold">Tanjungpinang</span>
                  <span className={`text-[9px] font-medium ${selectedCity === 'Tanjungpinang' ? 'text-pink-100' : 'text-slate-400'}`}>
                    8 Outlet Saffa
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCity('Bintan');
                    if (selectedOutlet?.region !== 'Bintan') {
                      setSelectedOutlet(null);
                    }
                  }}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all border cursor-pointer text-center flex flex-col items-center justify-center gap-0.5 ${
                    selectedCity === 'Bintan'
                      ? 'bg-pink-500 border-pink-500 text-white shadow-sm shadow-pink-100'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-pink-200 hover:bg-pink-50/20'
                  }`}
                  id="modal-select-bintan"
                >
                  <span className="text-xs font-extrabold">Bintan</span>
                  <span className={`text-[9px] font-medium ${selectedCity === 'Bintan' ? 'text-pink-100' : 'text-slate-400'}`}>
                    3 Outlet Saffa
                  </span>
                </button>
              </div>

              {!selectedCity ? (
                <div className="py-6 px-4 border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl text-center" id="modal-city-unselected-prompt">
                  <MapPin size={20} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-bold text-slate-600">Pilih Kota Terlebih Dahulu</p>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-[250px] mx-auto leading-relaxed">
                    Pilih kota Tanjungpinang atau Bintan di atas untuk melihat daftar outlet.
                  </p>
                </div>
              ) : (
                <>
                  {/* Mini Search */}
                  <div className="relative mb-2">
                    <input
                      type="text"
                      placeholder={`Cari jalan/wilayah di ${selectedCity}...`}
                      value={searchOutletQuery}
                      onChange={(e) => setSearchOutletQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl pl-3 pr-10 py-2.5 text-xs focus:outline-none focus:border-pink-400 transition-colors"
                      id="outlet-search-input-modal"
                    />
                    {searchOutletQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchOutletQuery('')}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-pink-500"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Outlet List box */}
                  <div className="max-h-40 overflow-y-auto border border-slate-100 rounded-2xl bg-slate-50/50 p-2 space-y-1 scrollbar-thin">
                    {filteredOutlets.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400">
                        <MapPin size={18} className="mx-auto text-slate-300 mb-1" />
                        Outlet tidak ditemukan di {selectedCity}
                      </div>
                    ) : (
                      filteredOutlets.map((outlet) => {
                        const isSelected = selectedOutlet?.id === outlet.id;
                        return (
                          <button
                            key={outlet.id}
                            type="button"
                            onClick={() => setSelectedOutlet(outlet)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left border transition-all text-xs cursor-pointer ${
                              isSelected
                                ? 'bg-pink-500 border-pink-500 text-white shadow-sm shadow-pink-200'
                                : 'bg-white border-slate-100 text-slate-700 hover:border-pink-200 hover:bg-pink-50/20'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <MapPin size={14} className={isSelected ? 'text-white' : 'text-pink-400'} />
                              <div className="truncate">
                                <p className="font-bold">{outlet.name}</p>
                                <p className={`text-[10px] ${isSelected ? 'text-pink-100' : 'text-slate-400'}`}>
                                  {outlet.region}
                                </p>
                              </div>
                            </div>
                            {isSelected && (
                              <span className="bg-white text-pink-500 font-extrabold text-[9px] px-2 py-0.5 rounded-md shrink-0">
                                Terpilih
                              </span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Step 4: Special Request Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                5. Catatan Tambahan (Opsional)
              </label>
              <div className="relative">
                <textarea
                  placeholder="Contoh: Minta porsi agak encer / Untuk pesanan besok jam 7 pagi..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={150}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-pink-400 transition-colors resize-none"
                  id="modal-notes-textarea"
                />
                <span className="absolute right-3 bottom-3 text-[10px] text-slate-400 font-medium">
                  {notes.length}/150
                </span>
              </div>
            </div>

            {/* Checkout Warning */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3 flex gap-2.5 items-start">
              <Sparkles className="text-emerald-500 shrink-0 mt-0.5" size={16} />
              <div className="text-[11px] text-emerald-800 leading-relaxed">
                <span className="font-bold">Freshly Prepared:</span> Saffa Bubur Bayi dibuat hangat setiap pagi tanpa pengawet. Pesanan siap diambil/dikirim langsung to outlet yang Anda pilih.
              </div>
            </div>
          </form>

          {/* Footer (Total and WhatsApp Order Button) */}
          <div className="p-6 bg-slate-50 border-t border-slate-100" id="modal-footer">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Pembayaran</p>
                <p className="text-[10px] text-slate-400">Dapat dibayar di outlet</p>
              </div>
              <div className="text-right">
                <p className="font-display font-extrabold text-xl text-pink-600">
                  Rp{totalPrice.toLocaleString('id-ID')}
                </p>
                <p className="text-[10px] text-slate-500 font-semibold">
                  {selectedItems.map(item => `${item.quantity}x ${item.product.name.replace(' Saffa', '')}`).join(' + ')}
                </p>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={handleOrderSubmit}
              disabled={!selectedOutlet || selectedItems.length === 0 || !customerName.trim() || !customerWhatsapp.trim() || isSubmitting}
              type="button"
              className={`w-full py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 transition-all active:scale-98 cursor-pointer ${
                selectedOutlet && selectedItems.length > 0 && customerName.trim() && customerWhatsapp.trim() && !isSubmitting
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white transform hover:-translate-y-0.5'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
              id="submit-order-whatsapp-btn"
            >
              <MessageSquare size={18} />
              {isSubmitting ? 'Memproses Pesanan...' : 'Kirim Pesanan ke WhatsApp'}
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-2.5">
              1 klik lagi untuk mengirim detail ke WhatsApp <span className="font-bold text-slate-500">{selectedOutlet?.name}</span>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
