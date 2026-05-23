import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Wifi, WifiOff, Award, LayoutGrid, Cpu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

export default function Navigation() {
  const { isOffline, setIsOffline, setIsPricingOpen } = useApp();
  const location = useLocation();

  return (
    <div className="fixed top-8 left-0 right-0 z-[100] flex justify-center pointer-events-none">
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-island flex items-center gap-2 pointer-events-auto h-14"
      >
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 px-3 group">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center transition-transform group-hover:scale-110">
            <Shield className="w-4 h-4 text-black" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tighter text-white">verynt</span>
        </Link>

        <div className="h-6 w-[1px] bg-white/10 mx-2" />

        {/* Links */}
        <div className="flex items-center gap-1">
          <NavLink to="/" active={location.pathname === '/'}>
            <LayoutGrid className="w-3.5 h-3.5" /> Explorer
          </NavLink>
          <button 
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black tracking-widest transition-all ${
              isOffline ? 'text-rose-500 bg-rose-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            {isOffline ? 'OFFLINE' : 'LIVE'}
          </button>
        </div>

        <div className="h-6 w-[1px] bg-white/10 mx-2" />

        {/* Action */}
        <button 
          onClick={() => setIsPricingOpen(true)}
          className="flex items-center gap-2 pl-3 pr-2 group h-10 rounded-full"
        >
           <span className="text-[10px] font-black tracking-[0.2em] text-slate-500 group-hover:text-white transition-colors">PRO</span>
           <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white transition-all group-hover:text-black text-white">
              <Award className="w-4 h-4" />
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
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${
        active ? 'text-white bg-white/10' : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      {children}
    </Link>
  );
}
