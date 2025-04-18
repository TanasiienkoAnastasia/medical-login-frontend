import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import DoctorDashboard from './components/DoctorDashboard';
import DoctorPatientsPage from './components/DoctorPatientsPage';
import PatientDashboard from './components/PatientDashboard';
import InjuryRecommendation from './components/InjuryRecommendation'; // Import InjuryRecommendation component

function App() {
    const [currentPage, setCurrentPage] = useState('login'); // 'login', 'register', 'doctor', 'patient', 'doctorPatients', 'injuryRecommendation'
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

    const handleRegister = () => {
        setCurrentPage('register');
    };

    const handleBack = () => {
        setCurrentPage('login');
    };

    if (currentPage === 'login') {
        return (
            <LoginPage
                handleLoginSuccess={handleLoginSuccess}
                handleRegister={handleRegister}
                handleBack={handleBack}
            />
        );
    }

    if (currentPage === 'register') {
        return <RegistrationPage handleBack={handleBack} />;
    }

    if (currentPage === 'doctor') {
        return (
            <DoctorDashboard
                onLogout={handleLogout}
                onViewPatients={() => setCurrentPage('doctorPatients')}
            />
        );
    }

    if (currentPage === 'doctorPatients') {
        return (
            <DoctorPatientsPage handleBack={() => setCurrentPage('doctor')} />
        );
    }

    if (currentPage === 'patient') {
        return (
            <PatientDashboard
                patient={currentUser}
                onLogout={handleLogout}
            />
        );
    }

    if (currentPage === 'injuryRecommendation') {
        return <InjuryRecommendation />;
    }

    return <div>Сторінка не знайдена</div>;
}

export default App;


