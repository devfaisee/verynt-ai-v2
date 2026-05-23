/**
 * VoiceForgeTool: Local text-to-speech synthesis
 * Generate natural-sounding voices from text completely offline
 */

import React, { useState } from 'react';
import { Volume2, Download, Loader } from 'lucide-react';
import { useVernytTool } from '../../hooks/useVernytTool';

export default function VoiceForgeTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('voiceforge');
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [audio, setAudio] = useState(null);
  const [voice, setVoice] = useState('google-en-US');
  const [pitch, setPitch] = useState(1.0);
  const [rate, setRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);

  const voices = [
    { id: 'google-en-US', name: 'Google US English' },
    { id: 'google-en-GB', name: 'Google UK English' },
    { id: 'google-es-ES', name: 'Google Spanish' },
    ...(isPro ? [{ id: 'neural-premium', name: 'Neural Premium Voice (Pro)' }] : [])
  ];

  const generateSpeech = async () => {
    if (!text.trim()) {
      alert('Please enter text');
      return;
    }

    // Check permission
    if (!tool.checkPermission('tts', { textLength: text.length })) {
      onUpgradeRequired?.(tool.error);
      return;
    }

    setIsProcessing(true);
    try {
      tool.logUsage({ textLength: text.length, voice, format: 'mp3' });

      // Load TTS model
      const model = await tool.loadModel('speecht5-tts');
      if (!model) return;

      // Mock audio generation (would use actual TTS in production)
      const mockAudioData = generateMockAudio(text);
      setAudio(mockAudioData);

      // Save to storage
      await tool.saveResult(`voice-${Date.now()}`, {
        text,
        voice,
        pitch,
        rate,
        audioUrl: mockAudioData.url
      });

      onProcess?.(mockAudioData);
    } catch (err) {
      console.error('TTS error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateMockAudio = () => {
    // In production, this would generate actual audio
    return {
      url: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==',
      duration: text.length / 15 // Rough estimate
    };
  };

  const downloadAudio = () => {
    if (!audio?.url) return;

    const link = document.createElement('a');
    link.href = audio.url;
    link.download = `audio-${Date.now()}.mp3`;
    link.click();
  };

  const playAudio = () => {
    if (!audio?.url) return;

    const audioEl = new Audio(audio.url);
    audioEl.playbackRate = rate;
    audioEl.volume = volume;
    audioEl.play();
  };

  return (
    <div className="space-y-6">
      {/* Text Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Enter Text to Convert</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here... Any language supported!"
          maxLength={5000}
          className="w-full h-32 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
        />
        <p className="text-gray-500 text-xs mt-1">{text.length} / 5000 characters</p>
      </div>

      {/* Voice Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Voice</label>
        <select
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
        >
          {voices.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      {/* Pitch Control */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Pitch: {pitch.toFixed(1)}x
        </label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={pitch}
          onChange={(e) => setPitch(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Rate Control */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Speed: {rate.toFixed(1)}x
        </label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Volume Control */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Volume: {Math.round(volume * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={generateSpeech}
        disabled={isProcessing || !text.trim()}
        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded font-medium flex items-center justify-center gap-2 transition"
      >
        {isProcessing ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            Generate Speech
          </>
        )}
      </button>

      {/* Progress */}
      {isProcessing && (
        <div className="bg-gray-800 rounded p-3">
          <div className="w-full bg-gray-700 rounded h-2">
            <div
              className="bg-blue-500 h-2 rounded transition-all"
              style={{ width: `${tool.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Audio Player */}
      {audio && (
        <div className="bg-gray-800 border border-gray-700 rounded p-4 space-y-3">
          <p className="text-gray-300 font-medium">Audio Generated!</p>
          <div className="flex gap-2">
            <button
              onClick={playAudio}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition"
            >
              Play
            </button>
            <button
              onClick={downloadAudio}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              Download MP3
            </button>
          </div>
        </div>
      )}

      {/* Pro Badge */}
      {!isPro && (
        <div className="bg-amber-900 border border-amber-700 text-amber-200 px-4 py-3 rounded">
          <p className="font-medium">🔒 Pro Features</p>
          <p className="text-sm mt-1">
            Free: Basic voices | Pro: Neural voices, batch conversion, premium voice models
          </p>
        </div>
      )}
    </div>
  );
}

VoiceForgeTool.defaultProps = {
  isPro: false,
  onProcess: null,
  onUsage: null,
  onUpgradeRequired: null
};
