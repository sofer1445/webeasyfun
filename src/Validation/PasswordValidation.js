import React, { useState } from 'react';
import styled from 'styled-components';

const PasswordInfo = styled.div`
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    border: 1px solid #ddd;
    padding: 0.5rem;
    z-index: 1;
`;

const PasswordInput = styled.input`
    width: 100%;
    padding: 0.8rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;

    &:hover + ${PasswordInfo} {
        display: block;
    }
`;

const PasswordValidation = ({ password, setPassword }) => {
    const [passwordError, setPasswordError] = useState('');

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (e.target.value.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
        } else {
            setPasswordError('');
        }
    }

    return (
        <div>
            <PasswordInput
                type="password"
                placeholder={"Password"}
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
            />
            <PasswordInfo>
                <p>דרישות לסיסמא תקינה:</p>
                <ul>
                    <li>חייבת להכיל לפחות 8 תווים</li>
                </ul>
            </PasswordInfo>
            {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
        </div>
    );
}

export default PasswordValidation;