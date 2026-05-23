import React, { useState, useRef, useEffect } from 'react';
import { GraduationCap, Award, HelpCircle, Check, X, RefreshCw, Bookmark, Plus } from 'lucide-react';

export default function StudentTools({ incrementUsage }) {
  const [activeTool, setActiveTool] = useState('flashcards'); // 'flashcards', 'quiz', 'citation', 'math'
  
  // 1. Flashcards States
  const [flipped, setFlipped] = useState({});
  const [currentDeck, setCurrentDeck] = useState('biology');
  
  const decks = {
    biology: [
      { id: 1, front: "What is the powerhouse of the cell?", back: "The Mitochondria. It generates chemical energy in the form of ATP." },
      { id: 2, front: "What is photosynthesis?", back: "The process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar." },
      { id: 3, front: "What are enzymes?", back: "Proteins that act as biological catalysts, accelerating chemical reactions without being consumed." }
    ],
    history: [
      { id: 1, front: "When did World War I start?", back: "July 28, 1914. Initiated after the assassination of Archduke Franz Ferdinand." },
      { id: 2, front: "Who was the first President of the United States?", back: "George Washington. Served from April 30, 1789, to March 4, 1797." }
    ]
  };

  // 2. Quiz States
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const quizQuestions = [
    {
      question: "Which web standard enables browser hardware graphics acceleration for client-side AI?",
      options: ["WebAssembly", "WebGPU", "WebGL 1.0", "ActiveX"],
      answer: 1,
      explain: "WebGPU provides high-performance access to physical GPU hardware directly in modern web browsers."
    },
    {
      question: "Where are files processed when utilizing the Verynt offline suite?",
      options: ["Cloud servers", "AWS Clusters", "Locally in your browser", "Stripe portal"],
      answer: 2,
      explain: "Verynt runs models 100% locally in browser memory; no data ever leaves the device."
    }
  ];

  // 3. Citation States
  const [author, setAuthor] = useState('Jane Doe');
  const [title, setTitle] = useState('Introduction to Local WebGPU Systems');
  const [year, setYear] = useState('2026');
  const [publisher, setPublisher] = useState('Verynt AI Press');
  const [citationOutput, setCitationOutput] = useState('');
  const [activeFormat, setActiveFormat] = useState('apa'); // 'apa', 'mla', 'chicago'

  // 4. Math Grapher States
  const [equation, setEquation] = useState('2x - 1'); // y = 2x - 1
  const canvasRef = useRef(null);

  const handleCardClick = (id) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
    incrementUsage();
  };

  const handleAnswerSubmit = (index) => {
    setSelectedAnswer(index);
    if (index === quizQuestions[currentQuestion].answer) {
      setScore(prev => prev + 1);
    }
    incrementUsage();
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  // Citation logic
  const generateCitation = () => {
    incrementUsage();
    let format = '';
    const lName = author.split(' ').pop() || '';
    const fInit = author.charAt(0) || '';

    if (activeFormat === 'apa') {
      format = `${lName}, ${fInit}. (${year}). ${title}. ${publisher}.`;
    } else if (activeFormat === 'mla') {
      format = `${lName}, ${author.split(' ')[0]}. "${title}." ${publisher}, ${year}.`;
    } else {
      format = `${lName}, ${author.split(' ')[0]}. ${title}. ${publisher}, ${year}.`;
    }
    setCitationOutput(format);
  };

  // Math Grapher Canvas Draw logic
  useEffect(() => {
    if (activeTool === 'math' && canvasRef.current) {
      drawMathGraph();
    }
  }, [activeTool, equation]);

  const drawMathGraph = () => {
    incrementUsage();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 20; // 20 pixels per unit

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1.5;
    
    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    
    // Y Axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Parse Linear Equation parameters: e.g. "2x - 1" -> slope=2, intercept=-1
    let slope = 1;
    let intercept = 0;

    try {
      const cleaned = equation.replace(/\s+/g, '');
      const parts = cleaned.split(/x/i);
      
      if (parts[0] === '') slope = 1;
      else if (parts[0] === '-') slope = -1;
      else slope = parseFloat(parts[0]);

      if (parts[1]) {
        intercept = parseFloat(parts[1]);
      }
    } catch (e) {
      slope = 1;
      intercept = 0;
    }

    // Draw Linear Line
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const startX = -centerX / scale;
    const endX = centerX / scale;

    for (let xVal = startX; xVal <= endX; xVal += 0.1) {
      const yVal = slope * xVal + intercept;
      const screenX = centerX + xVal * scale;
      const screenY = centerY - yVal * scale; // inverted Y axis on canvas

      if (xVal === startX) {
        ctx.moveTo(screenX, screenY);
      } else {
        ctx.lineTo(screenX, screenY);
      }
    }
    ctx.stroke();

    // Draw coordinate markers text labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '9px monospace';
    ctx.fillText('x', width - 10, centerY - 5);
    ctx.fillText('y', centerX + 5, 10);
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Title */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-[#00f2fe]" /> Verynt Student Workspace
        </h2>
        <p className="text-sm text-gray-400">
          Privacy-first study tools. Flashcards, Quizzes, Citations, and Math coordinate graphing. 100% offline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar */}
        <div className="lg:col-span-3">
          <div className="glass-panel p-4 rounded-2xl flex flex-col gap-2">
            <button
              onClick={() => setActiveTool('flashcards')}
              className={`w-full py-3 px-4 rounded-xl font-display text-xs font-bold text-left flex items-center gap-2 transition-all ${
                activeTool === 'flashcards' ? 'bg-[#9b51e0] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" /> AI Flashcards
            </button>
            <button
              onClick={() => setActiveTool('quiz')}
              className={`w-full py-3 px-4 rounded-xl font-display text-xs font-bold text-left flex items-center gap-2 transition-all ${
                activeTool === 'quiz' ? 'bg-[#9b51e0] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Award className="w-4 h-4" /> Study Quizzes
            </button>
            <button
              onClick={() => setActiveTool('citation')}
              className={`w-full py-3 px-4 rounded-xl font-display text-xs font-bold text-left flex items-center gap-2 transition-all ${
                activeTool === 'citation' ? 'bg-[#9b51e0] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Bookmark className="w-4 h-4" /> Citation Generator
            </button>
            <button
              onClick={() => setActiveTool('math')}
              className={`w-full py-3 px-4 rounded-xl font-display text-xs font-bold text-left flex items-center gap-2 transition-all ${
                activeTool === 'math' ? 'bg-[#9b51e0] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Plus className="w-4 h-4" /> Math Grapher
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-9">
          
          {/* TOOL: FLASHCARDS */}
          {activeTool === 'flashcards' && (
            <div className="glass-panel p-6 rounded-2xl space-y-4 fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <GraduationCap className="w-4.5 h-4.5 text-[#00f2fe]" /> Local AI Flashcards
                </h3>
                
                <select 
                  value={currentDeck} 
                  onChange={(e) => { setCurrentDeck(e.target.value); setFlipped({}); }}
                  className="bg-slate-950 border border-slate-800 text-xs font-bold rounded-lg px-3 py-1.5 text-gray-300 focus:outline-none"
                >
                  <option value="biology">Biology Deck</option>
                  <option value="history">History Deck</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {decks[currentDeck].map((card) => (
                  <div 
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className="relative h-[180px] w-full cursor-pointer select-none"
                    style={{ perspective: '1000px' }}
                  >
                    <div 
                      className="absolute inset-0 rounded-xl transition-all duration-500 shadow-md transform"
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: flipped[card.id] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                      }}
                    >
                      <div 
                        className="absolute inset-0 bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between"
                        style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                      >
                        <span className="text-[9px] font-bold text-[#00f2fe] uppercase tracking-wider">Question</span>
                        <p className="text-xs text-white leading-relaxed font-semibold text-center my-auto">
                          {card.front}
                        </p>
                        <span className="text-[9px] text-gray-500 text-center font-bold">Click to reveal answer</span>
                      </div>

                      <div 
                        className="absolute inset-0 bg-gradient-to-br from-purple-950/40 to-cyan-950/20 border border-[#9b51e0]/40 rounded-xl p-5 flex flex-col justify-between transform"
                        style={{ 
                          backfaceVisibility: 'hidden', 
                          WebkitBackfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)' 
                        }}
                      >
                        <span className="text-[9px] font-bold text-[#9b51e0] uppercase tracking-wider">Explanation</span>
                        <p className="text-xs text-gray-200 leading-relaxed text-center my-auto">
                          {card.back}
                        </p>
                        <span className="text-[9px] text-[#00f2fe] text-center font-bold">Click to flip back</span>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TOOL: QUIZ HUB */}
          {activeTool === 'quiz' && (
            <div className="glass-panel p-6 rounded-2xl space-y-4 fade-in">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Award className="w-4.5 h-4.5 text-[#00f2fe]" /> Interactive Quiz Workspace
              </h3>

              {!quizFinished ? (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                    <span className="font-bold text-emerald-400">Score: {score}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/40">
                    {quizQuestions[currentQuestion].question}
                  </h4>

                  <div className="space-y-2.5">
                    {quizQuestions[currentQuestion].options.map((option, i) => {
                      const isCorrect = i === quizQuestions[currentQuestion].answer;
                      const isSelected = i === selectedAnswer;
                      
                      let btnStyle = "border-slate-800 text-gray-400 hover:border-slate-700 hover:bg-slate-900/40";
                      if (selectedAnswer !== null) {
                        if (isCorrect) btnStyle = "border-emerald-600 bg-emerald-950/20 text-emerald-400 font-bold";
                        else if (isSelected) btnStyle = "border-rose-600 bg-rose-950/20 text-rose-400";
                        else btnStyle = "border-slate-800 text-gray-600 opacity-50 cursor-not-allowed";
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => selectedAnswer === null && handleAnswerSubmit(i)}
                          disabled={selectedAnswer !== null}
                          className={`w-full p-3.5 border rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${btnStyle}`}
                        >
                          <span>{option}</span>
                          {selectedAnswer !== null && isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                          {selectedAnswer !== null && isSelected && !isCorrect && <X className="w-4 h-4 text-rose-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {selectedAnswer !== null && (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs text-gray-400 space-y-1.5 fade-in">
                      <span className="font-bold uppercase text-[9px] text-[#00f2fe]">AI Explanation:</span>
                      <p>{quizQuestions[currentQuestion].explain}</p>
                    </div>
                  )}

                  {selectedAnswer !== null && (
                    <div className="flex justify-end">
                      <button onClick={handleNextQuestion} className="btn-primary text-xs">
                        Next Question →
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-8 space-y-6 fade-in flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-950 flex items-center justify-center border border-emerald-800 text-emerald-400">
                    <Award className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold font-display text-white">Quiz Finished!</h4>
                    <p className="text-sm text-gray-400">
                      You scored <span className="text-[#00f2fe] font-bold">{score}</span> out of <span className="text-white font-bold">{quizQuestions.length}</span> questions correctly.
                    </p>
                  </div>

                  <button onClick={resetQuiz} className="btn-primary text-xs flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4" /> Try Again
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TOOL: CITATION GENERATOR */}
          {activeTool === 'citation' && (
            <div className="glass-panel p-6 rounded-2xl space-y-6 fade-in">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Bookmark className="w-4.5 h-4.5 text-[#00f2fe]" /> Bibliography & Citation Generator
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-3 bg-slate-950/30 border border-slate-900 p-4 rounded-xl">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Author</label>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-gray-300 focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Book / Source Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-gray-300 focus:outline-none" />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold uppercase">Publish Year</label>
                      <input type="text" value={year} onChange={(e) => setYear(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-gray-300 focus:outline-none" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold uppercase">Publisher</label>
                      <input type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-gray-300 focus:outline-none" />
                    </div>
                  </div>

                  <div className="flex bg-slate-950 border border-slate-850 p-0.5 rounded-lg text-[10px] font-bold">
                    {['apa', 'mla', 'chicago'].map(format => (
                      <button
                        key={format}
                        onClick={() => setActiveFormat(format)}
                        className={`flex-1 py-1 rounded transition-colors uppercase ${activeFormat === format ? 'bg-[#9b51e0] text-white' : 'text-gray-400'}`}
                      >
                        {format}
                      </button>
                    ))}
                  </div>

                  <button onClick={generateCitation} className="btn-primary w-full text-xs justify-center py-2.5">
                    Generate Citation
                  </button>
                </div>

                <div className="glass-panel bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 flex flex-col justify-between min-h-[180px]">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-[#00f2fe] uppercase tracking-wider block">Bibliography String</span>
                    <div className="text-gray-300 font-mono leading-relaxed bg-slate-950 p-3 border border-slate-900 rounded-lg select-all">
                      {citationOutput || <span className="text-gray-600">Generated bibliography will compile here...</span>}
                    </div>
                  </div>
                  {citationOutput && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(citationOutput);
                        alert("Citation copied to clipboard!");
                      }}
                      className="w-full py-2 bg-gradient-to-r from-[#9b51e0] to-[#00f2fe] text-white font-display text-xs font-bold rounded-lg"
                    >
                      Copy Bibliography
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TOOL: MATH GRAPHER */}
          {activeTool === 'math' && (
            <div className="glass-panel p-6 rounded-2xl space-y-6 fade-in">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Plus className="w-4.5 h-4.5 text-[#00f2fe]" /> Math AI Coordinate Grapher
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                
                {/* Equation Inputs */}
                <div className="md:col-span-4 space-y-4 bg-slate-950/30 border border-slate-900 p-4 rounded-xl flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 font-bold uppercase">Enter Linear Equation (y = )</label>
                      <input 
                        type="text" 
                        value={equation} 
                        onChange={(e) => setEquation(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-[#00f2fe] font-mono focus:outline-none"
                        placeholder="e.g. 2x - 1"
                      />
                      <span className="text-[9px] text-gray-500 block leading-normal">
                        Supports linear expressions like `2x - 1`, `-3x + 4`, or `x + 2`.
                      </span>
                    </div>

                    <div className="space-y-1.5 bg-slate-950 p-3 rounded-lg border border-slate-850">
                      <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block">AI Graphing steps</span>
                      <p className="text-[10px] text-gray-400 leading-relaxed">
                        Slope is calculated locally, mapping X values from -10 to 10 onto the HTML5 grid canvas.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Graph Canvas */}
                <div className="md:col-span-8 flex flex-col items-center justify-center">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2 overflow-hidden shadow-inner">
                    <canvas 
                      ref={canvasRef} 
                      width="320" 
                      height="240" 
                      className="rounded-lg bg-black"
                    />
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
