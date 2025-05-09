import React, { useState } from 'react';
import axios from 'axios';
import {
    Container,
    FormCard,
    Title,
    Input,
    Button,
    UserTypeSelector,
    UserTypeButton, ImagePreviewContainer, ImagePreview
} from './RegistrationPage.styles';
import { useLoading } from '../context/LoadingContext';
import API_BASE_URL from "../config/api";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'react-toastify';

const RegistrationPage = ({ handleBack }) => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        middleName: '',
        email: '',
        password: '',
        age: '',
        specialty: '',
        phone: '',
    });

    const [userType, setUserType] = useState('patient');
    const { setLoading } = useLoading();
    const [avatar, setAvatar] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);


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

        if (!formData.age || isNaN(formData.age) || formData.age < 0 || formData.age > 120) {
            errors.push("Вік повинен бути числом від 0 до 120.");
        }

        if (userType === 'doctor' && !formData.specialty.trim()) {
            errors.push("Поле спеціальність є обовʼязковим для лікарів.");
        }

        if (!formData.surname || formData.surname.length < 2) {
            errors.push("Прізвище повинно містити щонайменше 2 символи.");
        }
        if (!formData.middleName || formData.middleName.length < 2) {
            errors.push("По-батькові повинно містити щонайменше 2 символи.");
        }

        if (userType === 'patient') {
            const digitsOnly = formData.phone.replace(/\D/g, '');
            const phoneValid = digitsOnly.length >= 7 && digitsOnly.length <= 20;
            if (!phoneValid) {
                errors.push("Номер телефону повинен містити від 7 до 20 цифр.");
            }
        }

        if (errors.length > 0) {
            toast.error(errors.join('\n'));
            return;
        }

        const formPayload = new FormData();

        formPayload.append('name', formData.name);
        formPayload.append('surname', formData.surname);
        formPayload.append('middleName', formData.middleName);
        formPayload.append('email', formData.email);
        formPayload.append('password', formData.password);
        formPayload.append('userType', userType);
        formPayload.append('age', formData.age);

        if (userType === 'doctor') {
            formPayload.append('specialty', formData.specialty);
        } else {
            formPayload.append('phone', formData.phone);
        }

        if (avatar) {
            formPayload.append('photo', avatar);
        }

        try {
            setLoading(true);

            await axios.post(`${API_BASE_URL}/auth/register`, formPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Реєстрація успішна');
            handleBack();
        } catch (error) {
            const data = error.response?.data;

            if (data?.errors && typeof data.errors === 'object') {
                const messages = Object.entries(data.errors)
                    .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
                    .join('\n');

                toast.error(`Помилки валідації:\n${messages}`);

            } else {
                toast.error(data?.message || 'Помилка при реєстрації');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <FormCard>
                <Title>Реєстрація</Title>
                <form onSubmit={handleSubmit}>
                    {previewUrl && (
                        <ImagePreviewContainer>
                            <ImagePreview src={previewUrl} alt="Прев'ю" />
                        </ImagePreviewContainer>
                    )}

                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setAvatar(file);
                            setPreviewUrl(file ? URL.createObjectURL(file) : null);
                        }}
                    />
                    <Input
                        type="text"
                        name="name"
                        placeholder="Ім'я"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        type="text"
                        name="surname"
                        placeholder="Прізвище"
                        value={formData.surname}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        type="text"
                        name="middleName"
                        placeholder="По-батькові"
                        value={formData.middleName}
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
                    <Input
                        type="number"
                        name="age"
                        placeholder="Вік"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />

                    <UserTypeSelector>
                        <UserTypeButton
                            type="button"
                            $active={userType === 'patient'}
                            onClick={() => setUserType('patient')}
                        >
                            Пацієнт
                        </UserTypeButton>
                        <UserTypeButton
                            type="button"
                            $active={userType === 'doctor'}
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
                        <PhoneInput
                            country={'ua'}
                            value={formData.phone}
                            onChange={(phone) => setFormData({ ...formData, phone })}
                            inputProps={{
                                name: 'phone',
                                required: true,
                                placeholder: 'Номер телефону'
                            }}
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
