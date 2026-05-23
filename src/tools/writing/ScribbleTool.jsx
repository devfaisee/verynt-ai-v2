/**
 * ScribbleTool: Text rewriter with tone adjuster
 * Professional, Casual, Academic, Creative tones
 */

import React, { useState } from 'react';
import { Loader, Copy, Download, RefreshCw } from 'lucide-react';
import { useVernytTool } from '../../hooks/useVernytTool';

export default function ScribbleTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('scribble');
  const [inputText, setInputText] = useState('');
  const [tone, setTone] = useState('professional');
  const [outputText, setOutputText] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const tones = [
    { id: 'professional', label: 'Professional', icon: '💼' },
    { id: 'casual', label: 'Casual', icon: '😄' },
    { id: 'academic', label: 'Academic', icon: '🎓' },
    { id: 'creative', label: 'Creative', icon: '✨' },
    ...(isPro ? [{ id: 'persuasive', label: 'Persuasive', icon: '💪' }] : [])
  ];

  const handleRewrite = async () => {
    if (!inputText.trim()) return;

    if (!tool.checkPermission('rewrite', { length: inputText.length })) {
      onUpgradeRequired?.(tool.error);
      return;
    }

    setIsProcessing(true);
    try {
      tool.logUsage({ length: inputText.length, tone });

      const model = await tool.loadModel('text-rewriter');
      if (!model) return;

      // Mock rewritten text based on tone
      const toneDescriptions = {
        professional: 'Dear stakeholders, I am writing to formally communicate...',
        casual: 'Hey everyone! Just wanted to quickly reach out about...',
        academic: 'This paper investigates the substantive implications of...',
        creative: 'Imagine a world where everything changes in a moment...',
        persuasive: 'You absolutely must understand the critical importance of...'
      };

      const rewritten = `[Rewritten in ${tone} tone]\n\n${toneDescriptions[tone]}\n\n${inputText.substring(0, 100)}...`;

      setOutputText(rewritten);
      await tool.saveResult(`rewrite-${Date.now()}`, {
        original: inputText,
        rewritten: rewritten,
        tone: tone
      });

      onProcess?.(rewritten);
    } catch (err) {
      console.error('Rewrite error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadText = () => {
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rewritten-${tone}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Tone Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Select Tone</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {tones.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className={`px-3 py-2 rounded font-medium transition flex items-center gap-2 justify-center text-sm ${
                tone === t.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Text */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Original Text ({inputText.length} chars)
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to rewrite..."
          className="w-full h-40 px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500"
        />
      </div>

      {/* Processing */}
      {isProcessing && (
        <div className="bg-gray-800 rounded p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin text-blue-400" />
            <span className="text-gray-300">Rewriting in {tone} tone...</span>
          </div>
          <div className="w-full bg-gray-700 rounded h-2">
            <div
              className="bg-blue-500 h-2 rounded transition-all"
              style={{ width: `${tool.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Output Text */}
      {outputText && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Rewritten Text</label>
          <div className="bg-gray-800 border border-gray-700 rounded p-4 max-h-48 overflow-y-auto">
            <p className="text-gray-200 whitespace-pre-wrap">{outputText}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleRewrite}
          disabled={isProcessing || !inputText.trim()}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded font-medium flex items-center justify-center gap-2 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Rewrite
        </button>
        {outputText && (
          <>
            <button
              onClick={() => {
                navigator.clipboard.writeText(outputText);
                alert('Copied to clipboard!');
              }}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
            <button
              onClick={downloadText}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </>
        )}
      </div>

      {/* Pro Badge */}
      {!isPro && (
        <div className="bg-amber-900 border border-amber-700 text-amber-200 px-4 py-3 rounded">
          <p className="font-medium">🔒 Pro Feature</p>
          <p className="text-sm mt-1">Unlock persuasive tone and more advanced rewriting options</p>
        </div>
      )}
    </div>
  );
}

ScribbleTool.defaultProps = {
  isPro: false,
  onProcess: null,
  onUsage: null,
  onUpgradeRequired: null
};
