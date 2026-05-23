import React from 'react';
import { Cpu, HardDrive, CheckCircle, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Loader() {
  const { loaderVisible, loaderProgress, loaderStatus } = useApp();

  if (!loaderVisible) return null;

  return (
    <div className="fixed inset-0 bg-[#020203]/90 backdrop-blur-xl flex items-center justify-center z-[100] fade-in">
      <div className="w-full max-w-md p-12 text-center space-y-8 animate-float">
        
        {/* Animated Icon */}
        <div className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center mx-auto relative shadow-[0_0_50px_rgba(255,255,255,0.1)]">
          <Loader2 className="w-10 h-10 text-black animate-spin" />
          <div className="absolute -inset-2 rounded-[2rem] border border-white/10 animate-pulse" />
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Syncing Neural Engine
          </h3>
          <p className="text-sm text-slate-500 font-medium h-4">
            {loaderStatus || 'Initializing local execution buffer...'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-3 pt-4">
          <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden border border-white/5">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${loaderProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-600 font-black uppercase tracking-widest">
            <span>Buffer Progress</span>
            <span className="text-white">{loaderProgress}%</span>
          </div>
        </div>

        {/* Trust Metrics */}
        <div className="pt-8 grid grid-cols-2 gap-4">
           <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1 text-left">
              <p className="text-[9px] font-bold text-slate-500 uppercase">Hardware</p>
              <p className="text-xs font-bold text-white flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-500" /> WebGPU</p>
           </div>
           <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1 text-left">
              <p className="text-[9px] font-bold text-slate-500 uppercase">Network</p>
              <p className="text-xs font-bold text-white flex items-center gap-1.5"><HardDrive className="w-3 h-3 text-[#00f2fe]" /> 0ms Latency</p>
           </div>
        </div>
      </div>
    </div>
  );
}
