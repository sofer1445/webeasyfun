import React, { createContext, useState } from 'react';

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
    const [budget, setBudget] = useState(0);
    const [cartItems, setCartItems] = useState([]);

    const handleAddToCart = (item) => {
        setBudget(prevBudget => prevBudget - item.price);
        setCartItems(prevItems => [...prevItems, item]);
    };

    return (
        <BudgetContext.Provider value={{ budget, setBudget, handleAddToCart, cartItems }}>
            {children}
        </BudgetContext.Provider>
    );
}