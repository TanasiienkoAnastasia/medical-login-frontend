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
import {LoadingProvider} from "./context/LoadingContext";
import GlobalSpinner from "./components/GlobalSpinner";
import useAxiosInterceptor from "./hooks/useAxiosInterceptor";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

function AppWrapper() {
    const navigate = useNavigate();

    const handleLoginSuccess = (user, access_token) => {
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));

        toast.success(`Успішний вхід як ${user.userType === 'doctor' ? 'лікар' : 'пацієнт'}`);

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

    useAxiosInterceptor();

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <LoadingProvider>
                <GlobalSpinner />
                <Routes>
                    <Route path="/login" element={<LoginPage handleLoginSuccess={handleLoginSuccess} handleRegister={() => navigate('/register')}/>} />
                    <Route path="/register" element={<RegistrationPage handleBack={() => navigate('/login')} />} />
                    <Route path="/doctor" element={<DoctorDashboard onLogout={handleLogout} onViewPatients={() => navigate('/doctor/patients')} />} />
                    <Route path="/doctor/patients" element={<DoctorAppointmentsPage handleBack={() => navigate('/doctor')} />} />
                    <Route path="/patient" element={<PatientDashboard onLogout={handleLogout} />} />
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </LoadingProvider>
        </>
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
