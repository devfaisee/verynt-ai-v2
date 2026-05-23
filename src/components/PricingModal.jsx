import React from 'react';
import { X, Check, ShieldCheck, Zap, HardDrive, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PricingModal() {
  const { isPricingOpen, setIsPricingOpen } = useApp();

  if (!isPricingOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#08090d]/85 backdrop-blur-md flex items-center justify-center z-50 fade-in p-4">
      <div className="glass-panel w-full max-w-2xl p-8 relative overflow-hidden flex flex-col md:flex-row gap-8">
        
        {/* Decorative Neon Blurs */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#9b51e0]/15 blur-2xl rounded-full"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#00f2fe]/15 blur-2xl rounded-full"></div>

        {/* Close Button */}
        <button 
          onClick={() => setIsPricingOpen(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Pitch */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00f2fe] bg-cyan-950/40 px-3 py-1.5 rounded-full border border-cyan-800/30">
            <Award className="w-4 h-4 text-[#00f2fe]" />
            Verynt Premium SaaS Upgrade
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-display text-white">
              Unlock the Ultimate Offline AI Engine
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              By running AI completely locally on your hardware, Verynt keeps your operations 100% private and bypasses expensive server costs. Support development and get unlimited bounds.
            </p>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-lg bg-emerald-950 text-emerald-400 mt-0.5">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Unlimited Processing Logs</h4>
                <p className="text-xs text-gray-400">Zero limits on transcription audio lengths or image upscaler volumes.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1 rounded-lg bg-emerald-950 text-emerald-400 mt-0.5">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Premium High-Accuracy Models</h4>
                <p className="text-xs text-gray-400">Unlock Whisper Base models and advanced AI document neural networks.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1 rounded-lg bg-emerald-950 text-emerald-400 mt-0.5">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Advanced Batch Workflow</h4>
                <p className="text-xs text-gray-400">Process up to 20 documents, audio clips, or images at once.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Price Card */}
        <div className="w-full md:w-[240px] bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 text-center flex flex-col justify-between gap-6 relative">
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              VERYNT PRO
            </span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-extrabold font-display text-white">$12</span>
              <span className="text-sm text-gray-400">/ month</span>
            </div>
            <p className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/40 py-1 rounded-md">
              Save 30% with Annual Billing
            </p>
          </div>

          <div className="space-y-3 text-xs text-left text-gray-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00f2fe]" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#9b51e0]" />
              <span>Blazing-fast execution</span>
            </div>
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#00f2fe]" />
              <span>Full offline usage</span>
            </div>
          </div>

          <button 
            onClick={() => alert("Redirecting to Stripe checkout portal...")}
            className="w-full py-3 bg-gradient-to-r from-[#9b51e0] to-[#00f2fe] text-white font-display font-bold text-xs rounded-xl shadow-lg shadow-purple-900/40 hover:scale-105 transition-transform"
          >
            Upgrade Instantly
          </button>
        </div>
      </div>
    </div>
  );
}
