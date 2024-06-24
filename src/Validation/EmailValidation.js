import React, { useState } from "react";
import styled from 'styled-components';

const EmailInfo = styled.div`
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    border: 1px solid #ddd;
    padding: 0.5rem;
    z-index: 1;
`;

const EmailInput = styled.input`
    width: 100%;
    padding: 0.8rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;

    &:hover + ${EmailInfo} {
        display: block;
    }
`;

const EmailValidation = ({ email, setEmail, emailError, setEmailError }) => {
    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError(validateEmail(e.target.value) ? '' : 'Invalid email');
    };

    return (
        <div>
            <EmailInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
            />
            <EmailInfo>
                <p>דרישות לאימייל תקין:</p>
                <ul>
                    <li>חייב להכיל @</li>
                    <li>חייב להכיל .</li>
                    <li>לא יכול להכיל רווחים</li>
                </ul>
            </EmailInfo>
            {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
        </div>
    );
}

export default EmailValidation;