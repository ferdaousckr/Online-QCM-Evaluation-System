import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Plus, LogOut, Eye, Edit2, Trash2, Copy, Clock, Users } from 'lucide-react';
import './dashboard.css';

const ProfessorDashboard = () => {
  const navigate = useNavigate(); 

  
  const handleLogout = () => {
    navigate('/');
  };

  const quizzes = [
    { id: 1, title: "Quiz de Mathématiques", code: "ABC123", questions: 15, duration: 30, completed: 24, average: 78, date: "01/04/2026" },
    { id: 2, title: "Quiz de Physique", code: "XYZ789", questions: 20, duration: 45, completed: 28, average: 72, date: "28/03/2026" },
    { id: 3, title: "Quiz de Chimie", code: "DEF456", questions: 18, duration: 40, completed: 22, average: 85, date: "25/03/2026" }
  ];

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1 style={{fontSize: '1.25rem', fontWeight: 800, color: '#1e293b'}}>Tableau de Bord Professeur</h1>
        {/* 4. Ajout de l'événement onClick */}
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> Déconnexion
        </button>
      </nav>

      <main className="dashboard-content">
        <div className="header-row">
          <div>
            <h2 style={{fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem'}}>Gestion des Quiz</h2>
            <p style={{color: '#64748b'}}>Créez et gérez vos quiz pour vos étudiants</p>
          </div>
          {/* Change the button below to include the onClick event */}
          <button className="new-quiz-btn" onClick={() => navigate('/create-quiz')}>
            <Plus size={20} /> Nouveau Quiz
          </button>
        </div>

        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
              <div className="card-header">
                <h3 style={{fontWeight: 700, fontSize: '1.1rem'}}>{quiz.title}</h3>
                <div className="action-icons">
                  <button className="icon-btn" style={{color: '#3b82f6'}} onClick={() => navigate(`/quiz/${quiz.id}`)}><Eye size={18}/></button>
                  <button className="icon-btn" style={{color: '#94a3b8'}} onClick={() => navigate('/create-quiz')}><Edit2 size={18}/></button>
                  <button className="icon-btn" style={{color: '#ef4444'}}><Trash2 size={18}/></button>
                </div>
              </div>

              <div className="code-box">
                <div>
                  <span style={{fontSize: '0.65rem', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase'}}>Code d'accès</span>
                  <div className="code-text">{quiz.code}</div>
                </div>
                <button className="icon-btn" style={{background: 'white', border: '1px solid #e2e8f0'}}><Copy size={18} color="#94a3b8"/></button>
              </div>

              <div className="stat-row">
                <span>Questions</span>
                <span className="stat-value">{quiz.questions}</span>
              </div>
              <div className="stat-row">
                <span style={{display:'flex', alignItems:'center', gap:'5px'}}><Clock size={14}/> Durée</span>
                <span className="stat-value">{quiz.duration} min</span>
              </div>
              <div className="stat-row">
                <span style={{display:'flex', alignItems:'center', gap:'5px'}}><Users size={14}/> Étudiants</span>
                <span className="stat-value">{quiz.completed} complétés</span>
              </div>

              <div className="stat-row" style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', alignItems: 'center'}}>
                <span>Moyenne</span>
                <span className={`average-badge ${quiz.average >= 80 ? 'high-avg' : 'mid-avg'}`}>
                  {quiz.average}%
                </span>
              </div>

              <div style={{marginTop: '1rem', fontSize: '0.7rem', color: '#94a3b8'}}>
                Créé le {quiz.date}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProfessorDashboard;