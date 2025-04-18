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

function AppWrapper() {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    const handleLoginSuccess = (user) => {
        alert(`Успішний вхід як ${user.userType === 'doctor' ? 'лікар' : 'пацієнт'}`);

        if (user.userType === 'doctor') {
            navigate('/doctor');
        } else {
            navigate('/patient');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Routes>
            <Route path="/login" element={
                <LoginPage
                    handleLoginSuccess={handleLoginSuccess}
                    handleRegister={() => navigate('/register')}
                />
            } />
            <Route path="/register" element={<RegistrationPage handleBack={() => navigate('/login')} />} />
            <Route path="/doctor" element={<DoctorDashboard onLogout={handleLogout} onViewPatients={() => navigate('/doctor/patients')} />} />
            <Route path="/doctor/patients" element={<DoctorPatientsPage handleBack={() => navigate('/doctor')} />} />
            <Route path="/patient" element={<PatientDashboard patient={currentUser} onLogout={handleLogout} />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
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
