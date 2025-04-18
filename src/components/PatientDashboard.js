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

// TODO should be moved to backend
// TODO add doctor rating to backend???
const InjuryRecommendation = ({ injuryType, setDoctors }) => {
    const doctors = [
        { id: 1, name: 'Іван Петрович', specialty: 'травматолог', rating: 4.5 },
        { id: 2, name: 'Марія Олексіївна', specialty: 'ортопед', rating: 4.8 },
        { id: 3, name: 'Анна Володимирівна', specialty: 'хірург', rating: 4.2 },
        // Add other doctors here...
    ];

    const injurySpecialties = {
        'перелом': ['травматолог', 'ортопед'],
        'вивих': ['травматолог', 'ортопед'],
        'розтягнення': ['травматолог'],
    };

    useEffect(() => {
        const selectedSpecialties = injurySpecialties[injuryType] || [];
        const recommendedDoctors = doctors.filter(doctor =>
            selectedSpecialties.includes(doctor.specialty)
        );
        setDoctors(recommendedDoctors);
    }, [doctors, injurySpecialties, injuryType, setDoctors]);

    return null;
};

const PatientDashboard = ({ onLogout }) => {
    const [appointments, setAppointments] = useState([]);
    const [form, setForm] = useState({ date: '', time: '', complaint: '', doctor: '', injuryType: '' });
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [patient, setPatient] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        setPatient(decoded.user);

        const fetchAppointmentsData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/patient/appointments', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAppointments(response.data.data);
            } catch (err) {
                alert(err.message || 'Помилка при отриманні даних');
            }
        }
        const fetchDoctorsData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/doctors', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDoctors(response.data.data);
            } catch (err) {
                alert(err.message || 'Помилка при отриманні даних');
            }
        }

        fetchAppointmentsData();
        fetchDoctorsData();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddAppointment = (e) => {
        e.preventDefault();
        if (!form.date || !form.time || !form.complaint || !form.doctor) return alert('Заповніть усі поля');

        const newAppointment = {
            date: form.date,
            time: form.time,
            complaint: form.complaint,
            doctor: form.doctor,
            status: 'очікується',
        };

        // TODO send API request to create new appointment for current patient

        setForm({ date: '', time: '', complaint: '', doctor: '', injuryType: '' });
    };

    const handleEditAppointment = (index) => {
        const appointment = appointments[index];
        setEditingAppointment(index);
        setForm({
            date: appointment.date,
            time: appointment.time,
            complaint: appointment.complaint,
            doctor: appointment.doctor,
            injuryType: appointment.injuryType,
        });
    };

    const handleSaveAppointment = () => {
        const updatedAppointments = [...appointments];
        updatedAppointments[editingAppointment] = {
            ...updatedAppointments[editingAppointment],
            ...form,
        };
        setAppointments(updatedAppointments);
        setEditingAppointment(null);

        // TODO send request to API to update given appointment

        setForm({ date: '', time: '', complaint: '', doctor: '', injuryType: '' });
    };

    const handleCancelAppointment = (index) => {
        // TODO send API request to cancel given appointment for current user
    };

    const handleCancelEdit = () => {
        setEditingAppointment(null);
        setForm({ date: '', time: '', complaint: '', doctor: '', injuryType: '' });
    };

    return (
        <Container>
            <Card>
                <Title>👤 Пацієнт: {patient.name}</Title>

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
                        {/* Add more injuries */}
                    </Select>

                    <InjuryRecommendation injuryType={form.injuryType} setDoctors={setDoctors} />

                    <Label>Лікар</Label>
                    <Select name="doctor" value={form.doctor} onChange={handleChange} required>
                        <option value="">Оберіть лікаря</option>
                        {doctors.map((doctor, index) => (
                            <option key={index} value={doctor.name}>
                                {doctor.name}
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
                            <strong>Лікар:</strong> {app.doctor}<br />
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
                                <option key={index} value={doctor.name}>
                                    {doctor.name}
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









