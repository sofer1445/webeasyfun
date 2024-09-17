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

    const [cartItems, setCartItems] = useState([]);
    const [budget, setBudget] = useState(0);

    // Fetch event data, cart, and budget from localStorage on load
    useEffect(() => {
        const savedEventData = JSON.parse(localStorage.getItem('eventData')) || {};
        const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const savedBudget = JSON.parse(localStorage.getItem('budget')) || 0;

        setEventData(savedEventData);
        setCartItems(savedCartItems);
        setBudget(savedBudget);
    }, []);

    // Save event data, cart, and budget to localStorage on change
    useEffect(() => {
        localStorage.setItem('eventData', JSON.stringify(eventData));
    }, [eventData]);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('budget', JSON.stringify(budget));
    }, [budget]);

    const handleAddToCart = (item) => {
        setCartItems([...cartItems, item]);
        setBudget(prevBudget => prevBudget - item.price);
    };

    const handleRemoveFromCart = (item) => {
        const updatedCartItems = cartItems.filter(cartItem => cartItem.id !== item.id);
        setCartItems(updatedCartItems);
        setBudget(prevBudget => prevBudget + item.price);
    };

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
        <EventContext.Provider value={{ eventData, setEventData, resetEventData, cartItems, setCartItems, budget, setBudget, handleAddToCart, handleRemoveFromCart }}>
            {children}
        </EventContext.Provider>
    );
};