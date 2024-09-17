import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BudgetContext } from '../../Context/BudgetContext';
import { EventContext } from '../../Context/EventContext';
import Spinner from '../../Styled/Spinner';
import CardComponent from '../CardComponent';
import DynamicHeading from '../../Styled/DynamicHeading';
import LoadNewSuggestionsButton from '../LoadNewSuggestionsButton';
import BackButtonComponent from '../../Styled/BackButton';

import highPrice from '../../images/venues/highPrice.jpg';
import lowPrice from '../../images/venues/lowPrice.jpg';
import mediumPrice from '../../images/venues/mediumPrice.jpg';

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
    const [buttonLoading, setButtonLoading] = useState(false);

    const fetchVenues = async () => {
        console.log("Start fetching venues...");
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:9125/get-suggested-venues?eventType=${encodeURIComponent(eventData.eventType)}&eventDate=${encodeURIComponent(eventData.eventDate)}&guestCount=${encodeURIComponent(eventData.guests)}&remainingBudget=${budget}&location=${encodeURIComponent(eventData.location)}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const rawText = await response.text(); // Fetch response as text
            console.log("Raw response from server:", rawText);

            if (!rawText || rawText.trim() === '') {
                console.error("Empty response from server");
                setVenues([]);
                return;
            }

            const parsedVenues = parseVenueData(rawText); // Parse response
            console.log("Parsed venues:", parsedVenues);

            setVenues(parsedVenues); // Update the state with parsed venues
        } catch (error) {
            console.error('Error fetching venues:', error);
            setVenues([]);
        } finally {
            setLoading(false); // Disable loading state
            console.log("Fetching venues finished.");
        }
    };

    const parseVenueData = (data) => {
        console.log("Raw venue data:", data); // Print raw data

        const venueLines = data.trim().split('\n'); // Split lines by newline

        return venueLines.map((line, index) => {
            try {
                const nameMatch = line.match(/^(.*?)\s*-\s*/); // Find venue name
                const priceMatch = line.match(/Estimated price:\s*\$(\d+)/i); // Find price

                if (!nameMatch || !priceMatch) {
                    console.error(`Invalid data format for venue line: ${line}`);
                    return null;
                }

                const name = nameMatch[1].trim();
                const price = parseInt(priceMatch[1], 10);
                const description = line.replace(nameMatch[0], '').replace(priceMatch[0], '').trim(); // Remove name and price to keep description

                return {
                    id: index + 1,
                    name,
                    description: description,
                    price,
                    image: price > budget * 0.25 ? highPrice : price > budget * 0.15 ? mediumPrice : lowPrice
                };
            } catch (error) {
                console.error("Error parsing venue line:", error);
                return null;
            }
        }).filter(item => item !== null); // Filter invalid items
    };

    const handleVenueClick = (venue) => {
        handleAddToCart(venue);
        navigate('/food-options'); // Navigate to food options page
    };

    useEffect(() => {
        fetchVenues();
    }, [budget, eventData.location, eventData.eventType, eventData.eventDate, eventData.guests]);

    return (
        <VenuesContainer>
            <BackButtonComponent />
            {loading ? (
                <>
                    <DynamicHeading loading={loading} />
                    <Spinner />
                </>
            ) : (
                <>
                    <VenueList>
                        {venues.length > 0 ? (
                            venues.map((venue) => (
                                <CardComponent key={venue.id} item={venue} image={venue.image} onClick={() => handleVenueClick(venue)} />
                            ))
                        ) : (
                            <p>No venues available</p>
                        )}
                    </VenueList>
                    <LoadNewSuggestionsButton onClick={fetchVenues} loading={buttonLoading} />
                </>
            )}
        </VenuesContainer>
    );
};

export default SuggestedVenues;
