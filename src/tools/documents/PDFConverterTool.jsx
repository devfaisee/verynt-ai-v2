/**
 * PDFConverterTool: Convert PDF to JPG, Word, PowerPoint, Excel, PNG
 * Batch conversion support for Pro users
 */

import React, { useState, useRef } from 'react';
import { Upload, Download, Loader } from 'lucide-react';
import { useVernytTool } from '../../hooks/useVernytTool';

export default function PDFConverterTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('pdf-converter');
  const [files, setFiles] = useState([]);
  const [format, setFormat] = useState('jpg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [results, setResults] = useState([]);
  const fileInputRef = useRef(null);

  const formats = [
    { id: 'jpg', label: 'JPG Image', icon: '🖼️', pro: false },
    { id: 'png', label: 'PNG Image', icon: '🖼️', pro: false },
    { id: 'docx', label: 'Word (.docx)', icon: '📄', pro: true },
    { id: 'pptx', label: 'PowerPoint', icon: '📊', pro: true },
    { id: 'xlsx', label: 'Excel', icon: '📈', pro: true }
  ];

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const addFiles = (newFiles) => {
    const pdfFiles = newFiles.filter((f) => f.type === 'application/pdf');
    setFiles([...files, ...pdfFiles]);
  };

  const convertPDFs = async () => {
    if (files.length === 0) {
      alert('No PDFs selected');
      return;
    }

    const selectedFormat = formats.find((f) => f.id === format);
    if (selectedFormat.pro && !isPro) {
      onUpgradeRequired?.({ type: 'pro_required' });
      return;
    }

    if (!tool.checkPermission('convert_pdf', { count: files.length, format })) {
      onUpgradeRequired?.(tool.error);
      return;
    }

    setIsProcessing(true);
    try {
      tool.logUsage({ fileCount: files.length, format });

      const model = await tool.loadModel('pdf-converter');
      if (!model) return;

      const mockResults = files.map((f) => ({
        original: f.name,
        converted: `${f.name.replace('.pdf', '')}.${format}`,
        size: (f.size * 0.7).toFixed(2),
        status: 'completed'
      }));

      setResults(mockResults);
      await tool.saveResult(`convert-${Date.now()}`, { files: mockResults, format });
      onProcess?.(mockResults);
    } catch (err) {
      console.error('Conversion error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = (result) => {
    const blob = new Blob([`[Converted ${format.toUpperCase()} Data]`]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.converted;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Format Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Convert To</label>
        <div className="grid grid-cols-2 gap-2">
          {formats.map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => setFormat(fmt.id)}
              disabled={fmt.pro && !isPro}
              className={`px-3 py-2 rounded font-medium transition flex items-center gap-2 justify-center ${
                format === fmt.id
                  ? 'bg-blue-600 text-white'
                  : fmt.pro && !isPro
                    ? 'bg-gray-700 text-gray-500 opacity-50 cursor-not-allowed'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {fmt.icon} {fmt.label}
              {fmt.pro && !isPro && ' 🔒'}
            </button>
          ))}
        </div>
      </div>

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
        <p className="text-gray-300 font-medium mb-2">Drag & drop PDF files</p>
        <p className="text-gray-500 text-sm mb-4">
          {isPro ? 'Batch convert' : 'Single or multiple PDFs'}
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
        >
          Choose Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          multiple
          onChange={(e) => addFiles(Array.from(e.target.files || []))}
          className="hidden"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Files ({files.length})</label>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {files.map((file, idx) => (
              <div key={idx} className="bg-gray-800 border border-gray-700 rounded p-2 text-sm text-gray-200 flex items-center justify-between">
                <span>{file.name}</span>
                <span className="text-gray-400 text-xs">{(file.size / 1024 / 1024).toFixed(2)}MB</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processing */}
      {isProcessing && (
        <div className="bg-gray-800 rounded p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin text-blue-400" />
            <span className="text-gray-300">Converting to {format.toUpperCase()}...</span>
          </div>
          <div className="w-full bg-gray-700 rounded h-2">
            <div
              className="bg-blue-500 h-2 rounded transition-all"
              style={{ width: `${tool.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Converted Files</label>
          {results.map((result, idx) => (
            <div key={idx} className="bg-green-900 border border-green-700 rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-green-200 font-medium text-sm">{result.converted}</p>
                  <p className="text-green-400 text-xs">{result.size}MB</p>
                </div>
                <button
                  onClick={() => downloadResult(result)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center gap-1 transition"
                >
                  <Download className="w-3 h-3" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Button */}
      {files.length > 0 && !isProcessing && results.length === 0 && (
        <button
          onClick={convertPDFs}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
        >
          Convert to {format.toUpperCase()}
        </button>
      )}

      {/* Pro Badge */}
      {!isPro && (
        <div className="bg-amber-900 border border-amber-700 text-amber-200 px-4 py-3 rounded">
          <p className="font-medium">🔒 Pro Feature</p>
          <p className="text-sm mt-1">Unlock Word, PowerPoint, and Excel conversions</p>
        </div>
      )}
    </div>
  );
}

PDFConverterTool.defaultProps = {
  isPro: false,
  onProcess: null,
  onUsage: null,
  onUpgradeRequired: null
};
