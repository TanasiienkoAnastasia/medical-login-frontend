import React, { useState } from 'react';
import axios from 'axios';
import {
    Container,
    Card,
    Title,
    Input,
    SubmitButton,
    BottomRow
} from './LoginPage.styles';

const LoginPage = ({ handleRegister, handleLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/auth/login', {
                email,
                password
            });

            const { access_token, user } = response.data.data;

            handleLoginSuccess(user, access_token);
        } catch (err) {
            alert(err.response?.data?.message || 'Помилка при вході');
        }
    };

    return (
        <Container>
            <Card>
                <Title>Вхід до системи</Title>

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
                </BottomRow>
            </Card>
        </Container>
    );
};

export default LoginPage;



