import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PersonalAreaContainer = styled.div`
    padding: 2rem;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const UserInfo = styled.div`
    margin-bottom: 2rem;
`;

const EventInfo = styled.div`
    margin-bottom: 1rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #fff;
`;

const EditButton = styled.button`
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 1rem;
`;

const SaveButton = styled.button`
    background-color: #008CBA;
    color: white;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 1rem;
`;

const PersonalArea = ({ secret }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);
    const [editedEvent, setEditedEvent] = useState({});

    const handleEditEvent = (event) => {
        setEditingEvent(event);
        setEditedEvent(event);
    };

    const handleSaveEvent = async () => {
        try {
            const response = await fetch('/edit-event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedEvent),
            });
            if (response.ok) {
                console.log('Event edited successfully');
                setEditingEvent(null);
                fetchData(); // Refresh the data
            } else {
                console.error('Failed to edit event');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedEvent((prevEvent) => ({
            ...prevEvent,
            [name]: value,
        }));
    };

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:9125/personal-area?secret=${secret}`);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            const text = await response.text();
            const data = text ? JSON.parse(text) : null;
            setUserData(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (secret) {
            fetchData();
        }
    }, [secret]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!userData || userData.length === 0) {
        return <div>No data available</div>;
    }

    const user = userData[0][0];
    const eventsMap = new Map();

    userData.forEach(item => {
        const event = item[1];
        const key = `${event.date}-${event.typeEvent}-${event.id}`;
        if (!eventsMap.has(key)) {
            eventsMap.set(key, { ...event, elementsOfEvent: [] });
        }
        eventsMap.get(key).elementsOfEvent.push(item[2]);
    });

    const events = Array.from(eventsMap.values());

    return (
        <PersonalAreaContainer>
            <UserInfo>
                <h2>{user.username}'s Personal Area</h2>
                <p>Email: {user.mail}</p>
            </UserInfo>
            {events.map((event, index) => (
                <EventInfo key={index}>
                    {editingEvent && editingEvent.id === event.id ? (
                        <>
                            <label>Type of Event:</label>
                            <input
                                type="text"
                                name="typeEvent"
                                value={editedEvent.typeEvent}
                                onChange={handleChange}
                            />
                            <label>Date:</label>
                            <input
                                type="text"
                                name="date"
                                value={editedEvent.date}
                                onChange={handleChange}
                            />
                            <label>Location:</label>
                            <input
                                type="text"
                                name="location"
                                value={editedEvent.location}
                                onChange={handleChange}
                            />
                            <label>Budget:</label>
                            <input
                                type="text"
                                name="budget"
                                value={editedEvent.budget}
                                onChange={handleChange}
                            />
                            <label>Guests:</label>
                            <input
                                type="text"
                                name="guests"
                                value={editedEvent.guests}
                                onChange={handleChange}
                            />
                            <label>Elements of Event:</label>
                            <input
                                type="text"
                                name="elementsOfEvent"
                                value={editedEvent.elementsOfEvent.join(', ')}
                                onChange={handleChange}
                            />
                            <SaveButton onClick={handleSaveEvent}>Save</SaveButton>
                        </>
                    ) : (
                        <>
                            <h3>{event.typeEvent} on {event.date}</h3>
                            <p>Location: {event.location}</p>
                            <p>Budget: {event.budget}</p>
                            <p>Guests: {event.guests}</p>
                            <p>Elements: {event.elementsOfEvent.join(', ')}</p>

                        </>
                    )}
                </EventInfo>
            ))}
        </PersonalAreaContainer>
    );
};

export default PersonalArea;