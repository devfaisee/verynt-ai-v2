import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Database, Zap, Cpu, FileText, FileAudio, ImageIcon, Search, PenTool, GraduationCap, Terminal, Globe, Gavel } from 'lucide-react';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { TOOLS_REGISTRY, CATEGORIES } from '../tools/REGISTRY';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function Dashboard() {
  return (
    <div className="space-y-32">
      <SEO title="Studio Explorer" description="Bespoke local-first AI tools for everyone." />
      
      {/* Editorial Hero */}
      <section className="max-w-4xl mx-auto text-center space-y-12 py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block"
        >
          <span className="text-[10px] font-black tracking-[0.4em] text-[#00f2fe] uppercase bg-[#00f2fe]/5 px-6 py-2.5 rounded-full border border-[#00f2fe]/20">
            Precision Intelligence
          </span>
        </motion.div>
        
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] text-white">
          Absolute Privacy.<br />
          <span className="text-white/20 italic">Native Speed.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Experience world-class AI tools running directly in your browser memory. 
          Zero server overhead. Zero data exposure.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
          <button onClick={() => document.getElementById('explorer').scrollIntoView({ behavior: 'smooth' })} className="pill-button pill-button-primary h-16 px-12 text-lg shadow-[0_20px_50px_rgba(255,255,255,0.1)]">Start Exploring</button>
          <Link to="/tool/model-manager" className="pill-button pill-button-ghost h-16 px-12 text-lg">Registry Stats</Link>
        </div>
      </section>

      {/* Dynamic Tool Explorer */}
      <motion.div 
        id="explorer"
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-40"
      >
        {CATEGORIES.map(cat => (
          <section key={cat.id} className="space-y-16">
            <motion.div variants={item} className="space-y-4 border-l-4 border-white/10 pl-10">
                <div className="flex items-center gap-4">
                   <cat.icon className="w-8 h-8 text-[#00f2fe]" />
                   <h2 className="text-5xl font-black text-white tracking-tight">{cat.name}</h2>
                </div>
                <p className="text-xl text-slate-500 font-medium max-w-2xl">{cat.desc}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {TOOLS_REGISTRY.filter(t => t.category === cat.id).map(tool => (
                <motion.div key={tool.id} variants={item}>
                  <Link 
                    to={`/tool/${tool.id}`}
                    className="glass-card p-12 group flex flex-col justify-between h-[380px] hover:bg-white/[0.03] transition-all"
                  >
                    <div className="space-y-10">
                       <div className="w-16 h-16 rounded-[28px] bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white transition-all group-hover:text-black text-slate-400">
                          <tool.icon className="w-8 h-8" />
                       </div>
                       <div className="space-y-3">
                          <h4 className="text-2xl font-bold text-white tracking-tight leading-tight">{tool.name}</h4>
                          <p className="text-sm text-slate-500 font-medium leading-relaxed">{tool.description}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-600 group-hover:text-[#00f2fe] transition-colors uppercase tracking-[0.4em]">
                       Initialize Studio <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-3" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </motion.div>

      {/* Ad Placement: Global Footer Banner */}
      <section className="py-20 border-y border-white/5 bg-white/[0.01]">
         <div className="studio-container flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-2 text-center md:text-left">
               <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Sponsored Placement</p>
               <h3 className="text-2xl font-bold text-white">Support Local AI Open-Source</h3>
               <p className="text-sm text-slate-500 font-medium">Your non-intrusive support helps us keep these tools free and private.</p>
            </div>
            <div className="w-full md:w-[400px] h-32 glass-card flex items-center justify-center border-dashed">
               <p className="text-xs font-black text-slate-700 uppercase tracking-widest italic">Ad Space Buffer</p>
            </div>
         </div>
      </section>

      {/* Technical Manifesto */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-16 py-32">
           <TrustItem icon={ShieldCheck} title="Total Isolation" desc="Compute occurs within the browser V8 sandbox. Data never leaves physical memory." />
           <TrustItem icon={Database} title="Weight Registry" desc="Manage local neural weights for Whisper, BERT, and Llama directly in your dashboard." />
           <TrustItem icon={Zap} title="Native Performance" desc="Leverage WebGPU and WASM SIMD for hardware-accelerated inference speeds." />
      </section>
    </div>
  );
}

function TrustItem({ icon: Icon, title, desc }) {
  return (
    <div className="space-y-6 text-center md:text-left">
       <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto md:mx-0 shadow-2xl">
          <Icon className="w-8 h-8 text-white" />
       </div>
       <div className="space-y-3">
          <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}
