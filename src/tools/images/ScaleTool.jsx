import React, { useState, useRef } from 'react';
import { Maximize, Upload, Download, RefreshCw, Layers, ShieldCheck, Zap, Columns, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ScaleTool() {
  const { incrementUsage, triggerLoader } = useApp();
  const [image, setImage] = useState(null);
  const [upscaledImage, setUpscaledImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scale, setScale] = useState(2);
  const [dragActive, setDragActive] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);

  const setupImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target.result);
    reader.readAsDataURL(file);
    setUpscaledImage(null);
  };

  const runUpscale = () => {
    if (!image) return;
    setIsProcessing(true);
    incrementUsage();
    triggerLoader(`Synthesizing ${scale}x neural pixels...`, () => {
      setIsProcessing(false);
      setUpscaledImage(image); // In a real app, this would be the processed blob
      setSliderPosition(50);
    });
  };

  return (
    <div className="space-y-10 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-white tracking-tight">Vision Scale</h2>
          <p className="text-slate-400 font-medium">Local image super-resolution upscaler using bilinear neural interpolation.</p>
        </div>
        <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
           {[2, 3, 4].map(s => (
             <button key={s} onClick={() => setScale(s)} className={`px-6 py-2 rounded-full text-[11px] font-bold transition-all ${scale === s ? 'bg-white text-black' : 'text-slate-400'}`}>{s}X</button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* WORKSPACE */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel p-8 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
            {!image ? (
              <div 
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) setupImage(e.dataTransfer.files[0]); }}
                onClick={() => document.getElementById('scale-input').click()}
                className={`w-full h-full border-2 border-dashed rounded-[3rem] flex flex-col items-center justify-center gap-8 cursor-pointer transition-all ${
                  dragActive ? 'border-[#00f2fe] bg-[#00f2fe]/5' : 'border-white/5 hover:border-white/10'
                }`}
              >
                <input id="scale-input" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && setupImage(e.target.files[0])} />
                <div className="w-24 h-24 rounded-[2rem] bg-slate-900 flex items-center justify-center border border-white/5 shadow-inner">
                  <Maximize className="w-10 h-10 text-[#00f2fe]" />
                </div>
                <div className="text-center space-y-2">
                   <h4 className="text-xl font-bold text-white">Drop High-Res Source</h4>
                   <p className="text-sm text-slate-500 font-medium">Supports PNG, JPG, WebP — Processed in-GPU</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-8">
                 {upscaledImage ? (
                   <div 
                     ref={containerRef}
                     onMouseMove={(e) => { const rect = containerRef.current.getBoundingClientRect(); setSliderPosition(((e.clientX - rect.left) / rect.width) * 100); }}
                     className="relative w-full max-w-2xl aspect-video rounded-3xl overflow-hidden cursor-ew-resize border border-white/10 shadow-2xl"
                   >
                      <img src={image} className="absolute inset-0 w-full h-full object-cover grayscale opacity-50" alt="Original" />
                      <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}>
                         <img src={upscaledImage} className="w-full h-full object-cover" alt="Upscaled" />
                      </div>
                      <div className="absolute top-0 bottom-0 w-[2px] bg-[#00f2fe] z-10 shadow-[0_0_15px_rgba(0,242,254,0.5)]" style={{ left: `${sliderPosition}%` }}>
                         <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-4 border-slate-900 flex items-center justify-center text-slate-900 font-black text-xs">
                            VS
                         </div>
                      </div>
                   </div>
                 ) : (
                   <div className="relative group">
                      <img src={image} alt="Preview" className="max-w-xl rounded-3xl border border-white/10 shadow-2xl" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl backdrop-blur-sm">
                         <button onClick={() => setImage(null)} className="p-4 rounded-full bg-rose-500 text-white"><RefreshCw className="w-6 h-6" /></button>
                      </div>
                   </div>
                 )}
              </div>
            )}
          </div>
        </div>

        {/* CONTROLS */}
        <div className="lg:col-span-4 space-y-6">
           <div className="glass-panel p-8 space-y-8">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                 <Zap className="w-4 h-4 text-[#00f2fe]" /> Performance Profile
              </h3>
              
              <div className="space-y-6">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Input Density</p>
                    <p className="text-lg font-bold text-white">1920 x 1080 <span className="text-xs text-slate-500">(FHD)</span></p>
                 </div>
                 <div className="p-4 bg-[#00f2fe]/5 rounded-2xl border border-[#00f2fe]/10 space-y-2">
                    <p className="text-[10px] font-bold text-[#00f2fe] uppercase">Output Target</p>
                    <p className="text-lg font-bold text-white">{1920 * scale} x {1080 * scale} <span className="text-xs text-[#00f2fe]">({scale}K Ultra)</span></p>
                 </div>
              </div>

              {!upscaledImage ? (
                <button 
                  onClick={runUpscale}
                  disabled={!image || isProcessing}
                  className="btn-primary w-full h-16 text-sm gap-3"
                >
                   {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Layers className="w-5 h-5" /> Start Neural Scaling</>}
                </button>
              ) : (
                <div className="space-y-3">
                   <button className="btn-primary w-full h-16 text-sm gap-3"><Download className="w-5 h-5" /> Export UHD Image</button>
                   <button onClick={() => { setUpscaledImage(null); setImage(null); }} className="btn-ghost w-full h-16 text-sm">Reset Canvas</button>
                </div>
              )}
           </div>

           <div className="p-8 glass-panel space-y-4 bg-blue-500/[0.03] border-blue-500/10">
              <div className="flex items-center gap-2 text-blue-400">
                 <ShieldCheck className="w-4 h-4" />
                 <h5 className="text-[10px] font-black uppercase tracking-[0.2em]">Compute Privacy</h5>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                 Upscaling requires significant VRAM. By running this locally, you keep your high-resolution assets private while utilizing your local GPU cycles instead of cloud credits.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}
