import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: linear-gradient(135deg, #ffc0cb, #ffb6c1);
  min-height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  font-family: 'Arial', sans-serif;
  padding: 20px;
`;

const ContentCard = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: #6b2737;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 25px;
  text-align: center;
  width: 100%;
`;

const SearchInput = styled.input`
  padding: 12px 15px;
  margin-bottom: 20px;
  font-size: 16px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #d88ea7;
  background-color: #fff;
  &:focus {
    outline: none;
    border-color: #b85c75;
    box-shadow: 0 0 0 2px rgba(184, 92, 117, 0.2);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  padding: 15px;
  text-align: left;
  background-color: #d88ea7;
  color: white;
  font-size: 14px;
  text-transform: uppercase;
`;

const Td = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  color: #333;
`;

const Tr = styled.tr`
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #f9f0f2;
  }
`;

const StatusBadge = styled.span`
  background-color: ${props =>
    props.status === 'scheduled' ? '#e5f1ff' :
        props.status === 'completed' ? '#c1e5c1' :
            props.status === 'cancelled' ? '#f5d8d8' : '#f0f0f0'};
  color: ${props =>
    props.status === 'scheduled' ? '#1a73e8' :
        props.status === 'completed' ? '#2a6e2a' :
            props.status === 'cancelled' ? '#933a3a' : '#666'};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const FilterButton = styled.button`
  background-color: ${props => props.active ? '#d16b86' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#666'};
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.active ? '#b85c75' : '#e0e0e0'};
  }
`;

const ActionButton = styled.button`
  background-color: ${props => props.primary ? '#d16b86' : '#f0f0f0'};
  color: ${props => props.primary ? 'white' : '#666'};
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  margin-right: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.primary ? '#b85c75' : '#e0e0e0'};
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 5px;
`;

const Button = styled.button`
  background-color: #d16b86;
  color: white;
  padding: 14px 30px;
  font-size: 18px;
  border: none;
  border-radius: 50px;
  margin-top: 15px;
  cursor: pointer;
`;

const BackButton = styled(Button)`
  background-color: #a8a8a8;
  &:hover {
    background-color: #8a8a8a;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 5px;
`;

const PageButton = styled.button`
  background-color: ${props => props.active ? '#d16b86' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#666'};
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.active ? '#b85c75' : '#e0e0e0'};
  }
`;

const PatientsListPage = ({ handleBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const patientsPerPage = 5;

    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('patients') || '[]');
        setPatients(stored);
    }, []);

    const filteredPatients = patients.filter(patient => {
        const matches = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (patient.complaint || '').toLowerCase().includes(searchTerm.toLowerCase());
        if (activeFilter === 'all') return matches;
        return matches && patient.status === activeFilter;
    });

    const indexOfLast = currentPage * patientsPerPage;
    const indexOfFirst = indexOfLast - patientsPerPage;
    const currentPatients = filteredPatients.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

    const getStatusText = status =>
        status === 'scheduled' ? 'Заплановано' :
            status === 'completed' ? 'Завершено' :
                status === 'cancelled' ? 'Скасовано' : status;

    const handleEdit = (e, patient) => {
        e.stopPropagation();
        alert(`Редагування пацієнта: ${patient.name}`);
    };

    const handleCancel = (e, patient) => {
        e.stopPropagation();
        alert(`Скасування прийому: ${patient.name}`);
    };

    return (
        <Container>
            <ContentCard>
                <Title>Список пацієнтів</Title>

                <SearchInput
                    placeholder="Пошук пацієнта за ім'ям або скаргою"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />

                <FilterSection>
                    {['all', 'scheduled', 'completed', 'cancelled'].map(filter => (
                        <FilterButton
                            key={filter}
                            active={activeFilter === filter}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter === 'all' ? 'Усі пацієнти' :
                                filter === 'scheduled' ? 'Заплановані' :
                                    filter === 'completed' ? 'Завершені' :
                                        'Скасовані'}
                        </FilterButton>
                    ))}
                </FilterSection>

                {currentPatients.length ? (
                    <>
                        <Table>
                            <thead>
                            <tr>
                                <Th>Пацієнт</Th>
                                <Th>Вік</Th>
                                <Th>Дата/Час</Th>
                                <Th>Скарга</Th>
                                <Th>Статус</Th>
                                <Th>Дії</Th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentPatients.map((p, idx) => (
                                <Tr key={idx}>
                                    <Td>{p.name}</Td>
                                    <Td>{p.age || '-'}</Td>
                                    <Td>{p.appointmentDate || '-'}<br/>{p.appointmentTime || '-'}</Td>
                                    <Td>{p.complaint || '-'}</Td>
                                    <Td><StatusBadge status={p.status}>{getStatusText(p.status)}</StatusBadge></Td>
                                    <Td>
                                        <ButtonsContainer>
                                            <ActionButton primary onClick={e => handleEdit(e, p)}>Редагувати</ActionButton>
                                            {p.status === 'scheduled' &&
                                                <ActionButton onClick={e => handleCancel(e, p)}>Скасувати</ActionButton>}
                                        </ButtonsContainer>
                                    </Td>
                                </Tr>
                            ))}
                            </tbody>
                        </Table>
                        {totalPages > 1 && (
                            <Pagination>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <PageButton key={i + 1} active={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
                                        {i + 1}
                                    </PageButton>
                                ))}
                            </Pagination>
                        )}
                    </>
                ) : (
                    <p style={{ textAlign: 'center', color: '#8e4a5a' }}>Пацієнтів не знайдено.</p>
                )}
            </ContentCard>

            <BackButton onClick={handleBack}>Назад</BackButton>
        </Container>
    );
};

export default PatientsListPage;
