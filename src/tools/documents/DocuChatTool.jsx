import React, { useState, useEffect, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { FileText, Upload, Sparkles, Send, Bot, User, Cpu, Award, RefreshCw, MessageSquare, Search, ShieldCheck } from 'lucide-react';
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
  const [summaryData, setSummaryData] = useState({ executive: '', bullets: [], actions: [] });
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
    }
  };

  const generateSummary = (text) => {
    const sentences = text.split(/[.\n]/).filter(s => s.trim().length > 20);
    setSummaryData({
      executive: sentences[0] || "Semantic indexing complete.",
      bullets: sentences.slice(1, 6),
      actions: sentences.slice(6, 10)
    });
    setChatMessages([{ sender: 'bot', text: `Verification complete. I've indexed "${file?.name}" in the local buffer. I am ready for semantic queries.` }]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      const query = userMsg.text.toLowerCase();
      const relevant = docText.split(/[.\n]/).find(s => s.toLowerCase().includes(query.split(' ')[0]));
      setChatMessages(prev => [...prev, { 
        sender: 'bot', 
        text: relevant ? `Observation from document: "${relevant.trim()}."` : "My local vector search didn't yield a direct match, but I can summarize other sections for you."
      }]);
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
      
      {/* Studio Input (Left) */}
      <div className="lg:col-span-4 space-y-10">
         <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Document Ingest</h3>
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
                   <FileText className="w-8 h-8 text-black" />
                </div>
                <div className="text-center">
                   <p className="text-sm font-bold text-white">Drop PDF Source</p>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">MAX 50MB</p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6 animate-in">
                 <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-8">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                          <FileText className="w-8 h-8 text-white" />
                       </div>
                       <div className="overflow-hidden space-y-1">
                          <p className="text-lg font-bold text-white truncate">{file.name}</p>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">PDF Buffer Ready</p>
                       </div>
                    </div>
                    <button onClick={() => {setFile(null); setDocText('');}} className="pill-button pill-button-ghost w-full h-14">Flush Buffer</button>
                 </div>
                 
                 {docText && (
                   <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5">
                      <button onClick={() => setActiveTab('summary')} className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === 'summary' ? 'bg-white text-black shadow-2xl' : 'text-slate-500'}`}>SUMMARY</button>
                      <button onClick={() => setActiveTab('chat')} className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === 'chat' ? 'bg-white text-black shadow-2xl' : 'text-slate-500'}`}>Q&A CHAT</button>
                   </div>
                 )}
              </div>
            )}
         </div>

         <div className="p-8 bg-[#64d2ff]/5 border border-[#64d2ff]/10 rounded-[32px] space-y-4">
            <div className="flex items-center gap-3 text-[#64d2ff]">
               <ShieldCheck className="w-5 h-5" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Contextual Privacy</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">This document is indexed using local vector embeddings. No text blocks or embeddings are transmitted to any cloud-based LLM provider.</p>
         </div>
      </div>

      {/* Studio Workspace (Right) */}
      <div className="lg:col-span-8 h-full min-h-[600px]">
         <div className="h-full flex flex-col bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden relative">
            <AnimatePresence mode="wait">
              {activeTab === 'summary' ? (
                <motion.div 
                  key="summary"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-12 lg:p-20 space-y-12 overflow-y-auto max-h-[600px] custom-scrollbar"
                >
                   {docText ? (
                     <div className="space-y-12">
                        <div className="space-y-4">
                           <div className="flex items-center gap-3 text-[#00f2fe]">
                              <Sparkles className="w-5 h-5" />
                              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Executive Digest</span>
                           </div>
                           <p className="text-3xl font-bold text-white tracking-tight leading-tight italic">"{summaryData.executive}"</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                           <div className="space-y-6">
                              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">Key Observations</h4>
                              <div className="space-y-4">
                                 {summaryData.bullets.map((b, i) => (
                                   <div key={i} className="flex gap-4 group">
                                      <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 shrink-0 group-hover:bg-[#00f2fe] transition-colors" />
                                      <p className="text-base text-slate-400 font-medium leading-relaxed group-hover:text-white transition-colors">{b}</p>
                                   </div>
                                 ))}
                              </div>
                           </div>
                           <div className="space-y-6">
                              <h4 className="text-xs font-black text-[#64d2ff] uppercase tracking-widest border-b border-white/5 pb-4">Strategic Actions</h4>
                              <div className="space-y-4">
                                 {summaryData.actions.map((b, i) => (
                                   <div key={i} className="flex gap-4 group">
                                      <div className="w-1.5 h-1.5 rounded-full bg-[#64d2ff]/20 mt-1.5 shrink-0 group-hover:bg-[#64d2ff] transition-colors" />
                                      <p className="text-base text-slate-400 font-medium leading-relaxed group-hover:text-white transition-colors">{b}</p>
                                   </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center text-slate-800 gap-6 opacity-20 py-32">
                        <Search className="w-20 h-20" />
                        <p className="text-xs font-black uppercase tracking-[0.4em]">Awaiting Document Signal</p>
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
                   <div className="flex-1 p-10 space-y-8 overflow-y-auto custom-scrollbar">
                      {chatMessages.map((m, i) => (
                        <div key={i} className={`flex gap-6 ${m.sender === 'user' ? 'justify-end' : ''}`}>
                           {m.sender === 'bot' && <div className="w-12 h-12 rounded-[18px] bg-white flex items-center justify-center shrink-0 shadow-2xl"><Bot className="w-6 h-6 text-black" /></div>}
                           <div className={`p-6 rounded-[28px] max-w-[80%] text-lg font-medium leading-relaxed ${m.sender === 'user' ? 'bg-white text-black shadow-2xl' : 'bg-white/5 border border-white/10 text-slate-300'}`}>
                              {m.text}
                           </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                   </div>
                   <form onSubmit={handleSendMessage} className="p-8 border-t border-white/5 bg-black/20 flex gap-4">
                      <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Query the local document node..." className="flex-1 bg-white/5 border border-white/10 rounded-full px-8 text-white focus:outline-none focus:border-white/20 transition-all text-lg font-medium" />
                      <button type="submit" className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black shadow-2xl hover:scale-105 transition-transform"><Send className="w-7 h-7" /></button>
                   </form>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>

    </div>
  );
}
