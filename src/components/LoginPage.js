import React, { useState } from 'react';
import axios from 'axios';
import { useLoading } from '../context/LoadingContext';
import {
    Container,
    Card,
    Title,
    Input,
    SubmitButton,
    BottomRow
} from './LoginPage.styles';
import API_BASE_URL from "../config/api";

const LoginPage = ({ handleRegister, handleLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setLoading } = useLoading();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                email,
                password
            });

            const { access_token, user } = response.data.data;

            handleLoginSuccess(user, access_token);
        } catch (err) {
            alert(err.response?.data?.message || 'Помилка при вході');
        } finally {
            setLoading(false);
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



