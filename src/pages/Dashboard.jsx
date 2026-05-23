import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, FileAudio, FileText, Eye, Image, Cpu, Award, HardDrive, Terminal, GraduationCap, Search, Scissors, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const tools = [
  {
    id: 'whisper',
    name: 'Verynt Whisper',
    desc: 'Local high-accuracy voice-to-text transcription.',
    icon: FileAudio,
    color: 'teal'
  },
  {
    id: 'pdf',
    name: 'DocuChat AI',
    desc: 'Intelligent PDF indexing and chat interaction.',
    icon: FileText,
    color: 'blue'
  },
  {
    id: 'pdf-tools',
    name: 'PDF Power Tools',
    desc: 'Professional merge and split capabilities.',
    icon: Scissors,
    color: 'violet'
  },
  {
    id: 'ocr',
    name: 'OCR Scanner',
    desc: 'Structured text extraction from images.',
    icon: Search,
    color: 'teal'
  },
  {
    id: 'redact',
    name: 'PII Redactor',
    desc: 'Privacy-first document sanitization engine.',
    icon: Eye,
    color: 'violet'
  },
  {
    id: 'clear',
    name: 'Verynt Clear',
    desc: 'High-fidelity AI background removal.',
    icon: Image,
    color: 'blue'
  },
  {
    id: 'student',
    name: 'Student Hub',
    desc: 'Academic flashcards and quiz generators.',
    icon: GraduationCap,
    color: 'teal'
  },
  {
    id: 'developer',
    name: 'Dev Utilities',
    desc: 'Essential JSON, B64, and Regex tools.',
    icon: Terminal,
    color: 'violet'
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-32 fade-in">
      <SEO 
        title="Dashboard" 
        description="The ultimate private AI workspace. Transcribe, redact, and manipulate documents 100% locally."
      />
      
      {/* HERO SECTION */}
      <section className="text-center max-w-4xl mx-auto space-y-10">
        <div className="inline-flex items-center gap-3 text-[11px] font-bold tracking-widest text-[#00f2fe] bg-[#00f2fe]/5 px-5 py-2.5 rounded-full border border-[#00f2fe]/20 uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          The future of private intelligence
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white leading-[0.9]">
          Absolute Privacy.<br />
          <span className="text-gradient">Local Intelligence.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
          High-performance AI tools running directly in your browser. 
          No server logs, no data training, and zero network latency.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <button className="btn-primary w-full sm:w-auto h-14 text-base">Get Started Free</button>
          <button className="btn-ghost w-full sm:w-auto h-14 text-base">Request Enterprise</button>
        </div>
      </section>

      {/* TOOLS GRID */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">Engine Suite</h2>
            <p className="text-slate-500 font-medium">Select a module to begin local processing.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> WebGPU Ready</span>
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> 100% Private</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Link 
              key={tool.id}
              to={`/tool/${tool.id}`}
              className={`glass-panel p-8 group flex flex-col justify-between gap-12 ${tool.color === 'teal' ? 'card-glow-teal' : 'card-glow-violet'}`}
            >
              <div className="space-y-6">
                <div className={`w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:-rotate-3 ${tool.color === 'teal' ? 'text-[#00f2fe]' : 'text-[#8b5cf6]'}`}>
                  <tool.icon className="w-7 h-7" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl font-bold text-white leading-tight">{tool.name}</h4>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 group-hover:text-white transition-colors uppercase tracking-widest">
                Launch Module <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* METRICS / TRUST SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-panel p-10 space-y-4">
          <Cpu className="w-8 h-8 text-[#00f2fe]" />
          <h3 className="text-2xl font-bold text-white">Client-Side</h3>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">Models run locally using WebGPU and WASM. Your device is the server.</p>
        </div>
        <div className="glass-panel p-10 space-y-4">
          <HardDrive className="w-8 h-8 text-[#8b5cf6]" />
          <h3 className="text-2xl font-bold text-white">Zero Cloud</h3>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">Data never hits our servers. We couldn't read your files even if we wanted to.</p>
        </div>
        <div className="glass-panel p-10 space-y-4">
          <Award className="w-8 h-8 text-[#3b82f6]" />
          <h3 className="text-2xl font-bold text-white">High Margin</h3>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">0 server costs allows us to offer premium tools at a fraction of the cost.</p>
        </div>
      </section>
    </div>
  );
}
