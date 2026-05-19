import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './QuizPreview.css';

const QuizPreview = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Récupère l'ID du quiz depuis l'URL 

  // États pour stocker les vraies données de l'API
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Récupération des données réelles du quiz depuis Laravel
  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        setLoading(true);
        // Appel de ton API Laravel 
        const response = await axios.get(`http://127.0.0.1:8000/api/quizzes/${id}`);
        setQuiz(response.data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des détails du quiz:", err);
        setError("Impossible de charger les détails du quiz.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuizDetails();
    }
  }, [id]);

  // 2. Données statiques des étudiants 
  const students = [
    { id: 1, name: "Sophie Martin", score: "5/5", pct: "100%", time: "2:05", date: "15 avr. 2026 à 10:30" },
    { id: 2, name: "Emma Bernard", score: "5/5", pct: "100%", time: "1:58", date: "15 avr. 2026 à 14:20" },
    { id: 3, name: "Hugo Laurent", score: "5/5", pct: "100%", time: "1:55", date: "17 avr. 2026 à 10:05" },
    { id: 4, name: "Lucas Dubois", score: "4/5", pct: "80%", time: "2:12", date: "15 avr. 2026 à 11:15" },
    { id: 5, name: "Léa Moreau", score: "4/5", pct: "80%", time: "2:08", date: "16 avr. 2026 à 13:10" },
    { id: 6, name: "Thomas Petit", score: "3/5", pct: "60%", time: "2:15", date: "16 avr. 2026 à 09:45" },
    { id: 7, name: "Chloé Simon", score: "2/5", pct: "40%", time: "2:15", date: "17 avr. 2026 à 15:30" },
  ];

  const getBadgeClass = (pct) => {
    if (pct === '100%' || pct === '80%') return 'badge-green';
    if (pct === '60%') return 'badge-yellow';
    return 'badge-red';
  };

  const handleCopyCode = (code) => {
    if (code) {
      navigator.clipboard.writeText(code);
      alert("Code d'accès copié !");
    }
  };

  // Gestion des écrans de chargement et d'erreur
  if (loading) return <div className="loading-box">Chargement de l'aperçu du quiz...</div>;
  if (error) return <div className="error-box">{error} <button onClick={() => navigate('/prof-dashboard')}>Retour</button></div>;
  if (!quiz) return <div className="error-box">Aucun quiz trouvé.</div>;

  // Extraction sécurisée des questions (s'il n'y en a pas, tableau vide par défaut)
  const questionsList = quiz.questions || [];

  return (
    <div className="preview-page-wrapper">
      <header className="white-header">
        <div className="inner-wrapper">
          <button className="back-link" onClick={() => navigate('/prof-dashboard')}>← Retour au tableau de bord</button>
          <h1 className="main-title">Aperçu du Quiz</h1>
        </div>
      </header>

      <main className="main-content-wrapper">
        {/* Section de la carte principale  */}
        <section className="top-quiz-card">
          <h2 className="card-heading">{quiz.title}</h2>
          <p className="card-subheading">{quiz.description || "Aucune description fournie."}</p>
          
          <div className="access-code-box">
            <div className="access-info">
              <span className="label">Code d'accès étudiant</span>
              <div className="code-val">{quiz.access_code || "N/A"}</div>
            </div>
            <button className="copy-btn" onClick={() => handleCopyCode(quiz.access_code)}>📋 Copier</button>
          </div>

          <div className="stats-grid">
            <div className="stat-box">
              <span className="stat-label">Total Questions</span>
              <div className="stat-val">{quiz.questions_count ?? questionsList.length}</div>
            </div>
            <div className="stat-box">
              <span className="stat-label">Durée Globale</span>
              <div className="stat-val">{quiz.duration} min</div>
            </div>
            <div className="stat-box">
              <span className="stat-label">Temps Moyen / Q</span>
              <div className="stat-val">
                {questionsList.length > 0 ? `${Math.round(quiz.duration * 60 / questionsList.length)}s` : "0s"}
              </div>
            </div>
            <div className="stat-box">
              <span className="stat-label">Créé le</span>
              <div className="stat-val">
                {quiz.created_at ? new Date(quiz.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : "Récemment"}
              </div>
            </div>
          </div>
        </section>

        {/* Section des Questions Réelles récupérées en JSON */}
        <section className="questions-section">
          <h3 className="section-heading">Toutes les Questions ({questionsList.length})</h3>
          
          {questionsList.length === 0 ? (
            <p className="no-data">Aucune question n'a été ajoutée à ce quiz.</p>
          ) : (
            questionsList.map((q, index) => {
              // Gestion sécurisée des options et réponses correctes
              const options = Array.isArray(q.options) ? q.options : JSON.parse(q.options || "[]");
              const correctAnswers = Array.isArray(q.correct_answer) ? q.correct_answer : JSON.parse(q.correct_answer || "[]");

              return (
                <div key={q.id || index} className="question-item-card">
                  <div className="q-header">
                    <div className="q-meta">
                      <span className="q-num">{index + 1}</span>
                      <p className="q-text">{q.question_text}</p>
                    </div>
                    <span className="q-time">🕒 {q.time ?? 30}s</span>
                  </div>
                  
                  <div className="options-stack">
                    {options.map((opt, i) => {
                      const isCorrect = correctAnswers.includes(opt);
                      return (
                        <div key={i} className={`option-box ${isCorrect ? 'correct' : 'incorrect'}`}>
                          {isCorrect && <span className="check-icon">✓</span>}
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="correct-answer-bar">
                    <span className="check-icon-small">✓</span>
                    <span className="ans-label">Réponse correcte:</span>
                    <span className="ans-value">{correctAnswers.join(', ')}</span>
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* Section des Résultats des Étudiants Statique */}
        <section className="results-section">
          <div className="results-header">
            <h3 className="section-heading">Résultats des Étudiants</h3>
            <span className="student-count-badge">{students.length} étudiants</span>
          </div>
          
          <div className="results-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Anonyme</th>
                  <th>Score</th>
                  <th>Pourcentage</th>
                  <th>Temps Passé</th>
                  <th>Date de Complétion</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td className="student-name">{s.name}</td>
                    <td>{s.score}</td>
                    <td><span className={`badge ${getBadgeClass(s.pct)}`}>{s.pct}</span></td>
                    <td>{s.time}</td>
                    <td>{s.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          
          <div className="summary-grid">
            <div className="summary-box">
              <span className="summary-label">Score Moyen</span>
              <div className="summary-val">4.0/5</div>
            </div>
            
            <div className="summary-box">
              <span className="summary-label">Taux de Réussite</span>
              <div className="summary-val">80%</div>
            </div>
            
            <div className="summary-box">
              <span className="summary-label">Temps Moyen</span>
              <div className="summary-val">2:07 min</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default QuizPreview;