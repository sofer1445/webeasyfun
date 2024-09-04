import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CardComponent from '../CardComponent';
import { BudgetContext } from '../../Context/BudgetContext';
import { EventContext } from '../../Context/EventContext';
import Spinner from '../../Styled/Spinner';
import DynamicHeading from '../../Styled/DynamicHeading';

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

    useEffect(() => {
        const fetchData = async () => {
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
                const parsedAttractions = parseAttractionsData(data);
                setAttractions(parsedAttractions);
            } catch (error) {
                console.error('Error fetching attractions:', error);
                setAttractions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [budget, eventData.location, eventData.eventType, eventData.eventDate, eventData.guests]);

    const parseAttractionsData = (data) => {
        const attractionLines = data.split('\n').filter(line => line.includes(' - '));
        return attractionLines.map((line, index) => {
            const parts = line.split(' - ');
            if (parts.length < 3) {
                console.error('Unexpected attraction data format:', line);
                return {
                    id: index + 1,
                    name: 'Unknown Attraction',
                    description: 'No description available',
                    price: 0
                };
            }

            const [name, description] = parts;

            // חיפוש המחיר מתוך הטקסט
            const priceMatch = line.match(/(\d+)/g); // מוצא מספרים בטקסט
            const price = priceMatch ? parseInt(priceMatch[priceMatch.length - 1], 10) : 0; // מקבל את המספר האחרון כערך המחיר

            return {
                id: index + 1,
                name: name.trim(),
                description: description.trim(),
                price
            };
        });
    };

    const handleAttractionClick = (attraction) => {
        handleAddToCart(attraction);
        navigate('/chat');
    };

    return (
        <AttractionsContainer>
            {loading ? (
                <>
                    <DynamicHeading loading={loading} />
                    <Spinner />
                </>
            ) : (
                <AttractionsList>
                    {attractions.map((attraction) => (
                        <CardComponent key={attraction.id} item={attraction} onClick={() => handleAttractionClick(attraction)} />
                    ))}
                </AttractionsList>
            )}
        </AttractionsContainer>
    );
};

export default Attractions;
