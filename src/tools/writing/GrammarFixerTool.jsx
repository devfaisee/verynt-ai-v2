/**
 * GrammarFixerTool: Grammar and spelling correction
 * Detects errors and provides suggestions
 */

import React, { useState } from 'react';
import { Loader, Copy, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { useVernytTool } from '../../hooks/useVernytTool';

export default function GrammarFixerTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('grammar-fixer');
  const [inputText, setInputText] = useState('');
  const [correctedText, setCorrectedText] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheck = async () => {
    if (!inputText.trim()) return;

    if (!tool.checkPermission('grammar_check', { length: inputText.length })) {
      onUpgradeRequired?.(tool.error);
      return;
    }

    setIsProcessing(true);
    try {
      tool.logUsage({ length: inputText.length });

      const model = await tool.loadModel('grammar-checker');
      if (!model) return;

      // Mock corrections and errors
      const mockCorrected = inputText
        .replace(/thier/gi, 'their')
        .replace(/recieve/gi, 'receive')
        .replace(/occured/gi, 'occurred');

      const mockErrors = [
        {
          id: 1,
          type: 'spelling',
          message: 'Did you mean "their"?',
          position: 'word',
          suggestion: 'their'
        },
        {
          id: 2,
          type: 'grammar',
          message: 'Subject-verb agreement: "data" is plural',
          position: 'clause',
          suggestion: 'use plural verb'
        }
      ];

      setCorrectedText(mockCorrected);
      setErrors(mockErrors);
      await tool.saveResult(`grammar-${Date.now()}`, {
        original: inputText,
        corrected: mockCorrected,
        errors: mockErrors
      });

      onProcess?.(mockCorrected);
    } catch (err) {
      console.error('Grammar check error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Text */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Text ({inputText.length} chars)
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your text here..."
          className="w-full h-40 px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500"
        />
      </div>

      {/* Processing */}
      {isProcessing && (
        <div className="bg-gray-800 rounded p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin text-blue-400" />
            <span className="text-gray-300">Checking grammar...</span>
          </div>
          <div className="w-full bg-gray-700 rounded h-2">
            <div
              className="bg-blue-500 h-2 rounded transition-all"
              style={{ width: `${tool.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Errors Found */}
      {errors.length > 0 && (
        <div className="bg-red-900 border border-red-700 rounded p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-200 font-medium">{errors.length} issue(s) found</span>
          </div>
          <div className="space-y-2">
            {errors.map((error) => (
              <div key={error.id} className="bg-red-800/50 rounded p-2">
                <p className="text-red-200 text-sm font-medium">{error.message}</p>
                <p className="text-red-300 text-xs mt-1">
                  <span className="bg-red-700 px-2 py-0.5 rounded">
                    {error.type.toUpperCase()}
                  </span>
                  {' '} Suggestion: {error.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Errors Found */}
      {correctedText && errors.length === 0 && (
        <div className="bg-green-900 border border-green-700 rounded p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <div>
            <p className="text-green-200 font-medium">Perfect!</p>
            <p className="text-green-300 text-sm">No grammar or spelling errors detected</p>
          </div>
        </div>
      )}

      {/* Corrected Text */}
      {correctedText && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Corrected Text</label>
          <div className="bg-gray-800 border border-gray-700 rounded p-4 max-h-48 overflow-y-auto">
            <p className="text-gray-200 whitespace-pre-wrap">{correctedText}</p>
          </div>
        </div>
      )}

      {/* Statistics */}
      {correctedText && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded p-3 text-center">
            <p className="text-gray-400 text-xs">Words</p>
            <p className="text-gray-200 font-bold">{correctedText.split(/\s+/).length}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded p-3 text-center">
            <p className="text-gray-400 text-xs">Reading Level</p>
            <p className="text-gray-200 font-bold">12th Grade</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded p-3 text-center">
            <p className="text-gray-400 text-xs">Score</p>
            <p className="text-gray-200 font-bold">95/100</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleCheck}
          disabled={isProcessing || !inputText.trim()}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded font-medium transition"
        >
          Check Grammar
        </button>
        {correctedText && (
          <>
            <button
              onClick={() => {
                navigator.clipboard.writeText(correctedText);
                alert('Copied to clipboard!');
              }}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
            <button
              onClick={() => {
                const blob = new Blob([correctedText], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'corrected-text.txt';
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
          <p className="text-sm mt-1">Style suggestions and tone detection</p>
        </div>
      )}
    </div>
  );
}

GrammarFixerTool.defaultProps = {
  isPro: false,
  onProcess: null,
  onUsage: null,
  onUpgradeRequired: null
};
