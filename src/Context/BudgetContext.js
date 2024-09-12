// src/Context/BudgetContext.js
import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library for unique IDs

export const BudgetContext = createContext();

export const BudgetProvider = ({ children, initialBudget = 0 }) => {
    const [budget, setBudget] = useState(initialBudget);
    const [cartItems, setCartItems] = useState([]);

    // שליפת עגלה ושחזור תקציב מ-localStorage בעת הטעינה
    useEffect(() => {
        const savedCartItems = JSON.parse(localStorage.getItem('cartItems'));
        const savedBudget = JSON.parse(localStorage.getItem('budget'));
        if (savedCartItems) {
            setCartItems(savedCartItems);
        }
        if (savedBudget) {
            setBudget(savedBudget);
        }
    }, []);

    // שמירת עגלה ותקציב ב-localStorage בכל פעם שיש שינוי
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        localStorage.setItem('budget', JSON.stringify(budget));
    }, [cartItems, budget]);

    const handleAddToCart = (item) => {
        const itemWithId = { ...item, id: uuidv4() }; // Add unique ID to item
        setCartItems([...cartItems, itemWithId]);
        setBudget(prevBudget => prevBudget - item.price);
    };

    const handleRemoveFromCart = (item) => {
        const updatedCartItems = cartItems.filter(cartItem => cartItem.id !== item.id);
        setCartItems(updatedCartItems);
        setBudget(prevBudget => prevBudget + item.price);
    };

    return (
        <BudgetContext.Provider value={{ budget, setBudget, cartItems, setCartItems, handleAddToCart, handleRemoveFromCart }}>
            {children}
        </BudgetContext.Provider>
    );
};
