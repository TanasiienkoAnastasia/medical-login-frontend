import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: linear-gradient(135deg, #ffc0cb, #ffb6c1);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: 'Arial', sans-serif;
  padding: 20px;
`;

const FormCard = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: #6b2737;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 25px;
  text-align: center;
  width: 100%;
`;

const Subtitle = styled.p`
  color: #8e4a5a;
  font-size: 16px;
  text-align: center;
  margin-bottom: 25px;
`;

const Input = styled.input`
  padding: 12px 15px;
  margin: 10px 0;
  font-size: 16px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #d88ea7;
  background-color: #fff;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #b85c75;
    box-shadow: 0 0 0 2px rgba(184, 92, 117, 0.2);
  }
`;

const Button = styled.button`
  background-color: #d16b86;
  color: white;
  padding: 14px 30px;
  font-size: 18px;
  border: none;
  border-radius: 50px;
  margin-top: 20px;
  cursor: pointer;
  width: 100%;
  max-width: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: #b85c75;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const UserTypeSelector = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const UserTypeButton = styled(Button)`
  background-color: ${props => props.active ? '#d16b86' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#666'};
  flex: 1;
  margin: 0 10px;
`;

const RegistrationPage = ({ handleBack }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        specialty: '',
        phone: '', // Used phone instead of age
    });

    const [userType, setUserType] = useState('patient'); // Default user type is patient

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields based on user type
        if (
            !formData.name ||
            !formData.email ||
            !formData.password ||
            (userType === 'doctor' && !formData.specialty) ||
            (userType === 'patient' && !formData.phone) // Validate phone for patients
        ) {
            alert('Будь ласка, заповніть усі поля.');
            return;
        }

        const newUser = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            userType: userType, // Added userType
            ...(userType === 'doctor'
                ? { specialty: formData.specialty }
                : { phone: formData.phone, appointments: [] }) // Changed age to phone
        };

        try {
            const response = await fetch('http://localhost:8000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                alert('Реєстрація успішна');
                handleBack();
            } else {
                const errorData = await response.json();
                console.error('Помилка при реєстрації:', errorData);
                alert('Помилка при реєстрації');
            }
        } catch (error) {
            console.error('Не вдалося надіслати запит:', error);
            alert('Сталася помилка при відправці запиту');
        }
    };

    return (
        <Container>
            <FormCard>
                <Title>Реєстрація</Title>
                <form onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        name="name"
                        placeholder="Ім'я"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    {/* User type selection */}
                    <UserTypeSelector>
                        <UserTypeButton
                            type="button"
                            active={userType === 'patient'}
                            onClick={() => setUserType('patient')}
                        >
                            Пацієнт
                        </UserTypeButton>
                        <UserTypeButton
                            type="button"
                            active={userType === 'doctor'}
                            onClick={() => setUserType('doctor')}
                        >
                            Лікар
                        </UserTypeButton>
                    </UserTypeSelector>

                    {userType === 'doctor' && (
                        <Input
                            type="text"
                            name="specialty"
                            placeholder="Спеціальність"
                            value={formData.specialty}
                            onChange={handleChange}
                            required
                        />
                    )}

                    {userType === 'patient' && (
                        <Input
                            type="tel" // Changed to tel for phone number input
                            name="phone"
                            placeholder="Номер телефону"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    )}

                    <Button type="submit">Зареєструватися</Button>
                </form>
            </FormCard>
            <Button onClick={handleBack}>Назад</Button>
        </Container>
    );
};

export default RegistrationPage;
