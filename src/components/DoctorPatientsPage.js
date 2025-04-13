import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: linear-gradient(135deg, #f5e8ec, #f7edf3);
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
  padding: 40px 20px;
`;

const Title = styled.h1`
  color: #b25f7f;
  text-align: center;
  margin-bottom: 30px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 20px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 16px;

  &:focus {
    border-color: #c96b8a;
    outline: none;
    box-shadow: 0 0 0 2px rgba(201, 107, 138, 0.2);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 10px;
`;

const Th = styled.th`
  background-color: #c96b8a;
  color: white;
  padding: 14px;
  font-size: 14px;
  text-transform: uppercase;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px 14px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
`;

const Status = styled.span`
  color: ${props => props.status === 'скасовано' ? '#b10000' : '#2b7a2b'};
`;

const BackButton = styled.button`
  background-color: #c5a5b4;
  color: white;
  padding: 10px 24px;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  margin-top: 30px;
  cursor: pointer;

  &:hover {
    background-color: #ae8f9e;
  }
`;

const DoctorPatientsPage = ({ handleBack }) => {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('patients') || '[]');
        setPatients(stored);
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
