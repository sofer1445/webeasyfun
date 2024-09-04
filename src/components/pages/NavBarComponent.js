import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import { FaUserCircle } from 'react-icons/fa';
import UserProfile from '../infoUser/UserProfile';

const NavBar = styled.div`
    position: fixed;
    top: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #0a0a0a;
    padding: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 8;
`;

const NavButtons = styled.div`
    display: flex;
    gap: 0.2rem;
    justify-content: center;
`;

const NavButton = styled(Link)`
    color: #fff;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #555;
    }
`;

const HomeButton = styled(Link)`
    color: #fff;
    text-decoration: none;
    font-size: 1.5rem;
    font-weight: bold;
`;

const WelcomeMessage = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 1.2rem;
    margin-right: 2rem;
    cursor: pointer;
`;

const UserIcon = styled(FaUserCircle)`
    margin-right: 0.2rem;
    font-size: 1.5rem;
`;

const NavBarComponent = () => {
    const { user, setUser } = useContext(UserContext);
    const [showUserProfile, setShowUserProfile] = useState(false);

    const toggleUserProfile = () => {
        setShowUserProfile(!showUserProfile);
    };

    // פונקציה להבאת שם המשתמש מהשרת
    const fetchUsernameByEmail = async (email) => {
        try {
            const response = await fetch(`http://localhost:9125/get-username?mail=${email}`);
            if (response.ok) {
                const username = await response.text();
                console.log('Fetched username:', username);
                return username;
            } else {
                console.error('Failed to fetch username:', response.status);
            }
        } catch (error) {
            console.error('Error fetching username:', error);
        }
        return null;
    };

    // שימוש ב-useEffect כדי לקרוא לפונקציה בזמן טעינת הקומפוננטה
    useEffect(() => {
        const fetchUser = async () => {
            if (user && user.email) {
                const username = await fetchUsernameByEmail(user.email);
                if (username) {
                    setUser((prevUser) => ({ ...prevUser, username }));
                }
            }
        };
        fetchUser();
    }, [user, setUser]);

    return (
        <>
            <NavBar>
                {user && user.username ? (
                    <WelcomeMessage onClick={toggleUserProfile}>
                        <UserIcon />
                        Welcome, {user.username}
                    </WelcomeMessage>
                ) : (
                    <WelcomeMessage>
                        <UserIcon />
                        Welcome, Guest
                    </WelcomeMessage>
                )}
                <NavButtons>
                    <HomeButton to="/">Home</HomeButton>
                    <NavButton to="/about">About Us</NavButton>
                    <NavButton to="/contact">Contact</NavButton>
                    {!user && <NavButton to="/login">Login</NavButton>}
                    {!user && <NavButton to="/signup">Sign Up</NavButton>}
                </NavButtons>
            </NavBar>
            {showUserProfile && <UserProfile onClose={toggleUserProfile} />}
        </>
    );
};

export default NavBarComponent;