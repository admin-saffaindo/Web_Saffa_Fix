import React from 'react';
import { motion } from 'motion/react';
import { Award, Heart, Shield, Sparkles } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-pink-50/10 overflow-hidden border-t border-pink-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Side Illustration/Visuals */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative order-last lg:order-first"
          >
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-200/50 to-emerald-200/40 rounded-[2rem] rotate-2 scale-102 -z-10" />

            {/* Quality Statement Box */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-pink-50 space-y-6">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Saffa Quality Standards
              </span>
              
              <h3 className="font-display font-extrabold text-xl text-slate-800 leading-snug">
                Komitmen Saffa Terhadap Nutrisi Bayi Anda
              </h3>

              <div className="space-y-4">
                {/* Standard 1 */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center shrink-0">
                    <Heart size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Dibuat Dengan Kasih Sayang</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      Setiap resep dikembangkan khusus agar ramah pencernaan dan disukai oleh bayi.
                    </p>
                  </div>
                </div>

                {/* Standard 2 */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                    <Shield size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Sangat Higienis (Food Grade)</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      Dimasak steril menggunakan peralatan Stainless Steel Food Grade bersertifikasi tinggi.
                    </p>
                  </div>
                </div>

                {/* Standard 3 */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                    <Award size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Formula Gizi Seimbang</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      Kombinasi makronutrisi & mikronutrisi tepat sesuai angka kecukupan gizi (AKG) harian bayi.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Text/History Story Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
            id="about-text-content"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/50 text-pink-600 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} className="text-pink-400" />
              Cerita Saffa Bubur Bayi
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-800 leading-tight">
              Penyedia MPASI Premium Sehat <br className="hidden sm:inline" />
              Sejak Tahun <span className="text-pink-500">2022</span>
            </h2>

            <div className="space-y-4 text-slate-500 text-sm sm:text-base leading-relaxed font-medium italic">
              <p>
                Saffa Bubur Bayi merupakan penyedia MPASI (Makanan Pendamping ASI) berkualitas premium yang telah melayani wilayah <span className="font-bold text-slate-800 not-italic">Tanjungpinang dan Bintan</span> sejak tahun 2022. 
              </p>
              <p>
                Kami menyadari bahwa 1000 hari pertama kehidupan anak adalah periode emas yang krusial bagi masa depannya. Oleh sebab itu, kami berkomitmen untuk selalu menghadirkan makanan bayi yang sehat, bergizi, bersih, lezat, dan terjangkau setiap hari.
              </p>
              <p className="border-l-4 border-emerald-500 pl-4 italic text-slate-500 text-xs sm:text-sm bg-emerald-50/40 py-3 pr-3 rounded-r-xl not-italic">
                "Setiap produk Saffa dibuat segar setiap hari menggunakan bahan-bahan pilihan tanpa bahan pengawet kimia berbahaya. Karena kesehatan ananda adalah senyuman terindah bagi kami."
              </p>
            </div>

            {/* Quick stats counter */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-pink-50" id="about-stats-grid">
              <div>
                <p className="font-display font-extrabold text-2xl sm:text-3xl text-pink-500">2022</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Berdiri Sejak</p>
              </div>
              <div>
                <p className="font-display font-extrabold text-2xl sm:text-3xl text-emerald-600">11</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Outlet Aktif</p>
              </div>
              <div>
                <p className="font-display font-extrabold text-2xl sm:text-3xl text-slate-800">10k+</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bayi Sehat</p>
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
