import React, { useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';

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
    flex: 1 0 200px;
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
    const { venue, food, attraction } = useContext(UserContext);

    const handleHomeClick = () => {
        navigate('/'); // Navigate to home page
    };

    return (
        <SummaryContainer>
            <Heading>Your<br />Event<br />Summary</Heading>
            {venue && (
                <SummaryItemContainer>
                    <Image src={venue.imageUrl} alt={venue.name} />
                    <Name>{venue.name}</Name>
                    <Price>Price: {venue.price}</Price>
                </SummaryItemContainer>
            )}
            {food && (
                <SummaryItemContainer>
                    <Image src={food.imageUrl} alt={food.name} />
                    <Name>{food.name}</Name>
                    <Price>Price: {food.price}</Price>
                </SummaryItemContainer>
            )}
            {attraction && (
                <SummaryItemContainer>
                    <Image src={attraction.imageUrl} alt={attraction.name} />
                    <Name>{attraction.name}</Name>
                    <Price>Price: {attraction.price}</Price>
                </SummaryItemContainer>
            )}
            <HomeButton onClick={handleHomeClick}>חזור לדף הבית</HomeButton>
        </SummaryContainer>
    );
};

export default Summary;