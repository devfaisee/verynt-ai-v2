import React, { useState } from 'react';
import { Terminal, Code, Check, Copy, RefreshCw, Braces, Binary, Search, Database, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DevTools() {
  const { incrementUsage } = useApp();
  const [activeTool, setActiveTool] = useState('json');
  const [input, setInput] = useState('{"verynt":"privacy-first","engine":"local-wasm","cost":0}');
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
      setOutput("Error: Invalid data format for processing.");
    }
  };

  return (
    <div className="space-y-10 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-white tracking-tight">Dev Utilities</h2>
          <p className="text-slate-400 font-medium">Essential developer formatting and conversion tools running 100% offline.</p>
        </div>
        <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
           <button onClick={() => setActiveTool('json')} className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all ${activeTool === 'json' ? 'bg-white text-black' : 'text-slate-400'}`}>JSON BEAUTIFIER</button>
           <button onClick={() => setActiveTool('base64')} className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all ${activeTool === 'base64' ? 'bg-white text-black' : 'text-slate-400'}`}>BASE64 CODER</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* INPUT */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Input Buffer</h3>
              <button onClick={() => setInput('')} className="text-[10px] font-bold text-rose-500 uppercase">Clear</button>
           </div>
           <textarea 
             value={input} 
             onChange={(e) => setInput(e.target.value)} 
             className="w-full h-[400px] bg-slate-950 border border-white/5 rounded-3xl p-8 font-mono text-xs text-slate-300 focus:outline-none focus:border-[#00f2fe]/20 transition-all resize-none"
             placeholder="Paste raw data here..."
           />
           <button onClick={processDev} className="btn-primary w-full h-16 text-sm gap-3">
              <Terminal className="w-5 h-5" /> Compile Output
           </button>
        </div>

        {/* OUTPUT */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Processed Result</h3>
              {output && (
                <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-2 rounded-lg bg-white/5 text-slate-400">
                   {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
           </div>
           <div className="w-full h-[400px] bg-white/[0.02] border border-white/5 rounded-3xl p-8 overflow-y-auto font-mono text-xs text-[#00f2fe] leading-relaxed">
              {output || <span className="text-slate-700">// Execution results will appear here...</span>}
           </div>
           <div className="p-6 bg-slate-900 border border-white/5 rounded-2xl flex items-center gap-4">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <div className="space-y-1">
                 <p className="text-xs font-bold text-white uppercase tracking-tighter">Zero Network Latency</p>
                 <p className="text-[10px] text-slate-500 font-medium">Calculations performed in-thread without server round-trips.</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
