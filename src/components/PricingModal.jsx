import React, { useState, useEffect } from 'react';
import { X, Check, ShieldCheck, Zap, HardDrive, Award, ArrowRight, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function PricingModal() {
  const { isPricingOpen, setIsPricingOpen } = useApp();

  return (
    <AnimatePresence>
      {isPricingOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#0c0c0d]/90 backdrop-blur-3xl flex items-center justify-center z-[1000] p-6 lg:p-12"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="glass-card w-full max-w-6xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[700px] shadow-[0_50px_100px_rgba(0,0,0,0.6)]"
          >
            
            {/* Left Side: Support & Mission */}
            <div className="flex-1 p-12 lg:p-24 space-y-16 bg-white/[0.01]">
               <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] bg-white/5 px-6 py-2 rounded-full border border-white/10">
                     <Heart className="w-4 h-4 text-rose-500" /> Support Local AI
                  </div>
                  <h2 className="text-6xl lg:text-8xl font-black text-white leading-[0.85] tracking-tighter">
                     Keep AI<br />independent.
                  </h2>
                  <p className="text-xl text-slate-500 font-medium max-w-md leading-relaxed">
                     Verynt is 100% serverless and ad-supported. Help us maintain the highest standard of local-first intelligence.
                  </p>
               </div>

               <div className="grid grid-cols-1 gap-10">
                  {[
                    { title: 'Support Open Source', desc: 'Your contribution funds the optimization of local neural weights.', icon: Zap, color: '#00f2fe' },
                    { title: 'Remove Placements', desc: 'Enjoy a completely distraction-free studio environment.', icon: ShieldCheck, color: '#bf5af2' },
                    { title: 'Future-Proof Privacy', desc: 'Help us scale 100% air-gapped AI to more devices worldwide.', icon: HardDrive, color: '#64d2ff' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-8 items-start">
                       <div className="w-14 h-14 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <item.icon className="w-7 h-7" style={{ color: item.color }} />
                       </div>
                       <div className="space-y-1">
                          <h4 className="text-xl font-bold text-white tracking-tight">{item.title}</h4>
                          <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Right Side: The Activation Card */}
            <div className="w-full md:w-[480px] p-12 lg:p-24 bg-white flex flex-col justify-between items-center text-center relative">
               <button 
                 onClick={() => setIsPricingOpen(false)}
                 className="absolute top-10 right-10 p-4 text-slate-300 hover:text-black transition-all rounded-full hover:bg-black/5"
               >
                  <X className="w-8 h-8" />
               </button>

               <div className="space-y-6 pt-12">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Verynt Supporter</span>
                  <div className="flex items-baseline gap-2 justify-center">
                     <span className="text-8xl font-black text-black tracking-tighter">$12</span>
                     <span className="text-xl text-slate-400 font-bold">/yr</span>
                  </div>
                  <div className="px-6 py-2 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black tracking-widest uppercase inline-block border border-emerald-100">
                     Ad-Free Experience
                  </div>
               </div>

               <div className="w-full space-y-6">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => alert("Redirecting to Support Portal...")}
                    className="w-full h-20 bg-black text-white rounded-[2rem] font-bold text-xl flex items-center justify-center gap-4 shadow-2xl transition-all"
                  >
                     Support Verynt <ArrowRight className="w-6 h-6" />
                  </motion.button>
                  <p className="text-[10px] text-slate-400 font-medium px-12 leading-relaxed">
                     Verynt is primarily supported by ads to keep AI free and private for everyone.
                  </p>
               </div>

               <div className="w-full pt-16 border-t border-slate-100 grid grid-cols-3 gap-8">
                  <PriceStat label="STUDIOS" value="50K+" />
                  <PriceStat label="REVENUE" value="ADS" />
                  <PriceStat label="SERVER" value="$0" />
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
       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{label}</p>
       <p className="text-base font-black text-black tracking-tighter">{value}</p>
    </div>
  );
}
