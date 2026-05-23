/**
 * SubtitleTranslatorTool: Translate subtitle files
 * Support for SRT, VTT, ASS formats
 */

import React, { useState, useRef } from 'react';
import { Upload, Download, Loader } from 'lucide-react';
import { useVernytTool } from '../../hooks/useVernytTool';

export default function SubtitleTranslatorTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('subtitle-translator');
  const [file, setFile] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const languages = [
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'ru', name: 'Russian' }
  ];

  const formats = ['SRT', 'VTT', 'ASS'];

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFile(files[0]);
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    const validTypes = ['text/plain', 'application/x-subrip', 'text/vtt'];
    const validExtensions = ['.srt', '.vtt', '.ass', '.ssa'];

    const isValidType = validTypes.includes(selectedFile.type) ||
      validExtensions.some((ext) => selectedFile.name.toLowerCase().endsWith(ext));

    if (!isValidType) {
      alert('Please select a valid subtitle file (SRT, VTT, or ASS)');
      return;
    }

    setFile(selectedFile);
  };

  const translateSubtitles = async () => {
    if (!file) return;

    if (!tool.checkPermission('translate_subtitles', { size: file.size })) {
      onUpgradeRequired?.(tool.error);
      return;
    }

    setIsProcessing(true);
    try {
      tool.logUsage({ fileSize: file.size, targetLanguage });

      const model = await tool.loadModel('subtitle-translator');
      if (!model) return;

      // Mock result
      const mockResult = {
        originalFile: file.name,
        translatedFile: `translated-${targetLanguage}-${file.name}`,
        format: file.name.split('.').pop().toUpperCase(),
        language: languages.find((l) => l.code === targetLanguage)?.name,
        subtitleCount: 120,
        translationTime: '2.3s'
      };

      setResult(mockResult);
      await tool.saveResult(`subtitle-translate-${Date.now()}`, mockResult);
      onProcess?.(mockResult);
    } catch (err) {
      console.error('Subtitle translation error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTranslated = () => {
    const blob = new Blob(['[Translated Subtitle Data]'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translated-${targetLanguage}.${file.name.split('.').pop()}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Translate To</label>
        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Supported Formats */}
      <div className="bg-blue-900 border border-blue-700 rounded p-3">
        <p className="text-blue-200 text-sm">
          <strong>Supported formats:</strong> {formats.join(', ')}
        </p>
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
        <p className="text-gray-300 font-medium mb-2">Drag & drop subtitle file</p>
        <p className="text-gray-500 text-sm mb-4">SRT, VTT, or ASS format</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
        >
          Choose File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".srt,.vtt,.ass,.ssa"
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
            <span className="text-gray-300">Translating subtitles...</span>
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
              <p className="text-gray-300 text-sm">Format</p>
              <p className="text-green-200 font-bold">{result.format}</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">Subtitles</p>
              <p className="text-green-200 font-bold">{result.subtitleCount}</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">Language</p>
              <p className="text-green-200 font-bold">{result.language}</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">Time</p>
              <p className="text-green-200 font-bold">{result.translationTime}</p>
            </div>
          </div>
          <button
            onClick={downloadTranslated}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            Download Translated Subtitle
          </button>
        </div>
      )}

      {/* Action Button */}
      {file && !isProcessing && !result && (
        <button
          onClick={translateSubtitles}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
        >
          Translate Subtitles
        </button>
      )}

      {/* Pro Badge */}
      {!isPro && (
        <div className="bg-amber-900 border border-amber-700 text-amber-200 px-4 py-3 rounded">
          <p className="font-medium">🔒 Pro Feature</p>
          <p className="text-sm mt-1">Batch translate multiple subtitle files</p>
        </div>
      )}
    </div>
  );
}

SubtitleTranslatorTool.defaultProps = {
  isPro: false,
  onProcess: null,
  onUsage: null,
  onUpgradeRequired: null
};
