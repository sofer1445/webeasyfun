import React, { useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import styled from 'styled-components';

const UserProfileContainer = styled.div`
    position: fixed;
    top: 0;
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

const UserProfile = () => {
    const { user } = useContext(UserContext);

    return user ? (
        <UserProfileContainer>
            <UserName>Welcome, {user.name}!</UserName>
            <UserEmail>Email: {user.email}</UserEmail>
        </UserProfileContainer>
    ) : (
        <p>Please log in.</p>
    );
};

export default UserProfile;