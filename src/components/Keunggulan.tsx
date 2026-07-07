import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Flame, Leaf, MapPin } from 'lucide-react';

interface BenefitItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
  colorClass: string;
  iconBgClass: string;
}

export default function Keunggulan() {
  const benefits: BenefitItem[] = [
    {
      icon: <ShieldCheck size={26} />,
      title: 'Tanpa Pengawet & MSG',
      desc: '100% alami tanpa bahan kimia, pengawet makanan, pewarna sintetis, maupun tambahan MSG. Sangat aman bagi organ pencernaan bayi.',
      colorClass: 'border-pink-100 bg-pink-50/30 hover:bg-pink-50/50 hover:border-pink-300',
      iconBgClass: 'bg-pink-100 text-pink-500'
    },
    {
      icon: <Flame size={26} />,
      title: 'Dibuat Setiap Hari',
      desc: 'Kami memasak bubur segar hangat setiap pagi hari sebelum didistribusikan langsung ke outlet, menjamin rasa terbaik dan kesegaran nutrisi.',
      colorClass: 'border-amber-100 bg-amber-50/30 hover:bg-amber-50/50 hover:border-amber-300',
      iconBgClass: 'bg-amber-100 text-amber-500'
    },
    {
      icon: <Leaf size={26} />,
      title: 'Bahan Alami & Premium',
      desc: 'Diproduksi dari beras kualitas prima, sayuran hijau segar bebas pestisida, serta daging dan ayam segar pilihan berprotein tinggi.',
      colorClass: 'border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50/50 hover:border-emerald-300',
      iconBgClass: 'bg-emerald-100 text-emerald-500'
    },
    {
      icon: <MapPin size={26} />,
      title: '11 Outlet Aktif Terdekat',
      desc: 'Saffa hadir lebih dekat melalui 11 cabang aktif di Tanjungpinang & Bintan. Memudahkan Bunda mendapatkan MPASI hangat siap saji.',
      colorClass: 'border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50/50 hover:border-emerald-300',
      iconBgClass: 'bg-emerald-100 text-emerald-600'
    }
  ];

  return (
    <section id="keunggulan" className="py-16 bg-white border-y border-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-800">
            Mengapa Memilih <span className="text-pink-500">Saffa Bubur Bayi?</span>
          </h2>
          <div className="w-16 h-1 bg-pink-400 mx-auto rounded-full" />
          <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
            Kesehatan dan keceriaan ananda adalah prioritas nomor satu kami. Setiap porsi Saffa diramu penuh kasih untuk mendukung tumbuh kembang emas si kecil.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="keunggulan-grid">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`p-6 rounded-[2rem] border transition-all duration-300 hover:shadow-lg ${b.colorClass}`}
            >
              {/* Icon Container */}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-xs ${b.iconBgClass}`}>
                {b.icon}
              </div>

              {/* Title & Description */}
              <h3 className="font-display font-bold text-base text-slate-800 mb-2 leading-snug">
                {b.title}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                {b.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
