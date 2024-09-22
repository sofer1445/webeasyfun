import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ייבוא useNavigate לצורך ניווט

// יצירת ה-context
export const UserContext = createContext();

// יצירת ה-provider
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [venue, setVenue] = useState(null);
    const [food, setFood] = useState(null);
    const [attraction, setAttraction] = useState(null);
    const [secret, setSecret] = useState(null);
    const navigate = useNavigate(); // יצירת משתנה לצורך ניווט

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedSecret = localStorage.getItem('secret');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedSecret) {
            setSecret(storedSecret);
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        setSecret(userData.secret);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('secret', userData.secret);
    };

    const logout = () => {
        setUser(null);
        setSecret(null);
        localStorage.removeItem('user');
        localStorage.removeItem('secret');
        localStorage.removeItem('budget');
        localStorage.removeItem('cartItems');
        localStorage.removeItem('eventData');
        localStorage.removeItem('isAuthenticated');

        // רענן עמוד
        window.location.reload();
    };

    return (
        <UserContext.Provider value={{ user, setUser, venue, setVenue, food, setFood, attraction, setAttraction, login, logout, secret, setSecret }}>
            {children}
        </UserContext.Provider>
    );
};
