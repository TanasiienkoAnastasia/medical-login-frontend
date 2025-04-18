import styled from 'styled-components';

export const Container = styled.div`
  background: linear-gradient(135deg, #ffe4ec, #ffd6e3);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-family: 'Arial', sans-serif;
  padding: 40px 20px;
`;

export const Card = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: 30px;
  width: 100%;
  max-width: 550px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export const Title = styled.h1`
  color: #6b2737;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 20px;
`;

export const LogoutButton = styled.button`
  margin-top: 30px;
  background-color: #ff6b6b;
  color: white;
  padding: 12px 25px;
  font-size: 16px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    background-color: #e54343;
  }
`;

export const AppointmentItem = styled.li`
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 10px;
  text-align: left;
`;

export const Form = styled.form`
  margin-top: 25px;
  text-align: left;
`;

export const Label = styled.label`
  display: block;
  margin-top: 10px;
  font-weight: bold;
  color: #6b2737;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

export const AddButton = styled.button`
  margin-top: 20px;
  background-color: #6cb17e;
  color: white;
  padding: 10px 20px;
  font-weight: bold;
  border: none;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background-color: #559965;
  }
`;

export const EditButton = styled.button`
  background-color: #ffa500;
  color: white;
  padding: 6px 12px;
  font-weight: bold;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background-color: #cc8400;
  }
`;

export const SaveButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 6px 12px;
  font-weight: bold;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background-color: #388e3c;
  }
`;

export const CancelButton = styled.button`
  background-color: #b10000;
  color: white;
  padding: 6px 12px;
  font-weight: bold;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background-color: #9b0000;
  }
`;
