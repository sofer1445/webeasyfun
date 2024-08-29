import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CardComponent from '../CardComponent';
import { BudgetContext } from '../../Context/BudgetContext';
import { UserContext } from '../../Context/UserContext';

import lowPrice from '../../images/attractions/Low price attraction.jpg';
import mediumPrice from '../../images/attractions/Mid price attraction.jpg';
import highPrice from '../../images/attractions/High price attraction.jpg';

const AttractionsContainer = styled.div`
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

const AttractionsList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 2rem;
    max-width: 1200px;
`;

const Attractions = () => {
    const { handleAddToCart } = useContext(BudgetContext);
    const { setAttraction } = useContext(UserContext);
    const navigate = useNavigate();

    const fetchAttractions = () => {
        return [
            {
                id: 1,
                name: 'Vintage backyard games',
                imageUrl: lowPrice,
                price: 100,
            },
            {
                id: 2,
                name: 'Interactive music experience',
                imageUrl: mediumPrice,
                price: 200,
            },
            {
                id: 3,
                name: 'Intimate tropical paradise',
                imageUrl: highPrice,
                price: 300,
            },
        ];
    };

    const attractions = fetchAttractions();

    const handleAttractionClick = (attraction) => {
        setAttraction(attraction);
        handleAddToCart(attraction);
        navigate('/summary');
    };

    return (
        <AttractionsContainer>
            <Heading>Choose your attractions</Heading>
            <AttractionsList>
                {attractions.map((attraction) => (
                    <CardComponent key={attraction.id} item={attraction} onClick={() => handleAttractionClick(attraction)} />
                ))}
            </AttractionsList>
        </AttractionsContainer>
    );
};

export default Attractions;