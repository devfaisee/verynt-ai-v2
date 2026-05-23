import React from 'react';
import { Cpu, HardDrive, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Loader() {
  const { loaderVisible, loaderProgress, loaderStatus } = useApp();

  if (!loaderVisible) return null;

  return (
    <div className="fixed inset-0 bg-[#08090d]/80 backdrop-blur-md flex items-center justify-center z-50 fade-in">
      <div className="glass-panel w-full max-w-md p-8 text-center flex flex-col items-center gap-6 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#00f2fe]/20 blur-xl rounded-full"></div>
        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-[#9b51e0]/20 blur-xl rounded-full"></div>

        {/* Animated Icon */}
        <div className="w-16 h-16 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-center relative">
          <Cpu className="w-8 h-8 text-[#00f2fe] animate-spin" style={{ animationDuration: '3s' }} />
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#00f2fe] to-[#9b51e0] opacity-35 blur animate-pulse"></div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold font-display text-white">
            Initializing Local AI Engine
          </h3>
          <p className="text-sm text-gray-400">
            {loaderStatus || 'Compiling model parameters in browser memory...'}
          </p>
        </div>

        {/* Custom Progress Bar */}
        <div className="w-full space-y-2">
          <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800/80">
            <div 
              className="h-full bg-gradient-to-r from-[#00f2fe] to-[#9b51e0] rounded-full transition-all duration-300"
              style={{ width: `${loaderProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-[#9b51e0]" />
              Saved to local cache
            </span>
            <span className="text-white font-bold">{loaderProgress}%</span>
          </div>
        </div>

        {/* Specs Box */}
        <div className="w-full bg-slate-950/40 border border-slate-800/40 rounded-xl p-3 text-xs text-left text-gray-400 space-y-1.5">
          <div className="flex justify-between">
            <span>Hardware Pipeline:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> WebGPU Enabled
            </span>
          </div>
          <div className="flex justify-between">
            <span>Cloud Network Latency:</span>
            <span className="text-[#00f2fe] font-bold">0ms (Local Execution)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
