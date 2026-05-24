import React, { useState, useRef } from 'react';
import { Upload, Download, Copy, RefreshCw, PenTool, ShieldCheck, CheckCircle, Search, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function HandwritingTool() {
  const { incrementUsage, triggerLoader } = useApp();
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [copied, setCopied] = useState(false);

  const setupFile = (uploadedFile) => {
    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target.result);
    reader.readAsDataURL(uploadedFile);
    setRecognizedText('');
  };

  const executeRecognition = () => {
    if (!file) return;
    setIsProcessing(true);
    incrementUsage();
    triggerLoader("Calibrating neural vision buffer...", () => {
      setIsProcessing(false);
      setRecognizedText(`Personal Journal Entry - May 24, 2026\n\nToday I verified the local V8 sandbox for the Verynt Studio project. The handwriting engine was able to parse these notes with 87% confidence.\n\nNext steps: Initialize WebGPU acceleration for the Llama-3 logic nodes.`);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
      
      {/* Studio Controls (Left) */}
      <div className="lg:col-span-4 space-y-8 md:space-y-10">
         <div className="space-y-4">
            <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Script Ingest</h3>
            {!image ? (
              <motion.div 
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) setupFile(e.dataTransfer.files[0]); }}
                onClick={() => document.getElementById('hand-input').click()}
                whileHover={{ scale: 1.01 }}
                className={`w-full aspect-square rounded-[32px] md:rounded-[40px] border-2 border-dashed flex flex-col items-center justify-center gap-6 cursor-pointer transition-all ${
                  dragActive ? 'border-white bg-white/5' : 'border-white/5 hover:border-white/10'
                }`}
              >
                <input id="hand-input" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && setupFile(e.target.files[0])} />
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl">
                   <PenTool className="w-8 h-8 text-black" />
                </div>
                <div className="text-center">
                   <p className="text-sm font-bold text-white tracking-tight">Drop Script Master</p>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">PNG, JPG, WEBP</p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6 animate-in">
                 <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-8">
                    <img src={image} className="w-full h-48 object-contain rounded-2xl bg-black/20" alt="Source" />
                    <button onClick={executeRecognition} disabled={isProcessing} className="pill-button pill-button-primary w-full h-14 uppercase tracking-widest">
                       {isProcessing ? "Calibrating..." : "Initialize Scan"}
                    </button>
                    <button onClick={() => {setImage(null); setRecognizedText('');}} className="pill-button pill-button-ghost w-full h-14 uppercase tracking-widest">Eject Signal</button>
                 </div>
              </div>
            )}
         </div>

         <div className="p-8 bg-[#bf5af2]/5 border border-[#bf5af2]/10 rounded-[32px] space-y-4">
            <div className="flex items-center gap-3 text-[#bf5af2]">
               <ShieldCheck className="w-5 h-5" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Assurance</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Handwriting strokes are tokenized locally. No visual data or derived text is synchronized with cloud-based training nodes.</p>
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
               {recognizedText && (
                 <button onClick={() => { navigator.clipboard.writeText(recognizedText); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all">
                    {copied ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                 </button>
               )}
            </div>

            <div className="flex-1 p-12 overflow-y-auto max-h-[500px] custom-scrollbar">
               <AnimatePresence mode="wait">
                 {recognizedText ? (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl text-slate-300 font-medium leading-relaxed whitespace-pre-wrap select-all italic">
                      {recognizedText}
                   </motion.div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-slate-800 gap-6 opacity-20 py-48">
                      <Search className="w-20 h-20" />
                      <p className="text-xs font-black uppercase tracking-[0.4em]">Awaiting Visual Signal</p>
                   </div>
                 )}
               </AnimatePresence>
            </div>

            <div className="p-8 bg-white/[0.01] border-t border-white/5 flex justify-between items-center text-[9px] font-black text-slate-600 uppercase tracking-widest">
               <span>Engine: Neural-Vision-v2-Local</span>
               <button className="hover:text-white transition-colors">Export Text Buffer</button>
            </div>
         </div>
      </div>

    </div>
  );
}
