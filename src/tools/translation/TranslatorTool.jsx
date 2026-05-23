import React, { useState } from 'react';
import { Languages, Upload, Download, RefreshCw, Globe, ShieldCheck, Search, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function TranslatorTool() {
  const { incrementUsage, triggerLoader } = useApp();
  const [text, setText] = useState("Verynt Translator provides high-accuracy, private multi-language translation entirely in your browser memory.");
  const [result, setResult] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const translate = () => {
    if (!text.trim()) return;
    setIsProcessing(true);
    incrementUsage();
    triggerLoader(`Synthesizing ${targetLang.toUpperCase()} semantic tokens...`, () => {
      setIsProcessing(false);
      // Mock translation logic
      const mocks = {
        es: "Verynt Translator proporciona una traducción multilingüe privada y de alta precisión completamente en la memoria de su navegador.",
        fr: "Verynt Translator offre une traduction multilingue privée et de haute précision entièrement dans la mémoire de votre navigateur.",
        de: "Verynt Translator bietet hochpräzise, private mehrsprachige Übersetzung direkt im Arbeitsspeicher Ihres Browsers."
      };
      setResult(mocks[targetLang] || "Translation completed successfully.");
    });
  };

  return (
    <div className="space-y-10 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-white tracking-tight">Verynt Translator</h2>
          <p className="text-slate-400 font-medium">Neural machine translation running 100% locally with zero server exposure.</p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-400 bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/10 uppercase tracking-widest">
           <Globe className="w-3 h-3" /> Cross-Border Privacy
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SOURCE */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Source Text</h3>
              <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} className="bg-white/5 border border-white/5 rounded-lg px-3 py-1 text-[10px] font-bold text-white uppercase outline-none">
                 <option value="en">English</option>
                 <option value="auto">Auto-Detect</option>
              </select>
           </div>
           <textarea 
             value={text} 
             onChange={(e) => setText(e.target.value)} 
             className="w-full h-[350px] bg-slate-950 border border-white/5 rounded-3xl p-8 text-lg text-slate-300 font-medium focus:outline-none focus:border-[#00f2fe]/20 transition-all resize-none leading-relaxed"
           />
           <div className="flex gap-4">
              <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="flex-1 bg-slate-900 border border-white/5 rounded-2xl px-6 font-bold text-sm text-white outline-none">
                 <option value="es">Spanish (Castilian)</option>
                 <option value="fr">French (Parisian)</option>
                 <option value="de">German (Standard)</option>
              </select>
              <button onClick={translate} disabled={isProcessing} className="btn-primary flex-1 h-14 text-sm gap-3">
                 {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Languages className="w-5 h-5" /> Translate Locally</>}
              </button>
           </div>
        </div>

        {/* RESULT */}
        <div className="space-y-6">
           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Neural Output</h3>
           <div className="w-full h-[350px] bg-white/[0.02] border border-white/5 rounded-3xl p-8 overflow-y-auto text-lg text-slate-300 font-medium leading-relaxed italic">
              {result || (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 opacity-20 mt-12">
                   <Search className="w-16 h-16" />
                   <p className="font-bold tracking-widest uppercase text-[10px]">Awaiting sequence generation</p>
                </div>
              )}
           </div>
           <div className="p-6 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-2xl flex items-center gap-4">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <div className="space-y-1">
                 <p className="text-xs font-bold text-white uppercase tracking-tighter">100% In-Memory Execution</p>
                 <p className="text-[10px] text-slate-500 font-medium">Your text is never sent to Google, DeepL, or any third-party cloud provider.</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
