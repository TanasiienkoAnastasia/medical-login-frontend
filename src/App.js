import React, { useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useNavigate
} from 'react-router-dom';

import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import DoctorDashboard from './components/DoctorDashboard';
import DoctorPatientsPage from './components/DoctorPatientsPage';
import PatientDashboard from './components/PatientDashboard';
import InjuryRecommendation from './components/InjuryRecommendation';

function AppWrapper() {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    const handleLoginSuccess = (user) => {
        setCurrentUser(user);
        if (user.specialty) {
            localStorage.setItem('currentDoctor', JSON.stringify(user));
            navigate('/doctor');
        } else {
            navigate('/patient');
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentDoctor');
        navigate('/login');
    };

    return (
        <Routes>
            <Route path="/login" element={
                <LoginPage
                    handleLoginSuccess={handleLoginSuccess}
                    handleRegister={() => navigate('/register')}
                    handleBack={() => navigate('/login')}
                />
            } />
            <Route path="/register" element={<RegistrationPage handleBack={() => navigate('/login')} />} />
            <Route path="/doctor" element={<DoctorDashboard onLogout={handleLogout} onViewPatients={() => navigate('/doctor/patients')} />} />
            <Route path="/doctor/patients" element={<DoctorPatientsPage handleBack={() => navigate('/doctor')} />} />
            <Route path="/patient" element={<PatientDashboard patient={currentUser} onLogout={handleLogout} />} />
            <Route path="/recommendation" element={<InjuryRecommendation />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<div>Сторінка не знайдена</div>} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AppWrapper />
        </Router>
    );
}

export default App;
