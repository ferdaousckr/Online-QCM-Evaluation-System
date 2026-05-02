import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, LogOut, Play } from 'lucide-react';

const mockQuizzes = [
  {
    id: 1,
    title: 'Quiz de Mathématiques',
    description: 'Algèbre et géométrie',
    duration: 30,
    questionsCount: 15,
    status: 'available',
    deadline: '2026-04-10',
  },
  {
    id: 2,
    title: 'Quiz de Physique',
    description: 'Mécanique et thermodynamique',
    duration: 45,
    questionsCount: 20,
    status: 'completed',
    score: 85,
    deadline: '2026-03-28',
  }
];

const MOCK_QUIZZES_BY_CODE = {
  'ABC123': { id: 1, title: 'Quiz de Mathématiques' },
  'XYZ789': { id: 2, title: 'Quiz de Physique' },
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [quizCode, setQuizCode] = useState('');

  const handleJoinQuiz = (e) => {
  e.preventDefault();
  const upperCode = quizCode.toUpperCase().trim();
  
  if (!upperCode) {
    alert("Veuillez entrer un code.");
    return;
  }
  
  navigate(`/student/quiz/${upperCode}`);
};

  const getStatusBadge = (quiz) => {
    switch (quiz.status) {
      case 'available':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700">
            <Play className="size-4 mr-1" />
            À faire
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700">
            <CheckCircle className="size-4 mr-1" />
            Terminé ({quiz.score}%)
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700">
            <XCircle className="size-4 mr-1" />
            Expiré
          </span>
        );
      default:
        return null;
    }
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
                  onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono text-lg tracking-widest text-center"
                  maxLength={6}
                />
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
          {mockQuizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{quiz.title}</h3>
                  <p className="text-gray-600">{quiz.description}</p>
                </div>
                {getStatusBadge(quiz)}
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="size-4" />
                  {quiz.duration} min
                </div>
                <div>{quiz.questionsCount} questions</div>
                {quiz.deadline && <div>Limite: {new Date(quiz.deadline).toLocaleDateString('fr-FR')}</div>}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}