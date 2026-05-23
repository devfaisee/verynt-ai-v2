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
  
  // Visual
  clear: lazy(() => import('../tools/images/ClearTool')),
  scale: lazy(() => import('../tools/images/ScaleTool')),
  ocr: lazy(() => import('../tools/images/OCRTool')),
  handwriting: lazy(() => import('../tools/ocr/HandwritingTool')),
  'id-scanner': lazy(() => import('../tools/ocr/IDScannerTool')),
  'heic-converter': lazy(() => import('../tools/images/HEICConverterTool')),
  
  // Semantic
  docuchat: lazy(() => import('../tools/documents/DocuChatTool')),
  redact: lazy(() => import('../tools/documents/RedactTool')),
  scribble: lazy(() => import('../tools/documents/ScribbleTool')),
  'pdf-tools': lazy(() => import('../tools/documents/PDFTools')),
  'pdf-compress': lazy(() => import('../tools/documents/PDFCompressTool')),
  'pdf-extract': lazy(() => import('../tools/documents/PDFExtractorTool')),
  
  // Academic
  'student-hub': lazy(() => import('../tools/student/StudentTools')),
  'math-solver': lazy(() => import('../tools/student/MathSolverTool')),
  'citation-gen': lazy(() => import('../tools/student/CitationGenTool')),
  
  // Developer
  'dev-utils': lazy(() => import('../tools/developer/DevTools')),
  'code-explainer': lazy(() => import('../tools/developer/CodeExplainerTool')),
  
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

  const tool = getToolById(toolId) || (toolId === 'model-manager' ? { name: 'Engine Manager', description: 'Local neural weight registry.', icon: Database, tags: ['system', 'cache'] } : null);
  const ToolComponent = toolComponents[toolId];

  if (!tool || !ToolComponent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-8">
        <h2 className="text-4xl font-bold text-white tracking-tight">Studio Module Not Found</h2>
        <button onClick={() => navigate('/')} className="pill-button pill-button-primary">Return to Explorer</button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <SEO title={tool.name} description={tool.description} />
      
      {/* Studio Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-12">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/')}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-slate-400 hover:text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-4">
              <tool.icon className="w-10 h-10 text-white" />
              {tool.name}
            </h1>
            <p className="text-slate-500 font-medium text-lg">{tool.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <Link to="/tool/model-manager" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all">
              <Database className="w-3.5 h-3.5" /> Registry
           </Link>
           <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00f2fe]/5 border border-[#00f2fe]/20 text-[#00f2fe] text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" /> Private Buffer
           </div>
        </div>
      </div>

      {/* Main Studio Workspace */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card overflow-hidden"
      >
        <div className="bg-black/20 p-8 lg:p-16">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6">
              <div className="w-16 h-16 rounded-full border-t-2 border-white animate-spin opacity-20" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Calibrating Neural Pathways...</p>
            </div>
          }>
            <ToolComponent 
              incrementUsage={incrementUsage} 
              triggerLoader={triggerLoader}
            />
          </Suspense>
        </div>
      </motion.div>

      {/* Ad Placement: Studio Banner */}
      <div className="w-full h-32 glass-card flex items-center justify-center relative overflow-hidden bg-white/[0.01]">
         <div className="absolute top-2 right-4 text-[8px] font-black text-slate-700 uppercase tracking-widest">Sponsored</div>
         <div className="text-center space-y-1">
            <p className="text-xs font-bold text-slate-500">Ad Placement Hub</p>
            <p className="text-[10px] text-slate-600 uppercase tracking-tighter">Your high-margin revenue engine starts here.</p>
         </div>
      </div>

      {/* Bottom Metadata */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-slate-600">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <Zap className="w-4 h-4" />
               <span className="text-[10px] font-bold uppercase tracking-widest">Hardware Enabled</span>
            </div>
            <div className="flex items-center gap-2">
               <Info className="w-4 h-4" />
               <span className="text-[10px] font-bold uppercase tracking-widest">v4.2.0 Studio</span>
            </div>
         </div>
         <p className="text-[11px] font-medium max-w-md text-center md:text-right">
            Studio is supported by non-intrusive contextual placements. 100% of AI computation remains local.
         </p>
      </div>
    </div>
  );
}
