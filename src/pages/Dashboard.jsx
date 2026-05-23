import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, FileAudio, FileText, Eye, Image as ImageIcon, Cpu, Award, HardDrive, Terminal, GraduationCap, Search, Scissors, ArrowRight, Layers, ShieldCheck, Zap } from 'lucide-react';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';

const categories = [
  { id: 'audio', name: 'Acoustic Intelligence', desc: 'Neural audio and speech processing units.' },
  { id: 'vision', name: 'Visual Perception', desc: 'Advanced computer vision and image optics.' },
  { id: 'logic', name: 'Semantic Logic', desc: 'High-fidelity document and text analysis.' }
];

const tools = [
  { id: 'whisper', name: 'Whisper Studio', desc: 'Audio-to-text with precision timestamps.', icon: FileAudio, cat: 'audio', color: '#00f2fe' },
  { id: 'voiceforge', name: 'VoiceForge', desc: 'Neural synthesis of human speech signals.', icon: GraduationCap, cat: 'audio', color: '#bf5af2' },
  { id: 'docuchat', name: 'DocuChat AI', desc: 'Interactive PDF semantic search engine.', icon: FileText, cat: 'logic', color: '#64d2ff' },
  { id: 'redact', name: 'Privacy Redact', desc: 'Zero-cloud PII masking and document sanitization.', icon: ShieldCheck, cat: 'logic', color: '#ff375f' },
  { id: 'clear', name: 'Vision Clear', desc: 'High-fidelity subject isolation and background optics.', icon: ImageIcon, cat: 'vision', color: '#30d158' },
  { id: 'scale', name: 'Vision Scale', desc: 'Neural upscaling and resolution enhancement.', icon: Layers, cat: 'vision', color: '#ffd60a' },
  { id: 'ocr', name: 'Vision OCR', desc: 'Structured text extraction from visual data.', icon: Search, cat: 'vision', color: '#ff9f0a' },
  { id: 'dev-utils', name: 'Studio Utils', desc: 'Low-level developer and data formatting tools.', icon: Terminal, cat: 'logic', color: '#6e6e73' }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function Dashboard() {
  return (
    <div className="space-y-32">
      <SEO title="Studio Explorer" description="Bespoke local-first AI tools built for privacy and performance." />
      
      {/* Editorial Hero */}
      <section className="max-w-4xl mx-auto text-center space-y-10 py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
        >
          <span className="text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase bg-white/5 px-6 py-2 rounded-full border border-white/10">
            Precision Intelligence
          </span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 1 }}
          className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] text-white"
        >
          Absolute Privacy.<br />
          <span className="text-white/30 italic">Native Speed.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed"
        >
          Verynt Studio brings world-class neural models directly to your browser memory. 
          Zero server overhead. Zero data exposure.
        </motion.p>
      </section>

      {/* Categorized Tool Explorer */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-32"
      >
        {categories.map(cat => (
          <section key={cat.id} className="space-y-12">
            <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
               <div className="space-y-2">
                  <h2 className="text-4xl font-bold text-white tracking-tight">{cat.name}</h2>
                  <p className="text-slate-500 font-medium">{cat.desc}</p>
               </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {tools.filter(t => t.cat === cat.id).map(tool => (
                <motion.div key={tool.id} variants={item}>
                  <Link 
                    to={`/tool/${tool.id}`}
                    className="glass-card p-10 group flex flex-col justify-between h-[360px]"
                  >
                    <div className="space-y-8">
                       <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-white group-hover:text-black text-white shadow-2xl">
                          <tool.icon className="w-8 h-8" />
                       </div>
                       <div className="space-y-3">
                          <h4 className="text-2xl font-bold text-white tracking-tight leading-tight">{tool.name}</h4>
                          <p className="text-sm text-slate-500 font-medium leading-relaxed">{tool.desc}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-600 group-hover:text-white transition-colors uppercase tracking-[0.2em]">
                       Launch Studio <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </motion.div>

      {/* Technical Manifesto Section */}
      <section className="py-32 border-y border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
           <ManifestoItem 
             icon={Cpu} 
             title="Hardware Access" 
             desc="Native performance via WebGPU and WASM SIMD, bypassing traditional cloud bottlenecks." 
           />
           <ManifestoItem 
             icon={ShieldCheck} 
             title="Air-Gapped by Design" 
             desc="Your device is the server. Data isolation is physical, not just logical." 
           />
           <ManifestoItem 
             icon={Award} 
             title="Sustainable Margin" 
             desc="Zero operational AI costs allow for higher fidelity tools at democratic price points." 
           />
        </div>
      </section>

      {/* Large Studio CTA */}
      <section className="text-center py-20">
         <motion.div 
           whileInView={{ opacity: 1, scale: 1 }}
           initial={{ opacity: 0, scale: 0.9 }}
           className="glass-card p-24 bg-gradient-to-br from-white/[0.03] to-transparent border-white/10 space-y-10"
         >
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight">The future is on-device.</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">Join the new standard of private, high-performance computing.</p>
            <button className="pill-button pill-button-primary h-16 px-12 text-lg mx-auto">Initialize Verynt Pro</button>
         </motion.div>
      </section>
    </div>
  );
}

function ManifestoItem({ icon: Icon, title, desc }) {
  return (
    <div className="space-y-6 text-center md:text-left">
       <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto md:mx-0">
          <Icon className="w-6 h-6 text-slate-400" />
       </div>
       <div className="space-y-3">
          <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}
