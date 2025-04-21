import styled from 'styled-components';

export const Container = styled.div`
  background: linear-gradient(135deg, #f5e8ec, #f7edf3);
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
  padding: 40px 20px;
`;

export const Title = styled.h1`
  color: #b25f7f;
  text-align: center;
  margin-bottom: 30px;
`;

export const SearchInput = styled.input`
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

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 10px;
`;

export const Th = styled.th`
  background-color: #c96b8a;
  color: white;
  padding: 14px;
  font-size: 14px;
  text-transform: uppercase;
  text-align: left;
`;

export const Td = styled.td`
  padding: 12px 14px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
`;

export const Status = styled.span`
  color: ${props => props.$status === 'скасовано' ? '#b10000' : '#2b7a2b'};
`;

export const BackButton = styled.button`
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
