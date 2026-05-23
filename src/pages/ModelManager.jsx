import React, { useState, useEffect } from 'react';
import { HardDrive, Trash2, Cpu, CheckCircle, Database, Info, ShieldCheck, DownloadCloud } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModelManager() {
  const [cachedModels, setCachedModels] = useState([
    { id: 'whisper-tiny', name: 'Whisper Tiny (English)', size: '75 MB', category: 'Audio', loaded: true },
    { id: 'bria-rmbg', name: 'Vision Clear Engine', size: '42 MB', category: 'Vision', loaded: true },
    { id: 'tesseract-eng', name: 'OCR Language Pack (ENG)', size: '12 MB', category: 'Vision', loaded: true },
    { id: 'llama-3-8b', name: 'DocuChat Neural Weights', size: '1.2 GB', category: 'Logic', loaded: false },
  ]);

  const clearCache = (id) => {
    setCachedModels(prev => prev.map(m => m.id === id ? { ...m, loaded: false } : m));
  };

  const totalSize = "129 MB";

  return (
    <div className="space-y-12 animate-in">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-12">
          <div className="space-y-2">
             <h1 className="text-5xl font-black text-white tracking-tighter">Engine Manager</h1>
             <p className="text-slate-500 font-medium text-lg">Manage local neural weights and hardware acceleration buffers.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="glass-card px-6 py-3 flex items-center gap-3">
                <Database className="w-4 h-4 text-[#00f2fe]" />
                <span className="text-sm font-bold text-white uppercase tracking-widest">{totalSize} <span className="text-slate-500">Cached</span></span>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Active Registry */}
          <div className="lg:col-span-8 space-y-8">
             <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Local Registry</h3>
             <div className="space-y-4">
                {cachedModels.map((model) => (
                  <div key={model.id} className="glass-card p-8 flex items-center justify-between group">
                     <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${model.loaded ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-white/5 border-white/10 text-slate-600'}`}>
                           {model.loaded ? <CheckCircle className="w-6 h-6" /> : <DownloadCloud className="w-6 h-6" />}
                        </div>
                        <div className="space-y-1">
                           <h4 className="text-lg font-bold text-white tracking-tight">{model.name}</h4>
                           <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                              <span>{model.category}</span>
                              <div className="w-1 h-1 rounded-full bg-slate-800" />
                              <span>{model.size}</span>
                           </div>
                        </div>
                     </div>
                     
                     {model.loaded ? (
                        <button 
                          onClick={() => clearCache(model.id)}
                          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                     ) : (
                        <button className="text-[10px] font-black text-[#00f2fe] uppercase tracking-widest px-4 py-2 bg-[#00f2fe]/10 rounded-lg border border-[#00f2fe]/20">Initialize</button>
                     )}
                  </div>
                ))}
             </div>
          </div>

          {/* Hardware Telemetry */}
          <div className="lg:col-span-4 space-y-10">
             <div className="glass-card p-10 space-y-8 bg-gradient-to-br from-white/[0.02] to-transparent">
                <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                   <Cpu className="w-4 h-4 text-[#00f2fe]" /> Hardware Path
                </h3>
                
                <div className="space-y-6">
                   <TelemetryItem label="Primary Compute" value="WebGPU (Experimental)" sub="Physical GPU Access" color="#00f2fe" />
                   <TelemetryItem label="Memory Buffer" value="V8 Isolate" sub="64-bit Sandbox" color="#bf5af2" />
                   <TelemetryItem label="Cache Interface" value="IndexedDB v2" sub="Persistent Local Storage" color="#64d2ff" />
                </div>

                <div className="pt-8 border-t border-white/5">
                   <button className="pill-button pill-button-ghost w-full h-14 text-[10px] uppercase tracking-widest">Flush Global Cache</button>
                </div>
             </div>

             <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-4">
                <div className="flex items-center gap-3 text-slate-400">
                   <ShieldCheck className="w-5 h-5 text-emerald-500" />
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Compute Integrity</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Models are stored in your browser's private Cache Storage. Verynt never transmits model weights over the wire after the initial download.</p>
             </div>
          </div>
       </div>
    </div>
  );
}

function TelemetryItem({ label, value, sub, color }) {
  return (
    <div className="space-y-1.5 text-left">
       <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{label}</p>
       <p className="text-base font-bold text-white flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          {value}
       </p>
       <p className="text-[10px] text-slate-500 font-medium">{sub}</p>
    </div>
  );
}
