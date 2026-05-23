/**
 * ScreenshotTranslatorTool: OCR + translate screenshots
 * Extract text from images and translate
 */

import React, { useState, useRef } from 'react';
import { Upload, Download, Loader, Copy } from 'lucide-react';
import { useVernytTool } from '../../hooks/useVernytTool';

export default function ScreenshotTranslatorTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('screenshot-translator');
  const [file, setFile] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [extractedText, setExtractedText] = useState(null);
  const [translatedText, setTranslatedText] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [step, setStep] = useState('upload'); // upload, extract, translate
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

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFile(files[0]);
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setFile(selectedFile);
    setStep('extract');
    extractText(selectedFile);
  };

  const extractText = async (imageFile) => {
    if (!tool.checkPermission('ocr', { size: imageFile.size })) {
      onUpgradeRequired?.(tool.error);
      return;
    }

    setIsProcessing(true);
    try {
      tool.logUsage({ fileSize: imageFile.size, type: 'screenshot' });

      const model = await tool.loadModel('tesseract');
      if (!model) return;

      // Mock extracted text
      const mockText = `Welcome to our website!

We provide world-class solutions for your business needs.
Our team of experts is ready to help you succeed.

Key Services:
- Cloud Solutions
- Data Analytics
- Custom Development

Contact us today for a free consultation!
Email: info@example.com
Phone: +1-555-0123`;

      setExtractedText(mockText);
      setStep('translate');
    } catch (err) {
      console.error('OCR error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const translateText = async () => {
    if (!extractedText || !targetLanguage) return;

    if (!tool.checkPermission('translate', { length: extractedText.length })) {
      onUpgradeRequired?.(tool.error);
      return;
    }

    setIsProcessing(true);
    try {
      tool.logUsage({ length: extractedText.length, targetLanguage });

      const model = await tool.loadModel('translator');
      if (!model) return;

      // Mock translation
      const translations = {
        es: `¡Bienvenido a nuestro sitio web!

Proporcionamos soluciones de clase mundial para sus necesidades comerciales.
Nuestro equipo de expertos está listo para ayudarlo a tener éxito.

Servicios principales:
- Soluciones en la nube
- Análisis de datos
- Desarrollo personalizado

¡Póngase en contacto con nosotros hoy para una consulta gratuita!
Correo electrónico: info@example.com
Teléfono: +1-555-0123`,
        fr: `Bienvenue sur notre site Web!

Nous fournissons des solutions de classe mondiale pour vos besoins commerciaux.
Notre équipe d'experts est prête à vous aider à réussir.`,
        de: `Willkommen auf unserer Website!

Wir bieten erstklassige Lösungen für Ihre geschäftlichen Anforderungen.
Unser Team von Experten ist bereit, Ihnen zum Erfolg zu verhelfen.`
      };

      const translated = translations[targetLanguage] || extractedText;
      setTranslatedText(translated);
      await tool.saveResult(`screenshot-translate-${Date.now()}`, {
        originalText: extractedText,
        translatedText: translated,
        language: targetLanguage
      });

      onProcess?.(translated);
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between text-sm">
        <div className={`flex items-center gap-2 ${step === 'extract' || step === 'translate' ? 'text-green-400' : 'text-gray-400'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 'extract' || step === 'translate' ? 'bg-green-600' : 'bg-gray-600'}`}>
            1
          </div>
          Extract Text
        </div>
        <div className="w-8 h-0.5 bg-gray-600" />
        <div className={`flex items-center gap-2 ${step === 'translate' ? 'text-green-400' : 'text-gray-400'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 'translate' ? 'bg-green-600' : 'bg-gray-600'}`}>
            2
          </div>
          Translate
        </div>
      </div>

      {/* Language Selection */}
      {step !== 'upload' && (
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
      )}

      {/* Upload Area */}
      {step === 'upload' && (
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
          <p className="text-gray-300 font-medium mb-2">Drag & drop screenshot</p>
          <p className="text-gray-500 text-sm mb-4">JPG, PNG, WebP</p>
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
      )}

      {/* Processing */}
      {isProcessing && (
        <div className="bg-gray-800 rounded p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin text-blue-400" />
            <span className="text-gray-300">
              {step === 'extract' ? 'Extracting text from image...' : 'Translating text...'}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded h-2">
            <div
              className="bg-blue-500 h-2 rounded transition-all"
              style={{ width: `${tool.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Extracted Text */}
      {extractedText && !isProcessing && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Extracted Text</label>
          <div className="bg-gray-800 border border-gray-700 rounded p-4 max-h-40 overflow-y-auto text-sm text-gray-200 whitespace-pre-wrap">
            {extractedText}
          </div>
        </div>
      )}

      {/* Translated Text */}
      {translatedText && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Translated Text ({languages.find((l) => l.code === targetLanguage)?.name})
          </label>
          <div className="bg-green-900 border border-green-700 rounded p-4 max-h-40 overflow-y-auto text-sm text-green-200 whitespace-pre-wrap">
            {translatedText}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {extractedText && !translatedText && !isProcessing && (
        <button
          onClick={translateText}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
        >
          Translate
        </button>
      )}

      {translatedText && (
        <div className="flex gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(translatedText);
              alert('Copied!');
            }}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
          <button
            onClick={() => {
              const blob = new Blob([translatedText], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `translated-${targetLanguage}.txt`;
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
          <p className="text-sm mt-1">Batch process multiple screenshots and preserve formatting</p>
        </div>
      )}
    </div>
  );
}

ScreenshotTranslatorTool.defaultProps = {
  isPro: false,
  onProcess: null,
  onUsage: null,
  onUpgradeRequired: null
};
