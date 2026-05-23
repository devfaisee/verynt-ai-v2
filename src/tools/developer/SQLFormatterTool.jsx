/**
 * SQLFormatterTool: Format SQL queries
 * Beautify, validate, and explain SQL
 */

import React, { useState } from 'react';
import { Copy, Download } from 'lucide-react';
import { useVernytTool } from '../../hooks/useVernytTool';

export default function SQLFormatterTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('sql-formatter');
  const [inputSQL, setInputSQL] = useState('');
  const [outputSQL, setOutputSQL] = useState(null);
  const [dialect, setDialect] = useState('mysql');

  const dialects = [
    { id: 'mysql', label: 'MySQL' },
    { id: 'postgres', label: 'PostgreSQL' },
    { id: 'mssql', label: 'MSSQL' },
    { id: 'sqlite', label: 'SQLite' }
  ];

  const formatSQL = () => {
    if (!inputSQL.trim()) return;

    // Simple SQL formatting
    let formatted = inputSQL
      .replace(/\s+/g, ' ')
      .replace(/SELECT/gi, 'SELECT\n  ')
      .replace(/FROM/gi, '\nFROM ')
      .replace(/WHERE/gi, '\nWHERE ')
      .replace(/JOIN/gi, '\nJOIN ')
      .replace(/ORDER BY/gi, '\nORDER BY ')
      .replace(/GROUP BY/gi, '\nGROUP BY ')
      .replace(/,/g, ',\n  ');

    setOutputSQL(formatted);
    tool.logUsage({ length: inputSQL.length, dialect });
    onProcess?.(formatted);
  };

  return (
    <div className="space-y-6">
      {/* Dialect Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">SQL Dialect</label>
        <div className="grid grid-cols-2 gap-2">
          {dialects.map((d) => (
            <button
              key={d.id}
              onClick={() => setDialect(d.id)}
              className={`px-3 py-2 rounded font-medium transition text-sm ${
                dialect === d.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input SQL */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          SQL Query ({inputSQL.length} chars)
        </label>
        <textarea
          value={inputSQL}
          onChange={(e) => setInputSQL(e.target.value)}
          placeholder="SELECT * FROM users WHERE id = 1;"
          className="w-full h-40 px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500 font-mono text-sm"
        />
      </div>

      {/* Format Button */}
      <button
        onClick={formatSQL}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
      >
        Format SQL
      </button>

      {/* Output SQL */}
      {outputSQL && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Formatted SQL</label>
          <textarea
            value={outputSQL}
            readOnly
            className="w-full h-40 px-3 py-2 bg-gray-800 text-gray-200 rounded border border-gray-700 font-mono text-sm"
          />
        </div>
      )}

      {/* Statistics */}
      {outputSQL && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded p-3 text-center">
            <p className="text-gray-400 text-xs">Original Size</p>
            <p className="text-gray-200 font-bold">{inputSQL.length} chars</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded p-3 text-center">
            <p className="text-gray-400 text-xs">Formatted Size</p>
            <p className="text-gray-200 font-bold">{outputSQL.length} chars</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded p-3 text-center">
            <p className="text-gray-400 text-xs">Lines</p>
            <p className="text-gray-200 font-bold">{outputSQL.split('\n').length}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {outputSQL && (
        <div className="flex gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(outputSQL);
              alert('Copied!');
            }}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
          <button
            onClick={() => {
              const blob = new Blob([outputSQL], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `query-${dialect}.sql`;
              a.click();
            }}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      )}

      {/* Pro Badge */}
      {!isPro && (
        <div className="bg-amber-900 border border-amber-700 text-amber-200 px-4 py-3 rounded">
          <p className="font-medium">🔒 Pro Feature</p>
          <p className="text-sm mt-1">Query validation, optimization suggestions, and execution plans</p>
        </div>
      )}
    </div>
  );
}

SQLFormatterTool.defaultProps = {
  isPro: false,
  onProcess: null,
  onUsage: null,
  onUpgradeRequired: null
};
