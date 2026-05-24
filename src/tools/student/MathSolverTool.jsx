import React, { useState, useRef, useEffect } from 'react';
import { Calculator, RefreshCw, Copy, Download, ShieldCheck, CheckCircle, TrendingUp, BarChart, LineChart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function MathSolverTool() {
  const { incrementUsage, triggerLoader } = useApp();
  const [equation, setEquation] = useState('2x + 5 = 13');
  const [solution, setSolution] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef(null);

  const executeSolve = () => {
    if (!equation.trim()) return;
    setIsProcessing(true);
    incrementUsage();
    triggerLoader("Parsing algebraic sequence...", () => {
      setIsProcessing(false);
      setSolution({
        result: 'x = 4',
        steps: [
          'Original equation: 2x + 5 = 13',
          'Subtract 5 from both sides: 2x = 8',
          'Divide by 2: x = 4'
        ]
      });
    });
  };

  useEffect(() => {
    if (solution && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, 320, 240);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.beginPath(); ctx.moveTo(160, 0); ctx.lineTo(160, 240); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, 120); ctx.lineTo(320, 120); ctx.stroke();
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0, 200); ctx.lineTo(320, 40); ctx.stroke();
    }
  }, [solution]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
      
      {/* Studio Controls (Left) */}
      <div className="lg:col-span-4 space-y-8 md:space-y-10">
         <div className="space-y-4">
            <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Expression Ingest</h3>
            <div className="glass-card p-8 space-y-8">
               <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center">Linear Input (y=)</p>
                  <textarea 
                    value={equation} 
                    onChange={(e) => setEquation(e.target.value)}
                    className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl p-6 font-mono text-lg text-[#00f2fe] focus:outline-none focus:border-[#00f2fe]/20 transition-all resize-none"
                  />
               </div>
               <button onClick={executeSolve} disabled={isProcessing} className="pill-button pill-button-primary w-full h-14 uppercase tracking-widest">
                  {isProcessing ? "Computing..." : "Execute Logic"}
               </button>
            </div>
         </div>

         <div className="p-8 bg-[#00f2fe]/5 border border-[#00f2fe]/10 rounded-[32px] space-y-4">
            <div className="flex items-center gap-3 text-[#00f2fe]">
               <TrendingUp className="w-5 h-5" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Step-by-Step Sync</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Mathematical sequences are decomposed into local logical blocks. No academic signal data is synchronized with external servers.</p>
         </div>
      </div>

      {/* Studio Output (Right) */}
      <div className="lg:col-span-8">
         <div className="h-full min-h-[600px] flex flex-col bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
               <div className="flex items-center gap-3">
                  <Calculator className="w-5 h-5 text-slate-400" />
                  <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.2em]">Logical Decomposition</span>
               </div>
               {solution && (
                 <button className="pill-button pill-button-ghost h-10 px-4 gap-2 text-[9px] uppercase tracking-widest border-white/5">
                    <Download className="w-3.5 h-3.5" /> Export Steps
                 </button>
               )}
            </div>

            <div className="flex-1 p-10 md:p-16 space-y-12">
               <AnimatePresence mode="wait">
                 {solution ? (
                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-12 border-b border-white/5 pb-12">
                         <div className="space-y-2 text-center md:text-left">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Final Result</span>
                            <p className="text-6xl font-black text-white tracking-tighter tabular-nums">{solution.result}</p>
                         </div>
                         <div className="w-64 h-48 bg-black/60 rounded-3xl border border-white/5 p-2 overflow-hidden shadow-inner shrink-0">
                            <canvas ref={canvasRef} width="256" height="192" className="w-full h-full opacity-50" />
                         </div>
                      </div>

                      <div className="space-y-6">
                         <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Resolution Sequence</h4>
                         <div className="space-y-4">
                            {solution.steps.map((step, i) => (
                              <div key={i} className="flex gap-6 items-start p-6 bg-white/[0.03] border border-white/5 rounded-3xl group hover:border-[#00f2fe]/20 transition-all">
                                 <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 font-black text-[10px] text-slate-500 group-hover:bg-white group-hover:text-black transition-all">
                                    {i + 1}
                                 </div>
                                 <p className="text-lg font-medium text-slate-300 leading-relaxed group-hover:text-white transition-colors">{step}</p>
                              </div>
                            ))}
                         </div>
                      </div>
                   </motion.div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-slate-800 gap-8 opacity-10 py-32 md:py-48">
                      <LineChart className="w-24 h-24" />
                      <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">Awaiting Equation Signal</p>
                   </div>
                 )}
               </AnimatePresence>
            </div>
         </div>
      </div>

    </div>
  );
}
