import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const SummaryContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f5f5f5;
`;

const Heading = styled.h1`
    font-size: 3rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 2rem;
`;

const SummaryItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border-radius: 10px;
    padding: 2rem;
    margin-bottom: 2rem;
    width: 80%;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
`;

const HomeButton = styled.button`
    padding: 1rem 2rem;
    font-size: 1.5rem;
    color: #fff;
    background-color: #333;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 2rem;
`;

const Summary = () => {
    const navigate = useNavigate();
    const cartItems = JSON.parse(Cookies.get('cartItems') || '[]'); // Get cart items from cookies

    const handleHomeClick = () => {
        navigate('/'); // Navigate to home page
    };

    return (
        <SummaryContainer>
            <Heading>Your Event Summary</Heading>
            {cartItems && cartItems.map((item, index) => (
                <SummaryItem key={index}>
                    <h2>{item.name}</h2>
                    <img src={item.imageUrl} alt={item.name} />
                    <p>Price: {item.price}</p>
                </SummaryItem>
            ))}
            <HomeButton onClick={handleHomeClick}>חזור לדף הבית</HomeButton>
        </SummaryContainer>
    );
};

export default Summary;