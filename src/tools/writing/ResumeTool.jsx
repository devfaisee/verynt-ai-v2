/**
 * ResumeTool: Resume improver with formatting
 * Suggestions for ATS optimization and formatting
 */

import React, { useState } from 'react';
import { Loader, Copy, Download, Sparkles } from 'lucide-react';
import { useVernytTool } from '../../hooks/useVernytTool';

export default function ResumeTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('resume-tool');
  const [inputText, setInputText] = useState('');
  const [improvedText, setImprovedText] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [format, setFormat] = useState('ats'); // ats, modern, classic

  const formats = [
    { id: 'ats', label: 'ATS-Optimized', desc: 'For automated scanning' },
    { id: 'modern', label: 'Modern', desc: 'Contemporary design', pro: true },
    { id: 'classic', label: 'Classic', desc: 'Professional & clean', pro: false }
  ];

  const handleImprove = async () => {
    if (!inputText.trim()) return;

    const selectedFormat = formats.find((f) => f.id === format);
    if (selectedFormat.pro && !isPro) {
      onUpgradeRequired?.({ type: 'pro_required' });
      return;
    }

    if (!tool.checkPermission('resume_improve', { length: inputText.length })) {
      onUpgradeRequired?.(tool.error);
      return;
    }

    setIsProcessing(true);
    try {
      tool.logUsage({ length: inputText.length, format });

      const model = await tool.loadModel('resume-improver');
      if (!model) return;

      const mockImproved = inputText
        .replace(/responsible for/gi, 'Led')
        .replace(/worked with/gi, 'Collaborated with')
        .replace(/helped/gi, 'Facilitated');

      const mockSuggestions = [
        {
          id: 1,
          category: 'Action Verbs',
          message: 'Use stronger action verbs like "Led" instead of "responsible for"'
        },
        {
          id: 2,
          category: 'Metrics',
          message: 'Add quantifiable achievements (e.g., "increased by 25%")'
        },
        {
          id: 3,
          category: 'Keywords',
          message: 'Include industry keywords for ATS optimization'
        },
        ...(isPro ? [
          {
            id: 4,
            category: 'Impact',
            message: 'Emphasize business impact and ROI'
          }
        ] : [])
      ];

      setImprovedText(mockImproved);
      setSuggestions(mockSuggestions);
      await tool.saveResult(`resume-${Date.now()}`, {
        original: inputText,
        improved: mockImproved,
        suggestions: mockSuggestions,
        format
      });

      onProcess?.(mockImproved);
    } catch (err) {
      console.error('Resume improve error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Format Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Resume Format</label>
        <div className="grid grid-cols-3 gap-2">
          {formats.map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => setFormat(fmt.id)}
              disabled={fmt.pro && !isPro}
              className={`px-3 py-2 rounded text-sm transition text-center ${
                format === fmt.id
                  ? 'bg-blue-600 text-white'
                  : fmt.pro && !isPro
                    ? 'bg-gray-700 text-gray-500 opacity-50 cursor-not-allowed'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {fmt.label}
              {fmt.pro && !isPro && ' 🔒'}
              <p className="text-xs opacity-75">{fmt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Text */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Current Resume</label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your resume content..."
          className="w-full h-40 px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500"
        />
      </div>

      {/* Processing */}
      {isProcessing && (
        <div className="bg-gray-800 rounded p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin text-blue-400" />
            <span className="text-gray-300">Improving resume...</span>
          </div>
          <div className="w-full bg-gray-700 rounded h-2">
            <div
              className="bg-blue-500 h-2 rounded transition-all"
              style={{ width: `${tool.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Improvement Suggestions
          </label>
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="bg-blue-900 border border-blue-700 rounded p-3">
              <p className="text-blue-300 text-sm font-medium">{suggestion.category}</p>
              <p className="text-blue-200 text-sm mt-1">{suggestion.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Improved Text */}
      {improvedText && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Improved Resume</label>
          <div className="bg-gray-800 border border-gray-700 rounded p-4 max-h-48 overflow-y-auto">
            <p className="text-gray-200 whitespace-pre-wrap text-sm">{improvedText}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      {improvedText && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded p-3 text-center">
            <p className="text-gray-400 text-xs">Words</p>
            <p className="text-gray-200 font-bold">{improvedText.split(/\s+/).length}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded p-3 text-center">
            <p className="text-gray-400 text-xs">Improvements</p>
            <p className="text-gray-200 font-bold">{suggestions.length}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded p-3 text-center">
            <p className="text-gray-400 text-xs">Score</p>
            <p className="text-gray-200 font-bold">89/100</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleImprove}
          disabled={isProcessing || !inputText.trim()}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded font-medium transition"
        >
          Improve Resume
        </button>
        {improvedText && (
          <>
            <button
              onClick={() => {
                navigator.clipboard.writeText(improvedText);
                alert('Copied to clipboard!');
              }}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
            <button
              onClick={() => {
                const blob = new Blob([improvedText], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `resume-${format}.txt`;
                a.click();
              }}
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
          <p className="text-sm mt-1">Modern formatting and advanced optimization</p>
        </div>
      )}
    </div>
  );
}

ResumeTool.defaultProps = {
  isPro: false,
  onProcess: null,
  onUsage: null,
  onUpgradeRequired: null
};
