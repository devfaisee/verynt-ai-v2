/**
 * FlashcardGenTool: Generate flashcards from text or PDFs
 * Create study decks with spaced repetition
 */

import React, { useState, useRef } from 'react';
import { Upload, Download, Loader, Plus, Trash2 } from 'lucide-react';
import { useVernytTool } from '../../hooks/useVernytTool';

export default function FlashcardGenTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('flashcard-gen');
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState(null);
  const [cards, setCards] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const f = files[0];
      if (f.type === 'application/pdf' || f.type.startsWith('text/')) {
        setFile(f);
      }
    }
  };

  const generateFlashcards = async () => {
    const text = file ? `[Content from ${file.name}]` : inputText;
    if (!text.trim()) return;

    if (!tool.checkPermission('generate_flashcards', { length: text.length })) {
      onUpgradeRequired?.(tool.error);
      return;
    }

    setIsProcessing(true);
    try {
      tool.logUsage({ length: text.length, hasFile: !!file });

      const model = await tool.loadModel('flashcard-gen');
      if (!model) return;

      // Mock flashcards
      const mockCards = [
        {
          id: 1,
          question: 'What is photosynthesis?',
          answer: 'A process where plants convert light energy into chemical energy using chlorophyll.'
        },
        {
          id: 2,
          question: 'Define mitochondria',
          answer: 'The powerhouse of the cell; responsible for producing energy in the form of ATP.'
        },
        {
          id: 3,
          question: 'What are the three states of matter?',
          answer: 'Solid, liquid, and gas.'
        },
        {
          id: 4,
          question: 'Explain photosynthesis equation',
          answer: '6CO2 + 6H2O + light → C6H12O6 + 6O2'
        }
      ];

      setCards(mockCards);
      await tool.saveResult(`flashcards-${Date.now()}`, { cards: mockCards, source: file?.name || 'text' });
      onProcess?.(mockCards);
    } catch (err) {
      console.error('Flashcard generation error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeCard = (id) => {
    setCards(cards.filter((c) => c.id !== id));
  };

  const downloadDeck = () => {
    const csv = [
      ['Question', 'Answer'].join(','),
      ...cards.map((c) => `"${c.question}","${c.answer}"`)
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flashcard-deck.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Input Method Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setFile(null);
            setInputText('');
          }}
          className={`flex-1 px-3 py-2 rounded font-medium transition ${
            !file ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Text
        </button>
        <button
          className={`flex-1 px-3 py-2 rounded font-medium transition ${
            file ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Upload PDF
        </button>
      </div>

      {/* Text Input */}
      {!file && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Study Material</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your study notes or textbook content..."
            className="w-full h-40 px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500"
          />
        </div>
      )}

      {/* File Upload */}
      {!inputText && (
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
          <p className="text-gray-300 font-medium mb-2">Drag & drop PDF</p>
          <p className="text-gray-500 text-sm mb-4">Max 50MB</p>
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
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setFile(f);
            }}
            className="hidden"
          />
        </div>
      )}

      {/* File Info */}
      {file && (
        <div className="bg-gray-800 border border-gray-700 rounded p-4">
          <p className="text-gray-300">
            <span className="font-medium">File:</span> {file.name}
          </p>
          <p className="text-gray-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)}MB</p>
        </div>
      )}

      {/* Processing */}
      {isProcessing && (
        <div className="bg-gray-800 rounded p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin text-blue-400" />
            <span className="text-gray-300">Generating flashcards...</span>
          </div>
          <div className="w-full bg-gray-700 rounded h-2">
            <div
              className="bg-blue-500 h-2 rounded transition-all"
              style={{ width: `${tool.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Flashcard Preview */}
      {cards.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-300">Flashcards ({cards.length})</label>
            <button
              onClick={downloadDeck}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {cards.map((card) => (
              <div key={card.id} className="bg-gray-800 border border-gray-700 rounded p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Q:</p>
                    <p className="text-gray-200 font-medium">{card.question}</p>
                  </div>
                  <button
                    onClick={() => removeCard(card.id)}
                    className="p-1 text-red-400 hover:text-red-300 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <p className="text-sm text-gray-400">A:</p>
                  <p className="text-gray-300 text-sm">{card.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      {(inputText.trim() || file) && cards.length === 0 && !isProcessing && (
        <button
          onClick={generateFlashcards}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Generate Flashcards
        </button>
      )}

      {/* Pro Badge */}
      {!isPro && (
        <div className="bg-amber-900 border border-amber-700 text-amber-200 px-4 py-3 rounded">
          <p className="font-medium">🔒 Pro Feature</p>
          <p className="text-sm mt-1">Unlimited decks and spaced repetition tracking</p>
        </div>
      )}
    </div>
  );
}

FlashcardGenTool.defaultProps = {
  isPro: false,
  onProcess: null,
  onUsage: null,
  onUpgradeRequired: null
};
