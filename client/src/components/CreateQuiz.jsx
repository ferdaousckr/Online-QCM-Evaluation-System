import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Clock, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './CreateQuiz.css';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState([{ id: 1, text: '', time: 30, options: ['', '', '', ''], correctAnswers: [] }]);

  useEffect(() => {
    if (id) {
      const fetchQuizData = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/quizzes/${id}`);
          const quiz = response.data;
          
          setTitle(quiz.title);
          setDescription(quiz.description || '');
          setDuration(quiz.duration);
          
          if (quiz.questions && quiz.questions.length > 0) {
            setQuestions(quiz.questions.map((q, index) => ({
              id: index + 1,
              text: q.question_text,
              options: q.options || ['', ''],
              correctAnswers: q.correct_answer || []
            })));
          }
        } catch (error) {
          console.error("Erreur lors du chargement du quiz à modifier:", error);
        }
      };
      fetchQuizData();
    }
  }, [id]);
  
  const addQuestion = () => {
    const newId = questions.length + 1;
    setQuestions([...questions, { id: newId, text: '', time: 30, options: ['', '', '', ''], correctAnswers: [] }]);
  };

  const removeQuestion = (idToRemove) => {
    setQuestions(questions.filter(q => q.id !== idToRemove));
  };
  const handleQuestionChange = (id, field, value) => {
  setQuestions(questions.map(q => 
    q.id === id ? { ...q, [field]: value } : q
  ));
  };

  const handleOptionChange = (qId, optIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions[optIndex] = value;
        return { ...q, options: newOptions };
      }
    return q;
    }));
  };
  const handleCreateQuiz = async (e) => {
    e.preventDefault(); 

    const fullQuizData = {
      title: title,
      description: description,
      duration: duration,
      user_id: null,
      questions: questions.map(q => ({
         question_text: q.text,
         options: q.options,
         correct_answer: q.correctAnswers
      }))
    };

    try {
      let response;
      if (id) {
        // Si on a un ID, on met à jour le quiz existant (Route PUT)
        response = await axios.put(`http://127.0.0.1:8000/api/quizzes/${id}`, fullQuizData);
      } else {
        // Sinon, on crée un nouveau quiz (Route POST)
        response = await axios.post('http://127.0.0.1:8000/api/quizzes', fullQuizData);
      }

      if (response.status === 200 || response.status === 201) {
        alert(id ? "Quiz mis à jour avec succès !" : "Félicitations ! Ton quiz est en ligne.");
        navigate('/prof-dashboard');
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
    }
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
            <input 
              type="text" 
              placeholder="Ex: Quiz de Mathématiques" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>
          <div className="input-group">
            <label>Description</label>
            <textarea 
              placeholder="Description du quiz..." 
              rows="3"
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="input-group">
            <label>Durée (en minutes)</label>
            <input 
              type="number" 
              value={duration} 
              onChange={(e) => setDuration(e.target.value)} 
            />
          </div>
        </div>

        {/* Section 2: Questions List */}
        {questions.map((q, index) => (
          <div key={q.id} className="quiz-card question-card">
            
            <div className="question-header">
              <h3 className="question-title">Question {index + 1}</h3>
              <button 
                type="button" 
                className="delete-question-btn"
                onClick={() => removeQuestion(q.id)}
                title="Supprimer cette question"
              >
                <Trash2 size={20} />
              </button>
            </div>
            
            <div className="input-group">
              <label>Question</label>
              <input 
                type="text" 
                placeholder="Entrez votre question..." 
                value={q.text} 
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[index].text = e.target.value;
                  setQuestions(newQuestions);
                }}
              />
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
                  <input 
                    type="checkbox" 
                    className="correct-checkbox" 
                    checked={q.correctAnswers.includes(opt) && opt !== ''}
                    onChange={() => {
                      const newQuestions = [...questions];
                      const currentAnswers = newQuestions[index].correctAnswers;

                      if (currentAnswers.includes(opt)) {
                      
                        newQuestions[index].correctAnswers = currentAnswers.filter(a => a !== opt);
                      } else {
                        newQuestions[index].correctAnswers = [...currentAnswers, opt];
                      }
                      setQuestions(newQuestions);
                    }}
                  />
                  <input 
                    type="text" 
                    placeholder={`Option ${i + 1}`} 
                    value={opt} 
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].options[i] = e.target.value;
                      setQuestions(newQuestions);
                    }}
                  />  
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
          <button className="submit-quiz-btn" onClick={handleCreateQuiz}>Créer le Quiz</button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;