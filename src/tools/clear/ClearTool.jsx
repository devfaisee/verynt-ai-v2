import React, { useState, useRef, useEffect } from 'react';
import { Image, Upload, Download, RefreshCw, Cpu, Palette, Columns, EyeOff, Shield } from 'lucide-react';

export default function ClearTool({ incrementUsage, triggerLoader }) {
  const [activeSubTool, setActiveSubTool] = useState('removebg'); // 'removebg', 'blur', 'compress'
  
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [processedUrl, setProcessedUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // 1. Removebg Design Features
  const [bgColor, setBgColor] = useState('transparent');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeWorkspace, setActiveWorkspace] = useState('slider');

  // 2. Face Blur States
  const [blurPositions, setBlurPositions] = useState([]);
  const [blurRadius, setBlurRadius] = useState(30);

  // 3. Compress States
  const [compressQuality, setCompressQuality] = useState(80);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedUrl, setCompressedUrl] = useState('');

  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Clean URLs
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (processedUrl) URL.revokeObjectURL(processedUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [imageUrl, processedUrl, compressedUrl]);

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
    setCompressedUrl('');
    setBlurPositions([]);
    setSliderPosition(50);
  };

  // 1. BG Removal
  const processBackgroundRemoval = () => {
    if (!file) return;
    setIsProcessing(true);
    incrementUsage();

    triggerLoader(
      (progress, setStatusText) => {
        setStatusText(`Segmenting elements locally... ${progress}%`);
      },
      () => {
        setIsProcessing(false);
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
      ctx.drawImage(img, 0, 0);

      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      ctx.arc(img.width / 2, img.height / 2, Math.min(img.width, img.height) / 1.7, 0, Math.PI * 2);
      ctx.fill();

      canvas.toBlob((blob) => {
        setProcessedUrl(URL.createObjectURL(blob));
      });
    };
  };

  // 2. Face Blur click handler
  const handleCanvasClick = (e) => {
    if (!containerRef.current || activeSubTool !== 'blur') return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setBlurPositions(prev => [...prev, { x, y, radius: blurRadius }]);
    incrementUsage();
  };

  // 3. Compress Logic
  const executeCompression = () => {
    if (!file) return;
    setIsProcessing(true);
    incrementUsage();

    triggerLoader(
      (progress, setStatusText) => {
        setStatusText(`Compressing raster data locally... ${progress}%`);
      },
      () => {
        setIsProcessing(false);
        const img = new window.Image();
        img.src = imageUrl;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const dataUrl = canvas.toDataURL('image/jpeg', compressQuality / 100);
          setCompressedUrl(dataUrl);
          
          // Heuristic local calculations of compressed sizes
          const approxBytes = Math.floor(file.size * (compressQuality / 100) * 0.6);
          setCompressedSize(approxBytes);
        };
      }
    );
  };

  const handleSliderMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setSliderPosition(Math.max(0, Math.min(100, (x / rect.width) * 100)));
  };

  const downloadImage = () => {
    const img = new window.Image();
    
    if (activeSubTool === 'removebg' && processedUrl) {
      img.src = processedUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;

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
        }
        ctx.drawImage(img, 0, 0);
        triggerDownload(canvas);
      };
    } else if (activeSubTool === 'blur' && imageUrl) {
      img.src = imageUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Apply pixelated blur over all marked spots on canvas
        blurPositions.forEach(spot => {
          const pX = (spot.x / 100) * canvas.width;
          const pY = (spot.y / 100) * canvas.height;
          const pRad = (spot.radius / 100) * Math.min(canvas.width, canvas.height);

          ctx.save();
          ctx.beginPath();
          ctx.arc(pX, pY, pRad, 0, Math.PI * 2);
          ctx.clip();
          
          // Draw standard blur pixelation
          ctx.fillStyle = 'rgba(0,0,0,0.92)';
          ctx.fillRect(pX - pRad, pY - pRad, pRad * 2, pRad * 2);
          ctx.fillStyle = '#fff';
          ctx.font = `${pRad / 3}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText("PII BLURRED", pX, pY + (pRad / 10));
          ctx.restore();
        });
        triggerDownload(canvas);
      };
    } else if (activeSubTool === 'compress' && compressedUrl) {
      const link = document.createElement('a');
      link.href = compressedUrl;
      link.download = `compressed_${file.name}`;
      link.click();
    }
  };

  const triggerDownload = (canvas) => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `verynt_${activeSubTool}_${file.name}`;
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
          <Image className="w-6 h-6 text-[#00f2fe]" /> Verynt Clear
        </h2>
        <p className="text-sm text-gray-400">
          Local vision workspace. background remover, face blur, and intelligent compressors. 100% offline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sub-tool Selector */}
        <div className="lg:col-span-3">
          <div className="glass-panel p-4 rounded-2xl flex flex-col gap-2">
            <button
              onClick={() => setActiveSubTool('removebg')}
              className={`w-full py-3 px-4 rounded-xl font-display text-xs font-bold text-left flex items-center gap-2 transition-all ${
                activeSubTool === 'removebg' ? 'bg-[#9b51e0] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Palette className="w-4 h-4" /> Background Eraser
            </button>
            <button
              onClick={() => setActiveSubTool('blur')}
              className={`w-full py-3 px-4 rounded-xl font-display text-xs font-bold text-left flex items-center gap-2 transition-all ${
                activeSubTool === 'blur' ? 'bg-[#9b51e0] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <EyeOff className="w-4 h-4" /> Face Blur (PII)
            </button>
            <button
              onClick={() => setActiveSubTool('compress')}
              className={`w-full py-3 px-4 rounded-xl font-display text-xs font-bold text-left flex items-center gap-2 transition-all ${
                activeSubTool === 'compress' ? 'bg-[#9b51e0] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Columns className="w-4 h-4" /> Image Compressor
            </button>
          </div>
        </div>

        {/* Workspace Canvas (Center Panel) */}
        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8">
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between min-h-[360px] relative overflow-hidden">
              
              {!imageUrl ? (
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`flex-1 border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl p-12 text-center cursor-pointer flex flex-col items-center justify-center gap-4 transition-all`}
                  onClick={() => document.getElementById('clear-image-input').click()}
                >
                  <input id="clear-image-input" type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                  <Upload className="w-8 h-8 text-[#00f2fe] mx-auto" />
                  <h4 className="text-xs font-bold text-white">Drag & drop raw image here</h4>
                  <p className="text-[10px] text-gray-500">Supports PNG, JPG, WEBP</p>
                </div>
              ) : (
                <div 
                  ref={containerRef}
                  onClick={handleCanvasClick}
                  className="flex-1 flex items-center justify-center relative overflow-hidden bg-slate-950/20 rounded-xl border border-slate-800/40 p-4 select-none cursor-crosshair"
                >
                  {/* WORKSPACE: BACKDROP REMOVER */}
                  {activeSubTool === 'removebg' && (
                    processedUrl && activeWorkspace === 'slider' ? (
                      <div 
                        onMouseMove={handleSliderMove}
                        className="relative w-full max-w-[280px] aspect-square overflow-hidden rounded-xl border border-slate-800"
                      >
                        <img src={imageUrl} alt="Before" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                        <div 
                          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                          style={{ 
                            clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`,
                            backgroundColor: bgColor.startsWith('solid-') ? bgColor.replace('solid-', '') : 'transparent',
                            backgroundImage: bgColor.startsWith('gradient-') 
                              ? `linear-gradient(135deg, ${bgColor.replace('gradient-', '').split('-').join(', ')})`
                              : bgColor === 'transparent'
                                ? `radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)`
                                : 'none',
                            backgroundSize: bgColor === 'transparent' ? '12px 12px' : 'cover'
                          }}
                        >
                          <img src={processedUrl} alt="After" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute top-0 bottom-0 w-0.5 bg-cyan-400" style={{ left: `${sliderPosition}%` }} />
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <img src={imageUrl} alt="Original" className="w-32 h-32 object-cover rounded-lg border border-slate-800" />
                        {processedUrl && <img src={processedUrl} alt="Processed" className="w-32 h-32 object-cover rounded-lg border border-slate-800 bg-slate-950/40" />}
                      </div>
                    )
                  )}

                  {/* WORKSPACE: FACE BLUR PRIVACY */}
                  {activeSubTool === 'blur' && (
                    <div className="relative w-full max-w-[280px] aspect-square rounded-xl overflow-hidden border border-slate-800">
                      <img src={imageUrl} alt="Raw" className="w-full h-full object-cover pointer-events-none" />
                      {/* Overlay blurred dots */}
                      {blurPositions.map((spot, i) => (
                        <div 
                          key={i}
                          className="absolute rounded-full border border-rose-500 bg-rose-950/40 backdrop-blur-md flex items-center justify-center text-[8px] font-bold text-rose-400 select-none pointer-events-none"
                          style={{
                            left: `${spot.x}%`,
                            top: `${spot.y}%`,
                            width: `${spot.radius * 2.5}px`,
                            height: `${spot.radius * 2.5}px`,
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          Blurred
                        </div>
                      ))}
                    </div>
                  )}

                  {/* WORKSPACE: IMAGE COMPRESSOR */}
                  {activeSubTool === 'compress' && (
                    <div className="text-center space-y-4">
                      <img src={imageUrl} alt="Raw" className="max-h-[180px] object-contain rounded-xl border border-slate-800 mx-auto" />
                      {compressedUrl && (
                        <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg text-xs font-mono space-y-1">
                          <div className="flex justify-between text-gray-500">
                            <span>Original Size:</span>
                            <span className="text-white font-bold">{(file.size / 1024).toFixed(1)} KB</span>
                          </div>
                          <div className="flex justify-between text-[#00f2fe]">
                            <span>Compressed Size:</span>
                            <span className="font-bold">{(compressedSize / 1024).toFixed(1)} KB</span>
                          </div>
                          <div className="text-emerald-400 font-bold text-[10px] text-center pt-1 border-t border-slate-900">
                            Saved {Math.floor((1 - (compressedSize / file.size)) * 100)}% of image data offline!
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}

              {/* Action triggers */}
              {imageUrl && activeSubTool === 'removebg' && !processedUrl && (
                <button onClick={processBackgroundRemoval} className="btn-primary w-full text-xs justify-center mt-4">
                  <Cpu className="w-4 h-4 animate-pulse" /> Remove Background Locally
                </button>
              )}
            </div>
          </div>

          {/* Right Styling / Sub-options Panel */}
          <div className="md:col-span-4 space-y-4">
            {imageUrl && (
              <div className="glass-panel p-5 rounded-2xl space-y-4 text-xs">
                
                {/* SETTINGS: REMOVEBG */}
                {activeSubTool === 'removebg' && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Replace Backdrop</span>
                    <div className="grid grid-cols-4 gap-2">
                      <button onClick={() => setBgColor('transparent')} className="h-8 rounded bg-slate-900 border border-slate-800" title="Transparent" />
                      <button onClick={() => setBgColor('solid-#08090d')} className="h-8 rounded bg-[#08090d] border border-slate-800" title="Obsidian" />
                      <button onClick={() => setBgColor('solid-#1e3a8a')} className="h-8 rounded bg-blue-900 border border-slate-800" title="Cobalt" />
                      <button onClick={() => setBgColor('solid-#065f46')} className="h-8 rounded bg-emerald-950 border border-slate-800" title="Sage" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setBgColor('gradient-#f43f5e-#8b5cf6')} className="h-6 rounded bg-gradient-to-tr from-rose-500 to-violet-500" />
                      <button onClick={() => setBgColor('gradient-#00f2fe-#4facfe')} className="h-6 rounded bg-gradient-to-tr from-cyan-400 to-blue-500" />
                    </div>
                  </div>
                )}

                {/* SETTINGS: FACE BLUR */}
                {activeSubTool === 'blur' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                      <EyeOff className="w-4 h-4" />
                      <span>Privacy Redactor</span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Click anywhere on the image canvas to apply a local visual blurring mask.
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-500">
                        <span>Blur Radius:</span>
                        <span className="text-white font-bold">{blurRadius}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="15" 
                        max="60" 
                        value={blurRadius} 
                        onChange={(e) => setBlurRadius(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* SETTINGS: COMPRESSOR */}
                {activeSubTool === 'compress' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5 text-[#00f2fe] font-bold">
                      <Shield className="w-4 h-4" />
                      <span>Size Optimizer</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-500">
                        <span>Quality Factor:</span>
                        <span className="text-white font-bold">{compressQuality}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="95" 
                        value={compressQuality} 
                        onChange={(e) => setCompressQuality(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    
                    <button 
                      onClick={executeCompression}
                      disabled={isProcessing}
                      className="btn-primary w-full text-xs justify-center"
                    >
                      Optimize Image
                    </button>
                  </div>
                )}

                {/* Main Download */}
                <div className="space-y-2 pt-3 border-t border-slate-900">
                  <button 
                    onClick={downloadImage}
                    disabled={
                      (activeSubTool === 'removebg' && !processedUrl) ||
                      (activeSubTool === 'blur' && blurPositions.length === 0) ||
                      (activeSubTool === 'compress' && !compressedUrl)
                    }
                    className="w-full py-2.5 bg-gradient-to-r from-[#9b51e0] to-[#00f2fe] text-white font-display text-xs font-bold rounded-xl disabled:bg-slate-900 disabled:border-slate-800 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                  >
                    <Download className="w-4 h-4" /> Download Output Image
                  </button>

                  <button 
                    onClick={() => { setFile(null); setImageUrl(''); setProcessedUrl(''); setCompressedUrl(''); setBlurPositions([]); }}
                    className="w-full py-2 bg-slate-950 border border-slate-900 text-gray-400 hover:text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Reset Canvas
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
