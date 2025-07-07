import './App.css';
import RegistrationForm from './components/RegistrationForm';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import HomePage from './components/HomePage';
import NotFoundPage from './components/NotFoundPage'; 
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import './App.css';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/medical-registration" element={<RegistrationForm />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* Rota para redirecionar URLs desconhecidas */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;