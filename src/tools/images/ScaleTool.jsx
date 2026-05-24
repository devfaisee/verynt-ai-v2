import React, { useState, useRef } from 'react';
import { Maximize, Upload, Download, RefreshCw, Layers, ShieldCheck, Zap, Columns, Image as ImageIcon, MoveHorizontal } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

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
      setUpscaledImage(image); // Simulating processed blob
      setSliderPosition(50);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
      
      {/* Studio Controls (Left) */}
      <div className="lg:col-span-4 space-y-8 md:space-y-10">
         <div className="space-y-4">
            <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Resolution Profile</h3>
            <div className="glass-card p-8 space-y-8">
               <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center">Upscale Factor</p>
                  <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5">
                     {[2, 3, 4].map(s => (
                       <button 
                         key={s} 
                         onClick={() => setScale(s)} 
                         className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${scale === s ? 'bg-white text-black shadow-2xl' : 'text-slate-500 hover:text-white'}`}
                       >
                         {s}X
                       </button>
                     ))}
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                     <span className="text-[10px] font-bold text-slate-500 uppercase">Target Density</span>
                     <span className="text-xs font-black text-white">{scale === 2 ? '2K' : scale === 3 ? '4K' : '8K'} ULTRA</span>
                  </div>
                  <button onClick={runUpscale} disabled={!image || isProcessing} className="pill-button pill-button-primary w-full h-14 uppercase tracking-[0.1em]">Execute Scaling</button>
                  <button onClick={() => {setImage(null); setUpscaledImage(null);}} className="pill-button pill-button-ghost w-full h-14 uppercase tracking-[0.1em]">Flush Source</button>
               </div>
            </div>
         </div>

         <div className="p-8 bg-[#ffd60a]/5 border border-[#ffd60a]/10 rounded-[32px] space-y-4">
            <div className="flex items-center gap-3 text-[#ffd60a]">
               <Zap className="w-5 h-5" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Synthesis</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Resolution enhancement is performed via local bilinear interpolation buffers. No pixel data is serialized or transmitted externally.</p>
         </div>
      </div>

      {/* Studio Canvas (Right) */}
      <div className="lg:col-span-8 h-full min-h-[600px]">
         <div className="h-full flex flex-col bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden relative flex items-center justify-center p-12">
            {!image ? (
              <motion.div 
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) setupImage(e.dataTransfer.files[0]); }}
                onClick={() => document.getElementById('scale-input').click()}
                whileHover={{ scale: 1.01 }}
                className={`w-full h-full border-2 border-dashed rounded-[48px] flex flex-col items-center justify-center gap-8 cursor-pointer transition-all ${
                  dragActive ? 'border-white bg-white/5' : 'border-white/5 hover:border-white/10'
                }`}
              >
                <input id="scale-input" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && setupImage(e.target.files[0])} />
                <div className="w-24 h-24 rounded-[2rem] bg-white flex items-center justify-center shadow-2xl">
                   <Maximize className="w-10 h-10 text-black" />
                </div>
                <div className="text-center">
                   <p className="text-xl font-bold text-white">Ingest Raw Assets</p>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">PNG, JPG, WEBP</p>
                </div>
              </motion.div>
            ) : (
              <div className="w-full h-full relative group flex items-center justify-center">
                 {upscaledImage ? (
                    <div 
                      ref={containerRef} 
                      onMouseMove={(e) => { const rect = containerRef.current.getBoundingClientRect(); setSliderPosition(((e.clientX - rect.left) / rect.width) * 100); }} 
                      className="relative w-full max-w-2xl aspect-video rounded-[32px] overflow-hidden cursor-ew-resize border border-white/10 shadow-2xl shadow-black/50"
                    >
                       <img src={image} className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale" alt="Original" />
                       <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}>
                          <img src={upscaledImage} className="w-full h-full object-cover" alt="Upscaled" />
                       </div>
                       <div className="absolute top-0 bottom-0 w-[2px] bg-white z-10 shadow-[0_0_20px_rgba(255,255,255,0.5)]" style={{ left: `${sliderPosition}%` }}>
                          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-2xl border-4 border-slate-900">
                             <MoveHorizontal className="w-5 h-5 text-black" />
                          </div>
                       </div>
                    </div>
                 ) : (
                    <motion.img initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} src={image} alt="Preview" className="max-w-2xl rounded-[32px] border border-white/10 shadow-2xl" />
                 )}
                 <AnimatePresence>
                   {upscaledImage && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-[-20px] left-1/2 -translate-x-1/2">
                        <button className="pill-button pill-button-primary h-14 gap-3 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                           <Download className="w-5 h-5" /> Export Neural Master
                        </button>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
            )}
         </div>
      </div>

    </div>
  );
}
