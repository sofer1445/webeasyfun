import React, { createContext, useState } from 'react';

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
    const [budget, setBudget] = useState(5000); // Example initial budget
    const [cartItems, setCartItems] = useState([]);

    const handleAddToCart = (item) => {
        setCartItems([...cartItems, item]);
        setBudget(budget - item.price);
    };

    const handleRemoveFromCart = (item) => {
        const updatedCartItems = cartItems.filter(cartItem => cartItem.id !== item.id);
        setCartItems(updatedCartItems);
        setBudget(budget + item.price);
    };

    return (
        <BudgetContext.Provider value={{ budget, setBudget, cartItems, handleAddToCart, handleRemoveFromCart }}>
            {children}
        </BudgetContext.Provider>
    );
};