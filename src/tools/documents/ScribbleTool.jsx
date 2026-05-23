import React, { useState } from 'react';
import { PenTool, RefreshCw, Copy, Download, Wand2, Type, AlignLeft, Hash } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ScribbleTool() {
  const { incrementUsage, triggerLoader } = useApp();
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const processText = () => {
    if (!text.trim()) return;

    setIsProcessing(true);
    incrementUsage();

    triggerLoader(`Applying ${tone} tone adjustments...`, () => {
      // Simulate AI writing logic
      let processed = text;
      
      if (tone === 'professional') {
        processed = "Furthermore, " + processed.charAt(0).toLowerCase() + processed.slice(1) + " per the established corporate standards.";
      } else if (tone === 'casual') {
        processed = "Hey! Just wanted to say: " + processed;
      } else if (tone === 'academic') {
        processed = "This research posits that " + processed.charAt(0).toLowerCase() + processed.slice(1) + ", thereby validating the hypothesis.";
      }

      if (length === 'shorten') {
        processed = processed.substring(0, Math.min(processed.length, 50)) + "...";
      } else if (length === 'expand') {
        processed += " Additionally, this implementation ensures maximum efficiency and performance for local-first environments.";
      }

      setResult(processed);
      setIsProcessing(false);
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* INPUT */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Input Workspace</h3>
            <div className="flex gap-2">
               <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/5">{text.split(/\s+/).filter(Boolean).length} Words</span>
            </div>
          </div>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-[400px] bg-slate-900/50 border border-white/5 rounded-3xl p-8 text-lg text-slate-300 focus:outline-none focus:border-[#00f2fe]/30 transition-all resize-none font-medium leading-relaxed"
            placeholder="Start writing or paste text here to rephrase..."
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Tone</label>
              <select 
                value={tone} 
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="academic">Academic</option>
                <option value="persuasive">Persuasive</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Length</label>
              <select 
                value={length} 
                onChange={(e) => setLength(e.target.value)}
                className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
              >
                <option value="shorten">Shorten</option>
                <option value="standard">Standard</option>
                <option value="expand">Expand</option>
              </select>
            </div>
          </div>

          <button
            onClick={processText}
            disabled={!text.trim() || isProcessing}
            className="btn-primary w-full h-16 text-lg gap-3"
          >
            <Wand2 className="w-6 h-6" />
            Enhance with Local AI
          </button>
        </div>

        {/* OUTPUT */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">AI Result</h3>
            {result && (
              <div className="flex gap-2">
                <button onClick={copyToClipboard} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400">
                   {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400">
                   <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="w-full h-[400px] bg-white/[0.02] border border-white/5 rounded-3xl p-8 overflow-y-auto text-lg text-slate-300 font-medium leading-relaxed italic">
            {result || (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 opacity-30">
                <PenTool className="w-16 h-16" />
                <p className="text-sm font-bold uppercase tracking-widest">Waiting for input processing</p>
              </div>
            )}
          </div>

          {result && (
            <div className="p-6 bg-[#00f2fe]/5 border border-[#00f2fe]/10 rounded-2xl space-y-2">
               <div className="flex items-center gap-2 text-[#00f2fe]">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-tighter">Zero Server Exposure</span>
               </div>
               <p className="text-xs text-slate-500 font-medium">This text was generated locally. No data was sent to OpenAI or any cloud provider.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
