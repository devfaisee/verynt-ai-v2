/**
 * RegexGenTool: Generate regex patterns
 * Visual regex builder and pattern testing
 */

import React, { useState } from 'react';
import { Copy, Download } from 'lucide-react';
import { useVernytTool } from '../../hooks/useVernytTool';

export default function RegexGenTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('regex-gen');
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState([]);
  const [flags, setFlags] = useState('g');

  const commonPatterns = [
    { name: 'Email', pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' },
    { name: 'URL', pattern: 'https?://[^\\s]+' },
    { name: 'Phone', pattern: '\\d{3}-\\d{3}-\\d{4}' },
    { name: 'Date (MM/DD/YYYY)', pattern: '\\d{2}/\\d{2}/\\d{4}' },
    { name: 'Hex Color', pattern: '#[0-9A-Fa-f]{6}' },
    { name: 'IPv4', pattern: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}' }
  ];

  const testRegex = () => {
    try {
      const regex = new RegExp(pattern, flags);
      const found = testString.match(regex);

      if (found) {
        setMatches(found);
        tool.logUsage({ pattern, testLength: testString.length });
        onProcess?.({ pattern, matches: found });
      } else {
        setMatches([]);
      }
    } catch (err) {
      console.error('Regex error:', err);
      setMatches([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Regex Pattern Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Regex Pattern</label>
        <input
          type="text"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="Enter regex pattern (without slashes)"
          className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500 font-mono"
        />
      </div>

      {/* Flags */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Flags</label>
        <div className="flex gap-4">
          {[
            { label: 'Global (g)', value: 'g' },
            { label: 'Ignore Case (i)', value: 'i' },
            { label: 'Multiline (m)', value: 'm' }
          ].map((flag) => (
            <label key={flag.value} className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                checked={flags.includes(flag.value)}
                onChange={(e) => {
                  const newFlags = e.target.checked
                    ? flags + flag.value
                    : flags.replace(flag.value, '');
                  setFlags(newFlags || 'g');
                }}
                className="accent-blue-500"
              />
              {flag.label}
            </label>
          ))}
        </div>
      </div>

      {/* Common Patterns */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Common Patterns</label>
        <div className="grid grid-cols-2 gap-2">
          {commonPatterns.map((p) => (
            <button
              key={p.name}
              onClick={() => setPattern(p.pattern)}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition text-left"
            >
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-gray-400 font-mono truncate">{p.pattern}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Test String */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Test String</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test against..."
          className="w-full h-32 px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500 font-mono text-sm"
        />
      </div>

      {/* Test Button */}
      <button
        onClick={testRegex}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
      >
        Test Pattern
      </button>

      {/* Results */}
      {matches.length > 0 && (
        <div className="bg-green-900 border border-green-700 rounded p-4">
          <p className="text-green-200 font-medium mb-3">Matches Found: {matches.length}</p>
          <div className="space-y-2">
            {matches.map((match, idx) => (
              <div key={idx} className="bg-green-800/50 rounded p-2">
                <p className="text-green-200 font-mono text-sm">{match}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {matches.length === 0 && testString && (
        <div className="bg-red-900 border border-red-700 rounded p-4 text-red-200">
          No matches found
        </div>
      )}

      {/* Copy Button */}
      {pattern && (
        <button
          onClick={() => {
            navigator.clipboard.writeText(pattern);
            alert('Pattern copied!');
          }}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
        >
          <Copy className="w-4 h-4" />
          Copy Pattern
        </button>
      )}

      {/* Pro Badge */}
      {!isPro && (
        <div className="bg-amber-900 border border-amber-700 text-amber-200 px-4 py-3 rounded">
          <p className="font-medium">🔒 Pro Feature</p>
          <p className="text-sm mt-1">Visual regex builder and pattern explanation</p>
        </div>
      )}
    </div>
  );
}

RegexGenTool.defaultProps = {
  isPro: false,
  onProcess: null,
  onUsage: null,
  onUpgradeRequired: null
};
