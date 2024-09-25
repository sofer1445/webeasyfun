import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BudgetContext } from '../../../Context/BudgetContext';
import { EventContext } from '../../../Context/EventContext';
import Spinner from '../../../Styled/Spinner';
import CardComponent from '../../CardComponent';
import DynamicHeading from '../../../Styled/DynamicHeading';
import LoadNewSuggestionsButton from '../../LoadNewSuggestionsButton';
import BackButtonComponent from '../../../Styled/BackButton';

import highPrice from '../../../images/venues/highPrice.jpg';
import lowPrice from '../../../images/venues/lowPrice.jpg';
import mediumPrice from '../../../images/venues/mediumPrice.jpg';
import backGroundVenue from '../../../images/venues/backgroundVenue2.jpeg';

// הוספת מצב (state) לניהול שקיפות תמונת הרקע
const VenuesContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: url(${backGroundVenue});
    background-size: cover;
    background-position: center;
    background-color: rgba(255, 255, 255, ${({ isTransparent }) => (isTransparent ? '0.01' : '0')});
    transition: background-color 0.5s ease-in-out;
    padding: 2rem;
`;

// עיצוב הכפתור מחדש
const FetchButton = styled.button`
    padding: 12px 25px;
    background-color: #ff6f61;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 18px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    &:hover {
        background-color: #ff4436;
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
    }
    transition: background-color 0.3s, box-shadow 0.3s;
`;

// כותרת חדשה ומזמינה
const Headline = styled.h1`
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 2rem;
    text-align: center;
    text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
`;

// עיצוב רשימת המקומות עם ריווח טוב יותר
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
    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [hasFetchedVenues, setHasFetchedVenues] = useState(false);
    const [initialFetch, setInitialFetch] = useState(false);
    const [isBackgroundTransparent, setIsBackgroundTransparent] = useState(false); // משתנה חדש לניהול שקיפות התמונה

    const fetchWithTimeout = (url, options, timeout = 10000) => {
        return Promise.race([
            fetch(url, options),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timed out')), timeout)
            )
        ]);
    };

    const fetchVenues = async () => {
        if (buttonLoading) return;

        console.log("Start fetching venues...");
        setButtonLoading(true);
        setLoading(true);

        try {
            const response = await fetchWithTimeout(
                `http://localhost:9125/get-suggested-venues?eventType=${encodeURIComponent(eventData.eventType)}&eventDate=${encodeURIComponent(eventData.eventDate)}&guestCount=${encodeURIComponent(eventData.guests)}&remainingBudget=${budget}&location=${encodeURIComponent(eventData.location)}`,
                { method: 'GET' },
                15000
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const rawText = await response.text();
            console.log("Raw response from server:", rawText);

            if (!rawText || rawText.trim() === '') {
                console.error("Empty response from server");
                setVenues([]);
                fetchAdditionalVenues();
                return;
            }

            const parsedVenues = parseVenueData(rawText);
            console.log("Parsed venues:", parsedVenues);

            setVenues(parsedVenues);
            setHasFetchedVenues(true);
            setInitialFetch(true);
            setIsBackgroundTransparent(true); // שקיפות התמונה לאחר הלחיצה
        } catch (error) {
            console.error('Error fetching venues:', error);
            setVenues([]);
            fetchAdditionalVenues();
        } finally {
            setLoading(false);
            setButtonLoading(false);
        }
    };

    const fetchAdditionalVenues = async () => {
        setHasFetchedVenues(false);

        console.log("Fetching additional venues from DB...");
        setLoading(true);

        try {
            const response = await fetchWithTimeout(
                `http://localhost:9125/get-three-places?remainingBudget=${budget}&location=${encodeURIComponent(eventData.location)}`,
                { method: 'GET' },
                15000
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const rawText = await response.text();
            console.log("Raw response from server:", rawText);

            if (!rawText || rawText.trim() === '') {
                console.error("Empty response from server");
                setVenues([]);
                return;
            }

            const parsedVenues = parseVenueData(rawText);
            console.log("Parsed additional venues:", parsedVenues);

            setVenues(parsedVenues);
        } catch (error) {
            console.error('Error fetching additional venues:', error);
            setVenues([]);
        } finally {
            setLoading(false);
        }
    };

    const parseVenueData = (data) => {
        console.log("Raw venue data:", data);

        const venueLines = data.trim().split('\n');

        return venueLines.map((line, index) => {
            try {
                const nameMatch = line.match(/^(.*?)\s*-\s*/);
                const priceMatch = line.match(/Estimated price:\s*\$(\d+)/i);

                if (!nameMatch || !priceMatch) {
                    console.error(`Invalid data format for venue line: ${line}`);
                    return null;
                }

                const name = nameMatch[1].trim();
                const price = parseInt(priceMatch[1], 10);
                const description = line.replace(nameMatch[0], '').replace(priceMatch[0], '').trim();

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
        }).filter(item => item !== null);
    };

    const handleVenueClick = (venue) => {
        handleAddToCart(venue);
        navigate('/food-options');
    };

    return (
        <VenuesContainer isTransparent={isBackgroundTransparent}>
            <BackButtonComponent />
            <Headline>Choose the perfect place for your event</Headline>
            {loading ? (
                <>
                    <DynamicHeading loading={loading} />
                    <Spinner />
                </>
            ) : (
                <>
                    {!initialFetch ? (
                        <FetchButton onClick={fetchVenues} disabled={buttonLoading}>
                            Find places for me
                        </FetchButton>
                    ) : (
                        <>
                            <VenueList>
                                {venues.length > 0 ? (
                                    venues.map((venue) => (
                                        <CardComponent
                                            key={venue.id}
                                            item={venue}
                                            image={<img src={venue.image} alt={venue.name} />}
                                            onClick={() => handleVenueClick(venue)}
                                        />
                                    ))
                                ) : (
                                    <p>No venues available</p>
                                )}
                            </VenueList>
                            <LoadNewSuggestionsButton onClick={fetchAdditionalVenues} loading={buttonLoading} />
                        </>
                    )}
                </>
            )}
        </VenuesContainer>
    );
};

export default SuggestedVenues;
