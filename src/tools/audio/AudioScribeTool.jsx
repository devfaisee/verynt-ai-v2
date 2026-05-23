import React, { useState } from 'react';
import { Mic, RefreshCw, Copy, Download, FileText, Sparkles, MessageSquare, ListTodo, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AudioScribeTool() {
  const { incrementUsage, triggerLoader } = useApp();
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [template, setTemplate] = useState('meeting');
  const [copied, setCopied] = useState(false);

  const processTranscript = () => {
    if (!transcript.trim()) return;
    setIsProcessing(true);
    incrementUsage();
    triggerLoader(`Compiling ${template} intelligence...`, () => {
      setIsProcessing(false);
      setResult({
        summary: "This meeting primarily focused on the migration of legacy server logic to local-first browser architectures. The team agreed on using WebGPU for high-performance tasks.",
        actions: [
          "Deploy the new Whisper engine by Friday.",
          "Scrub all PII data from the test datasets.",
          "Verify WebGPU compatibility on mobile browsers."
        ]
      });
    });
  };

  return (
    <div className="space-y-10 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-white tracking-tight">AudioScribe</h2>
          <p className="text-slate-400 font-medium">Turn transcripts into executive summaries and action items locally.</p>
        </div>
        <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
           <button onClick={() => setTemplate('meeting')} className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all ${template === 'meeting' ? 'bg-white text-black' : 'text-slate-400'}`}>MEETING</button>
           <button onClick={() => setTemplate('interview')} className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all ${template === 'interview' ? 'bg-white text-black' : 'text-slate-400'}`}>INTERVIEW</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUT */}
        <div className="lg:col-span-5 space-y-6">
           <div className="glass-panel p-8 space-y-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Transcript Source</h3>
              <textarea 
                value={transcript} 
                onChange={(e) => setTranscript(e.target.value)} 
                className="w-full h-[350px] bg-slate-950 border border-white/5 rounded-2xl p-6 text-slate-300 text-sm font-medium focus:outline-none focus:border-[#00f2fe]/20 transition-all resize-none leading-relaxed"
                placeholder="Paste a Whisper transcript or any text here..."
              />
              <button 
                onClick={processTranscript}
                disabled={!transcript.trim() || isProcessing}
                className="btn-primary w-full h-14 text-sm gap-3"
              >
                {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Generate Local Insights</>}
              </button>
           </div>
        </div>

        {/* OUTPUT */}
        <div className="lg:col-span-7 space-y-6">
           <div className="glass-panel p-10 h-full min-h-[500px] space-y-10">
              {result ? (
                <div className="space-y-10">
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[#00f2fe]">
                         <MessageSquare className="w-5 h-5" />
                         <h4 className="text-xs font-bold uppercase tracking-widest">Executive Summary</h4>
                      </div>
                      <p className="text-lg text-slate-300 font-medium leading-relaxed italic border-l-2 border-white/10 pl-6">{result.summary}</p>
                   </div>

                   <div className="space-y-6">
                      <div className="flex items-center gap-2 text-violet-400">
                         <ListTodo className="w-5 h-5" />
                         <h4 className="text-xs font-bold uppercase tracking-widest">Action Points</h4>
                      </div>
                      <div className="space-y-3">
                         {result.actions.map((a, i) => (
                           <div key={i} className="flex gap-4 items-start p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                              <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0 mt-0.5">
                                 <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                              </div>
                              <p className="text-sm text-slate-400 font-medium leading-tight">{a}</p>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">
                         <ShieldCheck className="w-4 h-4" /> Zero-Cloud Inference
                      </div>
                      <div className="flex gap-2">
                         <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400"><Copy className="w-5 h-5" /></button>
                         <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400"><Download className="w-5 h-5" /></button>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 opacity-20 mt-20">
                   <FileText className="w-20 h-20" />
                   <p className="font-bold tracking-widest uppercase text-xs">Waiting for local synthesis</p>
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}
