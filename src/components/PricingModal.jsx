import React from 'react';
import { X, Check, ShieldCheck, Zap, HardDrive, Award, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PricingModal() {
  const { isPricingOpen, setIsPricingOpen } = useApp();

  if (!isPricingOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#020203]/90 backdrop-blur-2xl flex items-center justify-center z-[100] fade-in p-6">
      <div className="glass-panel w-full max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,0.5)]">
        
        {/* Left Side: Brand & Value Prop */}
        <div className="flex-1 p-12 lg:p-20 space-y-12 bg-white/[0.02]">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-[10px] font-black text-[#00f2fe] uppercase tracking-[0.2em] bg-[#00f2fe]/5 px-4 py-2 rounded-full border border-[#00f2fe]/20">
                 <Award className="w-3.5 h-3.5" /> Premium Platform Access
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-white leading-[0.85] tracking-tight">
                 Unlock native<br />intelligence.
              </h2>
              <p className="text-lg text-slate-400 font-medium max-w-md leading-relaxed">
                 Scale your productivity with unlimited local processing, larger neural models, and professional batch workflows.
              </p>
           </div>

           <div className="space-y-6">
              {[
                { title: 'Unlimited Processing', desc: 'Zero caps on audio length or document volume.', icon: Zap, color: '#00f2fe' },
                { title: 'Premium Model Access', desc: 'Deploy Whisper Base and Llama-3 high-accuracy weights.', icon: ShieldCheck, color: '#8b5cf6' },
                { title: 'Batch Execution', desc: 'Process up to 20 files simultaneously in-parallel.', icon: HardDrive, color: '#3b82f6' }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                   <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6" style={{ color: item.color }} />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-lg font-bold text-white tracking-tight">{item.title}</h4>
                      <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Right Side: The Card */}
        <div className="w-full md:w-[450px] p-12 lg:p-20 bg-white flex flex-col justify-between items-center text-center">
           <button 
             onClick={() => setIsPricingOpen(false)}
             className="absolute top-8 right-8 p-3 text-slate-400 hover:text-black transition-colors rounded-full hover:bg-black/5"
           >
              <X className="w-6 h-6" />
           </button>

           <div className="space-y-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verynt Pro Lifetime</span>
              <div className="flex items-baseline gap-1 justify-center">
                 <span className="text-7xl font-black text-black tracking-tighter">$12</span>
                 <span className="text-lg text-slate-400 font-bold">/mo</span>
              </div>
              <p className="text-xs text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-full inline-block">
                 Billed annually — Save 40%
              </p>
           </div>

           <div className="w-full space-y-4">
              <button 
                onClick={() => alert("Redirecting to Stripe...")}
                className="w-full h-16 bg-black text-white rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:scale-105 transition-transform"
              >
                 Upgrade Instantly <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-[10px] text-slate-400 font-medium px-8">
                 Secure payment via Stripe. Cancel anytime with one click in your local dashboard.
              </p>
           </div>

           <div className="w-full pt-12 border-t border-slate-100 grid grid-cols-3 gap-4">
              <div className="space-y-1">
                 <p className="text-[9px] font-black text-slate-300 uppercase">Users</p>
                 <p className="text-sm font-bold text-black tracking-tighter">50K+</p>
              </div>
              <div className="space-y-1 border-x border-slate-100">
                 <p className="text-[9px] font-black text-slate-300 uppercase">Uptime</p>
                 <p className="text-sm font-bold text-black tracking-tighter">100%</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[9px] font-black text-slate-300 uppercase">Cost</p>
                 <p className="text-sm font-bold text-black tracking-tighter">$0</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
