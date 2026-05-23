/**
 * AdsBanner Component: Professional contextual ads placement
 */

import React, { useState, useEffect } from 'react';
import { X, Zap, Lock, Zap as Lightning } from 'lucide-react';

const ADS = [
  {
    id: 'ad-1',
    title: 'Enterprise Deployment',
    description: 'Run Verynt privately on your servers',
    badge: '⚡ Self-Hosted',
    bgGradient: 'from-blue-900/20 to-cyan-900/20',
    borderColor: 'border-blue-700/30'
  },
  {
    id: 'ad-2',
    title: 'Team Collaboration',
    description: 'Share projects and work together in real-time',
    badge: '👥 Coming Soon',
    bgGradient: 'from-purple-900/20 to-pink-900/20',
    borderColor: 'border-purple-700/30'
  },
  {
    id: 'ad-3',
    title: 'Premium Models',
    description: 'Unlock Whisper Large and GPT-level models',
    badge: '🚀 Advanced',
    bgGradient: 'from-emerald-900/20 to-teal-900/20',
    borderColor: 'border-emerald-700/30'
  },
  {
    id: 'ad-4',
    title: 'Mobile Apps',
    description: 'Use all tools on iPhone and Android',
    badge: '📱 iOS/Android',
    bgGradient: 'from-amber-900/20 to-orange-900/20',
    borderColor: 'border-amber-700/30'
  },
  {
    id: 'ad-5',
    title: 'API Access',
    description: 'Integrate Verynt tools into your apps',
    badge: '🔌 REST API',
    bgGradient: 'from-rose-900/20 to-red-900/20',
    borderColor: 'border-rose-700/30'
  },
  {
    id: 'ad-6',
    title: 'White-Label Solution',
    description: 'Resell Verynt under your brand',
    badge: '🎯 Partner',
    bgGradient: 'from-slate-800/20 to-slate-900/20',
    borderColor: 'border-slate-700/30'
  }
];

export default function AdsBanner() {
  const [currentAd, setCurrentAd] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ADS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const ad = ADS[currentAd];

  return (
    <div className={`bg-gradient-to-r ${ad.bgGradient} border ${ad.borderColor} rounded-lg p-4 flex items-center justify-between backdrop-blur-sm transition-all duration-500`}>
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="text-2xl whitespace-nowrap">{ad.badge}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-sm truncate">{ad.title}</h3>
          <p className="text-gray-300 text-xs truncate">{ad.description}</p>
        </div>
      </div>

      <div className="flex gap-2 ml-4 flex-shrink-0">
        <button className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded text-xs font-semibold transition whitespace-nowrap">
          Learn
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/10 rounded transition text-gray-400 hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
