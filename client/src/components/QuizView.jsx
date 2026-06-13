import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, ChevronRight, ChevronLeft, CheckCircle, XCircle, Trophy } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function QuizView() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState({});
  const [questionTime, setQuestionTime] = useState(null);
  const [globalTime, setGlobalTime] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  // Single ref to manage the question timer cleanly
  const timerRef = useRef(null);

  // Fetch quiz
  useEffect(() => {
    fetch(`${API_BASE}/student/quiz/${code}`)
      .then(res => {
        if (!res.ok) throw new Error('Code invalide ou quiz introuvable.');
        return res.json();
      })
      .then(data => {
        setQuiz(data.quiz);
        setGlobalTime(data.quiz.duration * 60);
      })
      .catch(err => setFetchError(err.message))
      .finally(() => setLoading(false));
  }, [code]);

  const currentQuestion = quiz?.questions[currentIdx];
  const isLastQuestion  = quiz ? currentIdx === quiz.questions.length - 1 : false;
  const isTimeLow       = questionTime <= 5;
  const currentSelected = currentQuestion ? (selected[currentQuestion.id] ?? new Set()) : new Set();
  const canGoNext       = questionTime <= 0;

  // Global timer
  useEffect(() => {
    if (!quiz || submitted) return;
    if (globalTime <= 0) { handleSubmit(); return; }
    const t = setInterval(() => setGlobalTime(g => Math.max(0, g - 1)), 1000);
    return () => clearInterval(t);
  }, [quiz, submitted, globalTime]);

  // Question timer — single useEffect with ref, starts when quiz loads or question changes
  useEffect(() => {
    if (!currentQuestion) return;

    // Clear previous timer
    if (timerRef.current) clearInterval(timerRef.current);

    // Reset time for this question
    const newTime = currentQuestion.time ?? 30;
    setQuestionTime(newTime);

    // Start countdown
    timerRef.current = setInterval(() => {
      setQuestionTime(q => {
        if (q <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return q - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIdx, quiz]);

  const handleSelect = (optionText) => {
    const qId = currentQuestion.id;
    setSelected(prev => {
      const current = new Set(prev[qId] ?? []);
      let isMulti = false;
      try { isMulti = Array.isArray(JSON.parse(currentQuestion.correct_answer)); } catch {}
      if (isMulti) {
        current.has(optionText) ? current.delete(optionText) : current.add(optionText);
      } else {
        current.clear();
        current.add(optionText);
      }
      return { ...prev, [qId]: new Set(current) };
    });
  };

  const handleNext = () => {
    if (!canGoNext) return;
    if (!isLastQuestion) {
      setCurrentIdx(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpent = globalTime !== null
      ? formatTime((quiz.duration * 60) - globalTime)
      : '00:00';

    const answers = {};
    Object.entries(selected).forEach(([qId, set]) => {
      answers[qId] = [...set];
    });

    fetch(`${API_BASE}/student/quiz/${code}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, time_spent: timeSpent }),
    })
      .then(res => res.json())
      .then(data => setResult(data))
      .catch(() => setResult({
        success: false,
        score: 0,
        correct_answers: 0,
        total_questions: quiz?.questions?.length ?? 0,
      }));
  };

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const answeredCount = Object.values(selected).filter(s => s.size > 0).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <p className="text-gray-500 text-lg">Chargement du quiz...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
        <AlertCircle className="size-12 text-red-400" />
        <p className="text-red-500 text-lg font-semibold">{fetchError}</p>
        <button
          onClick={() => navigate('/student-dashboard')}
          className="px-6 py-3 bg-[#2563EB] text-white rounded-2xl font-bold"
        >
          Retour au tableau de bord
        </button>
      </div>
    );
  }

  if (result) {
    const score   = result.score ?? 0;
    const correct = result.correct_answers ?? 0;
    const total   = result.total_questions ?? 0;
    const wrong   = total - correct;
    const isGood  = score >= 50;

    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-lg p-10 max-w-md w-full text-center">
          <div className={`size-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isGood ? 'bg-green-100' : 'bg-red-100'}`}>
            <Trophy className={`size-10 ${isGood ? 'text-green-500' : 'text-red-400'}`} />
          </div>
          <h1 className="text-2xl font-black text-[#1E293B] mb-2">Quiz Terminé !</h1>
          <p className="text-gray-500 mb-8">Voici votre résultat pour le code <span className="font-mono font-bold text-[#2563EB]">{code}</span></p>
          <div className={`text-6xl font-black mb-2 ${isGood ? 'text-green-500' : 'text-red-500'}`}>
            {score}%
          </div>
          <p className="text-gray-400 mb-8">{correct} / {total} bonnes réponses</p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-green-50 rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle className="size-6 text-green-500 flex-shrink-0" />
              <div className="text-left">
                <p className="text-2xl font-black text-green-600">{correct}</p>
                <p className="text-sm text-green-700">Correctes</p>
              </div>
            </div>
            <div className="bg-red-50 rounded-2xl p-4 flex items-center gap-3">
              <XCircle className="size-6 text-red-400 flex-shrink-0" />
              <div className="text-left">
                <p className="text-2xl font-black text-red-500">{wrong}</p>
                <p className="text-sm text-red-600">Incorrectes</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/student-dashboard')}
            className="w-full py-4 bg-[#2563EB] text-white rounded-2xl font-bold text-lg hover:bg-[#1D4ED8] transition-colors"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  let isMultiAnswer = false;
  try { isMultiAnswer = Array.isArray(JSON.parse(currentQuestion.correct_answer)); } catch {}

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-[#1E293B]">{quiz.title}</h1>
          <p className="text-sm text-gray-500">Code : {code} · Session Étudiant</p>
        </div>
        <div className="bg-[#EEF2FF] text-[#4F46E5] px-4 py-2 rounded-2xl flex items-center gap-2 font-bold font-mono">
          <Clock className="size-5" /> {formatTime(globalTime)}
        </div>
      </header>

      <div className="max-w-4xl mx-auto mt-6 px-6">
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#2563EB] h-full transition-all duration-500"
            style={{ width: `${((currentIdx + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 font-medium">
          Question {currentIdx + 1} sur {quiz.questions.length} · {answeredCount} réponse{answeredCount > 1 ? 's' : ''} donnée{answeredCount > 1 ? 's' : ''}
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
              style={{ width: `${(questionTime / (currentQuestion.time ?? 30)) * 100}%` }}
            />
          </div>
          {isTimeLow && (
            <div className="flex items-center gap-2 text-red-500 text-sm mt-3 font-bold">
              <AlertCircle className="size-4" /> Temps presque écoulé !
            </div>
          )}
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 p-10 shadow-sm min-h-[350px]">
          <h2 className="text-2xl font-bold text-[#1E293B] mb-10">{currentQuestion.question_text}</h2>
          <div className="grid gap-4">
            {(currentQuestion.options ?? []).map((opt, i) => {
              const isSelected = currentSelected.has(opt);
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(opt)}
                  className={`flex items-center gap-5 p-5 rounded-2xl border-2 transition-all ${
                    isSelected ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-gray-50 bg-[#FBFDFF]'
                  }`}
                >
                  <div className={`size-6 flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
                    isMultiAnswer ? 'rounded-lg' : 'rounded-full'
                  } ${isSelected ? 'border-[#2563EB] bg-[#2563EB]' : 'border-gray-300'}`}>
                    {isSelected && <div className="size-2 bg-white rounded-sm" />}
                  </div>
                  <span className={`text-lg ${isSelected ? 'font-bold text-[#1E293B]' : 'text-gray-600'}`}>
                    {opt}
                  </span>
                </button>
              );
            })}
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
              <>{isLastQuestion ? 'Terminer' : 'Suivant'} <ChevronRight className="size-5" /></>
            ) : (
              <>Attendez {questionTime}s <ChevronRight className="size-5" /></>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
