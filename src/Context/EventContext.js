import React, { createContext, useState, useEffect } from 'react';

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

    // שמירת נתוני האירוע ב-localStorage ושחזור בעת הטעינה
    useEffect(() => {
        const savedEventData = JSON.parse(localStorage.getItem('eventData'));
        if (savedEventData) {
            setEventData(savedEventData);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('eventData', JSON.stringify(eventData));
    }, [eventData]);

    const resetEventData = () => {
        setEventData({
            eventType: '',
            eventDate: '',
            location: '',
            guests: '',
            budget: '',
            eventId: ''
        });
    };

    return (
        <EventContext.Provider value={{ eventData, setEventData, resetEventData }}>
            {children}
        </EventContext.Provider>
    );
};
