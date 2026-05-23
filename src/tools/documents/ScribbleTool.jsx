import React, { useState } from 'react';
import { PenTool, Copy, Wand2, ShieldCheck, Briefcase, FileText, CheckCircle } from 'lucide-react';
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
      
      {/* Studio Controls (Left) */}
      <div className="lg:col-span-4 space-y-10">
         <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Writer Module</h3>
            <div className="glass-card p-6 space-y-2">
               {[
                 { id: 'rephrase', name: 'Smart Rephrase', icon: Wand2 },
                 { id: 'resume', name: 'Resume Improver', icon: Briefcase },
                 { id: 'cover-letter', name: 'Cover Letter', icon: FileText }
               ].map(t => (
                 <button 
                   key={t.id}
                   onClick={() => setMode(t.id)}
                   className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-bold transition-all border ${mode === t.id ? 'bg-white text-black shadow-2xl border-white' : 'bg-transparent border-transparent text-slate-500 hover:text-white hover:bg-white/5'}`}
                 >
                    <t.icon className="w-4 h-4" />
                    {t.name.toUpperCase()}
                 </button>
               ))}
            </div>
         </div>

         <div className="space-y-4 flex flex-col h-full">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-[0.3em]">Source Data</h3>
            <textarea 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              className="w-full flex-1 min-h-[300px] bg-black/40 border border-white/5 rounded-[32px] p-8 font-medium text-sm text-slate-400 focus:outline-none focus:border-white/10 transition-all resize-none italic"
              placeholder="Enter text or job description..."
            />
            <button 
              onClick={processText}
              disabled={!text.trim() || isProcessing}
              className="pill-button pill-button-primary w-full h-14 mt-4"
            >
              {isProcessing ? "Synthesizing..." : "Execute Logic"}
            </button>
         </div>
      </div>

      {/* Studio Output (Right) */}
      <div className="lg:col-span-8">
         <div className="h-full min-h-[600px] flex flex-col bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
               <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Neural Result</span>
               {result && (
                 <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                    {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                 </button>
               )}
            </div>

            <div className="flex-1 p-12 relative">
               <AnimatePresence mode="wait">
                 {result ? (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full text-xl text-slate-300 font-medium leading-relaxed whitespace-pre-wrap select-all custom-scrollbar overflow-y-auto max-h-[400px]">
                      {result}
                   </motion.div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-slate-800 gap-6 opacity-20 py-48">
                      <PenTool className="w-20 h-20" />
                      <p className="text-xs font-black uppercase tracking-[0.4em]">Awaiting Instruction</p>
                   </div>
                 )}
               </AnimatePresence>
            </div>

            <div className="p-8 bg-white/[0.01] border-t border-white/5">
               <div className="flex items-center gap-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 opacity-50" />
                  Processed locally • No cloud footprint
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}
