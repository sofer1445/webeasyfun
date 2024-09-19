import React, { useContext, useState } from 'react';
import { UserContext } from '../../Context/UserContext';
import { AuthContext } from '../../Context/AuthContext'; // ייבוא AuthContext
import styled from 'styled-components';
import EmailValidation from '../../Validation/EmailValidation';
import PasswordValidation from '../../Validation/PasswordValidation';
import { useNavigate, Link } from 'react-router-dom'; // ייבוא Link לצורך ניווט

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 40vh;
    background-color: #f5f5f5;
`;

const LoginForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    padding: 2rem;
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

const SignUpLink = styled(Link)`
    margin-top: 1rem;
    text-decoration: none;
    color: #007bff;
    font-size: 0.9rem;

    &:hover {
        text-decoration: underline;
    }
`;

const Login = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const { login } = useContext(UserContext);
    const { handleLogin } = useContext(AuthContext); // שימוש ב-AuthContext
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:9125/login?mail=${email}&password=${password}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            console.log(data);

            // אם ההתחברות מצליחה, עדכני את AuthContext ונווטי לעמוד הבית
            if (response.ok) {
                login({ email, secret: data.secret });
                handleLogin(); // עדכון המשתמש כמחובר ב-AuthContext
                navigate('/');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <LoginContainer>
            <LoginForm onSubmit={handleSubmit}>
                <EmailValidation
                    email={email}
                    setEmail={setEmail}
                    emailError={emailError}
                    setEmailError={setEmailError}
                />
                <PasswordValidation
                    password={password}
                    setPassword={setPassword}
                    passwordError={passwordError}
                    setPasswordError={setPasswordError}
                />
                <Button type="submit">Login</Button>
                <SignUpLink to="/signup">Don't have an account? Sign Up</SignUpLink> {/* כפתור ה-Sign Up */}
            </LoginForm>
        </LoginContainer>
    );
};

export default Login;
