import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: linear-gradient(135deg, #f5e8ec, #f7edf3);
  min-height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  font-family: 'Segoe UI', sans-serif;
  padding: 20px;
`;

const ContentCard = styled.div`
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: #b25f7f;
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
  border: 1px solid #d8a1b5;
  background-color: #fff;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #c96b8a;
    box-shadow: 0 0 0 2px rgba(201, 107, 138, 0.2);
  }
`;

const DoctorCard = styled.div`
  display: flex;
  background-color: #fff;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  transition: 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
  }
`;

const DoctorImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
  border: 3px solid #d8a1b5;
`;

const DoctorInfo = styled.div`
  flex: 1;
`;

const DoctorName = styled.h3`
  color: #b25f7f;
  margin: 0 0 5px 0;
  font-size: 18px;
`;

const DoctorSpecialty = styled.p`
  color: #8e4a5a;
  margin: 0 0 10px 0;
  font-size: 16px;
`;

const DoctorDetails = styled.p`
  color: #666;
  margin: 0;
  font-size: 14px;
`;

const AvailabilityBadge = styled.span`
  background-color: ${props => props.available ? '#e4f2e4' : '#f9e2e2'};
  color: ${props => props.available ? '#3e7a3e' : '#a75f5f'};
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  display: inline-block;
  margin-top: 10px;
`;

const Button = styled.button`
  background-color: #c96b8a;
  color: white;
  padding: 14px 30px;
  font-size: 18px;
  border: none;
  border-radius: 50px;
  margin-top: 15px;
  cursor: pointer;
  width: 100%;
  max-width: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    background-color: #b25f7f;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const BackButton = styled(Button)`
  background-color: #c5a5b4;
  &:hover {
    background-color: #ae8f9e;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const FilterButton = styled.button`
  background-color: ${props => props.active ? '#c96b8a' : '#f3e6ec'};
  color: ${props => props.active ? 'white' : '#6c757d'};
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.active ? '#b25f7f' : '#e9dfe6'};
  }
`;

const DoctorsListPage = ({ handleBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    const doctors = [/*...тут масив як у вас...*/];

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());

        if (activeFilter === 'all') return matchesSearch;
        if (activeFilter === 'available') return matchesSearch && doctor.available;
        return matchesSearch;
    });

    const handleDoctorClick = (doctor) => {
        alert(`Обрано лікаря: ${doctor.name}`);
    };

    return (
        <Container>
            <ContentCard>
                <Title>Список лікарів</Title>

                <SearchInput
                    type="text"
                    placeholder="Пошук лікаря за ім'ям або спеціальністю"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <FilterSection>
                    <FilterButton active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>
                        Усі лікарі
                    </FilterButton>
                    <FilterButton active={activeFilter === 'available'} onClick={() => setActiveFilter('available')}>
                        Доступні зараз
                    </FilterButton>
                </FilterSection>

                {filteredDoctors.length > 0 ? (
                    filteredDoctors.map(doctor => (
                        <DoctorCard key={doctor.id} onClick={() => handleDoctorClick(doctor)}>
                            <DoctorImage src={doctor.imageUrl} alt={doctor.name} />
                            <DoctorInfo>
                                <DoctorName>{doctor.name}</DoctorName>
                                <DoctorSpecialty>{doctor.specialty}</DoctorSpecialty>
                                <DoctorDetails>{doctor.details}</DoctorDetails>
                                <AvailabilityBadge available={doctor.available}>
                                    {doctor.available ? 'Доступний' : 'Не доступний'}
                                </AvailabilityBadge>
                            </DoctorInfo>
                        </DoctorCard>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: '#8e4a5a' }}>
                        Лікарів не знайдено. Спробуйте змінити критерії пошуку.
                    </p>
                )}
            </ContentCard>

            <BackButton onClick={handleBack}>Назад</BackButton>
        </Container>
    );
};

export default DoctorsListPage;

