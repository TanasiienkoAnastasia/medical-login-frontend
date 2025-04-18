import React, { useEffect, useState } from 'react';
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

const DoctorAppointmentsPage = ({ handleBack }) => {
    const [appointments, setAppointments] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/doctor/appointments', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAppointments(response.data.data);
            } catch (err) {
                alert(err.message || 'Помилка при отриманні даних');
            }
        }

        fetchData();
    }, []);

    const filtered = appointments.filter(a =>
        a.patient.name.toLowerCase().includes(search.toLowerCase()) ||
        (a?.complaint || '').toLowerCase().includes(search.toLowerCase())
    );

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
                </tr>
                </thead>
                <tbody>
                {filtered.map((a, i) => (
                    <tr key={i}>
                        <Td>{a.patient.name}</Td>
                        <Td>{a.patient.age}</Td>
                        <Td>{a?.complaint || '-'}</Td>
                        <Td>{a?.date || '-'}</Td>
                        <Td>{a?.time || '-'}</Td>
                        <Td><Status status={a.status}>{a.status}</Status></Td>
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
