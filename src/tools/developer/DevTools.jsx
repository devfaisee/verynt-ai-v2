import React, { useState } from 'react';
import { Terminal, Code, Check, Copy, RefreshCw, Braces, Binary, Search, Database, FileText } from 'lucide-react';

export default function DevTools({ incrementUsage }) {
  const [activeTool, setActiveTool] = useState('json'); // 'json', 'base64', 'regex', 'sql', 'markdown'
  
  // 1. JSON Formatter States
  const [jsonInput, setJsonInput] = useState('{"name":"Verynt","type":"SaaS","privacy":true,"metrics":{"latency":"0ms","cost":0}}');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [jsonCopied, setJsonCopied] = useState(false);

  // 2. Base64 States
  const [b64Input, setB64Input] = useState('Welcome to Verynt Privacy-First SaaS!');
  const [b64Output, setB64Output] = useState('');
  const [b64Mode, setB64Mode] = useState('encode');
  const [b64Copied, setB64Copied] = useState(false);

  // 3. Regex Generator States
  const [regexQuery, setRegexQuery] = useState('email');
  const [regexOutput, setRegexOutput] = useState('/\\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}\\b/g');
  const [regexExplanation, setRegexExplanation] = useState('Matches any valid email address block with domain credentials.');
  const [regexCopied, setRegexCopied] = useState(false);

  // 4. SQL Formatter States
  const [sqlInput, setSqlInput] = useState('select id, name, pricing_tier from users where active = 1 group by pricing_tier order by id desc limit 10;');
  const [sqlOutput, setSqlOutput] = useState('');
  const [sqlCopied, setSqlCopied] = useState(false);

  // 5. Markdown States
  const [mdInput, setMdInput] = useState('# Verynt AI\n## Local SaaS Utilities\nThis is a **privacy-first** browser tool. *Zero server cost* details.');
  const [mdOutput, setMdOutput] = useState('');
  const [mdCopied, setMdCopied] = useState(false);

  // JSON Formatter logic
  const formatJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
      setJsonError('');
      incrementUsage();
    } catch (e) {
      setJsonError('Invalid JSON: ' + e.message);
      setJsonOutput('');
    }
  };

  // Base64 logic
  const processBase64 = () => {
    try {
      if (b64Mode === 'encode') {
        setB64Output(btoa(b64Input));
      } else {
        setB64Output(atob(b64Input));
      }
      incrementUsage();
    } catch (e) {
      setB64Output('Decoding Error: Invalid Base64 structure.');
    }
  };

  // Regex logic
  const handleRegexSelect = (type) => {
    setRegexQuery(type);
    incrementUsage();
    if (type === 'email') {
      setRegexOutput('/\\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}\\b/g');
      setRegexExplanation('Matches standard email strings like names@subdomain.extension.');
    } else if (type === 'phone') {
      setRegexOutput('/\\b\\+?\\d{1,4}[-.\\s]?\\(?\\d{1,3}\\)?[-.\\s]?\\d{3,4}[-.\\s]?\\d{3,4}\\b/g');
      setRegexExplanation('Matches phone numbers with international prefixes and formatting separators.');
    } else if (type === 'url') {
      setRegexOutput('/https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/g');
      setRegexExplanation('Matches web protocols (http/https) and fully qualified domain addresses.');
    } else {
      setRegexOutput('/\\b\\d+\\b/g');
      setRegexExplanation('Matches positive integers or digits separated by space boundaries.');
    }
  };

  // SQL Formatter logic
  const formatSQL = () => {
    incrementUsage();
    let query = sqlInput.trim();
    
    // Simple operational regex formatter
    const keywords = ['select', 'from', 'where', 'group by', 'order by', 'limit', 'join', 'left join', 'on', 'insert into', 'update', 'delete from', 'values', 'set'];
    
    // Capitalize and indent keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      query = query.replace(regex, `\n${keyword.toUpperCase()}`);
    });

    setSqlOutput(query.trim());
  };

  // Markdown Converter logic
  const convertMarkdown = () => {
    incrementUsage();
    let md = mdInput;
    
    // Simple markdown-to-HTML parser rules
    md = md.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    md = md.replace(/^## (.*$)/gim, '<h2>$2</h2>');
    md = md.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
    md = md.replace(/\*(.*)\*/gim, '<em>$1</em>');
    md = md.replace(/\n$/gim, '<br />');

    setMdOutput(md);
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
          <Terminal className="w-6 h-6 text-[#00f2fe]" /> Verynt Developer Utilities
        </h2>
        <p className="text-sm text-gray-400">
          Fast, client-side developer tools. JSON, Base64, SQL, Regex, and Markdown. 100% offline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Sidebar selector */}
        <div className="lg:col-span-3">
          <div className="glass-panel p-4 rounded-2xl flex flex-col gap-2">
            <button
              onClick={() => setActiveTool('json')}
              className={`w-full py-3 px-4 rounded-xl font-display text-xs font-bold text-left flex items-center gap-2 transition-all ${
                activeTool === 'json' ? 'bg-[#9b51e0] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Braces className="w-4 h-4" /> JSON Formatter
            </button>
            <button
              onClick={() => setActiveTool('base64')}
              className={`w-full py-3 px-4 rounded-xl font-display text-xs font-bold text-left flex items-center gap-2 transition-all ${
                activeTool === 'base64' ? 'bg-[#9b51e0] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Binary className="w-4 h-4" /> Base64 Transcoder
            </button>
            <button
              onClick={() => setActiveTool('regex')}
              className={`w-full py-3 px-4 rounded-xl font-display text-xs font-bold text-left flex items-center gap-2 transition-all ${
                activeTool === 'regex' ? 'bg-[#9b51e0] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Search className="w-4 h-4" /> Regex Generator
            </button>
            <button
              onClick={() => setActiveTool('sql')}
              className={`w-full py-3 px-4 rounded-xl font-display text-xs font-bold text-left flex items-center gap-2 transition-all ${
                activeTool === 'sql' ? 'bg-[#9b51e0] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Database className="w-4 h-4" /> SQL Formatter
            </button>
            <button
              onClick={() => setActiveTool('markdown')}
              className={`w-full py-3 px-4 rounded-xl font-display text-xs font-bold text-left flex items-center gap-2 transition-all ${
                activeTool === 'markdown' ? 'bg-[#9b51e0] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" /> Markdown to HTML
            </button>
          </div>
        </div>

        {/* Right Side: Tool Workspace */}
        <div className="lg:col-span-9">
          
          {/* TOOL: JSON FORMATTER */}
          {activeTool === 'json' && (
            <div className="glass-panel p-6 rounded-2xl space-y-4 fade-in">
              <h3 className="text-sm font-bold text-white flex items-center gap-1">
                <Code className="w-4 h-4 text-[#00f2fe]" /> JSON Beautifier & Validator
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Input Raw JSON</span>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="w-full h-[220px] bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 font-mono text-xs leading-relaxed text-gray-300 focus:outline-none focus:border-cyan-800/50 resize-none"
                    placeholder="Paste unformatted JSON here..."
                  />
                  <button onClick={formatJSON} className="w-full py-2.5 bg-gradient-to-r from-[#9b51e0] to-[#00f2fe] text-white font-display text-xs font-bold rounded-xl">
                    Format & Beautify
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Formatted Result</span>
                    {jsonOutput && (
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(jsonOutput);
                          setJsonCopied(true);
                          setTimeout(() => setJsonCopied(false), 2000);
                        }}
                        className="p-1 hover:bg-slate-800/40 text-gray-400 hover:text-white rounded"
                      >
                        {jsonCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                  
                  <div className="w-full h-[220px] bg-slate-950/40 border border-slate-800/40 rounded-xl p-4 font-mono text-xs leading-relaxed text-gray-300 overflow-y-auto whitespace-pre">
                    {jsonOutput ? jsonOutput : jsonError ? <span className="text-rose-400 font-bold">{jsonError}</span> : <span className="text-gray-600">Beautified JSON will output here...</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOOL: BASE64 TRANSCODER */}
          {activeTool === 'base64' && (
            <div className="glass-panel p-6 rounded-2xl space-y-4 fade-in">
              <h3 className="text-sm font-bold text-white flex items-center gap-1">
                <Binary className="w-4 h-4 text-[#00f2fe]" /> Base64 Encoder & Decoder
              </h3>

              <div className="space-y-4">
                <div className="flex bg-slate-950/80 rounded-lg overflow-hidden border border-slate-800 p-0.5 font-bold text-[10px] w-max">
                  <button onClick={() => setB64Mode('encode')} className={`px-4 py-1.5 rounded-md transition-colors ${b64Mode === 'encode' ? 'bg-[#9b51e0] text-white' : 'text-gray-400'}`}>Encode Text</button>
                  <button onClick={() => setB64Mode('decode')} className={`px-4 py-1.5 rounded-md transition-colors ${b64Mode === 'decode' ? 'bg-[#9b51e0] text-white' : 'text-gray-400'}`}>Decode Base64</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Input Text</span>
                    <textarea value={b64Input} onChange={(e) => setB64Input(e.target.value)} className="w-full h-[150px] bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 font-mono text-xs leading-relaxed text-gray-300 focus:outline-none focus:border-cyan-800/50 resize-none" />
                    <button onClick={processBase64} className="w-full py-2.5 bg-gradient-to-r from-[#9b51e0] to-[#00f2fe] text-white font-display text-xs font-bold rounded-xl">
                      {b64Mode === 'encode' ? 'Encode to Base64' : 'Decode Base64'}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Result</span>
                      {b64Output && (
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(b64Output);
                            setB64Copied(true);
                            setTimeout(() => setB64Copied(false), 2000);
                          }}
                          className="p-1 hover:bg-slate-800/40 text-gray-400 hover:text-white rounded"
                        >
                          {b64Copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                    
                    <div className="w-full h-[190px] bg-slate-950/40 border border-slate-800/40 rounded-xl p-4 font-mono text-xs leading-relaxed text-gray-300 overflow-y-auto whitespace-pre-wrap select-all">
                      {b64Output ? b64Output : <span className="text-gray-600">Output will render here...</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOOL: REGEX GENERATOR */}
          {activeTool === 'regex' && (
            <div className="glass-panel p-6 rounded-2xl space-y-4 fade-in">
              <h3 className="text-sm font-bold text-white flex items-center gap-1">
                <Search className="w-4 h-4 text-[#00f2fe]" /> Interactive Regex Builder
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Select Target Match</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleRegexSelect('email')} className={`py-3 rounded-xl border text-xs font-bold transition-colors ${regexQuery === 'email' ? 'border-[#00f2fe] bg-cyan-950/30 text-white' : 'border-slate-800 text-gray-400'}`}>Email Address</button>
                    <button onClick={() => handleRegexSelect('phone')} className={`py-3 rounded-xl border text-xs font-bold transition-colors ${regexQuery === 'phone' ? 'border-[#9b51e0] bg-purple-950/30 text-white' : 'border-slate-800 text-gray-400'}`}>Phone Number</button>
                    <button onClick={() => handleRegexSelect('url')} className={`py-3 rounded-xl border text-xs font-bold transition-colors ${regexQuery === 'url' ? 'border-[#00f2fe] bg-cyan-950/30 text-white' : 'border-slate-800 text-gray-400'}`}>URL Protocols</button>
                    <button onClick={() => handleRegexSelect('digits')} className={`py-3 rounded-xl border text-xs font-bold transition-colors ${regexQuery === 'digits' ? 'border-[#9b51e0] bg-purple-950/30 text-white' : 'border-slate-800 text-gray-400'}`}>Strict Digits</button>
                  </div>
                </div>

                <div className="glass-panel bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-[#00f2fe] uppercase tracking-wider">Compiled Expression</span>
                    <div className="font-mono text-xs text-white bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                      <span className="overflow-x-auto whitespace-nowrap scrollbar-none">{regexOutput}</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(regexOutput);
                          setRegexCopied(true);
                          setTimeout(() => setRegexCopied(false), 2000);
                        }}
                        className="ml-2 text-gray-400 hover:text-white shrink-0"
                      >
                        {regexCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-gray-500 font-bold uppercase text-[9px]">Explanation:</span>
                    <p className="text-gray-400 leading-relaxed">{regexExplanation}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOOL: SQL FORMATTER */}
          {activeTool === 'sql' && (
            <div className="glass-panel p-6 rounded-2xl space-y-4 fade-in">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Database className="w-4.5 h-4.5 text-[#00f2fe]" /> SQL Indenter & Beautifier
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Raw SQL Query</span>
                  <textarea
                    value={sqlInput}
                    onChange={(e) => setSqlInput(e.target.value)}
                    className="w-full h-[180px] bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 font-mono text-xs leading-relaxed text-gray-300 focus:outline-none focus:border-cyan-800/50 resize-none"
                  />
                  <button onClick={formatSQL} className="w-full py-2.5 bg-gradient-to-r from-[#9b51e0] to-[#00f2fe] text-white font-display text-xs font-bold rounded-xl">
                    Format SQL
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Beautified Result</span>
                    {sqlOutput && (
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(sqlOutput);
                          setSqlCopied(true);
                          setTimeout(() => setSqlCopied(false), 2000);
                        }}
                        className="p-1 hover:bg-slate-800/40 text-gray-400 hover:text-white rounded"
                      >
                        {sqlCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                  
                  <div className="w-full h-[180px] bg-slate-950/40 border border-slate-800/40 rounded-xl p-4 font-mono text-xs leading-relaxed text-gray-300 overflow-y-auto whitespace-pre">
                    {sqlOutput ? sqlOutput : <span className="text-gray-600">Beautified SQL will output here...</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOOL: MARKDOWN TO HTML */}
          {activeTool === 'markdown' && (
            <div className="glass-panel p-6 rounded-2xl space-y-4 fade-in">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4.5 h-4.5 text-[#00f2fe]" /> Markdown to HTML Translator
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Markdown Editor</span>
                  <textarea
                    value={mdInput}
                    onChange={(e) => setMdInput(e.target.value)}
                    className="w-full h-[180px] bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 font-mono text-xs leading-relaxed text-gray-300 focus:outline-none focus:border-cyan-800/50 resize-none"
                  />
                  <button onClick={convertMarkdown} className="w-full py-2.5 bg-gradient-to-r from-[#9b51e0] to-[#00f2fe] text-white font-display text-xs font-bold rounded-xl">
                    Compile Markdown
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Compiled HTML Markup</span>
                    {mdOutput && (
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(mdOutput);
                          setMdCopied(true);
                          setTimeout(() => setMdCopied(false), 2000);
                        }}
                        className="p-1 hover:bg-slate-800/40 text-gray-400 hover:text-white rounded"
                      >
                        {mdCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                  
                  <div className="w-full h-[180px] bg-slate-950/40 border border-slate-800/40 rounded-xl p-4 font-mono text-xs leading-relaxed text-gray-300 overflow-y-auto whitespace-pre-wrap">
                    {mdOutput ? mdOutput : <span className="text-gray-600">Compiled HTML will render here...</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
