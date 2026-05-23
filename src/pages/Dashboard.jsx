import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, FileAudio, FileText, Eye, Image, Cpu, Award, HardDrive, Terminal, GraduationCap, Search, Scissors } from 'lucide-react';
import SEO from '../components/SEO';

const tools = [
  {
    id: 'whisper',
    name: 'Verynt Whisper',
    desc: 'High-accuracy local audio & video voice-to-text. Powered by browser neural Whisper.',
    icon: FileAudio,
    color: '#00f2fe',
    tag: 'Transcriber'
  },
  {
    id: 'pdf',
    name: 'DocuChat & Summary',
    desc: 'Index PDFs locally, extract executive summaries, and chat with files offline.',
    icon: FileText,
    color: '#00f2fe',
    tag: 'NLP Vector'
  },
  {
    id: 'pdf-tools',
    name: 'PDF Power Tools',
    desc: 'Merge, split, and manipulate PDF documents entirely in-browser.',
    icon: Scissors,
    color: '#9b51e0',
    tag: 'Utility'
  },
  {
    id: 'ocr',
    name: 'Verynt OCR',
    desc: 'Extract text from images, receipts, and scans with 99% accuracy locally.',
    icon: Search,
    color: '#00f2fe',
    tag: 'Vision OCR'
  },
  {
    id: 'redact',
    name: 'Verynt Redact',
    desc: 'Mask emails, credit cards, SSNs, and phone numbers in browser memory.',
    icon: Eye,
    color: '#9b51e0',
    tag: 'Privacy'
  },
  {
    id: 'clear',
    name: 'Verynt Clear',
    desc: 'Local AI background remover. Edit cutouts, replace colors, and swap backdrops.',
    icon: Image,
    color: '#9b51e0',
    tag: 'Vision Canvas'
  },
  {
    id: 'student',
    name: 'Verynt Student Hub',
    desc: 'Study smart with custom visual flashcards and interactive MCQs running locally.',
    icon: GraduationCap,
    color: '#00f2fe',
    tag: 'Academic'
  },
  {
    id: 'developer',
    name: 'Developer Utilities',
    desc: 'Pretty JSON formatting, Base64 encoding tools, and Regex matching expressions.',
    icon: Terminal,
    color: '#9b51e0',
    tag: 'Dev Utilities'
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-12 fade-in">
      <SEO 
        title="Dashboard" 
        description="Verynt is the absolute gold standard of private, local browser AI utilities. Transcribe, redact, and manipulate documents 100% offline."
      />
      
      {/* HERO PANEL */}
      <div className="text-center max-w-3xl mx-auto space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00f2fe] bg-cyan-950/40 px-3.5 py-2 rounded-full border border-cyan-800/30">
          <Sparkles className="w-4 h-4 text-[#00f2fe]" />
          Introducing Verynt Offline-First AI Utilities
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black font-display text-white tracking-tight leading-[1.05]">
          Private, Local-First AI.<br />
          <span className="text-glow">No Data Leaves Your Device.</span>
        </h1>
        
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Experience high-performance, private AI tools running completely in your browser memory. 
          Zero server latency, zero API data risks, and zero network requirement.
        </p>
      </div>

      {/* LIVE HARDWARE TELEMETRY PANEL */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="glass-panel p-6 rounded-2xl border border-cyan-950/20 text-center relative overflow-hidden">
          <Cpu className="w-8 h-8 text-[#00f2fe] mx-auto mb-3" />
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Local Pipeline</h4>
          <p className="text-xl font-bold font-display text-white">WebGPU Enabled</p>
          <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/20 mt-2 inline-block">
            Hardware Acceleration
          </span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-purple-950/20 text-center relative overflow-hidden">
          <HardDrive className="w-8 h-8 text-[#9b51e0] mx-auto mb-3" />
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Network Latency</h4>
          <p className="text-xl font-bold font-display text-white">0.00 ms (Offline)</p>
          <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900/20 mt-2 inline-block">
            100% Private In-Memory
          </span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800/20 text-center relative overflow-hidden">
          <Award className="w-8 h-8 text-amber-500  mx-auto mb-3" />
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Server AI Cost</h4>
          <p className="text-xl font-bold font-display text-white">$0.00 Cloud Bill</p>
          <span className="text-[10px] text-amber-400 font-semibold bg-amber-950/30 px-2 py-0.5 rounded border border-amber-900/20 mt-2 inline-block">
            100% High-Profit Margins
          </span>
        </div>
      </div>

      {/* CORE AI UTILITY GRID */}
      <div className="space-y-6">
        <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Available Local AI Tools</h3>
          <span className="text-xs text-gray-400">Select any tool to begin running locally</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link 
              key={tool.id}
              to={`/tool/${tool.id}`}
              className="glass-panel glow-card p-6 rounded-2xl cursor-pointer hover:-translate-y-1 transform transition-all group flex flex-col justify-between gap-6"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform" style={{ color: tool.color }}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold font-display text-white">{tool.name}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-900/20 px-2.5 py-1 rounded-lg w-max">
                {tool.tag}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
