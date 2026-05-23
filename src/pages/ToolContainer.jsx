import React, { lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import { getToolById } from '../tools/REGISTRY';
import { Loader2 } from 'lucide-react';

// Lazy load tool components based on the registry structure
const toolComponents = {
  whisper: lazy(() => import('../tools/audio/WhisperTool')),
  voiceforge: lazy(() => import('../tools/audio/VoiceForgeTool')),
  audioscribe: lazy(() => import('../tools/audio/AudioScribeTool')),
  redact: lazy(() => import('../tools/documents/RedactTool')),
  docuchat: lazy(() => import('../tools/documents/DocuChatTool')),
  scribble: lazy(() => import('../tools/documents/ScribbleTool')),
  'pdf-tools': lazy(() => import('../tools/documents/PDFTools')),
  clear: lazy(() => import('../tools/images/ClearTool')),
  scale: lazy(() => import('../tools/images/ScaleTool')),
  ocr: lazy(() => import('../tools/images/OCRTool')),
  'student-hub': lazy(() => import('../tools/student/StudentTools')),
  'dev-utils': lazy(() => import('../tools/developer/DevTools')),
  translator: lazy(() => import('../tools/translation/TranslatorTool'))
};

export default function ToolContainer() {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const { incrementUsage, triggerLoader } = useApp();

  const toolMetadata = getToolById(toolId);
  const ToolComponent = toolComponents[toolId];

  if (!toolMetadata || !ToolComponent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-2xl font-bold text-white">Tool Not Found</h2>
        <button onClick={() => navigate('/')} className="btn-ghost">Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SEO title={toolMetadata.name} description={toolMetadata.description} />
      
      {/* Tool Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <toolMetadata.icon className="w-8 h-8 text-[#00f2fe]" />
              {toolMetadata.name}
            </h1>
            <p className="text-slate-400 font-medium">{toolMetadata.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {toolMetadata.tags.map(tag => (
            <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Workspace */}
      <div className="glass-panel p-8 min-h-[600px]">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <Loader2 className="w-10 h-10 text-[#00f2fe] animate-spin" />
            <p className="text-slate-500 font-bold uppercase tracking-tighter">Initializing Module...</p>
          </div>
        }>
          <ToolComponent 
            incrementUsage={incrementUsage} 
            triggerLoader={triggerLoader}
          />
        </Suspense>
      </div>

      {/* Disclaimer */}
      <div className="text-center p-6 border-t border-white/5">
        <p className="text-xs text-slate-600 font-medium">
          Processing is performed entirely in your browser buffer. Data is never transmitted to Verynt servers.
        </p>
      </div>
    </div>
  );
}
