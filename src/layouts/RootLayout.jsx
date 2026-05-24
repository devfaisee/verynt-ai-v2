import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Loader from '../components/Loader';
import PricingModal from '../components/PricingModal';
import RouteErrorBoundary from '../components/RouteErrorBoundary';
import { motion } from 'framer-motion';

export default function RootLayout() {
  return (
    <div className="min-h-screen relative selection:bg-white selection:text-black">
      {/* Editorial Background Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Floating Dynamic Navigation */}
      <Navigation />

      {/* Primary Studio Content */}
      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 pt-28 md:pt-36 pb-20 md:pb-24"
      >
        <div className="studio-container">
          <RouteErrorBoundary>
            <Outlet />
          </RouteErrorBoundary>
        </div>
      </motion.main>

      {/* Global Context Elements */}
      <Loader />
      <PricingModal />

      {/* Minimal Responsive Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 md:py-16">
        <div className="studio-container flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
             </div>
             <p className="text-[10px] md:text-xs font-semibold text-slate-500 tracking-[0.2em] uppercase">Compute Nodes Online</p>
          </div>
          <div className="text-[9px] md:text-[10px] font-black text-slate-700 tracking-[0.3em] uppercase text-center md:text-right">
            © 2026 Verynt Studio • Precision Local Intelligence
          </div>
        </div>
      </footer>
    </div>
  );
}
