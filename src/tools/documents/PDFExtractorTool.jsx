/**
 * PDFExtractorTool: Extract specific pages from PDF
 * Create new PDFs with selected page ranges
 */

import React, { useState, useRef } from 'react';
import { Upload, Download, Loader } from 'lucide-react';
import { useVernytTool } from '../../hooks/useVernytTool';

export default function PDFExtractorTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('pdf-extractor');
  const [file, setFile] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [pageRange, setPageRange] = useState('1-10');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFile(files[0]);
  };

  const handleFile = async (selectedFile) => {
    if (!selectedFile) return;

    const limits = tool.getLimits();
    if (selectedFile.size > limits.maxFileSize) {
      alert(`File too large. Max: ${limits.maxFileSize / 1024 / 1024}MB`);
      return;
    }

    setFile(selectedFile);

    // Mock: Load PDF and get page count
    const mockPageCount = Math.floor(Math.random() * 100) + 20;
    setPageInfo({
      totalPages: mockPageCount,
      filename: selectedFile.name,
      size: selectedFile.size / 1024 / 1024
    });

    setPageRange(`1-${Math.min(10, mockPageCount)}`);
    setResult(null);
  };

  const extractPages = async () => {
    if (!file || !pageInfo) return;

    if (!tool.checkPermission('extract_pdf', { pages: pageRange })) {
      onUpgradeRequired?.(tool.error);
      return;
    }

    setIsProcessing(true);
    try {
      tool.logUsage({ pageRange, totalPages: pageInfo.totalPages });

      const model = await tool.loadModel('pdf-extractor');
      if (!model) return;

      // Parse page range
      const ranges = pageRange.split(',').map((r) => r.trim());
      let extractedPages = 0;
      ranges.forEach((r) => {
        if (r.includes('-')) {
          const [start, end] = r.split('-').map((x) => parseInt(x));
          extractedPages += end - start + 1;
        } else {
          extractedPages += 1;
        }
      });

      const mockResult = {
        filename: `extracted-${file.name}`,
        originalPages: pageInfo.totalPages,
        extractedPages: extractedPages,
        pageRange: pageRange,
        size: (file.size * (extractedPages / pageInfo.totalPages)).toFixed(2)
      };

      setResult(mockResult);
      await tool.saveResult(`extract-${Date.now()}`, mockResult);
      onProcess?.(mockResult);
    } catch (err) {
      console.error('Extraction error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadExtracted = () => {
    const blob = new Blob(['[Extracted PDF Data]'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
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
        <p className="text-gray-300 font-medium mb-2">Drag & drop PDF here</p>
        <p className="text-gray-500 text-sm mb-4">Max 500MB</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
        >
          Choose File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />
      </div>

      {/* File Info */}
      {pageInfo && (
        <div className="bg-gray-800 border border-gray-700 rounded p-4">
          <p className="text-gray-300 font-medium mb-2">File Info</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Total Pages</p>
              <p className="text-gray-200 font-bold">{pageInfo.totalPages}</p>
            </div>
            <div>
              <p className="text-gray-400">File Size</p>
              <p className="text-gray-200 font-bold">{pageInfo.size.toFixed(2)}MB</p>
            </div>
            <div>
              <p className="text-gray-400">Name</p>
              <p className="text-gray-200 font-bold text-xs truncate">{pageInfo.filename}</p>
            </div>
          </div>
        </div>
      )}

      {/* Page Range Input */}
      {pageInfo && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Page Range</label>
          <input
            type="text"
            value={pageRange}
            onChange={(e) => setPageRange(e.target.value)}
            placeholder="e.g., 1-5,7,9-12"
            className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500"
          />
          <p className="text-gray-400 text-xs mt-2">
            Format: Single pages (1,3,5) or ranges (1-5,10-15), or all
          </p>
        </div>
      )}

      {/* Preset Buttons */}
      {pageInfo && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Quick Presets</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPageRange(`1-${Math.min(5, pageInfo.totalPages)}`)}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition"
            >
              First 5 Pages
            </button>
            <button
              onClick={() => setPageRange(`1-${pageInfo.totalPages}`)}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition"
            >
              All Pages
            </button>
            <button
              onClick={() => {
                const start = Math.max(1, pageInfo.totalPages - 5);
                setPageRange(`${start}-${pageInfo.totalPages}`);
              }}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition"
            >
              Last 5 Pages
            </button>
            {isPro && (
              <button
                onClick={() => setPageRange('odd')}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition"
              >
                Odd Pages Only
              </button>
            )}
          </div>
        </div>
      )}

      {/* Processing */}
      {isProcessing && (
        <div className="bg-gray-800 rounded p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin text-blue-400" />
            <span className="text-gray-300">Extracting pages...</span>
          </div>
          <div className="w-full bg-gray-700 rounded h-2">
            <div
              className="bg-blue-500 h-2 rounded transition-all"
              style={{ width: `${tool.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-green-900 border border-green-700 rounded p-4 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-300 text-sm">Extracted Pages</p>
              <p className="text-green-200 font-bold">{result.extractedPages}</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">File Size</p>
              <p className="text-green-200 font-bold">{result.size}MB</p>
            </div>
          </div>
          <button
            onClick={downloadExtracted}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            Download Extracted PDF
          </button>
        </div>
      )}

      {/* Action Button */}
      {pageInfo && !isProcessing && !result && (
        <button
          onClick={extractPages}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
        >
          Extract Pages
        </button>
      )}

      {/* Pro Badge */}
      {!isPro && (
        <div className="bg-amber-900 border border-amber-700 text-amber-200 px-4 py-3 rounded">
          <p className="font-medium">🔒 Pro Feature</p>
          <p className="text-sm mt-1">Advanced filters: odd/even pages, custom patterns</p>
        </div>
      )}
    </div>
  );
}

PDFExtractorTool.defaultProps = {
  isPro: false,
  onProcess: null,
  onUsage: null,
  onUpgradeRequired: null
};
