export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  unit: string;
  recommendedAge: string;
}

export interface Outlet {
  id: string;
  name: string;
  region: 'Tanjungpinang' | 'Bintan';
  whatsapp: string; // formats as "628xxxxxxxxxx" for wa.me links
  whatsappDisplay: string; // formats for human display
  mapsUrl: string;
  latitude: number;
  longitude: number;
}

export const PRODUCTS: Product[] = [
  {
    id: 'bubur-halus-1',
    name: 'Bubur Halus Menu 1',
    price: 7000,
    description: 'Bubur halus dengan kombinasi beras putih premium, sayuran pilihan, dan protein hewani yang disesuaikan setiap hari. Tekstur lembut dan mudah dikonsumsi bayi yang baru memulai MPASI.',
    image: 'https://lh3.googleusercontent.com/d/1nQ-qUu1vSJGGL-CwUejOfl9gcn5SdMiq',
    unit: 'porsi',
    recommendedAge: '6+ Bulan'
  },
  {
    id: 'bubur-halus-2',
    name: 'Bubur Halus Menu 2',
    price: 7000,
    description: 'Perpaduan beras merah, beras putih premium, sayuran segar, dan protein hewani pilihan. Mengandung variasi nutrisi yang lebih beragam untuk mendukung tumbuh kembang si kecil.',
    image: 'https://lh3.googleusercontent.com/d/1sI6xfs99znX85gBBxGbWFmMif3yLp_k8',
    unit: 'porsi',
    recommendedAge: '6+ Bulan'
  },
  {
    id: 'nasi-tim',
    name: 'Nasi Tim Saffa',
    price: 9000,
    description: 'MPASI bertekstur lebih kasar yang terdiri dari beras putih premium, sayuran, dan protein hewani pilihan. Cocok untuk bayi yang sedang belajar mengunyah dan beralih ke tekstur makanan yang lebih padat.',
    image: 'https://lh3.googleusercontent.com/d/1PCZcZ8W0ACjOARqW1L1sKLno3k53MpRu',
    unit: 'porsi',
    recommendedAge: '9+ Bulan'
  },
  {
    id: 'lauk-mpasi',
    name: 'Aneka Lauk MPASI Tambahan',
    price: 12000,
    description: 'Pilihan lauk pendamping seperti ikan, ayam, sapi, dan menu bergizi lainnya yang dimasak khusus untuk bayi. Dapat dikombinasikan dengan bubur atau nasi tim agar variasi menu si kecil semakin lengkap.',
    image: 'https://lh3.googleusercontent.com/d/1zYsQcNz5Gw_FPvfFkg__U2n63bTyJ03I',
    unit: 'pack',
    recommendedAge: '8+ Bulan'
  },
  {
    id: 'silky-pudding',
    name: 'Silky Pudding',
    price: 2000,
    description: 'Puding lembut dengan aneka varian rasa yang dibuat khusus untuk bayi dan anak. Teksturnya halus, ringan, dan cocok sebagai camilan pendamping MPASI.',
    image: 'https://lh3.googleusercontent.com/d/1McJEn9SSAAMTSKsK-hIe4mXrCPtvlP2r',
    unit: 'cup',
    recommendedAge: '7+ Bulan'
  }
];

// All 11 active outlets mapped with coordinates and phone numbers for Saffa Bubur Bayi
export const OUTLETS: Outlet[] = [
  // TANJUNGPINANG (8 outlets)
  {
    id: 'tp-km8',
    name: 'Outlet KM 8 Atas',
    region: 'Tanjungpinang',
    whatsapp: '628176600777',
    whatsappDisplay: '0817-6600-777',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Saffa+Bubur+Bayi+KM+8+Tanjungpinang',
    latitude: 0.9105,
    longitude: 104.4712
  },
  {
    id: 'tp-poltekkes',
    name: 'Outlet Poltekkes',
    region: 'Tanjungpinang',
    whatsapp: '6285835665574',
    whatsappDisplay: '0858-3566-5574',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Saffa+Bubur+Bayi+Poltekkes+Tanjungpinang',
    latitude: 0.9198,
    longitude: 104.4882
  },
  {
    id: 'tp-kios-djalal',
    name: 'Outlet Simpang Kios Djalal',
    region: 'Tanjungpinang',
    whatsapp: '6285668084302',
    whatsappDisplay: '0856-6808-4302',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Saffa+Bubur+Bayi+Simpang+Kios+Djalal+Tanjungpinang',
    latitude: 0.9165,
    longitude: 104.4532
  },
  {
    id: 'tp-bincen',
    name: 'Outlet Bincen (Bintan Center)',
    region: 'Tanjungpinang',
    whatsapp: '6281536781944',
    whatsappDisplay: '0815-3678-1944',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Saffa+Bubur+Bayi+Bintan+Center+Tanjungpinang',
    latitude: 0.9212,
    longitude: 104.4752
  },
  {
    id: 'tp-cinta-damai',
    name: 'Outlet Jl Cinta Damai',
    region: 'Tanjungpinang',
    whatsapp: '628988745404',
    whatsappDisplay: '0898-8745-404',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Saffa+Bubur+Bayi+Jl+Cinta+Damai+Tanjungpinang',
    latitude: 0.9125,
    longitude: 104.4642
  },
  {
    id: 'tp-ganet',
    name: 'Outlet Ganet',
    region: 'Tanjungpinang',
    whatsapp: '628557199222',
    whatsappDisplay: '0855-7199-222',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Saffa+Bubur+Bayi+Ganet+Tanjungpinang',
    latitude: 0.9295,
    longitude: 104.4998
  },
  {
    id: 'tp-kijang-lama',
    name: 'Outlet Kijang Lama',
    region: 'Tanjungpinang',
    whatsapp: '628557166222',
    whatsappDisplay: '0855-7166-222',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Saffa+Bubur+Bayi+Kijang+Lama+Tanjungpinang',
    latitude: 0.9065,
    longitude: 104.4592
  },
  {
    id: 'tp-km16',
    name: 'Outlet KM 16 Arah Uban',
    region: 'Tanjungpinang',
    whatsapp: '628137222190',
    whatsappDisplay: '0813-7222-190',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Saffa+Bubur+Bayi+KM+16+Arah+Uban',
    latitude: 0.9412,
    longitude: 104.4988
  },
  // BINTAN (3 outlets)
  {
    id: 'bt-km18',
    name: 'Outlet KM 18 Arah Kijang',
    region: 'Bintan',
    whatsapp: '628137222190',
    whatsappDisplay: '0813-7222-190',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Saffa+Bubur+Bayi+KM+18+Arah+Kijang+Bintan',
    latitude: 0.9085,
    longitude: 104.5352
  },
  {
    id: 'bt-musi',
    name: 'Outlet Jl Musi',
    region: 'Bintan',
    whatsapp: '628137222190',
    whatsappDisplay: '0813-7222-190',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Saffa+Bubur+Bayi+Jl+Musi+Bintan',
    latitude: 0.8525,
    longitude: 104.5882
  },
  {
    id: 'bt-kijang-kota',
    name: 'Outlet Kijang Kota',
    region: 'Bintan',
    whatsapp: '628137222190',
    whatsappDisplay: '0813-7222-190',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Saffa+Bubur+Bayi+Kijang+Kota+Bintan',
    latitude: 0.8465,
    longitude: 104.5932
  }
];

export const PRIMARY_WHATSAPP = '628137222190'; // Central office or central customer service
export const PRIMARY_WHATSAPP_DISPLAY = '0813-7222-190';

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/saffabuburbayi', // example link
  tiktok: 'https://tiktok.com/@saffabuburbayi',
  facebook: 'https://facebook.com/saffabuburbayi',
  whatsapp: `https://wa.me/${PRIMARY_WHATSAPP}`,
  headquarters: 'Jl Balam Ujung Aspal Kelurahan Batu IX Kec Tanjung Pinang Timur Kota Tanjung Pinang'
};

export interface DailyMenu {
  id: string;
  dayName: string;
  dateLabel: string;
  menu1: string;
  menu2: string;
  nasiTim: string;
  anekaLauk: string;
  pudding: string;
}

export const DEFAULT_DAILY_MENUS: DailyMenu[] = [
  {
    id: 'day-1',
    dayName: 'Senin',
    dateLabel: '',
    menu1: '',
    menu2: '',
    nasiTim: '',
    anekaLauk: '',
    pudding: ''
  },
  {
    id: 'day-2',
    dayName: 'Selasa',
    dateLabel: '',
    menu1: '',
    menu2: '',
    nasiTim: '',
    anekaLauk: '',
    pudding: ''
  },
  {
    id: 'day-3',
    dayName: 'Rabu',
    dateLabel: '',
    menu1: '',
    menu2: '',
    nasiTim: '',
    anekaLauk: '',
    pudding: ''
  },
  {
    id: 'day-4',
    dayName: 'Kamis',
    dateLabel: '',
    menu1: '',
    menu2: '',
    nasiTim: '',
    anekaLauk: '',
    pudding: ''
  },
  {
    id: 'day-5',
    dayName: 'Jumat',
    dateLabel: '',
    menu1: '',
    menu2: '',
    nasiTim: '',
    anekaLauk: '',
    pudding: ''
  },
  {
    id: 'day-6',
    dayName: 'Sabtu',
    dateLabel: '',
    menu1: '',
    menu2: '',
    nasiTim: '',
    anekaLauk: '',
    pudding: ''
  },
  {
    id: 'day-7',
    dayName: 'Ahad',
    dateLabel: '',
    menu1: '',
    menu2: '',
    nasiTim: '',
    anekaLauk: '',
    pudding: ''
  }
];
