import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, MessageCircle, Info } from 'lucide-react';
import { Product, PRODUCTS } from '../data';

interface MenuSectionProps {
  onSelectProduct: (product: Product) => void;
}

export default function MenuSection({ onSelectProduct }: MenuSectionProps) {
  return (
    <section id="menu" className="py-16 sm:py-24 bg-pink-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-pink-600 bg-pink-100/50 px-3 py-1 rounded-full">
            Sehat & Bergizi Lengkap
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-800">
            Pilihan Menu <span className="text-pink-500">Terbaik Saffa</span>
          </h2>
          <div className="w-16 h-1 bg-pink-400 mx-auto rounded-full" />
          <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
            Daftar menu MPASI Saffa yang kaya akan nutrisi, serat, protein murni, dan kalsium untuk mendukung perkembangan aktif fisik & otak si kecil.
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="menu-items-grid">
          {PRODUCTS.map((product, i) => {
            const formattedPrice = new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 0
            }).format(product.price);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-[2rem] overflow-hidden border border-pink-100/60 shadow-sm hover:shadow-xl hover:border-pink-200 transition-all duration-300 flex flex-col group h-full"
              >
                {/* Product Image and Age Badge */}
                <div className="relative overflow-hidden aspect-video sm:aspect-square max-h-56">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bg-pink-50"
                    referrerPolicy="no-referrer"
                  />
                  {/* Recommended Age Badge */}
                  <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-xs text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    {product.recommendedAge}
                  </div>
                  
                  {/* Category Pill */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xs text-slate-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-xs border border-slate-100">
                    Saffa MPASI
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Title & Price */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-extrabold text-lg text-slate-800 leading-snug group-hover:text-pink-500 transition-colors">
                        {product.name}
                      </h3>
                      <div className="text-right shrink-0">
                        <span className="font-display font-extrabold text-lg text-pink-500 block leading-none">
                          {formattedPrice}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">per {product.unit}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-500 text-xs leading-relaxed font-medium line-clamp-3">
                      {product.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-pink-50/50 flex items-center justify-between gap-4">
                    {/* Quick Age Label */}
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold">
                      <Info size={12} className="text-pink-400" />
                      Saran: {product.recommendedAge}
                    </div>

                    {/* Order Button (Exactly 1st click of the 2-click process) */}
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2.5 px-5 rounded-2xl flex items-center gap-1.5 shadow-md shadow-emerald-50 hover:shadow-emerald-100 transition-all active:scale-95 cursor-pointer"
                      id={`order-btn-${product.id}`}
                    >
                      <ShoppingBag size={14} />
                      Pesan
                    </button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Dynamic Tip banner for mothers */}
        <div className="mt-12 bg-white rounded-2xl p-4 sm:p-6 border border-emerald-100 flex flex-col sm:flex-row items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
            💡
          </div>
          <div className="text-center sm:text-left">
            <h4 className="font-display font-bold text-sm text-slate-800">Tips MPASI Sehat untuk Bunda</h4>
            <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
              Untuk bayi usia <span className="font-bold">6-8 bulan</span>, mulailah dengan tekstur saring halus (seperti Bubur Halus Menu 1 & 2). 
              Setelah usia <span className="font-bold">9 bulan+</span>, Bunda bisa mulai mengenalkan tekstur lebih padat melalui Nasi Tim untuk melatih kemampuan mengunyah & motorik si kecil.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
