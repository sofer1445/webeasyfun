// src/components/infoUser/UserProfile.js
import React, { useContext, useState } from 'react';
import { UserContext } from '../../Context/UserContext';
import styled from 'styled-components';
import PersonalArea from '../infoUser/PersonalArea';

const UserProfileContainer = styled.div`
    position: fixed;
    top: 3rem; /* Adjust this value to add space below the navbar */
    left: 0;
    padding: 1rem;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
`;

const UserName = styled.h2`
    font-size: 1.2rem;
    color: #333;
`;

const UserEmail = styled.p`
    font-size: 1rem;
    color: #666;
`;

const CloseButton = styled.button`
    background-color: #100a0a;
    color: white;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 1rem;
`;

const LogoutButton = styled.button`
    background-color: #0b0505;
    color: white;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 1rem;
`;

const PersonalAreaButton = styled.button`
    background-color: #0d170d;
    color: white;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 1rem;
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    overflow-y: auto;
`;

const ModalContent = styled.div`
    background-color: #fff;
    padding: 2rem;
    border-radius: 10px;
    position: relative;
    width: 90%;
    max-width: 800px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const ModalCloseButton = styled.button`
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #333;
`;

const UserProfile = ({ onClose }) => {
    const { user, logout } = useContext(UserContext);
    const [showPersonalArea, setShowPersonalArea] = useState(false);

    const handlePersonalAreaClick = () => {
        setShowPersonalArea(true);
    };

    const handleClosePersonalArea = () => {
        setShowPersonalArea(false);
    };

    return user ? (
        <UserProfileContainer>
            <UserName>Welcome, {user.name}</UserName>
            <UserEmail>Email: {user.email}</UserEmail>
            <CloseButton onClick={onClose}>Close</CloseButton>
            <LogoutButton onClick={logout}>Log Out</LogoutButton>
            <PersonalAreaButton onClick={handlePersonalAreaClick}>Personal Area</PersonalAreaButton>
            {showPersonalArea && (
                <ModalOverlay>
                    <ModalContent>
                        <ModalCloseButton onClick={handleClosePersonalArea}>&times;</ModalCloseButton>
                        <PersonalArea secret={user.secret} />
                    </ModalContent>
                </ModalOverlay>
            )}
        </UserProfileContainer>
    ) : (
        <p>Please log in.</p>
    );
};

export default UserProfile;