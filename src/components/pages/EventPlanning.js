import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import { BudgetContext } from '../../Context/BudgetContext';
import { EventContext } from '../../Context/EventContext';
import axios from 'axios';
import BackButtonComponent from '../../Styled/BackButton';
import PreExistingEvent from '../PreExistingEvent';
import CardComponent from '../CardComponent';

const EventPlanningContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    height: 100vh;
    background-color: #f5f5f5;
    overflow-y: auto;
    padding: 1rem;

    @media (min-width: 768px) {
        flex-direction: row;
    }
`;

const FormContainer = styled.div`
    flex: 1;
    margin-right: 1rem;
    width: 100%;

    @media (min-width: 768px) {
        width: 50%;
    }
`;

const CardsContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    width: 100%;
    margin-top: 1rem;

    @media (min-width: 768px) {
        width: 50%;
        margin-top: 0;
    }
`;

const Heading = styled.h1`
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #333;
`;

const EventForm = styled.form`
    display: flex;
    flex-direction: column;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.8rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s ease;

    &:focus {
        border-color: #4c68af;
        outline: none;
    }
`;

const Select = styled.select`
    width: 100%;
    padding: 0.8rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s ease;

    &:focus {
        border-color: #4c68af;
        outline: none;
    }
`;

const SuggestionsList = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
    max-height: 150px;
    overflow-y: auto;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    position: absolute;
    z-index: 1000;
`;

const SuggestionItem = styled.li`
    padding: 0.8rem;
    cursor: pointer;

    &:hover {
        background-color: #f0f0f0;
    }
`;

const Button = styled.button`
    background-color: ${props => props.disabled ? '#999' : '#333'};
    color: #fff;
    border: none;
    border-radius: 20px;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${props => props.disabled ? '#999' : '#555'};
    }
`;

const EventPlanning = () => {
    const navigate = useNavigate();
    const [eventType, setEventType] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [location, setLocation] = useState('');
    const [guests, setGuests] = useState('');
    const [cities, setCities] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [similarEvent, setSimilarEvent] = useState(null);
    const [showSimilarEvent, setShowSimilarEvent] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [formChanged, setFormChanged] = useState(false);
    const { user } = useContext(UserContext);
    const { budget, addToCart } = useContext(BudgetContext);
    const { setEventData } = useContext(EventContext);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('https://countriesnow.space/api/v0.1/countries/population/cities');
                if (response.data && response.data.data) {
                    const cityData = response.data.data.map(city => ({
                        name: city.city,
                        country: city.country
                    }));
                    setCities(cityData);
                }
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };

        fetchCities();
    }, []);

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setFormChanged(true);
        if (showSimilarEvent) {
            setIsButtonDisabled(false);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setFormChanged(true);
        if (showSimilarEvent) {
            setIsButtonDisabled(false);
        }
        if (value) {
            const filtered = cities.filter(city =>
                city.name.toLowerCase().startsWith(value.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 5));
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (city) => {
        setSearchTerm(`${city.name}, ${city.country}`);
        setLocation(city.name);
        setSuggestions([]);
        setFormChanged(true);
        if (showSimilarEvent) {
            setIsButtonDisabled(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const secret = await callUserSecret();
        const similarEvent = await checkSimilarEvent(secret, eventType, location, guests, budget);
        if (similarEvent) {
            setSimilarEvent(similarEvent);
            setShowSimilarEvent(true);
            setIsButtonDisabled(true);
            setFormChanged(false);
        } else {
            proceedToSuggestedVenues(secret);
        }
    };


    const callUserSecret = async () => {
        try {
            const response = await axios.get(`http://localhost:9125/get-userByMail?mail=${user.email}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user secret:', error);
            return null;
        }
    };

    const checkSimilarEvent = async (secret, eventType, location, guests, budget) => {
        try {
            const response = await axios.get(`http://localhost:9125/isSimilarEventExists`, {
                params: { secret, typeEvent: eventType, location, guests, budget }
            });
            return response.data;
        } catch (error) {
            console.error('Error checking for similar event:', error);
            return null;
        }
    };

    const proceedToSuggestedVenues = async (secret) => {
        try {
            const response = await axios.post(`http://localhost:9125/plan-event`, {
                secret,
                typeEvent: eventType,
                date: eventDate,
                location,
                guests,
                budget
            });
            setEventData({ eventType, eventDate, location, guests, budget, eventId: response.data });
            navigate('/suggested-venues');
        } catch (error) {
            console.error('Error proceeding to suggested venues:', error);
        }
    };

    const handleSelectEvent = (event) => {
        setEventData(event); // Update the event data in the context
        addToCart(event); // Add event details to the cart
        navigate('/chat'); // Navigate to the chat page
    };

    return (
        <EventPlanningContainer>
            <FormContainer>
                <BackButtonComponent />
                <Heading>Plan Your Event</Heading>
                <EventForm onSubmit={handleSubmit}>
                    <Select
                        value={eventType}
                        onChange={handleInputChange(setEventType)}
                    >
                        <option value="">Select Event Type</option>
                        <option value="wedding">Wedding</option>
                        <option value="birthday">Birthday Party</option>
                        <option value="corporate">Corporate Event</option>
                    </Select>
                    <Input
                        type="date"
                        placeholder="Event Date"
                        value={eventDate}
                        onChange={handleInputChange(setEventDate)}
                        min={new Date().toISOString().split('T')[0]}
                    />
                    <div style={{ position: 'relative', width: '100%' }}>
                        <Input
                            type="text"
                            placeholder="Search Location"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        {suggestions.length > 0 && (
                            <SuggestionsList>
                                {suggestions.map((city, index) => (
                                    <SuggestionItem key={index} onClick={() => handleSuggestionClick(city)}>
                                        {city.name}, {city.country}
                                    </SuggestionItem>
                                ))}
                            </SuggestionsList>
                        )}
                    </div>
                    <Input
                        type="number"
                        placeholder="Number of Guests"
                        value={guests}
                        onChange={handleInputChange(setGuests)}
                    />
                    <Button type="submit" disabled={isButtonDisabled && !formChanged}>
                        Continue
                    </Button>
                </EventForm>
            </FormContainer>
            <CardsContainer>
                {showSimilarEvent && (
                    <PreExistingEvent event={similarEvent} onSelect={handleSelectEvent}>
                        <Button onClick={() => navigate('/suggested-venues')} disabled={false}>
                            Continue to Custom Suggestions
                        </Button>
                    </PreExistingEvent>
                )}
            </CardsContainer>
        </EventPlanningContainer>
    );
};

export default EventPlanning;

