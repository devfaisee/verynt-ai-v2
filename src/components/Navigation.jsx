import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Wifi, WifiOff, Award, LayoutGrid, Cpu, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

export default function Navigation() {
  const { isOffline, setIsOffline, setIsPricingOpen } = useApp();
  const location = useLocation();

  return (
    <div className="fixed top-4 sm:top-8 left-0 right-0 z-[1000] flex justify-center px-4 pointer-events-none">
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-island flex items-center gap-1 sm:gap-2 pointer-events-auto h-12 sm:h-14 max-w-full overflow-hidden"
      >
        {/* Brand - Compact on mobile */}
        <Link to="/" className="flex items-center gap-2 px-2 sm:px-3 group shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-black/20">
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
          </div>
          <span className="font-serif text-lg sm:text-xl font-bold tracking-tighter text-white hidden xs:block">verynt</span>
        </Link>

        <div className="h-6 w-[1px] bg-white/10 mx-1 sm:mx-2 shrink-0" />

        {/* Dynamic Navigation Links */}
        <div className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto no-scrollbar">
          <NavLink to="/" active={location.pathname === '/'}>
            <LayoutGrid className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Explorer</span>
          </NavLink>
          
          <Link 
            to="/tool/model-manager"
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[9px] sm:text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${
              location.pathname.includes('model-manager') ? 'text-white bg-white/10' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Database className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Registry</span>
          </Link>

          <button 
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[9px] sm:text-[10px] font-black tracking-widest transition-all shrink-0 ${
              isOffline ? 'text-rose-500 bg-rose-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isOffline ? <WifiOff className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Wifi className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            <span className="hidden sm:inline">{isOffline ? 'OFFLINE' : 'LIVE'}</span>
          </button>
        </div>

        <div className="h-6 w-[1px] bg-white/10 mx-1 sm:mx-2 shrink-0" />

        {/* Support CTA */}
        <button 
          onClick={() => setIsPricingOpen(true)}
          className="flex items-center gap-2 pl-2 sm:pl-3 pr-1 sm:pr-2 group h-8 sm:h-10 rounded-full shrink-0"
        >
           <span className="text-[9px] sm:text-[10px] font-black tracking-[0.2em] text-slate-500 group-hover:text-white transition-colors hidden xs:block">PRO</span>
           <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white transition-all group-hover:text-black text-white shadow-inner">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
           </div>
        </button>
      </motion.nav>
    </div>
  );
}

function NavLink({ to, children, active }) {
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[9px] sm:text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${
        active ? 'text-white bg-white/10' : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      {children}
    </Link>
  );
}
