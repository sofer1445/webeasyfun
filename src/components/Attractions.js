import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CardComponent from './CardComponent'; // Import the CardComponent
import { BudgetContext } from './BudgetContext';

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
    const navigate = useNavigate();

    const fetchAttractions = () => {
        return [
            {
                id: 1,
                name: 'Attraction 1',
                imageUrl: 'url_to_image_1',
                price: 100,
            },
            {
                id: 2,
                name: 'Attraction 2',
                imageUrl: 'url_to_image_2',
                price: 200,
            },
            {
                id: 3,
                name: 'Attraction 3',
                imageUrl: 'url_to_image_3',
                price: 300,
            },
            // Add more attractions as needed
        ];
    };

    const attractions = fetchAttractions(); // Call the function to get the array of attractions

    const handleAttractionClick = (attraction) => {
        handleAddToCart(attraction);
        navigate('/summary');
    };

    return (
        <AttractionsContainer>
            <Heading>Choose your attractions</Heading>
            <AttractionsList>
                {attractions.map((attraction) => ( // Use .map() on the array of attractions
                    <CardComponent key={attraction.id} item={attraction} onClick={() => handleAttractionClick(attraction)} />
                ))}
            </AttractionsList>
        </AttractionsContainer>
    );
};

export default Attractions;