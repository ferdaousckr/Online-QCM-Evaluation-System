import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';

const mockQuiz = {
  title: 'Quiz de Mathématiques',
  questions: [
    {
      id: 1,
      text: 'Quelle est la dérivée de x² ?',
      options: ['2x', 'x', '2x²', 'x²/2'],
      timeLimit: 30,
    },
    {
      id: 2,
      text: 'Quelles sont les villes françaises ? (plusieurs réponses possibles)',
      options: ['Lyon', 'Marseille', 'Paris', 'Londres'],
      timeLimit: 45,
    },
  ],
};

export default function QuizView() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState({});
  const [questionTime, setQuestionTime] = useState(mockQuiz.questions[0].timeLimit);
  const [globalTime, setGlobalTime] = useState(30 * 60);

  const currentQuestion = mockQuiz.questions[currentIdx];
  const isLastQuestion = currentIdx === mockQuiz.questions.length - 1;
  const isTimeLow = questionTime <= 5;
  
  // The button is disabled as long as there is time remaining
  const canGoNext = questionTime <= 0;

  // Global Timer
  useEffect(() => {
    const timer = setInterval(() => setGlobalTime(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Reset question timer when index changes
  useEffect(() => {
    setQuestionTime(currentQuestion.timeLimit);
  }, [currentIdx]);

  // Question Timer Logic
  useEffect(() => {
    if (questionTime <= 0) return; // Stop at 0 so the button enables
    
    const timer = setInterval(() => {
      setQuestionTime(t => t - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [questionTime]);

  const handleNext = () => {
    if (canGoNext) {
      if (!isLastQuestion) {
        setCurrentIdx(prev => prev + 1);
      } else {
        alert("Quiz terminé !");
      }
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-[#1E293B]">{mockQuiz.title}</h1>
          <p className="text-sm text-gray-500">Projet QCM - Session Étudiant</p>
        </div>
        <div className="bg-[#EEF2FF] text-[#4F46E5] px-4 py-2 rounded-2xl flex items-center gap-2 font-bold font-mono">
          <Clock className="size-5" /> {formatTime(globalTime)}
        </div>
      </header>

      {/* Main Progress Bar */}
      <div className="max-w-4xl mx-auto mt-6 px-6">
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-[#2563EB] h-full transition-all duration-500" 
            style={{ width: `${((currentIdx + 1) / mockQuiz.questions.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 font-medium">
          Question {currentIdx + 1} sur {mockQuiz.questions.length} • 0 réponse donnée
        </p>
      </div>

      <main className="max-w-4xl mx-auto p-6">

        <div className={`mb-6 p-5 rounded-2xl border-2 transition-all ${
          isTimeLow ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100 shadow-sm'
        }`}>
          <div className="flex justify-between items-center mb-3">
            <div className={`flex items-center gap-2 ${isTimeLow ? 'text-red-600' : 'text-[#2563EB]'}`}>
              <Clock className="size-5" />
              <span className="font-bold">Temps pour cette question</span>
            </div>
            <span className={`text-2xl font-black ${isTimeLow ? 'text-red-600' : 'text-[#2563EB]'}`}>
              {questionTime}s
            </span>
          </div>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${isTimeLow ? 'bg-red-500' : 'bg-[#2563EB]'}`}
              style={{ width: `${(questionTime / currentQuestion.timeLimit) * 100}%` }}
            />
          </div>
          {isTimeLow && (
            <div className="flex items-center gap-2 text-red-500 text-sm mt-3 font-bold">
              <AlertCircle className="size-4" /> Temps presque écoulé !
            </div>
          )}
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 p-10 shadow-sm min-h-[350px]">
          <h2 className="text-2xl font-bold text-[#1E293B] mb-10">{currentQuestion.text}</h2>
          <div className="grid gap-4">
            {currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected({...selected, [currentQuestion.id]: i})}
                className={`flex items-center gap-5 p-5 rounded-2xl border-2 transition-all ${
                  selected[currentQuestion.id] === i ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-gray-50 bg-[#FBFDFF]'
                }`}
              >
                <div className={`size-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                  selected[currentQuestion.id] === i ? 'border-[#2563EB] bg-[#2563EB]' : 'border-gray-300'
                }`}>
                  {selected[currentQuestion.id] === i && <div className="size-2 bg-white rounded-sm" />}
                </div>
                <span className={`text-lg ${selected[currentQuestion.id] === i ? 'font-bold text-[#1E293B]' : 'text-gray-600'}`}>
                  {opt}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-10">
          <button 
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(prev => prev - 1)}
            className="flex items-center gap-2 px-10 py-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-30"
          >
            <ChevronLeft className="size-5" /> Précédent
          </button>
          
          <button 
            disabled={!canGoNext}
            onClick={handleNext}
            className={`flex items-center gap-2 px-10 py-4 rounded-2xl font-bold transition-all shadow-lg ${
              canGoNext 
                ? 'bg-[#2563EB] text-white shadow-blue-100 hover:bg-[#1D4ED8]' 
                : 'bg-[#CBD5E1] text-[#64748B] cursor-not-allowed shadow-none'
            }`}
          >
            {canGoNext ? (
              <>
                {isLastQuestion ? 'Terminer' : 'Suivant'} <ChevronRight className="size-5" />
              </>
            ) : (
              <>
                Attendez {questionTime}s <ChevronRight className="size-5" />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}