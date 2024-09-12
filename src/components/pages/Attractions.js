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

import highPrice from '../../images/attractions/High price attraction.jpg';
import lowPrice from '../../images/attractions/Low price attraction.jpg';
import mediumPrice from '../../images/attractions/Mid price attraction.jpg';

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
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 2rem;
    max-width: 1200px;
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
            const remainingBudget = budget;
            const location = eventData.location;
            const eventType = eventData.eventType;
            const eventDate = eventData.eventDate;
            const guestCount = eventData.guests;

            const response = await fetch(`http://localhost:9125/get-suggested-attractions?eventType=${encodeURIComponent(eventType)}&eventDate=${encodeURIComponent(eventDate)}&guestCount=${encodeURIComponent(guestCount)}&remainingBudget=${remainingBudget}&location=${encodeURIComponent(location)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.text();
            console.log("Data from server:", data); // לוג כדי לוודא שהמידע מהשרת מגיע

            if (!data.trim()) {
                throw new Error("Received empty data from server");
            }

            const parsedAttractions = parseAttractionsData(data);
            console.log("Parsed attractions:", parsedAttractions); // לוג אחרי הפענוח

            if (parsedAttractions.length === 0) {
                throw new Error("No valid attraction data parsed");
            }

            setAttractions(parsedAttractions);
        } catch (error) {
            console.error('Error fetching attractions:', error);
            setAttractions([]);
        } finally {
            setLoading(false);
            setButtonLoading(false);
        }
    };

    useEffect(() => {
        fetchAttractions();
    }, [budget, eventData.location, eventData.eventType, eventData.eventDate, eventData.guests]);

    const parseAttractionsData = (data) => {
        const attractionLines = data.trim().split('\n\n'); // חלוקה לפי שני רווחים ריקים כדי להפריד בין ההצעות השונות
        return attractionLines.map((line, index) => {
            try {
                const nameMatch = line.match(/option: (.*?);/i);
                const priceMatch = line.match(/Price:\s?(\d+)\s?USD/i);
                const detailsMatch = line.match(/Details: (.*)/i);

                if (!nameMatch || !priceMatch || !detailsMatch) {
                    console.error(`Invalid data format for attraction line: ${line}`);
                    return null;
                }

                const name = nameMatch[1].trim();
                const price = parseInt(priceMatch[1], 10);
                const description = detailsMatch[1].trim();

                if (!name || price === 0) {
                    console.warn(`Skipping invalid attraction: name=${name}, price=${price}`);
                    return null;
                }

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
                console.error("Error parsing attraction line:", error);
                return null;
            }
        }).filter(item => item !== null); // סינון פריטים לא תקינים
    };

    const handleAttractionClick = (attraction) => {
        handleAddToCart(attraction);
        navigate('/chat');
    };

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
                        {attractions.map((attraction) => (
                            <CardComponent key={attraction.id} item={attraction} image={attraction.image} onClick={() => handleAttractionClick(attraction)} />
                        ))}
                    </AttractionsList>
                    <LoadNewSuggestionsButton onClick={fetchAttractions} loading={buttonLoading} />
                </>
            )}
        </AttractionsContainer>
    );
};

export default Attractions;
