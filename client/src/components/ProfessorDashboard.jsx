import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { Plus, LogOut, Eye, Edit2, Trash2, Copy, Check, Clock, Users, AlertTriangle } from 'lucide-react';
import './dashboard.css';

const ProfessorDashboard = () => {
  const navigate = useNavigate(); 
  
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // État pour gérer l'animation de copie du code d'accès
  const [copiedQuizId, setCopiedQuizId] = useState(null);

  // États pour la modale de suppression
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

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

  // Gestion de la copie avec retour visuel immédiat
  const handleCopyCode = (quizId, code) => {
    navigator.clipboard.writeText(code);
    setCopiedQuizId(quizId);
    setTimeout(() => setCopiedQuizId(null), 2000); // Le message disparait après 2 secondes
  };

  const triggerDeleteConfirmation = (quiz) => {
    setQuizToDelete(quiz);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!quizToDelete) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/quizzes/${quizToDelete.id}`);
      setQuizzes(quizzes.filter(quiz => quiz.id !== quizToDelete.id));
      setIsDeleteModalOpen(false);
      setQuizToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Impossible de supprimer le quiz.");
    }
  };

  const getAverageBadgeClass = (avg) => {
    if (!avg || avg === '--') return 'avg-muted';
    const numericAvg = parseFloat(avg);
    if (numericAvg >= 80) return 'avg-high';
    if (numericAvg >= 50) return 'avg-mid';
    return 'avg-low';
  };

  if (loading) {
    return <div className="loading-container">Chargement de vos quiz...</div>;
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1 className="nav-title">Tableau de Bord Professeur</h1>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> Déconnexion
        </button>
      </nav>

      <main className="dashboard-content">
        <div className="header-row">
          <div>
            <h2 className="content-title">Gestion des Quiz</h2>
            <p className="content-subtitle">Créez et gérez vos quiz pour vos étudiants</p>
          </div>
          <button className="new-quiz-btn" onClick={() => navigate('/create-quiz')}>
            <Plus size={20} /> Nouveau Quiz
          </button>
        </div>

        <div className="quiz-grid">
          {quizzes.length === 0 ? (
            <p className="no-quiz-text">Aucun quiz trouvé. Commencez par en créer un !</p>
          ) : (
            quizzes.map((quiz) => {
              const averageScore = quiz.average_score || '--'; 
              const completedCount = quiz.completed_students_count || 0;

              return (
                <div key={quiz.id} className="quiz-card">
                  <div className="card-header">
                    <h3 className="quiz-title-text">{quiz.title}</h3>
                    <div className="action-icons">
                      <button 
                        className="icon-btn view" 
                        onClick={() => navigate(`/quiz-preview/${quiz.id}`)} // Redirige vers la liste des scores
                        title="Voir les résultats des étudiants"
                      >
                        <Eye size={18}/>
                      </button>
                      <button 
                        className="icon-btn edit" 
                        onClick={() => navigate(`/edit-quiz/${quiz.id}`)}
                        title="Modifier"
                      >
                        <Edit2 size={18}/>
                      </button>
                      <button 
                        className="icon-btn delete" 
                        onClick={() => triggerDeleteConfirmation(quiz)}
                        title="Supprimer"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  </div>

                  <div className="code-box">
                    <div className="code-box-left">
                      <span className="code-label">Code d'accès</span>
                      <div className="code-text">{quiz.access_code}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {copiedQuizId === quiz.id && (
                        <span className="copied-toast-text">Copié !</span>
                      )}
                      <button 
                        className={`copy-btn ${copiedQuizId === quiz.id ? 'copied' : ''}`} 
                        onClick={() => handleCopyCode(quiz.id, quiz.access_code)}
                        title="Copier le code"
                      >
                        {copiedQuizId === quiz.id ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="stat-rows-container">
                    <div className="stat-row">
                      <span className="stat-label">Questions</span>
                      <span className="stat-value">{quiz.questions ? quiz.questions.length : 0}</span>
                    </div>
                    
                    <div className="stat-row">
                      <span className="stat-label-icon"><Clock size={15}/> Durée</span>
                      <span className="stat-value">{quiz.duration || '--'} min</span>
                    </div>

                    <div className="stat-row">
                      <span className="stat-label-icon"><Users size={15}/> Étudiants</span>
                      <span className="stat-value">{completedCount} complétés</span>
                    </div>

                    <div className="stat-row average-row">
                      <span className="stat-label">Moyenne</span>
                      <span className={`average-badge ${getAverageBadgeClass(averageScore)}`}>
                        {averageScore === '--' ? '-- %' : `${averageScore}%`}
                      </span>
                    </div>
                  </div>

                  <div className="card-footer-date">
                    Créé le {new Date(quiz.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* MODALE DE SUPPRESSION */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="delete-modal-card">
            <div className="modal-icon-wrapper">
              <AlertTriangle size={32} className="modal-alert-icon" />
            </div>
            <h3>Supprimer le quiz ?</h3>
            <p>Êtes-vous sûr de vouloir supprimer le quiz <strong>"{quizToDelete?.title}"</strong> ?<br />Cette action est irréversible.</p>
            <div className="modal-actions-wrapper">
              <button className="modal-btn-cancel" onClick={() => { setIsDeleteModalOpen(false); setQuizToDelete(null); }}>Annuler</button>
              <button className="modal-btn-confirm" onClick={handleConfirmDelete}>Oui, supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorDashboard;