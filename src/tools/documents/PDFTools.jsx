import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileText, Plus, Trash2, Download, Merge, Scissors, Upload, File, ShieldCheck, RefreshCw, Layers, FileDigit, FileArchive, FileOutput, FilePlus, Copy, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function PDFUtilsTool() {
  const { incrementUsage, triggerLoader } = useApp();
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeMode, setActiveMode] = useState('merge'); // merge, split, extract, compress

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
    }));
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (id) => setFiles(files.filter(f => f.id !== id));

  const processPDF = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    
    triggerLoader(`Executing local PDF ${activeMode} logic...`, async () => {
      try {
        const mergedPdf = await PDFDocument.create();
        
        if (activeMode === 'merge') {
          for (const fileObj of files) {
            const arrayBuffer = await fileObj.file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
          }
        } else {
          // Split/Extract logic: take first page
          const arrayBuffer = await files[0].file.arrayBuffer();
          const sourcePdf = await PDFDocument.load(arrayBuffer);
          const [firstPage] = await mergedPdf.copyPages(sourcePdf, [0]);
          mergedPdf.addPage(firstPage);
        }

        const pdfBytes = await mergedPdf.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `verynt_${activeMode}_result.pdf`;
        link.click();
        
        incrementUsage();
      } catch (error) {
        console.error("PDF Tool Error:", error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
      
      {/* Studio Controls (Left) */}
      <div className="lg:col-span-4 space-y-10">
         <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Document Ingest</h3>
            <div className="glass-card p-8 space-y-8">
               <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center">Operation Mode</p>
                  <div className="grid grid-cols-2 gap-2 bg-white/5 rounded-2xl p-1 border border-white/5">
                     {[
                       { id: 'merge', icon: Merge },
                       { id: 'split', icon: Scissors },
                       { id: 'extract', icon: FileOutput },
                       { id: 'compress', icon: FileArchive }
                     ].map(m => (
                       <button key={m.id} onClick={() => setActiveMode(m.id)} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black tracking-widest transition-all ${activeMode === m.id ? 'bg-white text-black shadow-2xl' : 'text-slate-500 hover:text-white'}`}>
                          <m.icon className="w-3.5 h-3.5" />
                          {m.id.toUpperCase()}
                       </button>
                     ))}
                  </div>
               </div>

               <div className="space-y-6 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-bold text-slate-500 uppercase">Queue: {files.length} Files</span>
                     <button onClick={() => document.getElementById('pdf-upload').click()} className="text-[10px] font-black text-[#00f2fe] uppercase tracking-widest hover:text-white transition-colors">Add Source</button>
                     <input id="pdf-upload" type="file" multiple accept=".pdf" className="hidden" onChange={handleFileChange} />
                  </div>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                     {files.map(f => (
                       <div key={f.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                          <span className="text-[10px] font-bold text-white truncate max-w-[150px]">{f.name}</span>
                          <button onClick={() => removeFile(f.id)}><Trash2 className="w-3.5 h-3.5 text-slate-600 hover:text-rose-500 transition-colors" /></button>
                       </div>
                     ))}
                  </div>

                  <button onClick={processPDF} disabled={files.length === 0 || isProcessing} className="pill-button pill-button-primary w-full h-14">Execute Logic</button>
               </div>
            </div>
         </div>

         <div className="p-8 bg-[#64d2ff]/5 border border-[#64d2ff]/10 rounded-[32px] space-y-4">
            <div className="flex items-center gap-3 text-[#64d2ff]">
               <ShieldCheck className="w-5 h-5" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Buffer Integrity</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Document arrays are combined in-memory using PDF-Lib. No data fragments are serialized or transmitted externally.</p>
         </div>
      </div>

      {/* Studio Workspace (Right) */}
      <div className="lg:col-span-8">
         <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-[40px] p-20 text-center space-y-8">
            <div className="w-24 h-24 rounded-[2rem] bg-slate-900 border border-white/5 flex items-center justify-center relative">
               <FileDigit className="w-10 h-10 text-[#00f2fe]" />
               <div className="absolute -inset-4 bg-[#00f2fe]/5 blur-3xl rounded-full opacity-50" />
            </div>
            <div className="space-y-4 max-w-sm">
               <h3 className="text-4xl font-bold text-white tracking-tight">Signal Processor</h3>
               <p className="text-slate-500 font-medium text-lg italic">"Awaiting document signals to begin local {activeMode} sequence."</p>
            </div>
            <div className="pt-10 border-t border-white/5 w-full max-w-md grid grid-cols-2 gap-8 text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">
               <span>End-to-End Private</span>
               <span>Native Speed</span>
            </div>
         </div>
      </div>

    </div>
  );
}
