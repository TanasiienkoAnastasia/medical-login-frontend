// src/components/NavigationBar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaTimes } from 'react-icons/fa';

const Nav = styled.nav`
  background: ${({ isDoctor }) => (isDoctor ? '#d16b86' : '#73c9c9')};
  padding: 15px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  font-family: 'Arial', sans-serif;
  position: relative;
`;

const Logo = styled.h2`
  margin: 0;
  font-weight: bold;
`;

const DesktopNav = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;

  @media (max-width: 768px) {
    display: none;
  }

  a {
    color: white;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const BurgerButton = styled.button`
  background: none;
  color: white;
  font-size: 24px;
  border: none;
  cursor: pointer;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
  background: ${({ isDoctor }) => (isDoctor ? '#fbe1e8' : '#d8f4f4')};
  color: ${({ isDoctor }) => (isDoctor ? '#6b2737' : '#005a5a')};
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 10;

  a, button {
    background: none;
    border: none;
    color: inherit;
    text-align: left;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const LogoutButton = styled.button`
  background: white;
  color: ${({ isDoctor }) => (isDoctor ? '#d16b86' : '#369797')};
  border: none;
  padding: 8px 18px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #f2f2f2;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.label`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: white;
  color: ${({ isDoctor }) => (isDoctor ? '#d16b86' : '#369797')};
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  input {
    display: none;
  }
`;

const Greeting = styled.span`
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
`;

const NavigationBar = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const isDoctor = Boolean(user?.specialty);

    // Load profile image from localStorage
    useEffect(() => {
        const storedImage = localStorage.getItem(`profileImage-${user.email}`);
        if (storedImage) setProfileImage(storedImage);
    }, [user.email]);

    const handleLogoutClick = () => {
        onLogout();
        navigate('/login');
    };

    const handleNavigate = (path) => {
        navigate(path);
        setMenuOpen(false);
    };

    const getInitials = (name) => {
        if (!name) return '';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Доброго ранку';
        if (hour < 18) return 'Доброго дня';
        return 'Доброго вечора';
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImage(reader.result);
            localStorage.setItem(`profileImage-${user.email}`, reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <Nav isDoctor={isDoctor}>
            <Logo>🌸 МедСервіс</Logo>

            <DesktopNav>
                <Link to="/dashboard">Дашборд</Link>
                {isDoctor && <Link to="/patients">Пацієнти</Link>}
                <ProfileInfo>
                    <Avatar isDoctor={isDoctor}>
                        {profileImage ? (
                            <img src={profileImage} alt="avatar" />
                        ) : (
                            getInitials(user.name)
                        )}
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                    </Avatar>
                    <Greeting>{getGreeting()}, {user.name.split(' ')[0]}</Greeting>
                </ProfileInfo>
                <LogoutButton onClick={handleLogoutClick} isDoctor={isDoctor}>
                    Вийти
                </LogoutButton>
            </DesktopNav>

            <BurgerButton onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FaTimes /> : <FaBars />}
            </BurgerButton>

            {menuOpen && (
                <MobileMenu isDoctor={isDoctor}>
                    <button onClick={() => handleNavigate('/dashboard')}>Дашборд</button>
                    {isDoctor && <button onClick={() => handleNavigate('/patients')}>Пацієнти</button>}
                    <button onClick={handleLogoutClick}>Вийти</button>
                </MobileMenu>
            )}
        </Nav>
    );
};

export default NavigationBar;
