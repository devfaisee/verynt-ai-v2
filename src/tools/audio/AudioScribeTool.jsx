/**
 * AudioScribeTool: Meeting summarizer with action items and templates
 * Transcribes audio and generates summaries with Jira, Notion, Email templates
 */

import React, { useState, useRef } from 'react';
import { Upload, Download, Copy, Loader, FileText, CheckSquare } from 'lucide-react';
import { useVernytTool } from '../../hooks/useVernytTool';

export default function AudioScribeTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('audio-scribe');
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [summary, setSummary] = useState(null);
  const [actionItems, setActionItems] = useState([]);
  const [template, setTemplate] = useState('email');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const templates = [
    { id: 'email', label: 'Email', icon: '✉️' },
    { id: 'jira', label: 'Jira Ticket', icon: '🎫' },
    { id: 'notion', label: 'Notion', icon: '📝' },
    { id: 'slack', label: 'Slack', icon: '💬' }
  ];

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
    await processAudio(selectedFile);
  };

  const processAudio = async (audioFile) => {
    if (!tool.checkPermission('transcribe', { size: audioFile.size })) {
      onUpgradeRequired?.(tool.error);
      return;
    }

    setIsProcessing(true);
    try {
      tool.logUsage({ fileSize: audioFile.size, format: audioFile.type });

      const modelId = isPro ? 'whisper-base' : 'whisper-tiny';
      const model = await tool.loadModel(modelId);
      if (!model) return;

      // Mock transcript
      const mockTranscript = `Meeting Discussion:
Speaker 1: "Let's discuss the Q4 roadmap. We need to prioritize the dashboard redesign."
Speaker 2: "Agreed. I think we should also look at performance optimization."
Speaker 1: "Good point. Let's allocate resources. Who can lead the redesign?"
Speaker 3: "I can take that on. Timeline?"
Speaker 1: "Target end of October. Let's schedule a design review next week."`;

      const mockSummary = `Q4 Meeting Summary:
- Discussed quarterly roadmap priorities
- Dashboard redesign identified as key initiative
- Performance optimization needed
- Design review scheduled for next week`;

      const mockActionItems = [
        { task: 'Schedule design review meeting', owner: 'Speaker 1', dueDate: 'Next week' },
        { task: 'Lead dashboard redesign', owner: 'Speaker 3', dueDate: 'End of October' },
        { task: 'Performance optimization analysis', owner: 'Speaker 2', dueDate: '2 weeks' }
      ];

      setTranscript(mockTranscript);
      setSummary(mockSummary);
      setActionItems(mockActionItems);

      await tool.saveResult(`scribe-${Date.now()}`, {
        filename: audioFile.name,
        transcript: mockTranscript,
        summary: mockSummary,
        actionItems: mockActionItems
      });

      onProcess?.(mockSummary);
    } catch (err) {
      console.error('Processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateTemplate = () => {
    if (!summary) return '';

    const baseContent = `${summary}\n\nAction Items:\n${actionItems.map((item) => `- ${item.task} (Owner: ${item.owner}, Due: ${item.dueDate})`).join('\n')}`;

    switch (template) {
      case 'jira':
        return `Title: Q4 Meeting - Action Items\n\nDescription:\n${baseContent}\n\nLabels: meeting, action-items\nAssignee: [Auto-assign]\nDue Date: [Set based on items]`;
      case 'notion':
        return `# Q4 Meeting Notes\n\n## Summary\n${summary}\n\n## Action Items\n${actionItems.map((item) => `- [ ] ${item.task} (@${item.owner}) due ${item.dueDate}`).join('\n')}`;
      case 'slack':
        return `:memo: *Meeting Summary*\n${summary}\n\n:white_check_mark: *Action Items:*\n${actionItems.map((item) => `• ${item.task} - @${item.owner}`).join('\n')}`;
      default: // email
        return `Subject: Q4 Meeting Summary & Action Items\n\nHi team,\n\n${summary}\n\nAction Items:\n${actionItems.map((item) => `- ${item.task} (Owner: ${item.owner}, Due: ${item.dueDate})`).join('\n')}\n\nBest regards`;
    }
  };

  const downloadContent = () => {
    const content = generateTemplate();
    const ext = template === 'notion' ? 'md' : 'txt';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-${template}.${ext}`;
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
        <p className="text-gray-300 font-medium mb-2">Drag & drop audio or video file</p>
        <p className="text-gray-500 text-sm mb-4">
          Supports: MP3, WAV, M4A, MP4 (Max 500MB)
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
        >
          Choose File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,video/*"
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
          <p className="text-gray-400 text-sm">Size: {(file.size / 1024 / 1024).toFixed(2)}MB</p>
        </div>
      )}

      {/* Processing */}
      {isProcessing && (
        <div className="bg-gray-800 rounded p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin text-blue-400" />
            <span className="text-gray-300">Transcribing and summarizing...</span>
          </div>
          <div className="w-full bg-gray-700 rounded h-2">
            <div
              className="bg-blue-500 h-2 rounded transition-all"
              style={{ width: `${tool.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Summary */}
      {summary && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Summary
            </label>
            <div className="bg-gray-800 border border-gray-700 rounded p-4 text-gray-200 max-h-32 overflow-y-auto">
              {summary}
            </div>
          </div>

          {/* Action Items */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              Action Items
            </label>
            <div className="space-y-2">
              {actionItems.map((item, idx) => (
                <div key={idx} className="bg-gray-800 border border-gray-700 rounded p-3">
                  <p className="text-gray-200 font-medium">{item.task}</p>
                  <p className="text-gray-400 text-sm">
                    Owner: {item.owner} | Due: {item.dueDate}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Export Template</label>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`px-3 py-2 rounded font-medium transition flex items-center gap-2 justify-center ${
                    template === t.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Template Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Preview</label>
            <div className="bg-gray-800 border border-gray-700 rounded p-4 text-gray-200 max-h-40 overflow-y-auto font-mono text-sm whitespace-pre-wrap">
              {generateTemplate()}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(generateTemplate());
                alert('Copied to clipboard!');
              }}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
            <button
              onClick={downloadContent}
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
          <p className="text-sm mt-1">Unlock advanced templates and batch processing</p>
        </div>
      )}
    </div>
  );
}

AudioScribeTool.defaultProps = {
  isPro: false,
  onProcess: null,
  onUsage: null,
  onUpgradeRequired: null
};
