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

        const errors = [];

        if (!formData.name || formData.name.length < 2) {
            errors.push("Ім'я повинно містити щонайменше 2 символи.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            errors.push("Некоректний формат email.");
        }

        if (!formData.password || formData.password.length < 6) {
            errors.push("Пароль повинен містити щонайменше 6 символів.");
        }

        if (userType === 'doctor' && !formData.specialty.trim()) {
            errors.push("Поле спеціальність є обовʼязковим для лікарів.");
        }

        if (userType === 'patient') {
            const phoneValid = formData.phone.length >= 7 && formData.phone.length <= 20;
            if (!phoneValid) {
                errors.push("Номер телефону повинен містити від 7 до 20 цифр.");
            }
        }

        if (errors.length > 0) {
            alert(errors.join('\n'));
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
        } catch (error) {
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
                            type="tel"
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
