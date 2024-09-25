import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CardComponent from '../../CardComponent';
import { BudgetContext } from '../../../Context/BudgetContext';
import { EventContext } from '../../../Context/EventContext';
import Spinner from '../../../Styled/Spinner';
import DynamicHeading from '../../../Styled/DynamicHeading';
import LoadNewSuggestionsButton from '../../LoadNewSuggestionsButton';
import BackButtonComponent from '../../../Styled/BackButton';

import highPriceImg from '../../../images/attractions/High_price_attraction.jpg';
import mediumPriceImg from '../../../images/attractions/Mid_price_attraction.jpg';
import lowPriceImg from '../../../images/attractions/Low_price_attraction.jpg';
import backGroundAtr from '../../../images/attractions/backGroundAtr.jpeg'; // תמונת רקע לאטרקציות

// מיכל שמנהל את הרקע בצורה דינמית
const AttractionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: url(${backGroundAtr});
    background-size: cover;
    background-position: center;
    background-color: rgba(255, 255, 255, ${({ isTransparent }) => (isTransparent ? '0.8' : '0')});
    transition: background-color 0.5s ease-in-out;
    padding: 2rem;
`;

const AttractionsList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-gap: 1.5rem;
    max-width: 1000px;
`;

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

const Headline = styled.h1`
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 2rem;
    text-align: center;
    text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
`;

const StyledImage = styled.img`
    width: 100%;
    height: auto;
    max-height: 150px;
`;

const Attractions = () => {
    const { budget, handleAddToCart } = useContext(BudgetContext);
    const { eventData } = useContext(EventContext);
    const navigate = useNavigate();
    const [attractions, setAttractions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [hasFetchedAttractions, setHasFetchedAttractions] = useState(false);
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

    const fetchAttractions = async () => {
        if (buttonLoading) return;

        console.log("Start fetching attractions...");
        setButtonLoading(true);
        setLoading(true);

        try {
            const response = await fetchWithTimeout(
                `http://localhost:9125/get-suggested-attractions?eventType=${encodeURIComponent(eventData.eventType)}&eventDate=${encodeURIComponent(eventData.eventDate)}&guestCount=${encodeURIComponent(eventData.guests)}&remainingBudget=${budget}&location=${encodeURIComponent(eventData.location)}`,
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
                setAttractions([]);
                fetchAdditionalAttractions();
                return;
            }

            const parsedAttractions = parseAttractionData(rawText);
            console.log("Parsed attractions:", parsedAttractions);

            setAttractions(parsedAttractions);
            setHasFetchedAttractions(true);
            setInitialFetch(true);
            setIsBackgroundTransparent(true); // שקיפות התמונה לאחר הלחיצה
        } catch (error) {
            console.error('Error fetching attractions:', error);
            setAttractions([]);
            fetchAdditionalAttractions();
        } finally {
            setLoading(false);
            setButtonLoading(false);
        }
    };

    const fetchAdditionalAttractions = async () => {
        setHasFetchedAttractions(false);

        console.log("Fetching additional attractions from DB...");
        setLoading(true);

        try {
            const response = await fetchWithTimeout(
                `http://localhost:9125/get-three-attractions?remainingBudget=${budget}&location=${encodeURIComponent(eventData.location)}`,
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
                setAttractions([]);
                return;
            }

            const parsedAttractions = parseAttractionData(rawText);
            console.log("Parsed additional attractions:", parsedAttractions);

            setAttractions(parsedAttractions);
        } catch (error) {
            console.error('Error fetching additional attractions:', error);
            setAttractions([]);
        } finally {
            setLoading(false);
        }
    };

    const parseAttractionData = (data) => {
        console.log("Raw attraction data:", data);

        const attractionLines = data.trim().split('\n').filter(line => !line.includes('No suitable attraction found'));

        return attractionLines.map((line, index) => {
            try {
                const attractionRegex = /^\d+\.\s(.+?)\s-\s(.+?)\s-\sEstimated\sprice:\s?\$?(\d+)/i;
                const attractionMatch = line.match(attractionRegex);

                if (!attractionMatch) {
                    console.error(`Invalid data format for attraction line: ${line}`);
                    return null;
                }

                const name = attractionMatch[1].trim();
                const description = attractionMatch[2].trim();
                const price = parseInt(attractionMatch[3], 10);

                const image = price > budget * 0.25 ? highPriceImg : price > budget * 0.15 ? mediumPriceImg : lowPriceImg;

                return {
                    id: index + 1,
                    name,
                    description,
                    price,
                    image
                };
            } catch (error) {
                console.error("Error parsing attraction line:", error, line);
                return null;
            }
        }).filter(item => item !== null);
    };

    const handleAttractionClick = (attraction) => {
        handleAddToCart(attraction);
        navigate('/chat');
    };

    return (
        <AttractionsContainer isTransparent={isBackgroundTransparent}>
            <BackButtonComponent />
            <Headline>Choose the attractions for your event</Headline>
            {loading ? (
                <>
                    <DynamicHeading loading={loading} />
                    <Spinner />
                </>
            ) : (
                <>
                    {!initialFetch ? (
                        <FetchButton onClick={fetchAttractions} disabled={buttonLoading}>
                            Search for attractions
                        </FetchButton>
                    ) : (
                        <>
                            <AttractionsList>
                                {attractions.length > 0 ? (
                                    attractions.map((attraction) => (
                                        <CardComponent
                                            key={attraction.id}
                                            item={attraction}
                                            image={<StyledImage src={attraction.image} alt={attraction.name} />}
                                            onClick={() => handleAttractionClick(attraction)}
                                        />
                                    ))
                                ) : (
                                    <p>No attractions available</p>
                                )}
                            </AttractionsList>
                            <LoadNewSuggestionsButton onClick={fetchAdditionalAttractions} loading={buttonLoading} />
                        </>
                    )}
                </>
            )}
        </AttractionsContainer>
    );
};

export default Attractions;
