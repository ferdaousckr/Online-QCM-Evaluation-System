import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginView from './components/LoginView';
import ProfessorDashboard from './components/ProfessorDashboard';
import CreateQuiz from './components/CreateQuiz';
import QuizPreview from './components/QuizPreview';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route for the Login Page */}
        <Route path="/" element={<LoginView />} />
        
        {/* Route for the Professor Dashboard */}
        <Route path="/prof-dashboard" element={<ProfessorDashboard />} />
      
        <Route path="/create-quiz" element={<CreateQuiz />} />
      
        <Route path="/quiz/:id" element={<QuizPreview />} />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;