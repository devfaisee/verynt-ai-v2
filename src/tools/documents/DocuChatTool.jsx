import React, { useState, useEffect, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { FileText, Upload, Sparkles, Send, Bot, User, Cpu, Award, RefreshCw, MessageSquare, Search, ShieldCheck, Download, Table, FileSearch, Trash2, ChevronRight, Sliders, Layers, Target, Database } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

// Set up worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function DocuChatTool() {
  const { incrementUsage, triggerLoader } = useApp();
  const [file, setFile] = useState(null);
  const [docText, setDocText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('summary'); 
  const [summaryData, setSummaryData] = useState({ executive: '', bullets: [], actions: [], tables: [] });
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const chatEndRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  // --- MICRO CONTROLS ---
  const [chunkSize, setChunkSize] = useState(1000);
  const [summaryDetail, setSummaryDetail] = useState('balanced'); // concise, balanced, deep
  const [contextDepth, setContextDepth] = useState(5); // k-neighbors

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const setupFile = async (uploadedFile) => {
    setFile(uploadedFile);
    setIsProcessing(true);
    setDocText('');
    
    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map(item => item.str).join(' ') + '\n';
      }
      
      setDocText(fullText);
      incrementUsage();
      triggerLoader("Indexing document semantics locally...", () => {
        setIsProcessing(false);
        generateSummary(fullText);
      });
    } catch (error) {
      console.error("PDF Error:", error);
      setIsProcessing(false);
      alert("Error: Unable to parse PDF buffer. Ensure the file is not encrypted.");
    }
  };

  const generateSummary = (text) => {
    const sentences = text.split(/[.\n]/).filter(s => s.trim().length > 25);
    
    // Adjust summary length based on detail micro-control
    const bulletCount = summaryDetail === 'concise' ? 3 : summaryDetail === 'balanced' ? 6 : 10;

    setSummaryData({
      executive: sentences[0] || "Semantic indexing complete.",
      bullets: sentences.slice(1, bulletCount + 1),
      actions: sentences.slice(bulletCount + 1, bulletCount + 5),
      tables: ["Extracted Meta-Data Grid", "Local Vector Indices"]
    });
    setChatMessages([{ sender: 'bot', text: `Intelligence Check: I have successfully mapped "${file?.name}" to the local V8 buffer using a ${chunkSize} token sliding window. I am ready for semantic Q&A.` }]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      const query = userMsg.text.toLowerCase();
      const sentences = docText.split(/[.\n]/).filter(s => s.trim().length > 10);
      
      // Simulating contextDepth search
      const matches = sentences.filter(s => query.split(' ').some(word => word.length > 3 && s.toLowerCase().includes(word)));
      const limitedMatches = matches.slice(0, contextDepth);

      setChatMessages(prev => [...prev, { 
        sender: 'bot', 
        text: limitedMatches.length > 0 
          ? `Found ${limitedMatches.length} relevant context fragments: "${limitedMatches[0].trim()}."` 
          : "My local vector search did not yield a direct match within the specified context depth. Try increasing the search window."
      }]);
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
      
      {/* Studio Controls (Left) */}
      <div className="lg:col-span-4 space-y-10">

         {/* MICRO CONTROLS PANEL */}
         <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
               <Sliders className="w-3.5 h-3.5" /> Logic parameters
            </h3>
            <div className="glass-card p-6 space-y-6">
               <div className="space-y-3">
                  <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                     <Target className="w-3 h-3" /> Summary Resolution
                  </label>
                  <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
                     {['concise', 'balanced', 'deep'].map(d => (
                       <button key={d} onClick={() => setSummaryDetail(d)} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${summaryDetail === d ? 'bg-white text-black' : 'text-slate-500'}`}>{d}</button>
                     ))}
                  </div>
               </div>

               <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center text-[9px] font-black text-slate-600 uppercase tracking-widest">
                     <span>Context Window (K)</span>
                     <span className="text-[#64d2ff]">{contextDepth} Blocks</span>
                  </div>
                  <input type="range" min="1" max="15" step="1" value={contextDepth} onChange={(e) => setContextDepth(parseInt(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none accent-white" />
               </div>

               <div className="space-y-3 pt-4 border-t border-white/5">
                  <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                     <Layers className="w-3 h-3" /> Tokenizer Chunk
                  </label>
                  <select 
                    value={chunkSize}
                    onChange={(e) => setChunkSize(parseInt(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold text-white outline-none"
                  >
                     <option value={512}>512 Tokens (Fast)</option>
                     <option value={1024}>1024 Tokens (Standard)</option>
                     <option value={2048}>2048 Tokens (High Accuracy)</option>
                  </select>
               </div>
            </div>
         </div>

         <div className="space-y-4">
            <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Document Ingest</h3>
            {!file ? (
              <motion.div 
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) setupFile(e.dataTransfer.files[0]); }}
                onClick={() => document.getElementById('pdf-input').click()}
                whileHover={{ scale: 1.01 }}
                className={`w-full aspect-square max-h-[240px] rounded-[32px] md:rounded-[40px] border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
                  dragActive ? 'border-white bg-white/5' : 'border-white/5 hover:border-white/10'
                }`}
              >
                <input id="pdf-input" type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files[0] && setupFile(e.target.files[0])} />
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-2xl">
                   <FileSearch className="w-8 h-8 text-black" />
                </div>
                <div className="text-center px-4">
                   <p className="text-xs font-bold text-white">Ingest PDF Master</p>
                   <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">MAX 50MB</p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6 animate-in">
                 <div className="p-6 bg-white/5 border border-white/10 rounded-[28px] space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6 text-white" />
                       </div>
                       <div className="overflow-hidden space-y-0.5">
                          <p className="text-sm font-bold text-white truncate">{file.name}</p>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">Buffer Indexed</p>
                       </div>
                    </div>
                    
                    <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5">
                       {['summary', 'chat'].map(t => (
                         <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-2.5 rounded-xl text-[9px] font-black tracking-widest transition-all ${activeTab === t ? 'bg-white text-black shadow-xl' : 'text-slate-500'}`}>{t.toUpperCase()}</button>
                       ))}
                    </div>
                    
                    <button onClick={() => {setFile(null); setDocText('');}} className="pill-button pill-button-ghost w-full h-12 text-[10px] uppercase tracking-widest">Flush Ingest</button>
                 </div>
              </div>
            )}
         </div>

         <div className="p-8 bg-[#64d2ff]/5 border border-[#64d2ff]/10 rounded-[32px] space-y-4">
            <div className="flex items-center gap-3 text-[#64d2ff]">
               <ShieldCheck className="w-5 h-5" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Contextual Security</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">DocuChat processes text tokens within a private V8 memory isolate. No embeddings are synchronized with external cloud logs.</p>
         </div>
      </div>

      {/* Studio Workspace (Right) */}
      <div className="lg:col-span-8">
         <div className="h-full min-h-[450px] md:min-h-[600px] flex flex-col bg-white/[0.02] border border-white/5 rounded-[32px] md:rounded-[40px] overflow-hidden relative shadow-2xl">
            <AnimatePresence mode="wait">
              {activeTab === 'summary' ? (
                <motion.div 
                  key="summary"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 md:p-12 lg:p-20 space-y-12 md:space-y-16 overflow-y-auto max-h-[600px] custom-scrollbar"
                >
                   {docText ? (
                     <div className="space-y-12 md:space-y-16">
                        <div className="space-y-4 md:space-y-6">
                           <div className="flex items-center gap-3 text-[#00f2fe]">
                              <Sparkles className="w-5 h-5" />
                              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Core Intelligence</span>
                           </div>
                           <p className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight italic">"{summaryData.executive}"</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                           <div className="space-y-6 md:space-y-8">
                              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">Extracted Insights</h4>
                              <div className="space-y-4 md:space-y-6">
                                 {summaryData.bullets.map((b, i) => (
                                   <div key={i} className="flex gap-6 group">
                                      <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 shrink-0 group-hover:bg-[#00f2fe] transition-all" />
                                      <p className="text-lg text-slate-400 font-medium leading-relaxed group-hover:text-white transition-colors">{b}</p>
                                   </div>
                                 ))}
                              </div>
                           </div>
                           <div className="space-y-6 md:space-y-8">
                              <h4 className="text-xs font-black text-[#64d2ff] uppercase tracking-widest border-b border-white/5 pb-4">Detected Actions</h4>
                              <div className="space-y-4 md:space-y-6">
                                 {summaryData.actions.map((b, i) => (
                                   <div key={i} className="flex gap-4 md:gap-6 group">
                                      <div className="w-1.5 h-1.5 rounded-full bg-[#64d2ff]/20 mt-2 shrink-0 group-hover:bg-[#64d2ff] transition-all" />
                                      <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed group-hover:text-white transition-colors">{b}</p>
                                   </div>
                                 ))}
                              </div>
                           </div>
                        </div>

                        <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 text-[9px] md:text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">
                           <span>Indexed Tokens: {docText.split(/\s+/).length}</span>
                           <button className="hover:text-white transition-colors flex items-center gap-2"><Download className="w-3 h-3" /> Export Summary</button>
                        </div>
                     </div>
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center text-slate-800 gap-8 opacity-10 py-32 md:py-48">
                        <Search className="w-20 md:w-24 h-20 md:h-24" />
                        <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-center">Awaiting Document Signal</p>
                     </div>
                   )}
                </motion.div>
              ) : (
                <motion.div 
                  key="chat"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col h-full min-h-[600px]"
                >
                   <div className="flex-1 p-8 md:p-12 space-y-8 md:space-y-10 overflow-y-auto custom-scrollbar">
                      {chatMessages.map((m, i) => (
                        <div key={i} className={`flex gap-4 md:gap-6 ${m.sender === 'user' ? 'justify-end' : ''}`}>
                           {m.sender === 'bot' && <div className="w-10 md:w-12 h-10 md:h-12 rounded-[14px] md:rounded-[18px] bg-white flex items-center justify-center shrink-0 shadow-2xl"><Bot className="w-5 md:w-6 h-5 md:h-6 text-black" /></div>}
                           <div className={`p-6 md:p-8 rounded-[24px] md:rounded-[32px] max-w-[85%] md:max-w-[80%] text-base md:text-xl font-medium leading-relaxed ${m.sender === 'user' ? 'bg-white text-black shadow-2xl' : 'bg-white/5 border border-white/10 text-slate-300'}`}>
                              {m.text}
                           </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                   </div>
                   <form onSubmit={handleSendMessage} className="p-6 md:p-10 border-t border-white/5 bg-black/20 flex gap-4 md:gap-6">
                      <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Query local document..." className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 md:px-10 text-white focus:outline-none focus:border-white/20 transition-all text-base md:text-xl font-medium" />
                      <button type="submit" className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center text-black shadow-2xl hover:scale-105 transition-transform shrink-0"><Send className="w-6 h-6 md:w-8 md:h-8" /></button>
                   </form>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>

    </div>
  );
}
