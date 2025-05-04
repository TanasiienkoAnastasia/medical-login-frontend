import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import {
    Navbar,
    NavTitle,
    NavActions,
    NavButton,
    Container,
    Title,
    DoctorImage,
    DoctorName,
    ModalOverlay,
    ModalContent,
    CloseButton
} from './DoctorDashboard.styles';
import API_BASE_URL from "../config/api";
import DoctorSlotAnalytics from "./DoctorSlotAnalytics";

const DoctorDashboard = ({ onLogout, onViewPatients: onViewAppointments }) => {
    const [showModal, setShowModal] = useState(false);
    const [doctor, setDoctor] = useState({ name: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        console.log(userData)

        if (token && userData) {
            const decoded = jwtDecode(token);
            const user = JSON.parse(userData);
            const name = `${decoded.name} ${decoded.surname} ${decoded.middle_name}`;

            setDoctor({
                name,
                id: user.id,
                photo_url: user.photo_url
            });
            console.log(user.photo_url)
        }
    }, []);

    return (
        <>
            <Navbar>
                <NavTitle>👨‍⚕️ Лікар: {doctor.name }</NavTitle>
                <NavActions>
                    <NavButton onClick={onViewAppointments}>Прийоми</NavButton>
                    <NavButton onClick={() => setShowModal(true)}>Про лікарню</NavButton>
                    <NavButton onClick={onLogout}>Вийти</NavButton>
                </NavActions>
            </Navbar>

            <Container>
                <Title>Керуйте прийомами ваших пацієнтів</Title>
                <DoctorImage
                    src={doctor.photo_url ? `${API_BASE_URL}${doctor.photo_url}` : 'https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg'}
                    alt="Doctor"
                />

                <DoctorSlotAnalytics doctorId={doctor.id} />

                <DoctorName>Д-р {doctor.name || 'Невідомий'}</DoctorName>

                {showModal && (
                    <ModalOverlay>
                        <ModalContent>
                            <h3 style={{ color: '#b25f7f' }}>Про нашу лікарню</h3>
                            <p style={{ color: '#5e5e5e' }}>
                                Наша клініка вже понад 20 років допомагає пацієнтам з усієї України.
                                Ми забезпечуємо сучасну діагностику, лікування та індивідуальний підхід до кожного пацієнта.
                            </p>
                            <CloseButton onClick={() => setShowModal(false)}>Закрити</CloseButton>
                        </ModalContent>
                    </ModalOverlay>
                )}
            </Container>
        </>
    );
};

export default DoctorDashboard;



