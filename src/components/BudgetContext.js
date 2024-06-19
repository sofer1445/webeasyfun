import React, { createContext, useState } from 'react';
import Cookies from 'js-cookie';

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
    const [budget, setBudget] = useState(0);
    const [cartItems, setCartItems] = useState([]);

    const handleAddToCart = (item) => {
        setBudget(prevBudget => prevBudget - item.price);
        setCartItems(prevItems => {
            const newItems = [...prevItems, item];
            Cookies.set('cartItems', JSON.stringify(newItems)); // Save cart items to cookies
            return newItems;
        });
    };

    return (
        <BudgetContext.Provider value={{ budget, setBudget, handleAddToCart, cartItems }}>
            {children}
        </BudgetContext.Provider>
    );
}