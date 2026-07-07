import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileSpreadsheet, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Trash2, 
  ExternalLink, 
  Search, 
  MapPin, 
  MessageSquare, 
  TrendingUp, 
  ShoppingBag, 
  ArrowLeft,
  Copy,
  Check,
  Lock,
  ChevronDown,
  Info,
  Sliders,
  Database
} from 'lucide-react';
import { getAppsScriptUrl, setAppsScriptUrl, ADMIN_PIN } from '../config';
import { DailyMenu, DEFAULT_DAILY_MENUS } from '../data';

interface AdminDashboardProps {
  onBackToWebsite: () => void;
}

interface Order {
  id: string;
  customerName: string;
  customerWhatsapp: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  outletId: string;
  outletName: string;
  notes: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard({ onBackToWebsite }: AdminDashboardProps) {
  // Password PIN lock state
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [isPasswordVerified, setIsPasswordVerified] = useState<boolean>(() => {
    return sessionStorage.getItem('saffa_admin_verified') === 'true';
  });
  const [passwordError, setPasswordError] = useState<string>('');

  // Tab state: 'orders' or 'menus'
  const [activeTab, setActiveTab] = useState<'orders' | 'menus'>('orders');

  // Apps Script configuration state
  const [webAppUrl, setWebAppUrl] = useState<string>('');
  const [isSavingUrl, setIsSavingUrl] = useState<boolean>(false);
  const [showSetupGuide, setShowSetupGuide] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Daily Menus State
  const [dailyMenus, setDailyMenus] = useState<DailyMenu[]>([]);
  const [isSavingMenus, setIsSavingMenus] = useState<boolean>(false);
  const [menuStatusMessage, setMenuStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [outletFilter, setOutletFilter] = useState<string>('all');

  // Load configuration and data on mount
  useEffect(() => {
    if (isPasswordVerified) {
      const savedUrl = getAppsScriptUrl();
      setWebAppUrl(savedUrl);
      loadOrders(savedUrl);
      loadDailyMenus(savedUrl);
    }
  }, [isPasswordVerified]);

  // Load daily menus
  const loadDailyMenus = async (urlToUse?: string) => {
    const targetUrl = urlToUse !== undefined ? urlToUse : webAppUrl;
    
    // Fallback to localStorage or DEFAULT_DAILY_MENUS
    const savedLocal = localStorage.getItem('saffa_daily_menus');
    let initialMenus = DEFAULT_DAILY_MENUS;
    if (savedLocal) {
      try {
        initialMenus = JSON.parse(savedLocal);
      } catch (e) {
        console.error(e);
      }
    }
    setDailyMenus(initialMenus);

    if (!targetUrl || !targetUrl.startsWith('http')) return;

    try {
      const response = await fetch(`${targetUrl}${targetUrl.includes('?') ? '&' : '?'}action=getMenus`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setDailyMenus(data);
          localStorage.setItem('saffa_daily_menus', JSON.stringify(data));
        }
      }
    } catch (error) {
      console.warn("Gagal memuat menu harian dari Sheets, menggunakan backup lokal.", error);
    }
  };

  // Save daily menus to Sheets and localStorage
  const handleSaveDailyMenus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingMenus(true);
    setMenuStatusMessage(null);

    // Save locally first
    localStorage.setItem('saffa_daily_menus', JSON.stringify(dailyMenus));

    const targetUrl = getAppsScriptUrl();
    if (targetUrl && targetUrl.startsWith('http')) {
      try {
        await fetch(targetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'saveMenus', menus: dailyMenus })
        });
        setMenuStatusMessage({ type: 'success', text: 'Jadwal Menu Harian berhasil disimpan ke Google Sheets!' });
      } catch (error) {
        console.error(error);
        setMenuStatusMessage({ type: 'error', text: 'Gagal sinkronisasi ke Google Sheets secara langsung.' });
      } finally {
        setIsSavingMenus(false);
      }
    } else {
      setTimeout(() => {
        setIsSavingMenus(false);
        setMenuStatusMessage({ type: 'success', text: 'Jadwal Menu Harian berhasil disimpan di lokal browser!' });
      }, 600);
    }
  };

  // Handler to update a single field in a specific day's menu
  const handleUpdateMenuField = (dayId: string, field: keyof DailyMenu, value: string) => {
    setDailyMenus(prev => prev.map(m => m.id === dayId ? { ...m, [field]: value } : m));
  };

  // PIN validation handler
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PIN) {
      setIsPasswordVerified(true);
      sessionStorage.setItem('saffa_admin_verified', 'true');
      setPasswordError('');
    } else {
      setPasswordError('PIN keamanan salah! Silakan coba lagi.');
      setPasswordInput('');
    }
  };

  // Google Apps Script source code to show in setup instructions
  const appsScriptCode = `function doPost(e) {
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName("Data Pelanggan") || doc.getSheets()[0];
    var content = e.postData.contents;
    var data = JSON.parse(content);
    
    // Pastikan baris header ada jika sheet masih kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Tanggal", 
        "ID Pesanan", 
        "Nama Pelanggan", 
        "Nomor WhatsApp", 
        "Nama Menu MPASI", 
        "Porsi", 
        "Total Harga (Rp)", 
        "Outlet Saffa", 
        "Catatan", 
        "Status Pesanan"
      ]);
    }
    
    // Periksa apakah ini aksi saveMenus
    if (data.action === 'saveMenus') {
      var menuSheet = doc.getSheetByName("Menu Harian");
      if (!menuSheet) {
        menuSheet = doc.insertSheet("Menu Harian");
      }
      menuSheet.clear();
      menuSheet.appendRow(["ID Hari", "Nama Hari", "Label Tanggal", "Menu 1 (6+ Bln)", "Menu 2 (6+ Bln)", "Nasi Tim (9+ Bln)", "Aneka Lauk (8+ Bln)", "Silky Pudding (7+ Bln)"]);
      
      var menus = data.menus;
      for (var i = 0; i < menus.length; i++) {
        var m = menus[i];
        menuSheet.appendRow([m.id, m.dayName, m.dateLabel, m.menu1, m.menu2, m.nasiTim, m.anekaLauk, m.pudding]);
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Jadwal Menu Harian tersimpan" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Periksa apakah ini aksi updateStatus
    if (data.action === 'updateStatus') {
      var id = data.id;
      var newStatus = data.status;
      var rows = sheet.getDataRange().getValues();
      
      for (var i = 1; i < rows.length; i++) {
        if (rows[i][1] === id) {
          sheet.getRange(i + 1, 10).setValue(newStatus.toUpperCase());
          return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Status terupdate" }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "ID Pesanan tidak ditemukan" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Periksa apakah ini aksi delete
    if (data.action === 'delete') {
      var id = data.id;
      var rows = sheet.getDataRange().getValues();
      
      for (var i = 1; i < rows.length; i++) {
        if (rows[i][1] === id) {
          sheet.deleteRow(i + 1);
          return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Pesanan dihapus" }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "ID Pesanan tidak ditemukan" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Jika bukan aksi di atas, berarti pesanan baru masuk
    sheet.appendRow([
      data.createdAt || new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
      data.id || ('SF-' + Math.random().toString(36).substr(2, 9).toUpperCase()),
      data.customerName,
      data.customerWhatsapp,
      data.productName,
      data.quantity,
      data.totalPrice,
      data.outletName,
      data.notes || '-',
      (data.status || 'PENDING').toUpperCase()
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Pesanan baru berhasil ditambahkan" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    
    // Cek apakah aksi untuk mengambil menu harian
    if (e && e.parameter && e.parameter.action === 'getMenus') {
      var menuSheet = doc.getSheetByName("Menu Harian");
      if (!menuSheet || menuSheet.getLastRow() <= 1) {
        return ContentService.createTextOutput(JSON.stringify([]))
          .setMimeType(ContentService.MimeType.JSON);
      }
      var data = menuSheet.getDataRange().getValues();
      var rows = [];
      for (var i = 1; i < data.length; i++) {
        var row = {
          id: String(data[i][0] || ''),
          dayName: String(data[i][1] || ''),
          dateLabel: String(data[i][2] || ''),
          menu1: String(data[i][3] || ''),
          menu2: String(data[i][4] || ''),
          nasiTim: String(data[i][5] || ''),
          anekaLauk: String(data[i][6] || ''),
          pudding: String(data[i][7] || '')
        };
        rows.push(row);
      }
      return ContentService.createTextOutput(JSON.stringify(rows))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var sheet = doc.getSheetByName("Data Pelanggan") || doc.getSheets()[0];
    var data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var rows = [];
    for (var i = 1; i < data.length; i++) {
      var row = {
        createdAt: data[i][0] ? String(data[i][0]) : '',
        id: data[i][1] ? String(data[i][1]) : '',
        customerName: data[i][2] ? String(data[i][2]) : '',
        customerWhatsapp: data[i][3] ? String(data[i][3]) : '',
        productName: data[i][4] ? String(data[i][4]) : '',
        quantity: Number(data[i][5] || 0),
        totalPrice: Number(data[i][6] || 0),
        outletName: data[i][7] ? String(data[i][7]) : '',
        notes: data[i][8] ? String(data[i][8]) : '',
        status: data[i][9] ? String(data[i][9]).toLowerCase() : 'pending'
      };
      rows.push(row);
    }
    
    // Urutkan dari pesanan terbaru (balik urutan array)
    rows.reverse();
    
    return ContentService.createTextOutput(JSON.stringify(rows))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Loads orders from Google Apps Script Web App OR falls back to localStorage
  const loadOrders = async (urlToUse?: string) => {
    const targetUrl = urlToUse !== undefined ? urlToUse : webAppUrl;
    setIsLoading(true);
    setStatusMessage(null);

    // If no URL is set up, load local backup orders from localStorage
    if (!targetUrl || !targetUrl.startsWith('http')) {
      try {
        const local = JSON.parse(localStorage.getItem('saffa_local_orders') || '[]');
        setOrders(local.reverse()); // Show newest first
      } catch (err) {
        setOrders([]);
      }
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(targetUrl);
      if (!response.ok) throw new Error("Respons jaringan tidak OK");
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setOrders(data);
      } else if (data && data.error) {
        console.error("Apps Script Error:", data.error);
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Gagal mengambil data dari Google Sheets:", error);
      setStatusMessage({ 
        type: 'error', 
        text: 'Gagal memuat data dari Google Sheets. Menampilkan backup lokal browser sebagai gantinya.' 
      });
      // Fallback to local orders
      try {
        const local = JSON.parse(localStorage.getItem('saffa_local_orders') || '[]');
        setOrders(local.reverse());
      } catch (err) {
        setOrders([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingUrl(true);
    
    const trimmedUrl = webAppUrl.trim();
    setAppsScriptUrl(trimmedUrl);
    
    setTimeout(() => {
      setIsSavingUrl(false);
      setStatusMessage({ type: 'success', text: 'URL Google Apps Script berhasil disimpan!' });
      loadOrders(trimmedUrl);
    }, 600);
  };

  // Updates order status in both Sheets and localStorage
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setStatusMessage(null);
    const targetUrl = getAppsScriptUrl();

    // 1. Update in local orders
    try {
      const local = JSON.parse(localStorage.getItem('saffa_local_orders') || '[]');
      const updatedLocal = local.map((o: Order) => o.id === orderId ? { ...o, status: newStatus } : o);
      localStorage.setItem('saffa_local_orders', JSON.stringify(updatedLocal));
      
      // Update local state directly to reflect quickly
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (e) {
      console.error(e);
    }

    // 2. Sync to Sheets via POST action
    if (targetUrl && targetUrl.startsWith('http')) {
      try {
        await fetch(targetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'updateStatus', id: orderId, status: newStatus })
        });
        setStatusMessage({ type: 'success', text: `Status pesanan #${orderId} berhasil diubah.` });
      } catch (err) {
        console.error(err);
        setStatusMessage({ type: 'error', text: 'Gagal mengupdate status di Google Sheets secara langsung.' });
      }
    }
  };

  // Deletes an order
  const handleDeleteOrder = async (orderId: string, customerName: string) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin MENGHAPUS pesanan atas nama "${customerName}"?\nTindakan ini juga akan dihapus di Google Sheets.`
    );
    if (!confirmed) return;

    setStatusMessage(null);
    const targetUrl = getAppsScriptUrl();

    // 1. Delete from local storage
    try {
      const local = JSON.parse(localStorage.getItem('saffa_local_orders') || '[]');
      const filteredLocal = local.filter((o: Order) => o.id !== orderId);
      localStorage.setItem('saffa_local_orders', JSON.stringify(filteredLocal));
      
      // Update local state directly to reflect quickly
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (e) {
      console.error(e);
    }

    // 2. Sync deletion to Sheets via POST action
    if (targetUrl && targetUrl.startsWith('http')) {
      try {
        await fetch(targetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'delete', id: orderId })
        });
        setStatusMessage({ type: 'success', text: `Pesanan #${orderId} telah dihapus.` });
      } catch (err) {
        console.error(err);
        setStatusMessage({ type: 'error', text: 'Gagal menghapus baris di Google Sheets secara langsung.' });
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm("Keluar dari panel admin?")) {
      sessionStorage.removeItem('saffa_admin_verified');
      setIsPasswordVerified(false);
      setPasswordInput('');
    }
  };

  // Filter logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerWhatsapp.includes(searchQuery) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' ? true : order.status === statusFilter;
    const matchesOutlet = outletFilter === 'all' ? true : order.outletName.toLowerCase().includes(outletFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesOutlet;
  });

  // Extract unique outlets for filter dropdown
  const uniqueOutlets = Array.from(new Set(orders.map(o => o.outletName)));

  // Simple Analytics calculations
  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  // If PIN is not verified, show lock screen
  if (!isPasswordVerified) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-6" id="admin-pass-lock-screen">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-[2.5rem] p-8 shadow-xl border border-pink-50 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 to-rose-400" />
          
          <div className="p-4 bg-pink-50 text-pink-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <Lock size={24} />
          </div>
          
          <h2 className="font-display font-extrabold text-xl text-slate-800 mb-1">Akses Terbatas</h2>
          <p className="text-xs text-slate-400 mb-6">
            Masukkan PIN Keamanan untuk membuka Panel Admin Saffa
          </p>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={12}
                autoFocus
                placeholder="Masukkan PIN..."
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-2xl px-4 py-3 text-center text-lg font-bold tracking-widest focus:outline-none focus:border-pink-400 transition-colors"
              />
              {passwordError && (
                <p className="text-xs text-rose-500 font-bold mt-2.5 flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
                  {passwordError}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full py-3.5 px-5 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              Masuk ke Dashboard
            </button>
          </form>
          
          <button 
            onClick={onBackToWebsite}
            className="mt-6 text-xs text-slate-400 hover:text-slate-600 font-bold block mx-auto underline cursor-pointer"
          >
            Kembali ke Website
          </button>
        </motion.div>
      </div>
    );
  }

  // Dashboard View once PIN is unlocked
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800" id="admin-hub-container">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBackToWebsite}
              className="p-2 bg-white/15 hover:bg-white/25 rounded-full transition-colors cursor-pointer"
              title="Kembali ke Website"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="font-display font-extrabold text-xl tracking-tight">Saffa Admin Hub</h1>
              <p className="text-xs text-pink-100 font-medium">Sistem Integrasi Langsung Google Sheets (Tanpa Firebase)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Lock size={12} />
              Keluar Panel
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-pink-400/35">
          <div className="max-w-7xl mx-auto px-6 flex justify-start gap-4">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3 px-2 font-bold text-xs tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                activeTab === 'orders' 
                  ? 'border-white text-white font-extrabold' 
                  : 'border-transparent text-pink-100 hover:text-white'
              }`}
            >
              📋 Kelola Pesanan
            </button>
            <button
              onClick={() => setActiveTab('menus')}
              className={`py-3 px-2 font-bold text-xs tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                activeTab === 'menus' 
                  ? 'border-white text-white font-extrabold' 
                  : 'border-transparent text-pink-100 hover:text-white'
              }`}
            >
              🗓️ Kelola Menu Harian
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Status Alerts */}
        {statusMessage && (
          <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
              : 'bg-rose-50 text-rose-800 border-rose-100'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle size={16} className="text-emerald-500" /> : <AlertTriangle size={16} className="text-rose-500" />}
            {statusMessage.text}
          </div>
        )}

        {/* Quick KPI Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-pink-50 text-pink-500 rounded-xl">
              <ShoppingBag size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Pesanan</p>
              <p className="text-xl font-display font-extrabold text-slate-800">{orders.length}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pendapatan Selesai</p>
              <p className="text-xl font-display font-extrabold text-emerald-600">
                Rp{totalRevenue.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
              <FileSpreadsheet size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Database Google Sheets</p>
              <p className="text-xs font-bold text-slate-800 truncate">
                {webAppUrl ? "Tersambung (Cloud)" : "Backup Lokal Browser"}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
              <Database size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lokasi Record</p>
              <p className="text-xs font-bold text-slate-700">
                {webAppUrl ? "Google Sheets" : "Browser Terlokalisasi"}
              </p>
            </div>
          </div>
        </div>

        {/* Google Sheets Apps Script Connector Panel */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 pb-2 border-b border-slate-100">
            <div>
              <h2 className="font-display font-bold text-sm uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <FileSpreadsheet size={16} className="text-emerald-500" />
                Integrasi Otomatis Google Sheets Anda
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Koneksikan form pesanan langsung ke Google Sheet pribadi Anda tanpa perantara.</p>
            </div>
            
            <button
              onClick={() => setShowSetupGuide(!showSetupGuide)}
              className="text-xs font-bold text-pink-500 hover:text-pink-600 flex items-center gap-1 cursor-pointer"
            >
              <Info size={14} />
              {showSetupGuide ? "Tutup Panduan Apps Script" : "Cara Membuat Google Apps Script"}
            </button>
          </div>

          {/* Interactive Setup Guide */}
          <AnimatePresence>
            {showSetupGuide && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-4">
                  <p className="font-bold text-slate-700">Langkah-langkah Menghubungkan Google Sheets secara Instan:</p>
                  <ol className="list-decimal pl-4 space-y-2 text-slate-600">
                    <li>Buat Spreadsheet Google Baru, beri nama <b>"Saffa Bubur Bayi - Data Pelanggan"</b>.</li>
                    <li>Di bagian atas, klik menu <b>Ekstensi</b> lalu pilih <b>Apps Script</b>.</li>
                    <li>Hapus semua kode bawaan di dalam editor script, lalu salin (copy) seluruh kode di bawah ini:</li>
                  </ol>

                  {/* Copyable Script Block */}
                  <div className="relative">
                    <button
                      onClick={copyToClipboard}
                      className="absolute right-3 top-3 bg-white text-slate-600 hover:text-pink-500 p-2 rounded-xl border border-slate-200 flex items-center gap-1 font-bold text-[10px] transition-colors cursor-pointer shadow-xs"
                    >
                      {copySuccess ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      {copySuccess ? "Tersalin!" : "Salin Kode"}
                    </button>
                    <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-[10.5px] overflow-x-auto max-h-[250px] leading-relaxed">
                      {appsScriptCode}
                    </pre>
                  </div>

                  <ol className="list-decimal pl-4 space-y-2 text-slate-600" start={4}>
                    <li>Klik tombol <b>Simpan</b> (ikon disket) di atas editor Apps Script.</li>
                    <li>Klik tombol <b>Terapkan / Deploy</b> di sudut kanan atas, lalu pilih <b>Penerapan Baru (New Deployment)</b>.</li>
                    <li>Klik ikon gerigi di samping "Pilih Jenis", pilih <b>Aplikasi Web (Web App)</b>.</li>
                    <li>Atur opsi konfigurasinya:
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Deskripsi: <i>"Integrasi Saffa"</i></li>
                        <li>Jalankan sebagai (Execute as): <b>Saya (Me / saffaindo@gmail.com)</b></li>
                        <li>Siapa yang memiliki akses (Who has access): <b>Siapa saja (Anyone)</b> <span className="text-rose-500 font-bold font-mono">*PENTING!</span></li>
                      </ul>
                    </li>
                    <li>Klik tombol <b>Terapkan (Deploy)</b>. Jika Google meminta izin akses, klik <b>Izinkan / Berikan Akses</b>.</li>
                    <li>Salin <b>URL Aplikasi Web</b> yang diberikan (berakhiran <code className="font-mono bg-pink-50 text-pink-600 px-1 rounded">/exec</code>).</li>
                    <li>Tempelkan (paste) URL tersebut pada kolom input di bawah ini dan klik Simpan!</li>
                  </ol>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form to enter Google Apps Script URL */}
          <form onSubmit={handleSaveUrl} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-grow">
              <input
                type="url"
                required
                placeholder="Masukkan URL Google Apps Script Anda (https://script.google.com/macros/s/.../exec)"
                value={webAppUrl}
                onChange={(e) => setWebAppUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-pink-400 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isSavingUrl}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-3 px-6 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              {isSavingUrl ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
              Simpan & Sambungkan
            </button>
          </form>
        </div>

        {/* Orders Management Board */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-display font-extrabold text-base text-slate-800">Daftar Pesanan Saffa</h2>
              <p className="text-xs text-slate-400 mt-0.5">Pantau pesanan real-time dari Google Sheets Anda</p>
            </div>
            
            <button
              onClick={() => loadOrders(webAppUrl)}
              disabled={isLoading}
              className="p-2.5 bg-pink-50 hover:bg-pink-100 text-pink-500 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              Refresh Data Sheets
            </button>
          </div>

          {/* Search & Filters Controls */}
          <div className="p-4 bg-slate-50 border-b border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Cari nama, No WA, ID pesanan, atau menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-pink-400 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400 cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu Konfirmasi (Pending)</option>
                <option value="confirmed">Dikonfirmasi (Confirmed)</option>
                <option value="completed">Selesai (Completed)</option>
                <option value="cancelled">Dibatalkan (Cancelled)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Outlet:</span>
              <select
                value={outletFilter}
                onChange={(e) => setOutletFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400 cursor-pointer"
              >
                <option value="all">Semua Outlet</option>
                {uniqueOutlets.map((outlet, idx) => (
                  <option key={idx} value={outlet}>{outlet}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Orders Table view */}
          {isLoading ? (
            <div className="text-center py-16 text-slate-400">
              <RefreshCw className="animate-spin mx-auto text-pink-500 mb-2" />
              Menghubungi Google Sheets untuk memuat pesanan...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <ShoppingBag size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="font-bold text-sm text-slate-600">Tidak Ada Pesanan Ditemukan</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                {webAppUrl 
                  ? "Belum ada pesanan yang tersimpan di Google Sheet Anda." 
                  : "Belum ada pesanan lokal yang tersimpan di browser ini. Hubungkan Google Sheets di atas untuk melihat data sinkron cloud!"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4 pl-6">ID & Info Pelanggan</th>
                    <th className="p-4">Detail Pesanan</th>
                    <th className="p-4">Total & Pembayaran</th>
                    <th className="p-4">Outlet Penjemputan</th>
                    <th className="p-4">Ubah Status</th>
                    <th className="p-4 pr-6 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* ID & Customer */}
                      <td className="p-4 pl-6">
                        <p className="font-mono text-[9px] text-slate-400">{order.createdAt || "Baru"}</p>
                        <p className="font-bold text-sm text-slate-800 mt-0.5">{order.customerName}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="bg-pink-50 text-pink-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                            {order.customerWhatsapp}
                          </span>
                          <a 
                            href={`https://wa.me/${order.customerWhatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-500 hover:text-emerald-600 font-bold text-[10px] flex items-center gap-0.5"
                          >
                            <MessageSquare size={10} />
                            Chat WA
                          </a>
                        </div>
                      </td>

                      {/* Product Name */}
                      <td className="p-4">
                        <p className="font-bold text-slate-800">{order.productName}</p>
                        <p className="text-slate-400 text-[11px] mt-0.5">{order.quantity} Porsi</p>
                        {order.notes && order.notes !== '-' && (
                          <div className="mt-1 bg-amber-50 text-amber-800 p-1.5 rounded-lg text-[10px] max-w-xs border border-amber-100/50 leading-normal">
                            <span className="font-bold">Catatan:</span> {order.notes}
                          </div>
                        )}
                      </td>

                      {/* Pricing */}
                      <td className="p-4">
                        <p className="font-extrabold text-sm text-slate-800">
                          Rp{order.totalPrice.toLocaleString('id-ID')}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Bayar Langsung di Outlet</p>
                      </td>

                      {/* Pick up outlet */}
                      <td className="p-4 text-slate-700">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} className="text-pink-400" />
                          <span className="font-medium">{order.outletName}</span>
                        </div>
                      </td>

                      {/* Status select dropdown */}
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className={`px-2 py-1.5 rounded-md text-[10px] font-bold border cursor-pointer focus:outline-none ${
                            order.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : order.status === 'confirmed'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : order.status === 'cancelled'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <option value="pending">Menunggu (Pending)</option>
                          <option value="confirmed">Dikonfirmasi</option>
                          <option value="completed">Selesai</option>
                          <option value="cancelled">Batal</option>
                        </select>
                      </td>

                      {/* Deletion action */}
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => handleDeleteOrder(order.id, order.customerName)}
                          className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Pesanan"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
