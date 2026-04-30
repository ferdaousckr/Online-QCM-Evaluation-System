import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginView from './components/LoginView';
import ProfessorDashboard from './components/ProfessorDashboard';
import CreateQuiz from './components/CreateQuiz';
import StudentDashboard from './components/StudentDashboard'; 
import QuizView from './components/QuizView'; 

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
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student/quiz/:id" element={<QuizView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;