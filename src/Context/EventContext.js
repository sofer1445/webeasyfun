import React, { createContext, useState } from 'react';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
    const [eventData, setEventData] = useState({
        eventType: '',
        eventDate: '',
        location: '',
        guests: '',
        budget: '',
        eventId: ''
    });

    return (
        <EventContext.Provider value={{ eventData, setEventData }}>
            {children}
        </EventContext.Provider>
    );
};