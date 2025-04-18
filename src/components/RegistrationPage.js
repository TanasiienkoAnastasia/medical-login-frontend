import React, { useState } from 'react';
import axios from 'axios';
import {
    Container,
    FormCard,
    Title,
    Input,
    Button,
    UserTypeSelector,
    UserTypeButton
} from './RegistrationPage.styles';

const RegistrationPage = ({ handleBack }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        specialty: '',
        phone: '',
    });

    const [userType, setUserType] = useState('patient');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            userType: userType,
            ...(userType === 'doctor'
                ? { specialty: formData.specialty }
                : { phone: formData.phone })
        };

        try {
            await axios.post('http://127.0.0.1:8000/auth/register', newUser);
            alert('Реєстрація успішна');
            handleBack();
        }
        catch (error) {
            const data = error.response?.data;

            if (data?.errors && typeof data.errors === 'object') {
                const messages = Object.entries(data.errors)
                    .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
                    .join('\n');

                alert(`Помилки валідації:\n${messages}`);
            } else {
                alert(data?.message || 'Помилка при реєстрації');
            }
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
