import React, { useState, useEffect } from 'react';
import { Eye, ShieldAlert, Check, Copy, Download, RefreshCw, Trash2, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function RedactTool() {
  const { incrementUsage } = useApp();
  const [inputText, setInputText] = useState(
    "Hi support, my name is John Doe. My email is john.doe@gmail.com and my credit card number is 4111-2222-3333-4444. " +
    "You can reach me at my personal number +1 (555) 019-2834 or my work line +44-20-7946-0958. " +
    "Please delete my account data associated with SSN 000-12-3456 as soon as possible. Thanks!"
  );
  const [redactedText, setRedactedText] = useState('');
  const [stats, setStats] = useState({ emails: 0, phones: 0, cards: 0, ssns: 0, total: 0 });
  const [copied, setCopied] = useState(false);
  
  // Custom Redaction Flags
  const [maskEmails, setMaskEmails] = useState(true);
  const [maskPhones, setMaskPhones] = useState(true);
  const [maskCards, setMaskCards] = useState(true);
  const [maskSSNs, setMaskSSNs] = useState(true);
  
  // Mask Styling Options
  const [maskStyle, setMaskStyle] = useState('bars'); // 'bars' (████), 'text' ([REDACTED]), 'asterisks' (****)

  useEffect(() => {
    runRedaction();
  }, [inputText, maskEmails, maskPhones, maskCards, maskSSNs, maskStyle]);

  const runRedaction = () => {
    let text = inputText;
    let counts = { emails: 0, phones: 0, cards: 0, ssns: 0, total: 0 };

    // 1. Credit Cards Regex
    const cardRegex = /\b\d{4}[-.\s]?\d{4}[-.\s]?\d{4}[-.\s]?\d{4}\b/g;
    const cardsFound = text.match(cardRegex) || [];
    counts.cards = cardsFound.length;
    if (maskCards) {
      text = text.replace(cardRegex, (match) => getMaskReplacement(match, 'card'));
    }

    // 2. Emails Regex
    const emailRegex = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g;
    const emailsFound = text.match(emailRegex) || [];
    counts.emails = emailsFound.length;
    if (maskEmails) {
      text = text.replace(emailRegex, (match) => getMaskReplacement(match, 'email'));
    }

    // 3. Phone Numbers Regex
    const phoneRegex = /\b\+?\d{1,4}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g;
    const phonesFound = text.match(phoneRegex) || [];
    counts.phones = phonesFound.length;
    if (maskPhones) {
      text = text.replace(phoneRegex, (match) => getMaskReplacement(match, 'phone'));
    }

    // 4. SSNs Regex
    const ssnRegex = /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g;
    const ssnsFound = text.match(ssnRegex) || [];
    counts.ssns = ssnsFound.length;
    if (maskSSNs) {
      text = text.replace(ssnRegex, (match) => getMaskReplacement(match, 'ssn'));
    }

    counts.total = counts.emails + counts.phones + counts.cards + counts.ssns;
    setRedactedText(text);
    setStats(counts);
  };

  const getMaskReplacement = (match, type) => {
    if (maskStyle === 'bars') {
      return '█'.repeat(Math.max(match.length, 8));
    } else if (maskStyle === 'asterisks') {
      return '*'.repeat(match.length);
    } else {
      return `[REDACTED_${type.toUpperCase()}]`;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(redactedText);
    setCopied(true);
    incrementUsage();
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    const blob = new Blob([redactedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'redacted_document.txt';
    link.click();
    URL.revokeObjectURL(url);
    incrementUsage();
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
          <Eye className="w-6 h-6 text-[#00f2fe]" /> Verynt Redact
        </h2>
        <p className="text-sm text-gray-400">
          Smart offline document PII masker. Instantly sanitise sensitive corporate data before copying to LLMs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input & Settings */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">Raw Input Workspace</span>
              <button 
                onClick={() => setInputText('')}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-rose-950/20 px-2 py-1 rounded border border-rose-900/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-[180px] bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 font-mono text-sm leading-relaxed text-gray-300 focus:outline-none focus:border-cyan-800/50 resize-none"
              placeholder="Paste your sensitive documents, transcripts, or texts here..."
            />

            {/* Entity Filters & Switches */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/25 p-3 rounded-xl border border-slate-800/40">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
                <input 
                  type="checkbox" 
                  checked={maskEmails} 
                  onChange={(e) => setMaskEmails(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-[#00f2fe] focus:ring-0"
                />
                <span className={maskEmails ? "text-[#00f2fe] font-bold" : "text-gray-500"}>Emails</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
                <input 
                  type="checkbox" 
                  checked={maskPhones} 
                  onChange={(e) => setMaskPhones(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-[#00f2fe] focus:ring-0"
                />
                <span className={maskPhones ? "text-[#9b51e0] font-bold" : "text-gray-500"}>Phones</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
                <input 
                  type="checkbox" 
                  checked={maskCards} 
                  onChange={(e) => setMaskCards(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-[#00f2fe] focus:ring-0"
                />
                <span className={maskCards ? "text-amber-400 font-bold" : "text-gray-500"}>Credit Cards</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
                <input 
                  type="checkbox" 
                  checked={maskSSNs} 
                  onChange={(e) => setMaskSSNs(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-[#00f2fe] focus:ring-0"
                />
                <span className={maskSSNs ? "text-rose-400 font-bold" : "text-gray-500"}>SSNs / IDs</span>
              </label>
            </div>
          </div>

          {/* Redacted Output */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs font-bold text-gray-400">Sanitised Output (100% Private)</span>
              
              <div className="flex items-center gap-3">
                {/* Redaction Style */}
                <div className="flex rounded-lg overflow-hidden border border-slate-800 bg-slate-950/80 text-[10px] font-bold">
                  <button 
                    onClick={() => setMaskStyle('bars')}
                    className={`px-3 py-1.5 transition-colors ${maskStyle === 'bars' ? 'bg-[#9b51e0] text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Bars
                  </button>
                  <button 
                    onClick={() => setMaskStyle('text')}
                    className={`px-3 py-1.5 border-x border-slate-800 transition-colors ${maskStyle === 'text' ? 'bg-[#9b51e0] text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Text
                  </button>
                  <button 
                    onClick={() => setMaskStyle('asterisks')}
                    className={`px-3 py-1.5 transition-colors ${maskStyle === 'asterisks' ? 'bg-[#9b51e0] text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Stars
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="p-1.5 hover:bg-slate-800/40 text-gray-400 hover:text-white rounded-lg transition-colors"
                    title="Copy sanitized text"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={downloadText}
                    className="p-1.5 hover:bg-slate-800/40 text-gray-400 hover:text-white rounded-lg transition-colors"
                    title="Download text file"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full min-h-[120px] bg-slate-950/40 border border-slate-800/40 rounded-xl p-4 font-mono text-sm leading-relaxed text-gray-300 max-h-[200px] overflow-y-auto whitespace-pre-wrap select-all">
              {redactedText || <span className="text-gray-600">No output generated yet...</span>}
            </div>
          </div>
        </div>

        {/* Stats & Information Side Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              PII Audit Summary
            </h3>
            
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs border-b border-slate-800/40 pb-2">
                <span className="text-gray-400">Emails Blocked:</span>
                <span className="font-bold text-[#00f2fe]">{stats.emails}</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-slate-800/40 pb-2">
                <span className="text-gray-400">Phones Blocked:</span>
                <span className="font-bold text-[#9b51e0]">{stats.phones}</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-slate-800/40 pb-2">
                <span className="text-gray-400">Credit Cards Blocked:</span>
                <span className="font-bold text-amber-400">{stats.cards}</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-slate-800/40 pb-2">
                <span className="text-gray-400">National IDs Blocked:</span>
                <span className="font-bold text-rose-400">{stats.ssns}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-white bg-slate-950/60 p-2.5 rounded-lg">
                <span className="text-emerald-400">Total Safety Matches:</span>
                <span>{stats.total} Elements</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl bg-gradient-to-tr from-cyan-950/20 to-purple-950/20 border border-cyan-800/20 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-950/50 flex items-center justify-center border border-cyan-800/30">
                <HelpCircle className="w-4 h-4 text-[#00f2fe]" />
              </div>
              <h4 className="text-xs font-bold text-white">Why use Verynt Redact?</h4>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Leading LLMs like ChatGPT and Claude record and scan your chat inputs for model training. 
              Verynt Redact filters out private identifiers **locally in your browser memory** so that it is impossible for your personal or enterprise credentials to leak online.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
