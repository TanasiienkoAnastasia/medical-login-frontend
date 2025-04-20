import React, { useState, useEffect } from 'react';
import { FaSignOutAlt, FaPlus, FaEdit, FaSave, FaTrash } from 'react-icons/fa';
import { jwtDecode } from "jwt-decode";
import {
    Container,
    Card,
    Title,
    LogoutButton,
    AppointmentItem,
    Form,
    Label,
    Input,
    Select,
    AddButton,
    EditButton,
    SaveButton,
    CancelButton
} from './PatientDashboard.styles';
import axios from "axios";

const PatientDashboard = ({ onLogout }) => {
    const [appointments, setAppointments] = useState([]);
    const [form, setForm] = useState({ date: '', time: '', complaint: '', doctor: '', injuryType: '' });
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [patient, setPatient] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        setPatient(decoded);

        const fetchAppointmentsData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/patient/appointments', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAppointments(response.data.data ?? []);
            } catch (err) {
                alert(err.message || 'Помилка при отриманні даних');
            }
        }

        fetchAppointmentsData();
    }, []);

    useEffect(() => {
        const fetchRecommendedDoctors = async () => {
            if (!form.injuryType) return;
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://127.0.0.1:8000/recommendations?injury=${form.injuryType}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDoctors(response.data.data ?? []);
            } catch (err) {
                console.error('Не вдалося отримати рекомендації лікарів', err);
            }
        }

        fetchRecommendedDoctors();
    }, [form.injuryType]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddAppointment = async (e) => {
        e.preventDefault();
        if (!form.date || !form.time || !form.complaint || !form.doctor) return alert('Заповніть усі поля');

        const newAppointment = {
            date: form.date,
            time: form.time,
            complaint: form.complaint,
            doctor_id: parseInt(form.doctor),
            patient_id: patient.id,
            status: 'scheduled'
        };

        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/appointments',
                newAppointment,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            alert('Прийом створено');
            setAppointments([...appointments, response.data.data]);
            setForm({ date: '', time: '', complaint: '', doctor: '', injuryType: '' });
        } catch (error) {
            console.error('Помилка при створенні прийому:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Не вдалося створити прийом');
        }
    };

    const handleEditAppointment = (index) => {
        const appointment = appointments[index];
        setEditingAppointment(index);
        setForm({
            date: appointment.date,
            time: appointment.time,
            complaint: appointment.complaint,
            doctor: appointment.doctor.id,
            injuryType: ''
        });
    };

    const handleSaveAppointment = async () => {
        const appointmentToUpdate = appointments[editingAppointment];
        const token = localStorage.getItem('token');

        const updatedData = {
            date: form.date,
            time: form.time,
            complaint: form.complaint,
            doctor_id: parseInt(form.doctor),
        };

        try {
            await axios.put(
                `http://127.0.0.1:8000/appointments/${appointmentToUpdate.id}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            const updatedAppointments = [...appointments];
            updatedAppointments[editingAppointment] = {
                ...updatedAppointments[editingAppointment],
                ...updatedData,
                doctor: doctors.find(d => d.id === parseInt(form.doctor)) || updatedAppointments[editingAppointment].doctor
            };

            setAppointments(updatedAppointments);
            setEditingAppointment(null);
            setForm({ date: '', time: '', complaint: '', doctor: '', injuryType: '' });
            alert('Прийом оновлено');
        } catch (error) {
            console.error('Помилка при оновленні прийому:', error.response?.data || error.message);
            alert('Не вдалося оновити прийом');
        }
    };

    const handleCancelAppointment = async (index) => {
        const appointment = appointments[index];
        const token = localStorage.getItem('token');

        try {
            await axios.put(
                `http://127.0.0.1:8000/appointments/${appointment.id}`,
                { status: 'скасовано' },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const updated = [...appointments];
            updated[index].status = 'скасовано';
            setAppointments(updated);

            alert('Прийом успішно скасовано');
        } catch (error) {
            console.error('Помилка при скасуванні прийому:', error.response?.data || error.message);
            alert('Не вдалося скасувати прийом');
        }
    };

    const handleCancelEdit = () => {
        setEditingAppointment(null);
        setForm({ date: '', time: '', complaint: '', doctor: '', injuryType: '' });
    };

    return (
        <Container>
            <Card>
                <Title>👤 Пацієнт: {patient?.userName ?? ''}</Title>

                <h3 style={{ marginTop: '20px', color: '#6b2737' }}>📅 Новий прийом</h3>
                <Form onSubmit={handleAddAppointment}>
                    <Label>Дата</Label>
                    <Input type="date" name="date" value={form.date} onChange={handleChange} required />

                    <Label>Час</Label>
                    <Input type="time" name="time" value={form.time} onChange={handleChange} required />

                    <Label>Скарга</Label>
                    <Input type="text" name="complaint" value={form.complaint} onChange={handleChange} required />

                    <Label>Підозра на тип травми</Label>
                    <Select name="injuryType" value={form.injuryType} onChange={handleChange} required>
                        <option value="">Оберіть травму</option>
                        <option value="перелом">Перелом</option>
                        <option value="вивих">Вивих</option>
                        <option value="розтягнення">Розтягнення</option>
                    </Select>

                    <Label>Лікар</Label>
                    <Select name="doctor" value={form.doctor} onChange={handleChange} required>
                        <option value="">Оберіть лікаря</option>
                        {doctors.map((doctor, index) => (
                            <option key={index} value={doctor.id}>
                                {doctor.username} ({doctor.specialty})
                            </option>
                        ))}
                    </Select>

                    <AddButton type="submit">
                        <FaPlus /> Додати
                    </AddButton>
                </Form>

                <h3 style={{ marginTop: '30px', color: '#6b2737' }}>🗂 Історія прийомів</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {appointments.map((app, index) => (
                        <AppointmentItem key={index}>
                            <strong>Дата:</strong> {app.date}<br />
                            <strong>Час:</strong> {app.time}<br />
                            <strong>Скарга:</strong> {app.complaint}<br />
                            <strong>Лікар:</strong> {app.doctor.username} ({app.doctor.specialty})<br />
                            <strong>Статус:</strong>{' '}
                            <span style={{ color: app.status === 'скасовано' ? '#b10000' : '#2b7a2b' }}>
                                {app.status}
                            </span><br />
                            <EditButton onClick={() => handleEditAppointment(index)}>
                                <FaEdit /> Редагувати
                            </EditButton>
                            <CancelButton onClick={() => handleCancelAppointment(index)}>
                                <FaTrash /> Скасувати
                            </CancelButton>
                        </AppointmentItem>
                    ))}
                </ul>

                {editingAppointment !== null && (
                    <Form onSubmit={(e) => { e.preventDefault(); handleSaveAppointment(); }}>
                        <Label>Дата</Label>
                        <Input type="date" name="date" value={form.date} onChange={handleChange} required />

                        <Label>Час</Label>
                        <Input type="time" name="time" value={form.time} onChange={handleChange} required />

                        <Label>Скарга</Label>
                        <Input type="text" name="complaint" value={form.complaint} onChange={handleChange} required />

                        <Label>Лікар</Label>
                        <Select name="doctor" value={form.doctor} onChange={handleChange} required>
                            <option value="">Оберіть лікаря</option>
                            {doctors.map((doctor, index) => (
                                <option key={index} value={doctor.id}>
                                    {doctor.username} ({doctor.specialty})
                                </option>
                            ))}
                        </Select>

                        <SaveButton type="submit"><FaSave /> Зберегти</SaveButton>
                        <button onClick={handleCancelEdit} style={{ background: '#ccc', padding: '8px 16px', borderRadius: '15px', marginLeft: '10px' }}>Скасувати</button>
                    </Form>
                )}

                <LogoutButton onClick={onLogout}>
                    <FaSignOutAlt /> Вийти
                </LogoutButton>
            </Card>
        </Container>
    );
};

export default PatientDashboard;
