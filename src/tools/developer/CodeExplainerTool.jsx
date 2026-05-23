/**
 * CodeExplainerTool: Explain code in plain English
 * Break down complex code and explain logic
 */

import React, { useState } from 'react';
import { Loader, Copy, Download } from 'lucide-react';
import { useVernytTool } from '../../hooks/useVernytTool';

export default function CodeExplainerTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('code-explainer');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [explanation, setExplanation] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const languages = [
    'javascript',
    'python',
    'java',
    'cpp',
    'csharp',
    'ruby',
    'go',
    'rust',
    'sql',
    'html',
    'css'
  ];

  const explainCode = async () => {
    if (!code.trim()) return;

    if (!tool.checkPermission('explain_code', { length: code.length })) {
      onUpgradeRequired?.(tool.error);
      return;
    }

    setIsProcessing(true);
    try {
      tool.logUsage({ length: code.length, language });

      const model = await tool.loadModel('code-explainer');
      if (!model) return;

      // Mock explanation
      const mockExplanation = `## Code Explanation

### Overview
This code snippet demonstrates a basic pattern used in ${language} programming.

### Line-by-Line Breakdown

1. **Line 1-3**: Declaration and initialization
   - Sets up the necessary variables and data structures
   - Initializes with default values

2. **Line 4-7**: Main logic
   - Processes the input data
   - Applies transformations as needed

3. **Line 8-10**: Output and return
   - Formats the result for consumption
   - Returns the final value

### Key Concepts
- **Efficiency**: O(n) time complexity
- **Pattern**: Following the singleton pattern
- **Best Practices**: Uses immutable data structures where possible

### Potential Improvements
${isPro ? `- Consider using async/await for better readability
- Add error handling for edge cases
- Implement caching for frequently used values` : `- Add more descriptive variable names
- Include error handling
- Add comments for clarity`}`;

      setExplanation(mockExplanation);
      await tool.saveResult(`code-explain-${Date.now()}`, {
        code,
        language,
        explanation: mockExplanation
      });

      onProcess?.(mockExplanation);
    } catch (err) {
      console.error('Code explanation error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Programming Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Code Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Code ({code.length} chars)
        </label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`// Paste your ${language} code here...`}
          className="w-full h-40 px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500 font-mono text-sm"
        />
      </div>

      {/* Processing */}
      {isProcessing && (
        <div className="bg-gray-800 rounded p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin text-blue-400" />
            <span className="text-gray-300">Analyzing and explaining code...</span>
          </div>
          <div className="w-full bg-gray-700 rounded h-2">
            <div
              className="bg-blue-500 h-2 rounded transition-all"
              style={{ width: `${tool.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Explanation */}
      {explanation && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Explanation</label>
          <div className="bg-gray-800 border border-gray-700 rounded p-4 max-h-64 overflow-y-auto text-sm text-gray-200 prose prose-invert prose-sm">
            {explanation.split('\n').map((line, idx) => (
              <p
                key={idx}
                className={`mb-2 ${line.startsWith('#') ? 'font-bold text-blue-300' : ''} ${line.startsWith('-') ? 'ml-4' : ''}`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      {explanation && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded p-3 text-center">
            <p className="text-gray-400 text-xs">Lines</p>
            <p className="text-gray-200 font-bold">{code.split('\n').length}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded p-3 text-center">
            <p className="text-gray-400 text-xs">Words</p>
            <p className="text-gray-200 font-bold">{explanation.split(/\s+/).length}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded p-3 text-center">
            <p className="text-gray-400 text-xs">Language</p>
            <p className="text-gray-200 font-bold">{language.toUpperCase()}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={explainCode}
          disabled={isProcessing || !code.trim()}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded font-medium transition"
        >
          Explain Code
        </button>
        {explanation && (
          <>
            <button
              onClick={() => {
                navigator.clipboard.writeText(explanation);
                alert('Copied!');
              }}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
            <button
              onClick={() => {
                const blob = new Blob([explanation], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `explanation-${language}.txt`;
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
          <p className="text-sm mt-1">Code refactoring suggestions and performance analysis</p>
        </div>
      )}
    </div>
  );
}

CodeExplainerTool.defaultProps = {
  isPro: false,
  onProcess: null,
  onUsage: null,
  onUpgradeRequired: null
};
