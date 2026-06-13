import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, LogOut, Play } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [quizCode, setQuizCode] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Fetch student history from results table
  useEffect(() => {
    const userId = localStorage.getItem('user_id') ?? 1;
    fetch(`${API_BASE}/student/history?user_id=${userId}`)
      .then(res => res.json())
      .then(data => setHistory(Array.isArray(data) ? data : []))
      .catch(() => setHistory([]))
      .finally(() => setLoadingHistory(false));
  }, []);

  const handleJoinQuiz = (e) => {
    e.preventDefault();
    const upperCode = quizCode.toUpperCase().trim();

    if (!upperCode) {
      setError('Veuillez entrer un code.');
      return;
    }
    if (upperCode.length < 4) {
      setError('Le code doit contenir au moins 4 caractères.');
      return;
    }

    setError('');
    navigate(`/student/quiz/${upperCode}`);
  };

  const getStatusBadge = (quiz) => {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700">
        <CheckCircle className="size-4 mr-1" />
        {quiz.score_sur_20}/20
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800">Tableau de Bord Étudiant</h1>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="size-5" />
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-6 text-center">Rejoindre un nouveau Quiz</h2>
          <form onSubmit={handleJoinQuiz} className="max-w-2xl mx-auto">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label htmlFor="quiz-code-main" className="block text-sm text-gray-700 mb-2">
                  Entrez le code unique fourni par votre professeur
                </label>
                <input
                  id="quiz-code-main"
                  type="text"
                  value={quizCode}
                  onChange={(e) => {
                    setQuizCode(e.target.value.toUpperCase());
                    setError('');
                  }}
                  placeholder="ABC123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono text-lg tracking-widest text-center"
                  maxLength={6}
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap font-semibold"
              >
                Rejoindre
              </button>
            </div>
          </form>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Mon Historique</h2>
          <p className="text-gray-500">Consultez vos performances passées</p>
        </div>

        <div className="grid gap-4">
          {loadingHistory ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
              Chargement...
            </div>
          ) : history.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
              Aucun quiz complété pour le moment.
            </div>
          ) : (
            history.map((quiz) => (
              <div key={quiz.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{quiz.title}</h3>
                    <p className="text-gray-600">{quiz.description}</p>
                  </div>
                  {getStatusBadge(quiz)}
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div>{quiz.correct_answers}/{quiz.total_questions} réponses correctes</div>
                  <div>{quiz.date}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
