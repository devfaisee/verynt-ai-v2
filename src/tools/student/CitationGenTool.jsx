/**
 * CitationGenTool: Generate citations (APA, MLA, Chicago)
 * Auto-format bibliography from source information
 */

import React, { useState } from 'react';
import { Copy, Download, Plus, Trash2 } from 'lucide-react';
import { useVernytTool } from '../../hooks/useVernytTool';

export default function CitationGenTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('citation-gen');
  const [format, setFormat] = useState('apa');
  const [citations, setCitations] = useState([]);
  const [formData, setFormData] = useState({
    author: '',
    title: '',
    year: '',
    publisher: '',
    url: ''
  });

  const formats = [
    { id: 'apa', label: 'APA (7th)' },
    { id: 'mla', label: 'MLA (9th)' },
    { id: 'chicago', label: 'Chicago (17th)', pro: true },
    { id: 'harvard', label: 'Harvard', pro: true }
  ];

  const generateCitation = () => {
    if (!formData.author.trim() || !formData.title.trim()) {
      alert('Author and Title are required');
      return;
    }

    // Mock citation generation
    const templates = {
      apa: `${formData.author} (${formData.year}). ${formData.title}. ${formData.publisher}. Retrieved from ${formData.url}`,
      mla: `${formData.author}. "${formData.title}." ${formData.publisher}, ${formData.year}.`,
      chicago: `${formData.author}. ${formData.title}. ${formData.publisher}, ${formData.year}. Accessed ${new Date().toLocaleDateString()}.`,
      harvard: `${formData.author} ${formData.year}, '${formData.title}', ${formData.publisher}.`
    };

    const newCitation = {
      id: Date.now(),
      format,
      text: templates[format],
      source: formData
    };

    setCitations([newCitation, ...citations]);
    setFormData({ author: '', title: '', year: '', publisher: '', url: '' });

    tool.logUsage({ format, sourceCount: citations.length + 1 });
  };

  const removeCitation = (id) => {
    setCitations(citations.filter((c) => c.id !== id));
  };

  const downloadBibliography = () => {
    const content = citations.map((c) => c.text).join('\n\n');
    const blob = new Blob([`Bibliography (${format.toUpperCase()})\n\n${content}`], {
      type: 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bibliography-${format}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Format Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Citation Format</label>
        <div className="grid grid-cols-2 gap-2">
          {formats.map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => setFormat(fmt.id)}
              disabled={fmt.pro && !isPro}
              className={`px-3 py-2 rounded font-medium transition text-sm ${
                format === fmt.id
                  ? 'bg-blue-600 text-white'
                  : fmt.pro && !isPro
                    ? 'bg-gray-700 text-gray-500 opacity-50 cursor-not-allowed'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {fmt.label}
              {fmt.pro && !isPro && ' 🔒'}
            </button>
          ))}
        </div>
      </div>

      {/* Source Information Form */}
      <div className="bg-gray-800 border border-gray-700 rounded p-4 space-y-3">
        <h3 className="text-sm font-medium text-gray-300">Add Source</h3>

        <input
          type="text"
          placeholder="Author(s)"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500 text-sm"
        />

        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500 text-sm"
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Year"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500 text-sm"
          />
          <input
            type="text"
            placeholder="Publisher"
            value={formData.publisher}
            onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
            className="px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500 text-sm"
          />
        </div>

        <input
          type="url"
          placeholder="URL (optional)"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500 text-sm"
        />

        <button
          onClick={generateCitation}
          className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Add Citation
        </button>
      </div>

      {/* Citations List */}
      {citations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-300">Bibliography ({citations.length})</label>
            <button
              onClick={downloadBibliography}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {citations.map((citation) => (
              <div key={citation.id} className="bg-gray-800 border border-gray-700 rounded p-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-gray-400 text-xs font-bold px-2 py-1 bg-gray-700 rounded">
                    {citation.format.toUpperCase()}
                  </span>
                  <button
                    onClick={() => removeCitation(citation.id)}
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed font-mono">{citation.text}</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(citation.text);
                    alert('Copied!');
                  }}
                  className="mt-2 text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Format Preview */}
      <div className="bg-blue-900 border border-blue-700 rounded p-4">
        <p className="text-blue-200 text-sm">
          <strong>Format:</strong> Citations will be formatted in {formats.find((f) => f.id === format)?.label}
        </p>
      </div>

      {/* Pro Badge */}
      {!isPro && (
        <div className="bg-amber-900 border border-amber-700 text-amber-200 px-4 py-3 rounded">
          <p className="font-medium">🔒 Pro Feature</p>
          <p className="text-sm mt-1">Chicago and Harvard formats, plus academic database integration</p>
        </div>
      )}
    </div>
  );
}

CitationGenTool.defaultProps = {
  isPro: false,
  onProcess: null,
  onUsage: null,
  onUpgradeRequired: null
};
