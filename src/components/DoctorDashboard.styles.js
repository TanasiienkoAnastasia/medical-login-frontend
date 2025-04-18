import styled from 'styled-components';

export const Navbar = styled.div`
  width: 100%;
  background-color: #f3dbe3;
  padding: 12px 24px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5c4d0;
  box-sizing: border-box;
  gap: 10px;
  position: sticky;
  top: 0;
  z-index: 100;
`;

export const NavTitle = styled.div`
  font-weight: bold;
  color: #6b2737;
  font-size: 18px;
  flex: 1;
  min-width: 180px;
`;

export const NavActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
`;

export const NavButton = styled.button`
  background-color: #c96b8a;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #b25f7f;
  }
`;

export const Container = styled.div`
  background: linear-gradient(135deg, #f5e8ec, #f7edf3);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  font-family: 'Segoe UI', sans-serif;
`;

export const Title = styled.h1`
  font-size: 28px;
  color: #b25f7f;
  margin-bottom: 30px;
  text-align: center;
`;

export const DoctorImage = styled.img`
  width: 250px;
  height: 250px;
  border-radius: 20px;
  object-fit: cover;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

export const DoctorName = styled.h2`
  font-size: 22px;
  font-weight: bold;
  color: #8e4a5a;
  margin-bottom: 25px;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
`;

export const CloseButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #c5a5b4;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background-color: #ae8f9e;
  }
`;
