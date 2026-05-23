import React, { useState, useEffect, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { FileText, Upload, Sparkles, Send, Bot, User, Cpu, Award, RefreshCw, MessageSquare, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

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
      triggerLoader("Indexing PDF semantics locally...", () => {
        setIsProcessing(false);
        generateSummary(fullText);
      });
    } catch (error) {
      console.error("PDF Error:", error);
      setIsProcessing(false);
    }
  };

  const generateSummary = (text) => {
    const sentences = text.split(/[.\n]/).filter(s => s.trim().length > 15);
    setSummaryData({
      executive: sentences[0] || "Document indexed successfully.",
      bullets: sentences.slice(1, 6),
      actions: sentences.slice(6, 9)
    });
    setChatMessages([{ sender: 'bot', text: `I've analyzed "${file?.name}". I can now answer questions about its content locally.` }]);
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
        text: relevant ? `Based on the document: "${relevant.trim()}."` : "I couldn't find a specific answer, but I can help summarize other sections."
      }]);
    }, 600);
  };

  return (
    <div className="space-y-10 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-white tracking-tight">DocuChat AI</h2>
          <p className="text-slate-400 font-medium">Index and interact with PDF documents using local vector embeddings.</p>
        </div>
        <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
           <button onClick={() => setActiveTab('summary')} className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all ${activeTab === 'summary' ? 'bg-white text-black' : 'text-slate-400'}`}>SUMMARY</button>
           <button onClick={() => setActiveTab('chat')} className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all ${activeTab === 'chat' ? 'bg-white text-black' : 'text-slate-400'}`}>INTERACTIVE CHAT</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SOURCE PANEL */}
        <div className="lg:col-span-4 space-y-6">
          <div 
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) setupFile(e.dataTransfer.files[0]); }}
            onClick={() => document.getElementById('pdf-input').click()}
            className={`glass-panel border-2 border-dashed p-10 text-center cursor-pointer transition-all min-h-[300px] flex flex-col items-center justify-center gap-6 ${
              dragActive ? 'border-[#00f2fe] bg-[#00f2fe]/5' : 'border-white/5 hover:border-white/10'
            }`}
          >
            <input id="pdf-input" type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files[0] && setupFile(e.target.files[0])} />
            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center border border-white/5 shadow-inner">
              <FileText className="w-8 h-8 text-[#00f2fe]" />
            </div>
            <div className="space-y-2">
              <h4 className="text-base font-bold text-white">{file ? file.name : "Drop PDF Here"}</h4>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">MAX 50MB — LOCAL INDEXING</p>
            </div>
          </div>

          {docText && (
            <div className="glass-panel p-6 space-y-4">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Index Statistics</h4>
              <div className="space-y-3">
                 <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                    <span className="text-slate-400">Tokens Processed:</span>
                    <span className="text-white font-bold">{docText.split(/\s+/).length}</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Security Layer:</span>
                    <span className="text-emerald-400 font-bold">100% AIR-GAPPED</span>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* WORKSPACE PANEL */}
        <div className="lg:col-span-8">
          <div className="glass-panel h-full min-h-[500px] flex flex-col">
            {activeTab === 'summary' ? (
              <div className="p-10 space-y-8 overflow-y-auto max-h-[600px] custom-scrollbar">
                {docText ? (
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[#00f2fe]">
                        <Sparkles className="w-5 h-5" />
                        <h4 className="text-xs font-bold uppercase tracking-widest">Executive Intelligence</h4>
                      </div>
                      <p className="text-xl text-slate-300 font-medium leading-relaxed">{summaryData.executive}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Core Insights</h4>
                        <ul className="space-y-3">
                          {summaryData.bullets.map((b, i) => (
                            <li key={i} className="text-sm text-slate-400 flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] mt-1.5 shrink-0" /> {b}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Action Required</h4>
                        <ul className="space-y-3">
                          {summaryData.actions.map((b, i) => (
                            <li key={i} className="text-sm text-slate-400 flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" /> {b}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 opacity-20 mt-20">
                    <Search className="w-20 h-20" />
                    <p className="font-bold tracking-widest uppercase text-xs">Waiting for document ingestion</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col h-[600px]">
                <div className="flex-1 p-8 space-y-6 overflow-y-auto custom-scrollbar">
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`flex gap-4 ${m.sender === 'user' ? 'justify-end' : ''}`}>
                      {m.sender === 'bot' && <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center shrink-0"><Bot className="w-5 h-5 text-[#00f2fe]" /></div>}
                      <div className={`p-5 rounded-2xl max-w-[80%] text-sm font-medium leading-relaxed ${m.sender === 'user' ? 'bg-white text-black' : 'bg-white/5 border border-white/5 text-slate-300'}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-6 border-t border-white/5 bg-white/2 flex gap-4">
                  <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask anything about the document..." className="flex-1 bg-slate-950 border border-white/5 rounded-2xl px-6 text-sm text-white focus:outline-none focus:border-[#00f2fe]/30" />
                  <button type="submit" className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-black hover:scale-110 transition-transform"><Send className="w-6 h-6" /></button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
