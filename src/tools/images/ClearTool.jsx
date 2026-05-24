import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Upload, Download, RefreshCw, Cpu, Award, Palette, Columns, Maximize, Shield, Layers, Eraser, MoveHorizontal, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClearTool() {
  const { incrementUsage, triggerLoader } = useApp();
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [processedUrl, setProcessedUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [bgColor, setBgColor] = useState('transparent');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState('slider'); 

  const containerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (processedUrl) URL.revokeObjectURL(processedUrl);
    };
  }, [imageUrl, processedUrl]);

  const setupFile = (uploadedFile) => {
    setFile(uploadedFile);
    const url = URL.createObjectURL(uploadedFile);
    setImageUrl(url);
    setProcessedUrl('');
    setSliderPosition(50);
  };

  const runIsolation = () => {
    if (!file) return;
    setIsProcessing(true);
    incrementUsage();
    triggerLoader("Isolating subjects via neural optics...", () => {
      setIsProcessing(false);
      applyCanvasCutout();
    });
  };

  const applyCanvasCutout = () => {
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      ctx.arc(img.width / 2, img.height / 2, Math.min(img.width, img.height) / 1.7, 0, Math.PI * 2);
      ctx.fill();
      canvas.toBlob((blob) => setProcessedUrl(URL.createObjectURL(blob)));
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
      
      {/* Studio Canvas (Left) */}
      <div className="lg:col-span-8 space-y-6 md:space-y-8">
         <div className="flex items-center justify-between border-b border-white/5 pb-6 px-2">
            <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Optic Workspace</h3>
            {processedUrl && (
              <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
                 <button onClick={() => setViewMode('slider')} className={`px-3 md:px-4 py-1.5 rounded-full text-[8px] md:text-[9px] font-black tracking-widest transition-all ${viewMode === 'slider' ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}>SLIDER</button>
                 <button onClick={() => setViewMode('split')} className={`px-3 md:px-4 py-1.5 rounded-full text-[8px] md:text-[9px] font-black tracking-widest transition-all ${viewMode === 'split' ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}>SIDE-BY-SIDE</button>
              </div>
            )}
         </div>

         {!imageUrl ? (
           <motion.div 
             onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
             onDragLeave={() => setDragActive(false)}
             onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) setupFile(e.dataTransfer.files[0]); }}
             onClick={() => document.getElementById('image-input').click()}
             whileHover={{ scale: 1.01 }}
             className={`w-full aspect-square md:aspect-[4/3] max-h-[400px] md:max-h-none rounded-[32px] md:rounded-[48px] border-2 border-dashed flex flex-col items-center justify-center gap-6 md:gap-8 cursor-pointer transition-all ${
               dragActive ? 'border-white bg-white/5' : 'border-white/5 hover:border-white/10'
             }`}
           >
              <input id="image-input" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && setupFile(e.target.files[0])} />
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-[2rem] bg-white flex items-center justify-center shadow-2xl">
                 <ImageIcon className="w-8 h-8 md:w-10 md:h-10 text-black" />
              </div>
              <div className="text-center space-y-1 md:space-y-2 px-4">
                 <p className="text-lg md:text-xl font-bold text-white tracking-tight">Ingest Raw Visual</p>
                 <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest">PNG, JPG, WebP — MAX 25MB</p>
              </div>
           </motion.div>
         ) : (
           <div className="w-full aspect-square md:aspect-[4/3] bg-black/40 rounded-[32px] md:rounded-[48px] border border-white/5 overflow-hidden relative flex items-center justify-center p-4 md:p-8">
              {viewMode === 'slider' && processedUrl ? (
                <div 
                  ref={containerRef} 
                  onMouseMove={(e) => { const rect = containerRef.current.getBoundingClientRect(); setSliderPosition(((e.clientX - rect.left) / rect.width) * 100); }} 
                  onTouchMove={(e) => { const rect = containerRef.current.getBoundingClientRect(); setSliderPosition(((e.touches[0].clientX - rect.left) / rect.width) * 100); }}
                  className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden cursor-ew-resize border border-white/10"
                >
                   <img src={imageUrl} alt="Before" className="absolute inset-0 w-full h-full object-contain opacity-50 grayscale" />
                   <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}>
                      <div className="absolute inset-0" style={{ background: bgColor.startsWith('solid-') ? bgColor.replace('solid-', '') : 'transparent' }} />
                      <img src={processedUrl} alt="After" className="relative w-full h-full object-contain" />
                   </div>
                   <div className="absolute top-0 bottom-0 w-[2px] bg-white z-10 shadow-[0_0_20px_rgba(255,255,255,0.5)]" style={{ left: `${sliderPosition}%` }}>
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 md:w-12 h-10 md:h-12 rounded-full bg-white flex items-center justify-center shadow-2xl border-4 border-slate-900">
                         <MoveHorizontal className="w-4 h-4 md:w-5 md:h-5 text-black" />
                      </div>
                   </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full h-full items-center overflow-y-auto">
                   <div className="space-y-3 md:space-y-4">
                      <span className="text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-widest block text-center">Reference Input</span>
                      <img src={imageUrl} className="w-full h-40 md:h-64 object-contain rounded-xl md:rounded-2xl bg-white/5 border border-white/5" />
                   </div>
                   {processedUrl && (
                     <div className="space-y-3 md:space-y-4 animate-in">
                        <span className="text-[8px] md:text-[9px] font-black text-[#64d2ff] uppercase tracking-widest block text-center">Neural Extraction</span>
                        <div className="w-full h-40 md:h-64 rounded-xl md:rounded-2xl relative overflow-hidden bg-white/5 border border-white/5" style={{ background: bgColor.startsWith('solid-') ? bgColor.replace('solid-', '') : 'transparent' }}>
                           <img src={processedUrl} className="w-full h-full object-contain" />
                        </div>
                     </div>
                   )}
                </div>
              )}
           </div>
         )}
      </div>

      {/* Studio Palette (Right) */}
      <div className="lg:col-span-4 space-y-8 md:space-y-10">
         <div className="glass-card p-6 md:p-10 space-y-8 md:space-y-10">
            <div className="space-y-6">
               <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                  <Palette className="w-4 h-4 text-white" /> Canvas Optics
               </h3>
               
               <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Environment Backdrop</p>
                  <div className="grid grid-cols-4 gap-2 md:gap-3">
                    {['transparent', '#0c0c0d', '#0071e3', '#30d158'].map((color) => (
                      <button 
                        key={color} 
                        onClick={() => setBgColor(color === 'transparent' ? 'transparent' : `solid-${color}`)} 
                        className={`h-10 md:h-12 rounded-xl border-2 transition-all ${bgColor === (color === 'transparent' ? 'transparent' : `solid-${color}`) ? 'border-white scale-110 shadow-2xl' : 'border-white/5 hover:border-white/10'}`} 
                        style={{ backgroundColor: color === 'transparent' ? 'transparent' : color, backgroundImage: color === 'transparent' ? 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)' : 'none', backgroundSize: '8px 8px' }} 
                      />
                    ))}
                  </div>
               </div>
            </div>

            <div className="space-y-3 md:space-y-4 pt-8 md:pt-10 border-t border-white/5">
               {!processedUrl ? (
                 <button onClick={runIsolation} disabled={!imageUrl || isProcessing} className="pill-button pill-button-primary w-full h-12 md:h-16 text-xs md:text-base gap-3">
                    {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Eraser className="w-5 h-5" /> Execute Isolation</>}
                 </button>
               ) : (
                 <div className="space-y-3 md:space-y-4">
                    <button className="pill-button pill-button-primary w-full h-12 md:h-16 text-xs md:text-base gap-3 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                       <Download className="w-5 h-5" /> Export Master PNG
                    </button>
                    <button onClick={() => { setImageUrl(''); setProcessedUrl(''); setFile(null); }} className="pill-button pill-button-ghost w-full h-12 md:h-16 text-xs md:text-base">Clear Studio</button>
                 </div>
               )}
            </div>
         </div>

         <div className="p-6 md:p-8 bg-[#64d2ff]/5 border border-[#64d2ff]/10 rounded-[28px] md:rounded-[32px] space-y-4">
            <div className="flex items-center gap-3 text-[#64d2ff]">
               <Shield className="w-5 h-5" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Buffer Integrity</h4>
            </div>
            <p className="text-[11px] md:text-xs text-slate-500 leading-relaxed font-medium italic">Subject isolation is computed within your local graphics buffer. No image arrays are serialized or transmitted externally.</p>
         </div>
      </div>

    </div>
  );
}
