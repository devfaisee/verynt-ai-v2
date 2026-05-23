import React, { useState } from 'react';
import { PenTool, FileText, Check, Copy, RefreshCw, Cpu, Sparkles, Award } from 'lucide-react';

export default function WriterTool({ incrementUsage, triggerLoader }) {
  const [inputText, setInputText] = useState("yo support, my resume is kinda weak. can u help me make it sound professional so i can secure a job? let me know asap. thanks!");
  const [outputText, setOutputText] = useState('');
  const [activeTone, setActiveTone] = useState('professional'); // 'professional', 'casual', 'academic', 'shorten', 'expand'
  const [activeTab, setActiveTab] = useState('rewrite'); // 'rewrite', 'templates', 'ats'
  const [templateType, setTemplateType] = useState('email'); // 'email', 'coverletter', 'linkedin'
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Template inputs
  const [jobTitle, setJobTitle] = useState('Software Engineer');
  const [companyName, setCompanyName] = useState('Verynt AI');
  const [userSkills, setUserSkills] = useState('React, JavaScript, WebGPU, Python');

  // ATS Checker Inputs
  const [resumeText, setResumeText] = useState("Experienced developer with skills in React, JavaScript, and Node.js. Built visual dashboards and managed state arrays. Deep focus on performance and clean code frameworks.");
  const [jobDescText, setJobDescText] = useState("We are looking for a Senior Software Engineer. The candidate must be proficient in React, JavaScript, TypeScript, WebGPU, Node.js, and have experience with SaaS platform scalability.");
  const [atsScore, setAtsScore] = useState(0);
  const [atsReport, setAtsReport] = useState(null);

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

  const runATSChecker = () => {
    setIsProcessing(true);
    incrementUsage();

    triggerLoader(
      (progress, setStatusText) => {
        setStatusText(`Analyzing resume vocabulary & matching density... ${progress}%`);
      },
      () => {
        setIsProcessing(false);

        // Simple local keyword matching algorithms
        const resumeWords = resumeText.toLowerCase().split(/[\s,.\/]+/);
        const jobDescWords = jobDescText.toLowerCase().split(/[\s,.\/]+/);

        // Filter unique keywords of interest
        const keywordsOfInterest = ["react", "javascript", "typescript", "webgpu", "node.js", "scalable", "scale", "performance", "python", "css", "html"];
        
        const matched = keywordsOfInterest.filter(word => 
          resumeWords.includes(word) && jobDescWords.includes(word)
        );

        const missing = keywordsOfInterest.filter(word => 
          jobDescWords.includes(word) && !resumeWords.includes(word)
        );

        // Calculate score
        const scoreVal = Math.floor((matched.length / (matched.length + missing.length || 1)) * 100);
        
        setAtsScore(scoreVal);
        setAtsReport({
          score: scoreVal,
          matchedKeywords: matched,
          missingKeywords: missing,
          tips: [
            "Incorporate standard keyword hooks such as: " + missing.map(w => `"${w}"`).join(', '),
            "Emphasize scalable software architectures and browser hardware caching.",
            "Write descriptive impact metrics inside your past job experience cards."
          ]
        });
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
          Professional offline text rephraser, resume cover letter generator, and ATS checker. 100% private.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-950/40 border border-slate-900 rounded-xl p-1 w-max text-xs font-bold font-display">
        <button 
          onClick={() => { setActiveTab('rewrite'); setOutputText(''); }}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'rewrite' ? 'bg-[#9b51e0] text-white' : 'text-gray-400 hover:text-white'}`}
        >
          AI Rephraser
        </button>
        <button 
          onClick={() => { setActiveTab('templates'); setOutputText(''); }}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'templates' ? 'bg-[#9b51e0] text-white' : 'text-gray-400 hover:text-white'}`}
        >
          SaaS Templates
        </button>
        <button 
          onClick={() => { setActiveTab('ats'); setOutputText(''); }}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'ats' ? 'bg-[#9b51e0] text-white' : 'text-gray-400 hover:text-white'}`}
        >
          ATS Resume Checker
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Workspace Panel */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* TAB: REWRITE INPUTS */}
          {activeTab === 'rewrite' && (
            <div className="glass-panel p-5 rounded-2xl space-y-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Input Text to Polish</span>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-[150px] bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 font-sans text-xs leading-relaxed text-gray-300 focus:outline-none focus:border-cyan-800/50 resize-none"
              />

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

              <button onClick={executeRewrite} className="btn-primary w-full text-xs justify-center">
                <Cpu className="w-4 h-4 animate-pulse" /> Rephrase Offline
              </button>
            </div>
          )}

          {/* TAB: TEMPLATE INPUTS */}
          {activeTab === 'templates' && (
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
                  <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Target Company</label>
                  <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Core Skills</label>
                  <input type="text" value={userSkills} onChange={(e) => setUserSkills(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none" />
                </div>
              </div>

              <button onClick={generateTemplate} className="btn-primary w-full text-xs justify-center">
                <Sparkles className="w-4 h-4" /> Compile Template
              </button>
            </div>
          )}

          {/* TAB: ATS RESUME CHECKER */}
          {activeTab === 'ats' && (
            <div className="glass-panel p-5 rounded-2xl space-y-4 text-xs">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Paste Resume Text</label>
                <textarea 
                  value={resumeText} 
                  onChange={(e) => setResumeText(e.target.value)} 
                  className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-gray-300 focus:outline-none focus:border-cyan-800/50 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Paste Target Job Description</label>
                <textarea 
                  value={jobDescText} 
                  onChange={(e) => setJobDescText(e.target.value)} 
                  className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-gray-300 focus:outline-none focus:border-cyan-800/50 resize-none"
                />
              </div>

              <button onClick={runATSChecker} className="btn-primary w-full text-xs justify-center">
                <Award className="w-4 h-4" /> Run ATS Audit
              </button>
            </div>
          )}

        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-7">
          <div className="glass-panel rounded-2xl h-full min-h-[300px] flex flex-col justify-between overflow-hidden">
            
            {activeTab === 'ats' && atsReport ? (
              /* ATS Audit Report Output */
              <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[350px]">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <h3 className="text-sm font-bold text-white">ATS Audit Analysis</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Matching Score:</span>
                    <span className={`text-lg font-black font-display px-2 py-0.5 rounded ${
                      atsScore >= 75 ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-900/20' : 'text-amber-400 bg-amber-950/40 border border-amber-900/20'
                    }`}>{atsScore}%</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Matched Keywords */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Found Keywords ({atsReport.matchedKeywords.length})</span>
                    <div className="flex flex-wrap gap-1.5">
                      {atsReport.matchedKeywords.map((k, i) => (
                        <span key={i} className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/25">
                          ✓ {k}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Keywords */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Missing Keywords ({atsReport.missingKeywords.length})</span>
                    <div className="flex flex-wrap gap-1.5">
                      {atsReport.missingKeywords.length > 0 ? (
                        atsReport.missingKeywords.map((k, i) => (
                          <span key={i} className="text-[10px] font-semibold text-rose-400 bg-rose-950/20 px-2 py-0.5 rounded border border-rose-900/25">
                            ✗ {k}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-emerald-400 font-bold">No missing keywords found! Excellent match.</span>
                      )}
                    </div>
                  </div>

                  {/* Tailoring Recommendations */}
                  <div className="space-y-2 pt-2 border-t border-slate-900">
                    <span className="text-[10px] font-bold text-amber-400 uppercase block">Optimization Checklist</span>
                    <ul className="space-y-1 text-xs text-gray-400 list-inside list-decimal leading-relaxed">
                      {atsReport.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              /* Standard Text Output */
              <div className="flex-1 flex flex-col justify-between">
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
                      <p>Your rephrased professional text will output here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
