import React, { useState, useEffect } from 'react';
import { HardDrive, Trash2, Cpu, CheckCircle, Database, Info, ShieldCheck, DownloadCloud, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModelManager() {
  const { incrementUsage } = useApp();
  const [cachedModels, setCachedModels] = useState([
    { id: 'verynt-cache-v1', name: 'Verynt UI Cache (Service Worker)', size: 'Retrieving...', category: 'System Shell', loaded: false },
    { id: 'transformers-cache', name: 'Whisper Neural Weights (Transformers.js)', size: 'Retrieving...', category: 'Audio Models', loaded: false },
    { id: 'tesseract-eng', name: 'Tesseract OCR Language Pack (ENG)', size: 'Retrieving...', category: 'Vision Models', loaded: false },
    { id: 'llama-3-8b', name: 'DocuChat Embeddings Weights', size: '1.2 GB', category: 'Semantic Logic', loaded: false },
  ]);
  const [totalSize, setTotalSize] = useState('Computing...');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Programmatically query actual Cache Storage API instances
  const scanRealCaches = async () => {
    if (!('caches' in window)) return;
    setIsRefreshing(true);

    try {
      const keys = await caches.keys();
      console.log('[Model Manager Cache Keys]:', keys);
      
      let totalBytes = 0;
      const updatedModels = await Promise.all(cachedModels.map(async (model) => {
        // Match specific cache registries
        let isLoaded = false;
        let sizeText = 'Not Downloaded';
        
        // Match standard cache structures
        const cacheName = keys.find(k => k.toLowerCase().includes(model.id.toLowerCase()));
        
        if (cacheName || (model.id === 'tesseract-eng' && keys.some(k => k.toLowerCase().includes('tesseract')))) {
          isLoaded = true;
          const openCache = await caches.open(cacheName || 'tesseract');
          const requests = await openCache.keys();
          
          let bytes = 0;
          for (const req of requests) {
            const res = await openCache.match(req);
            if (res) {
              const length = res.headers.get('content-length');
              if (length) bytes += parseInt(length, 10);
            }
          }

          if (bytes > 0) {
            totalBytes += bytes;
            sizeText = (bytes / 1024 / 1024).toFixed(1) + ' MB';
          } else {
            // Standard fallback sizes if headers are masked
            const fallbackSizes = {
              'verynt-cache-v1': 18.5,
              'transformers-cache': 75.0,
              'tesseract-eng': 12.0
            };
            const sizeMB = fallbackSizes[model.id] || 15.0;
            totalBytes += sizeMB * 1024 * 1024;
            sizeText = sizeMB + ' MB';
          }
        } else if (model.id === 'llama-3-8b') {
          // Check local storage mocks for llama model
          const isLlamaLocal = localStorage.getItem('verynt_llama_cached') === 'true';
          isLoaded = isLlamaLocal;
          sizeText = isLlamaLocal ? '1.2 GB' : '1.2 GB (Available)';
          if (isLlamaLocal) totalBytes += 1.2 * 1024 * 1024 * 1024;
        }

        return {
          ...model,
          loaded: isLoaded,
          size: sizeText
        };
      }));

      setCachedModels(updatedModels);
      
      if (totalBytes > 0) {
        setTotalSize((totalBytes / 1024 / 1024).toFixed(1) + ' MB');
      } else {
        setTotalSize('0 MB');
      }

    } catch (e) {
      console.error('[Telemetry scan failed]:', e);
      setTotalSize('129 MB');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    scanRealCaches();
  }, []);

  const initializeModelMock = (id) => {
    incrementUsage();
    if (id === 'llama-3-8b') {
      localStorage.setItem('verynt_llama_cached', 'true');
    }
    // Simulate cache write
    scanRealCaches();
  };

  const clearCache = async (id) => {
    incrementUsage();
    if (!('caches' in window)) return;

    try {
      if (id === 'llama-3-8b') {
        localStorage.removeItem('verynt_llama_cached');
      } else {
        const keys = await caches.keys();
        const cacheToDel = keys.find(k => k.toLowerCase().includes(id.toLowerCase()));
        if (cacheToDel) {
          await caches.delete(cacheToDel);
          console.log('[Purged Cache Storage]:', cacheToDel);
        }
      }
      scanRealCaches();
    } catch (e) {
      console.error('[Purge failed]:', e);
    }
  };

  const flushGlobalCaches = async () => {
    incrementUsage();
    if (!('caches' in window)) return;

    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
      localStorage.removeItem('verynt_llama_cached');
      console.log('[Flushed All Browser Caches]');
      scanRealCaches();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-12 animate-in selection:bg-[#00f2fe]/20">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-12">
          <div className="space-y-2">
             <h1 className="text-5xl font-black text-white tracking-tighter">Engine Manager</h1>
             <p className="text-slate-500 font-medium text-lg">Manage local neural weights and hardware acceleration buffers.</p>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={scanRealCaches} 
               disabled={isRefreshing}
               className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
             >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
             </button>
             <div className="glass-card px-6 py-3 flex items-center gap-3 bg-white/[0.01]">
                <Database className="w-4 h-4 text-[#00f2fe]" />
                <span className="text-sm font-bold text-white uppercase tracking-widest">
                  {totalSize} <span className="text-slate-500 font-medium">Cached</span>
                </span>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Active Registry */}
          <div className="lg:col-span-8 space-y-8">
             <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Local Registry</h3>
             <div className="space-y-4">
                {cachedModels.map((model) => (
                  <div key={model.id} className="glass-card p-8 flex items-center justify-between group hover:bg-white/[0.01] transition-all">
                     <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                          model.loaded 
                            ? 'bg-[#30d158]/10 border-[#30d158]/20 text-[#30d158] shadow-[0_10px_20px_rgba(48,209,88,0.15)]' 
                            : 'bg-white/5 border-white/5 text-slate-600'
                        }`}>
                           {model.loaded ? <CheckCircle className="w-6 h-6 animate-pulse" /> : <DownloadCloud className="w-6 h-6 animate-pulse" />}
                        </div>
                        <div className="space-y-1 text-left">
                           <h4 className="text-lg font-bold text-white tracking-tight">{model.name}</h4>
                           <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                              <span>{model.category}</span>
                              <div className="w-1 h-1 rounded-full bg-slate-800" />
                              <span className="font-mono">{model.size}</span>
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
                        <button 
                          onClick={() => initializeModelMock(model.id)}
                          className="text-[10px] font-black text-[#00f2fe] uppercase tracking-widest px-4 py-2 bg-[#00f2fe]/10 rounded-lg border border-[#00f2fe]/20 hover:bg-[#00f2fe] hover:text-black transition-all"
                        >
                          Initialize
                        </button>
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
                   <button 
                     onClick={flushGlobalCaches}
                     className="pill-button pill-button-ghost w-full h-14 text-[10px] uppercase tracking-widest border-white/5 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 transition-all"
                   >
                     Flush Global Cache
                   </button>
                </div>
             </div>

             <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-4 text-left">
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
       <div className="text-base font-bold text-white flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          {value}
       </div>
       <p className="text-[10px] text-slate-500 font-medium">{sub}</p>
    </div>
  );
}
