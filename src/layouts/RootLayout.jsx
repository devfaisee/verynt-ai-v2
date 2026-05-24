import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Loader from '../components/Loader';
import PricingModal from '../components/PricingModal';
import PrivacySandboxOverlay from '../components/PrivacySandboxOverlay';
import RouteErrorBoundary from '../components/RouteErrorBoundary';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudOff, UploadCloud, ShieldCheck, Cpu } from 'lucide-react';

export default function RootLayout() {
  const { isOffline, setGlobalFile } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Global Drag and Drop Ingestion states
  const [showDragOverlay, setShowDragOverlay] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  // Auto-scroll to top on route change for professional UX
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Global window drop listeners
  useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter(prev => {
        const next = prev + 1;
        if (next === 1) setShowDragOverlay(true);
        return next;
      });
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter(prev => {
        const next = Math.max(0, prev - 1);
        if (next === 0) setShowDragOverlay(false);
        return next;
      });
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setShowDragOverlay(false);
      setDragCounter(0);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        const droppedFile = files[0];
        setGlobalFile(droppedFile);
        
        const ext = droppedFile.name.split('.').pop().toLowerCase();
        
        if (ext === 'pdf') {
          navigate('/tool/pdf-tools');
        } else if (['mp3', 'wav', 'm4a', 'ogg', 'aac'].includes(ext)) {
          navigate('/tool/whisper');
        } else if (['png', 'jpg', 'jpeg', 'webp', 'tiff'].includes(ext)) {
          const lowerName = droppedFile.name.toLowerCase();
          if (lowerName.includes('receipt') || lowerName.includes('invoice') || lowerName.includes('bill') || lowerName.includes('expense')) {
            navigate('/tool/receipt-scan');
          } else {
            navigate('/tool/ocr');
          }
        } else {
          navigate('/tool/model-manager');
        }
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [navigate, setGlobalFile]);

  return (
    <div className="min-h-screen relative selection:bg-white selection:text-black">
      
      {/* Network Alert Banner */}
      <AnimatePresence>
        {isOffline && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-[200] bg-rose-500/10 border-b border-rose-500/20 backdrop-blur-md py-3 text-center flex items-center justify-center gap-3"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            <CloudOff className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[9px] font-black text-rose-200 tracking-[0.3em] uppercase">
              Network Isolated • Local WASM Operating Air-Gapped
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editorial Background Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <Navigation />

      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`relative z-10 pb-20 transition-all duration-500 ${
          isOffline ? 'pt-36 md:pt-44' : 'pt-28 md:pt-36'
        }`}
      >
        <div className="studio-container px-4">
          <RouteErrorBoundary>
            <Outlet />
          </RouteErrorBoundary>
        </div>
      </motion.main>

      <Loader />
      <PricingModal />
      <PrivacySandboxOverlay />

      <AnimatePresence>
        {showDragOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-[#08090d]/80 backdrop-blur-2xl flex items-center justify-center p-6 md:p-12 pointer-events-none"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="glass-card max-w-xl w-full p-12 md:p-16 text-center border-dashed border-[#00f2fe]/30 bg-gradient-to-br from-[#00f2fe]/5 to-transparent space-y-8"
            >
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto shadow-glow">
                <UploadCloud className="w-10 h-10 text-black" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-white tracking-tight">Drop Source Asset</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Ingest into private studio</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="relative z-10 border-t border-white/5 py-12 md:py-16">
        <div className="studio-container flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12 px-4">
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
             </div>
             <p className="text-[10px] md:text-xs font-semibold text-slate-500 tracking-[0.2em] uppercase">Compute Nodes Online</p>
          </div>
          <div className="text-[9px] md:text-[10px] font-black text-slate-700 tracking-[0.3em] uppercase text-center md:text-right">
            © 2026 Verynt Studio • Precision Local Intelligence
          </div>
        </div>
      </footer>
    </div>
  );
}
