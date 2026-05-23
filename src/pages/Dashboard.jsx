import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Cpu, Award, HardDrive, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import SEO from '../components/SEO';
import { TOOLS_REGISTRY, CATEGORIES } from '../tools/REGISTRY';

export default function Dashboard() {
  return (
    <div className="space-y-32 fade-in">
      <SEO 
        title="Dashboard" 
        description="The absolute gold standard of private, local browser AI. Transcribe, redact, and manipulate documents 100% offline."
      />
      
      {/* HERO SECTION */}
      <section className="text-center max-w-5xl mx-auto space-y-12">
        <div className="inline-flex items-center gap-3 text-[11px] font-bold tracking-[0.2em] text-[#00f2fe] bg-[#00f2fe]/5 px-6 py-3 rounded-full border border-[#00f2fe]/20 uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          The future of private intelligence is local
        </div>
        
        <h1 className="text-7xl md:text-9xl font-black tracking-tight text-white leading-[0.85]">
          Absolute Privacy.<br />
          <span className="text-gradient">Local AI Engine.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
          Experience world-class AI tools running directly in your browser memory. 
          Zero server logs, zero data training, and zero latency.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
          <button className="btn-primary w-full sm:w-auto h-16 px-10 text-lg shadow-[0_0_40px_rgba(255,255,255,0.1)]">Get Started Free</button>
          <button className="btn-ghost w-full sm:w-auto h-16 px-10 text-lg">Read Manifesto</button>
        </div>
      </section>

      {/* CATEGORIES & TOOLS */}
      {CATEGORIES.map(category => (
        <section key={category.id} className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <category.icon className="w-6 h-6 text-[#00f2fe]" />
                <h2 className="text-3xl font-bold text-white tracking-tight">{category.name}</h2>
              </div>
              <p className="text-slate-500 font-medium ml-9">High-performance local {category.id} processing units.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {TOOLS_REGISTRY.filter(t => t.category === category.id).map((tool) => (
              <Link 
                key={tool.id}
                to={`/tool/${tool.id}`}
                className="glass-panel p-8 group flex flex-col justify-between gap-12 hover:border-[#00f2fe]/30"
              >
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-[#00f2fe]/10 group-hover:text-[#00f2fe] text-slate-400">
                    <tool.icon className="w-7 h-7" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xl font-bold text-white leading-tight">{tool.name}</h4>
                      {tool.isPro && <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                    </div>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 group-hover:text-white transition-colors uppercase tracking-widest">
                    Launch Module <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                  {tool.models && (
                    <span className="text-[9px] font-bold text-[#00f2fe]/60 bg-[#00f2fe]/5 px-2 py-0.5 rounded border border-[#00f2fe]/10">
                      {tool.models[0].toUpperCase()}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* GLOBAL TRUST METRICS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-20 border-y border-white/5">
        <div className="text-center space-y-4 p-10">
          <div className="w-20 h-20 rounded-full bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center mx-auto">
             <ShieldCheck className="w-10 h-10 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-white">100% Private</h3>
          <p className="text-slate-500 font-medium">Your data never leaves your device. We use zero cloud servers for AI processing.</p>
        </div>
        <div className="text-center space-y-4 p-10">
          <div className="w-20 h-20 rounded-full bg-[#00f2fe]/5 border border-[#00f2fe]/20 flex items-center justify-center mx-auto">
             <Cpu className="w-10 h-10 text-[#00f2fe]" />
          </div>
          <h3 className="text-2xl font-bold text-white">Hardware Accelerated</h3>
          <p className="text-slate-500 font-medium">Native performance via WebGPU and WASM SIMD. Lightning fast local execution.</p>
        </div>
        <div className="text-center space-y-4 p-10">
          <div className="w-20 h-20 rounded-full bg-amber-500/5 border border-amber-500/20 flex items-center justify-center mx-auto">
             <Award className="w-10 h-10 text-amber-500" />
          </div>
          <h3 className="text-2xl font-bold text-white">High Reliability</h3>
          <p className="text-slate-500 font-medium">Works perfectly in airplane mode or low-connectivity environments. Zero API downtime.</p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="glass-panel p-20 text-center space-y-8 bg-gradient-to-b from-white/[0.03] to-transparent">
        <h2 className="text-5xl font-bold text-white tracking-tight">Ready to reclaim your privacy?</h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">Join 50,000+ users who process their sensitive documents and media locally with Verynt.</p>
        <button className="btn-primary h-16 px-12 text-lg">Start Using Verynt Pro</button>
      </section>

    </div>
  );
}
