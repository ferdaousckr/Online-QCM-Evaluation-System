import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginView from './components/LoginView';
import ProfessorDashboard from './components/ProfessorDashboard';
import CreateQuiz from './components/CreateQuiz';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route for the Login Page */}
        <Route path="/" element={<LoginView />} />
        
        {/* Route for the Professor Dashboard */}
        <Route path="/prof-dashboard" element={<ProfessorDashboard />} />
        
        {/* Route for the create quiz page */}
        <Route path="/create-quiz" element={<CreateQuiz />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;