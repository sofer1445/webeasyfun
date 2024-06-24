import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const SummaryContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    background-color: #f5f5f5;
    padding: 6rem;
    overflow-x: auto;
    transform: scale(0.8);
    position: relative;
    left: -50px;
`;

const Heading = styled.h1`
    font-size: 3rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 2rem;
    text-align: center;
`;

const SummaryItemContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    flex: 1 0 200px; /* Add this line */
    
`;

const Image = styled.img`
    width: 100%;
    max-width: 300px;
    height: auto;
    border-radius: 10px;
    margin-bottom: 1rem;
`;

const Name = styled.h2`
    font-size: 1.2rem;
    color: #333;
    margin-bottom: 0.5rem;
`;

const Price = styled.p`
    font-size: 1rem;
    color: #666;
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
    const cartItems = JSON.parse(Cookies.get('cartItems') || '[]');

    const handleHomeClick = () => {
        navigate('/'); // Navigate to home page
    };

    return (
        <SummaryContainer>
            <Heading>Your<br />Event<br />Summary</Heading>
            {cartItems && cartItems.map((item, index) => (
                <SummaryItemContainer key={index}>
                    <Image src={item.imageUrl} alt={item.name} />
                    <Name>{item.name}</Name>
                    <Price>Price: {item.price}</Price>
                </SummaryItemContainer>
            ))}
            <HomeButton onClick={handleHomeClick}>חזור לדף הבית</HomeButton>
        </SummaryContainer>
    );
};

export default Summary;