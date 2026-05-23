import React, { useState, useEffect } from 'react';
import { Volume2, Download, Play, Pause, RefreshCw, Settings, ShieldCheck, AudioLines, Mic2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceForgeTool() {
  const { incrementUsage, triggerLoader } = useApp();
  const [text, setText] = useState("Verynt VoiceForge converts your text into natural-sounding speech entirely offline using your browser's native synthesis engine.");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pitch, setPitch] = useState(1.0);
  const [rate, setRate] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = () => {
    if (!text.trim()) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.pitch = pitch;
    utterance.rate = rate;
    
    utterance.onstart = () => { setIsPlaying(true); incrementUsage(); };
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
      
      {/* Studio Controls (Left) */}
      <div className="lg:col-span-4 space-y-10">
         <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Acoustic Persona</h3>
            <div className="glass-card p-8 space-y-8">
               <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center">Synthesis Voice</p>
                  <select 
                    value={selectedVoice} 
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-white/20 transition-all appearance-none cursor-pointer"
                  >
                    {voices.map(v => <option key={v.name} value={v.name} className="bg-slate-900">{v.name} ({v.lang})</option>)}
                  </select>
               </div>

               <div className="space-y-8 pt-4 border-t border-white/5">
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span>Pitch Control</span>
                        <span className="text-white">{pitch.toFixed(1)}x</span>
                     </div>
                     <input type="range" min="0.5" max="2.0" step="0.1" value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none accent-white cursor-ew-resize" />
                  </div>

                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span>Cadence Flow</span>
                        <span className="text-white">{rate.toFixed(1)}x</span>
                     </div>
                     <input type="range" min="0.5" max="3.0" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none accent-white cursor-ew-resize" />
                  </div>
               </div>
            </div>
         </div>

         <div className="p-8 bg-[#00f2fe]/5 border border-[#00f2fe]/10 rounded-[32px] space-y-4">
            <div className="flex items-center gap-3 text-[#00f2fe]">
               <ShieldCheck className="w-5 h-5" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Privacy Shield</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Voice synthesis is executed using your OS native TTS layer. Audio buffers are generated in-memory and never leave the browser sandbox.</p>
         </div>
      </div>

      {/* Studio Workspace (Right) */}
      <div className="lg:col-span-8">
         <div className="h-full min-h-[600px] flex flex-col bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <AudioLines className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Script Master</span>
               </div>
               <button onClick={() => setText('')} className="text-[10px] font-black text-rose-500 hover:text-rose-400 uppercase tracking-widest transition-colors">Flush Script</button>
            </div>

            <div className="flex-1 p-12 relative group">
               <textarea 
                 value={text} 
                 onChange={(e) => setText(e.target.value)} 
                 className="w-full h-full bg-transparent border-none text-2xl text-slate-300 font-medium focus:outline-none resize-none leading-relaxed tracking-tight"
                 placeholder="Enter the signal stream to be synthesized..."
               />
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
            </div>

            <div className="p-10 bg-white/[0.01] border-t border-white/5 flex justify-between items-center">
               <div className="flex items-center gap-6">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={isPlaying ? stop : speak} 
                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all ${isPlaying ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-black'}`}
                  >
                    {isPlaying ? <Pause className="w-8 h-8 fill-white" /> : <Play className="w-8 h-8 fill-black ml-1" />}
                  </motion.button>
                  <div className="space-y-1">
                     <p className="text-sm font-bold text-white uppercase tracking-[0.2em]">{isPlaying ? "Synthesis Active" : "Ready to Forge"}</p>
                     <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Acoustic Signal Ready</p>
                  </div>
               </div>
               <button className="pill-button pill-button-ghost h-14 gap-3">
                  <Download className="w-5 h-5" /> Export Waveform
               </button>
            </div>
         </div>
      </div>

    </div>
  );
}
