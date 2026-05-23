import React, { useState, useEffect } from 'react';
import { Volume2, Download, Play, Pause, RefreshCw, Settings, ShieldCheck, AudioLines } from 'lucide-react';
import { useApp } from '../../context/AppContext';

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
    <div className="space-y-10 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-white tracking-tight">VoiceForge TTS</h2>
          <p className="text-slate-400 font-medium">Neural text-to-speech synthesis with zero server latency.</p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-[#00f2fe] bg-[#00f2fe]/5 px-4 py-2 rounded-full border border-[#00f2fe]/10 uppercase tracking-widest">
           <AudioLines className="w-3.5 h-3.5" /> High-Fidelity Synthesis
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUT */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel p-8 space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Script Input</h3>
                <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/5">{text.length} Characters</span>
             </div>
             <textarea 
               value={text} 
               onChange={(e) => setText(e.target.value)} 
               className="w-full h-[300px] bg-slate-950 border border-white/5 rounded-2xl p-8 text-xl text-slate-300 font-medium focus:outline-none focus:border-[#00f2fe]/20 transition-all resize-none leading-relaxed"
               placeholder="Enter the text you want to convert to voice..."
             />
             
             <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-4">
                   <button 
                     onClick={isPlaying ? stop : speak} 
                     className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-black hover:scale-110'}`}
                   >
                     {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-black ml-1" />}
                   </button>
                   <div className="space-y-1">
                      <p className="text-sm font-bold text-white uppercase tracking-tighter">{isPlaying ? "Synthesis Active" : "Ready to Generate"}</p>
                      <p className="text-[10px] text-slate-500 font-medium uppercase">Using Browser Neural Buffer</p>
                   </div>
                </div>
                <button className="btn-ghost h-12 gap-2 text-xs">
                   <Download className="w-4 h-4" /> Export Audio
                </button>
             </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="lg:col-span-4 space-y-6">
           <div className="glass-panel p-8 space-y-8">
              <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                 <Settings className="w-4 h-4 text-slate-400" /> Voice Profile
              </h4>
              
              <div className="space-y-6">
                 <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Persona</label>
                    <select 
                      value={selectedVoice} 
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                    >
                      {voices.map(v => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
                    </select>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                       <span>Pitch Shift</span>
                       <span className="text-white">{pitch}x</span>
                    </div>
                    <input type="range" min="0.5" max="2.0" step="0.1" value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none accent-[#00f2fe]" />
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                       <span>Flow Rate</span>
                       <span className="text-white">{rate}x</span>
                    </div>
                    <input type="range" min="0.5" max="3.0" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none accent-[#00f2fe]" />
                 </div>
              </div>
           </div>

           <div className="p-8 glass-panel space-y-4 bg-emerald-500/[0.03] border-emerald-500/10">
              <div className="flex items-center gap-2 text-emerald-400">
                 <ShieldCheck className="w-4 h-4" />
                 <h5 className="text-[10px] font-black uppercase tracking-[0.2em]">Offline Assurance</h5>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                 VoiceForge uses your device's native Speech Synthesis Interface. This means your text is converted to audio signals locally without ever reaching a server.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}
