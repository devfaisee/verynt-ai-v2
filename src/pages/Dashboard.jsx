import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Database, Zap, Cpu } from 'lucide-react';
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
    <div className="space-y-24 md:space-y-32 lg:space-y-48">
      <SEO title="Studio Explorer" description="Bespoke local-first AI tools for everyone." />
      
      {/* Editorial Responsive Hero */}
      <section className="max-w-5xl mx-auto text-center space-y-8 md:space-y-12 py-12 md:py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block"
        >
          <span className="text-[9px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.4em] text-[#00f2fe] uppercase bg-[#00f2fe]/5 px-5 md:px-6 py-2 md:py-2.5 rounded-full border border-[#00f2fe]/20">
            Professional Studio Suite
          </span>
        </motion.div>
        
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] text-white">
          AI Tools That<br />
          <span className="text-white/20 italic">Run Locally.</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed px-4">
          No cloud uploads. No subscription fees. High-performance AI tools that respect your privacy and run at native speed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pt-6 md:pt-10 px-4">
          <button onClick={() => document.getElementById('explorer').scrollIntoView({ behavior: 'smooth' })} className="pill-button pill-button-primary w-full sm:w-auto px-10 shadow-[0_20px_50px_rgba(255,255,255,0.1)]">Start Exploring</button>
          <Link to="/tool/model-manager" className="pill-button pill-button-ghost w-full sm:w-auto px-10">Registry Stats</Link>
        </div>
      </section>

      {/* Responsive Dynamic Tool Explorer */}
      <motion.div 
        id="explorer"
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-24 md:space-y-40"
      >
        {CATEGORIES.map(cat => (
          <section key={cat.id} className="space-y-12 md:space-y-16">
            <motion.div variants={item} className="space-y-3 md:space-y-4 border-l-2 md:border-l-4 border-white/10 pl-6 md:pl-10">
                <div className="flex items-center gap-3 md:gap-4">
                   <cat.icon className="w-6 h-6 md:w-8 md:h-8 text-[#00f2fe]" />
                   <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">{cat.name}</h2>
                </div>
                <p className="text-base sm:text-lg md:text-xl text-slate-500 font-medium max-w-2xl">{cat.desc}</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {TOOLS_REGISTRY.filter(t => t.category === cat.id).map(tool => (
                <motion.div key={tool.id} variants={item}>
                  <Link 
                    to={`/tool/${tool.id}`}
                    className="glass-card p-8 md:p-12 group flex flex-col justify-between h-[300px] sm:h-[340px] md:h-[380px] hover:bg-white/[0.03] transition-all"
                  >
                    <div className="space-y-6 md:space-y-10">
                       <div className="w-12 h-12 md:w-16 md:h-16 rounded-[20px] md:rounded-[28px] bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white transition-all group-hover:text-black text-slate-400">
                          <tool.icon className="w-6 h-6 md:w-8 md:h-8" />
                       </div>
                       <div className="space-y-2 md:space-y-3">
                          <h4 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight">{tool.name}</h4>
                          <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed line-clamp-3">{tool.description}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-black text-slate-600 group-hover:text-[#00f2fe] transition-colors uppercase tracking-[0.3em] md:tracking-[0.4em]">
                       Initialize Studio <ArrowRight className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover:translate-x-3" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </motion.div>

      {/* Trust Section - Responsive Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 py-24 md:py-32 border-t border-white/5 px-4">
           <TrustItem icon={ShieldCheck} title="Total Isolation" desc="Compute occurs within the browser V8 sandbox. Data never leaves physical memory." />
           <TrustItem icon={Database} title="Weight Registry" desc="Manage local neural weights for Whisper, BERT, and Llama directly in your dashboard." />
           <TrustItem icon={Zap} title="Native Performance" desc="Leverage WebGPU and WASM SIMD for hardware-accelerated inference speeds." />
      </section>
    </div>
  );
}

function TrustItem({ icon: Icon, title, desc }) {
  return (
    <div className="space-y-4 md:space-y-6 text-center md:text-left">
       <div className="w-14 h-14 md:w-16 md:h-16 rounded-[24px] md:rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto md:mx-0 shadow-2xl">
          <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
       </div>
       <div className="space-y-2 md:space-y-3">
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">{title}</h3>
          <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}
