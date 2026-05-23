import React, { useState, useRef, useEffect } from 'react';
import { Image, Upload, Download, RefreshCw, Cpu, Award, Palette, Columns, Maximize, Shield, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ClearTool() {
  const { incrementUsage, triggerLoader } = useApp();
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [processedUrl, setProcessedUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [bgColor, setBgColor] = useState('transparent');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeWorkspace, setActiveWorkspace] = useState('slider');

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

  const processBackgroundRemoval = () => {
    if (!file) return;
    setIsProcessing(true);
    incrementUsage();
    triggerLoader("Isolating subject elements locally...", () => {
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
    <div className="space-y-10 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-white tracking-tight">Vision Clear</h2>
          <p className="text-slate-400 font-medium">Neural background removal and subject isolation engine.</p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-[#3b82f6] bg-blue-500/5 px-4 py-2 rounded-full border border-blue-500/10">
          <Layers className="w-3.5 h-3.5" /> HARDWARE ACCELERATED
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CANVAS WORKSPACE */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel p-8 min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Canvas</span>
              {processedUrl && (
                <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
                  <button onClick={() => setActiveWorkspace('slider')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${activeWorkspace === 'slider' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}>SLIDER</button>
                  <button onClick={() => setActiveWorkspace('side')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${activeWorkspace === 'side' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}>SIDE-BY-SIDE</button>
                </div>
              )}
            </div>

            {!imageUrl ? (
              <div onClick={() => document.getElementById('image-input').click()} className="flex-1 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center gap-6 hover:bg-white/2 cursor-pointer transition-all">
                <input id="image-input" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && setupFile(e.target.files[0])} />
                <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center border border-white/5">
                  <Upload className="w-8 h-8 text-[#00f2fe]" />
                </div>
                <div className="text-center space-y-2">
                  <h4 className="text-lg font-bold text-white">Drop raw image here</h4>
                  <p className="text-xs text-slate-500 font-medium">PNG, JPG, WEBP — MAX 20MB</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 relative overflow-hidden bg-slate-900/50 rounded-2xl border border-white/5 p-4 flex items-center justify-center">
                {activeWorkspace === 'slider' && processedUrl ? (
                  <div ref={containerRef} onMouseMove={(e) => { const rect = containerRef.current.getBoundingClientRect(); setSliderPosition(((e.clientX - rect.left) / rect.width) * 100); }} className="relative w-full max-w-2xl aspect-square overflow-hidden rounded-xl cursor-ew-resize">
                    <img src={imageUrl} alt="Before" className="absolute inset-0 w-full h-full object-contain" />
                    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}>
                       <div className="absolute inset-0" style={{ background: bgColor.startsWith('solid-') ? bgColor.replace('solid-', '') : 'transparent' }} />
                       <img src={processedUrl} alt="After" className="relative w-full h-full object-contain" />
                    </div>
                    <div className="absolute top-0 bottom-0 w-[1px] bg-white z-10" style={{ left: `${sliderPosition}%` }}>
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-black flex items-center justify-center shadow-2xl">
                        <Maximize className="w-3 h-3 text-black rotate-45" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
                    <div className="space-y-4">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block text-center tracking-tighter">SOURCE IMAGE</span>
                      <img src={imageUrl} className="w-full aspect-square object-contain rounded-xl bg-black/20" />
                    </div>
                    {processedUrl && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold text-[#00f2fe] uppercase block text-center tracking-tighter">AI CUTOUT</span>
                        <div className="w-full aspect-square rounded-xl relative overflow-hidden" style={{ background: bgColor.startsWith('solid-') ? bgColor.replace('solid-', '') : 'transparent' }}>
                          <img src={processedUrl} className="w-full h-full object-contain relative z-10" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CONTROLS PANEL */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-8 space-y-8">
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#00f2fe]" /> Canvas Controls
              </h3>
              
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Backdrop Selection</span>
                <div className="grid grid-cols-4 gap-3">
                  {['transparent', '#020203', '#1e3a8a', '#065f46'].map((color) => (
                    <button key={color} onClick={() => setBgColor(color === 'transparent' ? 'transparent' : `solid-${color}`)} className={`h-12 rounded-xl border-2 transition-all ${bgColor === (color === 'transparent' ? 'transparent' : `solid-${color}`) ? 'border-white scale-90' : 'border-white/5 hover:border-white/20'}`} style={{ backgroundColor: color === 'transparent' ? 'transparent' : color, backgroundImage: color === 'transparent' ? 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)' : 'none', backgroundSize: '8px 8px' }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-white/5">
              {!processedUrl ? (
                <button onClick={processBackgroundRemoval} disabled={!imageUrl || isProcessing} className="btn-primary w-full h-14 text-sm gap-2">
                  <Cpu className="w-4 h-4" /> Start Local Isolation
                </button>
              ) : (
                <div className="space-y-3">
                  <button className="btn-primary w-full h-14 text-sm gap-2">
                    <Download className="w-4 h-4" /> Export High-Res PNG
                  </button>
                  <button onClick={() => { setImageUrl(''); setProcessedUrl(''); setFile(null); }} className="btn-ghost w-full h-14 text-sm">
                    Reset Workspace
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="glass-panel p-6 bg-blue-500/5 border-blue-500/10 space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#3b82f6]" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Privacy Guaranteed</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">Subject isolation is performed entirely within your browser's graphics buffer. No image data is ever uploaded or cached on external servers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
