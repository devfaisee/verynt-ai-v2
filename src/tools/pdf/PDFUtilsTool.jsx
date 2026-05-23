import React, { useState } from 'react';
import { FileCode, Upload, FileText, Download, Check, RefreshCw, Cpu, Split, Merge, RotateCw } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PDFUtilsTool({ incrementUsage, triggerLoader }) {
  const [activeSubTool, setActiveSubTool] = useState('merge'); // 'merge', 'split', 'rotate'
  
  // 1. Merge States
  const [mergeFiles, setMergeFiles] = useState([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState('');
  const [isMerging, setIsMerging] = useState(false);

  // 2. Split States
  const [splitFile, setSplitFile] = useState(null);
  const [splitRange, setSplitRange] = useState('1-2');
  const [splitPdfUrl, setSplitPdfUrl] = useState('');
  const [isSplitting, setIsSplitting] = useState(false);

  // 3. Rotate States
  const [rotateFile, setRotateFile] = useState(null);
  const [rotationDegrees, setRotationDegrees] = useState(90);
  const [rotatedPdfUrl, setRotatedPdfUrl] = useState('');
  const [isRotating, setIsRotating] = useState(false);

  const handleMergeFileInput = (e) => {
    if (e.target.files) {
      setMergeFiles(Array.from(e.target.files));
      setMergedPdfUrl('');
    }
  };

  const executeMerge = async () => {
    if (mergeFiles.length < 2) {
      alert("Please upload at least 2 PDF files to merge.");
      return;
    }
    
    setIsMerging(true);
    incrementUsage();

    triggerLoader(
      (progress, setStatusText) => {
        setStatusText(`Merging ${mergeFiles.length} PDF documents locally... ${progress}%`);
      },
      async () => {
        try {
          const mergedPdf = await PDFDocument.create();
          for (const file of mergeFiles) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
          }
          const pdfBytes = await mergedPdf.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setMergedPdfUrl(url);
        } catch (e) {
          alert("Error merging PDFs: " + e.message);
        } finally {
          setIsMerging(false);
        }
      }
    );
  };

  const executeSplit = async () => {
    if (!splitFile) return;

    setIsSplitting(true);
    incrementUsage();

    triggerLoader(
      (progress, setStatusText) => {
        setStatusText(`Splitting pages ${splitRange} locally... ${progress}%`);
      },
      async () => {
        try {
          const arrayBuffer = await splitFile.arrayBuffer();
          const pdf = await PDFDocument.load(arrayBuffer);
          const splitPdf = await PDFDocument.create();
          
          // Parse range, e.g. "1-2"
          const parts = splitRange.split('-').map(p => parseInt(p.trim()) - 1);
          const start = Math.max(0, parts[0] || 0);
          const end = Math.min(pdf.getPageCount() - 1, parts[1] || start);

          const indices = [];
          for (let i = start; i <= end; i++) {
            indices.push(i);
          }

          const copiedPages = await splitPdf.copyPages(pdf, indices);
          copiedPages.forEach((page) => splitPdf.addPage(page));

          const pdfBytes = await splitPdf.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setSplitPdfUrl(url);
        } catch (e) {
          alert("Error splitting PDF: " + e.message);
        } finally {
          setIsSplitting(false);
        }
      }
    );
  };

  const executeRotate = async () => {
    if (!rotateFile) return;

    setIsRotating(true);
    incrementUsage();

    triggerLoader(
      (progress, setStatusText) => {
        setStatusText(`Rotating pages locally by ${rotationDegrees}°... ${progress}%`);
      },
      async () => {
        try {
          const arrayBuffer = await rotateFile.arrayBuffer();
          const pdf = await PDFDocument.load(arrayBuffer);
          
          // Rotate all pages
          const pages = pdf.getPages();
          pages.forEach((page) => {
            const currentRotation = page.getRotation().angle;
            page.setRotation({ angle: (currentRotation + rotationDegrees) % 360 });
          });

          const pdfBytes = await pdf.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setRotatedPdfUrl(url);
        } catch (e) {
          alert("Error rotating PDF: " + e.message);
        } finally {
          setIsRotating(false);
        }
      }
    );
  };

  const downloadFile = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-[#00f2fe]" /> Verynt PDF Utilities
        </h2>
        <p className="text-sm text-gray-400">
          Merge, split, and rotate PDFs 100% locally in your browser. No files are uploaded to any server.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Workspace Switcher */}
        <div className="lg:col-span-3">
          <div className="glass-panel p-4 rounded-2xl flex flex-col gap-2">
            <button
              onClick={() => setActiveSubTool('merge')}
              className={`w-full py-3 px-4 rounded-xl font-display text-xs font-bold text-left flex items-center gap-2 transition-all ${
                activeSubTool === 'merge' ? 'bg-[#9b51e0] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Merge className="w-4 h-4" /> Merge PDFs
            </button>
            <button
              onClick={() => setActiveSubTool('split')}
              className={`w-full py-3 px-4 rounded-xl font-display text-xs font-bold text-left flex items-center gap-2 transition-all ${
                activeSubTool === 'split' ? 'bg-[#9b51e0] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Split className="w-4 h-4" /> Split PDF
            </button>
            <button
              onClick={() => setActiveSubTool('rotate')}
              className={`w-full py-3 px-4 rounded-xl font-display text-xs font-bold text-left flex items-center gap-2 transition-all ${
                activeSubTool === 'rotate' ? 'bg-[#9b51e0] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <RotateCw className="w-4 h-4" /> Rotate PDF
            </button>
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-9">
          
          {/* SUB-TOOL: MERGE */}
          {activeSubTool === 'merge' && (
            <div className="glass-panel p-6 rounded-2xl space-y-6 fade-in">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Merge className="w-4.5 h-4.5 text-[#00f2fe]" /> Client-Side PDF Merger
              </h3>

              <div className="space-y-4">
                <div 
                  className="border-2 border-dashed border-slate-800 hover:border-slate-700 p-8 rounded-xl text-center cursor-pointer"
                  onClick={() => document.getElementById('merge-input').click()}
                >
                  <input 
                    id="merge-input" 
                    type="file" 
                    multiple 
                    accept=".pdf" 
                    className="hidden" 
                    onChange={handleMergeFileInput}
                  />
                  <Upload className="w-8 h-8 text-[#00f2fe] mx-auto mb-3" />
                  <h4 className="text-xs font-bold text-white">Select PDF Files to Merge</h4>
                  <p className="text-[10px] text-gray-500 mt-1">Upload 2 or more files</p>
                </div>

                {mergeFiles.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Uploaded Files Queue ({mergeFiles.length})</span>
                    <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3 text-xs space-y-1.5 max-h-[150px] overflow-y-auto">
                      {mergeFiles.map((file, i) => (
                        <div key={i} className="flex justify-between border-b border-slate-900/60 pb-1.5 last:border-0 last:pb-0">
                          <span className="text-gray-300 font-medium truncate max-w-[250px]">{file.name}</span>
                          <span className="text-gray-500 font-bold">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      ))}
                    </div>

                    {!mergedPdfUrl ? (
                      <button 
                        onClick={executeMerge}
                        disabled={isMerging}
                        className="btn-primary w-full text-xs justify-center"
                      >
                        <Cpu className="w-4 h-4 animate-pulse" /> Merge Documents Locally
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => downloadFile(mergedPdfUrl, 'merged_document.pdf')}
                          className="btn-primary flex-1 text-xs justify-center"
                        >
                          <Download className="w-4 h-4" /> Download Combined PDF
                        </button>
                        <button 
                          onClick={() => { setMergeFiles([]); setMergedPdfUrl(''); }}
                          className="btn-secondary text-xs"
                        >
                          <RefreshCw className="w-4 h-4" /> Reset
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUB-TOOL: SPLIT */}
          {activeSubTool === 'split' && (
            <div className="glass-panel p-6 rounded-2xl space-y-6 fade-in">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Split className="w-4.5 h-4.5 text-[#00f2fe]" /> Client-Side PDF Splitter
              </h3>

              <div className="space-y-4">
                <div 
                  className="border-2 border-dashed border-slate-800 hover:border-slate-700 p-8 rounded-xl text-center cursor-pointer"
                  onClick={() => document.getElementById('split-input').click()}
                >
                  <input 
                    id="split-input" 
                    type="file" 
                    accept=".pdf" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSplitFile(e.target.files[0]);
                        setSplitPdfUrl('');
                      }
                    }}
                  />
                  <Upload className="w-8 h-8 text-[#00f2fe] mx-auto mb-3" />
                  <h4 className="text-xs font-bold text-white">
                    {splitFile ? splitFile.name : "Select PDF File to Split"}
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-1">Upload a single document</p>
                </div>

                {splitFile && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Page Range to Extract</label>
                        <input 
                          type="text" 
                          value={splitRange} 
                          onChange={(e) => setSplitRange(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none"
                          placeholder="e.g. 1-2, or 3"
                        />
                      </div>
                    </div>

                    {!splitPdfUrl ? (
                      <button 
                        onClick={executeSplit}
                        disabled={isSplitting}
                        className="btn-primary w-full text-xs justify-center"
                      >
                        <Cpu className="w-4 h-4 animate-pulse" /> Extract Pages Locally
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => downloadFile(splitPdfUrl, `split_${splitFile.name}`)}
                          className="btn-primary flex-1 text-xs justify-center"
                        >
                          <Download className="w-4 h-4" /> Download Split PDF
                        </button>
                        <button 
                          onClick={() => { setSplitFile(null); setSplitPdfUrl(''); }}
                          className="btn-secondary text-xs"
                        >
                          <RefreshCw className="w-4 h-4" /> Reset
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUB-TOOL: ROTATE */}
          {activeSubTool === 'rotate' && (
            <div className="glass-panel p-6 rounded-2xl space-y-6 fade-in">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <RotateCw className="w-4.5 h-4.5 text-[#00f2fe]" /> Client-Side PDF Rotator
              </h3>

              <div className="space-y-4">
                <div 
                  className="border-2 border-dashed border-slate-800 hover:border-slate-700 p-8 rounded-xl text-center cursor-pointer"
                  onClick={() => document.getElementById('rotate-input').click()}
                >
                  <input 
                    id="rotate-input" 
                    type="file" 
                    accept=".pdf" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setRotateFile(e.target.files[0]);
                        setRotatedPdfUrl('');
                      }
                    }}
                  />
                  <Upload className="w-8 h-8 text-[#00f2fe] mx-auto mb-3" />
                  <h4 className="text-xs font-bold text-white">
                    {rotateFile ? rotateFile.name : "Select PDF File to Rotate"}
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-1">Upload a single document</p>
                </div>

                {rotateFile && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Rotation Angle</label>
                        <select 
                          value={rotationDegrees} 
                          onChange={(e) => setRotationDegrees(parseInt(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none"
                        >
                          <option value="90">90° Clockwise</option>
                          <option value="180">180° Half Turn</option>
                          <option value="270">270° Counter-Clockwise</option>
                        </select>
                      </div>
                    </div>

                    {!rotatedPdfUrl ? (
                      <button 
                        onClick={executeRotate}
                        disabled={isRotating}
                        className="btn-primary w-full text-xs justify-center"
                      >
                        <Cpu className="w-4 h-4 animate-pulse" /> Rotate Pages Locally
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => downloadFile(rotatedPdfUrl, `rotated_${rotateFile.name}`)}
                          className="btn-primary flex-1 text-xs justify-center"
                        >
                          <Download className="w-4 h-4" /> Download Rotated PDF
                        </button>
                        <button 
                          onClick={() => { setRotateFile(null); setRotatedPdfUrl(''); }}
                          className="btn-secondary text-xs"
                        >
                          <RefreshCw className="w-4 h-4" /> Reset
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
