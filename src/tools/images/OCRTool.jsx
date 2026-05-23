import React, { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { Search, Upload, FileText, Copy, Download, RefreshCw, CheckCircle, Shield, Languages } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function OCRTool() {
  const { incrementUsage, triggerLoader } = useApp();
  const [image, setImage] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [language, setLanguage] = useState('eng');
  const fileInputRef = useRef(null);

  const setupImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target.result);
    reader.readAsDataURL(file);
    processOCR(file);
  };

  const processOCR = async (file) => {
    setIsProcessing(true);
    setOcrText('');
    setProgress(0);
    incrementUsage();
    
    try {
      const worker = await createWorker(language, 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.floor(m.progress * 100));
          }
        }
      });

      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      
      setOcrText(text);
    } catch (error) {
      console.error("OCR Error:", error);
      setOcrText("Error processing image. Please ensure the file is a valid image and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ocrText);
    alert("Copied to clipboard!");
  };

  return (
    <div className="space-y-10 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-white tracking-tight">Vision OCR</h2>
          <p className="text-slate-400 font-medium">Extract structured text from any image using local neural engines.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
             <button onClick={() => setLanguage('eng')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${language === 'eng' ? 'bg-white text-black' : 'text-slate-400'}`}>ENGLISH</button>
             <button onClick={() => setLanguage('spa')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${language === 'spa' ? 'bg-white text-black' : 'text-slate-400'}`}>SPANISH</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUT */}
        <div className="lg:col-span-5 space-y-6">
          <div 
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) setupImage(e.dataTransfer.files[0]); }}
            onClick={() => fileInputRef.current.click()}
            className={`glass-panel border-2 border-dashed p-12 text-center cursor-pointer transition-all min-h-[400px] flex flex-col items-center justify-center gap-6 ${
              dragActive ? 'border-[#00f2fe] bg-[#00f2fe]/5' : 'border-white/5 hover:border-white/10'
            }`}
          >
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && setupImage(e.target.files[0])} />
            
            {image ? (
              <img src={image} alt="Preview" className="max-h-[300px] rounded-xl shadow-2xl" />
            ) : (
              <>
                <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center border border-white/5 shadow-inner">
                  <Upload className="w-8 h-8 text-[#00f2fe]" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white">Upload Image Source</h4>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">PNG, JPG, WEBP — MAX 20MB</p>
                </div>
              </>
            )}
          </div>

          {isProcessing && (
            <div className="glass-panel p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recognizing Patterns</h4>
                <span className="text-xs text-[#00f2fe] font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                <div className="h-full bg-white transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* OUTPUT */}
        <div className="lg:col-span-7">
          <div className="glass-panel h-full min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/2">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#00f2fe]" />
                <span className="text-sm font-bold text-white uppercase tracking-wider">Extracted Metadata</span>
              </div>
              {ocrText && (
                <div className="flex gap-2">
                  <button onClick={copyToClipboard} className="h-10 w-10 rounded-xl border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 p-8 font-sans text-base leading-relaxed overflow-y-auto max-h-[600px] text-slate-300 whitespace-pre-wrap">
              {ocrText || (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 opacity-20">
                  <Search className="w-20 h-20" />
                  <p className="font-bold tracking-widest uppercase text-xs">Waiting for scan initiation</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
