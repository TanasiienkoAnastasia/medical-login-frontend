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

function App() {
    const [currentUser, setCurrentUser] = useState(null);

    const handleLoginSuccess = (user) => {
        setCurrentUser(user);
        if (user.specialty) {
            localStorage.setItem('currentDoctor', JSON.stringify(user));
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentDoctor');
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={
                    <LoginPage
                        handleLoginSuccess={handleLoginSuccess}
                        handleRegister={() => window.location.href = '/register'}
                        handleBack={() => window.location.href = '/login'}
                    />
                } />
                <Route path="/register" element={<RegistrationPage handleBack={() => window.location.href = '/login'} />} />
                <Route path="/doctor" element={<DoctorDashboard onLogout={handleLogout} onViewPatients={() => window.location.href = '/doctor/patients'} />} />
                <Route path="/doctor/patients" element={<DoctorPatientsPage handleBack={() => window.location.href = '/doctor'} />} />
                <Route path="/patient" element={<PatientDashboard patient={currentUser} onLogout={handleLogout} />} />
                <Route path="/recommendation" element={<InjuryRecommendation />} />

                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="*" element={<div>Сторінка не знайдена</div>} />
            </Routes>
        </Router>
    );
}

export default App;
