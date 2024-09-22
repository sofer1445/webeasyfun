import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import { EventContext } from '../../Context/EventContext';
import { BudgetContext } from '../../Context/BudgetContext';
import images1 from "../../images/logo/LOGO.png";

const SummaryContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    padding: 4rem; /* שינוי הגובה */
    overflow-x: auto;
    position: relative;
`;

const Heading = styled.h1`
    font-size: 2.5rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 2rem;
    text-align: center;
`;

const SummaryItemContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    flex: 1 0 200px;
    background-color: #fff;
`;

const Image = styled.img`
    width: 100%;
    max-width: 300px;
    height: auto;
    border-radius: 10px;
    margin-bottom: 1rem;
`;

const Name = styled.h2`
    font-size: 1.2rem;
    color: #333;
    margin-bottom: 0.5rem;
`;

const Price = styled.p`
    font-size: 1rem;
    color: #666;
`;

const InfoRow = styled.p`
    font-size: 1.1rem;
    color: #666;
    margin: 0.5rem 0;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column; /* כפתורים אחד מתחת לשני */
    align-items: center;
    margin-top: 1.5rem; /* שינוי הריווח העליון */
`;

const HomeButton = styled.button`
    padding: 0.6rem 1.2rem; /* הקטנת הכפתור */
    font-size: 1.2rem;
    color: #fff;
    background-color: #07090b;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 1rem;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #080b10;
    }
`;

const CreateEventButton = styled.button`
    padding: 0.6rem 1.2rem; /* הקטנת הכפתור */
    font-size: 1.2rem;
    color: #fff;
    background-color: #000000;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 1rem;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #000000;
    }
`;

const LogoContainer = styled.div`
    position: absolute;
    top: 1rem;
    left: 1rem;
`;

const Logo = styled.img`
    width: 150px; /* הקטנת הלוגו */
    height: auto;
`;

const sendUserSelections = async (eventId, elements) => {
    try {
        const uniqueElements = Array.from(new Set(elements));
        const response = await fetch(`http://localhost:9125/save-selection?eventId=${eventId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(uniqueElements)
        });

        if (!response.ok) {
            console.error('Server call failed:', response);
            return false;
        } else {
            console.log('Selections saved successfully');
            return true;
        }
    } catch (error) {
        console.error('Error creating event:', error);
        return false;
    }
};

const Summary = () => {
    const navigate = useNavigate();
    const { user, venue, food, attraction } = useContext(UserContext);
    const { eventData } = useContext(EventContext);
    const { cartItems, setCartItems } = useContext(BudgetContext);
    const [secret, setSecret] = useState(UserContext);


    useEffect(() => {
        if (user?.secret) {
            setSecret(user.secret);
        }
    }, [user]);

    const handleCreateEvent = async () => {
        if (!secret) {
            console.error('User secret is not available');
            return;
        }
        if (!eventData || !eventData.eventId) {
            console.error('Event data or event ID is not available');
            return;
        }
        const elements = [
            venue?.name,
            food?.name,
            attraction?.name,
            ...cartItems.map(item => item.name)
        ].filter(Boolean);

        const success = await sendUserSelections(eventData.eventId, elements);
        if (success) {
            setCartItems([]); // Clear the cart items
            localStorage.removeItem('cartItems'); // Clear localStorage
            alert('תכנון האירוע נוצר בהצלחה');
            navigate('/'); // Navigate to home page
        } else {
            alert('Failed to create event');
        }
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    return (
        <SummaryContainer>
            <LogoContainer>
                <Logo src={images1} alt="Logo" />
            </LogoContainer>
            <Heading>Your Event Summary</Heading>
            <SummaryItemContainer>
                <Name>Event Details</Name>
                <InfoRow>Location: {eventData?.location || 'Not Provided'}</InfoRow>
                <InfoRow>Date: {eventData?.date || 'Not Provided'}</InfoRow>
                <InfoRow>Budget: {eventData?.budget || 'Not Provided'}</InfoRow>
                <InfoRow>Guests: {eventData?.guests || 'Not Provided'}</InfoRow>
                <InfoRow>Elements: {cartItems.length > 0 ? cartItems.map(item => item.name).join(', ') : 'No items added'}</InfoRow>
            </SummaryItemContainer>
            {venue && (
                <SummaryItemContainer>
                    <Image src={venue.imageUrl} alt={venue.name} />
                    <Name>{venue.name}</Name>
                    <Price>Price: {venue.price}</Price>
                </SummaryItemContainer>
            )}
            {food && (
                <SummaryItemContainer>
                    <Image src={food.imageUrl} alt={food.name} />
                    <Name>{food.name}</Name>
                    <Price>Price: {food.price}</Price>
                </SummaryItemContainer>
            )}
            {attraction && (
                <SummaryItemContainer>
                    <Image src={attraction.imageUrl} alt={attraction.name} />
                    <Name>{attraction.name}</Name>
                    <Price>Price: {attraction.price}</Price>
                </SummaryItemContainer>
            )}
            <ButtonContainer>
                <CreateEventButton onClick={handleCreateEvent}>Create Event</CreateEventButton>
                <HomeButton onClick={handleHomeClick}>Back Home</HomeButton>
            </ButtonContainer>
        </SummaryContainer>
    );
};

export default Summary;
