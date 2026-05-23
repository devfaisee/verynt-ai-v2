/**
 * WhisperTool: Local speech-to-text transcription
 * Drag-drop audio files and transcribe offline with timestamps
 */

import React, { useState, useRef } from 'react';
import { Upload, Download, Copy, Loader } from 'lucide-react';
import { useVernytTool } from '../../hooks/useVernytTool';

export default function WhisperTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('whisper');
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [segments, setSegments] = useState([]);
  const [format, setFormat] = useState('txt');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const maxDuration = tool.getLimits().maxAudioLength;
  const isFreeTier = !isPro;

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (selectedFile) => {
    if (!selectedFile) return;

    // Check file size
    if (selectedFile.size > tool.getLimits().maxFileSize) {
      alert(`File too large. Max: ${tool.getLimits().maxFileSize / 1024 / 1024}MB`);
      return;
    }

    // Check audio duration (free tier: 5 min, pro: unlimited)
    const audio = new Audio();
    audio.src = URL.createObjectURL(selectedFile);
    audio.onloadedmetadata = async () => {
      const duration = audio.duration;

      if (isFreeTier && duration > maxDuration) {
        onUpgradeRequired?.({
          type: 'duration_limit',
          message: `Audio is ${Math.ceil(duration / 60)} minutes. Free tier max: ${maxDuration / 60} minutes.`
        });
        return;
      }

      setFile(selectedFile);
      await transcribeAudio(selectedFile, duration);
    };
  };

  const transcribeAudio = async (audioFile, duration) => {
    // Check permission
    if (!tool.checkPermission('transcribe', { duration })) {
      onUpgradeRequired?.(tool.error);
      return;
    }

    setIsProcessing(true);
    try {
      tool.logUsage({ duration, format: audioFile.type });

      // Load Whisper model
      const modelId = isPro ? 'whisper-base' : 'whisper-tiny';
      const model = await tool.loadModel(modelId);
      if (!model) return;

      // Mock transcription (would use actual whisper.js in production)
      const mockTranscript = `This is a transcribed audio sample. The audio file "${audioFile.name}" has been processed with timestamps.`;
      const mockSegments = [
        { time: '00:00:00', text: 'This is a transcribed audio sample.' },
        { time: '00:00:05', text: 'The audio file has been processed.' },
        { time: '00:00:10', text: 'With timestamps for easy reference.' }
      ];

      setTranscript(mockTranscript);
      setSegments(mockSegments);

      // Save to storage
      await tool.saveResult(`transcription-${Date.now()}`, {
        filename: audioFile.name,
        transcript: mockTranscript,
        segments: mockSegments,
        duration,
        format
      });

      onProcess?.(mockTranscript);
    } catch (err) {
      console.error('Transcription error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTranscript = () => {
    const content =
      format === 'srt'
        ? formatSRT(segments)
        : format === 'vtt'
          ? formatVTT(segments)
          : transcript;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatSRT = (segs) => {
    return segs
      .map(
        (seg, idx) => `${idx + 1}\n${seg.time} --> ${segs[idx + 1]?.time || '00:00:30'}\n${seg.text}\n`
      )
      .join('\n');
  };

  const formatVTT = (segs) => {
    return (
      'WEBVTT\n\n' +
      segs
        .map((seg, idx) => `${seg.time} --> ${segs[idx + 1]?.time || '00:00:30'}\n${seg.text}`)
        .join('\n\n')
    );
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
          isDragging
            ? 'border-blue-400 bg-blue-900/20'
            : 'border-gray-600 bg-gray-900/30 hover:border-gray-500'
        }`}
      >
        <Upload className="mx-auto w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-300 font-medium mb-2">Drag & drop audio file here</p>
        <p className="text-gray-500 text-sm mb-4">
          Supports: MP3, WAV, M4A, MP4 (Max {tool.getLimits().maxFileSize / 1024 / 1024}MB)
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
        >
          Choose File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,video/*"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />
      </div>

      {/* File Info */}
      {file && (
        <div className="bg-gray-800 border border-gray-700 rounded p-4">
          <p className="text-gray-300">
            <span className="font-medium">File:</span> {file.name}
          </p>
          <p className="text-gray-400 text-sm">
            Size: {(file.size / 1024 / 1024).toFixed(2)}MB
          </p>
        </div>
      )}

      {/* Progress */}
      {isProcessing && (
        <div className="bg-gray-800 rounded p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin text-blue-400" />
            <span className="text-gray-300">Transcribing...</span>
          </div>
          <div className="w-full bg-gray-700 rounded h-2">
            <div
              className="bg-blue-500 h-2 rounded transition-all"
              style={{ width: `${tool.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Format Selection */}
      {transcript && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Export Format</label>
          <div className="flex gap-2">
            {['txt', 'srt', 'vtt', ...(isPro ? ['pdf'] : [])].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`px-3 py-1 rounded font-medium transition ${
                  format === fmt
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Transcript Display */}
      {transcript && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Transcript</label>
          <div className="bg-gray-800 border border-gray-700 rounded p-4 max-h-96 overflow-y-auto">
            {format === 'txt' ? (
              <p className="text-gray-200 whitespace-pre-wrap">{transcript}</p>
            ) : (
              <div className="space-y-2">
                {segments.map((seg, idx) => (
                  <div key={idx} className="text-gray-300">
                    <span className="text-blue-400 font-mono text-sm">{seg.time}</span>
                    <p className="mt-1">{seg.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      {transcript && (
        <div className="flex gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(transcript);
              alert('Copied to clipboard!');
            }}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
          {isPro || isFreeTier ? (
            <button
              onClick={downloadTranscript}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          ) : null}
        </div>
      )}

      {/* Pro Badge */}
      {!isPro && (
        <div className="bg-amber-900 border border-amber-700 text-amber-200 px-4 py-3 rounded">
          <p className="font-medium">🔒 Pro Feature Limits</p>
          <p className="text-sm mt-1">Free: Max 5-minute audio | Pro: Unlimited length</p>
        </div>
      )}
    </div>
  );
}

WhisperTool.defaultProps = {
  isPro: false,
  onProcess: null,
  onUsage: null,
  onUpgradeRequired: null
};
