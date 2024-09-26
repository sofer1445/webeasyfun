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

import highPriceImg from '../../../images/foods/highbudget_event_Please.jpg';
import mediumPriceImg from '../../../images/foods/midbudget_eventPlease.jpg';
import lowPriceImg from '../../../images/foods/lowbudget_eventPlease.jpg';
import backGroundFood from '../../../images/foods/backGroundFood.jpeg'; // תמונת רקע לאוכל

// מיכל שמנהל את הרקע בצורה דינמית
const FoodContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: url(${backGroundFood});
    background-size: cover;
    background-position: center;
    background-color: rgba(255, 255, 255, ${({ isTransparent }) => (isTransparent ? '0.8' : '0')});
    transition: background-color 0.5s ease-in-out;
    padding: 2rem;
`;

const FoodList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 2rem;
    max-width: 1200px;
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

const FoodOptions = () => {
    const { budget, handleAddToCart } = useContext(BudgetContext);
    const { eventData } = useContext(EventContext);
    const navigate = useNavigate();
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [hasFetchedFoods, setHasFetchedFoods] = useState(false);
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

    const fetchFoods = async () => {
        if (buttonLoading) return;

        console.log("Start fetching foods...");
        setButtonLoading(true);
        setLoading(true);

        try {
            const response = await fetchWithTimeout(
                `http://localhost:9125/get-suggested-food?eventType=${encodeURIComponent(eventData.eventType)}&eventDate=${encodeURIComponent(eventData.eventDate)}&guestCount=${encodeURIComponent(eventData.guests)}&remainingBudget=${budget}&location=${encodeURIComponent(eventData.location)}`,
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
                setFoods([]);
                fetchAdditionalFoods();
                return;
            }

            const parsedFoods = parseFoodData(rawText);
            console.log("Parsed foods:", parsedFoods);

            setFoods(parsedFoods);
            setHasFetchedFoods(true);
            setInitialFetch(true);
            setIsBackgroundTransparent(true); // שקיפות התמונה לאחר הלחיצה
        } catch (error) {
            console.error('Error fetching foods:', error);
            setFoods([]);
            fetchAdditionalFoods();
        } finally {
            setLoading(false);
            setButtonLoading(false);
        }
    };

    const fetchAdditionalFoods = async () => {
        setHasFetchedFoods(false);

        console.log("Fetching additional foods from DB...");
        setLoading(true);

        try {
            const response = await fetchWithTimeout(
                `http://localhost:9125/get-three-foods?remainingBudget=${budget}&location=${encodeURIComponent(eventData.location)}`,
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
                setFoods([]);
                await fetchFoods();
                return;
            }

            const parsedFoods = parseFoodData(rawText);
            console.log("Parsed additional foods:", parsedFoods);

            setFoods(parsedFoods);
        } catch (error) {
            console.error('Error fetching additional foods:', error);
            setFoods([]);
        } finally {
            setLoading(false);
        }
    };

    const parseFoodData = (data) => {
        console.log("Raw food data:", data);

        const foodLines = data.trim().split('\n');

        return foodLines.map((line, index) => {
            try {
                const nameMatch = line.match(/^(.*?)\s*-\s*/);
                const priceMatch = line.match(/Estimated price:\s*\$(\d+)/i);

                if (!nameMatch || !priceMatch) {
                    console.error(`Invalid data format for food line: ${line}`);
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
                    image: price > budget * 0.25 ? highPriceImg : price > budget * 0.15 ? mediumPriceImg : lowPriceImg
                };
            } catch (error) {
                console.error("Error parsing food line:", error);
                return null;
            }
        }).filter(item => item !== null);
    };

    const handleFoodClick = (food) => {
        handleAddToCart(food);
        navigate('/attractions');
    };

    return (
        <FoodContainer isTransparent={isBackgroundTransparent}>
            <BackButtonComponent />
            <Headline>Choose the type of food for your event</Headline>
            {loading ? (
                <>
                    <DynamicHeading loading={loading} />
                    <Spinner />
                </>
            ) : (
                <>
                    {!initialFetch ? (
                        <FetchButton onClick={fetchFoods} disabled={buttonLoading}>
                            Match me food
                        </FetchButton>
                    ) : (
                        <>
                            <FoodList>
                                {foods.length > 0 ? (
                                    foods.map((food) => (
                                        <CardComponent
                                            key={food.id}
                                            item={food}
                                            image={<img src={food.image} alt={food.name} />}
                                            onClick={() => handleFoodClick(food)}
                                        />
                                    ))
                                ) : (
                                    <p>No food options available</p>
                                )}
                            </FoodList>
                            <LoadNewSuggestionsButton onClick={fetchAdditionalFoods} loading={buttonLoading} />
                        </>
                    )}
                </>
            )}
        </FoodContainer>
    );
};

export default FoodOptions;
