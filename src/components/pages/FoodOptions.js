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

import highbudget from '../../images/foods/highbudget_event_Please.jpg';
import lowbudget from '../../images/foods/lowbudget_eventPlease.jpg';
import mediumbudget from '../../images/foods/midbudget_eventPlease.jpg';

const FoodOptionsContainer = styled.div`
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

    const fetchFoods = async () => {
        setButtonLoading(true);
        try {
            const remainingBudget = budget;
            const location = eventData.location;
            const eventType = eventData.eventType;
            const eventDate = eventData.eventDate;
            const guestCount = eventData.guests;

            const response = await fetch(`http://localhost:9125/get-suggested-food?eventType=${encodeURIComponent(eventType)}&eventDate=${encodeURIComponent(eventDate)}&guestCount=${encodeURIComponent(guestCount)}&remainingBudget=${remainingBudget}&location=${encodeURIComponent(location)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.text();
            console.log("Data from server:", data); // לוג כדי לוודא שהמידע מהשרת מגיע

            if (!data.trim()) {
                throw new Error("Received empty data from server");
            }

            const parsedFoods = parseFoodData(data);
            console.log("Parsed foods:", parsedFoods); // לוג אחרי הפענוח

            if (parsedFoods.length === 0) {
                throw new Error("No valid food data parsed");
            }

            setFoods(parsedFoods);
        } catch (error) {
            console.error('Error fetching foods:', error);
            setFoods([]);
        } finally {
            setLoading(false);
            setButtonLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, [budget, eventData.location, eventData.eventType, eventData.eventDate, eventData.guests]);

    const parseFoodData = (data) => {
        const foodLines = data.trim().split('\n\n'); // חלוקה לפי שתי שורות ריקות כדי להפריד בין ההצעות
        return foodLines.map((line, index) => {
            try {
                const nameMatch = line.match(/option: (.*?);/i);
                const priceMatch = line.match(/Price:\s?(\d+)\s?USD/i);
                const detailsMatch = line.match(/Details: (.*)/i);

                if (!nameMatch || !priceMatch || !detailsMatch) {
                    console.error(`Invalid data format for food line: ${line}`);
                    return null;
                }

                const name = nameMatch[1].trim();
                const price = parseInt(priceMatch[1], 10);
                const description = detailsMatch[1].trim();

                if (!name || price === 0) {
                    console.warn(`Skipping invalid food: name=${name}, price=${price}`);
                    return null;
                }

                let image;
                if (price > budget * 0.25) {
                    image = highbudget;
                } else if (price > budget * 0.15) {
                    image = mediumbudget;
                } else {
                    image = lowbudget;
                }

                return {
                    id: index + 1,
                    name,
                    description,
                    price,
                    image
                };
            } catch (error) {
                console.error("Error parsing food line:", error);
                return null;
            }
        }).filter(item => item !== null); // סינון פריטים לא תקינים
    };

    const handleFoodClick = (food) => {
        handleAddToCart(food);
        navigate('/attractions');
    };

    return (
        <FoodOptionsContainer>
            <BackButtonComponent />
            {loading ? (
                <>
                    <DynamicHeading loading={loading} />
                    <Spinner />
                </>
            ) : (
                <>
                    <FoodList>
                        {foods.map((food) => (
                            <CardComponent key={food.id} item={food} image={food.image} onClick={() => handleFoodClick(food)} />
                        ))}
                    </FoodList>
                    <LoadNewSuggestionsButton onClick={fetchFoods} loading={buttonLoading} />
                </>
            )}
        </FoodOptionsContainer>
    );
};

export default FoodOptions;
