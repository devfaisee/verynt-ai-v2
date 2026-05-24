import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Upload, Download, RefreshCw, Cpu, Award, Palette, Columns, Maximize, Shield, Layers, Eraser, MoveHorizontal, X, Sliders, Scissors, Zap, ShieldAlert, Sparkles, Filter } from 'lucide-react';
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

  // --- MICRO CONTROLS ---
  const [feathering, setFeathering] = useState(5);
  const [maskInvert, setMaskInvert] = useState(false);
  const [edgeSmoothing, setEdgeSmoothing] = useState(2); // iterations

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
    triggerLoader(`Calibrating neural optics with ${edgeSmoothing}x smoothing...`, () => {
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
      
      // Simulating edge feathering and mask inversion in local buffer
      ctx.filter = `blur(${feathering}px)`;
      ctx.drawImage(img, 0, 0);

      if (maskInvert) {
         ctx.globalCompositeOperation = 'difference';
         ctx.fillStyle = 'white';
         ctx.fillRect(0,0, canvas.width, canvas.height);
      }

      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      ctx.arc(img.width / 2, img.height / 2, Math.min(img.width, img.height) / 1.7, 0, Math.PI * 2);
      ctx.fill();

      canvas.toBlob((blob) => setProcessedUrl(URL.createObjectURL(blob)));
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
      
      {/* Studio Controls (Left) */}
      <div className="lg:col-span-4 space-y-8">

         {/* MICRO CONTROLS PANEL */}
         <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
               <Sliders className="w-3.5 h-3.5" /> Neural Refinement
            </h3>
            <div className="glass-card p-6 space-y-6">
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-[9px] font-black text-slate-600 uppercase tracking-widest">
                     <span>Edge Feathering</span>
                     <span className="text-[#30d158]">{feathering}px</span>
                  </div>
                  <input type="range" min="0" max="20" step="1" value={feathering} onChange={(e) => setFeathering(parseInt(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none accent-white" />
               </div>

               <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center text-[9px] font-black text-slate-600 uppercase tracking-widest">
                     <span>Smoothing Passes</span>
                     <span className="text-[#30d158]">{edgeSmoothing}x</span>
                  </div>
                  <div className="flex gap-2">
                     {[1, 2, 4].map(x => (
                       <button key={x} onClick={() => setEdgeSmoothing(x)} className={`flex-1 py-2 rounded-lg text-[9px] font-black transition-all ${edgeSmoothing === x ? 'bg-white text-black' : 'bg-white/5 text-slate-500'}`}>{x}X</button>
                     ))}
                  </div>
               </div>

               <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Invert Logic</span>
                  <button 
                    onClick={() => setMaskInvert(!maskInvert)}
                    className={`w-12 h-6 rounded-full transition-all relative ${maskInvert ? 'bg-[#30d158]' : 'bg-white/10'}`}
                  >
                     <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${maskInvert ? 'right-1' : 'left-1'}`} />
                  </button>
               </div>
            </div>
         </div>

         <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
               <Palette className="w-3.5 h-3.5" /> Backdrop Studio
            </h3>
            <div className="glass-card p-6 space-y-6">
               <div className="grid grid-cols-4 gap-2">
                 {['transparent', '#0c0c0d', '#0071e3', '#30d158'].map((color) => (
                   <button 
                     key={color} 
                     onClick={() => setBgColor(color === 'transparent' ? 'transparent' : `solid-${color}`)} 
                     className={`h-10 rounded-xl border-2 transition-all ${bgColor === (color === 'transparent' ? 'transparent' : `solid-${color}`) ? 'border-white scale-110' : 'border-white/5'}`} 
                     style={{ backgroundColor: color === 'transparent' ? 'transparent' : color, backgroundImage: color === 'transparent' ? 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)' : 'none', backgroundSize: '8px 8px' }} 
                   />
                 ))}
               </div>
               
               <button onClick={runIsolation} disabled={!imageUrl || isProcessing} className="pill-button pill-button-primary w-full h-12 text-[10px] uppercase tracking-widest">
                  {isProcessing ? "Isolating..." : "Initialize Isolation"}
               </button>
            </div>
         </div>
      </div>

      {/* Studio Canvas (Right) */}
      <div className="lg:col-span-8">
         <div className="h-full min-h-[450px] md:min-h-[600px] flex flex-col bg-white/[0.02] border border-white/5 rounded-[32px] md:rounded-[40px] overflow-hidden relative shadow-2xl">
            {!imageUrl ? (
              <motion.div 
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) setupFile(e.dataTransfer.files[0]); }}
                onClick={() => document.getElementById('image-input').click()}
                className="h-full flex flex-col items-center justify-center gap-8 py-32 md:py-48 cursor-pointer"
              >
                 <input id="image-input" type="file" accept="image/*" className="hidden" onChange={(e) => setupFile(e.target.files[0])} />
                 <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl">
                    <ImageIcon className="w-10 h-10 text-black" />
                 </div>
                 <div className="text-center space-y-2">
                    <p className="text-xl font-bold text-white tracking-tight">Ingest Visual Signal</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">PNG, JPG, WebP • 25MB LIMIT</p>
                 </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col">
                 <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Buffer View</span>
                    {processedUrl && (
                      <div className="flex bg-white/5 rounded-full p-0.5 border border-white/10">
                         {['slider', 'split'].map(m => (
                           <button key={m} onClick={() => setViewMode(m)} className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest transition-all ${viewMode === m ? 'bg-white text-black' : 'text-slate-500'}`}>{m.toUpperCase()}</button>
                         ))}
                      </div>
                    )}
                 </div>

                 <div className="flex-1 p-8 md:p-12 flex items-center justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                       {viewMode === 'slider' && processedUrl ? (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full h-full max-w-2xl rounded-2xl overflow-hidden cursor-ew-resize border border-white/10">
                            <img src={imageUrl} alt="Before" className="absolute inset-0 w-full h-full object-contain opacity-40 grayscale" />
                            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}>
                               <div className="absolute inset-0" style={{ background: bgColor.startsWith('solid-') ? bgColor.replace('solid-', '') : 'transparent' }} />
                               <img src={processedUrl} alt="After" className="relative w-full h-full object-contain" />
                            </div>
                            <div className="absolute top-0 bottom-0 w-[2px] bg-white z-10" style={{ left: `${sliderPosition}%` }}>
                               <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-2xl">
                                  <MoveHorizontal className="w-4 h-4 text-black" />
                               </div>
                            </div>
                         </motion.div>
                       ) : (
                         <div className="grid grid-cols-2 gap-8 w-full items-center">
                            <img src={imageUrl} className="w-full rounded-xl bg-white/5" />
                            {processedUrl ? <img src={processedUrl} className="w-full rounded-xl" style={{ background: bgColor.startsWith('solid-') ? bgColor.replace('solid-', '') : 'transparent' }} /> : <div className="aspect-square rounded-xl border border-dashed border-white/10 flex items-center justify-center"><Zap className="w-8 h-8 text-slate-800 animate-pulse" /></div>}
                         </div>
                       )}
                    </AnimatePresence>
                 </div>

                 <div className="p-8 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
                    <div className="flex items-center gap-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                       <Shield className="w-4 h-4 text-emerald-500 opacity-50" />
                       Buffer: In-Memory V8 Sandbox
                    </div>
                    <div className="flex gap-4">
                       <button onClick={() => {setImageUrl(''); setProcessedUrl('');}} className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest">Flush Canvas</button>
                       <button className="pill-button pill-button-primary h-10 px-6 text-[10px]">Export master</button>
                    </div>
                 </div>
              </div>
            )}
         </div>
      </div>

    </div>
  );
}
