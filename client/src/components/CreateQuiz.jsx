import React, { useState } from 'react';
import { ArrowLeft, Plus, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CreateQuiz.css';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([{ id: 1, text: '', time: 30, options: ['', '', '', ''], correctAnswers: [] }]);

  const addQuestion = () => {
    const newId = questions.length + 1;
    setQuestions([...questions, { id: newId, text: '', time: 30, options: ['', '', '', ''], correctAnswers: [] }]);
  };

  return (
    <div className="create-quiz-container">
      {/* Header */}
      <header className="create-quiz-header">
        <button className="back-button" onClick={() => navigate('/prof-dashboard')}>
          <ArrowLeft size={18} /> Retour
        </button>
        <h1>Créer un Nouveau Quiz</h1>
      </header>

      <div className="create-quiz-content">
        {/* Section 1: Quiz General Info */}
        <div className="quiz-card">
          <h2>Informations du Quiz</h2>
          <div className="input-group">
            <label>Titre du Quiz</label>
            <input type="text" placeholder="Ex: Quiz de Mathématiques" />
          </div>
          <div className="input-group">
            <label>Description</label>
            <textarea placeholder="Description du quiz..." rows="3"></textarea>
          </div>
          <div className="input-group">
            <label>Durée (en minutes)</label>
            <input type="number" defaultValue="30" />
          </div>
        </div>

        {/* Section 2: Questions List */}
        {questions.map((q, index) => (
          <div key={q.id} className="quiz-card question-card">
            <h3>Question {index + 1}</h3>
            
            <div className="input-group">
              <label>Question</label>
              <input type="text" placeholder="Entrez votre question..." />
            </div>

            <div className="input-group">
              <label><Clock size={16} /> Temps limite (en secondes)</label>
              <input type="number" defaultValue={q.time} />
              <p className="helper-text">Temps accordé aux étudiants pour répondre à cette question</p>
            </div>

            <div className="options-section">
              <label>Options de réponse</label>
              {q.options.map((opt, i) => (
                <div key={i} className="option-row">
                  <input type="checkbox" className="correct-checkbox" title="Marquer comme bonne réponse" />
                  <input type="text" placeholder={`Option ${i + 1}`} />
                </div>
              ))}
              <p className="helper-text italic">Cliquez sur le carré pour marquer les bonnes réponses (choix multiples possibles)</p>
            </div>
          </div>
        ))}

        {/* Action Buttons */}
        <div className="action-footer">
          <button className="add-question-btn" onClick={addQuestion}>
            <Plus size={20} /> Ajouter une question
          </button>
          <button className="submit-quiz-btn">Créer le Quiz</button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;