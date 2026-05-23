import React, { useState } from 'react';
import { Terminal, Code, Check, Copy, RefreshCw, Braces, Binary, Search, Database, ShieldCheck, Cpu } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function DevTools() {
  const { incrementUsage } = useApp();
  const [activeTool, setActiveTool] = useState('json');
  const [input, setInput] = useState('{"verynt":"studio-v4","architecture":"local-wasm","standard":"ultra-premium"}');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const processDev = () => {
    try {
      if (activeTool === 'json') {
        const parsed = JSON.parse(input);
        setOutput(JSON.stringify(parsed, null, 2));
      } else if (activeTool === 'base64') {
        setOutput(btoa(input));
      }
      incrementUsage();
    } catch (e) {
      setOutput("// ERROR: System was unable to parse the provided signal array.\n// Ensure the input follows valid JSON or UTF-8 standards.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
      
      {/* Studio Navigation (Left) */}
      <div className="lg:col-span-3 space-y-10">
         <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Utility Modules</h3>
            <div className="glass-card p-6 space-y-2">
               {[
                 { id: 'json', name: 'JSON Beautifier', icon: Braces },
                 { id: 'base64', name: 'Base64 Transcoder', icon: Binary }
               ].map(tool => (
                 <button 
                   key={tool.id}
                   onClick={() => setActiveTool(tool.id)}
                   className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-bold transition-all border ${activeTool === tool.id ? 'bg-white text-black shadow-2xl border-white' : 'bg-transparent border-transparent text-slate-500 hover:text-white hover:bg-white/5'}`}
                 >
                    <tool.icon className="w-4 h-4" />
                    {tool.name.toUpperCase()}
                 </button>
               ))}
            </div>
         </div>

         <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-4">
            <div className="flex items-center gap-3 text-slate-300">
               <Cpu className="w-5 h-5" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">In-Thread Execution</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Data transformations occur within the browser's isolated main thread. Zero latency. Zero server round-trips.</p>
         </div>
      </div>

      {/* Studio Workspace (Right) */}
      <div className="lg:col-span-9 space-y-12">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* INPUT */}
            <div className="space-y-6 flex flex-col h-full">
               <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">Source Input</h3>
                  <button onClick={() => setInput('')} className="text-[10px] font-bold text-rose-500 hover:text-rose-400 uppercase tracking-widest transition-colors">Flush</button>
               </div>
               <div className="flex-1 min-h-[450px] relative group">
                  <textarea 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    className="w-full h-full bg-black/40 border border-white/5 rounded-[40px] p-10 font-mono text-xs text-slate-300 focus:outline-none focus:border-white/10 transition-all resize-none leading-relaxed"
                    placeholder="Paste raw signal here..."
                  />
                  <div className="absolute inset-0 rounded-[40px] border border-white/5 pointer-events-none group-hover:border-white/10 transition-all" />
               </div>
               <button onClick={processDev} className="pill-button pill-button-primary w-full h-16 text-sm gap-3 uppercase tracking-[0.1em]">
                  <Terminal className="w-5 h-5" /> Execute Transformation
               </button>
            </div>

            {/* OUTPUT */}
            <div className="space-y-6 flex flex-col h-full">
               <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-[#00f2fe] uppercase tracking-[0.3em]">Compiled Output</h3>
                  {output && (
                    <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="w-10 h-10 rounded-full bg-white/5 text-slate-400 hover:text-white transition-all">
                       {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
               </div>
               <div className="flex-1 min-h-[450px] relative overflow-hidden bg-white/[0.02] border border-white/5 rounded-[40px] p-10 font-mono text-xs text-[#00f2fe] leading-relaxed whitespace-pre overflow-y-auto custom-scrollbar italic">
                  {output || "// Studio awaiting signal ingestion..."}
               </div>
               <div className="p-8 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-[32px] flex items-center gap-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                     <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-white uppercase tracking-widest">Privacy Secured</p>
                     <p className="text-[10px] text-slate-500 font-medium">All parsing occurs in local V8 memory blocks.</p>
                  </div>
               </div>
            </div>

         </div>
      </div>

    </div>
  );
}
