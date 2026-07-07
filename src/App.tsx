import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Hero from './components/Hero';
import Keunggulan from './components/Keunggulan';
import MenuSection from './components/MenuSection';
import DailyMenuSection from './components/DailyMenuSection';
import RunningMenuTicker from './components/RunningMenuTicker';
import OutletSection from './components/OutletSection';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import OrderModal from './components/OrderModal';
import FloatingCTA from './components/FloatingCTA';
import AdminDashboard from './components/AdminDashboard';
import SplashIntro from './components/SplashIntro';
import { Product, Outlet } from './data';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);

  // Trigger order modal with no preselected product/outlet (defaults to first item)
  const handleOpenGeneralOrderModal = () => {
    setSelectedProduct(null);
    setSelectedOutlet(null);
    setIsOrderModalOpen(true);
  };

  // Trigger order modal with a preselected product (from Product list)
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedOutlet(null); // default to closest outlet
    setIsOrderModalOpen(true);
  };

  // Trigger order modal with a preselected outlet (from Outlet locator)
  const handleSelectOutlet = (outlet: Outlet) => {
    setSelectedProduct(null); // default to first product
    setSelectedOutlet(outlet);
    setIsOrderModalOpen(true);
  };

  if (isAdminView) {
    return <AdminDashboard onBackToWebsite={() => setIsAdminView(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-rose-100 selection:text-rose-600 antialiased" id="saffa-app-root">
      {/* Sticky Header */}
      <Header 
        onOpenOrderModal={handleOpenGeneralOrderModal} 
        onOpenAdmin={() => setIsAdminView(true)} 
      />

      {/* Main Sections */}
      <main className="flex-grow pt-24" id="saffa-main-content">
        {/* Today's Running Menu Ticker */}
        <RunningMenuTicker />

        {/* 1. Hero Section */}
        <Hero onOpenOrderModal={handleOpenGeneralOrderModal} />

        {/* 2. Keunggulan Section */}
        <Keunggulan />

        {/* Daily Schedule Menu Section */}
        <DailyMenuSection onSelectProduct={handleSelectProduct} />

        {/* 3. Product Menu Section */}
        <MenuSection onSelectProduct={handleSelectProduct} />

        {/* 4. Outlet Finder Section */}
        <OutletSection onSelectProductWithOutlet={handleSelectOutlet} />

        {/* 5. About Saffa Section */}
        <AboutSection />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminView(true)} />

      {/* Floating Call to Action (Instant Back to Top & Quick order trigger) */}
      <FloatingCTA onOpenOrderModal={handleOpenGeneralOrderModal} />

      {/* 2-Click Interactive WhatsApp Order Drawer/Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialProduct={selectedProduct}
        initialOutlet={selectedOutlet}
      />

      {/* Saffa Splash Screen Intro with 3s Countdown & X Skip button */}
      <AnimatePresence>
        {showSplash && (
          <SplashIntro onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
