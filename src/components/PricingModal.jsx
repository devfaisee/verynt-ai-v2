import React from 'react';
import { X, Check, ShieldCheck, Zap, HardDrive, Award, ArrowRight } from 'lucide-react';
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
            
            {/* Left Side: Editorial Pitch */}
            <div className="flex-1 p-12 lg:p-24 space-y-16 bg-white/[0.01]">
               <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] bg-white/5 px-6 py-2 rounded-full border border-white/10">
                     <Award className="w-4 h-4" /> Global License
                  </div>
                  <h2 className="text-6xl lg:text-8xl font-black text-white leading-[0.85] tracking-tighter">
                     Master your<br />privacy.
                  </h2>
                  <p className="text-xl text-slate-500 font-medium max-w-md leading-relaxed">
                     Scale your local intelligence with higher-fidelity neural models and unrestricted data buffers.
                  </p>
               </div>

               <div className="grid grid-cols-1 gap-10">
                  {[
                    { title: 'Neural Expansion', desc: 'Deploy Whisper Base and Llama-3 weights.', icon: Zap, color: '#00f2fe' },
                    { title: 'Infinite Buffer', desc: 'Zero caps on signal length or file resolution.', icon: ShieldCheck, color: '#bf5af2' },
                    { title: 'Parallel Execution', desc: 'Initialize up to 20 studio nodes in-parallel.', icon: HardDrive, color: '#64d2ff' }
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
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Studio Pro Access</span>
                  <div className="flex items-baseline gap-2 justify-center">
                     <span className="text-8xl font-black text-black tracking-tighter">$12</span>
                     <span className="text-xl text-slate-400 font-bold">/mo</span>
                  </div>
                  <div className="px-6 py-2 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black tracking-widest uppercase inline-block border border-emerald-100">
                     Billed Annually • Save 40%
                  </div>
               </div>

               <div className="w-full space-y-6">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => alert("Redirecting to Checkout...")}
                    className="w-full h-20 bg-black text-white rounded-[2rem] font-bold text-xl flex items-center justify-center gap-4 shadow-2xl transition-all"
                  >
                     Activate Pro <ArrowRight className="w-6 h-6" />
                  </motion.button>
                  <p className="text-[10px] text-slate-400 font-medium px-12 leading-relaxed">
                     Secure encryption via Stripe. One-click deactivation in settings. Final signal remains local.
                  </p>
               </div>

               <div className="w-full pt-16 border-t border-slate-100 grid grid-cols-3 gap-8">
                  <PriceStat label="STUDIOS" value="50K+" />
                  <PriceStat label="UPTIME" value="100%" />
                  <PriceStat label="CLOUD COST" value="$0" />
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
