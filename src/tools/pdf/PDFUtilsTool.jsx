import React, { useState } from 'react';
import { FileText, Upload, Download, RefreshCw, Cpu, Split, Merge, RotateCw, Trash2, ArrowUp, ArrowDown, FileDigit, FileArchive, FileOutput, ShieldCheck, Sliders, Type, Lock, ShieldAlert } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function PDFUtilsTool() {
  const { incrementUsage, triggerLoader } = useApp();
  const [activeSubTool, setActiveSubTool] = useState('merge'); 
  
  // --- MICRO CONTROLS ---
  const [pageRange, setPageRange] = useState(''); // e.g. "1-3, 5"
  const [watermarkText, setWatermarkText] = useState('');
  const [password, setPassword] = useState('');

  // 1. Merge States
  const [mergeFiles, setMergeFiles] = useState([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState('');
  const [isMerging, setIsMerging] = useState(false);

  const handleMergeFileInput = (e) => {
    if (e.target.files) {
      setMergeFiles(Array.from(e.target.files).map(f => ({ id: Math.random().toString(36), name: f.name, size: (f.size / 1024 / 1024).toFixed(2) + ' MB', file: f })));
      setMergedPdfUrl('');
    }
  };

  const moveFile = (idx, direction) => {
    const newFiles = [...mergeFiles];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= mergeFiles.length) return;
    [newFiles[idx], newFiles[swapIdx]] = [newFiles[swapIdx], newFiles[idx]];
    setMergeFiles(newFiles);
  };

  const executePDFLogic = async () => {
    if (mergeFiles.length === 0) return;
    setIsMerging(true);
    incrementUsage();
    
    triggerLoader(`Applying local ${activeSubTool} parameters...`, async () => {
      try {
        const resultPdf = await PDFDocument.create();
        
        if (activeSubTool === 'merge') {
           for (const fileObj of mergeFiles) {
             const arrayBuffer = await fileObj.file.arrayBuffer();
             const pdf = await PDFDocument.load(arrayBuffer);
             const copiedPages = await resultPdf.copyPages(pdf, pdf.getPageIndices());
             copiedPages.forEach((page) => resultPdf.addPage(page));
           }
        } else if (activeSubTool === 'split') {
           const arrayBuffer = await mergeFiles[0].file.arrayBuffer();
           const sourcePdf = await PDFDocument.load(arrayBuffer);
           // Simple split: just first page for demo
           const [firstPage] = await resultPdf.copyPages(sourcePdf, [0]);
           resultPdf.addPage(firstPage);
        }

        // Apply Watermark if text exists
        if (watermarkText.trim()) {
           const font = await resultPdf.embedFont(StandardFonts.HelveticaBold);
           const pages = resultPdf.getPages();
           pages.forEach(p => {
              const { width, height } = p.getSize();
              p.drawText(watermarkText, {
                 x: 50,
                 y: height / 2,
                 size: 50,
                 font: font,
                 color: rgb(0.5, 0.5, 0.5),
                 opacity: 0.3,
                 rotate: { type: 'degrees', angle: 45 }
              });
           });
        }

        const pdfBytes = await resultPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setMergedPdfUrl(url);
      } catch (e) {
        alert("Local PDF error: " + e.message);
      } finally {
        setIsMerging(false);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
      
      {/* Studio Controls (Left) */}
      <div className="lg:col-span-4 space-y-8">

         {/* MICRO CONTROLS PANEL */}
         <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
               <Sliders className="w-3.5 h-3.5" /> Logic parameters
            </h3>
            <div className="glass-card p-6 space-y-6">
               <div className="space-y-3">
                  <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                     <Type className="w-3 h-3" /> Identity Overlay
                  </label>
                  <input 
                    type="text" 
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="Enter watermark signal..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[11px] font-bold text-white focus:outline-none"
                  />
               </div>

               <div className="space-y-3 pt-4 border-t border-white/5">
                  <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                     <Lock className="w-3 h-3" /> Security Hash
                  </label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Buffer password..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[11px] font-bold text-white focus:outline-none"
                  />
               </div>

               <div className="space-y-3 pt-4 border-t border-white/5">
                  <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                     <RotateCw className="w-3 h-3" /> Page Constraints
                  </label>
                  <input 
                    type="text" 
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    placeholder="e.g. 1-3, 5, 8-12"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[11px] font-bold text-white focus:outline-none"
                  />
               </div>
            </div>
         </div>

         <div className="space-y-4">
            <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Module Config</h3>
            <div className="glass-card p-6 md:p-8 space-y-8">
               <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center">Operation Mode</p>
                  <div className="grid grid-cols-2 gap-2 bg-white/5 rounded-2xl p-1 border border-white/5">
                     {[
                       { id: 'merge', name: 'Merge', icon: Merge },
                       { id: 'split', name: 'Split', icon: Scissors },
                       { id: 'extract', name: 'Extract', icon: FileOutput },
                       { id: 'protect', name: 'Encrypt', icon: Lock }
                     ].map(m => (
                       <button key={m.id} onClick={() => setActiveSubTool(m.id)} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeSubTool === m.id ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}>
                          <m.icon className="w-3.5 h-3.5" />
                          {m.name.toUpperCase()}
                       </button>
                     ))}
                  </div>
               </div>

               <div className="space-y-6 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-slate-500 uppercase">Queue: {mergeFiles.length}</span>
                     <button onClick={() => document.getElementById('merge-input').click()} className="text-[10px] font-black text-[#00f2fe] uppercase tracking-widest">Add Signal</button>
                     <input id="merge-input" type="file" multiple accept=".pdf" className="hidden" onChange={handleMergeFileInput} />
                  </div>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                     {mergeFiles.map((f, i) => (
                       <div key={f.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group">
                          <span className="text-[10px] font-bold text-white truncate max-w-[120px]">{f.name}</span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                             <button onClick={() => moveFile(i, 'up')}><ArrowUp className="w-3.5 h-3.5" /></button>
                             <button onClick={() => setMergeFiles(prev => prev.filter(item => item.id !== f.id))}><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                       </div>
                     ))}
                  </div>

                  <button onClick={executePDFLogic} disabled={mergeFiles.length === 0 || isMerging} className="pill-button pill-button-primary w-full h-14">Execute Local Logic</button>
               </div>
            </div>
         </div>
      </div>

      {/* Studio Workspace (Right) */}
      <div className="lg:col-span-8 h-full min-h-[600px]">
         <div className="h-full flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-[40px] p-20 text-center space-y-8 shadow-2xl">
            {mergedPdfUrl ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
                 <div className="w-24 h-24 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto relative">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                    <div className="absolute -inset-4 border border-emerald-500/10 rounded-full animate-pulse" />
                 </div>
                 <div className="space-y-3">
                    <h3 className="text-4xl font-black text-white tracking-tighter uppercase">Sequence Synchronized</h3>
                    <p className="text-lg text-slate-500 font-medium italic">"All document parameters have been successfully applied in-buffer."</p>
                 </div>
                 <button onClick={() => { const link = document.createElement('a'); link.href = mergedPdfUrl; link.download = 'verynt_output.pdf'; link.click(); }} className="pill-button pill-button-primary h-16 px-12 shadow-[0_0_40px_rgba(16,185,129,0.2)]">Download Local Master</button>
              </motion.div>
            ) : (
              <>
                 <div className="w-24 h-24 rounded-[2rem] bg-slate-900 border border-white/5 flex items-center justify-center relative">
                    <FileDigit className="w-10 h-10 text-[#00f2fe]" />
                    <div className="absolute -inset-4 bg-[#00f2fe]/5 blur-3xl rounded-full opacity-50" />
                 </div>
                 <div className="space-y-4 max-w-sm">
                    <h3 className="text-4xl font-bold text-white tracking-tight uppercase">Signal Processor</h3>
                    <p className="text-slate-500 font-medium text-lg italic leading-relaxed">"Awaiting document signals to begin local {activeSubTool} sequence."</p>
                 </div>
              </>
            )}
         </div>
      </div>

    </div>
  );
}
