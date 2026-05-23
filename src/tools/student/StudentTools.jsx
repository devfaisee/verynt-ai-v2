import React, { useState } from 'react';
import { GraduationCap, Award, HelpCircle, Check, X, RefreshCw, BookOpen, Brain, TrendingUp, History } from 'lucide-react';
import { useApp } from '../../context/AppContext';

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
    <div className="space-y-10 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-white tracking-tight">Student Hub</h2>
          <p className="text-slate-400 font-medium">Cognitive enhancement and study optimization tools running locally.</p>
        </div>
        <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
           <button onClick={() => setActiveTool('flashcards')} className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all ${activeTool === 'flashcards' ? 'bg-white text-black' : 'text-slate-400'}`}>FLASHCARDS</button>
           <button onClick={() => setActiveTool('quiz')} className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all ${activeTool === 'quiz' ? 'bg-white text-black' : 'text-slate-400'}`}>QUIZ GEN</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR */}
        <div className="lg:col-span-3 space-y-4">
           <div className="glass-panel p-6 space-y-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Workspace Context</h3>
              <div className="space-y-2">
                 {['neuroscience', 'quantum', 'history'].map(d => (
                   <button key={d} onClick={() => setDeck(d)} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border ${deck === d ? 'bg-[#00f2fe]/5 border-[#00f2fe]/20 text-[#00f2fe]' : 'bg-transparent border-white/5 text-slate-500 hover:text-white'}`}>
                      {d.toUpperCase()}
                   </button>
                 ))}
              </div>
              <div className="pt-6 border-t border-white/5 space-y-4">
                 <div className="flex items-center gap-3 text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Retention: +24%</span>
                 </div>
              </div>
           </div>
        </div>

        {/* WORKSPACE */}
        <div className="lg:col-span-9">
           {activeTool === 'flashcards' ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(decks[deck] || decks.neuroscience).map(card => (
                  <div key={card.id} onClick={() => handleCardClick(card.id)} className="h-[250px] cursor-pointer group relative perspective-1000">
                     <div className={`relative w-full h-full transition-all duration-700 preserve-3d ${flipped[card.id] ? 'rotate-y-180' : ''}`}>
                        {/* FRONT */}
                        <div className="absolute inset-0 backface-hidden glass-panel p-10 flex flex-col justify-between items-center text-center group-hover:border-[#00f2fe]/20">
                           <Brain className="w-8 h-8 text-[#00f2fe] opacity-20" />
                           <p className="text-xl font-bold text-white leading-tight">{card.front}</p>
                           <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Click to flip</span>
                        </div>
                        {/* BACK */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 glass-panel p-10 flex flex-col justify-between items-center text-center bg-[#00f2fe]/5 border-[#00f2fe]/20">
                           <Award className="w-8 h-8 text-[#00f2fe]" />
                           <p className="text-sm font-medium text-slate-300 leading-relaxed">{card.back}</p>
                           <span className="text-[9px] font-bold text-[#00f2fe] uppercase tracking-widest">Verified Local Intelligence</span>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="glass-panel p-20 flex flex-col items-center justify-center text-center space-y-8">
                <div className="w-20 h-20 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center">
                   <History className="w-10 h-10 text-slate-700 animate-pulse" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-2xl font-bold text-white">Interactive Quiz Generator</h3>
                   <p className="text-slate-500 font-medium">Upload lecture notes to generate MCQ and short-answer assessments.</p>
                </div>
                <button className="btn-primary h-14 px-8 text-xs">Upload Study Material</button>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}
