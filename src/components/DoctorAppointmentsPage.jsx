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
