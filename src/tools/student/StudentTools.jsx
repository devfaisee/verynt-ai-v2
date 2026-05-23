import React, { useState } from 'react';
import { GraduationCap, Award, HelpCircle, Check, X, RefreshCw, BookOpen, Brain, TrendingUp, History, Lightbulb, GraduationCap as CapIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentTools() {
  const { incrementUsage } = useApp();
  const [activeTool, setActiveTool] = useState('flashcards'); 
  const [flipped, setFlipped] = useState({});
  const [deck, setDeck] = useState('neuroscience');

  const decks = {
    neuroscience: [
      { id: 1, front: "What is the primary excitatory neurotransmitter?", back: "Glutamate. It is the most abundant excitatory neurotransmitter in the vertebrate nervous system." },
      { id: 2, front: "Where is the hippocampus located?", back: "Within the temporal lobe of the brain. It forms part of the limbic system." }
    ],
    quantum: [
      { id: 1, front: "What is superposition?", back: "A fundamental principle of quantum mechanics where a physical system exists in multiple states simultaneously." }
    ]
  };

  const handleCardClick = (id) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
    incrementUsage();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
      
      {/* Studio Navigation (Left) */}
      <div className="lg:col-span-3 space-y-10">
         <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Learning Modules</h3>
            <div className="glass-card p-6 space-y-2">
               {[
                 { id: 'flashcards', name: 'Active Recall', icon: Lightbulb },
                 { id: 'quiz', name: 'Quiz Generator', icon: History }
               ].map(tool => (
                 <button 
                   key={tool.id}
                   onClick={() => setActiveTool(tool.id)}
                   className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-bold transition-all border ${activeTool === tool.id ? 'bg-white text-black shadow-2xl border-white' : 'bg-transparent border-transparent text-slate-500 hover:text-white hover:bg-white/5'}`}
                 >
                    <tool.icon className="w-4 h-4" />
                    {tool.name.toUpperCase()}
                 </button>
               ))}
            </div>
         </div>

         {activeTool === 'flashcards' && (
           <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Knowledge Base</h3>
              <div className="glass-card p-6 space-y-2">
                 {['neuroscience', 'quantum', 'history'].map(d => (
                   <button 
                     key={d} 
                     onClick={() => setDeck(d)} 
                     className={`w-full text-left px-5 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all border ${deck === d ? 'bg-[#00f2fe]/10 border-[#00f2fe]/20 text-[#00f2fe]' : 'bg-transparent border-transparent text-slate-600 hover:text-white'}`}
                   >
                      {d.toUpperCase()}
                   </button>
                 ))}
              </div>
           </div>
         )}

         <div className="p-8 bg-[#bf5af2]/5 border border-[#bf5af2]/10 rounded-[32px] space-y-4">
            <div className="flex items-center gap-3 text-[#bf5af2]">
               <TrendingUp className="w-5 h-5" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Retention Engine</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Cognitive loads are balanced locally using specialized spaced-repetition buffers. No data training on your study materials.</p>
         </div>
      </div>

      {/* Studio Workspace (Right) */}
      <div className="lg:col-span-9">
         <AnimatePresence mode="wait">
           {activeTool === 'flashcards' ? (
             <motion.div 
               key="flashcards"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="grid grid-cols-1 md:grid-cols-2 gap-10"
             >
                {(decks[deck] || decks.neuroscience).map(card => (
                  <div key={card.id} onClick={() => handleCardClick(card.id)} className="h-[320px] cursor-pointer group relative perspective-1000">
                     <div className={`relative w-full h-full transition-all duration-1000 preserve-3d ${flipped[card.id] ? 'rotate-y-180' : ''}`}>
                        {/* FRONT */}
                        <div className="absolute inset-0 backface-hidden glass-card p-12 flex flex-col justify-between items-center text-center group-hover:border-white/20">
                           <Brain className="w-12 h-12 text-white opacity-10" />
                           <p className="text-2xl font-bold text-white tracking-tight leading-tight">{card.front}</p>
                           <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">Initialize Answer</span>
                        </div>
                        {/* BACK */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 glass-card p-12 flex flex-col justify-between items-center text-center bg-white/[0.03] border-white/20">
                           <CapIcon className="w-12 h-12 text-[#bf5af2] opacity-30" />
                           <p className="text-lg font-medium text-slate-300 leading-relaxed italic">{card.back}</p>
                           <span className="text-[9px] font-black text-[#bf5af2] uppercase tracking-[0.4em]">Signal Verified</span>
                        </div>
                     </div>
                  </div>
                ))}
             </motion.div>
           ) : (
             <motion.div 
               key="quiz"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="h-full min-h-[600px] glass-card flex flex-col items-center justify-center p-20 text-center space-y-10"
             >
                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden">
                   <History className="w-10 h-10 text-slate-700 animate-pulse" />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#bf5af2]/10 to-transparent" />
                </div>
                <div className="space-y-4 max-w-md">
                   <h3 className="text-4xl font-bold text-white tracking-tight">Interactive Assessment</h3>
                   <p className="text-slate-500 font-medium text-lg">Upload document signals to generate MCQ and semantic short-answer queries locally.</p>
                </div>
                <button className="pill-button pill-button-primary h-16 px-12 text-base">Ingest Study Material</button>
             </motion.div>
           )}
         </AnimatePresence>
      </div>

    </div>
  );
}
