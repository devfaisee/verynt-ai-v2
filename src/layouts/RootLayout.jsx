import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Loader from '../components/Loader';
import PricingModal from '../components/PricingModal';

export default function RootLayout() {
  return (
    <div className="min-h-screen selection:bg-[#00f2fe]/30 selection:text-white">
      {/* Premium Background Elements */}
      <div className="site-bg" />
      <div className="grid-overlay" />

      {/* Persistent Navigation */}
      <Navigation />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
        <Outlet />
      </main>

      {/* Global Overlays */}
      <Loader />
      <PricingModal />

      {/* Footer Design */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Systems operational — 100% Client-Side AI
        </div>
        <p>© 2026 Verynt. Built for ultimate privacy.</p>
      </footer>
    </div>
  );
}
