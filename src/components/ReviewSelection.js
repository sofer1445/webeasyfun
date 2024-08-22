import React, { useContext } from 'react';
import styled from 'styled-components';

const ReviewSelectionContainer = styled.div`
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

const ReviewSelection = () => {
    const { venue, food, attraction } = useContext(UserSelectionContext);

    const handleSubmit = async () => {
        const response = await fetch('http://localhost:9125/save-selection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ venue, food, attraction }),
        });

        if (!response.ok) {
            console.error('Server call failed:', response);
        } else {
            const responseData = await response.json();
            console.log('Server response:', responseData);
        }
    };

    return (
        <ReviewSelectionContainer>
            <Heading>Review Your Selection</Heading>
            <p>Venue: {venue?.name}</p>
            <p>Food: {food?.name}</p>
            <p>Attraction: {attraction?.name}</p>
            <button onClick={handleSubmit}>Submit</button>
        </ReviewSelectionContainer>
    );
};

export default ReviewSelection;