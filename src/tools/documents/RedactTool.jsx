import React, { useState, useEffect } from 'react';
import { Eye, ShieldAlert, Check, Copy, Download, RefreshCw, Trash2, HelpCircle, Lock, ShieldCheck, Search, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';

export default function RedactTool() {
  const { incrementUsage } = useApp();
  const [inputText, setInputText] = useState(
    "Hi support, my name is John Doe. My email is john.doe@gmail.com and my credit card number is 4111-2222-3333-4444. " +
    "You can reach me at my personal number +1 (555) 019-2834. My home address is 123 Privacy Lane, New York, NY."
  );
  const [redactedText, setRedactedText] = useState('');
  const [stats, setStats] = useState({ emails: 0, phones: 0, cards: 0, total: 0 });
  const [maskStyle, setMaskStyle] = useState('bars'); 
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    runRedaction();
  }, [inputText, maskStyle]);

  const runRedaction = () => {
    let text = inputText;
    let counts = { emails: 0, phones: 0, cards: 0, total: 0 };

    const emailRegex = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g;
    const phoneRegex = /\b\+?\d{1,4}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g;
    const cardRegex = /\b\d{4}[-.\s]?\d{4}[-.\s]?\d{4}[-.\s]?\d{4}\b/g;

    counts.emails = (text.match(emailRegex) || []).length;
    counts.phones = (text.match(phoneRegex) || []).length;
    counts.cards = (text.match(cardRegex) || []).length;
    counts.total = counts.emails + counts.phones + counts.cards;

    const replacement = (m) => {
      if (maskStyle === 'bars') return '█'.repeat(m.length);
      if (maskStyle === 'stars') return '*'.repeat(m.length);
      return '[PII_MASKED]';
    };

    text = text.replace(emailRegex, replacement);
    text = text.replace(phoneRegex, replacement);
    text = text.replace(cardRegex, replacement);

    setRedactedText(text);
    setStats(counts);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
      
      {/* Studio Input (Left) */}
      <div className="lg:col-span-4 space-y-10">
         <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Sanitization Hub</h3>
            <div className="glass-card p-8 space-y-8">
               <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center">Interception Mask</p>
                  <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5">
                     {['bars', 'stars', 'text'].map(s => (
                       <button key={s} onClick={() => setMaskStyle(s)} className={`flex-1 py-2 rounded-xl text-[9px] font-black tracking-widest transition-all ${maskStyle === s ? 'bg-white text-black shadow-2xl' : 'text-slate-500 hover:text-white'}`}>{s.toUpperCase()}</button>
                     ))}
                  </div>
               </div>

               <div className="space-y-6 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center px-2">
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Auto-Detection</span>
                     <span className="text-[10px] font-black text-emerald-500 uppercase">Active</span>
                  </div>
                  <button onClick={() => { incrementUsage(); alert("Signal scrubbed."); }} className="pill-button pill-button-primary w-full h-14 uppercase tracking-[0.1em]">Scrub Master Buffer</button>
                  <button onClick={() => setInputText('')} className="pill-button pill-button-ghost w-full h-14 uppercase tracking-[0.1em]">Flush Source</button>
               </div>
            </div>
         </div>

         <div className="p-8 bg-rose-500/5 border border-rose-500/10 rounded-[32px] space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
               <ShieldAlert className="w-5 h-5" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Privacy Leak Prevention</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Leading LLMs training on your inputs. Verynt Redact strips PII identities locally before any data serialization occurs.</p>
         </div>
      </div>

      {/* Studio Output (Right) */}
      <div className="lg:col-span-8 space-y-8">
         <div className="glass-card overflow-hidden h-full min-h-[600px] flex flex-col">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Sanitized Document Stream</span>
               </div>
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4">
                     <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-slate-600 uppercase">Intercepted</span>
                        <span className="text-sm font-black text-white">{stats.total} entities</span>
                     </div>
                  </div>
                  {redactedText && (
                    <button onClick={() => { navigator.clipboard.writeText(redactedText); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                       {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                    </button>
                  )}
               </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-x divide-white/5">
               <div className="p-10 space-y-6">
                  <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">Reference Input</h4>
                  <textarea 
                    value={inputText} 
                    onChange={(e) => setInputText(e.target.value)} 
                    className="w-full h-full bg-transparent border-none text-slate-500 font-medium text-lg focus:outline-none resize-none leading-relaxed italic"
                    placeholder="Enter raw signal..."
                  />
               </div>
               <div className="p-10 space-y-6 bg-white/[0.01]">
                  <h4 className="text-[10px] font-black text-[#64d2ff] uppercase tracking-[0.3em]">Neural Mask Result</h4>
                  <div className="w-full h-full text-slate-200 font-mono text-base leading-relaxed break-words whitespace-pre-wrap select-all">
                     {redactedText}
                  </div>
               </div>
            </div>

            <div className="p-8 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
               <div className="flex items-center gap-8">
                  <Stat label="Emails" value={stats.emails} />
                  <Stat label="Phone" value={stats.phones} />
                  <Stat label="Finance" value={stats.cards} />
               </div>
               <button className="text-[9px] font-black text-slate-600 hover:text-white uppercase tracking-widest flex items-center gap-2">
                  <Download className="w-3.5 h-3.5" /> Download Scrubbed Copy
               </button>
            </div>
         </div>
      </div>

    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
       <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
       <span className="text-xs font-black text-white">{value}</span>
    </div>
  );
}
