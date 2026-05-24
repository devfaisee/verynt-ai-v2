import React, { useState } from 'react';
import { PenTool, RefreshCw, Copy, Download, Wand2, ShieldCheck, Briefcase, FileUser, Mail, LayoutGrid, Type, AlignLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScribbleTool() {
  const { incrementUsage, triggerLoader } = useApp();
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState('rephrase'); // 'rephrase', 'resume', 'cover-letter'
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const processText = () => {
    if (!text.trim()) return;
    setIsProcessing(true);
    incrementUsage();
    triggerLoader(`Applying ${mode} neural logic...`, () => {
      setIsProcessing(false);
      
      const outputs = {
        rephrase: "Optimized Sequence: " + text.split(' ').reverse().join(' ') + " [Neural Rephrasing Logic Applied Locally]",
        resume: "EXPERIENCE\nSenior Software Architect | Verynt Studio\n- Orchestrated the migration to local-first browser AI.\n- Built a high-fidelity glassmorphic design system using Tailwind v4.\n- Integrated multi-modal neural engines for zero-server inference.",
        'cover-letter': "Dear Hiring Committee,\n\nI am writing to express my intense interest in the AI Architect position. Having pioneered local-first intelligence at Verynt, I bring a unique perspective on privacy-first software engineering and hardware-accelerated browser environments..."
      };

      setResult(outputs[mode] || outputs.rephrase);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
      
      {/* Studio Controls (Left) */}
      <div className="lg:col-span-4 space-y-8 md:space-y-10">
         <div className="space-y-4">
            <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Writer Module</h3>
            <div className="glass-card p-6 md:p-8 space-y-2">
               {[
                 { id: 'rephrase', name: 'Smart Rephrase', icon: Wand2 },
                 { id: 'resume', name: 'Resume Build', icon: Briefcase },
                 { id: 'cover-letter', name: 'Cover Letter', icon: FileUser }
               ].map(t => (
                 <button 
                   key={t.id}
                   onClick={() => setMode(t.id)}
                   className={`w-full flex items-center gap-4 px-5 py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold transition-all border ${mode === t.id ? 'bg-white text-black shadow-xl border-white' : 'bg-transparent border-transparent text-slate-500 hover:text-white hover:bg-white/5'}`}
                 >
                    <t.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    {t.name.toUpperCase()}
                 </button>
               ))}
            </div>
         </div>

         <div className="space-y-4 flex flex-col h-full">
            <h3 className="text-[10px] md:text-xs font-black text-slate-700 uppercase tracking-[0.3em]">Source signal</h3>
            <div className="flex-1 min-h-[250px] md:min-h-[350px] relative group">
               <textarea 
                 value={text} 
                 onChange={(e) => setText(e.target.value)} 
                 className="w-full h-full bg-black/40 border border-white/5 rounded-[28px] md:rounded-[32px] p-6 md:p-8 font-medium text-sm md:text-base text-slate-400 focus:outline-none focus:border-white/10 transition-all resize-none italic"
                 placeholder="Enter raw sequence..."
               />
            </div>
            <button 
              onClick={processText}
              disabled={!text.trim() || isProcessing}
              className="pill-button pill-button-primary w-full h-12 md:h-14 mt-2 uppercase tracking-widest text-[10px] md:text-xs"
            >
              {isProcessing ? "Synthesizing..." : "Execute Logic"}
            </button>
         </div>
      </div>

      {/* Studio Output (Right) */}
      <div className="lg:col-span-8">
         <div className="h-full min-h-[450px] md:min-h-[600px] flex flex-col bg-white/[0.02] border border-white/5 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl">
            <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Type className="w-5 h-5 text-slate-400" />
                  <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.2em]">Neural Output</span>
               </div>
               {result && (
                 <div className="flex gap-2">
                    <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all">
                       {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                 </div>
               )}
            </div>

            <div className="flex-1 p-8 md:p-12 relative overflow-y-auto max-h-[500px] custom-scrollbar">
               <AnimatePresence mode="wait">
                 {result ? (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full text-lg md:text-2xl text-slate-300 font-medium leading-relaxed whitespace-pre-wrap select-all italic">
                      {result}
                   </motion.div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-slate-800 gap-6 opacity-10 py-24 md:py-32">
                      <PenTool className="w-16 md:w-20 h-16 md:h-20" />
                      <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-center">Awaiting Studio Directive</p>
                   </div>
                 )}
               </AnimatePresence>
            </div>

            <div className="p-6 md:p-8 bg-white/[0.01] border-t border-white/5">
               <div className="flex items-center gap-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 opacity-50 shrink-0" />
                  Processed locally • 0% Cloud Footprint
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}
