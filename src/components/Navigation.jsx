import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Wifi, WifiOff, Sparkles, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navigation() {
  const { isOffline, setIsOffline, setIsPricingOpen, usageCount } = useApp();

  return (
    <nav className="glass-panel w-[calc(100%-2rem)] max-w-7xl mx-auto my-4 p-4 flex items-center justify-between sticky top-4 z-50">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2 cursor-pointer group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f2fe] to-[#9b51e0] flex items-center justify-center shadow-lg shadow-purple-950/40 group-hover:scale-105 transition-transform">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <span className="font-display text-2xl font-bold tracking-tight text-glow">
          verynt
        </span>
      </Link>

      {/* Center - Privacy Assertion Badge */}
      <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-[#00f2fe] bg-cyan-950/30 px-4 py-2 rounded-full border border-cyan-800/30">
        <Sparkles className="w-3.5 h-3.5" />
        100% Client-Side Processing • Your Data Never Leaves Your Device
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Offline Mode Toggle */}
        <button
          onClick={() => setIsOffline(!isOffline)}
          className={`flex items-center gap-2 text-xs font-bold px-4.5 py-2.5 rounded-xl transition-all duration-300 ${
            isOffline 
              ? 'bg-rose-950/40 border border-rose-800/40 text-rose-400' 
              : 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-400'
          }`}
          title="Click to toggle offline mode to prove AI works without internet"
        >
          {isOffline ? (
            <>
              <WifiOff className="w-4 h-4 animate-pulse" />
              <span>OFFLINE DEMO MODE</span>
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4" />
              <span>ONLINE MODE</span>
            </>
          )}
        </button>

        {/* Usage Limiter / Pro CTA */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col items-end text-[10px] text-gray-400">
            <span className="font-medium">Free Quota Usage</span>
            <span className="font-bold text-white">{usageCount} tools run</span>
          </div>
          
          <button 
            onClick={() => setIsPricingOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#9b51e0] to-[#00f2fe] text-white font-display text-xs font-bold px-4 py-2.5 rounded-xl hover:scale-105 transition-transform shadow-lg shadow-purple-900/30"
          >
            <Award className="w-4 h-4" />
            Go Pro
          </button>
        </div>
      </div>
    </nav>
  );
}
