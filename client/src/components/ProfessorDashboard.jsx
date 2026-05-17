import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { Plus, LogOut, Eye, Edit2, Trash2, Copy, Clock, Users } from 'lucide-react';
import './dashboard.css';
import api from '../api';

const ProfessorDashboard = () => {
  const navigate = useNavigate(); 
  
  // États pour stocker les données et le statut de chargement
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupération des données depuis le Backend Laravel
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/quizzes');
        setQuizzes(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des quiz:", error);
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);
  
  const handleLogout = () => {
    navigate('/');
  };

  // Fonction pour supprimer un quiz
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce quiz ?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/quizzes/${id}`);
        setQuizzes(quizzes.filter(quiz => quiz.id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  if (loading) {
    return <div className="loading-container">Chargement de vos quiz...</div>;
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1 style={{fontSize: '1.25rem', fontWeight: 800, color: '#1e293b'}}>Tableau de Bord Professeur</h1>
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
          <button className="new-quiz-btn" onClick={() => navigate('/create-quiz')}>
            <Plus size={20} /> Nouveau Quiz
          </button>
        </div>

        <div className="quiz-grid">
          {quizzes.length === 0 ? (
            <p>Aucun quiz trouvé. Commencez par en créer un !</p>
          ) : (
            quizzes.map((quiz) => (
              <div key={quiz.id} className="quiz-card">
                <div className="card-header">
                  <h3 style={{fontWeight: 700, fontSize: '1.1rem'}}>{quiz.title}</h3>
                  <div className="action-icons">
                    <button 
                      className="icon-btn" 
                      style={{color: '#3b82f6'}} 
                      onClick={() => navigate(`/quiz/${quiz.id}`)}
                    >
                      <Eye size={18}/>
                    </button>
                    <button 
                      className="icon-btn" 
                      style={{color: '#94a3b8'}} 
                      onClick={() => navigate(`/edit-quiz/${quiz.id}`)}
                    >
                      <Edit2 size={18}/>
                    </button>
                    <button 
                      className="icon-btn" 
                      style={{color: '#ef4444'}}
                      onClick={() => handleDelete(quiz.id)}
                    >
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </div>

                <div className="code-box">
                  <div>
                    <span style={{fontSize: '0.65rem', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase'}}>Code d'accès</span>
                    {/* Utilisation de access_code qui vient de ta migration Laravel */}
                    <div className="code-text">{quiz.access_code}</div>
                  </div>
                  <button 
                    className="icon-btn" 
                    style={{background: 'white', border: '1px solid #e2e8f0'}}
                    onClick={() => navigator.clipboard.writeText(quiz.access_code)}
                  >
                    <Copy size={18} color="#94a3b8"/>
                  </button>
                </div>

                <div className="stat-row">
                  <span>Questions</span>
                  <span className="stat-value">{quiz.questions ? quiz.questions.length : 0}</span>
                </div>
                
                <div className="stat-row">
                  <span style={{display:'flex', alignItems:'center', gap:'5px'}}><Clock size={14}/> Durée</span>
                  <span className="stat-value">{quiz.duration || '--'} min</span>
                </div>

                <div className="stat-row" style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', alignItems: 'center'}}>
                  <span>Moyenne</span>
                  <span className="average-badge mid-avg">
                    -- %
                  </span>
                </div>

                <div style={{marginTop: '1rem', fontSize: '0.7rem', color: '#94a3b8'}}>
                  Créé le {new Date(quiz.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfessorDashboard;