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

import highPriceImg from '../../images/attractions/High price attraction.jpg';
import mediumPriceImg from '../../images/attractions/Mid price attraction.jpg';
import lowPriceImg from '../../images/attractions/Low price attraction.jpg';

const AttractionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f5f5f5;
`;

const AttractionsList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); // שינוי מ-300px ל-250px
    grid-gap: 1.5rem; // הקטנת הרווח בין הכרטיסים
    max-width: 1000px; // הקטנת הרוחב הכללי של הרשימה
`;

const StyledImage = styled.img`
    width: 100%;
    height: auto;
    max-height: 150px; // הגבלת הגובה המקסימלי של התמונה
`;

const Attractions = () => {
    const { budget, handleAddToCart } = useContext(BudgetContext);
    const { eventData } = useContext(EventContext);
    const navigate = useNavigate();
    const [attractions, setAttractions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);

    const fetchAttractions = async () => {
        setButtonLoading(true);
        try {
            const response = await fetch(
                `http://localhost:9125/get-suggested-attractions?eventType=${encodeURIComponent(eventData.eventType)}&eventDate=${encodeURIComponent(eventData.eventDate)}&guestCount=${encodeURIComponent(eventData.guests)}&remainingBudget=${budget}&location=${encodeURIComponent(eventData.location)}`
            );
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.text();
            console.log("Raw response from server:", data);

            const parsedAttractions = parseAttractionsData(data);
            console.log("Parsed attractions:", parsedAttractions);

            setAttractions(parsedAttractions);
        } catch (error) {
            console.error('Error fetching attractions:', error);
            setAttractions([]);
        } finally {
            setLoading(false);
            setButtonLoading(false);
        }
    };

    const parseAttractionsData = (data) => {
        console.log("Raw attraction data:", data);

        const attractionLines = data.trim().split('\n').filter(line => !line.includes('No suitable attraction found'));  // Filter out unsuitable attractions

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
        }).filter(item => item !== null);  // Filter invalid entries
    };


    const handleAttractionClick = (attraction) => {
        handleAddToCart(attraction);
        navigate('/chat');
    };

    useEffect(() => {
        fetchAttractions();
    }, [budget, eventData]);

    return (
        <AttractionsContainer>
            <BackButtonComponent />
            {loading ? (
                <>
                    <DynamicHeading loading={loading} />
                    <Spinner />
                </>
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
                    <LoadNewSuggestionsButton onClick={fetchAttractions} loading={buttonLoading} />
                </>
            )}
        </AttractionsContainer>
    );
};

export default Attractions;
