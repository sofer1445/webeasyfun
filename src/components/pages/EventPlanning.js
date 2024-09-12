import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import { BudgetContext } from '../../Context/BudgetContext';
import { EventContext } from '../../Context/EventContext';
import axios from 'axios';
import BackButtonComponent from '../../Styled/BackButton';

const EventPlanningContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f5f5f5;
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
`;

const Select = styled.select`
    width: 100%;
    padding: 0.8rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
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
    background-color: #333;
    color: #fff;
    border: none;
    border-radius: 20px;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #555;
    }
`;

const EventPlanning = () => {
    const navigate = useNavigate();
    const [eventType, setEventType] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [location, setLocation] = useState('');
    const [guests, setGuests] = useState('');
    const [cities, setCities] = useState([]); // State to store all cities with countries
    const [suggestions, setSuggestions] = useState([]); // State to store filtered cities
    const [searchTerm, setSearchTerm] = useState(''); // State to store the search term
    const { user } = useContext(UserContext);
    const { budget } = useContext(BudgetContext);
    const { setEventData } = useContext(EventContext);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                console.log('Fetching cities from API...');
                const response = await axios.get('https://countriesnow.space/api/v0.1/countries/population/cities');
                console.log('Full API response data:', response.data);

                if (response.data && response.data.data) {
                    const cityData = response.data.data.map(city => ({
                        name: city.city,
                        country: city.country
                    }));
                    setCities(cityData);
                    console.log('Cities fetched:', cityData);
                } else {
                    console.error('Unexpected data structure:', response.data);
                }
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };

        fetchCities();
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value) {
            const filtered = cities.filter(city =>
                city.name.toLowerCase().startsWith(value.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (city) => {
        setSearchTerm(`${city.name}, ${city.country}`);
        setLocation(city.name);
        setSuggestions([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Event Type:', eventType);
        console.log('Event Date:', eventDate);
        console.log('Location:', location);
        console.log('Number of Guests:', guests);
        console.log('Budget:', budget);

        const secret = await callUserSecret();
        console.log('User secret:', secret, user);
        const response = await fetch(`http://localhost:9125/plan-event?secret=${secret}&typeEvent=${eventType}&date=${eventDate}&location=${location}&guests=${guests}&budget=${budget}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            console.error('Server call failed:', response);
        } else {
            const eventId = await response.json();
            console.log('Event ID:', eventId);

            setEventData({ eventType, eventDate, location, guests, budget, eventId });

            navigate('/suggested-venues');
        }
    };

    const callUserSecret = async () => {
        try {
            console.log('User:', user);
            const mail = user.email;
            console.log('User email:', mail + ",");
            const response = await fetch(`http://localhost:9125/get-userByMail?mail=${mail}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                console.error('Server call failed:', response.status, response.statusText);
                return null;
            }

            const responseData = await response.text();
            console.log('Server response:', responseData);

            if (!responseData) {
                console.error('Secret not found in response:', responseData);
                return null;
            }

            return responseData;
        } catch (error) {
            console.error('Error fetching user secret:', error);
            return null;
        }
    };

    return (
        <EventPlanningContainer>
            <BackButtonComponent />
            <Heading>Plan Your Event</Heading>
            <EventForm onSubmit={handleSubmit}>
                <Select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
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
                    onChange={(e) => setEventDate(e.target.value)}
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
                                    {`${city.name}, ${city.country}`}
                                </SuggestionItem>
                            ))}
                        </SuggestionsList>
                    )}
                </div>
                <Input
                    type="number"
                    placeholder="Number of Guests"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                />
                <Button type="submit">Continue</Button>
            </EventForm>
        </EventPlanningContainer>
    );
};

export default EventPlanning;