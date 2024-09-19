import React, { useContext, useState } from 'react';
import { UserContext } from '../../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PersonalArea from '../infoUser/PersonalArea';
import logoimage from '../../images/logo/LOGO.png';
import axios from 'axios';

// הוספת EditFormInput
const EditFormInput = styled.input`
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
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
`;

const ModalContent = styled.div`
    background-color: #fff;
    padding: 2rem;
    border-radius: 10px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    position: relative;
    text-align: center;
`;

const Logo = styled.img`
    width: 100px;
    margin-bottom: 1rem;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #333;

    &:hover {
        color: #000;
    }
`;

const UserName = styled.h2`
    font-size: 1.2rem;
    color: #333;
`;

const UserEmail = styled.p`
    font-size: 1rem;
    color: #666;
`;

const Button = styled.button`
    background-color: #0b0505;
    color: white;
    border: none;
    padding: 0.3rem;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 0.5rem;
    width: 70%;
    font-size: 0.8rem;

    &:hover {
        background-color: #333;
    }
`;

const EditButton = styled(Button)`
    background-color: #000;

    &:hover {
        background-color: #333;
    }
`;

const EditProfileModal = ({ user, onSave, onClose }) => {
    const [username, setUsername] = useState(user.name);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            setErrorMessage("New passwords don't match!");
            return;
        }

        try {
            const url = `http://localhost:9125/update-profile?mail=${encodeURIComponent(user.email)}&oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}&newUsername=${encodeURIComponent(username)}`;
            const response = await axios.post(url);

            if (response.status === 200) {
                onSave(username);
            } else {
                setErrorMessage(response.data);
            }
        } catch (error) {
            setErrorMessage('Failed to update profile');
        }
    };
    return (
        <ModalOverlay>
            <ModalContent>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                <h2>Edit Profile</h2>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <EditFormInput
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Update Username"
                    />
                    <EditFormInput
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Enter Old Password"
                    />
                    <EditFormInput
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter New Password"
                    />
                    <EditFormInput
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm New Password"
                    />
                    <Button type="submit">Save Changes</Button>
                </form>
            </ModalContent>
        </ModalOverlay>
    );
};

const UserProfile = ({ onClose }) => {
    const { user, logout } = useContext(UserContext);
    const [showPersonalArea, setShowPersonalArea] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const navigate = useNavigate();

    const handlePersonalAreaClick = () => {
        setShowPersonalArea(true);
    };

    const handleClosePersonalArea = () => {
        setShowPersonalArea(false);
    };

    const handleEditProfileClick = () => {
        setShowEditProfile(true);
    };

    const handleSaveProfile = (newUsername) => {
        user.name = newUsername;
        setShowEditProfile(false);
    };

    const handleLogoutClick = () => {
        logout();
        navigate('/');
    };

    return user ? (
        <ModalOverlay>
            <ModalContent>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                <Logo src={logoimage} alt="Logo" />
                <UserName>Welcome, {user.name}</UserName>
                <UserEmail>Email: {user.email}</UserEmail>
                <Button onClick={handleLogoutClick}>Log Out</Button>
                <Button onClick={handlePersonalAreaClick}>Personal Area</Button>
                <EditButton onClick={handleEditProfileClick}>Edit Profile</EditButton>
                {showPersonalArea && (
                    <ModalOverlay>
                        <ModalContent>
                            <CloseButton onClick={handleClosePersonalArea}>&times;</CloseButton>
                            <PersonalArea secret={user.secret} />
                        </ModalContent>
                    </ModalOverlay>
                )}
                {showEditProfile && (
                    <EditProfileModal user={user} onSave={handleSaveProfile} onClose={() => setShowEditProfile(false)} />
                )}
            </ModalContent>
        </ModalOverlay>
    ) : (
        <p>Please log in.</p>
    );
};

export default UserProfile;
