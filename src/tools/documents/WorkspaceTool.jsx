import React, { useState, useEffect } from 'react';
import { Folder, FolderPlus, FileText, Search, Plus, Trash2, Database, ShieldCheck, ChevronRight, HelpCircle, FileSearch, CheckCircle, Upload, Terminal } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function WorkspaceTool() {
  const { incrementUsage, triggerLoader } = useApp();
  
  // Local Database / Projects State
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('verynt_local_projects');
    return saved ? JSON.parse(saved) : [
      {
        id: 'proj-1',
        name: 'Verynt Q2 Launch Board',
        created: '2026-05-24',
        notes: 'Launch checkpoints:\n- Verify service worker offline precache states.\n- Target long-tail programmatic keywords.\n- Stripe Suppression Supporter quota limits checked.',
        files: [
          { id: 'f-1', name: 'seo_roadmap.md', content: '# Organic Traffic Checklist\n- Targeting keywords: "private browser transcript", "local vector search".\n- Optimize site speeds to lock top sitemap search ranks.', type: 'doc' },
          { id: 'f-2', name: 'financials.txt', content: 'Monetization Plan:\n- Target supporters fee: $12/year.\n- Monthly cloud operations server bills: $0.', type: 'txt' }
        ]
      }
    ];
  });

  const [activeProjectId, setActiveProjectId] = useState('proj-1');
  const [newProjectName, setNewProjectName] = useState('');
  
  // Active Project Assets
  const [activeFileId, setActiveFileId] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [isAddingFile, setIsAddingFile] = useState(false);
  
  // Workspace Q&A Engine States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Telemetry Console State
  const [telemetryLogs, setTelemetryLogs] = useState([]);

  const addLog = (message) => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    setTelemetryLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  // Sync to LocalStorage (IndexedDB sandbox fallback)
  useEffect(() => {
    localStorage.setItem('verynt_local_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    addLog("calibrating IndexedDB workspace environment...");
    addLog(`Ingested Project Hub registry: ${projects.length} local project(s) parsed successfully.`);
  }, []);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    incrementUsage();
    
    const newProj = {
      id: 'proj-' + Date.now(),
      name: newProjectName.trim(),
      created: new Date().toISOString().split('T')[0],
      notes: 'Write notes for this project workspace here...',
      files: []
    };
    
    setProjects(prev => [...prev, newProj]);
    setActiveProjectId(newProj.id);
    setNewProjectName('');
    addLog(`Created new project workspace: "${newProj.name}"`);
  };

  const handleDeleteProject = (id, e) => {
    e.stopPropagation();
    if (projects.length === 1) {
      alert("You must keep at least one active project hub!");
      return;
    }
    incrementUsage();
    const name = projects.find(p => p.id === id)?.name || '';
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProjectId === id) {
      const remaining = projects.filter(p => p.id !== id);
      setActiveProjectId(remaining[0].id);
    }
    addLog(`Deleted project workspace: "${name}"`);
  };

  const handleUpdateNotes = (notesText) => {
    setProjects(prev => prev.map(p => 
      p.id === activeProjectId ? { ...p, notes: notesText } : p
    ));
    // Soft log throttle
    if (Math.random() < 0.1) addLog("Auto-saved workspace notes to local buffer.");
  };

  const handleAddFile = () => {
    if (!newFileName.trim()) return;
    incrementUsage();
    
    const newFile = {
      id: 'file-' + Date.now(),
      name: newFileName.trim().endsWith('.md') || newFileName.trim().endsWith('.txt') ? newFileName.trim() : newFileName.trim() + '.txt',
      content: newFileContent,
      type: newFileName.trim().endsWith('.md') ? 'doc' : 'txt'
    };

    setProjects(prev => prev.map(p => 
      p.id === activeProjectId ? { ...p, files: [...p.files, newFile] } : p
    ));

    setNewFileName('');
    setNewFileContent('');
    setIsAddingFile(false);
    addLog(`Ingested document asset: "${newFile.name}" into "${activeProject.name}"`);
  };

  const handleDeleteFile = (fileId, e) => {
    e.stopPropagation();
    incrementUsage();
    const name = activeProject.files.find(f => f.id === fileId)?.name || '';
    setProjects(prev => prev.map(p => 
      p.id === activeProjectId ? { ...p, files: p.files.filter(f => f.id !== fileId) } : p
    ));
    if (activeFileId === fileId) setActiveFileId('');
    addLog(`Ejected document asset: "${name}"`);
  };

  // On-Device Search & AI Q&A Engine (Local Vector Simulation) with progress logging
  const handleWorkspaceSearch = () => {
    if (!searchQuery.trim() || !activeProject.files.length) return;
    
    setIsSearching(true);
    setSearchResult(null);
    addLog(`Initializing local semantic index scan for query: "${searchQuery}"`);
    incrementUsage();
    
    triggerLoader("Executing local semantic indices scanning...", () => {
      setIsSearching(false);
      
      const query = searchQuery.toLowerCase();
      const hits = [];
      
      activeProject.files.forEach(f => {
        const text = f.content.toLowerCase();
        if (text.includes(query)) {
          const sentences = f.content.split(/[.!\n]/);
          const snippet = sentences.find(s => s.toLowerCase().includes(query)) || f.content.substring(0, 100);
          hits.push({
            fileName: f.name,
            snippet: snippet.trim() + '...'
          });
        }
      });

      if (hits.length > 0) {
        addLog(`Match located: ${hits.length} reference citation(s) fetched.`);
        setSearchResult({
          status: 'success',
          takeway: `Based on your local index analysis, we located ${hits.length} specific reference snippet(s) matching "${searchQuery}".`,
          citations: hits
        });
      } else {
        addLog("No semantic correlation located in active files cluster.");
        setSearchResult({
          status: 'fail',
          takeway: `No direct keyword correlation found across the active project files. Here is an offline heuristics tip: try uploading detailed text documents containing references to "${searchQuery}" first.`
        });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in selection:bg-[#00f2fe]/20">
      
      {/* Sidebar: Projects Registry (Left) */}
      <div className="lg:col-span-4 space-y-8 flex flex-col h-full">
        
        {/* Project Creation */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Project Explorer</h3>
          <div className="glass-card p-6 space-y-4 bg-white/[0.01]">
            <div className="flex gap-2">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="New project name..."
                className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-3 font-medium text-xs text-white placeholder-slate-600 focus:outline-none focus:border-white/10"
              />
              <button 
                onClick={handleCreateProject}
                className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-black hover:scale-105 transition-all shadow-xl"
              >
                <FolderPlus className="w-5 h-5" />
              </button>
            </div>

            {/* Projects list */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {projects.map(p => (
                <div
                  key={p.id}
                  onClick={() => { setActiveProjectId(p.id); setSearchResult(null); setActiveFileId(''); addLog(`Focused project workspace: "${p.name}"`); }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${
                    activeProjectId === p.id 
                      ? 'bg-white/10 border-white/10 text-white' 
                      : 'bg-transparent border-transparent text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Folder className="w-4 h-4" />
                    <span className="text-xs font-bold truncate max-w-[150px]">{p.name}</span>
                  </div>
                  <button onClick={(e) => handleDeleteProject(p.id, e)}>
                    <Trash2 className="w-3.5 h-3.5 text-slate-600 hover:text-rose-500 transition-colors" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Files sidebar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Project Assets</h3>
            <button 
              onClick={() => setIsAddingFile(!isAddingFile)}
              className="text-[9px] font-black text-[#00f2fe] uppercase tracking-widest hover:text-white transition-colors"
            >
              Add Asset
            </button>
          </div>

          <div className="glass-card p-6 bg-white/[0.01] space-y-4">
            {/* Adding file overlay */}
            <AnimatePresence>
              {isAddingFile && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 p-4 bg-black/40 rounded-2xl border border-white/5">
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="filename (e.g. contract.md)..."
                    className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-2 text-xs font-medium text-white placeholder-slate-600 focus:outline-none"
                  />
                  <textarea
                    value={newFileContent}
                    onChange={(e) => setNewFileContent(e.target.value)}
                    placeholder="Paste text contents..."
                    className="w-full h-24 bg-black/60 border border-white/5 rounded-xl p-4 text-xs font-medium text-white placeholder-slate-600 focus:outline-none resize-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleAddFile} className="flex-1 py-2 bg-white text-black rounded-lg text-[10px] font-black uppercase tracking-widest">Save Asset</button>
                    <button onClick={() => setIsAddingFile(false)} className="px-3 py-2 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400">Cancel</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Assets List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {activeProject.files.map(f => (
                <div
                  key={f.id}
                  onClick={() => { setActiveFileId(f.id); addLog(`Inspecting asset: "${f.name}"`); }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all border ${
                    activeFileId === f.id 
                      ? 'bg-white/5 border-white/10 text-white' 
                      : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest truncate max-w-[150px]">{f.name}</span>
                  </div>
                  <button onClick={(e) => handleDeleteFile(f.id, e)}>
                    <Trash2 className="w-3 h-3 text-slate-600 hover:text-rose-500 transition-colors" />
                  </button>
                </div>
              ))}

              {!activeProject.files.length && (
                <p className="text-[10px] text-slate-600 uppercase tracking-widest font-black text-center py-6">No assets loaded</p>
              )}
            </div>
          </div>
        </div>

        {/* Local Telemetry Console */}
        <div className="space-y-4 flex-1 flex flex-col min-h-[200px]">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
            <Terminal className="w-4 h-4" /> Telemetry Console
          </h3>
          <div className="flex-1 bg-black/40 border border-white/5 rounded-[32px] p-6 font-mono text-[9px] text-slate-500 overflow-y-auto max-h-[220px] custom-scrollbar text-left space-y-1">
            {telemetryLogs.map((log, i) => (
              <div key={i} className={log.includes('successfully') || log.includes('Match') ? 'text-[#00f2fe]' : 'text-slate-500'}>
                {log}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Main Board: Q&A Engine & Document Editor (Right) */}
      <div className="lg:col-span-8 space-y-8 flex flex-col h-full">
        
        {/* Semantic Q&A Explorer */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Local Vector Explorer</h3>
          <div className="glass-card p-6 space-y-6">
            <div className="flex gap-2">
              <div className="flex-1 relative flex items-center">
                <Search className="w-4 h-4 text-slate-500 absolute left-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask a question across all workspace files locally..."
                  className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 font-medium text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/10"
                />
              </div>
              <button 
                onClick={handleWorkspaceSearch}
                disabled={isSearching || !activeProject.files.length}
                className="pill-button pill-button-primary px-8 h-12 uppercase tracking-widest text-[9px]"
              >
                {isSearching ? "Searching..." : "Query Files"}
              </button>
            </div>

            {/* Q&A Results Display */}
            <AnimatePresence>
              {searchResult && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <FileSearch className="w-3.5 h-3.5" /> AI Workspace Executive Takeway
                    </span>
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3" /> Compiled Air-Gapped
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-300 leading-relaxed">{searchResult.takeway}</p>

                  {/* Citations list */}
                  {searchResult.citations && (
                    <div className="pt-4 border-t border-white/5 space-y-2">
                      <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block">Reference Citations:</span>
                      <div className="flex flex-wrap gap-2">
                        {searchResult.citations.map((c, i) => (
                          <div key={i} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[9px] font-medium text-slate-400">
                            Found in: <span className="font-bold text-[#00f2fe] font-mono">{c.fileName}</span>
                            <p className="text-[8px] text-slate-600 italic mt-0.5 font-sans">"{c.snippet}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Notes & File Viewer Workspace */}
        <div className="space-y-4 flex-1 flex flex-col min-h-[350px]">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            {activeFileId ? "Workspace Asset Viewer" : "Workspace Project Notes"}
          </h3>
          
          <div className="glass-card flex-1 bg-white/[0.02] p-8 flex flex-col border border-white/5">
            {activeFileId ? (
              // Selected file view
              <div className="h-full flex flex-col space-y-6 flex-1">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#00f2fe]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                      {activeProject.files.find(f => f.id === activeFileId)?.name}
                    </span>
                  </div>
                  <button onClick={() => { setActiveFileId(''); addLog("Closed active asset viewer."); }} className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                    Close Asset
                  </button>
                </div>
                <textarea
                  readOnly
                  value={activeProject.files.find(f => f.id === activeFileId)?.content}
                  className="flex-1 w-full bg-black/20 border border-white/5 rounded-2xl p-6 font-mono text-xs text-slate-400 focus:outline-none resize-none custom-scrollbar text-left"
                />
              </div>
            ) : (
              // Notes edit view
              <div className="h-full flex flex-col space-y-6 flex-1">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Scratch Workspace Note Buffer</span>
                  <span className="text-[9px] font-bold text-slate-500">Auto-saved Locally</span>
                </div>
                <textarea
                  value={activeProject.notes}
                  onChange={(e) => handleUpdateNotes(e.target.value)}
                  className="flex-1 w-full bg-black/20 border border-white/5 rounded-2xl p-6 font-medium text-xs text-slate-400 focus:outline-none focus:border-white/10 resize-none custom-scrollbar text-left"
                  placeholder="Draft your thoughts, copy text sections, or log references..."
                />
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
