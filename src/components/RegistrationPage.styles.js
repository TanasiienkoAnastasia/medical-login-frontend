import styled from 'styled-components';

export const Container = styled.div`
  background: linear-gradient(135deg, #ffc0cb, #ffb6c1);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: 'Arial', sans-serif;
  padding: 20px;
`;

export const FormCard = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  margin-bottom: 20px;
`;

export const Title = styled.h1`
  color: #6b2737;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 25px;
  text-align: center;
  width: 100%;
`;

export const Input = styled.input`
  padding: 12px 15px;
  margin: 10px 0;
  font-size: 16px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #d88ea7;
  background-color: #fff;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #b85c75;
    box-shadow: 0 0 0 2px rgba(184, 92, 117, 0.2);
  }
`;

export const Button = styled.button`
  background-color: #d16b86;
  color: white;
  padding: 14px 30px;
  font-size: 18px;
  border: none;
  border-radius: 50px;
  margin-top: 20px;
  cursor: pointer;
  width: 100%;
  max-width: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: #b85c75;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const UserTypeSelector = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const UserTypeButton = styled(Button)`
  background-color: ${props => props.$active ? '#d16b86' : '#f0f0f0'};
  color: ${props => props.$active ? 'white' : '#666'};
  flex: 1;
  margin: 0 10px;
`;
