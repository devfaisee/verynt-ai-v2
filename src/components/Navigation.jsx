import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Wifi, WifiOff, Sparkles, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navigation() {
  const { isOffline, setIsOffline, setIsPricingOpen, usageCount } = useApp();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center transition-transform group-hover:scale-110">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight text-white">
            verynt
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Enterprise</a>
          <a href="#" className="hover:text-white transition-colors">API</a>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2 text-emerald-400">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            V3.0 Live
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          {/* Offline Toggle */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`hidden sm:flex items-center gap-2 text-[11px] font-bold px-4 py-2 rounded-full border transition-all ${
              isOffline 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}
          >
            {isOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
            {isOffline ? 'OFFLINE MODE' : 'ONLINE MODE'}
          </button>

          {/* Pricing CTA */}
          <button 
            onClick={() => setIsPricingOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Award className="w-4 h-4" />
            Upgrade
          </button>
        </div>
      </div>
    </nav>
  );
}
