import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const EventPlanningContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Heading = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 2rem;
`;

const EventForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 500px;
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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle event planning form submission logic here
        console.log('Event Type:', eventType);
        console.log('Event Date:', eventDate);
        console.log('Location:', location);
        console.log('Number of Guests:', guests);

        // Navigate to the suggested venues page
        navigate('/suggested-venues', { state: { eventType, eventDate, location, guests } });
    };

    return (
        <EventPlanningContainer>
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
                    {/* Add more event types as needed */}
                </Select>
                <Input
                    type="date"
                    placeholder="Event Date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                />
                <Input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
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