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

const DoctorDashboard = ({ onLogout, onViewPatients: onViewAppointments }) => {
    const [showModal, setShowModal] = useState(false);
    const [doctor, setDoctor] = useState({ name: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const username = decoded.name;

            setDoctor({ name: username });
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

                // TODO doctor & patient should have ability to set image during registration
                <DoctorImage
                    src='https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg'
                    alt="Doctor"
                />

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



