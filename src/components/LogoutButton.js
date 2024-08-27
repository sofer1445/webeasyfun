import React, { useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../Context/UserContext';

const Button = styled.button`
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 1rem;
`;

const LogoutButton = () => {
    const { logout } = useContext(UserContext);

    return <Button onClick={logout}>Log Out</Button>;
};

export default LogoutButton;