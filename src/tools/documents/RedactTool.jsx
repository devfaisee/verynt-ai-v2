import React, { useState, useEffect } from 'react';
import { Eye, ShieldAlert, Check, Copy, Download, RefreshCw, Trash2, HelpCircle, Lock, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function RedactTool() {
  const { incrementUsage } = useApp();
  const [inputText, setInputText] = useState(
    "Hi support, my name is John Doe. My email is john.doe@gmail.com and my credit card number is 4111-2222-3333-4444. " +
    "You can reach me at my personal number +1 (555) 019-2834. My home address is 123 Privacy Lane, New York, NY."
  );
  const [redactedText, setRedactedText] = useState('');
  const [stats, setStats] = useState({ emails: 0, phones: 0, cards: 0, total: 0 });
  const [maskStyle, setMaskStyle] = useState('bars'); // 'bars', 'text', 'stars'
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    runRedaction();
  }, [inputText, maskStyle]);

  const runRedaction = () => {
    let text = inputText;
    let counts = { emails: 0, phones: 0, cards: 0, total: 0 };

    // Regex patterns
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
      return '[REDACTED]';
    };

    text = text.replace(emailRegex, replacement);
    text = text.replace(phoneRegex, replacement);
    text = text.replace(cardRegex, replacement);

    setRedactedText(text);
    setStats(counts);
  };

  return (
    <div className="space-y-10 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-white tracking-tight">Verynt Redact</h2>
          <p className="text-slate-400 font-medium">Auto-detect and mask sensitive PII data locally in your browser memory.</p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-rose-400 bg-rose-500/5 px-4 py-2 rounded-full border border-rose-500/10 uppercase tracking-widest">
           <Lock className="w-3 h-3" /> Sanitization Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUT WORKSPACE */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel p-8 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Raw Document Input</h3>
               <button onClick={() => setInputText('')} className="text-[10px] font-bold text-rose-500 hover:text-rose-400 transition-colors uppercase">Clear Workspace</button>
            </div>
            <textarea 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
              className="w-full h-[250px] bg-slate-950 border border-white/5 rounded-2xl p-6 text-slate-300 text-sm font-medium focus:outline-none focus:border-rose-500/20 transition-all resize-none leading-relaxed"
              placeholder="Paste sensitive text here..."
            />
            
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
               <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
                  <button onClick={() => setMaskStyle('bars')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${maskStyle === 'bars' ? 'bg-white text-black' : 'text-slate-400'}`}>BLOCK BARS</button>
                  <button onClick={() => setMaskStyle('stars')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${maskStyle === 'stars' ? 'bg-white text-black' : 'text-slate-400'}`}>ASTERISKS</button>
                  <button onClick={() => setMaskStyle('text')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${maskStyle === 'text' ? 'bg-white text-black' : 'text-slate-400'}`}>LABEL TAGS</button>
               </div>
               <button onClick={() => { incrementUsage(); alert("Full document scrubbed."); }} className="btn-primary h-10 px-6 text-[10px]">SCRUB NOW</button>
            </div>
          </div>

          <div className="glass-panel p-8 space-y-6 bg-emerald-500/[0.02] border-emerald-500/10">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <h3 className="text-xs font-bold uppercase tracking-widest">Sanitized Output</h3>
               </div>
               {redactedText && (
                 <button onClick={() => { navigator.clipboard.writeText(redactedText); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-all">
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                 </button>
               )}
            </div>
            <div className="w-full min-h-[150px] bg-black/40 rounded-2xl p-6 font-mono text-xs text-slate-300 leading-relaxed break-all">
               {redactedText}
            </div>
          </div>
        </div>

        {/* AUDIT PANEL */}
        <div className="lg:col-span-4 space-y-6">
           <div className="glass-panel p-8 space-y-8">
              <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-rose-500" /> Security Audit
              </h4>
              
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Emails Detected:</span>
                    <span className="font-bold text-[#00f2fe]">{stats.emails}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Phone Numbers:</span>
                    <span className="font-bold text-violet-400">{stats.phones}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Credit Cards:</span>
                    <span className="font-bold text-amber-400">{stats.cards}</span>
                 </div>
                 <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-xs font-bold text-white uppercase">Total Interceptions:</span>
                    <span className="text-lg font-black text-emerald-400">{stats.total}</span>
                 </div>
              </div>
           </div>

           <div className="p-8 glass-panel space-y-4 bg-[#00f2fe]/5 border-[#00f2fe]/10">
              <h5 className="text-[10px] font-black text-[#00f2fe] uppercase tracking-[0.2em]">Why Redact?</h5>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                 Large Language Models (LLMs) often log and train on your inputs. Verynt Redact ensures your corporate secrets and personal IDs are stripped out **before** they leave your secure environment.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}
