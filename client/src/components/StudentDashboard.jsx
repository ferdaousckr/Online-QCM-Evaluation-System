import React, { useState } from 'react';
import { LogOut, Play, Hash } from 'lucide-react'; 
import './dashboard.css';

const StudentDashboard = () => {
  const [quizCode, setQuizCode] = useState("");

  const handleJoin = () => {
    if (quizCode.trim()) {
      window.location.href = `/quiz/${quizCode}`;
    }
  };

  return (
    <div className="dashboard-container">
   
      <nav className="dashboard-nav">
        <h2 style={{ color: '#1e293b' }}>Student Portal</h2>
        <button className="logout-btn">
          <LogOut size={18} /> Logout
        </button>
      </nav>

      <main className="dashboard-content">
        <div className="header-row">
          <div>
            <h1 style={{ fontSize: '2rem', color: '#1e293b' }}>Ready for a challenge?</h1>
            <p style={{ color: '#64748b' }}>Enter your access code to start your evaluation.</p>
          </div>
        </div>

        
        <div className="quiz-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="card-header">
            <span style={{ fontWeight: 700, color: '#1e3a8a' }}>JOIN A QUIZ</span>
            <Hash color="#1e3a8a" size={20} />
          </div>

          <div className="code-box">
            <input 
              type="text" 
              className="code-text" 
              placeholder="CODE123"
              value={quizCode}
              onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
            />
          </div>

          <button className="new-quiz-btn" onClick={handleJoin} style={{ width: '100%', justifyContent: 'center' }}>
            <Play size={18} /> Start Quiz
          </button>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;