import React from 'react';
import styled from 'styled-components';
import ImageCarousel from '../ImageCarousel'; // קרוסלת התמונות
import Login from "./Login"; // טופס התחברות
import images1 from "../../images/logo/LOGO.png";

const PreLoginContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100vh;
    padding: 1rem;
    background-color: #f5f5f5;
    box-sizing: border-box;
    overflow: hidden; /* מונע גלילה מיותרת */
`;

const LeftContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 38%; /* צמצום רוחב הטופס */
    height: 70%; /* התאמה לגובה מלא */
    margin-top: -50px; /* הרמת הקופסה למעלה */
`;

const Title = styled.h1`
    font-size: 3rem; /* הגדלנו את גודל הכותרת */
    color: #222;
    margin-bottom: 0.5rem;
    font-weight: bold;
    text-align: start;
`;

const Logo = styled.img`
    width: 100px; /* קובע רוחב הלוגו */
    height: auto; /* התאמה לגובה אוטומטי */
    margin-bottom: 1rem; /* ריווח מתחת ללוגו */
`;

const Tagline = styled.p`
    font-size: 1rem;
    color: #555;
    margin-bottom: 1rem;
    text-align: center;
`;

const LoginContainer = styled.div`
    width: 80%; /* טופס בגודל פרופורציונלי */
    height: 60%;
    background-color: #fff;
    padding: 0.8rem; /* הקטנת הפדינג */
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    min-height: 100px; /* התאמה לגובה המינימלי */
`;

const CarouselContainer = styled.div`
    width: 60%; /* הגדלת הגודל לקרוסלה */
    height: 100%; /* כדי להתאים לגובה הדף */
`;

const PreLoginPage = () => {
    return (
        <PreLoginContainer>
            <LeftContainer>

                <Title>EASY FUN</Title>

                <Tagline>Plan your perfect event with us</Tagline>
                <LoginContainer>
                    <Login /> {/* טופס התחברות */}
                </LoginContainer>
            </LeftContainer>
            <CarouselContainer>
                <ImageCarousel /> {/* קרוסלת התמונות */}
            </CarouselContainer>
        </PreLoginContainer>
    );
};

export default PreLoginPage;
