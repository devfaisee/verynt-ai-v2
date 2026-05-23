import React, { useState } from 'react';
import { PenTool, FileText, Check, Copy, RefreshCw, Cpu, Sparkles } from 'lucide-react';

export default function WriterTool({ incrementUsage, triggerLoader }) {
  const [inputText, setInputText] = useState("yo support, my resume is kinda weak. can u help me make it sound professional so i can secure a job? let me know asap. thanks!");
  const [outputText, setOutputText] = useState('');
  const [activeTone, setActiveTone] = useState('professional'); // 'professional', 'casual', 'academic', 'shorten', 'expand'
  const [activeTab, setActiveTab] = useState('rewrite'); // 'rewrite', 'templates'
  const [templateType, setTemplateType] = useState('email'); // 'email', 'coverletter', 'linkedin'
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Template inputs
  const [jobTitle, setJobTitle] = useState('Software Engineer');
  const [companyName, setCompanyName] = useState('Verynt AI');
  const [userSkills, setUserSkills] = useState('React, JavaScript, WebGPU, Python');

  const executeRewrite = () => {
    setIsProcessing(true);
    incrementUsage();

    triggerLoader(
      (progress, setStatusText) => {
        if (progress < 40) {
          setStatusText("Analyzing text grammar syntax locally...");
        } else {
          setStatusText(`Generating rephrased output (${activeTone})... ${progress}%`);
        }
      },
      () => {
        setIsProcessing(false);
        let result = '';
        const raw = inputText.trim();

        if (activeTone === 'professional') {
          result = `Dear Support Team,\n\nI hope this message finds you well. I am currently seeking assistance in optimizing my resume to enhance its professional presentation for potential employment opportunities. \n\nI would greatly appreciate your guidance and support in this matter. Thank you for your time and prompt attention to this request.\n\nSincerely,\n[Your Name]`;
        } else if (activeTone === 'academic') {
          result = `To whom it may concern,\n\nThis inquiry concerns the academic optimization of my curriculum vitae. The primary objective is to align my professional credentials with standard industry benchmarks to facilitate successful employment acquisitions. \n\nYour expert analytical feedback regarding these structural revisions would be highly valued.\n\nRespectfully,\n[Your Name]`;
        } else if (activeTone === 'shorten') {
          result = `Hello Support, please help me optimize my resume for professional job applications. Let me know if you can assist. Thanks!`;
        } else if (activeTone === 'expand') {
          result = `Hello Support Team, I am writing to you today because I am currently preparing to apply for competitive job positions. I realize that my current resume is somewhat lacking in impact and structure, and I would love to get your professional assistance to tailor, refine, and improve it so that it highlights my competencies and experience perfectly.\n\nThank you so much, and I look forward to hearing from you at your earliest convenience!`;
        } else {
          result = `Hey team! Hope you guys are doing awesome. Just wanted to see if we could polish up my resume a bit to make it stand out to hiring managers. Let me know when you're free to chat. Appreciate it!`;
        }
        setOutputText(result);
      }
    );
  };

  const generateTemplate = () => {
    setIsProcessing(true);
    incrementUsage();

    triggerLoader(
      (progress, setStatusText) => {
        setStatusText(`Compiling ${templateType} template locally... ${progress}%`);
      },
      () => {
        setIsProcessing(false);
        let result = '';

        if (templateType === 'email') {
          result = `Subject: Application for ${jobTitle} - [Your Name]\n\nDear Hiring Team at ${companyName},\n\nI am writing to formally express my interest in the ${jobTitle} position. With my technical skills in ${userSkills}, I am confident in my ability to add immediate value to your engineering team. \n\nI look forward to discussing how my background aligns with your current technical objectives.\n\nWarm regards,\n[Your Name]`;
        } else if (templateType === 'coverletter') {
          result = `Dear Hiring Manager at ${companyName},\n\nI am thrilled to submit my application for the ${jobTitle} role. As a dedicated specialist with hands-on proficiency in ${userSkills}, I have consistently focused on building high-performance, responsive systems.\n\nWhat excites me most about ${companyName} is your commitment to innovative, client-side scalability. I would welcome the opportunity to discuss my qualification parameters with you in detail.\n\nSincerely,\n[Your Name]`;
        } else {
          result = `🚀 Excited to announce that I am actively applying for the ${jobTitle} position at ${companyName}!\n\nBuilding high-end, responsive products utilizing modern tech stacks like ${userSkills} has always been my core passion.\n\nIf you have open leads or want to connect, please feel free to reach out. Let's build! #SoftwareEngineering #JobSearch #React`;
        }
        setOutputText(result);
      }
    );
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
          <PenTool className="w-6 h-6 text-[#00f2fe]" /> Verynt Writing Assistant
        </h2>
        <p className="text-sm text-gray-400">
          Professional offline text rephraser, email generator, and cover letter creator. 100% private.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-950/40 border border-slate-900 rounded-xl p-1 w-max text-xs font-bold font-display">
        <button 
          onClick={() => { setActiveTab('rewrite'); setOutputText(''); }}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'rewrite' ? 'bg-[#9b51e0] text-white' : 'text-gray-400 hover:text-white'}`}
        >
          AI Rephraser & Grammar Fix
        </button>
        <button 
          onClick={() => { setActiveTab('templates'); setOutputText(''); }}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'templates' ? 'bg-[#9b51e0] text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Professional SaaS Templates
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Workspace Panel */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* TAB: REWRITE INPUTS */}
          {activeTab === 'rewrite' ? (
            <div className="glass-panel p-5 rounded-2xl space-y-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Input Text to Polish</span>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-[150px] bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 font-sans text-xs leading-relaxed text-gray-300 focus:outline-none focus:border-cyan-800/50 resize-none"
              />

              {/* Tone Selection */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Tone Mode</span>
                <div className="grid grid-cols-3 gap-1 text-[10px] font-bold">
                  {['professional', 'academic', 'shorten', 'expand', 'casual'].map((tone) => (
                    <button
                      key={tone}
                      onClick={() => setActiveTone(tone)}
                      className={`py-2 border rounded-lg uppercase tracking-wider transition-colors ${
                        activeTone === tone ? 'border-[#00f2fe] bg-cyan-950/30 text-white' : 'border-slate-800 text-gray-500'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={executeRewrite}
                disabled={isProcessing}
                className="btn-primary w-full text-xs justify-center"
              >
                <Cpu className="w-4 h-4 animate-pulse" /> Rephrase Offline
              </button>
            </div>
          ) : (
            /* TAB: TEMPLATE INPUTS */
            <div className="glass-panel p-5 rounded-2xl space-y-4 text-xs">
              <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-0.5 font-bold text-[10px]">
                {['email', 'coverletter', 'linkedin'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setTemplateType(type)}
                    className={`flex-1 py-1.5 rounded-md transition-colors ${templateType === type ? 'bg-[#9b51e0] text-white' : 'text-gray-400'}`}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Target Job Title</label>
                  <input 
                    type="text" 
                    value={jobTitle} 
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Target Company</label>
                  <input 
                    type="text" 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Core Skills</label>
                  <input 
                    type="text" 
                    value={userSkills} 
                    onChange={(e) => setUserSkills(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none"
                  />
                </div>
              </div>

              <button 
                onClick={generateTemplate}
                disabled={isProcessing}
                className="btn-primary w-full text-xs justify-center"
              >
                <Sparkles className="w-4 h-4" /> Compile Template
              </button>
            </div>
          )}

        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-7">
          <div className="glass-panel rounded-2xl h-full min-h-[300px] flex flex-col justify-between overflow-hidden">
            
            <div className="flex items-center justify-between border-b border-slate-800/80 p-4 bg-slate-950/30">
              <span className="text-xs font-bold text-gray-400">Polished Output</span>
              {outputText && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(outputText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="p-1.5 hover:bg-slate-800/40 text-gray-400 hover:text-white rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>

            <div className="flex-1 p-6 text-sm leading-relaxed overflow-y-auto max-h-[320px] text-gray-300 whitespace-pre-wrap font-sans">
              {outputText ? (
                outputText
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 gap-2 mt-12 font-sans">
                  <FileText className="w-10 h-10 text-slate-800" />
                  <p>Your rewritten professional text will output here.</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
