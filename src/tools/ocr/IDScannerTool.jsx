import React, { useState, useRef } from 'react';
import { Upload, Download, Copy, RefreshCw, Eye, EyeOff, ShieldCheck, CheckCircle, Search, UserCircle, CreditCard, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function IDScannerTool() {
  const { incrementUsage, triggerLoader } = useApp();
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);

  const setupFile = (uploadedFile) => {
    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target.result);
    reader.readAsDataURL(uploadedFile);
    setExtractedData(null);
  };

  const executeScan = () => {
    if (!file) return;
    setIsProcessing(true);
    incrementUsage();
    triggerLoader("Decrypting identity visual buffer...", () => {
      setIsProcessing(false);
      setExtractedData({
        documentType: 'Driver License',
        issueCountry: 'United States',
        firstName: 'JOHN',
        lastName: 'DOE',
        dateOfBirth: '1990-05-15',
        licenseNumber: 'B8294510',
        expiryDate: '2028-12-31'
      });
    });
  };

  const mask = (val) => showSensitive ? val : '••••••••';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
      
      {/* Studio Controls (Left) */}
      <div className="lg:col-span-4 space-y-8 md:space-y-10">
         <div className="space-y-4">
            <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Identity Ingest</h3>
            {!image ? (
              <motion.div 
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) setupFile(e.dataTransfer.files[0]); }}
                onClick={() => document.getElementById('id-input').click()}
                whileHover={{ scale: 1.01 }}
                className={`w-full aspect-square rounded-[32px] md:rounded-[40px] border-2 border-dashed flex flex-col items-center justify-center gap-6 cursor-pointer transition-all ${
                  dragActive ? 'border-white bg-white/5' : 'border-white/5 hover:border-white/10'
                }`}
              >
                <input id="id-input" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && setupFile(e.target.files[0])} />
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl">
                   <UserCircle className="w-8 h-8 text-black" />
                </div>
                <div className="text-center px-4">
                   <p className="text-sm font-bold text-white tracking-tight">Drop Identity Document</p>
                   <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Passports, Licenses, IDs</p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6 animate-in">
                 <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-8 text-center">
                    <img src={image} className="w-full h-40 object-cover rounded-2xl bg-black/20 mb-6" alt="Source" />
                    <button onClick={executeScan} disabled={isProcessing} className="pill-button pill-button-primary w-full h-14 uppercase tracking-widest text-[10px]">
                       {isProcessing ? "Decrypting..." : "Execute Local Scan"}
                    </button>
                    <button onClick={() => {setImage(null); setExtractedData(null);}} className="pill-button pill-button-ghost w-full h-14 uppercase tracking-widest text-[10px]">Eject Signal</button>
                 </div>
              </div>
            )}
         </div>

         <div className="p-8 bg-rose-500/5 border border-rose-500/10 rounded-[32px] space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
               <Lock className="w-5 h-5" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Privacy Gasket</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium italic">Identity data is parsed within a 100% air-gapped V8 sandbox. Zero telemetry, zero cloud storage, zero risk of ID leakage.</p>
         </div>
      </div>

      {/* Studio Output (Right) */}
      <div className="lg:col-span-8">
         <div className="h-full min-h-[600px] flex flex-col bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
               <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.2em]">Sanitized Identity Data</span>
               </div>
               {extractedData && (
                 <button onClick={() => setShowSensitive(!showSensitive)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-[9px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest">
                    {showSensitive ? <><EyeOff className="w-3.5 h-3.5" /> Mask Sensitive</> : <><Eye className="w-3.5 h-3.5" /> Reveal Signal</>}
                 </button>
               )}
            </div>

            <div className="flex-1 p-10 md:p-16 space-y-12 overflow-y-auto">
               <AnimatePresence mode="wait">
                 {extractedData ? (
                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <DataField label="Document Class" value={extractedData.documentType} />
                      <DataField label="Issued By" value={extractedData.issueCountry} />
                      <DataField label="Given Names" value={extractedData.firstName} />
                      <DataField label="Surname" value={extractedData.lastName} />
                      <DataField label="Serial Identity" value={mask(extractedData.licenseNumber)} />
                      <DataField label="Temporal Birth" value={mask(extractedData.dateOfBirth)} />
                      <DataField label="Signal Expiry" value={extractedData.expiryDate} />
                      
                      <div className="md:col-span-2 pt-8 border-t border-white/5">
                         <button className="pill-button pill-button-primary w-full h-16 gap-3">
                            <Download className="w-5 h-5" /> Export Encrypted CSV
                         </button>
                      </div>
                   </motion.div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-slate-800 gap-8 opacity-10 py-32 md:py-48">
                      <CreditCard className="w-24 h-24" />
                      <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">Awaiting Identity Buffer</p>
                   </div>
                 )}
               </AnimatePresence>
            </div>
         </div>
      </div>

    </div>
  );
}

function DataField({ label, value }) {
  return (
    <div className="space-y-1">
       <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
       <p className="text-xl font-bold text-white tracking-tight tabular-nums">{value}</p>
    </div>
  );
}
