import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CardComponent from '../CardComponent';
import { BudgetContext } from '../../Context/BudgetContext';
import { EventContext } from '../../Context/EventContext';
import Spinner from '../../Styled/Spinner';
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
        setButtonLoading(true);
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
            console.log("Data from server:", data); // הוספת הדפסה כדי לבדוק אם הנתונים מגיעים מהשרת

            if (!data.trim()) {
                throw new Error("Received empty data from server");
            }

            const parsedVenues = parseVenueData(data);
            console.log("Parsed venues:", parsedVenues); // הדפסת הנתונים אחרי הפירוק

            if (parsedVenues.length === 0) {
                throw new Error("No valid venue data parsed");
            }

            setVenues(parsedVenues);
        } catch (error) {
            console.error('Error fetching venues:', error);
            setVenues([]);
        } finally {
            setLoading(false);
            setButtonLoading(false);
        }
    };


    useEffect(() => {
        fetchVenues();
    }, [budget, eventData.location, eventData.eventType, eventData.eventDate, eventData.guests]);

    const parseVenueData = (data) => {
        const venueLines = data.trim().split('\n\n'); // חילוק המידע על פי שני שורות ריקות, מה שמפריד בין ההצעות השונות.

        return venueLines.map((line, index) => {
            try {
                // פיצול השורה לקטעים (שם, מחיר ותיאור) לפי המידע מהשרת
                const nameMatch = line.match(/option: (.*?);/i);
                const priceMatch = line.match(/Price:\s?(\d+)\s?USD/i);
                const detailsMatch = line.match(/Details: (.*)/i);

                if (!nameMatch || !priceMatch || !detailsMatch) {
                    console.error(`Invalid data format for venue line: ${line}`);
                    return null;
                }

                const name = nameMatch[1].trim();
                const price = parseInt(priceMatch[1], 10);
                const description = detailsMatch[1].trim();

                let image;
                if (price > budget * 0.25) {
                    image = highPrice;
                } else if (price > budget * 0.15) {
                    image = mediumPrice;
                } else {
                    image = lowPrice;
                }

                return {
                    id: index + 1,
                    name,
                    description,
                    price,
                    image
                };
            } catch (error) {
                console.error("Error parsing venue line:", error);
                return null;
            }
        }).filter(item => item !== null); // סינון פריטים לא תקינים
    };


    const handleVenueClick = (venue) => {
        handleAddToCart(venue);
        navigate('/food-options');
    };

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
                        {venues.map((venue) => (
                            <CardComponent key={venue.id} item={venue} image={venue.image} onClick={() => handleVenueClick(venue)} />
                        ))}
                    </VenueList>
                    <LoadNewSuggestionsButton onClick={fetchVenues} loading={buttonLoading} />
                </>
            )}
        </VenuesContainer>
    );
};

export default SuggestedVenues;
