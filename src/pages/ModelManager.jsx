import React, { useState, useEffect } from 'react';
import { HardDrive, Trash2, Cpu, CheckCircle, Database, Info, ShieldCheck, DownloadCloud } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModelManager() {
  const [cachedModels, setCachedModels] = useState([
    { id: 'whisper-tiny', name: 'Whisper Tiny', size: '75 MB', category: 'Audio', loaded: true },
    { id: 'bria-rmbg', name: 'Vision Engine', size: '42 MB', category: 'Vision', loaded: true },
    { id: 'tesseract-eng', name: 'OCR Pack', size: '12 MB', category: 'Vision', loaded: true },
    { id: 'llama-3-8b', name: 'DocuChat Weights', size: '1.2 GB', category: 'Logic', loaded: false },
  ]);

  const clearCache = (id) => {
    setCachedModels(prev => prev.map(m => m.id === id ? { ...m, loaded: false } : m));
  };

  const totalSize = "129 MB";

  return (
    <div className="space-y-12 animate-in pb-20 px-2 sm:px-4">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
          <div className="space-y-3">
             <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tighter">Engine Registry</h1>
             <p className="text-lg sm:text-xl text-slate-500 font-medium max-w-xl">Manage local neural weights and hardware acceleration buffers.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="glass-card px-6 py-4 flex items-center gap-4">
                <Database className="w-5 h-5 text-[#00f2fe]" />
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Local Footprint</span>
                   <span className="text-lg font-black text-white tracking-tight">{totalSize}</span>
                </div>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
          
          {/* Active Registry */}
          <div className="lg:col-span-8 space-y-8">
             <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Active Node Registry</h3>
             <div className="space-y-4">
                {cachedModels.map((model) => (
                  <div key={model.id} className="glass-card p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 group">
                     <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all shrink-0 ${model.loaded ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'bg-white/5 border-white/10 text-slate-600'}`}>
                           {model.loaded ? <CheckCircle className="w-7 h-7" /> : <DownloadCloud className="w-7 h-7" />}
                        </div>
                        <div className="space-y-1.5">
                           <h4 className="text-xl font-bold text-white tracking-tight leading-tight">{model.name}</h4>
                           <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                              <span>{model.category}</span>
                              <div className="w-1 h-1 rounded-full bg-slate-800" />
                              <span className="text-white">{model.size}</span>
                           </div>
                        </div>
                     </div>
                     
                     <div className="w-full sm:w-auto flex items-center gap-4">
                        {model.loaded ? (
                           <>
                             <div className="hidden sm:block px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest">Cached</div>
                             <button 
                               onClick={() => clearCache(model.id)}
                               className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 transition-all sm:opacity-0 group-hover:opacity-100"
                             >
                                <Trash2 className="w-5 h-5" />
                             </button>
                           </>
                        ) : (
                           <button className="pill-button pill-button-primary h-12 px-8 w-full sm:w-auto text-xs uppercase tracking-widest">Initialize Node</button>
                        )}
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Hardware Telemetry */}
          <div className="lg:col-span-4 space-y-8">
             <div className="glass-card p-10 space-y-10 bg-gradient-to-br from-white/[0.02] to-transparent border-white/10">
                <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                   <Cpu className="w-4 h-4 text-[#00f2fe]" /> Hardware Path
                </h3>
                
                <div className="space-y-8">
                   <TelemetryItem label="Primary Compute" value="WebGPU" sub="Hardware accelerated via physical GPU" color="#00f2fe" />
                   <TelemetryItem label="Memory Buffer" value="V8 Isolate" sub="64-bit Secure Browser Sandbox" color="#bf5af2" />
                   <TelemetryItem label="Cache Store" value="IndexedDB" sub="Persistent Local Weight Registry" color="#64d2ff" />
                </div>

                <div className="pt-10 border-t border-white/5">
                   <button className="pill-button pill-button-ghost w-full h-14 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-500/5 hover:text-rose-500 hover:border-rose-500/10">Flush Global Registry</button>
                </div>
             </div>

             <div className="p-10 bg-[#30d158]/5 border border-[#30d158]/10 rounded-[40px] space-y-6">
                <div className="flex items-center gap-3 text-[#30d158]">
                   <ShieldCheck className="w-6 h-6" />
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Integrity Pass</h4>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">Weights are encrypted at rest within your browser's private V8 isolation layer. No telemetry is transmitted to Verynt or 3rd-party nodes.</p>
             </div>
          </div>
       </div>
    </div>
  );
}

function TelemetryItem({ label, value, sub, color }) {
  return (
    <div className="space-y-2 text-left">
       <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">{label}</p>
       <div className="space-y-1">
          <p className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
             <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
             {value}
          </p>
          <p className="text-xs text-slate-500 font-medium leading-tight">{sub}</p>
       </div>
    </div>
  );
}
