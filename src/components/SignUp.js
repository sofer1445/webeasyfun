import React, { useState } from 'react';
import styled from 'styled-components';
import EmailValidation from '../Validation/EmailValidation';
import PasswordValidation from '../Validation/PasswordValidation'; // ייבוא של PasswordValidation



const SignUpContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const SignUpForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: flex-start; // שינוי מ-center ל-flex-start
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    padding: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #555;
  }
`;

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(''); // הוספת מצב לשגיאת סיסמא

    const handleSubmit = (e) => {
        e.preventDefault();
        //send to server
        // const handleSubmit = async (e) => {
        //     e.preventDefault();
        //     try {
        //         const response = await fetch('http://localhost:5000/signup', {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             },
        //             body: JSON.stringify({ name, email, password }),
        //         });
        //         const data = await response.json();
        //         console.log(data);
        //     } catch (error) {
        //         console.error(error);
        //     }
        // };
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Password:', password);
    };




    return (
        <SignUpContainer>
            <SignUpForm onSubmit={handleSubmit}>
                <Input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <EmailValidation
                    email={email}
                    setEmail={setEmail}
                    emailError={emailError}
                    setEmailError={setEmailError}
                />
                <PasswordValidation // שימוש ב-PasswordValidation
                    password={password}
                    setPassword={setPassword}
                    passwordError={passwordError}
                    setPasswordError={setPasswordError}
                />
                <Button type="submit">Sign Up</Button>
            </SignUpForm>
        </SignUpContainer>
    );
};

export default SignUp;