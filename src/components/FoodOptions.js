import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CardComponent from './CardComponent'; // Import the CardComponent
import { BudgetContext } from '../Context/BudgetContext';

import highBudget from '../images/foods/highbudget_event_Please.jpg';
import lowBudget from '../images/foods/lowbudget_eventPlease.jpg';
import mediumBudget from '../images/foods/midbudget_eventPlease.jpg';

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
        navigate('/attractions');
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
            name: 'Simple recipes',
            imageUrl: lowBudget,
            price: 100,
        },
        {
            id: 2,
            name: 'Blended styles',
            imageUrl: mediumBudget,
            price: 150,
        },
        {
            id: 3,
            name: 'Rich gourmet',
            imageUrl: highBudget,
            price: 200,
        },
    ];
};

export default FoodOptions;