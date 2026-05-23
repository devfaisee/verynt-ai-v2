import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, FileAudio, FileText, Eye, Image as ImageIcon, Cpu, Award, HardDrive, Terminal, GraduationCap, Search, Scissors, ArrowRight, Layers, ShieldCheck, Zap, Mic, Volume2, Wand2, Languages, TrendingUp, History, Database, Code, Briefcase, FileUser, Mail } from 'lucide-react';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';

const categories = [
  { id: 'audio', name: 'Acoustic Studio', desc: 'Professional audio transcription and neural speech synthesis.', icon: FileAudio },
  { id: 'vision', name: 'Visual Studio', desc: 'High-fidelity computer vision and image processing units.', icon: ImageIcon },
  { id: 'logic', name: 'Semantic Studio', desc: 'Intelligent document analysis and writing automation.', icon: FileText }
];

const tools = [
  // Acoustic
  { id: 'whisper', name: 'Whisper Transcribe', desc: 'Turn any voice recording into text with 99% accuracy.', icon: Mic, cat: 'audio' },
  { id: 'voiceforge', name: 'VoiceForge TTS', desc: 'Convert text into natural human speech instantly.', icon: Volume2, cat: 'audio' },
  { id: 'audioscribe', name: 'AudioScribe AI', desc: 'Auto-generate Jira tickets and meeting notes from audio.', icon: Sparkles, cat: 'audio' },
  
  // Visual
  { id: 'clear', name: 'Vision Background', desc: 'Instantly remove and swap image backgrounds locally.', icon: ImageIcon, cat: 'vision' },
  { id: 'scale', name: 'Vision Upscaler', desc: 'Multiply image resolution up to 4x with neural sharpening.', icon: Layers, cat: 'vision' },
  { id: 'ocr', name: 'Vision OCR', desc: 'Scan and extract text from receipts and screenshots.', icon: Search, cat: 'vision' },
  
  // Semantic
  { id: 'docuchat', name: 'DocuChat AI', desc: 'Chat with your PDF files and get executive summaries.', icon: MessageSquare, cat: 'logic' },
  { id: 'redact', name: 'Privacy Redact', desc: 'Mask sensitive IDs and credit cards in your documents.', icon: ShieldCheck, cat: 'logic' },
  { id: 'scribble', name: 'Writer Studio', desc: 'AI assistant for rephrasing, resumes, and cover letters.', icon: Wand2, cat: 'logic' },
  { id: 'dev-utils', name: 'Developer Tools', desc: 'Essential formatters for JSON, Base64, and Regex.', icon: Terminal, cat: 'logic' },
  { id: 'student-hub', name: 'Student Hub', desc: 'Create study flashcards and quizzes from your notes.', icon: GraduationCap, cat: 'logic' }
];

import { MessageSquare } from 'lucide-react';

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
      <SEO title="Studio Explorer" description="Professional local-first AI tools for everyone." />
      
      {/* Action-Oriented Hero */}
      <section className="max-w-4xl mx-auto text-center space-y-10 py-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block"
        >
          <span className="text-[10px] font-black tracking-[0.4em] text-[#00f2fe] uppercase bg-[#00f2fe]/5 px-6 py-2.5 rounded-full border border-[#00f2fe]/20">
            Professional Studio Suite
          </span>
        </motion.div>
        
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] text-white">
          AI Tools That<br />
          <span className="text-white/20 italic">Run Locally.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
          No cloud uploads. No subscription fees. Just high-performance AI tools that respect your privacy.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
          <button className="pill-button pill-button-primary h-16 px-12 text-lg shadow-[0_20px_50px_rgba(255,255,255,0.1)]">Start Exploring</button>
          <Link to="/tool/model-manager" className="pill-button pill-button-ghost h-16 px-12 text-lg">Engine Stats</Link>
        </div>
      </section>

      {/* Simplified Tool Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-32"
      >
        {categories.map(cat => (
          <section key={cat.id} className="space-y-16">
            <motion.div variants={item} className="space-y-3 border-l-2 border-[#00f2fe] pl-8">
                <h2 className="text-5xl font-bold text-white tracking-tight">{cat.name}</h2>
                <p className="text-xl text-slate-500 font-medium">{cat.desc}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools.filter(t => t.cat === cat.id).map(tool => (
                <motion.div key={tool.id} variants={item}>
                  <Link 
                    to={`/tool/${tool.id}`}
                    className="glass-card p-10 group flex flex-col justify-between h-[340px] hover:bg-white/[0.03] transition-all"
                  >
                    <div className="space-y-8">
                       <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white transition-all group-hover:text-black text-slate-400">
                          <tool.icon className="w-8 h-8" />
                       </div>
                       <div className="space-y-3">
                          <h4 className="text-2xl font-bold text-white tracking-tight">{tool.name}</h4>
                          <p className="text-sm text-slate-500 font-medium leading-relaxed">{tool.desc}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-600 group-hover:text-[#00f2fe] transition-colors uppercase tracking-[0.3em]">
                       Open Module <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </motion.div>

      {/* Ad Banner - Revenue Engine */}
      <section className="py-20">
         <div className="glass-card h-40 w-full flex items-center justify-center relative overflow-hidden bg-white/[0.01]">
            <div className="absolute top-4 right-6 text-[9px] font-black text-slate-700 uppercase tracking-widest">Sponsored Placement</div>
            <div className="text-center space-y-2">
               <p className="text-lg font-bold text-slate-400">Support Verynt Studio</p>
               <p className="text-sm text-slate-600 uppercase tracking-widest font-black">Ad Content Placeholder</p>
            </div>
         </div>
      </section>

      {/* Trust Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-16 py-32 border-t border-white/5">
           <TrustItem icon={ShieldCheck} title="Strictly Local" desc="Your data is processed in your device memory. We never see your files." />
           <TrustItem icon={Database} title="WASM & WebGPU" desc="Native hardware performance directly in your modern web browser." />
           <TrustItem icon={Zap} title="Instant Speed" desc="No waiting for server queues or API responses. Results are immediate." />
      </section>
    </div>
  );
}

function TrustItem({ icon: Icon, title, desc }) {
  return (
    <div className="space-y-6">
       <Icon className="w-10 h-10 text-white" />
       <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}
