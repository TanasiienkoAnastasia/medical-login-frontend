import styled, { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  background: linear-gradient(135deg, #fddde6, #fce1f2);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Segoe UI', sans-serif;
  animation: ${fadeIn} 0.8s ease-out;
  padding: 20px;
`;

export const Card = styled.div`
  background: white;
  padding: 40px 30px;
  border-radius: 20px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export const Title = styled.h2`
  color: #d63384;
  margin-bottom: 20px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;

  &:focus {
    border-color: #f783ac;
    outline: none;
    box-shadow: 0 0 0 2px rgba(247, 131, 172, 0.2);
  }
`;

export const RoleSwitcher = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
`;

export const RoleButton = styled.button`
  background-color: ${props => props.active ? '#f783ac' : '#f8f0f3'};
  color: ${props => props.active ? 'white' : '#6c757d'};
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: ${props => props.active ? '#e85a9a' : '#f3e1e8'};
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  background-color: #e64980;
  color: white;
  padding: 14px;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  margin-top: 15px;
  cursor: pointer;

  &:hover {
    background-color: #d63384;
  }
`;

export const BottomRow = styled.div`
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const BackButton = styled.button`
  background-color: #d6a3c9;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background-color: #bd8db8;
  }
`;
