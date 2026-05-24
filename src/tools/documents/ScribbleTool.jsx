import React, { useState } from 'react';
import { PenTool, RefreshCw, Copy, Download, Wand2, ShieldCheck, Briefcase, UserCircle, Mail, LayoutGrid, Type, AlignLeft, CheckCircle, Sliders, Sparkles, Target, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScribbleTool() {
  const { incrementUsage, triggerLoader } = useApp();
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState('rephrase'); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  // --- MICRO CONTROLS ---
  const [creativity, setCreativity] = useState(0.7); // temperature
  const [logicDepth, setLogicDepth] = useState('standard'); // standard, extreme
  const [maxTokens, setMaxTokens] = useState(256);

  const processText = () => {
    if (!text.trim()) return;
    setIsProcessing(true);
    incrementUsage();
    triggerLoader(`Synthesizing ${mode} signal with ${creativity} temperature...`, () => {
      setIsProcessing(false);
      
      const outputs = {
        rephrase: "Optimized Sequence: " + text.split(' ').reverse().join(' ') + ` [Entropy: ${creativity}]`,
        resume: "EXPERIENCE\nSenior Software Architect | Verynt Studio\n- Orchestrated local V8 isolates.\n- Optimized WebGPU buffers for ${creativity * 100}% efficiency.",
        'cover-letter': "Dear Hiring Committee,\n\nI am writing to express interest in the AI position. Having validated the local-first standard at Verynt, I bring a unique perspective on secure neural computing..."
      };

      setResult(outputs[mode] || outputs.rephrase);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
      
      {/* Studio Controls (Left) */}
      <div className="lg:col-span-4 space-y-8">
         
         {/* MICRO CONTROLS PANEL */}
         <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
               <Sliders className="w-3.5 h-3.5" /> Generative logic
            </h3>
            <div className="glass-card p-6 space-y-6">
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-[9px] font-black text-slate-600 uppercase tracking-widest">
                     <span>Creativity (Temp)</span>
                     <span className="text-[#bf5af2]">{creativity}</span>
                  </div>
                  <input type="range" min="0" max="1.5" step="0.1" value={creativity} onChange={(e) => setCreativity(parseFloat(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none accent-white" />
               </div>

               <div className="space-y-3 pt-4 border-t border-white/5">
                  <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                     <Target className="w-3 h-3" /> Recursive Depth
                  </label>
                  <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
                     {['standard', 'extreme'].map(d => (
                       <button key={d} onClick={() => setLogicDepth(d)} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${logicDepth === d ? 'bg-white text-black shadow-xl' : 'text-slate-500'}`}>{d}</button>
                     ))}
                  </div>
               </div>

               <div className="space-y-3 pt-4 border-t border-white/5">
                  <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                     <Zap className="w-3 h-3" /> Max signal Length
                  </label>
                  <select 
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold text-white outline-none"
                  >
                     <option value={128}>128 Tokens (Snippets)</option>
                     <option value={256}>256 Tokens (Standard)</option>
                     <option value={512}>512 Tokens (Deep Form)</option>
                  </select>
               </div>
            </div>
         </div>

         <div className="space-y-4">
            <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Module Config</h3>
            <div className="glass-card p-6 md:p-8 space-y-2">
               {[
                 { id: 'rephrase', name: 'Smart Rephrase', icon: Wand2 },
                 { id: 'resume', name: 'Resume Build', icon: Briefcase },
                 { id: 'cover-letter', name: 'Cover Letter', icon: UserCircle }
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
            
            <button onClick={processText} disabled={!text.trim() || isProcessing} className="pill-button pill-button-primary w-full h-14 uppercase tracking-widest text-[10px]">Execute Writer</button>
         </div>
      </div>

      {/* Studio Output (Right) */}
      <div className="lg:col-span-8">
         <div className="h-full min-h-[450px] md:min-h-[600px] flex flex-col bg-white/[0.02] border border-white/5 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl relative">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
               <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Neural Result</span>
               {result && (
                 <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all">
                    {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                 </button>
               )}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-x divide-white/5 h-full">
               <div className="p-10 space-y-6">
                  <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">Source stream</h4>
                  <textarea 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                    className="w-full h-full bg-transparent border-none text-slate-500 font-medium text-lg focus:outline-none resize-none leading-relaxed italic"
                    placeholder="Inject raw signal..."
                  />
               </div>
               <div className="p-10 space-y-6 bg-white/[0.01]">
                  <h4 className="text-[10px] font-black text-[#bf5af2] uppercase tracking-[0.3em]">Forge result</h4>
                  <div className="w-full h-full text-slate-200 font-serif text-2xl leading-relaxed italic select-all overflow-y-auto">
                     {result || (
                        <div className="h-full flex flex-col items-center justify-center text-slate-800 gap-6 opacity-10">
                           <PenTool className="w-20 h-20" />
                           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-center">Awaiting Directives</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            <div className="p-8 bg-white/[0.01] border-t border-white/5 flex justify-between items-center text-[9px] font-black text-slate-600 uppercase tracking-widest">
               <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 opacity-50" />
                  Signal remains in local V8 isolate
               </div>
               <button className="hover:text-white transition-colors">Export signal</button>
            </div>
         </div>
      </div>

    </div>
  );
}
