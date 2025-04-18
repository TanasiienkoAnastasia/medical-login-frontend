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
import DoctorAppointmentsPage from './components/DoctorAppointmentsPage';
import PatientDashboard from './components/PatientDashboard';

function AppWrapper() {
    const navigate = useNavigate();

    const handleLoginSuccess = (user, access_token) => {
        localStorage.setItem('token', access_token);

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
            <Route path="/login" element={<LoginPage handleLoginSuccess={handleLoginSuccess} handleRegister={() => navigate('/register')}/>} />
            <Route path="/register" element={<RegistrationPage handleBack={() => navigate('/login')} />} />
            <Route path="/doctor" element={<DoctorDashboard onLogout={handleLogout} onViewPatients={() => navigate('/doctor/patients')} />} />
            <Route path="/doctor/patients" element={<DoctorAppointmentsPage handleBack={() => navigate('/doctor')} />} />
            <Route path="/patient" element={<PatientDashboard onLogout={handleLogout} />} />
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
