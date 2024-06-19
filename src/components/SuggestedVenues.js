import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CardComponent from './CardComponent'; // Import the CardComponent
import { BudgetContext } from './BudgetContext';

import lowPrice from '../images/lowPrice.jpg';
import mediumPrice from '../images/mediumPrice.jpg';
import highPrice from '../images/highPrice.jpg';

const SuggestedVenuesContainer = styled.div`
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

const VenuesList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 2rem;
    max-width: 1200px;
`;

const SuggestedVenues = () => {
    const { budget, handleAddToCart } = useContext(BudgetContext);
    const navigate = useNavigate();

    const venues = fetchSuggestedVenues();

    const handleVenueClick = (venue) => {
        handleAddToCart(venue);
        navigate('/food-options');
    };

    return (
        <SuggestedVenuesContainer>
            <Heading>Suggested Venues</Heading>
            <p>Remaining Budget: ${budget}</p> {budget === 0 && <p>Oops! You've run out of budget. Please remove some items from the cart.</p>}
            <VenuesList>
                {venues.map((venue) => (
                    <CardComponent key={venue.id} item={venue} onClick={() => handleVenueClick(venue)} />
                ))}
            </VenuesList>
        </SuggestedVenuesContainer>
    );
};

// Dummy function to fetch or generate the list of suggested venues
const fetchSuggestedVenues = () => {
    return [
        {
            id: 1,
            name: 'Venue 1',
            imageUrl: lowPrice,
            price: 1000,
        },
        {
            id: 2,
            name: 'Venue 2',
            imageUrl: mediumPrice,
            price: 1500,
        },
        {
            id: 3,
            name: 'Venue 3',
            imageUrl: highPrice,
            price: 2000,
        },
    ];
};

export default SuggestedVenues;