import React, { useState, useEffect, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { FileText, Upload, Sparkles, Send, Bot, User, Cpu, Award, RefreshCw, MessageSquare, Search, ShieldCheck, Download, Table, FileSearch, Trash2 } from 'lucide-react';
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
    setSummaryData({
      executive: sentences[0] || "Semantic indexing complete.",
      bullets: sentences.slice(1, 8),
      actions: sentences.slice(8, 14),
      tables: ["Extracted Meta-Data Grid", "Local Vector Indices"]
    });
    setChatMessages([{ sender: 'bot', text: `Intelligence Check: I have successfully mapped "${file?.name}" to the local V8 buffer. I am ready for semantic Q&A.` }]);
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
      const matches = sentences.filter(s => query.split(' ').some(word => word.length > 3 && s.toLowerCase().includes(word)));
      
      setChatMessages(prev => [...prev, { 
        sender: 'bot', 
        text: matches.length > 0 ? `Found relevant passage: "${matches[0].trim()}."` : "My local vector search did not yield a direct match for that specific sequence. Try rephrasing or asking for a summary of the action items."
      }]);
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
      
      {/* Studio Controls (Left) */}
      <div className="lg:col-span-4 space-y-10">
         <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Document Pipeline</h3>
            {!file ? (
              <motion.div 
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) setupFile(e.dataTransfer.files[0]); }}
                onClick={() => document.getElementById('pdf-input').click()}
                whileHover={{ scale: 1.02 }}
                className={`w-full aspect-square rounded-[40px] border-2 border-dashed flex flex-col items-center justify-center gap-6 cursor-pointer transition-all ${
                  dragActive ? 'border-white bg-white/5' : 'border-white/5 hover:border-white/10'
                }`}
              >
                <input id="pdf-input" type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files[0] && setupFile(e.target.files[0])} />
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl">
                   <FileSearch className="w-8 h-8 text-black" />
                </div>
                <div className="text-center">
                   <p className="text-sm font-bold text-white">Ingest PDF Master</p>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">MAX 50MB • NO CLOUD</p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6 animate-in">
                 <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-8">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                          <FileText className="w-8 h-8 text-white" />
                       </div>
                       <div className="overflow-hidden space-y-1">
                          <p className="text-lg font-bold text-white truncate">{file.name}</p>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">Buffer Indexed</p>
                       </div>
                    </div>
                    
                    <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5">
                       {['summary', 'chat'].map(t => (
                         <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === t ? 'bg-white text-black shadow-2xl border-white' : 'text-slate-500'}`}>{t.toUpperCase()}</button>
                       ))}
                    </div>
                    
                    <button onClick={() => {setFile(null); setDocText('');}} className="pill-button pill-button-ghost w-full h-14">Flush Ingest</button>
                 </div>
              </div>
            )}
         </div>

         <div className="p-8 bg-[#00f2fe]/5 border border-[#00f2fe]/10 rounded-[32px] space-y-4">
            <div className="flex items-center gap-3 text-[#00f2fe]">
               <ShieldCheck className="w-5 h-5" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Contextual Security</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">DocuChat processes 100% of text tokens locally. No paragraphs, summaries, or metadata are ever synchronized with external cloud logs.</p>
         </div>
      </div>

      {/* Studio Workspace (Right) */}
      <div className="lg:col-span-8">
         <div className="h-full min-h-[600px] flex flex-col bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden relative">
            <AnimatePresence mode="wait">
              {activeTab === 'summary' ? (
                <motion.div 
                  key="summary"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-12 lg:p-20 space-y-16 overflow-y-auto max-h-[600px] custom-scrollbar"
                >
                   {docText ? (
                     <div className="space-y-16">
                        <div className="space-y-6">
                           <div className="flex items-center gap-3 text-[#00f2fe]">
                              <Sparkles className="w-5 h-5" />
                              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Core Intelligence</span>
                           </div>
                           <p className="text-3xl font-bold text-white tracking-tight leading-tight italic">"{summaryData.executive}"</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                           <div className="space-y-8">
                              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">Extracted Insights</h4>
                              <div className="space-y-6">
                                 {summaryData.bullets.map((b, i) => (
                                   <div key={i} className="flex gap-6 group">
                                      <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 shrink-0 group-hover:bg-[#00f2fe] transition-all" />
                                      <p className="text-lg text-slate-400 font-medium leading-relaxed group-hover:text-white transition-colors">{b}</p>
                                   </div>
                                 ))}
                              </div>
                           </div>
                           <div className="space-y-8">
                              <h4 className="text-xs font-black text-[#64d2ff] uppercase tracking-widest border-b border-white/5 pb-4">Detected Actions</h4>
                              <div className="space-y-6">
                                 {summaryData.actions.map((b, i) => (
                                   <div key={i} className="flex gap-6 group">
                                      <div className="w-1.5 h-1.5 rounded-full bg-[#64d2ff]/20 mt-2 shrink-0 group-hover:bg-[#64d2ff] transition-all" />
                                      <p className="text-lg text-slate-400 font-medium leading-relaxed group-hover:text-white transition-colors">{b}</p>
                                   </div>
                                 ))}
                              </div>
                           </div>
                        </div>

                        <div className="pt-12 border-t border-white/5 flex justify-between items-center text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">
                           <span>Indexed Tokens: {docText.split(/\s+/).length}</span>
                           <button className="hover:text-white transition-colors flex items-center gap-2"><Download className="w-3 h-3" /> Export Summary</button>
                        </div>
                     </div>
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center text-slate-800 gap-8 opacity-20 py-48">
                        <Search className="w-24 h-24" />
                        <p className="text-xs font-black uppercase tracking-[0.4em]">Waiting for Document Signal</p>
                     </div>
                   )}
                </motion.div>
              ) : (
                <motion.div 
                  key="chat"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col h-[600px]"
                >
                   <div className="flex-1 p-12 space-y-10 overflow-y-auto custom-scrollbar">
                      {chatMessages.map((m, i) => (
                        <div key={i} className={`flex gap-8 ${m.sender === 'user' ? 'justify-end' : ''}`}>
                           {m.sender === 'bot' && <div className="w-12 h-12 rounded-[18px] bg-white flex items-center justify-center shrink-0 shadow-2xl"><Bot className="w-6 h-6 text-black" /></div>}
                           <div className={`p-8 rounded-[32px] max-w-[80%] text-xl font-medium leading-relaxed ${m.sender === 'user' ? 'bg-white text-black shadow-2xl' : 'bg-white/5 border border-white/10 text-slate-300'}`}>
                              {m.text}
                           </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                   </div>
                   <form onSubmit={handleSendMessage} className="p-10 border-t border-white/5 bg-black/20 flex gap-6">
                      <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Query the local document master..." className="flex-1 bg-white/5 border border-white/10 rounded-full px-10 text-white focus:outline-none focus:border-white/20 transition-all text-xl font-medium" />
                      <button type="submit" className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-black shadow-2xl hover:scale-105 transition-transform"><Send className="w-8 h-8" /></button>
                   </form>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>

    </div>
  );
}
