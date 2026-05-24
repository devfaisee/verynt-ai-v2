import React, { useState, useEffect } from 'react';
import { FileSignature, Download, Play, Copy, RefreshCw, FileText, LayoutGrid, CheckCircle, Terminal } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function DocBuilderTool() {
  const { incrementUsage, triggerLoader } = useApp();
  const [markdown, setMarkdown] = useState(`# Verynt Studio: Launch Roadmap

This document outlines the professional deployment and marketing sequence for the launch of Verynt.

## Core Milestones
- **Local-First PWA Integration:** Completed air-gapped service worker caching layers.
- **Diamond-Tier Workspaces:** Added receipts parsing, local vector databases, and mindmap visualizers.
- **Stripe Supporter Gate:** Placed high-converting supporters tiers ($12/year).

---

## Technical Manifest
\`\`\`javascript
const veryntConfig = {
  zeroServerCosts: true,
  hardwareAcceleration: "WebGPU",
  monetization: "Ads + Supporter Tier"
};
\`\`\`

> Note: Verify that your local caching buffers are fully primed before checking flight-mode offline execution.
`);
  
  const [activeTemplate, setActiveTemplate] = useState('roadmap'); // roadmap, resume, contract
  const [activeStyle, setActiveStyle] = useState('clean'); // clean, dark, cobalt, serif
  const [htmlOutput, setHtmlOutput] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Telemetry Console State
  const [telemetryLogs, setTelemetryLogs] = useState([]);

  const addLog = (message) => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    setTelemetryLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  const templates = {
    roadmap: `# Verynt Studio: Launch Roadmap

This document outlines the professional deployment and marketing sequence for the launch of Verynt.

## Core Milestones
- **Local-First PWA Integration:** Completed air-gapped service worker caching layers.
- **Diamond-Tier Workspaces:** Added receipts parsing, local vector databases, and mindmap visualizers.
- **Stripe Supporter Gate:** Placed high-converting supporters tiers ($12/year).

---

## Technical Manifest
\`\`\`javascript
const veryntConfig = {
  zeroServerCosts: true,
  hardwareAcceleration: "WebGPU",
  monetization: "Ads + Supporter Tier"
};
\`\`\`

> Note: Verify that your local caching buffers are fully primed before checking flight-mode offline execution.
`,
    resume: `# ALEX MERCER
## Senior local-first AI Architect | mercer@verynt.com

Dedicated software architect with 8+ years of experience engineering high-performance WebGPU browser environments and local IndexedDB database indices.

### Professional Experience
* **Lead AI Engineer | Verynt Studio (2024 - Present)**
  * Migrated full multithreaded AI models to run 100% on client browsers, dropping GPU server expenses to $0.
  * Designed modular lazy-loaded routing structures boosting SEO scores.
* **Senior Frontend Architect | TechLab (2020 - 2024)**
  * Pioneered early-stage WASM database integrations cutting sync latencies by 40%.

### Technical Competencies
- **Languages:** JavaScript, TypeScript, Rust, SQL, Python
- **Environments:** WebGPU, WebAssembly, Web Audio API, Service Workers
`,
    contract: `# MUTUAL NON-DISCLOSURE AGREEMENT (NDA)

This Agreement is entered into by and between the undersigned parties to protect sensitive local-first software weights and proprietary data schemas.

### 1. Proprietary Information
All weights, schemas, regex tables, and client-side pipeline configurations stored under the **verynt-cache-v1** browser context shall be treated as strictly confidential.

### 2. Standard Terms
- **Duration:** This confidentiality obligation remains binding for a period of five (5) years from the execution date.
- **Arbitration:** Any disputes arising out of or in connection with this agreement shall be settled locally under on-device simulations.

---

**IN WITNESS WHEREOF**, the parties have signed this Agreement.

**Party A:** Verynt Technologies Ltd.  
**Party B:** Confidential Partner
`
  };

  const stylePresets = {
    clean: {
      name: 'Cupertino Clean',
      wrapperClass: 'bg-white text-slate-800 p-12 font-sans rounded-2xl border border-slate-200/50 shadow-2xl',
      h1: 'text-3xl font-black text-slate-900 border-b border-slate-100 pb-3 mb-6',
      h2: 'text-2xl font-bold text-slate-800 mt-8 mb-4 border-b border-slate-50 pb-2',
      p: 'text-sm text-slate-600 leading-relaxed mb-4',
      ul: 'list-disc pl-6 mb-6 text-sm text-slate-600 space-y-2',
      code: 'bg-slate-50 border border-slate-100 rounded-lg p-4 font-mono text-xs text-slate-700 block whitespace-pre-wrap my-4',
      quote: 'border-l-4 border-slate-300 pl-4 py-1 italic text-slate-500 my-6 bg-slate-50/50 rounded-r-lg pr-4'
    },
    dark: {
      name: 'Obsidian Dark',
      wrapperClass: 'bg-[#08090d] text-slate-300 p-12 font-sans rounded-2xl border border-white/5 shadow-2xl',
      h1: 'text-3xl font-black text-white border-b border-white/5 pb-3 mb-6 tracking-tight',
      h2: 'text-2xl font-bold text-white mt-8 mb-4 border-b border-white/[0.02] pb-2',
      p: 'text-sm text-slate-400 leading-relaxed mb-4',
      ul: 'list-disc pl-6 mb-6 text-sm text-slate-400 space-y-2',
      code: 'bg-black/60 border border-white/5 rounded-lg p-4 font-mono text-xs text-[#00f2fe] block whitespace-pre-wrap my-4',
      quote: 'border-l-4 border-[#9b51e0] pl-4 py-1 italic text-slate-500 my-6 bg-white/[0.01] rounded-r-lg pr-4'
    },
    cobalt: {
      name: 'Cyberpunk Cobalt',
      wrapperClass: 'bg-[#060b13] text-[#a0c5e8] p-12 font-mono rounded-2xl border border-[#00f2fe]/20 shadow-2xl',
      h1: 'text-3xl font-black text-[#00f2fe] border-b border-[#00f2fe]/20 pb-3 mb-6 tracking-tighter uppercase',
      h2: 'text-2xl font-bold text-[#9b51e0] mt-8 mb-4 border-b border-[#9b51e0]/20 pb-2',
      p: 'text-sm text-[#88b0d4] leading-relaxed mb-4',
      ul: 'list-square pl-6 mb-6 text-sm text-[#88b0d4] space-y-2',
      code: 'bg-black/80 border border-[#00f2fe]/20 rounded-lg p-4 font-mono text-xs text-[#30d158] block whitespace-pre-wrap my-4',
      quote: 'border-l-4 border-[#30d158] pl-4 py-1 italic text-[#588cb5] my-6 bg-[#00f2fe]/5 rounded-r-lg pr-4'
    },
    serif: {
      name: 'Editorial Serif',
      wrapperClass: 'bg-[#faf9f6] text-[#222222] p-12 font-serif rounded-2xl border border-amber-900/10 shadow-2xl',
      h1: 'text-4xl font-extrabold text-amber-950 border-b border-amber-900/10 pb-4 mb-6 tracking-tight',
      h2: 'text-2xl font-bold text-amber-900 mt-8 mb-4 pb-2 border-b border-amber-900/5',
      p: 'text-base text-[#333333] leading-relaxed mb-5',
      ul: 'list-disc pl-6 mb-6 text-base text-[#333333] space-y-2.5',
      code: 'bg-stone-100 border border-stone-200 rounded p-4 font-mono text-xs text-stone-800 block whitespace-pre-wrap my-4',
      quote: 'border-l-4 border-amber-800 pl-5 py-2 italic text-stone-600 my-6 bg-stone-50 rounded-r pr-4'
    }
  };

  // Custom Regex Markdown-to-HTML parser
  const parseMarkdown = (md, style) => {
    let html = md;
    html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    html = html.replace(/^---$/gm, '<hr class="my-8 border-t border-current opacity-10" />');
    html = html.replace(/```(?:javascript|js|css|html)?\n([\s\S]*?)\n```/g, (_, code) => {
      return `<pre class="${style.code}"><code>${code}</code></pre>`;
    });
    html = html.replace(/^>\s+(.+)$/gm, `<blockquote class="${style.quote}">$1</blockquote>`);
    html = html.replace(/^#\s+(.+)$/gm, `<h1 class="${style.h1}">$1</h1>`);
    html = html.replace(/^##\s+(.+)$/gm, `<h2 class="${style.h2}">$1</h2>`);
    html = html.replace(/^###\s+(.+)$/gm, `<h3 class="text-xl font-bold mt-6 mb-3 uppercase tracking-wider">$1</h3>`);

    html = html.replace(/(?:^[-*]\s+.+\n?)+/gm, (list) => {
      const items = list.trim().split('\n').map(li => {
        const itemText = li.replace(/^[-*]\s+/, '');
        return `<li>${itemText}</li>`;
      }).join('');
      return `<ul class="${style.ul}">${items}</ul>`;
    });

    html = html.replace(/\*\*(.+?)\*\"/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    const blocks = html.split('\n\n');
    html = blocks.map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<h') || trimmed.startsWith('<pre') || trimmed.startsWith('<ul') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<hr')) {
        return trimmed;
      }
      return `<p class="${style.p}">${trimmed.replace(/\n/g, '<br />')}</p>`;
    }).join('\n');

    return html;
  };

  useEffect(() => {
    setHtmlOutput(parseMarkdown(markdown, stylePresets[activeStyle]));
  }, [markdown, activeStyle]);

  useEffect(() => {
    addLog("Initializing local Markdown parsing pipeline...");
    addLog("Theme engines calibrated.");
  }, []);

  const loadTemplate = (id) => {
    setActiveTemplate(id);
    setMarkdown(templates[id]);
    incrementUsage();
    addLog(`Loaded document template: "${id.toUpperCase()}"`);
  };

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addLog("Copied raw markdown contents to clipboard.");
  };

  const exportMarkdownFile = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verynt_${activeTemplate}_document.md`;
    a.click();
    URL.revokeObjectURL(url);
    incrementUsage();
    addLog("Exported raw .md text asset to local file system.");
  };

  const compileLocalPDF = () => {
    incrementUsage();
    addLog("Triggering local PDF print compiler pipeline...");
    
    triggerLoader("Formatting styling structures and loading browser print engine...", () => {
      addLog("Dispatched print command to sandboxed V8 frame.");
      const printWindow = window.open('', '_blank');
      
      const styles = activeStyle === 'serif' ? `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        body { font-family: 'Playfair Display', Georgia, serif; background: #faf9f6; color: #222; }
      ` : `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background: white; color: #1e293b; }
      `;

      printWindow.document.write(`
        <html>
          <head>
            <title>Verynt Compile Hub</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              ${styles}
              @media print {
                body { background: white; color: black; padding: 2cm; }
                .no-print { display: none; }
                hr { border-color: #cbd5e1 !important; }
              }
            </style>
          </head>
          <body class="p-16 max-w-4xl mx-auto">
            <div class="no-print mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
              <div>
                <h4 class="text-sm font-bold text-slate-800">Print Calibration Hub</h4>
                <p class="text-xs text-slate-500">All conversion logic compiles 100% locally in your client sandboxed memory.</p>
              </div>
              <button onclick="window.print()" class="px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all">Download PDF / Print</button>
            </div>
            <div class="prose max-w-none">
              ${htmlOutput}
            </div>
            <script>
              window.onload = () => {
                setTimeout(() => window.print(), 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    });
  };

  const handleTextChange = (val) => {
    setMarkdown(val);
    if (Math.random() < 0.05) addLog("Reparsing markdown structure syntax...");
  };

  return (
    <div className="space-y-10 animate-in selection:bg-[#00f2fe]/20">
      
      {/* Template & Theme Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
        
        {/* Templates Selector */}
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
          {[
            { id: 'roadmap', name: 'Roadmap' },
            { id: 'resume', name: 'Resume' },
            { id: 'contract', name: 'Contract' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => loadTemplate(t.id)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTemplate === t.id ? 'bg-white text-black shadow-2xl' : 'text-slate-500 hover:text-white'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Styles Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mr-2">Render Presets:</span>
          <div className="flex gap-2">
            {Object.keys(stylePresets).map(styleId => (
              <button
                key={styleId}
                onClick={() => { setActiveStyle(styleId); addLog(`Selected preset style: "${stylePresets[styleId].name}"`); }}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                  activeStyle === styleId 
                    ? 'bg-[#00f2fe]/10 border-[#00f2fe]/30 text-[#00f2fe] shadow-glow' 
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                }`}
              >
                {stylePresets[styleId].name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Editor & Preview Split Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Markdown Area (Left) */}
        <div className="lg:col-span-5 flex flex-col h-full space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <FileSignature className="w-4 h-4" /> Markdown Core Source
            </span>
            <div className="flex gap-3">
              <button 
                onClick={copyMarkdown}
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button 
                onClick={exportMarkdownFile}
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <textarea
            value={markdown}
            onChange={(e) => handleTextChange(e.target.value)}
            className="w-full min-h-[350px] bg-black/40 border border-white/5 rounded-[32px] p-8 font-mono text-xs text-slate-400 focus:outline-none focus:border-white/10 transition-all resize-y custom-scrollbar text-left"
            placeholder="Write your markdown files..."
          />

          {/* Telemetry Console (DocBuilder) */}
          <div className="space-y-4 pt-4 text-left">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Terminal className="w-4 h-4" /> System Telemetry Log
            </span>
            <div className="bg-black/40 border border-white/5 rounded-[32px] p-6 font-mono text-[9px] text-slate-500 overflow-y-auto max-h-[140px] custom-scrollbar space-y-1">
              {telemetryLogs.map((log, i) => (
                <div key={i} className={log.includes('successfully') || log.includes('Triggering') ? 'text-[#00f2fe]' : 'text-slate-500'}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Area (Right) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" /> Live Render Preview
            </span>
            <button 
              onClick={compileLocalPDF}
              className="pill-button pill-button-primary h-10 px-6 gap-2 text-[9px] uppercase tracking-widest"
            >
              <FileText className="w-3.5 h-3.5" /> Compile Local PDF
            </button>
          </div>

          <div className="h-full min-h-[500px] bg-black/20 border border-white/5 rounded-[40px] p-4 lg:p-8 overflow-y-auto max-h-[600px] custom-scrollbar">
            <div 
              className={stylePresets[activeStyle].wrapperClass}
              dangerouslySetInnerHTML={{ __html: htmlOutput }}
            />
          </div>
        </div>

      </div>

    </div>
  );
}
