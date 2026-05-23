import React, { useState } from 'react';
import { Mic, RefreshCw, Copy, Download, FileText, Sparkles, MessageSquare, ListTodo, ShieldCheck, Database, ClipboardCheck, Mail, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

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
    triggerLoader(`Synthesizing ${template} intelligence...`, () => {
      setIsProcessing(false);
      
      const outputs = {
        meeting: {
           summary: "Strategic discussion regarding the transition to on-device neural processing. The executive committee approved the 'Cupertino Glass' architectural shift.",
           actions: ["Sync model registry with WebGPU buffers.", "Verify PII sanitization in mobile isolates.", "Deploy ad-based revenue placements."]
        },
        jira: {
           summary: "TICKET-104: High-fidelity Studio UI rebuild. Implementation of floating dynamic island navigation and glassmorphic canvas materials.",
           actions: ["[STORY] Refactor Whisper workspace.", "[TASK] Optimize index.css for Tailwind v4.", "[BUG] Fix stale Vercel deployment alias."]
        },
        email: {
           summary: "Follow-up: Verynt Studio V4 Launch. The latest on-device AI platform is now live and serving local intelligence without cloud exposure.",
           actions: ["Draft LinkedIn product announcement.", "Update directory backlinks for SEO authority.", "Review conversion metrics in local telemetry."]
        }
      };

      setResult(outputs[template] || outputs.meeting);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
      
      {/* Studio Controls (Left) */}
      <div className="lg:col-span-4 space-y-10">
         <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Module Config</h3>
            <div className="glass-card p-6 space-y-2">
               {[
                 { id: 'meeting', name: 'Meeting Notes', icon: MessageSquare },
                 { id: 'jira', name: 'Jira Tickets', icon: Zap },
                 { id: 'email', name: 'Email Draft', icon: Mail }
               ].map(t => (
                 <button 
                   key={t.id}
                   onClick={() => setTemplate(t.id)}
                   className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-bold transition-all border ${template === t.id ? 'bg-white text-black shadow-2xl border-white' : 'bg-transparent border-transparent text-slate-500 hover:text-white hover:bg-white/5'}`}
                 >
                    <t.icon className="w-4 h-4" />
                    {t.name.toUpperCase()}
                 </button>
               ))}
            </div>
         </div>

         <div className="space-y-4 flex flex-col">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-[0.3em]">Source Signal</h3>
            <textarea 
              value={transcript} 
              onChange={(e) => setTranscript(e.target.value)} 
              className="w-full h-64 bg-black/40 border border-white/5 rounded-[32px] p-8 font-medium text-sm text-slate-400 focus:outline-none focus:border-white/10 transition-all resize-none italic"
              placeholder="Paste Whisper transcript..."
            />
            <button 
              onClick={processTranscript}
              disabled={!transcript.trim() || isProcessing}
              className="pill-button pill-button-primary w-full h-14 mt-4"
            >
              {isProcessing ? "Processing..." : "Compile Intelligence"}
            </button>
         </div>
      </div>

      {/* Studio Output (Right) */}
      <div className="lg:col-span-8">
         <div className="h-full min-h-[600px] flex flex-col bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-12 lg:p-20 space-y-16"
                >
                   <div className="space-y-6">
                      <div className="flex items-center gap-3 text-[#00f2fe]">
                         <Sparkles className="w-5 h-5" />
                         <span className="text-[10px] font-black uppercase tracking-[0.3em]">Semantic Result</span>
                      </div>
                      <p className="text-2xl font-bold text-white tracking-tight leading-tight italic">"{result.summary}"</p>
                   </div>

                   <div className="space-y-8">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">Extracted Sequences</h4>
                      <div className="space-y-4">
                         {result.actions.map((a, i) => (
                           <div key={i} className="flex gap-6 items-start p-6 bg-white/[0.03] border border-white/5 rounded-3xl group hover:border-[#00f2fe]/30 transition-all">
                              <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                                 <div className="w-1.5 h-1.5 rounded-full bg-[#00f2fe]" />
                              </div>
                              <p className="text-lg text-slate-300 font-medium leading-tight group-hover:text-white transition-colors">{a}</p>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="pt-10 flex justify-between items-center border-t border-white/5">
                      <div className="flex items-center gap-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
                         <Database className="w-4 h-4" /> 100% On-Device Summarization
                      </div>
                      <div className="flex gap-3">
                         <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all"><Copy className="w-5 h-5" /></button>
                         <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all"><Download className="w-5 h-5" /></button>
                      </div>
                   </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-800 gap-6 opacity-20 py-48">
                   <FileText className="w-20 h-20" />
                   <p className="text-xs font-black uppercase tracking-[0.4em]">Awaiting Signal Input</p>
                </div>
              )}
            </AnimatePresence>
         </div>
      </div>

    </div>
  );
}
