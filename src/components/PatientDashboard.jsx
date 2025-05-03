import React, { useState, useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';
import { FaSignOutAlt, FaPlus, FaEdit, FaSave, FaTrash } from 'react-icons/fa';
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
import API_BASE_URL from "../config/api";

const PatientDashboard = ({ onLogout }) => {
    const [appointments, setAppointments] = useState([]);

    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
    };
    
    const [form, setForm] = useState({
        date: getTodayDate(),
        time: '',
        complaint: '',
        doctor: '',
        injuryType: '',
        comment: ''
    });
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [patient, setPatient] = useState({});
    const { setLoading } = useLoading();

    const isTimeWithinRange = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;
        const start = 9 * 60;   // 09:00
        const end = 17 * 60;    // 17:00
        return totalMinutes >= start && totalMinutes <= end;
    };

    const getMaxDate = () => {
        const today = new Date();
        today.setMonth(today.getMonth() + 2);
        return today.toISOString().split('T')[0]; // формат YYYY-MM-DD
    };

    const isDateWithinTwoMonths = (dateStr) => {
        const selectedDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 2);
        maxDate.setHours(0, 0, 0, 0);
        return selectedDate >= today && selectedDate <= maxDate;
    };

    const emptyForm = {
        date: getTodayDate(),
        time: '',
        complaint: '',
        doctor: '',
        injuryType: '',
        comment: ''
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        const fetchAppointmentsData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/patient/appointments`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAppointments(response.data.data ?? []);
            } catch (err) {
                alert(err.message || 'Помилка при отриманні даних');
            } finally {
                setLoading(false);
            }
        };

        const fetchPatientProfile = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/patient/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPatient(response.data);
            } catch (error) {
                console.error('Не вдалося завантажити профіль:', error);
            }
        };

        fetchAppointmentsData();
        fetchPatientProfile();
    }, []);

    useEffect(() => {
        const fetchRecommendedDoctors = async () => {
            if (!form.injuryType) return;
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_BASE_URL}/recommendations?injury=${form.injuryType}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDoctors(response.data.data ?? []);
            } catch (err) {
                console.error('Не вдалося отримати рекомендації лікарів', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendedDoctors();
    }, [form.injuryType]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddAppointment = async (e) => {
        e.preventDefault();
        if (!form.date || !form.time || !form.complaint || !form.doctor) return alert('Заповніть усі поля');

        if (!isTimeWithinRange(form.time)) {
            return alert('Час прийому має бути у межах з 09:00 до 17:00');
        }

        if (!isDateWithinTwoMonths(form.date)) {
            return alert('Дата прийому має бути не пізніше ніж через 2 місяці від сьогодні');
        }

        const newAppointment = {
            date: form.date,
            time: form.time,
            complaint: form.complaint,
            comment: form.comment,
            doctor_id: parseInt(form.doctor),
            patient_id: patient.id,
            status: 'scheduled'
        };

        const token = localStorage.getItem('token');
        try {
            setLoading(true);

            const response = await axios.post(
                `${API_BASE_URL}/patient/appointments`,
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
            setForm(emptyForm);
        } catch (error) {
            console.error('Помилка при створенні прийому:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Не вдалося створити прийом');
        } finally {
            setLoading(false);
        }
    };

    const handleEditAppointment = (index) => {
        const appointment = appointments[index];
        setEditingAppointment(index);
        setForm({
            date: appointment.date,
            time: appointment.time,
            complaint: appointment.complaint,
            comment: appointment.comment || '',
            doctor: appointment.doctor.id,
            injuryType: ''
        });
    };

    const handleSaveAppointment = async () => {
        if (!isTimeWithinRange(form.time)) {
            return alert('Час прийому має бути у межах з 09:00 до 17:00');
        }

        if (!isDateWithinTwoMonths(form.date)) {
            return alert('Дата прийому має бути не пізніше ніж через 2 місяці від сьогодні');
        }

        const appointmentToUpdate = appointments[editingAppointment];
        const token = localStorage.getItem('token');

        const updatedData = {
            date: form.date,
            time: form.time,
            complaint: form.complaint,
            comment: form.comment,
            doctor_id: parseInt(form.doctor),
        };

        try {
            setLoading(true);

            await axios.put(
                `${API_BASE_URL}/patient/appointments/${appointmentToUpdate.id}`,
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
            setForm(emptyForm);

            alert('Прийом оновлено');
        } catch (error) {
            console.error('Помилка при оновленні прийому:', error.response?.data || error.message);
            alert('Не вдалося оновити прийом');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAppointment = async (index) => {
        const appointment = appointments[index];
        const token = localStorage.getItem('token');

        try {
            setLoading(true);

            await axios.put(
                `${API_BASE_URL}/patient/appointments/${appointment.id}`,
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
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingAppointment(null);
        setForm(emptyForm);

    };

    return (
        <Container>
            <Card>
                <Title>👤 Кабінет пацієнта</Title>
                <div style={{ padding: '10px' }}>
                    <p><strong>Ім'я:</strong> {patient?.name || '—'}</p>
                    <p><strong>Прізвище:</strong> {patient?.surname || '—'}</p>
                    <p><strong>По батькові:</strong> {patient?.middle_name || '—'}</p>
                    <p><strong>Email:</strong> {patient?.email || '—'}</p>
                    <p><strong>Телефон:</strong> {patient?.phone || '—'}</p>
                    <p><strong>Вік:</strong> {patient?.age || '—'}</p>
                </div>
                <h3 style={{ marginTop: '20px', color: '#6b2737' }}>📅 Новий прийом</h3>
                <Form onSubmit={handleAddAppointment}>
                    <Label>Дата</Label>
                    <Input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        min={getTodayDate()}
                        max={getMaxDate()}
                        required
                    />

                    <Label>Час</Label>
                    <Input type="time" name="time" value={form.time} min="09:00" max="17:00" onChange={handleChange} required />

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
                                {doctor.name} ({doctor.specialty})
                            </option>
                        ))}
                    </Select>

                    <Label>Коментар</Label>
                    <Input
                        type="text"
                        name="comment"
                        placeholder="Коментар (необов'язково)"
                        value={form.comment}
                        onChange={handleChange}
                    />

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
                            <strong>Коментар:</strong> {app.comment || '—'}<br />
                            <strong>Лікар:</strong> {(app.doctor.name || '') + ' ' + (app.doctor.surname || '') + ' ' + (app.doctor.middleName || '')} ({app.doctor.specialty})<br />
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
                        <Input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            min={getTodayDate()}
                            max={getMaxDate()}
                            required
                        />

                        <Label>Час</Label>
                        <Input type="time" name="time" value={form.time} min="09:00" max="17:00" onChange={handleChange} required />

                        <Label>Скарга</Label>
                        <Input type="text" name="complaint" value={form.complaint} onChange={handleChange} required />

                        <Label>Коментар</Label>
                        <Input type="text" name="comment" value={form.comment} onChange={handleChange} />

                        <Label>Лікар</Label>
                        <Select name="doctor" value={form.doctor} onChange={handleChange} required>
                            <option value="">Оберіть лікаря</option>
                            {doctors.map((doctor, index) => (
                                <option key={index} value={doctor.id}>
                                    {doctor.name} ({doctor.specialty})
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
