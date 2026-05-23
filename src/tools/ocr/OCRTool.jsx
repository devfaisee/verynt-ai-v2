import React, { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { Image, Upload, FileText, Copy, Download, RefreshCw, CheckCircle, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function OCRTool() {
  const { incrementUsage, triggerLoader } = useApp();
  const [image, setImage] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        setupImage(droppedFile);
      } else {
        alert("Please upload an image file.");
      }
    }
  };

  const setupImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target.result);
    reader.readAsDataURL(file);
    processOCR(file);
  };

  const processOCR = async (file) => {
    setIsProcessing(true);
    setOcrText('');
    setProgress(0);
    
    try {
      const worker = await createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.floor(m.progress * 100));
          }
        }
      });

      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      
      setOcrText(text);
      incrementUsage();
    } catch (error) {
      console.error("OCR Error:", error);
      alert("Error processing image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ocrText);
    alert("Text copied to clipboard!");
  };

  const downloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([ocrText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "ocr_result.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-[#00f2fe]" /> Verynt OCR Scanner
        </h2>
        <p className="text-sm text-gray-400">
          Extract structured text from images, receipts, or screenshots completely offline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Upload & Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`glass-panel border-2 border-dashed p-8 rounded-2xl text-center cursor-pointer transition-all duration-300 min-h-[300px] flex flex-col items-center justify-center ${
              dragActive ? 'drag-active' : 'border-slate-800 hover:border-slate-700'
            }`}
            onClick={() => fileInputRef.current.click()}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => e.target.files[0] && setupImage(e.target.files[0])}
            />
            
            {image ? (
              <img src={image} alt="Preview" className="max-h-[250px] rounded-lg shadow-lg" />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
                  <Upload className="w-6 h-6 text-[#00f2fe]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Drag & drop image here</h4>
                  <p className="text-xs text-gray-400">Supports PNG, JPG, WEBP</p>
                </div>
              </div>
            )}
          </div>

          {isProcessing && (
            <div className="glass-panel p-5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Processing OCR...</h4>
                <span className="text-xs text-[#00f2fe] font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-[#00f2fe] to-[#9b51e0] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-500 italic text-center">
                Running Tesseract.js in browser worker threads...
              </p>
            </div>
          )}
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-7">
          <div className="glass-panel rounded-2xl h-full flex flex-col overflow-hidden min-h-[400px]">
            <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3 bg-slate-950/30">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00f2fe]" /> Extracted Text
              </h4>
              {ocrText && (
                <div className="flex gap-2">
                  <button onClick={copyToClipboard} className="p-1.5 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white transition-colors" title="Copy">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button onClick={downloadTxt} className="p-1.5 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white transition-colors" title="Download">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-slate-950/20">
              {ocrText ? (
                <div className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-sans animate-fade-in">
                  {ocrText}
                </div>
              ) : isProcessing ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                  <RefreshCw className="w-10 h-10 animate-spin text-slate-800" />
                  <p className="text-xs">Analyzing image layers...</p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                  <FileText className="w-10 h-10 text-slate-800" />
                  <p className="text-xs">Upload an image to extract text.</p>
                </div>
              )}
            </div>

            {ocrText && (
              <div className="p-4 border-t border-slate-800/60 flex items-center justify-between bg-slate-950/10">
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> OCR Complete
                </span>
                <button 
                  onClick={() => {setImage(null); setOcrText('');}}
                  className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest"
                >
                  Clear & Start Over
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
