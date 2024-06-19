import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CardComponent from './CardComponent'; // Import the CardComponent
import { BudgetContext } from './BudgetContext';

const FoodOptionsContainer = styled.div`
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

const FoodOptionsList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 2rem;
    max-width: 1200px;
`;

const FoodOptions = () => {
    const { handleAddToCart } = useContext(BudgetContext);
    const navigate = useNavigate();

    const foodOptions = fetchFoodOptions();

    const handleFoodOptionClick = (foodOption) => {
        handleAddToCart(foodOption);
        navigate('/next-planning-step');
    };

    return (
        <FoodOptionsContainer>
            <Heading>Food Options</Heading>
            <FoodOptionsList>
                {foodOptions.map((foodOption) => (
                    <CardComponent key={foodOption.id} item={foodOption} onClick={() => handleFoodOptionClick(foodOption)} />
                ))}
            </FoodOptionsList>
        </FoodOptionsContainer>
    );
};

// Dummy function to fetch or generate the list of food options
const fetchFoodOptions = () => {
    return [
        {
            id: 1,
            name: 'Food Option 1',
            imageUrl: 'url_to_image_1',
            price: 100,
        },
        {
            id: 2,
            name: 'Food Option 2',
            imageUrl: 'url_to_image_2',
            price: 150,
        },
        {
            id: 3,
            name: 'Food Option 3',
            imageUrl: 'url_to_image_3',
            price: 200,
        },
    ];
};

export default FoodOptions;