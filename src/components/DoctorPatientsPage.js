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
} from './DoctorPatientsPage.styles';

const DoctorPatientsPage = ({ handleBack }) => {
    const [patients] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        // TODO load patients of this doctor from API
        // use setPatients()
    }, []);

    const filtered = patients.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.appointments?.[0]?.complaint || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container>
            <Title>Список пацієнтів</Title>
            <SearchInput
                placeholder="Пошук пацієнта або скарги"
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
                {filtered.map((p, i) => (
                    <tr key={i}>
                        <Td>{p.name}</Td>
                        <Td>{p.age}</Td>
                        <Td>{p.appointments?.[0]?.complaint || '-'}</Td>
                        <Td>{p.appointments?.[0]?.date || '-'}</Td>
                        <Td>{p.appointments?.[0]?.time || '-'}</Td>
                        <Td><Status status={p.appointments?.[0]?.status}>{p.appointments?.[0]?.status}</Status></Td>
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

export default DoctorPatientsPage;
