import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CardComponent from '../CardComponent';
import { BudgetContext } from '../../Context/BudgetContext';
import { EventContext } from '../../Context/EventContext';
import Spinner from '../../Styled/Spinner';
import DynamicHeading from '../../Styled/DynamicHeading';

const VenuesContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f5f5f5;
`;

const VenueList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 2rem;
    max-width: 1200px;
`;

const SuggestedVenues = () => {
    const { budget, handleAddToCart } = useContext(BudgetContext);
    const { eventData } = useContext(EventContext);
    const navigate = useNavigate();
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const remainingBudget = budget;
                const location = eventData.location;
                const eventType = eventData.eventType;
                const eventDate = eventData.eventDate;
                const guestCount = eventData.guests;

                const response = await fetch(`http://localhost:9125/get-suggested-venues?eventType=${encodeURIComponent(eventType)}&eventDate=${encodeURIComponent(eventDate)}&guestCount=${encodeURIComponent(guestCount)}&remainingBudget=${remainingBudget}&location=${encodeURIComponent(location)}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.text();
                const parsedVenues = parseVenueData(data);
                setVenues(parsedVenues);
            } catch (error) {
                console.error('Error fetching venues:', error);
                setVenues([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [budget, eventData.location, eventData.eventType, eventData.eventDate, eventData.guests]);

    const parseVenueData = (data) => {
        const cleanedData = data.trim().replace(/[\n\r]+/g, '\n').replace(/^\s+|\s+$/gm, '');
        const venueLines = cleanedData.split('\n').filter(line => line.includes(' - '));
        return venueLines.map((line, index) => {
            const parts = line.split(' - ');
            const nameAndDescription = parts[0].split('. ');
            const name = nameAndDescription[1]?.trim() || nameAndDescription[0]?.trim();
            const description = parts[1]?.trim() || 'No description available';
            const priceMatch = line.match(/(\d+)/g);
            const price = priceMatch ? parseInt(priceMatch[priceMatch.length - 1], 10) : 0;

            return {
                id: index + 1,
                name,
                description,
                price
            };
        });
    };

    const handleVenueClick = (venue) => {
        handleAddToCart(venue);
        navigate('/food-options');
    };

    return (
        <VenuesContainer>
            {loading ? (
                <>
                    <DynamicHeading loading={loading} />
                    <Spinner />
                </>
            ) : (
                <VenueList>
                    {venues.map((venue) => (
                        <CardComponent key={venue.id} item={venue} onClick={() => handleVenueClick(venue)} />
                    ))}
                </VenueList>
            )}
        </VenuesContainer>
    );
};

export default SuggestedVenues;
