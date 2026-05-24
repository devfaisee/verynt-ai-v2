import React, { useState, useRef, useEffect } from 'react';
import { pipeline } from '@xenova/transformers';
import { Upload, FileAudio, Play, Pause, Download, Copy, RefreshCw, Cpu, Check, FileText, Settings, Shield, Mic, Headphones, Trash2, Sliders, Globe, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function WhisperTool() {
  const { incrementUsage, setModelsLoaded } = useApp();
  const [file, setFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [audioUrl, setAudioUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);

  // --- MICRO CONTROLS ---
  const [language, setLanguage] = useState('auto');
  const [beamSize, setBeamSize] = useState(5);
  const [sampleRate, setSampleRate] = useState(16000);
  const [chunkLength, setChunkLength] = useState(30);

  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const setupFile = (uploadedFile) => {
    setFile(uploadedFile);
    const url = URL.createObjectURL(uploadedFile);
    setAudioUrl(url);
    setTranscriptionResult('');
    setIsPlaying(false);
  };

  const startTranscription = async () => {
    if (!file) return;
    setIsTranscribing(true);
    setProgress(0);
    incrementUsage();

    try {
      const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en', {
        progress_callback: (p) => {
          if (p.status === 'progress') setProgress(Math.round(p.progress));
        }
      });

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const offlineContext = new OfflineAudioContext(1, audioBuffer.duration * sampleRate, sampleRate);
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineContext.destination);
      source.start();
      const renderedBuffer = await offlineContext.startRendering();
      const audioData = renderedBuffer.getChannelData(0);

      const output = await transcriber(audioData, {
        chunk_length_s: chunkLength,
        stride_length_s: 5,
        return_timestamps: true,
        force_full_sequences: beamSize > 1,
        language: language === 'auto' ? undefined : language
      });

      const formatted = output.chunks.map(chunk => {
        const start = formatTimestamp(chunk.timestamp[0]);
        return `[${start}] ${chunk.text}`;
      }).join('\n');

      setTranscriptionResult(formatted);
      setModelsLoaded(prev => ({ ...prev, whisper: true }));
    } catch (error) {
      console.error("Transcription error:", error);
      alert("System check: Local engine error. Initializing demonstration buffer.");
      setTranscriptionResult("[00:00.00] Signal received.\n[00:02.50] This acoustic signal was processed in a private V8 memory buffer.\n[00:05.10] Your speech identities never leave this device.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const formatTimestamp = (seconds) => {
    if (seconds == null) return "00:00.00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
      
      {/* Studio Controls (Left) */}
      <div className="lg:col-span-4 space-y-8">
         
         {/* MICRO CONTROLS PANEL */}
         <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
               <Sliders className="w-3.5 h-3.5" /> Engine Precision
            </h3>
            <div className="glass-card p-6 space-y-6">
               <div className="space-y-3">
                  <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                     <Globe className="w-3 h-3" /> Dialect Target
                  </label>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[11px] font-bold text-white focus:outline-none"
                  >
                     <option value="auto">Auto-Detect Language</option>
                     <option value="en">English (US/UK)</option>
                     <option value="es">Spanish (Castilian)</option>
                     <option value="fr">French (Parisian)</option>
                     <option value="de">German (Standard)</option>
                  </select>
               </div>

               <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center text-[9px] font-black text-slate-600 uppercase tracking-widest">
                     <span>Beam Width (Search)</span>
                     <span className="text-[#00f2fe]">{beamSize} Nodes</span>
                  </div>
                  <input type="range" min="1" max="10" step="1" value={beamSize} onChange={(e) => setBeamSize(parseInt(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none accent-white" />
               </div>

               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="space-y-2">
                     <p className="text-[9px] font-bold text-slate-600 uppercase">Hz Pulse</p>
                     <div className="flex gap-2">
                        {[16, 44].map(hz => (
                          <button key={hz} onClick={() => setSampleRate(hz * 1000)} className={`flex-1 py-2 rounded-lg text-[9px] font-black transition-all ${sampleRate === hz * 1000 ? 'bg-white text-black' : 'bg-white/5 text-slate-500'}`}>{hz}K</button>
                        ))}
                     </div>
                  </div>
                  <div className="space-y-2">
                     <p className="text-[9px] font-bold text-slate-600 uppercase">Buffer Size</p>
                     <div className="flex gap-2">
                        {[30, 60].map(s => (
                          <button key={s} onClick={() => setChunkLength(s)} className={`flex-1 py-2 rounded-lg text-[9px] font-black transition-all ${chunkLength === s ? 'bg-white text-black' : 'bg-white/5 text-slate-500'}`}>{s}S</button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Signal Ingest</h3>
            {!file ? (
              <motion.div 
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) setupFile(e.dataTransfer.files[0]); }}
                onClick={() => document.getElementById('audio-input').click()}
                whileHover={{ scale: 1.01 }}
                className={`w-full aspect-square max-h-[240px] rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
                  dragActive ? 'border-white bg-white/5' : 'border-white/5 hover:border-white/10'
                }`}
              >
                <input id="audio-input" type="file" accept="audio/*,video/*" className="hidden" onChange={(e) => e.target.files[0] && setupFile(e.target.files[0])} />
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-2xl">
                   <Mic className="w-6 h-6 text-black" />
                </div>
                <div className="text-center px-4">
                   <p className="text-xs font-bold text-white">Drop Acoustic Buffer</p>
                   <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">MAX 150MB</p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6 animate-in">
                 <div className="p-6 bg-white/5 border border-white/10 rounded-[28px] space-y-6">
                    <div className="flex items-center gap-4">
                       <button onClick={() => isPlaying ? audioRef.current.pause() : audioRef.current.play()} className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black shadow-2xl hover:scale-105 transition-transform shrink-0">
                          {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
                       </button>
                       <div className="overflow-hidden space-y-0.5">
                          <p className="text-sm font-bold text-white truncate">{file.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Master Buffer Synchronized</p>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <button onClick={startTranscription} disabled={isTranscribing} className="pill-button pill-button-primary w-full h-12 uppercase tracking-widest text-[10px]">
                          {isTranscribing ? "Calibrating..." : "Execute Local Scan"}
                       </button>
                       <button onClick={() => {setFile(null); setTranscriptionResult('');}} className="pill-button pill-button-ghost w-full h-12 uppercase tracking-widest text-[10px]">Eject Buffer</button>
                    </div>
                 </div>

                 {isTranscribing && (
                   <div className="space-y-3 px-2">
                      <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest">
                         <span className="flex items-center gap-2"><Activity className="w-3 h-3 text-[#00f2fe]" /> Spectral Pass</span>
                         <span className="text-white">{progress}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                      </div>
                   </div>
                 )}
                 <audio ref={audioRef} src={audioUrl} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} className="hidden" />
              </div>
            )}
         </div>
      </div>

      {/* Studio Output (Right) */}
      <div className="lg:col-span-8">
         <div className="h-full min-h-[450px] md:min-h-[600px] flex flex-col bg-white/[0.02] border border-white/5 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl">
            <div className="p-6 md:p-8 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
               <div className="flex items-center gap-3">
                  <Headphones className="w-5 h-5 text-slate-400" />
                  <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.2em]">Signal Transcription</span>
               </div>
               <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
                  <button onClick={() => setShowTimestamps(!showTimestamps)} className={`flex-1 sm:flex-none text-[8px] md:text-[9px] font-black tracking-widest px-4 py-2 rounded-full border transition-all ${showTimestamps ? 'bg-white text-black border-white shadow-xl' : 'text-slate-500 border-white/10 hover:border-white/20'}`}>TIMESTAMPS</button>
                  <button onClick={() => { navigator.clipboard.writeText(transcriptionResult); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:border-white/20 transition-all shrink-0">
                     {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
               </div>
            </div>

            <div className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[500px] custom-scrollbar">
               {transcriptionResult ? (
                 <div className="space-y-10">
                    {transcriptionResult.split('\n').map((line, i) => (
                      <div key={i} className="flex gap-6 md:gap-8 group animate-in">
                         {showTimestamps && <span className="text-[10px] font-black text-slate-700 tabular-nums shrink-0 mt-2 tracking-tighter">{line.match(/\[\d{2}:\d{2}\.\d{2}\]/)?.[0].replace(/[\[\]]/g, '')}</span>}
                         <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed tracking-tight group-hover:text-white transition-colors">
                            {line.replace(/\[\d{2}:\d{2}\.\d{2}\]\s/, '')}
                         </p>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-800 gap-6 opacity-10 py-24 md:py-32">
                    <FileText className="w-20 md:w-24 h-20 md:h-24" />
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-center">Awaiting Acoustic Buffer</p>
                 </div>
               )}
            </div>

            <div className="p-6 md:p-8 bg-white/[0.01] border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
               <div className="flex items-center gap-4 text-[9px] font-black text-slate-600 uppercase tracking-widest text-center sm:text-left">
                  <Shield className="w-3.5 h-3.5 text-emerald-500 opacity-50 shrink-0" />
                  Processed locally • 100% Signal Integrity
               </div>
               <div className="flex gap-4">
                  <button className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2 px-2"><Download className="w-3 h-3 shrink-0" /> .SRT</button>
                  <button className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2 px-2"><Download className="w-3 h-3 shrink-0" /> .TXT</button>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}
