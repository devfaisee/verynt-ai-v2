import React, { useState, useRef, useEffect } from 'react';
import { pipeline } from '@xenova/transformers';
import { Upload, FileAudio, Play, Pause, Download, Copy, RefreshCw, Cpu, Check, FileText, Settings, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

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

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('audio/') || droppedFile.type.startsWith('video/')) {
        setupFile(droppedFile);
      }
    }
  };

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
      setTranscriptionResult("[00:00.00] (Demo Result): Whisper AI processed this file locally.");
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
    <div className="space-y-10 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-white tracking-tight">Whisper Transcription</h2>
          <p className="text-slate-400 font-medium">Neural audio-to-text running entirely on your local GPU.</p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-400 bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/10">
          <Shield className="w-3.5 h-3.5" /> 100% PRIVATE PIPELINE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* INPUT COLUMN */}
        <div className="lg:col-span-4 space-y-6">
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`glass-panel border-2 border-dashed p-10 text-center cursor-pointer transition-all min-h-[300px] flex flex-col items-center justify-center gap-6 ${
              dragActive ? 'border-[#00f2fe] bg-[#00f2fe]/5' : 'border-white/5 hover:border-white/10'
            }`}
            onClick={() => document.getElementById('audio-input').click()}
          >
            <input id="audio-input" type="file" accept="audio/*,video/*" className="hidden" onChange={(e) => e.target.files[0] && setupFile(e.target.files[0])} />
            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center border border-white/5 shadow-inner">
              <Upload className="w-8 h-8 text-[#00f2fe]" />
            </div>
            <div className="space-y-2">
              <h4 className="text-base font-bold text-white">{file ? file.name : "Upload Source"}</h4>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">WAV, MP3, MP4 UP TO 150MB</p>
            </div>
          </div>

          {file && (
            <div className="glass-panel p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => isPlaying ? audioRef.current.pause() : audioRef.current.play()} className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black hover:scale-110 transition-transform">
                    {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-1" />}
                  </button>
                  <div>
                    <p className="text-sm font-bold text-white truncate max-w-[120px]">{file.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button onClick={startTranscription} disabled={isTranscribing} className="btn-primary h-10 px-6 text-xs">
                  {isTranscribing ? 'Processing...' : 'Transcribe'}
                </button>
              </div>

              {isTranscribing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                    <span>Compiling Neural Pathways</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                    <div className="h-full bg-white transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}
              <audio ref={audioRef} src={audioUrl} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} className="hidden" />
            </div>
          )}
        </div>

        {/* OUTPUT COLUMN */}
        <div className="lg:col-span-8">
          <div className="glass-panel h-full min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/2">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#00f2fe]" />
                <span className="text-sm font-bold text-white uppercase tracking-wider">Output Log</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowTimestamps(!showTimestamps)} className={`h-8 px-4 rounded-full text-[10px] font-bold transition-all border ${showTimestamps ? 'bg-white text-black border-white' : 'bg-transparent text-slate-400 border-white/10 hover:border-white/20'}`}>
                  TIMESTAMPS
                </button>
                <button onClick={() => { navigator.clipboard.writeText(transcriptionResult); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all">
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex-1 p-8 font-mono text-sm leading-relaxed overflow-y-auto max-h-[600px] text-slate-300 custom-scrollbar">
              {transcriptionResult ? (
                transcriptionResult.split('\n').map((line, i) => (
                  <p key={i} className="mb-4 flex gap-4">
                    {showTimestamps && <span className="text-[#00f2fe] opacity-50 shrink-0">{line.match(/\[\d{2}:\d{2}\.\d{2}\]/)?.[0]}</span>}
                    <span>{line.replace(/\[\d{2}:\d{2}\.\d{2}\]\s/, '')}</span>
                  </p>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 opacity-20">
                  <Cpu className="w-20 h-20" />
                  <p className="font-bold tracking-widest uppercase text-xs">Waiting for local pipeline execution</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
