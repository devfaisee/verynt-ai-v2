import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, WifiOff, Cpu, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PrivacySandboxOverlay() {
  const { isPrivacySandbox, setIsPrivacySandbox } = useApp();

  useEffect(() => {
    if (isPrivacySandbox) {
      const timer = setTimeout(() => {
        setIsPrivacySandbox(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isPrivacySandbox]);

  return (
    <AnimatePresence>
      {isPrivacySandbox && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] bg-[#0c0c0d] flex items-center justify-center p-6 text-center"
        >
          {/* Scanning Line Effect */}
          <motion.div 
            initial={{ top: '-10%' }}
            animate={{ top: '110%' }}
            transition={{ duration: 3, ease: "linear", repeat: Infinity }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f2fe] to-transparent blur-sm z-10"
          />

          <div className="max-w-xl space-y-12 relative z-20">
             <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ delay: 0.2, type: "spring" }}
               className="w-32 h-32 rounded-[2.5rem] bg-white flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(255,255,255,0.15)]"
             >
                <ShieldCheck className="w-16 h-16 text-black" />
             </motion.div>

             <div className="space-y-4">
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl md:text-5xl font-black text-white tracking-tighter"
                >
                   Air-Gap Initialized.
                </motion.h2>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-xl text-slate-500 font-medium"
                >
                   Verynt Studio has severed all external network connections. Your device is now a private neural node.
                </motion.p>
             </div>

             <div className="grid grid-cols-3 gap-6 pt-8">
                <StatusNode icon={WifiOff} label="Network" status="Severed" />
                <StatusNode icon={Cpu} label="Compute" status="100% Local" />
                <StatusNode icon={Lock} label="Memory" status="Isolated" />
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatusNode({ icon: Icon, label, status }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="space-y-2"
    >
       <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
          <Icon className="w-5 h-5 text-[#00f2fe]" />
       </div>
       <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest leading-none">{label}</p>
       <p className="text-xs font-bold text-white uppercase tracking-tighter">{status}</p>
    </motion.div>
  );
}
