/**
 * QuizGenTool: Create MCQ and short answer quizzes
 * Auto-generate questions from study material
 */

import React, { useState } from 'react';
import { Loader, Download, Plus } from 'lucide-react';
import { useVernytTool } from '../../hooks/useVernytTool';

export default function QuizGenTool({ isPro, onProcess, onUsage, onUpgradeRequired }) {
  const tool = useVernytTool('quiz-gen');
  const [inputText, setInputText] = useState('');
  const [quizType, setQuizType] = useState('mcq');
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const quizTypes = [
    { id: 'mcq', label: 'Multiple Choice' },
    { id: 'short', label: 'Short Answer' },
    { id: 'mixed', label: 'Mixed', pro: true }
  ];

  const generateQuiz = async () => {
    if (!inputText.trim()) return;

    const selectedType = quizTypes.find((t) => t.id === quizType);
    if (selectedType.pro && !isPro) {
      onUpgradeRequired?.({ type: 'pro_required' });
      return;
    }

    if (!tool.checkPermission('generate_quiz', { length: inputText.length, questionCount })) {
      onUpgradeRequired?.(tool.error);
      return;
    }

    setIsProcessing(true);
    try {
      tool.logUsage({ length: inputText.length, type: quizType, questionCount });

      const model = await tool.loadModel('quiz-gen');
      if (!model) return;

      // Mock quiz questions
      const mockQuestions = [
        {
          id: 1,
          type: 'mcq',
          question: 'What is the primary source of energy for most living organisms?',
          options: ['The sun', 'Geothermal energy', 'Chemical reactions only', 'Wind'],
          correctAnswer: 'The sun'
        },
        {
          id: 2,
          type: 'short',
          question: 'Explain the process of photosynthesis in 2-3 sentences.',
          answer: 'Plants convert light energy into chemical energy stored in glucose.'
        },
        {
          id: 3,
          type: 'mcq',
          question: 'Which organelle is responsible for producing energy in cells?',
          options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Chloroplast'],
          correctAnswer: 'Mitochondria'
        }
      ];

      setQuestions(mockQuestions.slice(0, questionCount));
      await tool.saveResult(`quiz-${Date.now()}`, {
        type: quizType,
        questions: mockQuestions.slice(0, questionCount)
      });

      onProcess?.(mockQuestions);
    } catch (err) {
      console.error('Quiz generation error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadQuiz = () => {
    const content = questions
      .map(
        (q) =>
          `Question ${q.id}: ${q.question}\n${
            q.type === 'mcq'
              ? `Options: ${q.options.join(', ')}\nCorrect Answer: ${q.correctAnswer}`
              : `[Student Answer Space]\nModel Answer: ${q.answer}`
          }\n`
      )
      .join('\n---\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-${quizType}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Quiz Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Quiz Type</label>
        <div className="grid grid-cols-3 gap-2">
          {quizTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setQuizType(type.id)}
              disabled={type.pro && !isPro}
              className={`px-3 py-2 rounded font-medium transition text-sm ${
                quizType === type.id
                  ? 'bg-blue-600 text-white'
                  : type.pro && !isPro
                    ? 'bg-gray-700 text-gray-500 opacity-50 cursor-not-allowed'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {type.label}
              {type.pro && !isPro && ' 🔒'}
            </button>
          ))}
        </div>
      </div>

      {/* Question Count */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Number of Questions</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="3"
            max={isPro ? 50 : 10}
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-gray-200 font-bold w-12 text-center">{questionCount}</span>
        </div>
      </div>

      {/* Study Material */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Study Material</label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your study notes or textbook content..."
          className="w-full h-40 px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500"
        />
      </div>

      {/* Processing */}
      {isProcessing && (
        <div className="bg-gray-800 rounded p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin text-blue-400" />
            <span className="text-gray-300">Generating {questionCount} questions...</span>
          </div>
          <div className="w-full bg-gray-700 rounded h-2">
            <div
              className="bg-blue-500 h-2 rounded transition-all"
              style={{ width: `${tool.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Quiz Preview */}
      {questions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-300">Quiz Preview ({questions.length} questions)</label>
            <button
              onClick={downloadQuiz}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {questions.map((q) => (
              <div key={q.id} className="bg-gray-800 border border-gray-700 rounded p-4">
                <p className="text-sm text-gray-400 font-mono mb-2">Question {q.id}</p>
                <p className="text-gray-200 font-medium mb-3">{q.question}</p>

                {q.type === 'mcq' && (
                  <div className="space-y-2">
                    {q.options.map((option, idx) => (
                      <label key={idx} className="flex items-center gap-2 text-gray-300">
                        <input type="radio" name={`q${q.id}`} className="accent-blue-500" />
                        {option}
                      </label>
                    ))}
                  </div>
                )}

                {q.type === 'short' && (
                  <div className="bg-gray-700 rounded p-2 text-gray-400 text-sm italic">
                    [Space for student answer]
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      {inputText.trim() && questions.length === 0 && !isProcessing && (
        <button
          onClick={generateQuiz}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Generate Quiz
        </button>
      )}

      {/* Pro Badge */}
      {!isPro && (
        <div className="bg-amber-900 border border-amber-700 text-amber-200 px-4 py-3 rounded">
          <p className="font-medium">🔒 Pro Feature</p>
          <p className="text-sm mt-1">Mixed question types and up to 50 questions</p>
        </div>
      )}
    </div>
  );
}

QuizGenTool.defaultProps = {
  isPro: false,
  onProcess: null,
  onUsage: null,
  onUpgradeRequired: null
};
