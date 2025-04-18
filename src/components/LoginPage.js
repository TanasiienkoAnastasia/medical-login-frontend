import React, { useState } from 'react';
import axios from 'axios';
import {
    Container,
    Card,
    Title,
    Input,
    RoleSwitcher,
    RoleButton,
    SubmitButton,
    BottomRow,
    BackButton
} from './LoginPage.styles';

const LoginPage = ({ handleRegister, handleBack, handleLoginSuccess }) => {
    const [role, setRole] = useState('patient');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/auth/login', {
                email,
                password
            });

            console.log(response)

            const {
                access_token,
                refresh_token,
                access_expires,
                user
            } = response.data.data;

            console.log(access_token, user)
            localStorage.setItem('token', access_token);
            handleLoginSuccess(user);
        } catch (err) {
            alert(err.response?.data?.message || 'Помилка при вході');
        }
    };

    return (
        <Container>
            <Card>
                <Title>Вхід до системи</Title>

                <RoleSwitcher>
                    <RoleButton active={role === 'patient'} onClick={() => setRole('patient')}>
                        Пацієнт
                    </RoleButton>
                    <RoleButton active={role === 'doctor'} onClick={() => setRole('doctor')}>
                        Лікар
                    </RoleButton>
                </RoleSwitcher>

                <form onSubmit={handleLogin}>
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <SubmitButton type="submit">Увійти</SubmitButton>
                </form>

                <BottomRow>
                    <button onClick={handleRegister} style={{ background: 'none', color: '#d63384', border: 'none', cursor: 'pointer' }}>
                        Немає акаунту? Зареєструватися
                    </button>
                    <BackButton onClick={handleBack}>Назад</BackButton>
                </BottomRow>
            </Card>
        </Container>
    );
};

export default LoginPage;



