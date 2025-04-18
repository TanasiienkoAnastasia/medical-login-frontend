import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { jwtDecode } from "jwt-decode";


const Navbar = styled.div`
  width: 100%;
  background-color: #f3dbe3;
  padding: 12px 24px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5c4d0;
  box-sizing: border-box;
  gap: 10px;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavTitle = styled.div`
  font-weight: bold;
  color: #6b2737;
  font-size: 18px;
  flex: 1;
  min-width: 180px;
`;

const NavActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
`;

const NavButton = styled.button`
  background-color: #c96b8a;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #b25f7f;
  }
`;

const Container = styled.div`
  background: linear-gradient(135deg, #f5e8ec, #f7edf3);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  font-family: 'Segoe UI', sans-serif;
`;

const Title = styled.h1`
  font-size: 28px;
  color: #b25f7f;
  margin-bottom: 30px;
  text-align: center;
`;

const DoctorImage = styled.img`
  width: 250px;
  height: 250px;
  border-radius: 20px;
  object-fit: cover;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const DoctorName = styled.h2`
  font-size: 22px;
  font-weight: bold;
  color: #8e4a5a;
  margin-bottom: 25px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
`;

const CloseButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #c5a5b4;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background-color: #ae8f9e;
  }
`;

const DoctorDashboard = ({ onLogout, onViewPatients }) => {
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
                    <NavButton onClick={onViewPatients}>Пацієнти</NavButton>
                    <NavButton onClick={() => setShowModal(true)}>Про лікарню</NavButton>
                    <NavButton onClick={onLogout}>Вийти</NavButton>
                </NavActions>
            </Navbar>

            <Container>
                <Title>Керуйте прийомами ваших пацієнтів</Title>

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



