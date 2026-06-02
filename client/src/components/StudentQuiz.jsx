import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock } from 'lucide-react';
import './StudentQuiz.css'; 

const StudentQuiz = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [quizResult, setQuizResult] = useState(null);

  // États du Timer
  const [timeLeft, setTimeLeft] = useState(30); 
  const [initialTime, setInitialTime] = useState(30);
  const [totalSecondsSpent, setTotalSecondsSpent] = useState(0);
  const timerRef = useRef(null);

  // 1. Chargement du Quiz
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/student/quiz/${code}`)
      .then(res => {
        const data = res.data.quiz || res.data;
        setQuiz(data);
        const qList = data.questions || [];
        setQuestions(qList);
        if (qList.length > 0) {
          const t = qList[0].time || 30;
          setTimeLeft(t);
          setInitialTime(t);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur chargement:", err);
        setLoading(false);
      });
  }, [code]);

  // 2. Logique Timer
  useEffect(() => {
    if (loading || quizResult || questions.length === 0) return;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTotalSecondsSpent(prev => prev + 1);
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentQuestionIndex, loading, quizResult, questions]);

  const handleTimeOut = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      const nextTime = questions[nextIndex].time || 30;
      setTimeLeft(nextTime);
      setInitialTime(nextTime);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleOptionSelect = (qId, val) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      const nextTime = questions[nextIndex].time || 30;
      setTimeLeft(nextTime);
      setInitialTime(nextTime);
    }
  };

  // 3. Soumission avec sécurité intégrée
  const handleSubmitQuiz = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    const minutes = Math.floor(totalSecondsSpent / 60);
    const seconds = totalSecondsSpent % 60;
    const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/student/quiz/${code}/submit`, {
        answers,
        time_spent: timeStr,
        student_name: "Étudiant"
      });

      setQuizResult(response.data);
    } catch (error) {
      console.error("Erreur lors de la soumission API:", error);
      // Mode secours : On force l'affichage du résultat même si le serveur échoue
      alert("Erreur serveur, calcul des résultats locaux...");
      setQuizResult({
        score: 0,
        correct_answers: 0,
        total_questions: questions.length,
        time_spent: timeStr,
        error_mode: true
      });
    }
  };

  if (loading) return <div>Chargement...</div>;

  // 4. Rendu de l'écran des résultats
  if (quizResult) {
    return (
      <div className="quiz-result-page-container">
        <div className="quiz-result-main-card">
          <h1 className="figma-result-title">Quiz Terminé !</h1>
          <div className="figma-score-hero-banner">
            <h2 className="figma-score-percentage-display">{quizResult.score || 0}%</h2>
            <p>{quizResult.correct_answers} / {quizResult.total_questions} bonnes réponses</p>
          </div>
          <button onClick={() => navigate('/')}>Retour accueil</button>
        </div>
      </div>
    );
  }

  // 5. Rendu de la question active
  const currentQuestion = questions[currentQuestionIndex];
  return (
    <div className="quiz-active-container">
      <h1>{quiz?.title}</h1>
      <div className="question-timer-card-banner">
        <span>Temps: {timeLeft}s</span>
        <div className="timer-horizontal-bar-bg">
          <div className="timer-horizontal-bar-fill" style={{ width: `${(timeLeft/initialTime)*100}%` }} />
        </div>
      </div>

      {currentQuestion && (
        <div className="quiz-question-card">
          <h2>{currentQuestion.text || currentQuestion.question_text}</h2>
          <div className="quiz-options-grid">
            {(Array.isArray(currentQuestion.options) ? currentQuestion.options : JSON.parse(currentQuestion.options || "[]")).map((opt, i) => (
              <div key={i} className={`quiz-option-item ${answers[currentQuestion.id] === opt ? 'selected' : ''}`} onClick={() => handleOptionSelect(currentQuestion.id, opt)}>
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={currentQuestionIndex < questions.length - 1 ? handleNextQuestion : handleSubmitQuiz}>
        {currentQuestionIndex < questions.length - 1 ? "Suivant" : "Soumettre"}
      </button>
    </div>
  );
};

export default StudentQuiz;