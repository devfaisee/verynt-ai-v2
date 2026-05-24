import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { AlertOctagon, RefreshCw, ChevronLeft, WifiOff, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error('[Route Error Intercepted]:', error);

  // Check if this is a chunk loading/network fetch error
  const isChunkError = 
    error?.message?.includes('Failed to fetch dynamically imported module') ||
    error?.toString()?.includes('Failed to fetch dynamically imported module') ||
    error?.message?.includes('Load chunk') ||
    error?.message?.includes('Dynamic import');

  const handleReload = () => {
    // Clear dynamic imports cache by reloading the full application
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#08090d] flex items-center justify-center p-8 relative overflow-hidden selection:bg-[#00f2fe]/20">
      
      {/* Background Decorative Neon Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card max-w-2xl w-full p-12 lg:p-16 space-y-10 relative overflow-hidden border-rose-500/20 bg-gradient-to-br from-rose-500/[0.01] to-transparent text-center"
      >
        {/* Glow Header Icon */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-[0_20px_40px_rgba(239,68,68,0.1)]">
          {isChunkError ? <WifiOff className="w-10 h-10" /> : <AlertOctagon className="w-10 h-10" />}
        </div>

        <div className="space-y-4">
          <span className="text-[10px] font-black tracking-[0.4em] text-rose-400 uppercase bg-rose-500/5 px-6 py-2 rounded-full border border-rose-500/20">
            {isChunkError ? "Pathway Disconnect" : "Studio Subsystem Alert"}
          </span>
          <h2 className="text-4xl font-black text-white tracking-tighter">
            {isChunkError ? "Neural Module Fetch Failed" : "Subsystem Calibration Error"}
          </h2>
          <p className="text-slate-400 font-medium text-base max-w-md mx-auto leading-relaxed">
            {isChunkError 
              ? "Verynt runs strictly on-device, but it seems a temporary network blip or a clean deploy build update intercepted your module fetch. Reloading will sync the latest studio pathways." 
              : "An unexpected error occurred during client-side execution. Our V8 sandbox intercepted the exception to prevent physical memory loss."}
          </p>
        </div>

        {/* Error Code Snip */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 text-left font-mono text-[11px] text-slate-500 overflow-x-auto max-h-[150px] custom-scrollbar">
          <span className="text-rose-400 font-bold block mb-1">Exception Logged:</span>
          {error?.message || error?.toString() || 'Unknown Sandbox Error'}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
          <button 
            onClick={handleReload}
            className="pill-button pill-button-primary h-14 px-10 w-full sm:w-auto text-xs font-black uppercase tracking-widest gap-2 bg-gradient-to-r from-rose-500 to-purple-600 border-none shadow-[0_20px_40px_rgba(239,68,68,0.15)] hover:shadow-[0_20px_40px_rgba(239,68,68,0.3)] transition-all"
          >
            <RefreshCw className="w-4 h-4 animate-spin-slow" /> Reload Workspace
          </button>
          
          <button 
            onClick={() => {
              // Redirect home using standard route navigation
              navigate('/');
              // Force reload home once to clear caches if needed
              setTimeout(() => window.location.reload(), 100);
            }}
            className="pill-button pill-button-ghost h-14 px-10 w-full sm:w-auto text-xs font-black uppercase tracking-widest gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Return to Explorer
          </button>
        </div>

        {/* Footer badges */}
        <div className="pt-8 border-t border-white/5 flex items-center justify-center gap-8 text-[9px] font-black text-slate-600 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5" /> Hardware Protected
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
          <div>V8 Isolated</div>
        </div>
      </motion.div>
    </div>
  );
}
