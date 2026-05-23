/**
 * JSONFormatterTool: Format and validate JSON
 * Minify, beautify, and error detection
 */

import React, { useState } from 'react';
import { Copy, Download, Check, AlertCircle } from 'lucide-react';
import { useVernytTool } from '../../hooks/useVernytTool';

export default function JSONFormatterTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('json-formatter');
  const [inputJSON, setInputJSON] = useState('');
  const [outputJSON, setOutputJSON] = useState(null);
  const [isValid, setIsValid] = useState(null);
  const [format, setFormat] = useState('beautify');
  const [indent, setIndent] = useState(2);

  const validateAndFormat = () => {
    try {
      const parsed = JSON.parse(inputJSON);
      setIsValid(true);

      if (format === 'beautify') {
        setOutputJSON(JSON.stringify(parsed, null, indent));
      } else if (format === 'minify') {
        setOutputJSON(JSON.stringify(parsed));
      } else if (format === 'sort') {
        const sorted = JSON.stringify(parsed, Object.keys(parsed).sort(), indent);
        setOutputJSON(sorted);
      }

      tool.logUsage({ length: inputJSON.length, format });
      onProcess?.(outputJSON);
    } catch (err) {
      setIsValid(false);
      setOutputJSON(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Format Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Operation</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'beautify', label: 'Beautify' },
            { id: 'minify', label: 'Minify' },
            { id: 'sort', label: 'Sort Keys', pro: true }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFormat(opt.id)}
              disabled={opt.pro && !isPro}
              className={`px-3 py-2 rounded font-medium transition text-sm ${
                format === opt.id
                  ? 'bg-blue-600 text-white'
                  : opt.pro && !isPro
                    ? 'bg-gray-700 text-gray-500 opacity-50 cursor-not-allowed'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {opt.label}
              {opt.pro && !isPro && ' 🔒'}
            </button>
          ))}
        </div>
      </div>

      {/* Indent Setting */}
      {format === 'beautify' && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Indent Size</label>
          <select
            value={indent}
            onChange={(e) => setIndent(parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={8}>8 spaces</option>
          </select>
        </div>
      )}

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Input JSON ({inputJSON.length} chars)
        </label>
        <textarea
          value={inputJSON}
          onChange={(e) => setInputJSON(e.target.value)}
          placeholder="Paste your JSON here..."
          className="w-full h-40 px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500 font-mono text-sm"
        />
      </div>

      {/* Validation Status */}
      {isValid !== null && (
        <div
          className={`rounded p-3 flex items-center gap-2 ${
            isValid
              ? 'bg-green-900 border border-green-700 text-green-200'
              : 'bg-red-900 border border-red-700 text-red-200'
          }`}
        >
          {isValid ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {isValid ? 'Valid JSON' : 'Invalid JSON - check syntax'}
        </div>
      )}

      {/* Output */}
      {outputJSON && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Formatted Output</label>
          <textarea
            value={outputJSON}
            readOnly
            className="w-full h-40 px-3 py-2 bg-gray-800 text-gray-200 rounded border border-gray-700 font-mono text-sm"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={validateAndFormat}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
        >
          Format
        </button>
        {outputJSON && (
          <>
            <button
              onClick={() => {
                navigator.clipboard.writeText(outputJSON);
                alert('Copied!');
              }}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
            <button
              onClick={() => {
                const blob = new Blob([outputJSON], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'formatted.json';
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
          <p className="text-sm mt-1">JSON schema validation and auto-conversion from CSV/YAML</p>
        </div>
      )}
    </div>
  );
}

JSONFormatterTool.defaultProps = {
  isPro: false,
  onProcess: null,
  onUsage: null,
  onUpgradeRequired: null
};
