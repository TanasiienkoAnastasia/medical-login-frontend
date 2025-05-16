import React, { useEffect, useState } from 'react';
import { useLoading } from '../context/LoadingContext';
import {
    Container,
    Title,
    SearchInput,
    Table,
    Th,
    Td,
    Status,
    BackButton
} from './DoctorAppointmentsPage.styles';
import axios from "axios";
import API_BASE_URL from "../config/api";
import { toast } from 'react-toastify';

const DoctorAppointmentsPage = ({ handleBack }) => {
    const [appointments, setAppointments] = useState([]);
    const [search, setSearch] = useState('');
    const { setLoading } = useLoading();
    const [editingId, setEditingId] = useState(null);
    const [medicalDataInput, setMedicalDataInput] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_BASE_URL}/doctor/appointments`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAppointments(response.data.data);
            } catch (err) {
                toast.error(err.message || 'Помилка при отриманні даних');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // TODO temporary fix to avoid page crash when there are no appointments, fix properly
    const filtered = (appointments ?? []).filter(a =>
    {
        const patientName = a.patient.name.toLowerCase() + ' ' + a.patient.surname.toLowerCase() + a.patient.middleName.toLowerCase();
        return patientName.includes(search.toLowerCase()) ||
            (a?.complaint || '').toLowerCase().includes(search.toLowerCase());
    }
    );

    const saveMedicalData = async (id) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            await axios.patch(`${API_BASE_URL}/doctor/appointments/${id}/medical-data`, {
                medical_data: medicalDataInput
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setAppointments(prev =>
                prev.map(app =>
                    app.id === id ? { ...app, medical_data: medicalDataInput } : app
                )
            );

            toast.success('Медичні дані збережено');
            setEditingId(null);
            setMedicalDataInput('');
        } catch (err) {
            toast.error(err.message || 'Помилка при збереженні');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const response = await axios.patch(`${API_BASE_URL}/doctor/appointments/${id}/status`, {
                status: newStatus
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const updated = response.data.data; // якщо API повертає оновлений об'єкт

            // ❗ Оновити СТАН (таблицю)
            setAppointments(prev =>
                prev.map(app => app.id === updated.id ? updated : app)
            );

            toast.success('Статус оновлено');
        } catch (err) {
            toast.error(err.message || 'Помилка при оновленні статусу');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Container>
            <Title>Список прийомів</Title>
            <SearchInput
                placeholder="Пошук прийому"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            <Table>
                <thead>
                <tr>
                    <Th>Пацієнт</Th>
                    <Th>Вік</Th>
                    <Th>Скарга</Th>
                    <Th>Дата</Th>
                    <Th>Час</Th>
                    <Th>Статус</Th>
                    <Th>Телефон</Th>
                    <Th>Коментар</Th>
                    <Th>Статус</Th>
                    <Th>Медичні данні</Th>
                </tr>
                </thead>
                <tbody>
                {filtered.map((a, i) => (
                    <tr key={i}>
                        <Td>{(a.patient.name || '') + ' ' + (a.patient.surname || '') + ' ' + (a.patient.name || '')}</Td>
                        <Td>{a.patient.age}</Td>
                        <Td>{a.complaint || '-'}</Td>
                        <Td>{a.date || '-'}</Td>
                        <Td>{a.time || '-'}</Td>
                        <Td><Status $status={a.status}>{a.status}</Status></Td>
                        <Td>{a.patient.phone || '-'}</Td>
                        <Td>{a.comment || '-'}</Td>
                        <Td>
                            <Status $status={a.status}>{a.status}</Status>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                                <button onClick={() => updateStatus(a.id, 'упішно')}>Позначити як упішно</button>
                                <button onClick={() => updateStatus(a.id, 'запізнення')}>Позначити як запізнення</button>
                            </div>
                        </Td>
                        <Td>
                            <div>{a.comment || '-'}</div>
                            <div style={{ fontSize: '12px', color: '#555' }}>
                                {a.medical_data ? `Медичні дані: ${a.medical_data}` : ''}
                            </div>

                            {editingId === a.id ? (
                                <div style={{ marginTop: '8px' }}>
      <textarea
          value={medicalDataInput}
          onChange={(e) => setMedicalDataInput(e.target.value)}
          placeholder="Введіть медичні дані"
          rows={3}
          style={{ width: '100%' }}
      />
                                    <button onClick={() => saveMedicalData(a.id)}>Зберегти</button>
                                </div>
                            ) : (
                                <button onClick={() => { setEditingId(a.id); setMedicalDataInput(a.medical_data || '') }}>
                                    Додати медичні дані
                                </button>
                            )}
                        </Td>





                    </tr>
                ))}
                </tbody>
            </Table>


            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <BackButton onClick={handleBack}>Назад</BackButton>
            </div>
        </Container>
    );
};

export default DoctorAppointmentsPage;
