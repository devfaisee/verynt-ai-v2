import React, { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { Search, Upload, FileText, Copy, Download, RefreshCw, CheckCircle, Shield, Languages, ScanLine } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function OCRTool() {
  const { incrementUsage, triggerLoader } = useApp();
  const [image, setImage] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [language, setLanguage] = useState('eng');
  const [copied, setCopied] = useState(false);
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
      setOcrText("System error: Unable to extract text from the provided visual buffer.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
      
      {/* Studio Controls (Left) */}
      <div className="lg:col-span-4 space-y-10">
         <div className="space-y-4">
            <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Optic Ingest</h3>
            {!image ? (
              <motion.div 
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) setupImage(e.dataTransfer.files[0]); }}
                onClick={() => document.getElementById('ocr-input').click()}
                whileHover={{ scale: 1.02 }}
                className={`w-full aspect-square rounded-[40px] border-2 border-dashed flex flex-col items-center justify-center gap-6 cursor-pointer transition-all ${
                  dragActive ? 'border-white bg-white/5' : 'border-white/5 hover:border-white/10'
                }`}
              >
                <input ref={fileInputRef} id="ocr-input" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && setupImage(e.target.files[0])} />
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl">
                   <ScanLine className="w-8 h-8 text-black" />
                </div>
                <div className="text-center">
                   <p className="text-sm font-bold text-white">Drop Visual Source</p>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">PNG, JPG, WEBP</p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6 animate-in">
                 <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-8">
                    <img src={image} className="w-full h-48 object-contain rounded-2xl bg-black/20" alt="Source" />
                    <div className="space-y-4">
                       <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5">
                          <button onClick={() => setLanguage('eng')} className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${language === 'eng' ? 'bg-white text-black shadow-2xl border-white' : 'text-slate-500'}`}>ENGLISH</button>
                          <button onClick={() => setLanguage('spa')} className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${language === 'spa' ? 'bg-white text-black shadow-2xl' : 'text-slate-500'}`}>SPANISH</button>
                       </div>
                       <button onClick={() => {setImage(null); setOcrText('');}} className="pill-button pill-button-ghost w-full h-14">Flush Input</button>
                    </div>
                 </div>

                 {isProcessing && (
                   <div className="space-y-3 px-2">
                      <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                         <span>Pattern Recognition</span>
                         <span className="text-white">{progress}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-white" />
                      </div>
                   </div>
                 )}
              </div>
            )}
         </div>

         <div className="p-8 bg-[#ff9f0a]/5 border border-[#ff9f0a]/10 rounded-[32px] space-y-4">
            <div className="flex items-center gap-3 text-[#ff9f0a]">
               <Shield className="w-5 h-5" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Security</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Text extraction is performed via local Tesseract buffers. No visual data is serialized or transmitted externally.</p>
         </div>
      </div>

      {/* Studio Output (Right) */}
      <div className="lg:col-span-8">
         <div className="h-full min-h-[600px] flex flex-col bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Extracted Metadata</span>
               </div>
               {ocrText && (
                 <button onClick={() => { navigator.clipboard.writeText(ocrText); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                    {copied ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                 </button>
               )}
            </div>

            <div className="flex-1 p-12 overflow-y-auto max-h-[500px] custom-scrollbar">
               {ocrText ? (
                 <div className="text-xl text-slate-300 font-medium leading-relaxed whitespace-pre-wrap select-all italic">
                    {ocrText}
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-800 gap-6 opacity-20 py-48">
                    <Search className="w-20 h-20" />
                    <p className="text-xs font-black uppercase tracking-[0.4em]">Awaiting Visual Signal</p>
                 </div>
               )}
            </div>

            <div className="p-8 bg-white/[0.01] border-t border-white/5 flex justify-between items-center text-[9px] font-black text-slate-600 uppercase tracking-widest">
               <span>Engine: Tesseract-v5-Local</span>
               <button className="hover:text-white transition-colors">Export Text Buffer</button>
            </div>
         </div>
      </div>

    </div>
  );
}
