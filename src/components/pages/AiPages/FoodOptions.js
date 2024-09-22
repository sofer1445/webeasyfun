import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation between pages
import styled from 'styled-components';
import { BudgetContext } from '../../../Context/BudgetContext';
import { EventContext } from '../../../Context/EventContext';
import Spinner from '../../../Styled/Spinner';
import CardComponent from '../../CardComponent'; // Use existing component for rendering food cards
import DynamicHeading from '../../../Styled/DynamicHeading'; // For dynamic heading when loading
import LoadNewSuggestionsButton from '../../LoadNewSuggestionsButton'; // For the "Load New Suggestions" button
import BackButtonComponent from '../../../Styled/BackButton'; // Back button

import highPriceImg from '../../../images/foods/highbudget_event_Please.jpg'; // High-price option image
import mediumPriceImg from '../../../images/foods/midbudget_eventPlease.jpg'; // Medium-price option image
import lowPriceImg from '../../../images/foods/lowbudget_eventPlease.jpg'; // Low-price option image

const FoodContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f5f5f5;
`;

const FoodList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 2rem;
    max-width: 1200px;
`;

const FoodOptions = () => {
    const { budget, handleAddToCart } = useContext(BudgetContext);
    const { eventData } = useContext(EventContext);
    const navigate = useNavigate();
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);

    const fetchWithTimeout = (url, options, timeout = 10000) => {
        return Promise.race([
            fetch(url, options),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timed out')), timeout)
            )
        ]);
    };

    const fetchFoods = async () => {
        setButtonLoading(true);
        try {
            const response = await fetchWithTimeout(
                `http://localhost:9125/get-suggested-food?eventType=${encodeURIComponent(eventData.eventType)}&eventDate=${encodeURIComponent(eventData.eventDate)}&guestCount=${encodeURIComponent(eventData.guests)}&remainingBudget=${budget}&location=${encodeURIComponent(eventData.location)}`,
                { method: 'GET' },
                15000 // זמן המתנה של 15 שניות
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.text();
            console.log("Raw response from server:", data);

            const parsedFoods = parseFoodOptions(data);
            console.log("Parsed foods:", parsedFoods);

            setFoods(parsedFoods);
        } catch (error) {
            console.error('Error fetching foods:', error);
            setFoods([]);
        } finally {
            setLoading(false);
            setButtonLoading(false);
        }
    };


    const parseFoodOptions = (data) => {
        console.log("Raw food data:", data); // Logging the raw data

        const foodLines = data.trim().split('\n'); // Split the lines

        return foodLines.map((line, index) => {
            try {
                const foodRegex = /^\d+\.\s(.+?)\s-\s(.+?)\s-\sEstimated\sprice:\s?\$?(\d+)/i;
                const foodMatch = line.match(foodRegex);

                if (!foodMatch) {
                    console.error(`Invalid data format for food line: ${line}`);
                    return null;
                }

                const name = foodMatch[1].trim();
                const description = foodMatch[2].trim();
                const price = parseInt(foodMatch[3], 10);

                return {
                    id: index + 1,
                    name,
                    description,
                    price,
                    image: price > budget * 0.25 ? highPriceImg : price > budget * 0.15 ? mediumPriceImg : lowPriceImg
                };
            } catch (error) {
                console.error("Error parsing food line:", error, line);
                return null;
            }
        }).filter(item => item !== null); // Filter out invalid items
    };

    const handleFoodClick = (food) => {
        handleAddToCart(food); // Add food to the cart
        navigate('/attractions'); // Navigate to the attractions page
    };

    useEffect(() => {
        fetchFoods();
    }, [budget, eventData]);

    return (
        <FoodContainer>
            <BackButtonComponent />
            {loading ? (
                <>
                    <DynamicHeading loading={loading} />
                    <Spinner />
                </>
            ) : (
                <>
                    <FoodList>
                        {foods.length > 0 ? (
                            foods.map((food) => (
                                <CardComponent key={food.id} item={food} image={food.image} onClick={() => handleFoodClick(food)} />
                            ))
                        ) : (
                            <p>No food options available</p>
                        )}
                    </FoodList>
                    <LoadNewSuggestionsButton onClick={fetchFoods} loading={buttonLoading} />
                </>
            )}
        </FoodContainer>
    );
};

export default FoodOptions;
