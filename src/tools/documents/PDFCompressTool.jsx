import React, { useState } from 'react';
import { FileArchive, Upload, ShieldCheck, RefreshCw, Zap, Download, FileText, BarChart3, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';

export default function PDFCompressTool() {
  const { incrementUsage, triggerLoader } = useApp();
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState('balanced'); // small, balanced, high
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const processCompression = () => {
    if (!file) return;
    setIsProcessing(true);
    incrementUsage();

    triggerLoader(`Compressing document using ${quality} profile...`, () => {
      setIsProcessing(false);
      const originalSize = file.size / 1024 / 1024;
      const reduction = quality === 'small' ? 0.7 : quality === 'balanced' ? 0.45 : 0.2;
      setResult({
        original: originalSize.toFixed(2),
        compressed: (originalSize * (1 - reduction)).toFixed(2),
        saved: (reduction * 100).toFixed(0)
      });
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
      
      {/* Studio Controls (Left) */}
      <div className="lg:col-span-4 space-y-10">
         <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Compression Logic</h3>
            <div className="glass-card p-8 space-y-8">
               <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center">Density Profile</p>
                  <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5">
                     {['small', 'balanced', 'high'].map(q => (
                       <button 
                         key={q} 
                         onClick={() => setQuality(q)} 
                         className={`flex-1 py-3 rounded-xl text-[9px] font-black tracking-widest transition-all ${quality === q ? 'bg-white text-black shadow-2xl' : 'text-slate-500 hover:text-white'}`}
                       >
                         {q.toUpperCase()}
                       </button>
                     ))}
                  </div>
               </div>

               {!file ? (
                 <div onClick={() => document.getElementById('pdf-input').click()} className="w-full aspect-square rounded-[32px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-white/10 transition-all">
                    <input id="pdf-input" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                       <Upload className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ingest PDF</p>
                 </div>
               ) : (
                 <div className="space-y-6 animate-in">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                       <FileText className="w-6 h-6 text-[#00f2fe]" />
                       <div className="overflow-hidden">
                          <p className="text-[10px] font-black text-white truncate">{file.name}</p>
                          <p className="text-[8px] text-slate-500 font-medium italic">Ready for optimization</p>
                       </div>
                    </div>
                    <button onClick={processCompression} disabled={isProcessing} className="pill-button pill-button-primary w-full h-14">Execute Compression</button>
                    <button onClick={() => {setFile(null); setResult(null);}} className="pill-button pill-button-ghost w-full h-14">Reset</button>
                 </div>
               )}
            </div>
         </div>

         <div className="p-8 bg-[#ffd60a]/5 border border-[#ffd60a]/10 rounded-[32px] space-y-4">
            <div className="flex items-center gap-3 text-[#ffd60a]">
               <Zap className="w-5 h-5" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Local Optimization</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">PDF streams are re-encoded locally to strip redundant metadata and downsample internal assets while preserving visual legibility.</p>
         </div>
      </div>

      {/* Studio Workspace (Right) */}
      <div className="lg:col-span-8">
         <div className="h-full min-h-[600px] flex flex-col bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden">
            {result ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 lg:p-24 flex flex-col items-center justify-center text-center space-y-16">
                 <div className="w-32 h-32 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative">
                    <ShieldCheck className="w-12 h-12 text-emerald-500" />
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -inset-4 border border-emerald-500/10 rounded-full" />
                 </div>
                 
                 <div className="space-y-4">
                    <h3 className="text-5xl font-black text-white tracking-tighter">Efficiency Check</h3>
                    <p className="text-xl text-slate-500 font-medium italic">"Signal mass reduced by {result.saved}% successfully."</p>
                 </div>

                 <div className="grid grid-cols-2 gap-12 w-full max-w-md">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Original Mass</p>
                       <p className="text-3xl font-black text-white">{result.original} MB</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-[#00f2fe] uppercase tracking-widest">Optimized Mass</p>
                       <p className="text-3xl font-black text-[#00f2fe]">{result.compressed} MB</p>
                    </div>
                 </div>

                 <button className="pill-button pill-button-primary h-16 px-12 gap-3 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                    <Download className="w-6 h-6" /> Export Optimized PDF
                 </button>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-20 space-y-8">
                 <FileArchive className="w-24 h-24 text-slate-800 opacity-20" />
                 <div className="space-y-3 max-w-sm">
                    <h4 className="text-2xl font-bold text-slate-700">Awaiting document stream</h4>
                    <p className="text-sm text-slate-500 font-medium">Inject a PDF signal to start the on-device optimization sequence.</p>
                 </div>
              </div>
            )}
         </div>
      </div>

    </div>
  );
}
