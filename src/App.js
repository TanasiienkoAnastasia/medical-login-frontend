import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import DoctorDashboard from './components/DoctorDashboard';
import DoctorPatientsPage from './components/DoctorPatientsPage';
import PatientDashboard from './components/PatientDashboard';
import InjuryRecommendation from './components/InjuryRecommendation';

function App() {
    const [currentPage, setCurrentPage] = useState('login');
    const [currentUser, setCurrentUser] = useState(null);

    const handleLoginSuccess = (user) => {
        setCurrentUser(user);
        if (user.specialty) {
            localStorage.setItem('currentDoctor', JSON.stringify(user));
            setCurrentPage('doctor');
        } else {
            setCurrentPage('patient');
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentDoctor');
        setCurrentPage('login');
    };

    const pages = {
        login: (
            <LoginPage
                handleLoginSuccess={handleLoginSuccess}
                handleRegister={() => setCurrentPage('register')}
                handleBack={() => setCurrentPage('login')}
            />
        ),
        register: (
            <RegistrationPage handleBack={() => setCurrentPage('login')} />
        ),
        doctor: (
            <DoctorDashboard
                onLogout={handleLogout}
                onViewPatients={() => setCurrentPage('doctorPatients')}
            />
        ),
        doctorPatients: (
            <DoctorPatientsPage handleBack={() => setCurrentPage('doctor')} />
        ),
        patient: (
            <PatientDashboard
                patient={currentUser}
                onLogout={handleLogout}
            />
        ),
        injuryRecommendation: <InjuryRecommendation />
    };

    return pages[currentPage] || <div>Сторінка не знайдена</div>;
}

export default App;
