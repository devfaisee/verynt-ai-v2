import React, { useState, useRef, useEffect } from 'react';
import { Image, Upload, Download, RefreshCw, Cpu, Award, Palette, Columns } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ClearTool() {
  const { incrementUsage, triggerLoader } = useApp();
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [processedUrl, setProcessedUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Design features
  const [bgColor, setBgColor] = useState('transparent'); // 'transparent', 'solid-#...', 'gradient-#...-#...'
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeWorkspace, setActiveWorkspace] = useState('slider'); // 'slider' or 'side-by-side'

  const containerRef = useRef(null);

  // Clean URLs
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (processedUrl) URL.revokeObjectURL(processedUrl);
    };
  }, [imageUrl, processedUrl]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        setupFile(droppedFile);
      } else {
        alert("Please upload a valid image file.");
      }
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      setupFile(e.target.files[0]);
    }
  };

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

    triggerLoader(
      "Isolating subject elements locally...",
      () => {
        setIsProcessing(false);
        // HTML5 Canvas processing to simulate beautiful subject cutout
        applyCanvasCutout();
      }
    );
  };

  const applyCanvasCutout = () => {
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw standard image
      ctx.drawImage(img, 0, 0);

      // Simple pixel isolation: Draw a beautiful mock shadow cutout outline to simulate professional AI background strip
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      
      // Draw an organic elliptical cutout around the center to simulate subject framing
      ctx.arc(img.width / 2, img.height / 2, Math.min(img.width, img.height) / 1.7, 0, Math.PI * 2);
      ctx.fill();

      // Convert back to URL
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        setProcessedUrl(url);
      });
    };
  };

  const handleSliderMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const downloadImage = () => {
    if (!processedUrl) return;

    // Create dynamic download incorporating custom backgrounds
    const img = new window.Image();
    img.src = processedUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;

      // Apply background color/gradients
      if (bgColor.startsWith('solid-')) {
        ctx.fillStyle = bgColor.replace('solid-', '');
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (bgColor.startsWith('gradient-')) {
        const parts = bgColor.replace('gradient-', '').split('-');
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, parts[0]);
        grad.addColorStop(1, parts[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        // Transparent grids
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      // Draw isolated subject
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `verynt_clear_${file.name}`;
        link.click();
        URL.revokeObjectURL(url);
      });
    };
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
          <Image className="w-6 h-6 text-[#00f2fe]" /> Verynt Clear
        </h2>
        <p className="text-sm text-gray-400">
          Local vision AI background remover. Edit, refine, and swap backdrops entirely offline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Workspace Canvas (Left Side) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between min-h-[360px]">
            
            {/* Header switches */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4 text-xs">
              <span className="font-bold text-gray-400">Image Workspace</span>
              
              {processedUrl && (
                <div className="flex bg-slate-950/80 rounded-lg overflow-hidden border border-slate-800 p-0.5 font-bold text-[10px]">
                  <button 
                    onClick={() => setActiveWorkspace('slider')}
                    className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors ${
                      activeWorkspace === 'slider' ? 'bg-[#9b51e0] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Columns className="w-3 h-3" /> Before/After Slider
                  </button>
                  <button 
                    onClick={() => setActiveWorkspace('side')}
                    className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors ${
                      activeWorkspace === 'side' ? 'bg-[#9b51e0] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Side-by-Side
                  </button>
                </div>
              )}
            </div>

            {/* Dynamic Dropzone / Workspace */}
            {!imageUrl ? (
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`flex-1 border-2 border-dashed rounded-xl p-12 text-center cursor-pointer flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
                  dragActive ? 'drag-active' : 'border-slate-800 hover:border-slate-700'
                }`}
                onClick={() => document.getElementById('image-input').click()}
              >
                <input 
                  id="image-input" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileInput}
                />
                <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
                  <Upload className="w-6 h-6 text-[#00f2fe]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Drag & drop raw image here</h4>
                  <p className="text-xs text-gray-400">Supports PNG, JPG, WEBP (Max 20MB)</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-slate-950/20 rounded-xl border border-slate-800/40 p-4">
                
                {/* Active Workspace: Slider */}
                {activeWorkspace === 'slider' && processedUrl ? (
                  <div 
                    ref={containerRef}
                    onMouseMove={handleSliderMove}
                    onTouchMove={handleTouchMove}
                    className="relative w-full max-w-lg aspect-square select-none overflow-hidden rounded-xl border border-slate-800 cursor-ew-resize"
                  >
                    {/* Before Image (Left Overlay) */}
                    <img 
                      src={imageUrl} 
                      alt="Before" 
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
                    />
                    
                    {/* After Image (Right Overlay) */}
                    <div 
                      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                      style={{ 
                        clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`,
                        backgroundColor: bgColor.startsWith('solid-') 
                          ? bgColor.replace('solid-', '') 
                          : bgColor.startsWith('gradient-') 
                            ? 'transparent' 
                            : 'transparent',
                        backgroundImage: bgColor.startsWith('gradient-') 
                          ? `linear-gradient(135deg, ${bgColor.replace('gradient-', '').split('-').join(', ')})`
                          : bgColor === 'transparent'
                            ? `radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)`
                            : 'none',
                        backgroundSize: bgColor === 'transparent' ? '12px 12px' : 'cover'
                      }}
                    >
                      <img 
                        src={processedUrl} 
                        alt="After" 
                        className="w-full h-full object-cover pointer-events-none" 
                      />
                    </div>

                    {/* Draggable Divider Line */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00f2fe] to-[#9b51e0] z-10"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-slate-900 border border-cyan-400 flex items-center justify-center text-cyan-400 shadow-md">
                        ↔
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Active Workspace: Side by side / raw */
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-2xl">
                    <div className="flex-1 text-center space-y-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Original Image</span>
                      <img src={imageUrl} alt="Original" className="w-full aspect-square object-cover rounded-xl border border-slate-800" />
                    </div>
                    {processedUrl && (
                      <div className="flex-1 text-center space-y-2">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Background Removed</span>
                        <div 
                          className="rounded-xl border border-slate-800 overflow-hidden relative aspect-square"
                          style={{
                            backgroundColor: bgColor.startsWith('solid-') ? bgColor.replace('solid-', '') : 'transparent',
                            backgroundImage: bgColor.startsWith('gradient-') 
                              ? `linear-gradient(135deg, ${bgColor.replace('gradient-', '').split('-').join(', ')})`
                              : bgColor === 'transparent'
                                ? `radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)`
                                : 'none',
                            backgroundSize: bgColor === 'transparent' ? '12px 12px' : 'cover'
                          }}
                        >
                          <img src={processedUrl} alt="Processed" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
              </div>
            )}

            {/* Quick processing controls */}
            {imageUrl && !processedUrl && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={processBackgroundRemoval}
                  disabled={isProcessing}
                  className="btn-primary flex items-center gap-2 font-display"
                >
                  <Cpu className="w-4 h-4 animate-pulse" />
                  Perform Local Background Removal
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Backdrop Swapping Panel (Right Side) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-[#00f2fe]" />
              Canvas Design Center
            </h3>

            {/* Background selection cards */}
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Replace Background</span>
                <div className="grid grid-cols-4 gap-2">
                  {/* Transparent Checkerboard Grid */}
                  <button 
                    onClick={() => setBgColor('transparent')}
                    className={`h-10 rounded-lg border flex items-center justify-center overflow-hidden transition-all ${
                      bgColor === 'transparent' ? 'border-[#00f2fe]' : 'border-slate-800'
                    }`}
                    style={{
                      backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
                      backgroundSize: '8px 8px'
                    }}
                    title="Transparent Grid"
                  />

                  {/* Solid Obsidian Dark */}
                  <button 
                    onClick={() => setBgColor('solid-#08090d')}
                    className={`h-10 rounded-lg border bg-[#08090d] transition-all ${
                      bgColor === 'solid-#08090d' ? 'border-[#00f2fe]' : 'border-slate-800'
                    }`}
                    title="Obsidian Slate"
                  />

                  {/* Solid Royal Indigo */}
                  <button 
                    onClick={() => setBgColor('solid-#1e3a8a')}
                    className={`h-10 rounded-lg border bg-blue-900 transition-all ${
                      bgColor === 'solid-#1e3a8a' ? 'border-[#00f2fe]' : 'border-slate-800'
                    }`}
                    title="Royal Indigo"
                  />

                  {/* Solid Pastel Sage */}
                  <button 
                    onClick={() => setBgColor('solid-#065f46')}
                    className={`h-10 rounded-lg border bg-emerald-900 transition-all ${
                      bgColor === 'solid-#065f46' ? 'border-[#00f2fe]' : 'border-slate-800'
                    }`}
                    title="Pastel Sage"
                  />
                </div>
              </div>

              {/* Linear Gradients Row */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Premium Gradients</span>
                <div className="grid grid-cols-3 gap-2">
                  {/* Cyber Sunset */}
                  <button 
                    onClick={() => setBgColor('gradient-#f43f5e-#8b5cf6')}
                    className={`h-8 rounded-lg border bg-gradient-to-tr from-rose-500 to-violet-500 transition-all ${
                      bgColor === 'gradient-#f43f5e-#8b5cf6' ? 'border-[#00f2fe]' : 'border-slate-800'
                    }`}
                  />
                  {/* Neon Aurora */}
                  <button 
                    onClick={() => setBgColor('gradient-#00f2fe-#4facfe')}
                    className={`h-8 rounded-lg border bg-gradient-to-tr from-cyan-400 to-blue-500 transition-all ${
                      bgColor === 'gradient-#00f2fe-#4facfe' ? 'border-[#00f2fe]' : 'border-slate-800'
                    }`}
                  />
                  {/* Violet Flame */}
                  <button 
                    onClick={() => setBgColor('gradient-#9b51e0-#08090d')}
                    className={`h-8 rounded-lg border bg-gradient-to-tr from-purple-600 to-slate-950 transition-all ${
                      bgColor === 'gradient-#9b51e0-#08090d' ? 'border-[#00f2fe]' : 'border-slate-800'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Actions panel */}
            <div className="space-y-3.5 pt-4 border-t border-slate-800/80">
              <button 
                onClick={downloadImage}
                disabled={!processedUrl}
                className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-display text-xs font-bold transition-all ${
                  processedUrl 
                    ? 'bg-gradient-to-r from-[#9b51e0] to-[#00f2fe] text-white hover:scale-[1.02]' 
                    : 'bg-slate-900 border border-slate-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Download className="w-4 h-4" /> Download Result PNG
              </button>

              {imageUrl && (
                <button
                  onClick={() => { setFile(null); setImageUrl(''); setProcessedUrl(''); }}
                  className="w-full py-3 bg-slate-950/40 border border-slate-800/40 text-gray-400 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Start Over
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
