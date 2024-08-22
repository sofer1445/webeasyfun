import React, { createContext, useState, useEffect } from 'react';

// יצירת ה-context
export const UserContext = createContext();

// יצירת ה-provider
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [venue, setVenue] = useState(null);
    const [food, setFood] = useState(null);
    const [attraction, setAttraction] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{ user, setUser, venue, setVenue, food, setFood, attraction, setAttraction, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};