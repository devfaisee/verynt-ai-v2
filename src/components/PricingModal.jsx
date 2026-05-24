import React, { useState, useEffect } from 'react';
import { X, Check, ShieldCheck, Zap, HardDrive, Award, ArrowRight, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function PricingModal() {
  const { isPricingOpen, setIsPricingOpen } = useApp();
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes = 900 seconds
  
  useEffect(() => {
    if (!isPricingOpen) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPricingOpen]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isPricingOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#0c0c0d]/95 backdrop-blur-3xl flex items-center justify-center z-[2000] p-4 sm:p-6 lg:p-12 overflow-y-auto"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="glass-card w-full max-w-6xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[700px] shadow-[0_50px_100px_rgba(0,0,0,0.6)]"
          >
            
            {/* Left Side: Support & Mission */}
            <div className="flex-1 p-8 md:p-16 lg:p-24 space-y-10 md:space-y-16 bg-white/[0.01]">
               <div className="space-y-4 md:space-y-6">
                  <div className="inline-flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] bg-white/5 px-4 py-1.5 md:px-6 md:py-2 rounded-full border border-white/10">
                     <Heart className="w-3.5 h-3.5 text-rose-500" /> Support Local AI
                  </div>
                  <h2 className="text-4xl sm:text-5xl lg:text-8xl font-black text-white leading-[0.85] tracking-tighter">
                     Keep AI<br />independent.
                  </h2>
                  <p className="text-base md:text-xl text-slate-500 font-medium max-w-md leading-relaxed">
                     Verynt is 100% serverless and ad-supported. Help us maintain the highest standard of local-first intelligence.
                  </p>
               </div>

               <div className="grid grid-cols-1 gap-6 md:gap-10">
                  {[
                    { title: 'Support Open Source', desc: 'Your contribution funds the optimization of local neural weights.', icon: Zap, color: '#00f2fe' },
                    { title: 'Remove Placements', desc: 'Enjoy a completely distraction-free studio environment.', icon: ShieldCheck, color: '#bf5af2' },
                    { title: 'Future-Proof Privacy', desc: 'Help us scale 100% air-gapped AI to more devices worldwide.', icon: HardDrive, color: '#64d2ff' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 md:gap-8 items-start">
                       <div className="w-11 h-11 md:w-14 md:h-14 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <item.icon className="w-5 h-5 md:w-7 md:h-7" style={{ color: item.color }} />
                       </div>
                       <div className="space-y-0.5 md:space-y-1 text-left">
                          <h4 className="text-lg md:text-xl font-bold text-white tracking-tight">{item.title}</h4>
                          <p className="text-xs md:text-sm text-slate-500 font-medium">{item.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Right Side: The Activation Card */}
            <div className="w-full md:w-[400px] lg:w-[480px] p-8 md:p-16 lg:p-24 bg-white flex flex-col justify-between items-center text-center relative shrink-0">
               <button 
                 onClick={() => setIsPricingOpen(false)}
                 className="absolute top-6 right-6 md:top-10 md:right-10 p-2 md:p-4 text-slate-300 hover:text-black transition-all rounded-full hover:bg-black/5"
               >
                  <X className="w-6 h-6 md:w-8 md:h-8" />
               </button>

               <div className="space-y-4 md:space-y-6 pt-8 md:pt-12">
                  <span className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Studio Pro Access</span>
                  <div className="flex items-baseline gap-1 md:gap-2 justify-center">
                     <span className="text-6xl sm:text-7xl lg:text-8xl font-black text-black tracking-tighter">$12</span>
                     <span className="text-lg md:text-xl text-slate-400 font-bold">/yr</span>
                  </div>
                  <div className="px-4 py-1.5 md:px-6 md:py-2 rounded-full bg-emerald-50 text-emerald-600 text-[9px] md:text-xs font-black tracking-widest uppercase inline-block border border-emerald-100 shadow-sm">
                     Billed Annually • Save 40%
                  </div>
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-wider flex items-center justify-center gap-2 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                    <span>Supporter slot expires in: <span className="font-mono text-rose-500 font-black">{formatTime(timeLeft)}</span></span>
                  </div>
               </div>

               <div className="w-full space-y-4 md:space-y-6 mt-8 md:mt-0">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => alert("Redirecting to Support Portal...")}
                    className="w-full h-16 md:h-20 bg-black text-white rounded-[1.5rem] md:rounded-[2rem] font-bold text-lg md:text-xl flex items-center justify-center gap-3 md:gap-4 shadow-2xl transition-all"
                  >
                     Activate Pro <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                  </motion.button>
                  <p className="text-[10px] text-slate-400 font-medium px-8 md:px-12 leading-relaxed">
                     Secure encryption via Stripe. One-click deactivation. 100% of final signal remains local.
                  </p>
               </div>

               <div className="w-full pt-10 md:pt-16 border-t border-slate-100 grid grid-cols-3 gap-4 md:gap-8">
                  <PriceStat label="STUDIOS" value="50K+" />
                  <PriceStat label="UPTIME" value="100%" />
                  <PriceStat label="REVENUE" value="ADS" />
               </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PriceStat({ label, value }) {
  return (
    <div className="space-y-1">
       <p className="text-[8px] md:text-[9px] font-black text-slate-300 uppercase tracking-widest">{label}</p>
       <p className="text-sm md:text-base font-black text-black tracking-tighter uppercase">{value}</p>
    </div>
  );
}
