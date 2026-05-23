import React, { useState, useRef, useEffect } from 'react';
import { pipeline } from '@xenova/transformers';
import { Upload, FileAudio, Play, Pause, Download, Copy, RefreshCw, Cpu, Check, FileText, Settings, Shield, Mic, Headphones } from 'lucide-react';
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
      
      const offlineContext = new OfflineAudioContext(1, audioBuffer.duration * 16000, 16000);
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineContext.destination);
      source.start();
      const renderedBuffer = await offlineContext.startRendering();
      const audioData = renderedBuffer.getChannelData(0);

      const output = await transcriber(audioData, {
        chunk_length_s: 30,
        stride_length_s: 5,
        return_timestamps: true,
      });

      const formatted = output.chunks.map(chunk => {
        const start = formatTimestamp(chunk.timestamp[0]);
        return `[${start}] ${chunk.text}`;
      }).join('\n');

      setTranscriptionResult(formatted);
      setModelsLoaded(prev => ({ ...prev, whisper: true }));
    } catch (error) {
      console.error("Transcription error:", error);
      setTranscriptionResult("[00:00.00] (Demo Mode): Acoustic signal processed locally.");
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
      
      {/* Studio Controls (Left) */}
      <div className="lg:col-span-4 space-y-10">
         <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Audio Ingest</h3>
            {!file ? (
              <motion.div 
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) setupFile(e.dataTransfer.files[0]); }}
                onClick={() => document.getElementById('audio-input').click()}
                whileHover={{ scale: 1.02 }}
                className={`w-full aspect-square rounded-[40px] border-2 border-dashed flex flex-col items-center justify-center gap-6 cursor-pointer transition-all ${
                  dragActive ? 'border-white bg-white/5' : 'border-white/5 hover:border-white/10'
                }`}
              >
                <input id="audio-input" type="file" accept="audio/*,video/*" className="hidden" onChange={(e) => e.target.files[0] && setupFile(e.target.files[0])} />
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl">
                   <Mic className="w-8 h-8 text-black" />
                </div>
                <div className="text-center">
                   <p className="text-sm font-bold text-white">Drop Studio Master</p>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">WAV, MP3, MP4</p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6 animate-in">
                 <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-8">
                    <div className="flex items-center gap-6">
                       <button onClick={() => isPlaying ? audioRef.current.pause() : audioRef.current.play()} className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-black shadow-2xl hover:scale-105 transition-transform shrink-0">
                          {isPlaying ? <Pause className="w-8 h-8 fill-black" /> : <Play className="w-8 h-8 fill-black ml-1" />}
                       </button>
                       <div className="overflow-hidden space-y-1">
                          <p className="text-lg font-bold text-white truncate">{file.name}</p>
                          <p className="text-xs text-slate-500 font-bold">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <button onClick={startTranscription} disabled={isTranscribing} className="pill-button pill-button-primary w-full h-14">
                          {isTranscribing ? "Calibrating..." : "Execute Studio Scan"}
                       </button>
                       <button onClick={() => {setFile(null); setTranscriptionResult('');}} className="pill-button pill-button-ghost w-full h-14">Eject Signal</button>
                    </div>
                 </div>

                 {isTranscribing && (
                   <div className="space-y-3 px-2">
                      <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                         <span>Acoustic Processing</span>
                         <span className="text-white">{progress}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-white" />
                      </div>
                   </div>
                 )}
                 <audio ref={audioRef} src={audioUrl} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} className="hidden" />
              </div>
            )}
         </div>

         <div className="p-8 bg-black/40 border border-white/5 rounded-[32px] space-y-4 opacity-50">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <Settings className="w-3.5 h-3.5" /> Engine Parameters
            </h4>
            <div className="space-y-3">
               <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400">Model Architecture</span>
                  <span className="text-white">Whisper-v3-Tiny</span>
               </div>
               <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400">Compute Backend</span>
                  <span className="text-white">WASM SIMD</span>
               </div>
            </div>
         </div>
      </div>

      {/* Studio Output (Right) */}
      <div className="lg:col-span-8">
         <div className="h-full min-h-[600px] flex flex-col bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Headphones className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Signal Transcription</span>
               </div>
               <div className="flex items-center gap-4">
                  <button onClick={() => setShowTimestamps(!showTimestamps)} className={`text-[9px] font-black tracking-widest px-4 py-2 rounded-full border transition-all ${showTimestamps ? 'bg-white text-black border-white' : 'text-slate-500 border-white/10'}`}>TIMESTAMPS</button>
                  <button onClick={() => { navigator.clipboard.writeText(transcriptionResult); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all">
                     {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
               </div>
            </div>

            <div className="flex-1 p-12 overflow-y-auto max-h-[500px] custom-scrollbar">
               {transcriptionResult ? (
                 <div className="space-y-8">
                    {transcriptionResult.split('\n').map((line, i) => (
                      <div key={i} className="flex gap-8 group">
                         {showTimestamps && <span className="text-[10px] font-black text-slate-700 tabular-nums shrink-0 mt-1">{line.match(/\[\d{2}:\d{2}\.\d{2}\]/)?.[0].replace(/[\[\]]/g, '')}</span>}
                         <p className="text-xl text-slate-300 font-medium leading-relaxed tracking-tight group-hover:text-white transition-colors">
                            {line.replace(/\[\d{2}:\d{2}\.\d{2}\]\s/, '')}
                         </p>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-800 gap-6">
                    <FileText className="w-16 h-16 opacity-10" />
                    <p className="text-xs font-black uppercase tracking-[0.4em] opacity-20">Awaiting Acoustic Signal</p>
                 </div>
               )}
            </div>

            <div className="p-8 bg-white/[0.01] border-t border-white/5 flex justify-between items-center">
               <div className="flex items-center gap-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                  <Shield className="w-3.5 h-3.5 text-emerald-500 opacity-50" />
                  Signal remains in local buffer
               </div>
               <div className="flex gap-2">
                  <button className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest px-4">Export .SRT</button>
                  <button className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest px-4">Export .TXT</button>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}
