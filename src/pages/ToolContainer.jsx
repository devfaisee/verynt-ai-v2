import React, { lazy, Suspense } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import { getToolById } from '../tools/REGISTRY';
import { Loader2, ChevronLeft, Share2, Info, Maximize2, ShieldCheck, Zap, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const toolComponents = {
  // Acoustic
  whisper: lazy(() => import('../tools/audio/WhisperTool')),
  voiceforge: lazy(() => import('../tools/audio/VoiceForgeTool')),
  audioscribe: lazy(() => import('../tools/audio/AudioScribeTool')),
  audioforge: lazy(() => import('../tools/audioforge/AudioForgeTool')),
  flow: lazy(() => import('../tools/flow/FlowTool')),
  
  // Visual
  clear: lazy(() => import('../tools/clear/ClearTool')),
  scale: lazy(() => import('../tools/images/ScaleTool')),
  ocr: lazy(() => import('../tools/images/OCRTool')),
  handwriting: lazy(() => import('../tools/ocr/HandwritingTool')),
  'id-scanner': lazy(() => import('../tools/ocr/IDScannerTool')),
  'heic-converter': lazy(() => import('../tools/images/HEICConverterTool')),
  'receipt-scan': lazy(() => import('../tools/ocr/ReceiptScannerTool')),
  
  // Semantic / Docs
  docuchat: lazy(() => import('../tools/documents/DocuChatTool')),
  redact: lazy(() => import('../tools/documents/RedactTool')),
  scribble: lazy(() => import('../tools/documents/ScribbleTool')),
  'pdf-tools': lazy(() => import('../tools/pdf/PDFUtilsTool')),
  'pdf-compress': lazy(() => import('../tools/documents/PDFCompressTool')),
  'pdf-extract': lazy(() => import('../tools/documents/PDFExtractorTool')),
  'pdf-merge': lazy(() => import('../tools/documents/PDFMergeTool')),
  'pdf-split': lazy(() => import('../tools/documents/PDFMergeTool')),
  
  // Academic
  'student-hub': lazy(() => import('../tools/student/StudentTools')),
  'quiz-gen': lazy(() => import('../tools/student/QuizGenTool')),
  'math-solver': lazy(() => import('../tools/student/MathSolverTool')),
  'citation-gen': lazy(() => import('../tools/student/CitationGenTool')),
  'flashcard-gen': lazy(() => import('../tools/student/FlashcardGenTool')),
  
  // Developer
  'dev-utils': lazy(() => import('../tools/developer/DevTools')),
  'code-explainer': lazy(() => import('../tools/developer/CodeExplainerTool')),
  'json-beautify': lazy(() => import('../tools/developer/JSONFormatterTool')),
  'regex-gen': lazy(() => import('../tools/developer/RegexGenTool')),
  'sql-formatter': lazy(() => import('../tools/developer/SQLFormatterTool')),
  
  // Translation
  translator: lazy(() => import('../tools/translation/TranslatorTool')),
  'pdf-translator': lazy(() => import('../tools/translation/PDFTranslatorTool')),
  
  // System
  'model-manager': lazy(() => import('./ModelManager'))
};

export default function ToolContainer() {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const { incrementUsage, triggerLoader } = useApp();

  const tool = getToolById(toolId) || (toolId === 'model-manager' ? { name: 'Engine Manager', description: 'Local neural weight registry.', icon: Database, tags: ['system'] } : null);
  const ToolComponent = toolComponents[toolId];

  if (!tool || !ToolComponent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-8 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Studio Module Not Found</h2>
        <p className="text-slate-500 max-w-sm">The module "{toolId}" could not be located in the current registry.</p>
        <button onClick={() => navigate('/')} className="pill-button pill-button-primary">Return to Explorer</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12 min-h-screen pb-20">
      <SEO title={tool.name} description={tool.description} />
      
      {/* Studio Header Bar - Adaptive */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 border-b border-white/5 pb-8 md:pb-12 px-2">
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => navigate('/')}
            className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-slate-400 hover:text-white shrink-0"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div className="space-y-1 overflow-hidden">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight flex items-center gap-3 md:gap-4">
              <tool.icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white shrink-0" />
              <span className="truncate">{tool.name}</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm sm:text-base md:text-lg truncate">{tool.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-0">
           <Link to="/tool/model-manager" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap">
              <Database className="w-3 h-3 md:w-3.5 md:h-3.5" /> Registry
           </Link>
           <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00f2fe]/5 border border-[#00f2fe]/20 text-[#00f2fe] text-[9px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
              <ShieldCheck className="w-3 h-3 md:w-3.5 md:h-3.5" /> Private Buffer
           </div>
        </div>
      </div>

      {/* Main Studio Workspace - Responsive Padding */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card overflow-hidden"
      >
        <div className="bg-black/20 p-4 sm:p-6 md:p-12 lg:p-16">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px] space-y-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-t-2 border-white animate-spin opacity-20" />
              <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Syncing Module Assets...</p>
            </div>
          }>
            <ToolComponent 
              incrementUsage={incrementUsage} 
              triggerLoader={triggerLoader}
            />
          </Suspense>
        </div>
      </motion.div>

      {/* Sponsored Banner - Adaptive Height */}
      <div className="w-full h-24 sm:h-32 glass-card flex items-center justify-center relative overflow-hidden bg-white/[0.01] px-4 text-center">
         <div className="absolute top-2 right-4 text-[7px] md:text-[8px] font-black text-slate-700 uppercase tracking-widest">Sponsored</div>
         <div className="space-y-1">
            <p className="text-xs md:text-sm font-bold text-slate-500">Ad Placement Buffer</p>
            <p className="text-[9px] md:text-[10px] text-slate-600 uppercase tracking-tighter">Supporting free local AI development.</p>
         </div>
      </div>

      {/* Metadata - Mobile Grid */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 text-slate-600 px-2">
         <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2">
               <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" />
               <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">WASM SIMD Enabled</span>
            </div>
            <div className="flex items-center gap-2">
               <Info className="w-3.5 h-3.5 md:w-4 md:h-4" />
               <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">v4.6.0 Stable</span>
            </div>
         </div>
         <p className="text-[10px] md:text-[11px] font-medium max-w-sm md:max-w-md text-center md:text-right italic leading-relaxed">
            Privacy Assurance: This module operates strictly within the browser V8 sandbox. No data leaves the local memory buffer.
         </p>
      </div>
    </div>
  );
}
