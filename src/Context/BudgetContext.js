// src/Context/BudgetContext.js
import React, { createContext, useState, useEffect } from 'react';

export const BudgetContext = createContext();

export const BudgetProvider = ({ children, initialBudget = 0 }) => {
    const [budget, setBudget] = useState(initialBudget);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        setBudget(initialBudget);
    }, [initialBudget]);

    const handleAddToCart = (item) => {
        setCartItems([...cartItems, item]);
        setBudget(prevBudget => prevBudget - item.price);
    };

    const handleRemoveFromCart = (item) => {
        const updatedCartItems = cartItems.filter(cartItem => cartItem.id !== item.id);
        setCartItems(updatedCartItems);
        setBudget(prevBudget => prevBudget + item.price);
    };

    return (
        <BudgetContext.Provider value={{ budget, setBudget, cartItems, handleAddToCart, handleRemoveFromCart }}>
            {children}
        </BudgetContext.Provider>
    );
};