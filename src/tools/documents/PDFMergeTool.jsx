import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileText, Plus, Trash2, Download, Merge, Scissors, Upload, File, ShieldCheck, RefreshCw, Layers, ArrowUp, ArrowDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function PDFMergeTool() {
  const { incrementUsage, triggerLoader } = useApp();
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const moveFile = (idx, direction) => {
    const newFiles = [...files];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= files.length) return;
    [newFiles[idx], newFiles[swapIdx]] = [newFiles[swapIdx], newFiles[idx]];
    setFiles(newFiles);
  };

  const processPDF = async () => {
    if (files.length < 2) {
      alert("Please add at least 2 PDF files to merge.");
      return;
    }

    setIsProcessing(true);
    triggerLoader("Merging PDF binary streams...", async () => {
      try {
        const mergedPdf = await PDFDocument.create();
        for (const fileObj of files) {
          const arrayBuffer = await fileObj.file.arrayBuffer();
          const pdf = await PDFDocument.load(arrayBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const pdfBytes = await mergedPdf.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "verynt_merged.pdf";
        link.click();
        
        incrementUsage();
      } catch (error) {
        console.error("PDF Merge Error:", error);
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
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Merge Queue</h3>
            <div className="glass-card p-8 space-y-8">
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-bold text-slate-500 uppercase">Queue: {files.length} Files</span>
                     <button onClick={() => document.getElementById('pdf-upload').click()} className="text-[10px] font-black text-[#00f2fe] uppercase tracking-widest hover:text-white transition-colors">Add PDF</button>
                     <input id="pdf-upload" type="file" multiple accept=".pdf" className="hidden" onChange={handleFileChange} />
                  </div>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                     {files.length > 0 ? files.map((f, idx) => (
                       <div key={f.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-[#00f2fe]/20 transition-all">
                          <div className="flex items-center gap-4 overflow-hidden">
                             <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center shrink-0">
                                <span className="text-[10px] font-black text-slate-500">{idx + 1}</span>
                             </div>
                             <div className="overflow-hidden">
                                <p className="text-[10px] font-bold text-white truncate max-w-[120px]">{f.name}</p>
                                <p className="text-[8px] text-slate-500 font-medium uppercase tracking-tighter">{f.size}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                             <button onClick={() => moveFile(idx, 'up')} disabled={idx === 0} className="p-1 text-slate-500 hover:text-white disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5" /></button>
                             <button onClick={() => moveFile(idx, 'down')} disabled={idx === files.length - 1} className="p-1 text-slate-500 hover:text-white disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5" /></button>
                             <button onClick={() => removeFile(f.id)} className="p-1 text-slate-500 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                       </div>
                     )) : (
                        <div className="py-12 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-slate-700 gap-4">
                           <Upload className="w-8 h-8 opacity-20" />
                           <p className="text-[10px] font-black uppercase tracking-widest">Queue Empty</p>
                        </div>
                     )}
                  </div>

                  <button onClick={processPDF} disabled={files.length < 2 || isProcessing} className="pill-button pill-button-primary w-full h-14">Execute Merge</button>
               </div>
            </div>
         </div>

         <div className="p-8 bg-[#00f2fe]/5 border border-[#00f2fe]/10 rounded-[32px] space-y-4">
            <div className="flex items-center gap-3 text-[#00f2fe]">
               <Merge className="w-5 h-5" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Stream Blending</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Binary PDF streams are concatenated in-memory. This process preserves metadata, links, and layout without server interaction.</p>
         </div>
      </div>

      {/* Studio Workspace (Right) */}
      <div className="lg:col-span-8">
         <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-[40px] p-20 text-center space-y-8 shadow-2xl shadow-black/50">
            <div className="w-24 h-24 rounded-[2rem] bg-slate-900 border border-white/5 flex items-center justify-center relative">
               <Merge className="w-10 h-10 text-[#00f2fe]" />
               <div className="absolute -inset-4 bg-[#00f2fe]/5 blur-3xl rounded-full opacity-50" />
            </div>
            <div className="space-y-4 max-w-sm">
               <h3 className="text-4xl font-bold text-white tracking-tight">Merge Studio</h3>
               <p className="text-slate-500 font-medium text-lg italic leading-relaxed">"Awaiting 2+ document signals to begin local concatenation sequence."</p>
            </div>
         </div>
      </div>

    </div>
  );
}
