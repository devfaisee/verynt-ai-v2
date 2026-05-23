import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, FileAudio, FileText, Eye, Image, Cpu, Award, HardDrive, Terminal, GraduationCap, Search, Scissors, Zap, Shield, Flame, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const tools = [
  { id: 'whisper', name: 'Whisper', desc: 'Transcribe audio & video to text locally', icon: FileAudio, color: '#00f2fe', tag: 'Audio' },
  { id: 'pdf', name: 'DocuChat', desc: 'Chat with PDFs, extract summaries offline', icon: FileText, color: '#00f2fe', tag: 'Documents' },
  { id: 'pdf-tools', name: 'PDF Tools', desc: 'Merge, split, compress PDFs instantly', icon: Scissors, color: '#9b51e0', tag: 'Documents' },
  { id: 'ocr', name: 'OCR Scanner', desc: 'Extract text from images and scans', icon: Search, color: '#00f2fe', tag: 'Vision' },
  { id: 'redact', name: 'Redact', desc: 'Remove sensitive data (emails, SSNs, etc)', icon: Shield, color: '#9b51e0', tag: 'Privacy' },
  { id: 'clear', name: 'Background Remover', desc: 'Remove backgrounds from images instantly', icon: Image, color: '#00f2fe', tag: 'Images' },
];

export default function Dashboard() {
  return (
    <>
      <SEO title="Verynt - Private AI Tools" description="33 offline AI tools. No subscriptions. No privacy concerns. Everything runs locally." />
      
      <div className="space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 pt-12 pb-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-950/30 to-cyan-950/30 border border-emerald-700/30 rounded-full hover:border-emerald-600/50 transition">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-300">100% Offline • 100% Private • 100% Free</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-7xl font-black font-display text-white leading-tight">
            AI That Never<br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Leaves Your Device
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            33 powerful AI tools running entirely in your browser. Process documents, images, audio, code, and more—completely offline, completely private, completely free.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center pt-4">
            <Link
              to="/tool/whisper"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg transition transform hover:scale-105"
            >
              Try It Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Three Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel p-6 rounded-xl border border-cyan-950/20 hover:border-cyan-700/50 transition">
            <Cpu className="w-6 h-6 text-cyan-400 mb-3" />
            <h4 className="font-bold text-white mb-2">Local Processing</h4>
            <p className="text-sm text-gray-400">WebGPU acceleration runs AI models at lightning speed on your hardware</p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-purple-950/20 hover:border-purple-700/50 transition">
            <HardDrive className="w-6 h-6 text-purple-400 mb-3" />
            <h4 className="font-bold text-white mb-2">Completely Offline</h4>
            <p className="text-sm text-gray-400">Works without internet after first load. Perfect for privacy and security</p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-emerald-950/20 hover:border-emerald-700/50 transition">
            <Award className="w-6 h-6 text-emerald-400 mb-3" />
            <h4 className="font-bold text-white mb-2">100% Free Forever</h4>
            <p className="text-sm text-gray-400">No paywalls. No subscriptions. No feature gates. Everything included.</p>
          </div>
        </div>

        {/* Featured Tools Section */}
        <div className="space-y-6 pt-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Popular Tools</h2>
            <p className="text-gray-400">Pick any tool to start processing instantly</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Link 
                key={tool.id}
                to={`/tool/${tool.id}`}
                className="group glass-panel p-5 rounded-xl border border-slate-800/50 hover:border-cyan-700/50 transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform" style={{ color: tool.color }}>
                    <tool.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded">
                    {tool.tag}
                  </span>
                </div>
                <h3 className="font-bold text-white mb-1 group-hover:text-cyan-400 transition">{tool.name}</h3>
                <p className="text-sm text-gray-400">{tool.desc}</p>
              </Link>
            ))}
          </div>

          <div className="text-center pt-6">
            <p className="text-gray-500">Showing 6 of <span className="text-white font-bold">33 Tools</span></p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="glass-panel p-8 rounded-xl border border-slate-800/50 mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-4xl font-black text-cyan-400">33</p>
              <p className="text-sm text-gray-400 mt-1">AI Tools</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-purple-400">0ms</p>
              <p className="text-sm text-gray-400 mt-1">Latency</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-emerald-400">$0</p>
              <p className="text-sm text-gray-400 mt-1">Cloud Cost</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-amber-400">100%</p>
              <p className="text-sm text-gray-400 mt-1">Private</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="glass-panel p-8 rounded-xl border border-gradient-to-r from-cyan-700/30 to-purple-700/30 text-center">
          <Flame className="w-8 h-8 text-amber-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">Ready to Get Started?</h3>
          <p className="text-gray-400 mb-6">Pick any tool and start processing instantly. No signup required.</p>
          <Link 
            to="/tool/whisper"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg transition"
          >
            Try Whisper Now →
          </Link>
        </div>
      </div>
    </>
  );
}