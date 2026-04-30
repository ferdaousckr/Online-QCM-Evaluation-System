import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginView = () => {
  const [userType, setUserType] = useState('etudiant');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page par défaut
    
    // Logique de redirection selon le type d'utilisateur
    if (userType === 'professeur') {
      navigate('/prof-dashboard');
    } else {
      navigate('/student-dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Plateforme de Quiz</h1>
        <p className="text-gray-500 mb-8">Connectez-vous pour continuer</p>
        
        <div className="flex gap-4 mb-8">
          <button 
            type="button"
            onClick={() => setUserType('etudiant')}
            className={`flex-1 py-3 rounded-xl font-semibold border-2 transition-all ${userType === 'etudiant' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}
          >
            🎓 Étudiant
          </button>
          <button 
            type="button"
            onClick={() => setUserType('professeur')}
            className={`flex-1 py-3 rounded-xl font-semibold border-2 transition-all ${userType === 'professeur' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}
          >
            📖 Professeur
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="font-semibold text-gray-700 text-sm">Email</label>
            <input 
              type="email" 
              required 
              placeholder="votre.email@exemple.com" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none" 
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-gray-700 text-sm">Mot de passe</label>
            <input 
              type="password" 
              required 
              placeholder="********" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors mt-4"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;