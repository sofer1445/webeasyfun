import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CardComponent from '../CardComponent';
import { BudgetContext } from '../../Context/BudgetContext';
import { EventContext } from '../../Context/EventContext';
import Spinner from '../../Styled/Spinner';
import DynamicHeading from '../../Styled/DynamicHeading';

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

    useEffect(() => {
        const fetchData = async () => {
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
                const parsedFoods = parseFoodData(data);
                setFoods(parsedFoods);
            } catch (error) {
                console.error('Error fetching foods:', error);
                setFoods([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [budget, eventData.location, eventData.eventType, eventData.eventDate, eventData.guests]);

    const parseFoodData = (data) => {
        const foodLines = data.split('\n').filter(line => line.includes(' - '));
        return foodLines.map((line, index) => {
            const parts = line.split(' - ');
            if (parts.length < 3) {
                console.error('Unexpected food data format:', line);
                return {
                    id: index + 1,
                    name: 'Unknown Food',
                    description: 'No description available',
                    price: 0
                };
            }
            const [name, description, price] = parts;
            return {
                id: index + 1,
                name: name.trim(),
                description: description.trim(),
                price: parseInt(price.replace(/[^0-9]/g, ''), 10) || 0
            };
        });
    };

    const handleFoodClick = (food) => {
        handleAddToCart(food);
        navigate('/attractions');
    };

    return (
        <FoodOptionsContainer>
            {loading ? (
                <>
                    <DynamicHeading loading={loading} />
                    <Spinner />
                </>
            ) : (
                <FoodList>
                    {foods.map((food) => (
                        <CardComponent key={food.id} item={food} onClick={() => handleFoodClick(food)} />
                    ))}
                </FoodList>
            )}
        </FoodOptionsContainer>
    );
};

export default FoodOptions;
