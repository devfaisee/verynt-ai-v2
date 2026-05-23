import React, { useState } from 'react';
import { GraduationCap, Award, HelpCircle, Check, X, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function StudentTools() {
  const { incrementUsage } = useApp();
  const [activeTool, setActiveTool] = useState('flashcards'); // 'flashcards', 'quiz'
  
  // 1. Flashcards States
  const [flipped, setFlipped] = useState({});
  const [currentDeck, setCurrentDeck] = useState('biology');
  
  // Flashcard decks
  const decks = {
    biology: [
      { id: 1, front: "What is the powerhouse of the cell?", back: "The Mitochondria. It generates chemical energy in the form of ATP." },
      { id: 2, front: "What is photosynthesis?", back: "The process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar." },
      { id: 3, front: "What are enzymes?", back: "Proteins that act as biological catalysts, accelerating chemical reactions without being consumed." }
    ],
    history: [
      { id: 1, front: "When did World War I start?", back: "July 28, 1914. Initiated after the assassination of Franz Ferdinand." },
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

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Title */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-[#00f2fe]" /> Verynt Student Workspace
        </h2>
        <p className="text-sm text-gray-400">
          Privacy-first study tools. Active flashcards and interactive quiz compilers. 100% client-side.
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
              <HelpCircle className="w-4 h-4" /> AI Flashcards
            </button>
            <button
              onClick={() => setActiveTool('quiz')}
              className={`w-full py-3 px-4 rounded-xl font-display text-xs font-bold text-left flex items-center gap-2 transition-all ${
                activeTool === 'quiz' ? 'bg-[#9b51e0] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Award className="w-4 h-4" /> Study Quiz Creator
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
                
                {/* Deck Select */}
                <select 
                  value={currentDeck} 
                  onChange={(e) => { setCurrentDeck(e.target.value); setFlipped({}); }}
                  className="bg-slate-950 border border-slate-800 text-xs font-bold rounded-lg px-3 py-1.5 text-gray-300 focus:outline-none"
                >
                  <option value="biology">Biology Deck</option>
                  <option value="history">History Deck</option>
                </select>
              </div>

              {/* Grid of Flashcards */}
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
                      {/* FRONT OF CARD */}
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

                      {/* BACK OF CARD */}
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
                      <button 
                        onClick={handleNextQuestion}
                        className="btn-primary text-xs"
                      >
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

                  <button 
                    onClick={resetQuiz}
                    className="btn-primary text-xs flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" /> Try Again
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
