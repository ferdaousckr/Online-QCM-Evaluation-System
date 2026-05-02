import React from 'react';
import { useNavigate } from 'react-router-dom';
import './QuizPreview.css';

const QuizPreview = () => {
  const navigate = useNavigate();

  const questionsList = [
    { id: 1, question: "Quelle est la dérivée de x² ?", time: "30s", options: ["x", "2x", "x³", "x²/2"], correct: ["2x"] },
    { id: 2, question: "Quelles sont les villes françaises ?", time: "45s", options: ["Londres", "Paris", "Marseille", "Lyon"], correct: ["Paris", "Marseille", "Lyon"] },
    { id: 3, question: "Combien font 15 × 8 ?", time: "20s", options: ["130", "115", "125", "120"], correct: ["120"] },
    { id: 4, question: "Quels éléments composent l'eau ?", time: "25s", options: ["Hydrogène", "Oxygène", "Carbone", "Azote"], correct: ["Hydrogène", "Oxygène"] },
    { id: 5, question: "Qui a écrit 'Les Misérables' ?", time: "15s", options: ["Victor Hugo", "Émile Zola", "Gustave Flaubert", "Honoré de Balzac"], correct: ["Victor Hugo"] }
  ];

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

  return (
    <div className="preview-page-wrapper">
      <header className="white-header">
        <div className="inner-wrapper">
          <button className="back-link" onClick={() => navigate('/prof-dashboard')}>← Retour au tableau de bord</button>
          <h1 className="main-title">Aperçu du Quiz</h1>
        </div>
      </header>

      <main className="main-content-wrapper">
        <section className="top-quiz-card">
          <h2 className="card-heading">Quiz de Mathématiques</h2>
          <p className="card-subheading">Un quiz complet pour tester vos connaissances en mathématiques</p>
          
          <div className="access-code-box">
            <div className="access-info">
              <span className="label">Code d'accès étudiant</span>
              <div className="code-val">ABC123</div>
            </div>
            <button className="copy-btn">📋 Copier</button>
          </div>

          <div className="stats-grid">
            <div className="stat-box"><span className="stat-label">Total Questions</span><div className="stat-val">5</div></div>
            <div className="stat-box"><span className="stat-label">Durée Globale</span><div className="stat-val">30 min</div></div>
            <div className="stat-box"><span className="stat-label">Temps Questions</span><div className="stat-val">2 min</div></div>
            <div className="stat-box"><span className="stat-label">Créé le</span><div className="stat-val">1 avr.</div></div>
          </div>
        </section>

        <section className="questions-section">
          <h3 className="section-heading">Toutes les Questions</h3>
          {questionsList.map((q) => (
            <div key={q.id} className="question-item-card">
              <div className="q-header">
                <div className="q-meta">
                  <span className="q-num">{q.id}</span>
                  <p className="q-text">{q.question}</p>
                </div>
                <span className="q-time">🕒 {q.time}</span>
              </div>
              <div className="options-stack">
                {q.options.map((opt, i) => (
                  <div key={i} className={`option-box ${q.correct.includes(opt) ? 'correct' : 'incorrect'}`}>
                    {q.correct.includes(opt) && <span className="check-icon">✓</span>}
                    {opt}
                  </div>
                ))}
              </div>
              
              <div className="correct-answer-bar">
                <span className="check-icon-small">✓</span>
                <span className="ans-label">Réponse correcte:</span>
                <span className="ans-value">{q.correct.join(', ')}</span>
              </div>
            </div>
          ))}
        </section>

        <section className="results-section">
          <div className="results-header">
            <h3 className="section-heading">Résultats des Étudiants</h3>
            <span className="student-count-badge">7 étudiants</span>
          </div>
          
          <div className="results-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Étudiant</th>
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