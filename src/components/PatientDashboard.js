import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSignOutAlt, FaPlus, FaEdit, FaSave, FaTrash } from 'react-icons/fa';

// Styled components
const Container = styled.div`
  background: linear-gradient(135deg, #ffe4ec, #ffd6e3);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-family: 'Arial', sans-serif;
  padding: 40px 20px;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: 30px;
  width: 100%;
  max-width: 550px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h1`
  color: #6b2737;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const LogoutButton = styled.button`
  margin-top: 30px;
  background-color: #ff6b6b;
  color: white;
  padding: 12px 25px;
  font-size: 16px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    background-color: #e54343;
  }
`;

const AppointmentItem = styled.li`
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 10px;
  text-align: left;
`;

const Form = styled.form`
  margin-top: 25px;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-top: 10px;
  font-weight: bold;
  color: #6b2737;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const AddButton = styled.button`
  margin-top: 20px;
  background-color: #6cb17e;
  color: white;
  padding: 10px 20px;
  font-weight: bold;
  border: none;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background-color: #559965;
  }
`;

const EditButton = styled.button`
  background-color: #ffa500;
  color: white;
  padding: 6px 12px;
  font-weight: bold;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background-color: #cc8400;
  }
`;

const SaveButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 6px 12px;
  font-weight: bold;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background-color: #388e3c;
  }
`;

const CancelButton = styled.button`
  background-color: #b10000;
  color: white;
  padding: 6px 12px;
  font-weight: bold;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background-color: #9b0000;
  }
`;

// Injury Recommendation logic (same as before)
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
        // Add more injuries here...
    };

    useEffect(() => {
        const selectedSpecialties = injurySpecialties[injuryType] || [];
        const recommendedDoctors = doctors.filter(doctor =>
            selectedSpecialties.includes(doctor.specialty)
        );
        setDoctors(recommendedDoctors);
    }, [injuryType, setDoctors]);

    return null;
};

const PatientDashboard = ({ patient, onLogout }) => {
    const [appointments, setAppointments] = useState(patient.appointments || []);
    const [form, setForm] = useState({ date: '', time: '', complaint: '', doctor: '', injuryType: '' });
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const storedDoctors = JSON.parse(localStorage.getItem('doctors') || '[]');
        setDoctors(storedDoctors);
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

        const updated = [...appointments, newAppointment];
        setAppointments(updated);

        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const updatedPatients = patients.map((p) =>
            p.email === patient.email ? { ...p, appointments: updated } : p
        );
        localStorage.setItem('patients', JSON.stringify(updatedPatients));
        localStorage.setItem('currentUser', JSON.stringify({ ...patient, appointments: updated }));

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

        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const updatedPatients = patients.map((p) =>
            p.email === patient.email ? { ...p, appointments: updatedAppointments } : p
        );
        localStorage.setItem('patients', JSON.stringify(updatedPatients));
        localStorage.setItem('currentUser', JSON.stringify({ ...patient, appointments: updatedAppointments }));
        setForm({ date: '', time: '', complaint: '', doctor: '', injuryType: '' });
    };

    const handleCancelAppointment = (index) => {
        const updatedAppointments = [...appointments];
        updatedAppointments[index] = {
            ...updatedAppointments[index],
            status: 'скасовано',
        };
        setAppointments(updatedAppointments);

        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const updatedPatients = patients.map((p) =>
            p.email === patient.email ? { ...p, appointments: updatedAppointments } : p
        );
        localStorage.setItem('patients', JSON.stringify(updatedPatients));
        localStorage.setItem('currentUser', JSON.stringify({ ...patient, appointments: updatedAppointments }));
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









