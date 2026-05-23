/**
 * HandwritingTool: Recognize handwritten text from images
 * Convert handwritten notes to digital text
 */

import React, { useState, useRef } from 'react';
import { Upload, Download, Copy, Loader } from 'lucide-react';
import { useVernytTool } from '../../hooks/useVernytTool';

export default function HandwritingTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('handwriting-ocr');
  const [file, setFile] = useState(null);
  const [recognizedText, setRecognizedText] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFile(files[0]);
  };

  const handleFile = async (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setFile(selectedFile);
    await recognizeHandwriting(selectedFile);
  };

  const recognizeHandwriting = async (imageFile) => {
    if (!tool.checkPermission('ocr', { size: imageFile.size })) {
      onUpgradeRequired?.(tool.error);
      return;
    }

    setIsProcessing(true);
    try {
      tool.logUsage({ fileSize: imageFile.size, type: 'handwriting' });

      const model = await tool.loadModel('handwriting-ocr');
      if (!model) return;

      // Mock recognized text with confidence score
      const mockText = `Dear Sarah,

I hope this letter finds you in good health and spirits. 
I wanted to reach out to discuss the project timeline and 
upcoming deliverables for Q1.

Key points:
1. Design mockups due by January 15th
2. Development phase starts January 20th
3. Testing window: February 1-15
4. Launch scheduled for March 1st

Please let me know if you have any questions or concerns.

Best regards,
John Smith`;

      const mockConfidence = 0.87; // 87% confidence

      setRecognizedText(mockText);
      setConfidence(mockConfidence);
      await tool.saveResult(`handwriting-${Date.now()}`, {
        text: mockText,
        confidence: mockConfidence,
        language: 'English'
      });

      onProcess?.(mockText);
    } catch (err) {
      console.error('Recognition error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadText = () => {
    const blob = new Blob([recognizedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'handwriting-text.txt';
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
        <p className="text-gray-300 font-medium mb-2">Drag & drop handwritten image</p>
        <p className="text-gray-500 text-sm mb-4">Notes, letters, documents</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
        >
          Choose File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />
      </div>

      {/* File Info */}
      {file && (
        <div className="bg-gray-800 border border-gray-700 rounded p-4">
          <p className="text-gray-300">
            <span className="font-medium">File:</span> {file.name}
          </p>
          <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(2)}KB</p>
        </div>
      )}

      {/* Processing */}
      {isProcessing && (
        <div className="bg-gray-800 rounded p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin text-blue-400" />
            <span className="text-gray-300">Recognizing handwriting...</span>
          </div>
          <div className="w-full bg-gray-700 rounded h-2">
            <div
              className="bg-blue-500 h-2 rounded transition-all"
              style={{ width: `${tool.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Confidence Score */}
      {recognizedText && confidence > 0 && (
        <div className="bg-blue-900 border border-blue-700 rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">Recognition Confidence</label>
            <span className="text-blue-200 font-bold">{(confidence * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-blue-800 rounded h-2">
            <div
              className="bg-green-500 h-2 rounded transition-all"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
          {confidence < 0.75 && (
            <p className="text-yellow-400 text-xs mt-2">
              ⚠️ Low confidence - please review and correct the text
            </p>
          )}
        </div>
      )}

      {/* Recognized Text */}
      {recognizedText && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Recognized Text</label>
            <textarea
              value={recognizedText}
              onChange={(e) => setRecognizedText(e.target.value)}
              className="w-full h-64 px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500 font-mono text-sm"
            />
            <p className="text-gray-400 text-xs mt-2">Edit the text if needed</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 border border-gray-700 rounded p-3 text-center">
              <p className="text-gray-400 text-xs">Characters</p>
              <p className="text-gray-200 font-bold">{recognizedText.length}</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded p-3 text-center">
              <p className="text-gray-400 text-xs">Words</p>
              <p className="text-gray-200 font-bold">{recognizedText.split(/\s+/).length}</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded p-3 text-center">
              <p className="text-gray-400 text-xs">Lines</p>
              <p className="text-gray-200 font-bold">{recognizedText.split('\n').length}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(recognizedText);
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
          </div>
        </>
      )}

      {/* Pro Badge */}
      {!isPro && (
        <div className="bg-amber-900 border border-amber-700 text-amber-200 px-4 py-3 rounded">
          <p className="font-medium">🔒 Pro Feature</p>
          <p className="text-sm mt-1">Batch processing and multi-language support</p>
        </div>
      )}
    </div>
  );
}

HandwritingTool.defaultProps = {
  isPro: false,
  onProcess: null,
  onUsage: null,
  onUpgradeRequired: null
};
